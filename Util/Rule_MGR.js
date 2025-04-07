
var debug = require('debug')(require('path').basename(__filename));

const config = require('config');

var DataBase = require('../DataBase/DataBase.js');
var database = new DataBase();

const Rule_MGR_DB_Name = 'rule';

var rule_last_trigger_mode = [];

/* schema
Rule_Info = {
    user: <String>, //username 使用者名稱,
    rule_Name: <String>, //條件名稱
    source_device_ID: <String>, //來源裝置ID
    target_address_type: <String>, //目標位址類型: Device/Group/Broadcast
    target_address_ID: <String>, //目標位址ID 當target_address_type為Broadcast時此欄位無效
    lasttriggered: <UTC_Time>, //上次觸發時間,
    creationtime: <UTC_Time>, //建立時間,
    timestriggered: <Number>, //觸發次數
    enabled: <Bool>, //條件是否啟用
    conditions: [{
        source_endpoint: <String>, //源裝置子節點
        attribute: <String>, //比較屬性值
        operator: <String>, //判斷式
        value: <Number> or <Bool>, //判斷值 注意: operator 類型為"on change"時無效
    }],
    match_action: {
        command_topic: <String>, //目標topic: Water/Environment/Lighting
        command_type: <String>, //指令類型
        command: <String>, //操作指令
        param: <Object> //指令參數
    }
    mismatch_action: {
        command_topic: <String>, //目標topic: Water/Environment/Lighting
        command_type: <String>, //指令類型
        command: <String>, //操作指令
        param: <Object> //指令參數
    }
};
*/

/*
Operator	        Type	                Example Usage
eq	                equal	                Used for bool and int.
neq	                not equal	            Used for bool and int.
dx,ddx   	        on change	           Time (timestamps) int and bool values.
                                            Only dx or ddx is allowed, but not both.
                                            Triggers when value of button event is 
                                            changed or change of presence is detected.
stable,         	on change	            Time (timestamps) int and bool values.
not stable                                  An attribute has or has not changed for a given time. 
                                            Does not trigger a rule change.
                                            Not allowed on /config/utc and /config/localtime.
in, not in	        on change	            Current time is in or not in given time interval
                                            (only for /config/localtime, not UTC).
                                            “in” rule will be triggered on starttime and 
                                            “not in” rule will be triggered on endtime.
                                            Only one “in” operator is allowed in a rule.
                                            Multiple “not in” operators are allowed in a rule.
                                            Not allowed to be combined with “not in”.
lt, gt	            less than and           Allowed on int values.
                    greater than
lte, gte	        less than equal and     Allowed on int values.
                    greater than equal
*/

function do_Get_Operator_Type(op)
{
    var type = null;
    switch(op)
    {
        case "eq":
        case "neq":
            type = "equal";
            break;
        case "dx":
        case "ddx":
        case "stable":
        case "not stable":
        case "in":
        case "not in":
            type = "on change";
            break;
        case "lt":
            type = "less than";
            break;
        case "gt":
            type = "greater than";
            break;
        case "lte":
            type = "less than equal";
            break;
        case "gte":
            type = "greater than equal";
            break;
    }
    return type;
}

var Rule_MGR = function (){
    var self = this;

    self.Config_Rule = async function(device_Type, user, source_device_ID, rule_Name, target_address_type, target_address_ID, conditions, match_action, mismatch_action)
    {
        try{
            if(match_action==null || mismatch_action==null){
                return false;
            }
            
            if(source_device_ID==null || target_address_type==null){
                return false;
            }
            
            if(target_address_type!="Broadcast" && target_address_ID==null){
                return false;
            }
            if( target_address_type!="Device" &&
                target_address_type!="Group" &&
                target_address_type!="Broadcast"){
                return false;
            }

            if(target_address_type=="Broadcast" && target_address_ID!=null){
                target_address_ID = null;
            }
            
            var new_rule_match_action_doc = {};
            var new_rule_mismatch_action_doc = {};
            var new_rule_conditions_docs = [];

            if(match_action.command_topic==null || match_action.command_type==null || 
                match_action.command==null){
                    return false;
            }
            if(mismatch_action.command_topic==null || mismatch_action.command_type==null || 
                mismatch_action.command==null){
                    return false;
            }
            var match_action_command_param = {};
            var mismatch_action_command_param = {};

            if(match_action.param!=null){
                match_action_command_param = match_action.param;
            }
            if(mismatch_action.param!=null){
                mismatch_action_command_param = mismatch_action.param;
            }
            
            new_rule_match_action_doc = {
                command_topic: match_action.command_topic,
                command_type: match_action.command_type,
                command: match_action.command,
                param: match_action_command_param
            };
            new_rule_mismatch_action_doc = {
                command_topic: mismatch_action.command_topic,
                command_type: mismatch_action.command_type,
                command: mismatch_action.command,
                param: mismatch_action_command_param
            };

            for(var i = 0; i<conditions.length; i++)
            {
                if(conditions[i]==null){
                    continue;
                }
                if(conditions[i].source_endpoint==null || conditions[i].attribute==null || conditions[i].operator==null){
                    continue;
                }
                var op_type = do_Get_Operator_Type(conditions[i].operator);
                if(op_type==null || (op_type!="on change" && conditions[i].value==null)){
                    continue;
                }
                
                var rule_cond_value = null;

                if(op_type!="on change")
                {
                    rule_cond_value = conditions[i].value;
                }
                
                new_rule_conditions_docs.push({
                    source_endpoint: conditions[i].source_endpoint,
                    attribute: conditions[i].attribute,
                    operator: conditions[i].operator,
                    value: Number(rule_cond_value)
                });
            }

            var success = await database.DataBase_Open(Rule_MGR_DB_Name);
            if(success==false)
            {
                return null;
            }

            var exist = false;
            const db_query = { $or: [ { 'user': user, 'source_device_ID': source_device_ID }, { 'user': 'everyone', 'source_device_ID': source_device_ID } ] };

            success = await database.Database_EnsureIndex(Rule_MGR_DB_Name, device_Type, "source_device_ID", true);
            if(success==false)
            {
                database.DataBase_Close(Rule_MGR_DB_Name);
                return false;
            }

            var rule_doc = await database.Database_Find(Rule_MGR_DB_Name, device_Type, db_query, null);
            if(rule_doc!=null && rule_doc.length>0)
            {
                exist = true;
            }
            
            var current_date =  Date.now();
            var current_date_obj = new Date(current_date);
            
            if(exist)
            {
                if(rule_Name==null || rule_Name==''){
                    rule_Name = rule_doc[0].rule_Name;
                }
                
                var new_rule_doc = {
                    user: user,
                    rule_Name: rule_Name,
                    source_device_ID: source_device_ID,
                    target_address_type: target_address_type,
                    target_address_ID: target_address_ID,
                    lasttriggered: rule_doc[0].lasttriggered,
                    created_time: rule_doc[0].created_time,
                    timestriggered: rule_doc[0].timestriggered,
                    enabled: rule_doc[0].enabled,
                    conditions: new_rule_conditions_docs,
                    match_action: new_rule_match_action_doc,
                    mismatch_action: new_rule_mismatch_action_doc
                }
    
                success = await database.Database_Update(Rule_MGR_DB_Name, device_Type, db_query, new_rule_doc, false);
                if(success==false)
                {
                    database.DataBase_Close(Rule_MGR_DB_Name);
                    return false;
                }
            }
            else{
                if(rule_Name==null || rule_Name==''){
                    rule_Name = "New Rule";
                }

                var new_rule_doc = {
                    user: user,
                    rule_Name: rule_Name,
                    source_device_ID: source_device_ID,
                    target_address_type: target_address_type,
                    target_address_ID: target_address_ID,
                    lasttriggered: null,
                    created_time: current_date_obj.toISOString(),
                    timestriggered: 0,
                    enabled: true,
                    conditions: new_rule_conditions_docs,
                    match_action: new_rule_match_action_doc,
                    mismatch_action: new_rule_mismatch_action_doc
                }    
    
                success = await database.Database_Insert(Rule_MGR_DB_Name, device_Type, new_rule_doc);
                if(success==false)
                {
                    database.DataBase_Close(Rule_MGR_DB_Name);
                    return false;
                }
            }

            database.DataBase_Close(Rule_MGR_DB_Name);
            
            return true;
        }
        catch(e)
        {
            debug("[Rule_MGR] Config_Rule_Action() Error: " + e);
        }
    }

    self.Rule_Change_Name = async function(device_Type, user, source_device_ID, new_Name)
    {
        try{
            if(source_device_ID==null)
            {
                return false;
            }

            if(new_Name==null || new_Name=="")
            {
                return false;
            }

            var success = await database.DataBase_Open(Rule_MGR_DB_Name);
            if(success==false)
            {
                return false;
            }

            const db_query = { $or: [ { 'user': user, 'source_device_ID': source_device_ID }, { 'user': 'everyone', 'source_device_ID': source_device_ID } ] };

            var rule_doc = await database.Database_Find(Rule_MGR_DB_Name, device_Type, db_query, null);
            if(rule_doc==null || rule_doc.length==0)
            {
                database.DataBase_Close(Rule_MGR_DB_Name);
                return false;
            }

            var new_rule_inf = rule_doc[0];
            new_rule_inf.rule_Name = new_Name;

            success = await database.Database_Update(Rule_MGR_DB_Name, device_Type, db_query, new_rule_inf, false);
            if(success==false)
            {
                database.DataBase_Close(Rule_MGR_DB_Name);
                return false;
            }

            database.DataBase_Close(Rule_MGR_DB_Name);
            
            return true;
        }
        catch(e)
        {
            debug("[Rule_MGR] Rule_Change_Name() Error: " + e);
        }
    }

    self.Get_Rule_List = async function(device_Type, user)
    {
        try{
            var rsp_json = {};

            var success = await database.DataBase_Open(Rule_MGR_DB_Name);
            if(success==false)
            {
                return null;
            }

            const db_query = { $or: [ { 'user': user }, { 'user': 'everyone' } ] };

            var rule_docs = await database.Database_Find(Rule_MGR_DB_Name, device_Type, db_query, null);
            if(rule_docs==null || rule_docs.length==0)
            {
                database.DataBase_Close(Rule_MGR_DB_Name);
                return null;
            }

            database.DataBase_Close(Rule_MGR_DB_Name);

            rsp_json.rule_list = rule_docs;

            return rsp_json;
        }
        catch(e)
        {
            debug("[Rule_MGR] Get_Rule_List() Error: " + e);
        }
    }

    self.Get_Rule_Info = async function(device_Type, user, source_device_ID)
    {
        try{
            if(source_device_ID==null)
            {
                return null;
            }

            var success = await database.DataBase_Open(Rule_MGR_DB_Name);
            if(success==false)
            {
                return null;
            }

            const db_query = { $or: [ { 'user': user, 'source_device_ID': source_device_ID }, { 'user': 'everyone', 'source_device_ID': source_device_ID } ] };

            var rule_doc = await database.Database_Find(Rule_MGR_DB_Name, device_Type, db_query, null);
            if(rule_doc==null || rule_doc.length==0)
            {
                database.DataBase_Close(Rule_MGR_DB_Name);
                return null;
            }

            database.DataBase_Close(Rule_MGR_DB_Name);

            return rule_doc[0];
        }
        catch(e)
        {
            debug("[Rule_MGR] Get_Rule_Info() Error: " + e);
        }
    }
    
    self.Rule_Get_Conditions = async function(device_Type, user, source_device_ID)
    {
        try{
            if(source_device_ID==null)
            {
                return null;
            }

            var success = await database.DataBase_Open(Rule_MGR_DB_Name);
            if(success==false)
            {
                return null;
            }

            const db_query = { $or: [ { 'user': user, 'source_device_ID': source_device_ID }, { 'user': 'everyone', 'source_device_ID': source_device_ID } ] };

            var rule_doc = await database.Database_Find(Rule_MGR_DB_Name, device_Type, db_query, null);
            if(rule_doc==null || rule_doc.length==0)
            {
                database.DataBase_Close(Rule_MGR_DB_Name);
                return null;
            }

            database.DataBase_Close(Rule_MGR_DB_Name);

            return rule_doc[0].conditions;
        }
        catch(e)
        {
            debug("[Rule_MGR] Rule_Get_Conditions() Error: " + e);
        }
    }

    self.Rule_Get_Actions = async function(device_Type, user, source_device_ID)
    {
        try{
            if(source_device_ID==null)
            {
                return null;
            }

            var success = await database.DataBase_Open(Rule_MGR_DB_Name);
            if(success==false)
            {
                return null;
            }

            const db_query = { $or: [ { 'user': user, 'source_device_ID': source_device_ID }, { 'user': 'everyone', 'source_device_ID': source_device_ID } ] };

            var rule_doc = await database.Database_Find(Rule_MGR_DB_Name, device_Type, db_query, null);
            if(rule_doc==null || rule_doc.length==0)
            {
                database.DataBase_Close(Rule_MGR_DB_Name);
                return null;
            }

            database.DataBase_Close(Rule_MGR_DB_Name);

            return {
                match_action: rule_doc[0].match_action,
                mismatch_action: rule_doc[0].mismatch_action
            };
        }
        catch(e)
        {
            debug("[Rule_MGR] Rule_Get_Actions() Error: " + e);
        }
    }

    self.Rule_Get_Match_Action = async function(device_Type, user, source_device_ID)
    {
        try{
            if(source_device_ID==null)
            {
                return null;
            }

            var success = await database.DataBase_Open(Rule_MGR_DB_Name);
            if(success==false)
            {
                return null;
            }

            const db_query = { $or: [ { 'user': user, 'source_device_ID': source_device_ID }, { 'user': 'everyone', 'source_device_ID': source_device_ID } ] };

            var rule_doc = await database.Database_Find(Rule_MGR_DB_Name, device_Type, db_query, null);
            if(rule_doc==null || rule_doc.length==0)
            {
                database.DataBase_Close(Rule_MGR_DB_Name);
                return null;
            }

            database.DataBase_Close(Rule_MGR_DB_Name);

            return rule_doc[0].match_action;
        }
        catch(e)
        {
            debug("[Rule_MGR] Rule_Get_Match_Action() Error: " + e);
        }
    }

    self.Rule_Get_Mismatch_Action = async function(device_Type, user, source_device_ID)
    {
        try{
            if(source_device_ID==null)
            {
                return null;
            }

            var success = await database.DataBase_Open(Rule_MGR_DB_Name);
            if(success==false)
            {
                return null;
            }

            const db_query = { $or: [ { 'user': user, 'source_device_ID': source_device_ID }, { 'user': 'everyone', 'source_device_ID': source_device_ID } ] };

            var rule_doc = await database.Database_Find(Rule_MGR_DB_Name, device_Type, db_query, null);
            if(rule_doc==null || rule_doc.length==0)
            {
                database.DataBase_Close(Rule_MGR_DB_Name);
                return null;
            }

            database.DataBase_Close(Rule_MGR_DB_Name);

            return rule_doc[0].mismatch_action;
        }
        catch(e)
        {
            debug("[Rule_MGR] Rule_Get_Mismatch_Action() Error: " + e);
        }
    }

    self.Rule_Update_Conditions = async function(device_Type, user, source_device_ID, rule_conditions)
    {
        try{
            if(source_device_ID==null)
            {
                return false;
            }

            var new_rule_conditions_docs = [];

            for(var i = 0; i<rule_conditions.length; i++)
            {
                if(rule_conditions[i]==null){
                    continue;
                }
                if(rule_conditions[i].source_endpoint==null || rule_conditions[i].attribute==null || rule_conditions[i].operator==null){
                    continue;
                }
                var op_type = do_Get_Operator_Type(rule_conditions[i].operator);
                if(op_type==null || (op_type!="on change" && rule_conditions[i].value==null)){
                    continue;
                }
                
                var rule_cond_value = null;

                if(op_type!="on change")
                {
                    rule_cond_value = rule_conditions[i].value;
                }
                
                new_rule_conditions_docs.push({
                    source_endpoint: rule_conditions[i].source_endpoint,
                    attribute: rule_conditions[i].attribute,
                    operator: rule_conditions[i].operator,
                    value: Number(rule_cond_value)
                });
            }

            const db_query = { $or: [ { 'user': user, 'source_device_ID': source_device_ID }, { 'user': 'everyone', 'source_device_ID': source_device_ID } ] };

            var success = await database.DataBase_Open(Rule_MGR_DB_Name);
            if(success==false)
            {
                return false;
            }

            var rule_doc = await database.Database_Find(Rule_MGR_DB_Name, device_Type, db_query, null);
            if(rule_doc==null || rule_doc.length==0)
            {
                database.DataBase_Close(Rule_MGR_DB_Name);
                return false;
            }
            var new_rule_doc = rule_doc[0];

            if(new_rule_doc.action==null)
            {
                database.DataBase_Close(Rule_MGR_DB_Name);
                return false;
            }
            new_rule_doc.conditions = new_rule_conditions_docs;
            
            success = await database.Database_Update(Rule_MGR_DB_Name, device_Type, db_query, new_rule_doc, false);
            if(success==false)
            {
                database.DataBase_Close(Rule_MGR_DB_Name);
                return false;
            }

            database.DataBase_Close(Rule_MGR_DB_Name);

            return true;
        }
        catch(e)
        {
            debug("[Rule_MGR] Rule_Update_Conditions() Error: " + e);
        }
    }

    self.Rule_Update_Match_Action = async function(device_Type, user, source_device_ID, rule_action)
    {
        try{
            if(source_device_ID==null)
            {
                return false;
            }

            if(rule_action.command_topic==null || rule_action.command_type==null || 
                rule_action.command==null){
                    return false;
            }
            var command_param = {};
            if(rule_action.param!=null){
                command_param = rule_action.param;
            }
            
            var new_rule_action_doc = {
                command_topic: rule_action.command_topic,
                command_type: rule_action.command_type,
                command: rule_action.command,
                param: command_param
            };

            const db_query = { $or: [ { 'user': user, 'source_device_ID': source_device_ID }, { 'user': 'everyone', 'source_device_ID': source_device_ID } ] };

            var success = await database.DataBase_Open(Rule_MGR_DB_Name);
            if(success==false)
            {
                return false;
            }

            var rule_doc = await database.Database_Find(Rule_MGR_DB_Name, device_Type, db_query, null);
            if(rule_doc==null || rule_doc.length==0)
            {
                database.DataBase_Close(Rule_MGR_DB_Name);
                return false;
            }
            var new_rule_doc = rule_doc[0];

            if(new_rule_doc.action==null)
            {
                database.DataBase_Close(Rule_MGR_DB_Name);
                return false;
            }
            new_rule_doc.match_action = new_rule_action_doc;
            
            success = await database.Database_Update(Rule_MGR_DB_Name, device_Type, db_query, new_rule_doc, false);
            if(success==false)
            {
                database.DataBase_Close(Rule_MGR_DB_Name);
                return false;
            }

            database.DataBase_Close(Rule_MGR_DB_Name);

            return true;
        }
        catch(e)
        {
            debug("[Rule_MGR] Rule_Update_Match_Action() Error: " + e);
        }
    }

    self.Rule_Update_Mismatch_Action = async function(device_Type, user, source_device_ID, rule_action)
    {
        try{
            if(source_device_ID==null)
            {
                return false;
            }

            if(rule_action.command_topic==null || rule_action.command_type==null || 
                rule_action.command==null){
                    return false;
            }
            var command_param = {};
            if(rule_action.param!=null){
                command_param = rule_action.param;
            }
            
            var new_rule_action_doc = {
                command_topic: rule_action.command_topic,
                command_type: rule_action.command_type,
                command: rule_action.command,
                param: command_param
            };

            const db_query = { $or: [ { 'user': user, 'source_device_ID': source_device_ID }, { 'user': 'everyone', 'source_device_ID': source_device_ID } ] };

            var success = await database.DataBase_Open(Rule_MGR_DB_Name);
            if(success==false)
            {
                return false;
            }

            var rule_doc = await database.Database_Find(Rule_MGR_DB_Name, device_Type, db_query, null);
            if(rule_doc==null || rule_doc.length==0)
            {
                database.DataBase_Close(Rule_MGR_DB_Name);
                return false;
            }
            var new_rule_doc = rule_doc[0];

            if(new_rule_doc.action==null)
            {
                database.DataBase_Close(Rule_MGR_DB_Name);
                return false;
            }
            new_rule_doc.mismatch_action = new_rule_action_doc;
            
            success = await database.Database_Update(Rule_MGR_DB_Name, device_Type, db_query, new_rule_doc, false);
            if(success==false)
            {
                database.DataBase_Close(Rule_MGR_DB_Name);
                return false;
            }

            database.DataBase_Close(Rule_MGR_DB_Name);

            return true;
        }
        catch(e)
        {
            debug("[Rule_MGR] Rule_Update_Mismatch_Action() Error: " + e);
        }
    }

    self.Enable_Disable_Rule = async function(device_Type, user, source_device_ID, enabled)
    {
        try{
            if(source_device_ID==null)
            {
                return null;
            }

            var success = await database.DataBase_Open(Rule_MGR_DB_Name);
            if(success==false)
            {
                return false;
            }

            const db_query = { $or: [ { 'user': user, 'source_device_ID': source_device_ID }, { 'user': 'everyone', 'source_device_ID': source_device_ID } ] };

            var rule_doc = await database.Database_Find(Rule_MGR_DB_Name, device_Type, db_query, null);
            if(rule_doc==null || rule_doc.length==0)
            {
                database.DataBase_Close(Rule_MGR_DB_Name);
                return false;
            }

            rule_doc[0].enabled = enabled;

            success = await database.Database_Update(Rule_MGR_DB_Name, device_Type, db_query, rule_doc[0], false);
            if(success==false)
            {
                database.DataBase_Close(Rule_MGR_DB_Name);
                return false;
            }

            database.DataBase_Close(Rule_MGR_DB_Name);

            return true;
        }
        catch(e)
        {
            debug("[Rule_MGR] Enable_Disable_Rule() Error: " + e);
        }
    }

    self.Increase_Rule_Triggered_Times = async function(device_Type, user, source_device_ID)
    {
        try{
            if(source_device_ID==null)
            {
                return null;
            }

            var success = await database.DataBase_Open(Rule_MGR_DB_Name);
            if(success==false)
            {
                return false;
            }

            const db_query = { $or: [ { 'user': user, 'source_device_ID': source_device_ID }, { 'user': 'everyone', 'source_device_ID': source_device_ID } ] };

            var rule_doc = await database.Database_Find(Rule_MGR_DB_Name, device_Type, db_query, null);
            if(rule_doc==null || rule_doc.length==0)
            {
                database.DataBase_Close(Rule_MGR_DB_Name);
                return false;
            }

            var current_date =  Date.now();
            var current_date_obj = new Date(current_date);

            var timestriggered = rule_doc[0].timestriggered;
            timestriggered = timestriggered + 1;
            rule_doc[0].timestriggered = timestriggered;
            rule_doc[0].lasttriggered = current_date_obj.toISOString();

            success = await database.Database_Update(Rule_MGR_DB_Name, device_Type, db_query, rule_doc[0], false);
            if(success==false)
            {
                database.DataBase_Close(Rule_MGR_DB_Name);
                return false;
            }

            database.DataBase_Close(Rule_MGR_DB_Name);

            return true;
        }
        catch(e)
        {
            debug("[Rule_MGR] Enable_Disable_Rule() Error: " + e);
        }
    }

    self.Delete_Rule = async function(device_Type, user, source_device_ID)
    {
        try{
            if(source_device_ID==null)
            {
                return null;
            }

            var success = await database.DataBase_Open(Rule_MGR_DB_Name);
            if(success==false)
            {
                return false;
            }

            const db_query = { $or: [ { 'user': user, 'source_device_ID': source_device_ID }, { 'user': 'everyone', 'source_device_ID': source_device_ID } ] };

            var rule_doc = await database.Database_Find(Rule_MGR_DB_Name, device_Type, db_query, null);
            if(rule_doc==null || rule_doc.length==0)
            {
                database.DataBase_Close(Rule_MGR_DB_Name);
                return false;
            }

            success = await database.Database_Remove(Rule_MGR_DB_Name, device_Type, db_query, true);
            if(success==false)
            {
                database.DataBase_Close(Rule_MGR_DB_Name);
                return false;
            }

            database.DataBase_Close(Rule_MGR_DB_Name);

            return success;
        }
        catch(e)
        {
            debug("[Rule_MGR] Remove_Rule() Error: " + e);
        }
    }
    
    /*
    source_attribute_info_list = {
        source_endpoint: <Number>,
        attribute_name: <String>,
        current_value: <Number>
    }
    */
    self.Trigger_Rule_Action = async function(device_Type, user, source_device_ID, source_attribute_info_list, trigger_callback){
        try {
            if(trigger_callback==null){return false;}
            var rule_info = await this.Get_Rule_Info(device_Type, user, source_device_ID);
            if(rule_info==null){return false;}
            if(rule_info.enabled==false){return false;}

            var rule_conditions = rule_info.conditions;

            var rule_condition_map_attr_index_list = new Array(rule_conditions.length);
            for(var i = 0; i<rule_conditions.length; i++)
            {
                rule_condition_map_attr_index_list[i] = -1;
                for(var j = 0; j<source_attribute_info_list.length; j++)
                {
                    if(rule_conditions[i].source_endpoint==source_attribute_info_list[j].source_endpoint && 
                        rule_conditions[i].source_attribute_name==source_attribute_info_list[j].source_attribute_name)
                    {
                        rule_condition_map_attr_index_list[i] = j;
                        break;
                    }
                }
            }

            for(var i = 0; i<rule_condition_map_attr_index_list.length; i++)
            {
                if(rule_condition_map_attr_index_list[i]<0)
                {
                    return false;
                }
            }

            var rule_cond_match_status_list = [];
            for(var i = 0; i<rule_conditions.length; i++)
            {
                var map_attr_index = rule_condition_map_attr_index_list[i];
                var rule_condition_value = rule_conditions[i].value;
                var input_compare_value = source_attribute_info_list[map_attr_index].value;

                var current_trigger_mode = "mismatch";
                switch(rule_conditions[i].operator)
                {
                    case "eq":
                        if(input_compare_value==rule_condition_value)
                        {
                            current_trigger_mode = "match";
                        }
                        break;
                    case "neq":
                        if(input_compare_value!=rule_condition_value)
                        {
                            current_trigger_mode = "match";
                        }
                        break;
                    case "lt":
                        if(input_compare_value<rule_condition_value)
                        {
                            current_trigger_mode = "match";
                        }
                        break;
                    case "gt":
                        if(input_compare_value>rule_condition_value)
                        {
                            current_trigger_mode = "match";
                        }
                        break;
                    case "lte":
                        if(input_compare_value<=rule_condition_value)
                        {
                            current_trigger_mode = "match";
                        }
                        break;
                    case "gte":
                        if(input_compare_value>=rule_condition_value)
                        {
                            current_trigger_mode = "match";
                        }
                        break;
                }
                rule_cond_match_status_list.push(current_trigger_mode);
            }

            var current_condition_match_status = "match";
            for(var i = 0; i<rule_cond_match_status_list.length; i++)
            {
                if(rule_cond_match_status_list[i]=="mismatch")
                {
                    current_condition_match_status = "mismatch";
                    break;
                }
            }

            var trigger_state_change = false;
            if(rule_last_trigger_mode[source_device_ID]==null)
            {
                trigger_state_change = true;
                rule_last_trigger_mode[source_device_ID] = current_condition_match_status;
            }
            else{
                if(rule_last_trigger_mode[source_device_ID]!=current_condition_match_status)
                {
                    trigger_state_change = true;
                    rule_last_trigger_mode[source_device_ID] = current_condition_match_status;
                }
            }

            if(trigger_state_change)
            {
                var target_address_ID = rule_info.target_address_ID;

                var action_info = null;
                switch(current_condition_match_status)
                {
                    case "match":
                        action_info = rule_info.match_action;
                        break;
                    case "mismatch":
                        action_info = rule_info.mismatch_action;
                        break;
                }

                if(action_info==null)
                {
                    return false;
                }

                var command_topic = action_info.command_topic;
                var command_type = action_info.command_type;
                var command = action_info.command;
                var param = action_info.param;

                await self.Increase_Rule_Triggered_Times(device_Type, user, source_device_ID);

                trigger_callback(target_address_ID, command_topic, command_type, command, param);
            }
        }
        catch (e) {
            debug("[Bind_MGR] Trigger_Rule_Action() Error " + e);
        }
    };
}
module.exports = Rule_MGR;
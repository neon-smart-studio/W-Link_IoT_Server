
var debug = require('debug')(require('path').basename(__filename));

const config = require('config');

var DataBase = require('../DataBase/DataBase.js');
var database = new DataBase();

const Bind_MGR_DB_Name = 'bind';

/* schema
Bind_Info = {
    user: <String>, //username 使用者名稱,
    source_device_ID: <String>, //綁定源裝置ID
    source_device_endpoint: <String>, //源裝置子節點
    lasttriggered: <UTC_Time>, //上次觸發時間,
    creationtime: <UTC_Time>, //建立時間,
    timestriggered: <Number>, //觸發次數
    enabled: <Bool>, //綁定是否啟用
    target_address_type: <String>, //目標位址類型: Device/Group/Broadcast
    target_address_ID: <String>, //目標位址ID 當target_address_type為Broadcast時此欄位無效
    conditions: [<Object>], //動作條件
    command_topic: <String>, //目標topic: Water/Environment/Lighting
    command_type: <String>, //指令類型
    command: <String>, //操作指令
    param: <Object> //指令參數
};
*/

var Bind_MGR = function (){
    var self = this;

    self.Bind_Unbind_Resolve_Endpoint_Name = function(node_index, action)
    {
        return node_index+":"+action;
    }
    
    self.Config_Bind_Action = async function(device_Type, user, source_device_ID, source_device_endpoint, target_address_type, target_address_ID, target_action)
    {
        try{
            if( source_device_ID==null || target_address_type==null ){
                return false;
            }
            if(target_action==null)
            {
                return false;
            }
            if( target_action.command_topic==null || target_action.command_type==null || target_action.command==null ){
                return false;
            }
            var conditions = [];
            if(target_action.conditions!=null)
            {
                conditions = target_action.conditions;
            }
            var param = {};
            if(target_action.param!=null)
            {
                param = target_action.param;
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
            
            var current_date =  Date.now();
            var current_date_obj = new Date(current_date);
            
            var success = await database.DataBase_Open(Bind_MGR_DB_Name);
            if(success==false)
            {
                return false;
            }

            var exist = false;
            const db_query = { $or: [ { 'user': user, 'source_device_ID': source_device_ID, 'source_device_endpoint': source_device_endpoint }, { 'user': 'everyone', 'source_device_ID': source_device_ID, 'source_device_endpoint': source_device_endpoint } ] };

            success = await database.Database_EnsureIndex(Bind_MGR_DB_Name, device_Type, "source_device_ID", true);
            if(success==false)
            {
                database.DataBase_Close(Bind_MGR_DB_Name);
                return false;
            }

            var bind_doc = await database.Database_Find(Bind_MGR_DB_Name, device_Type, db_query, null);
            if(bind_doc!=null && bind_doc.length>0)
            {
                exist = true;
            }
            
            if(exist)
            {
                var update_bind_doc = {
                    user: user,
                    source_device_ID: source_device_ID,
                    source_device_endpoint: source_device_endpoint,
                    created_time: bind_doc[0].created_time,
                    lasttriggered: bind_doc[0].lasttriggered,
                    timestriggered: bind_doc[0].timestriggered,
                    enabled: bind_doc[0].enabled,
                    target_address_type: target_address_type,
                    target_address_ID: target_address_ID,
                    conditions: conditions,
                    command_topic: target_action.command_topic,
                    command_type: target_action.command_type,
                    command: target_action.command,
                    param: param
                }
    
                success = await database.Database_Update(Bind_MGR_DB_Name, device_Type, db_query, update_bind_doc, false);
                if(success==false)
                {
                    database.DataBase_Close(Device_MGR_DB_Name);
                    return false;
                }
            }
            else{
                var new_bind_doc = {
                    user: user,
                    source_device_ID: source_device_ID,
                    source_device_endpoint: source_device_endpoint,
                    created_time: current_date_obj.toISOString(),
                    lasttriggered: null,
                    timestriggered: 0,
                    enabled: true,
                    target_address_type: target_address_type,
                    target_address_ID: target_address_ID,
                    conditions: conditions,
                    command_topic: target_action.command_topic,
                    command_type: target_action.command_type,
                    command: target_action.command,
                    param: param
                }
    
                success = await database.Database_Insert(Bind_MGR_DB_Name, device_Type, new_bind_doc);
                if(success==false)
                {
                    database.DataBase_Close(Bind_MGR_DB_Name);
                    return false;
                }
            }

            database.DataBase_Close(Bind_MGR_DB_Name);
            
            return true;
        }
        catch(e)
        {
            debug("[Bind_MGR] Config_Bind_Action() Error: " + e);
        }
    }

    self.Remove_Bind_Action_Info = async function(device_Type, user, source_device_ID)
    {
        try{
            if(source_device_ID==null){
                return false;
            }

            var success = await database.DataBase_Open(Bind_MGR_DB_Name);
            if(success==false)
            {
                return false;
            }

            const db_query = { $or: [ { 'user': user, 'source_device_ID': source_device_ID }, { 'user': 'everyone', 'source_device_ID': source_device_ID } ] };

            success = await database.Database_Remove(Bind_MGR_DB_Name, device_Type, db_query, true);
            if(success==false)
            {
                database.DataBase_Close(Bind_MGR_DB_Name);
                return false;
            }

            database.DataBase_Close(Bind_MGR_DB_Name);

            return true;
        }
        catch(e)
        {
            debug("[Bind_MGR] Remove_Bind_Action_Info() Error: " + e);
        }
    }

    self.Get_Bind_Action_Info = async function(device_Type, user, source_device_ID, source_device_endpoint)
    {
        try{
            if(source_device_ID==null || source_device_endpoint==null){
                return null;
            }
            
            var success = await database.DataBase_Open(Bind_MGR_DB_Name);
            if(success==false)
            {
                return null;
            }

            const db_query = { $or: [ { 'user': user, 'source_device_ID': source_device_ID, 'source_device_endpoint': source_device_endpoint }, { 'user': 'everyone', 'source_device_ID': source_device_ID, 'source_device_endpoint': source_device_endpoint } ] };

            var bind_doc = await database.Database_Find(Bind_MGR_DB_Name, device_Type, db_query, null);
            if(bind_doc==null || bind_doc.length==0)
            {
                database.DataBase_Close(Bind_MGR_DB_Name);
                return null;
            }

            database.DataBase_Close(Bind_MGR_DB_Name);

            return bind_doc[0];
        }
        catch(e)
        {
            debug("[Bind_MGR] Get_Bind_Action() Error: " + e);
        }
    }
    
    self.Enable_Disable_Bind_Action = async function(device_Type, user, source_device_ID, source_device_endpoint, enabled)
    {
        try{
            if(source_device_ID==null || source_device_endpoint==null){
                return false;
            }
            
            var success = await database.DataBase_Open(Bind_MGR_DB_Name);
            if(success==false)
            {
                return false;
            }

            const db_query = { $or: [ { 'user': user, 'source_device_ID': source_device_ID, 'source_device_endpoint': source_device_endpoint }, { 'user': 'everyone', 'source_device_ID': source_device_ID, 'source_device_endpoint': source_device_endpoint } ] };

            var bind_doc = await database.Database_Find(Bind_MGR_DB_Name, device_Type, db_query, null);
            if(bind_doc==null || bind_doc.length==0)
            {
                database.DataBase_Close(Bind_MGR_DB_Name);
                return false;
            }

            bind_doc[0].enabled = enabled;

            success = await database.Database_Update(Bind_MGR_DB_Name, device_Type, db_query, bind_doc[0], false);
            if(success==false)
            {
                database.DataBase_Close(Bind_MGR_DB_Name);
                return false;
            }

            database.DataBase_Close(Bind_MGR_DB_Name);

            return true;
        }
        catch(e)
        {
            debug("[Bind_MGR] Enable_Disable_Bind() Error: " + e);
        }
    }

    self.Increase_Bind_Action_Triggered_Times = async function(device_Type, user, source_device_ID, source_device_endpoint)
    {
        try{
            if(source_device_ID==null || source_device_endpoint==null){
                return false;
            }
            
            var success = await database.DataBase_Open(Bind_MGR_DB_Name);
            if(success==false)
            {
                return false;
            }

            const db_query = { $or: [ { 'user': user, 'source_device_ID': source_device_ID, 'source_device_endpoint': source_device_endpoint }, { 'user': 'everyone', 'source_device_ID': source_device_ID, 'source_device_endpoint': source_device_endpoint } ] };

            var bind_doc = await database.Database_Find(Bind_MGR_DB_Name, device_Type, db_query, null);
            if(bind_doc==null || bind_doc.length==0)
            {
                database.DataBase_Close(Bind_MGR_DB_Name);
                return false;
            }

            var current_date =  Date.now();
            var current_date_obj = new Date(current_date);

            var timestriggered = bind_doc[0].timestriggered;
            timestriggered = timestriggered + 1;
            bind_doc[0].timestriggered = timestriggered;
            bind_doc[0].lasttriggered = current_date_obj.toISOString();

            success = await database.Database_Update(Bind_MGR_DB_Name, device_Type, db_query, bind_doc[0], false);
            if(success==false)
            {
                database.DataBase_Close(Bind_MGR_DB_Name);
                return false;
            }

            database.DataBase_Close(Bind_MGR_DB_Name);

            return true;
        }
        catch(e)
        {
            debug("[Bind_MGR] Increase_Bind_Triggered_Times() Error: " + e);
        }
    }
    
    self.Trigger_Bind_Action = async function(device_Type, user, source_device_ID, source_device_endpoint, trigger_callback){
        try {
            if(trigger_callback==null){return false;}
            var action_info = await self.Get_Bind_Action_Info(device_Type, user, source_device_ID, source_device_endpoint);
            
            if(action_info==null){return false;}
            if(action_info.enabled==false){return false;}

            var target_address_ID = action_info.target_address_ID;
            var command_topic = action_info.command_topic;
            var command_type = action_info.command_type;
            var command = action_info.command;
            var param = action_info.param;

            if(command=="default"){return false;}

            await self.Increase_Bind_Action_Triggered_Times(device_Type, user, source_device_ID, source_device_endpoint);

            trigger_callback(target_address_ID, command_topic, command_type, command, param);
        }
        catch (e) {
            debug("[Bind_MGR] Trigger_Bind_Action() Error " + e);
        }
    };
}
module.exports = Bind_MGR;

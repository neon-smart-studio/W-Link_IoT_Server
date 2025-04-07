
var debug = require('debug')(require('path').basename(__filename));

var Rule_MGR = require('../../Util/Rule_MGR.js');
var rule_mgr = new Rule_MGR();

function Rules_Check_Condition_Params(rule_condition)
{
    if(rule_condition.source_endpoint==null ||
        rule_condition.attribute==null || 
        rule_condition.operator==null){
        return false;
    }
    return true;
}
function Rules_Check_Action_Params(rule_action)
{
    if(rule_action.command_topic==null || rule_action.command_type==null || 
        rule_action.command==null){
        return false;
    }
    return true;
}

var Rules_WebSocket = function (){
    var self = this;
    
    self.Process_Rules_Topic_WebSocket_POST_Message = async function(username, post_rules_json_data)
    {
        try{
            if(post_rules_json_data.command!=null){
                switch(post_rules_json_data.command){
                    case "Config Rule Action":
                        if(post_rules_json_data.source_device_type!=null &&
                            post_rules_json_data.source_device_ID!=null &&
                            post_rules_json_data.target_address_type!=null &&
                            post_rules_json_data.target_address_ID!=null &&
                            post_rules_json_data.rule_conditions!=null &&
                            post_rules_json_data.rule_match_action!=null &&
                            post_rules_json_data.rule_mismatch_action!=null)
                        {
                            var new_rule_name = null;
                            if(post_rules_json_data.rule_Name!=null)
                            {
                                new_rule_name = post_rules_json_data.rule_Name;
                            }

                            var param_error = false;
                            var rule_conditions = post_rules_json_data.rule_conditions;
                            var rule_match_action = post_rules_json_data.rule_match_action;
                            var rule_mismatch_action = post_rules_json_data.rule_mismatch_action;

                            for(var i = 0; i<rule_conditions.length; i++)
                            {
                                if(!Rules_Check_Condition_Params(rule_conditions[i]))
                                {
                                    param_error = true;
                                    break;
                                }
                            }

                            if(!Rules_Check_Action_Params(rule_match_action))
                            {
                                param_error = true;
                                break;
                            }
                            if(!Rules_Check_Action_Params(rule_mismatch_action))
                            {
                                param_error = true;
                                break;
                            }

                            if(!param_error)
                            {
                                await rule_mgr.Config_Rule(post_rules_json_data.source_device_type, username, 
                                                            post_rules_json_data.source_device_ID, new_rule_name, 
                                                            post_rules_json_data.target_address_type, post_rules_json_data.target_address_ID,
                                                            rule_conditions, rule_match_action, rule_mismatch_action);
                            }
                        }
                        break;
                    case "Rule Change Name":
                        if(post_rules_json_data.source_device_type!=null &&
                            post_rules_json_data.source_device_ID!=null &&
                            post_rules_json_data.new_rule_Name!=null)
                        {
                            await rule_mgr.Rule_Change_Name(post_rules_json_data.source_device_type, username, 
                                post_rules_json_data.source_device_ID, post_rules_json_data.new_rule_Name);
                        }
                        break;
                    case "Rule Update Conditions":
                        if(post_rules_json_data.source_device_type!=null &&
                            post_rules_json_data.source_device_ID!=null &&
                            post_rules_json_data.new_condition_info!=null)
                        {
                            var param_error = false;
                            var rule_conditions = post_rules_json_data.rule_conditions;

                            for(var i = 0; i<rule_conditions.length; i++)
                            {
                                if(!Rules_Check_Condition_Params(rule_conditions[i]))
                                {
                                    param_error = true;
                                    break;
                                }
                            }

                            if(!param_error)
                            {
                                await rule_mgr.Rule_Update_Conditions(post_rules_json_data.source_device_type, username, 
                                                                        post_rules_json_data.source_device_ID, 
                                                                        post_rules_json_data.rule_conditions);
                            }
                        }
                        break;
                    case "Rule Update Match Action":
                        if(post_rules_json_data.source_device_type!=null &&
                            post_rules_json_data.source_device_ID!=null &&
                            post_rules_json_data.new_match_action_info!=null)
                        {
                            if(Rules_Check_Action_Params(post_rules_json_data.new_match_action_info))
                            {
                                await rule_mgr.Rule_Update_Match_Action(post_rules_json_data.source_device_type, username, 
                                                                        post_rules_json_data.source_device_ID, 
                                                                        post_rules_json_data.rule_action_index, 
                                                                        post_rules_json_data.new_match_action_info);
                            }
                        }
                        break;
                    case "Rule Update Mismatch Action":
                        if(post_rules_json_data.source_device_type!=null &&
                            post_rules_json_data.source_device_ID!=null &&
                            post_rules_json_data.new_mismatch_action_info!=null)
                        {
                            if(Rules_Check_Action_Params(post_rules_json_data.new_mismatch_action_info))
                            {
                                await rule_mgr.Rule_Update_Mismatch_Action(post_rules_json_data.source_device_type, username, 
                                                                            post_rules_json_data.source_device_ID, 
                                                                            post_rules_json_data.rule_action_index, 
                                                                            post_rules_json_data.new_mismatch_action_info);
                            }
                        }
                        break;
                    case "Enable/Disable Rule":
                        if(post_rules_json_data.source_device_type!=null &&
                            post_rules_json_data.source_device_ID!=null &&
                            post_rules_json_data.enabled!=null)
                        {
                            await rule_mgr.Enable_Disable_Rule(post_rules_json_data.source_device_type, username, 
                                                                post_rules_json_data.source_device_ID, 
                                                                post_rules_json_data.enabled);
                        }
                        break;
                    case "Delete Rule":
                        if(post_rules_json_data.source_device_type!=null &&
                            post_rules_json_data.source_device_ID!=null)
                        {
                            await rule_mgr.Delete_Rule(post_rules_json_data.source_device_type, username, 
                                                        post_rules_json_data.source_device_ID);
                        }
                        break;
                }
            }
        }
        catch(e)
        {
            debug('[Rules_WebSocket] Process_Rules_WebSocket_GET_Message() Error ' + e);
        }
    }

    self.Process_Rules_Topic_WebSocket_GET_Message = async function(username, get_rules_json_data)
    {
        try{
            var rsp_json = null;
            if(get_rules_json_data.command!=null){
                switch(get_rules_json_data.command){
                    case "Get Rule List":
                        if(get_rules_json_data.source_device_type!=null)
                        {
                            rsp_json = await rule_mgr.Get_Rule_List(get_rules_json_data.source_device_type, username);
                        }
                        break;
                    case "Get Rule Info":
                        if(get_rules_json_data.source_device_type!=null &&
                            get_rules_json_data.source_device_ID!=null)
                        {
                            rsp_json = await rule_mgr.Get_Rule_Info(get_rules_json_data.source_device_type, username, get_rules_json_data.source_device_ID);
                        }
                        break;
                    case "Get Rule Conditions":
                        if(get_rules_json_data.source_device_type!=null &&
                            get_rules_json_data.source_device_ID!=null)
                        {
                            rsp_json = await rule_mgr.Rule_Get_Conditions(get_rules_json_data.source_device_type, username, 
                                                                            get_rules_json_data.source_device_ID);
                        }
                        break;
                    case "Get Rule Actions":
                        if(get_rules_json_data.source_device_type!=null &&
                            get_rules_json_data.source_device_ID!=null)
                        {
                            rsp_json = await rule_mgr.Rule_Get_Actions(get_rules_json_data.source_device_type, username, 
                                                                            get_rules_json_data.source_device_ID);
                        }
                        break;
                    case "Get Rule Match Action":
                        if(get_rules_json_data.source_device_type!=null &&
                            get_rules_json_data.source_device_ID!=null)
                        {
                            rsp_json = await rule_mgr.Rule_Get_Match_Action(get_rules_json_data.source_device_type, username, 
                                                                            get_rules_json_data.source_device_ID);
                        }
                        break;
                    case "Get Rule Mismatch Action":
                        if(get_rules_json_data.source_device_type!=null &&
                            get_rules_json_data.source_device_ID!=null)
                        {
                            rsp_json = await rule_mgr.Rule_Get_Mismatch_Action(get_rules_json_data.source_device_type, username, 
                                                                                get_rules_json_data.source_device_ID);
                        }
                        break;
                }
            }
            return rsp_json;
        }
        catch(e)
        {
            debug('[Rules_WebSocket] Process_Rules_WebSocket_GET_Message() Error ' + e);
        }
    }
}
module.exports = Rules_WebSocket;
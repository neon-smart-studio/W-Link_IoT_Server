
var debug = require('debug')(require('path').basename(__filename));

var Scene_Switch_API = require('../../../Device_MGMT/Accessories/Scene_Switch_API.js');
var scene_switch_api = new Scene_Switch_API();

var Scene_Switch_WebSocket = function (){
    var self = this;
    
    self.Process_Scene_Switch_WebSocket_POST_Message = async function(username, post_scene_switch_json_data)
    {
        try{
            if(post_scene_switch_json_data.command!=null){
                switch(post_scene_switch_json_data.command){
                }
            }
        }
        catch(e)
        {
            debug('[Scene_Switch_WebSocket] Process_Scene_Switch_WebSocket_POST_Message() Error ' + e);
        }
    }

    self.Process_Scene_Switch_WebSocket_GET_Message = async function(username, get_scene_switch_json_data)
    {
        try{
            var rsp_json = null;
            if(get_scene_switch_json_data.command!=null){
                switch(get_scene_switch_json_data.command){
                    case "Get Scene Switch Support Actions":
                        if(get_scene_switch_json_data.device_ID!=null){
                            var get_rsp_json = await scene_switch_api.Get_Scene_Switch_Support_Actions(username, get_scene_switch_json_data.device_ID);
                            rsp_json = {
                                "device_ID": get_scene_switch_json_data.device_ID,
                                "support_actions": get_rsp_json.support_actions
                            };
                        }
                        break;
                    case "Get Num Of Scene Switch":
                        if(get_scene_switch_json_data.device_ID!=null){
                            var get_rsp_json = await scene_switch_api.Get_Num_Of_Scene_Switch(get_scene_switch_json_data.device_ID);
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_scene_switch_json_data.device_ID
                                };
                            }
                            else{
                                rsp_json = {
                                    "timeout": false,
                                    "device_ID": get_scene_switch_json_data.device_ID,
                                    "num_of_scene_switch": get_rsp_json.num_of_scene_switch
                                };
                            }
                        }
                        break;
                    case "Get Scene Switch Individual Switch Info":
                        if(get_scene_switch_json_data.device_ID!=null && get_scene_switch_json_data.switch_index!=null){
                            get_rsp_json = await scene_switch_api.Get_Scene_Switch_Individual_Switch_Info(get_scene_switch_json_data.device_ID, get_scene_switch_json_data.switch_index);
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_scene_switch_json_data.device_ID
                                };
                            }
                            else{
                                var last_action = "None";
                                if(get_rsp_json.last_action)
                                {
                                    last_action = get_rsp_json.last_action;
                                }
                                rsp_json = {
                                    "timeout": false,
                                    "device_ID": get_onoff_socket_json_data.device_ID,
                                    "switch_index": get_rsp_json.switch_index,
                                    "support_actions": get_rsp_json.support_actions,
                                    "last_action": last_action
                                };
                            }
                        }
                        break;
                    case "Get Scene Switch All Switch Info":
                        if(get_scene_switch_json_data.device_ID!=null){
                            get_rsp_json = await scene_switch_api.Get_Scene_Switch_All_Switch_Info(get_scene_switch_json_data.device_ID);
                            var switch_info_list = [];
                            
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_scene_switch_json_data.device_ID
                                };
                            }
                            else{
                                var last_action;

                                for(var i = 0; i<get_rsp_json.num_of_scene_switch; i++)
                                {
                                    last_action = "None";
                                    if(get_rsp_json.individual_switch_info[i].last_action)
                                    {
                                        last_action = get_rsp_json.individual_switch_info[i].last_action;
                                    }
                                    switch_info_list.push({
                                        "switch_index": get_rsp_json.individual_switch_info[i].switch_index,
                                        "support_actions": get_rsp_json.individual_switch_info[i].support_actions,
                                        "last_action": last_action
                                    });
                                }
                                rsp_json = {
                                    "timeout": false,
                                    "device_ID": get_scene_switch_json_data.device_ID,
                                    "num_of_scene_switch": get_rsp_json.num_of_scene_switch,
                                    "switch_info_list": switch_info_list
                                };
                            }
                        }
                        break;
                }
            }
            return rsp_json;
        }
        catch(e)
        {
            debug('[Scene_Switch_WebSocket] Process_Scene_Switch_WebSocket_GET_Message() Error ' + e);
        }
    }
}
module.exports = Scene_Switch_WebSocket;
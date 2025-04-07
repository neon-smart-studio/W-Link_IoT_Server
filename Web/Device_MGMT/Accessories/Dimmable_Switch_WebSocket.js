
var debug = require('debug')(require('path').basename(__filename));

var Dimmable_Switch_API = require('../../../Device_MGMT/Accessories/Dimmable_Switch_API.js');
var dimmable_switch_api = new Dimmable_Switch_API();

var Dimmable_Switch_WebSocket = function (){
    var self = this;
    
    self.Process_Dimmable_Switch_WebSocket_POST_Message = async function(username, post_dimmable_switch_json_data)
    {
        try{
            if(post_dimmable_switch_json_data.command!=null){
                switch(post_dimmable_switch_json_data.command){
                }
            }
        }
        catch(e)
        {
            debug('[Accessories_WebSocket] Process_Dimmable_Switch_WebSocket_POST_Message() Error ' + e);
        }
    }

    self.Process_Dimmable_Switch_WebSocket_GET_Message = async function(username, get_dimmable_switch_json_data)
    {
        try{
            var rsp_json = null;
            if(get_dimmable_switch_json_data.command!=null){
                switch(get_dimmable_switch_json_data.command){
                    case "Get Dimmable Switch Support Actions":
                        if(get_dimmable_switch_json_data.device_ID!=null){
                            var get_rsp_json = await dimmable_switch_api.Get_Dimmable_Switch_Support_Actions(username, get_dimmable_switch_json_data.device_ID);
                            rsp_json = {
                                "device_ID": get_dimmable_switch_json_data.device_ID,
                                "support_actions": get_rsp_json.support_actions
                            };
                        }
                        break;
                    case "Get Num Of Dimmable Switch":
                        if(get_dimmable_switch_json_data.device_ID!=null){
                            var get_rsp_json = await dimmable_switch_api.Get_Num_Of_Dimmable_Switch(get_dimmable_switch_json_data.device_ID);
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_dimmable_switch_json_data.device_ID
                                };
                            }
                            else{
                                rsp_json = {
                                    "timeout": false,
                                    "device_ID": get_dimmable_switch_json_data.device_ID,
                                    "num_of_dimmable_switch": get_rsp_json.num_of_dimmable_switch
                                };
                            }
                        }
                        break;
                    case "Get Dimmable Switch Individual Switch Status":
                        if(get_dimmable_switch_json_data.device_ID!=null && get_dimmable_switch_json_data.switch_index!=null){
                            var get_rsp_json = await dimmable_switch_api.Get_Dimmable_Switch_Individual_Switch_Status(get_dimmable_switch_json_data.switch_index, get_dimmable_switch_json_data.device_ID);
                            
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_dimmable_switch_json_data.device_ID
                                };
                            }
                            else{
                                rsp_json = {
                                    "timeout": false,
                                    "device_ID": get_dimmable_switch_json_data.device_ID,
                                    "switch_index": get_rsp_json.sw_index,
                                    "on_off": get_rsp_json.on_off,
                                    "level": get_rsp_json.level
                                };
                            }
                        }
                        break;
                    case "Get Dimmable Switch All Switch Status":
                        if(get_dimmable_switch_json_data.device_ID!=null){
                            var get_rsp_json = await dimmable_switch_api.Dimmable_Switch_Get_All_Status(get_dimmable_switch_json_data.device_ID);
                            var switch_status_list = [];

                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_dimmable_switch_json_data.device_ID
                                };
                            }
                            else{
                                for(var i = 0; i<get_rsp_json.num_of_dimmable_switch; i++)
                                {
                                    switch_status_list.push({
                                        "switch_index": get_rsp_json.individual_switch_status[i].sw_index,
                                        "on_off": get_rsp_json.individual_switch_status[i].on_off,
                                        "level": get_rsp_json.individual_switch_status[i].level
                                    });
                                }
                                rsp_json = {
                                    "timeout": false,
                                    "device_ID": get_dimmable_switch_json_data.device_ID,
                                    "num_of_dimmable_switch": get_rsp_json.num_of_dimmable_switch,
                                    "switch_status_list": switch_status_list
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
            debug('[Accessories_WebSocket] Process_Dimmable_Switch_WebSocket_GET_Message() Error ' + e);
        }
    }
}
module.exports = Dimmable_Switch_WebSocket;
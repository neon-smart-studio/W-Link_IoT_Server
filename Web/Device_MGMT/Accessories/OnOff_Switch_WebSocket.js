
var debug = require('debug')(require('path').basename(__filename));

var OnOff_Switch_API = require('../../../Device_MGMT/Accessories/OnOff_Switch_API.js');
var onoff_switch_api = new OnOff_Switch_API();

var OnOff_Switch_WebSocket = function (){
    var self = this;
    
    self.Process_OnOff_Switch_WebSocket_POST_Message = async function(username, post_onoff_switch_json_data)
    {
        try{
            if(post_onoff_switch_json_data.command!=null){
                switch(post_onoff_switch_json_data.command){
                }
            }
        }
        catch(e)
        {
            debug('[OnOff_Switch_WebSocket] Process_OnOff_Switch_WebSocket_POST_Message() Error ' + e);
        }
    }

    self.Process_OnOff_Switch_WebSocket_GET_Message = async function(username, get_onoff_switch_json_data)
    {
        try{
            var rsp_json = null;
            if(get_onoff_switch_json_data.command!=null){
                switch(get_onoff_switch_json_data.command){
                    case "Get On Off Switch Support Actions":
                        if(get_onoff_switch_json_data.device_ID!=null){
                            var get_rsp_json = await onoff_switch_api.Get_OnOff_Switch_Support_Actions(username, get_onoff_switch_json_data.device_ID);
                            rsp_json = {
                                "device_ID": get_onoff_switch_json_data.device_ID,
                                "support_actions": get_rsp_json.support_actions
                            };
                        }
                        break;
                    case "Get Num Of On Off Switch":
                        if(get_onoff_switch_json_data.device_ID!=null){
                            var get_rsp_json = await onoff_switch_api.Get_Num_Of_OnOff_Switch(get_onoff_switch_json_data.device_ID);
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_onoff_switch_json_data.device_ID
                                };
                            }
                            else{
                                rsp_json = {
                                    "timeout": false,
                                    "device_ID": get_onoff_switch_json_data.device_ID,
                                    "num_of_onoff_switch": get_rsp_json.num_of_onoff_switch
                                };
                            }
                        }
                        break;
                    case "Get On Off Switch Individual Switch Status":
                        if(get_onoff_switch_json_data.device_ID!=null && get_onoff_switch_json_data.switch_index!=null){
                            var get_rsp_json = await onoff_switch_api.GET_OnOff_Switch_Individual_Switch_Status(get_onoff_switch_json_data.switch_index, get_onoff_switch_json_data.device_ID);
                            var switch_status_list = [];
                            
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_onoff_switch_json_data.device_ID
                                };
                            }
                            else{
                                rsp_json = {
                                    "timeout": false,
                                    "device_ID": get_onoff_switch_json_data.device_ID,
                                    "switch_index": get_rsp_json.sw_index,
                                    "on_off": get_rsp_json.on_off
                                };
                            }
                        }
                        break;
                    case "Get On Off Switch All Switch Status":
                        if(get_onoff_switch_json_data.device_ID!=null){
                            var get_rsp_json = await onoff_switch_api.OnOff_Switch_Get_All_Status(get_onoff_switch_json_data.device_ID);
                            var switch_status_list = [];
                            
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_onoff_switch_json_data.device_ID
                                };
                            }
                            else{
                                for(var i = 0; i<get_rsp_json.num_of_onoff_switch; i++)
                                {
                                    switch_status_list.push({
                                        "switch_index": get_rsp_json.individual_switch_status[i].sw_index,
                                        "on_off": get_rsp_json.individual_switch_status[i].on_off
                                    });
                                }
                                rsp_json = {
                                    "timeout": false,
                                    "device_ID": get_onoff_switch_json_data.device_ID,
                                    "num_of_onoff_switch": get_rsp_json.num_of_onoff_switch,
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
            debug('[OnOff_Switch_WebSocket] Process_OnOff_Switch_WebSocket_GET_Message() Error ' + e);
        }
    }
}
module.exports = OnOff_Switch_WebSocket;
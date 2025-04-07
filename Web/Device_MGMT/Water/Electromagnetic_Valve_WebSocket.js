
var debug = require('debug')(require('path').basename(__filename));

var EM_Valve_API = require('../../../Device_MGMT/Water/Electromagnetic_Valve_API.js');
var em_valve_api = new EM_Valve_API();

var EM_Valve_WebSocket = function (){
    var self = this;
    
    self.Process_EM_Valve_WebSocket_POST_Message = async function(username, post_em_valve_json_data)
    {
        try{
            if(post_em_valve_json_data.command!=null){
                switch(post_em_valve_json_data.command){
                    case "Set Main Switch En/Dis State":
                        if(post_em_valve_json_data.device_ID!=null && post_em_valve_json_data.enabled!=null){
                            await em_valve_api.EM_Valve_Main_Switch_Enable_Disable(post_em_valve_json_data.device_ID, post_em_valve_json_data.enabled);
                        }
                        break;
                    case "Set Main Switch On/Off State":
                        if(post_em_valve_json_data.device_ID!=null && post_em_valve_json_data.on_off!=null){
                            await em_valve_api.EM_Valve_Main_Switch_On_Off(post_em_valve_json_data.device_ID, post_em_valve_json_data.on_off);
                        }
                        break;
                    case "Set Individual Switch En/Dis State":
                        if(post_em_valve_json_data.device_ID!=null && post_em_valve_json_data.switch_index!=null && post_em_valve_json_data.enabled!=null){
                            await em_valve_api.EM_Valve_Individual_Switch_Enable_Disable(post_em_valve_json_data.device_ID, post_em_valve_json_data.switch_index, post_em_valve_json_data.enabled);
                        }
                        break;
                    case "Set Individual Switch On/Off State":
                        if(post_em_valve_json_data.device_ID!=null && post_em_valve_json_data.switch_index!=null && post_em_valve_json_data.on_off!=null){
                            await em_valve_api.EM_Valve_Individual_Switch_On_Off(post_em_valve_json_data.device_ID, post_em_valve_json_data.switch_index, post_em_valve_json_data.on_off);
                        }
                        break;
                }
            }
        }
        catch(e)
        {
            debug('[EM_Valve_WebSocket] Process_EM_Valve_WebSocket_POST_Message() Error ' + e);
        }
    }

    self.Process_EM_Valve_WebSocket_GET_Message = async function(username, get_em_valve_json_data)
    {
        try{
            var rsp_json = null;
            if(get_em_valve_json_data.command!=null){
                switch(get_em_valve_json_data.command){
                    case "Get Num Of Electromagnetic Valve Switch":
                        if(get_em_valve_json_data.device_ID!=null){
                            var get_rsp_json = await em_valve_api.EM_Valve_Get_Num_Of_Switch(get_em_valve_json_data.device_ID);
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_em_valve_json_data.device_ID
                                };
                            }
                            else{
                                rsp_json = {
                                    "timeout": false,
                                    "device_ID": get_em_valve_json_data.device_ID,
                                    "num_of_electromagnetic_valve": get_rsp_json.num_of_electromagnetic_valve
                                };
                            }  
                        }
                        break;
                    case "Get Electromagnetic Valve Main Switch Status":
                        if(get_em_valve_json_data.device_ID!=null){
                            var get_rsp_json = await em_valve_api.EM_Valve_Get_Main_Switch_Status(get_em_valve_json_data.device_ID);
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_em_valve_json_data.device_ID
                                };
                            }
                            else{
                                rsp_json = {
                                    "timeout": false,
                                    "device_ID": get_em_valve_json_data.device_ID,
                                    "enabled": get_rsp_json.enabled,
                                    "on_off": get_rsp_json.on_off
                                };
                            }
                        }
                        break;
                    case "Get Electromagnetic Valve Individual Switch Status":
                        if(get_em_valve_json_data.device_ID!=null && get_em_valve_json_data.sw_index!=null){
                            var get_rsp_json = await em_valve_api.EM_Valve_Get_Individual_Switch_Status(get_em_valve_json_data.device_ID, get_em_valve_json_data.sw_index);
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_em_valve_json_data.device_ID
                                };
                            }
                            else{
                                rsp_json = {
                                    "timeout": false,
                                    "device_ID": get_em_valve_json_data.device_ID,
                                    "switch_index": get_rsp_json.sw_index,
                                    "enabled": get_rsp_json.enabled,
                                    "on_off": get_rsp_json.on_off
                                };
                            }
                        }
                        break;
                    case "Get Electromagnetic Valve All Switch Status":
                        if(get_em_valve_json_data.device_ID!=null){
                            var get_rsp_json = await em_valve_api.EM_Valve_Get_All_Switch_Status(get_em_valve_json_data.device_ID);
                            var switch_status_list = [];

                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_em_valve_json_data.device_ID
                                };
                            }
                            else{
                                for(var i = 0; i<get_rsp_json.num_of_electromagnetic_valve; i++)
                                {
                                    switch_status_list.push({
                                        "switch_index": get_rsp_json.individual_switch_status[i].sw_index,
                                        "enabled": get_rsp_json.individual_switch_status[i].enabled,
                                        "on_off": get_rsp_json.individual_switch_status[i].on_off
                                    });
                                }
                                rsp_json = {
                                    "timeout": false,
                                    "device_ID": get_em_valve_json_data.device_ID,
                                    "main_switch_status":{
                                        "enabled": get_rsp_json.main_switch_status.enabled,
                                        "on_off": get_rsp_json.main_switch_status.on_off
                                    },
                                    "individual_switch_status": switch_status_list
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
            debug('[EM_Valve_WebSocket] Process_EM_Valve_WebSocket_GET_Message() Error ' + e);
        }
    }
}
module.exports = EM_Valve_WebSocket;
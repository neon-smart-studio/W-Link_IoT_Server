
var debug = require('debug')(require('path').basename(__filename));

var Circulating_Fan_API = require('../../../Device_MGMT/Environment/Circulating_Fan_API.js');
var circulating_fan_api = new Circulating_Fan_API();

var Circulating_Fan_WebSocket = function (){
    var self = this;
    
    self.Process_Circulating_Fan_WebSocket_POST_Message = async function(username, post_circulating_fan_json_data)
    {
        try{
            if(post_circulating_fan_json_data.command!=null){
                switch(post_circulating_fan_json_data.command){
                    case "Turn On Circulating Fan":
                        if(post_circulating_fan_json_data.device_ID!=null){
                            await circulating_fan_api.Circulating_Fan_Turn_On_Off(post_circulating_fan_json_data.device_ID, true);
                        }
                        break;
                    case "Turn Off Circulating Fan":
                        if(post_circulating_fan_json_data.device_ID!=null){
                            await circulating_fan_api.Circulating_Fan_Turn_On_Off(post_circulating_fan_json_data.device_ID, false);
                        }
                        break;
                    case "Toggle Circulating Fan On Off":
                        if(post_circulating_fan_json_data.device_ID!=null){
                            await circulating_fan_api.Circulating_Fan_Toggle_On_Off(post_circulating_fan_json_data.device_ID);
                        }
                        break;
                    case "Circulating Fan Set PWM Level":
                        if(post_circulating_fan_json_data.device_ID!=null && post_circulating_fan_json_data.pwm_lvl){
                            await circulating_fan_api.Circulating_Fan_Set_PWM_Level(post_circulating_fan_json_data.device_ID, post_circulating_fan_json_data.pwm_lvl);
                        }
                        break;
                    case "Circulating Fan Step PWM Level Up":
                        if(post_circulating_fan_json_data.device_ID!=null && post_circulating_fan_json_data.step_up_size!=null){
                            await circulating_fan_api.Circulating_Fan_Step_PWM_Level_Up(target_address_ID, post_circulating_fan_json_data.step_up_size);
                        }
                        break;
                    case "Circulating Fan Step PWM Level Down":
                        if(post_circulating_fan_json_data.device_ID!=null && post_circulating_fan_json_data.step_down_size!=null){
                            await circulating_fan_api.Circulating_Fan_Step_PWM_Level_Down(target_address_ID, post_circulating_fan_json_data.step_down_size);
                        }
                        break;
                }
            }
        }
        catch(e)
        {
            debug('[Circulating_Fan_WebSocket] Process_Circulating_Fan_WebSocket_POST_Message() Error ' + e);
        }
    }

    self.Process_Circulating_Fan_WebSocket_GET_Message = async function(username, get_circulating_fan_json_data)
    {
        try{
            var rsp_json = null;
            if(get_circulating_fan_json_data.command!=null){
                switch(get_circulating_fan_json_data.command){
                    case "Get Circulating Fan All Status":
                        if(get_circulating_fan_json_data.device_ID!=null){
                            var get_rsp_json = await circulating_fan_api.Circulating_Fan_Get_All_Status(get_circulating_fan_json_data.device_ID);
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_circulating_fan_json_data.device_ID
                                };
                            }
                            else{
                                rsp_json = {
                                    "timeout": false,
                                    "device_ID": get_circulating_fan_json_data.device_ID,
                                    "on_off": get_rsp_json.on_off,
                                    "pwm_level": get_rsp_json.current_pwm_level
                                };
                            }
                        }
                        break;
                    case "Get Circulating Fan On Off Status":
                        if(get_circulating_fan_json_data.device_ID!=null){
                            var get_rsp_json = await circulating_fan_api.Circulating_Fan_Get_On_Off_Status(get_circulating_fan_json_data.device_ID);
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_circulating_fan_json_data.device_ID
                                };
                            }
                            else{
                                rsp_json = {
                                    "timeout": false,
                                    "device_ID": get_circulating_fan_json_data.device_ID,
                                    "on_off": get_rsp_json.on_off
                                };
                            }
                        }
                        break;
                    case "Get Circulating Fan PWM Level":
                        if(get_circulating_fan_json_data.device_ID!=null){
                            var get_rsp_json = await circulating_fan_api.Circulating_Fan_Get_Current_PWM_Level(get_circulating_fan_json_data.device_ID);
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_circulating_fan_json_data.device_ID
                                };
                            }
                            else{
                                rsp_json = {
                                    "timeout": false,
                                    "device_ID": get_circulating_fan_json_data.device_ID,
                                    "pwm_level": get_rsp_json.current_pwm_level
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
            debug('[Circulating_Fan_WebSocket] Process_Circulating_Fan_WebSocket_GET_Message() Error ' + e);
        }
    }
}
module.exports = Circulating_Fan_WebSocket;
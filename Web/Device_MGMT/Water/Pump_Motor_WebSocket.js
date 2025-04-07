
var debug = require('debug')(require('path').basename(__filename));

var Pump_Motor_API = require('../../../Device_MGMT/Water/Pump_Motor_API.js');
var pump_motor_api = new Pump_Motor_API();

var Pump_Motor_WebSocket = function (){
    var self = this;
    
    self.Process_Pump_Motor_WebSocket_POST_Message = async function(username, post_pump_motor_json_data)
    {
        try{
            if(post_pump_motor_json_data.command!=null){
                switch(post_pump_motor_json_data.command){
                    case "Turn On Pump Motor":
                        if(post_pump_motor_json_data.device_ID!=null){
                            await pump_motor_api.Pump_Motor_Turn_On_Off(post_pump_motor_json_data.device_ID, true);
                        }
                        break;
                    case "Turn Off Pump Motor":
                        if(post_pump_motor_json_data.device_ID!=null){
                            await pump_motor_api.Pump_Motor_Turn_On_Off(post_pump_motor_json_data.device_ID, false);
                        }
                        break;
                    case "Toggle Pump Motor On Off":
                        if(post_pump_motor_json_data.device_ID!=null){
                            await pump_motor_api.Pump_Motor_Toggle_On_Off(post_pump_motor_json_data.device_ID);
                        }
                        break;
                    case "Pump Motor Set PWM Level":
                        if(post_pump_motor_json_data.device_ID!=null && post_pump_motor_json_data.pwm_lvl){
                            await pump_motor_api.Pump_Motor_Set_PWM_Level(post_pump_motor_json_data.device_ID, post_pump_motor_json_data.pwm_lvl);
                        }
                        break;
                    case "Pump Motor Step PWM Level Up":
                        if(post_pump_motor_json_data.device_ID!=null && post_pump_motor_json_data.step_up_size!=null){
                            await pump_motor_api.Pump_Motor_Step_PWM_Level_Up(target_address_ID, post_pump_motor_json_data.step_up_size);
                        }
                        break;
                    case "Pump Motor Step PWM Level Down":
                        if(post_pump_motor_json_data.device_ID!=null && post_pump_motor_json_data.step_down_size!=null){
                            await pump_motor_api.Pump_Motor_Step_PWM_Level_Down(target_address_ID, post_pump_motor_json_data.step_down_size);
                        }
                        break;
                }
            }
        }
        catch(e)
        {
            debug('[Pump_Motor_WebSocket] Process_Pump_Motor_WebSocket_POST_Message() Error ' + e);
        }
    }

    self.Process_Pump_Motor_WebSocket_GET_Message = async function(username, get_pump_motor_json_data)
    {
        try{
            var rsp_json = null;
            if(get_pump_motor_json_data.command!=null){
                switch(get_pump_motor_json_data.command){
                    case "Get Pump Motor All Status":
                        if(get_pump_motor_json_data.device_ID!=null){
                            var get_rsp_json = await pump_motor_api.Pump_Motor_Get_All_Status(get_pump_motor_json_data.device_ID);
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_pump_motor_json_data.device_ID
                                };
                            }
                            else{
                                rsp_json = {
                                    "timeout": false,
                                    "device_ID": get_pump_motor_json_data.device_ID,
                                    "on_off": get_rsp_json.on_off,
                                    "pwm_level": get_rsp_json.current_pwm_level
                                };
                            }
                        }
                        break;
                    case "Get Pump Motor On Off Status":
                        if(get_pump_motor_json_data.device_ID!=null){
                            var get_rsp_json = await pump_motor_api.Pump_Motor_Get_On_Off_Status(get_pump_motor_json_data.device_ID);
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_pump_motor_json_data.device_ID
                                };
                            }
                            else{
                                rsp_json = {
                                    "timeout": false,
                                    "device_ID": get_pump_motor_json_data.device_ID,
                                    "on_off": get_rsp_json.on_off
                                };
                            }
                        }
                        break;
                    case "Get Pump Motor PWM Level":
                        if(get_pump_motor_json_data.device_ID!=null){
                            var get_rsp_json = await pump_motor_api.Pump_Motor_Get_Current_PWM_Level(get_pump_motor_json_data.device_ID);
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_pump_motor_json_data.device_ID
                                };
                            }
                            else{
                                rsp_json = {
                                    "timeout": false,
                                    "device_ID": get_pump_motor_json_data.device_ID,
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
            debug('[Pump_Motor_WebSocket] Process_Pump_Motor_WebSocket_GET_Message() Error ' + e);
        }
    }
}
module.exports = Pump_Motor_WebSocket;
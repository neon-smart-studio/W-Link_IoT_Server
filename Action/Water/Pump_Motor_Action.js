
var debug = require('debug')(require('path').basename(__filename));

var Pump_Motor_API = require('../../Device_MGMT/Water/Pump_Motor_API.js');
var pump_motor_api = new Pump_Motor_API();

var Pump_Motor_Action = function (){
    var self = this;
    
    self.Execute_Pump_Motor_Action = async function(target_address_ID, command, param_json_data)
    {
        try{
            switch(command){
                case "Turn On Pump Motor":
                    await pump_motor_api.Pump_Motor_Turn_On_Off(target_address_ID, true);
                    break;
                case "Turn Off Pump Motor":
                    await pump_motor_api.Pump_Motor_Turn_On_Off(target_address_ID, false);
                    break;
                case "Toggle Pump Motor On Off":
                    await pump_motor_api.Pump_Motor_Toggle_On_Off(target_address_ID);
                    break;
                case "Pump Motor Set PWM Level":
                    if(param_json_data.pwm_lvl){
                        await pump_motor_api.Pump_Motor_Set_PWM_Level(target_address_ID, param_json_data.pwm_lvl);
                    }
                    break;
                case "Pump Motor Step PWM Level Up":
                    if(param_json_data.step_up_size){
                        await pump_motor_api.Pump_Motor_Step_PWM_Level_Up(target_address_ID, param_json_data.step_up_size);
                    }
                    break;
                case "Pump Motor Step PWM Level Down":
                    if(param_json_data.step_down_size){
                        await pump_motor_api.Pump_Motor_Step_PWM_Level_Down(target_address_ID, param_json_data.step_down_size);
                    }
                    break;
            }
        }
        catch(e)
        {
            debug('[Pump_Motor_Action] Execute_Pump_Motor_Action() Error ' + e);
        }
    }
}
module.exports = Pump_Motor_Action;
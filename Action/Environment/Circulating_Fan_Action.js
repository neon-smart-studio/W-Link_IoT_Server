
var debug = require('debug')(require('path').basename(__filename));

var Circulating_Fan_API = require('../../Device_MGMT/Environment/Circulating_Fan_API.js');
var circulating_fan_api = new Circulating_Fan_API();

var Circulating_Fan_Action = function (){
    var self = this;
    
    self.Execute_Circulating_Fan_Action = async function(target_address_ID, command, param_json_data)
    {
        try{
            switch(command){
                case "Turn On Circulating Fan":
                    await circulating_fan_api.Circulating_Fan_Turn_On_Off(target_address_ID, true);
                    break;
                case "Turn Off Circulating Fan":
                    await circulating_fan_api.Circulating_Fan_Turn_On_Off(target_address_ID, false);
                    break;
                case "Toggle Circulating Fan On Off":
                    await circulating_fan_api.Circulating_Fan_Toggle_On_Off(target_address_ID);
                    break;
                case "Circulating Fan Set PWM Level":
                    if(param_json_data.pwm_lvl){
                        await circulating_fan_api.Circulating_Fan_Set_PWM_Level(target_address_ID, param_json_data.pwm_lvl);
                    }
                    break;
                case "Circulating Fan Step PWM Level Up":
                    if(param_json_data.step_up_size){
                        await circulating_fan_api.Circulating_Fan_Step_PWM_Level_Up(target_address_ID, param_json_data.step_up_size);
                    }
                    break;
                case "Circulating Fan Step PWM Level Down":
                    if(param_json_data.step_down_size){
                        await circulating_fan_api.Circulating_Fan_Step_PWM_Level_Down(target_address_ID, param_json_data.step_down_size);
                    }
                    break;
            }
        }
        catch(e)
        {
            debug('[Circulating_Fan_Action] Execute_Circulating_Fan_Action() Error ' + e);
        }
    }
}
module.exports = Circulating_Fan_Action;
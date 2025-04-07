
var debug = require('debug')(require('path').basename(__filename));

var Dimmable_Socket_API = require('../../Device_MGMT/ElectricPower/Dimmable_Socket_API.js');
var dimmable_socket_api = new Dimmable_Socket_API();

var Dimmable_Socket_Action = function (){
    var self = this;
        
    self.Execute_Dimmable_Socket_Action = async function(target_address_ID, command, param_json_data)
    {
        try{
            switch(command){
                case "Turn On Individual Dimmable Socket":
                    if(param_json_data.socket_index!=null){
                        await dimmable_socket_api.Dimmable_Socket_Set_Individual_Socket_On_Off(target_address_ID, param_json_data.socket_index, true);
                    }
                    break;
                case "Turn Off Individual Dimmable Socket":
                    if(param_json_data.socket_index!=null){
                        await dimmable_socket_api.Dimmable_Socket_Set_Individual_Socket_On_Off(target_address_ID, param_json_data.socket_index, false);
                    }
                    break;
                case "Toggle Individual Dimmable Socket":
                    if(param_json_data.socket_index!=null){
                        await dimmable_socket_api.Dimmable_Socket_Toggle_Individual_Socket_On_Off(target_address_ID, param_json_data.socket_index);
                    }
                    break;
                case "Turn On All Dimmable Socket":
                    await dimmable_socket_api.Dimmable_Socket_Set_All_Socket_On_Off(target_address_ID, true);
                    break;
                case "Turn Off All Dimmable Socket":
                    await dimmable_socket_api.Dimmable_Socket_Set_All_Socket_On_Off(target_address_ID, false);
                    break;
                case "Toggle All Dimmable Socket":
                    await dimmable_socket_api.Dimmable_Socket_Toggle_All_Socket_On_Off(target_address_ID);
                    break;
                case "Individual Dimmable Socket Set Pwm Level":
                    if(param_json_data.socket_index!=null && param_json_data.level!=null){
                        await dimmable_socket_api.Dimmable_Socket_Set_Individual_Socket_PWM_Level(target_address_ID, param_json_data.socket_index, param_json_data.level);
                    }
                case "All Dimmable Socket Set Pwm Level":
                    if(param_json_data.level!=null){
                        await dimmable_socket_api.Dimmable_Socket_Set_All_Socket_PWM_Level(target_address_ID, param_json_data.level);
                    }
                    break;
            }
        }
        catch(e)
        {
            debug('[Dimmable_Socket_Action] Execute_Dimmable_Socket_Action_Message() Error ' + e);
        }
    }
}
module.exports = Dimmable_Socket_Action;
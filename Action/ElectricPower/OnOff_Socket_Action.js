
var debug = require('debug')(require('path').basename(__filename));

var OnOff_Socket_API = require('../../Device_MGMT/ElectricPower/OnOff_Socket_API.js');
var onoff_socket_api = new OnOff_Socket_API();

var OnOff_Socket_Action = function (){
    var self = this;
    
    self.Execute_OnOff_Socket_Action = async function(target_address_ID, command, param_json_data)
    {
        try{
            switch(command){
                case "Turn On Individual OnOff Socket":
                    if(param_json_data.socket_index!=null){
                        await onoff_socket_api.OnOff_Socket_Set_Individual_Socket_On_Off(target_address_ID, param_json_data.socket_index, true);
                    }
                    break;
                case "Turn Off Individual OnOff Socket":
                    if(param_json_data.socket_index!=null){
                        await onoff_socket_api.OnOff_Socket_Set_Individual_Socket_On_Off(target_address_ID, param_json_data.socket_index, false);
                    }
                    break;
                case "Toggle Individual OnOff Socket":
                    if(param_json_data.socket_index!=null){
                        await onoff_socket_api.OnOff_Socket_Toggle_Individual_Socket_On_Off(target_address_ID, param_json_data.socket_index);
                    }
                    break;
                case "Turn On All OnOff Socket":
                    await onoff_socket_api.OnOff_Socket_Set_All_Socket_On_Off(target_address_ID, true);
                    break;
                case "Turn Off All OnOff Socket":
                    await onoff_socket_api.OnOff_Socket_Set_All_Socket_On_Off(target_address_ID, false);
                    break;
                case "Toggle All OnOff Socket":
                    await onoff_socket_api.OnOff_Socket_Toggle_All_Socket_On_Off(target_address_ID);
                    break;
            }
        }
        catch(e)
        {
            debug('[OnOff_Socket_Action] Execute_OnOff_Socket_Action() Error ' + e);
        }
    }
}
module.exports = OnOff_Socket_Action;
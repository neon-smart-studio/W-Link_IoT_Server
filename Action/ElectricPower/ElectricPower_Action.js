
var debug = require('debug')(require('path').basename(__filename));

var OnOff_Socket_Action = require('./OnOff_Socket_Action.js');
var onoff_socket_action = new OnOff_Socket_Action();
var Dimmable_Socket_Action = require('./Dimmable_Socket_Action.js');
var dimmable_socket_action = new Dimmable_Socket_Action();
var Power_Meter_Action = require('./Power_Meter_Action.js');
var power_meter_action = new Power_Meter_Action();

var Electric_Power_Action = function (){
    var self = this;
    
    self.Execute_Electric_Power_Topic_Action = async function(target_address_ID, command_type, command, param_json_data)
    {
        try{
            switch(command_type){
                case "OnOff Socket":
                    await onoff_socket_action.Execute_OnOff_Socket_Action(target_address_ID, command, param_json_data);
                    break;
                case "Dimmable Socket":
                    await dimmable_socket_action.Execute_Dimmable_Socket_Action(target_address_ID, command, param_json_data);
                    break;
                case "Power Meter":
                    await power_meter_action.Execute_Power_Meter_Action(target_address_ID, command, param_json_data);
                    break;
            }
        }
        catch(e)
        {
            debug('[Electric_Power_Action] Execute_Electric_Power_Action() Error ' + e);
        }
    }
}
module.exports = Electric_Power_Action;

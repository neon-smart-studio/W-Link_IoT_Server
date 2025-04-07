
var debug = require('debug')(require('path').basename(__filename));

var Air_Valve_Action = require('./Air_Valve_Action.js');
var air_valve_action = new Air_Valve_Action();

var Gas_Action = function (){
    var self = this;
    
    self.Execute_Gas_Topic_Action = async function(target_address_ID, command_type, command, param_json_data)
    {
        try{
            switch(command_type){
                case "Air Valve":
                    await air_valve_action.Execute_Air_Valve_Action(target_address_ID, command, param_json_data);
                    break;
            }
        }
        catch(e)
        {
            debug('[Gas_Action] Execute_Gas_Topic_Action() Error ' + e);
        }
    }
}
module.exports = Gas_Action;

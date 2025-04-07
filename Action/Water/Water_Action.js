
var debug = require('debug')(require('path').basename(__filename));

var ElectroMagnetic_Valve_Action = require('./Electromagnetic_Valve_Action.js');
var electro_magnetic_valve_action = new ElectroMagnetic_Valve_Action();
var Pump_Motor_Action = require('./Pump_Motor_Action.js');
var pump_motor_action = new Pump_Motor_Action();

var Water_Action = function (){
    var self = this;
    
    self.Execute_Water_Topic_Action = async function(target_address_ID, command_type, command, param_json_data)
    {
        try{
            switch(command_type){
                case "Electromagnetic Valve":
                    await electro_magnetic_valve_action.Execute_EM_Valve_Action(target_address_ID, command, param_json_data);
                    break;
                case "Pump Motor":
                    await pump_motor_action.Execute_Pump_Motor_Action(target_address_ID, command, param_json_data);
                    break;
            }
        }
        catch(e)
        {
            debug('[Water_Action] Execute_Water_Topic_Action() Error ' + e);
        }
    }
}
module.exports = Water_Action;

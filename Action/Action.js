
var debug = require('debug')(require('path').basename(__filename));

var events=require('events');
var event_emitter=new events.EventEmitter();

var Electric_Power_Action = require('./ElectricPower/ElectricPower_Action.js');
var electric_power_action = new Electric_Power_Action();

var Environment_Action = require('./Environment/Environment_Action.js');
var environment_action = new Environment_Action();

var Gas_Action = require('./Gas/Gas_Action.js');
var gas_action = new Gas_Action();

var Lighting_Action = require('./Lighting/Lighting_Action.js');
var lighting_action = new Lighting_Action();

var Water_Action = require('./Water/Water_Action.js');
var water_action = new Water_Action();

event_emitter.on('ExecAction', async function(target_address_ID, command_topic, command_type, command, param_json_data){
    try{
        switch(command_topic){
            case "Electrical":
                await electric_power_action.Execute_Electric_Power_Topic_Action(target_address_ID, command_type, command, param_json_data);
                break;
            case "Environment":
                await environment_action.Execute_Environment_Topic_Action(target_address_ID, command_type, command, param_json_data);
                break;
            case "Gas":
                await gas_action.Execute_Gas_Topic_Action(target_address_ID, command_type, command, param_json_data);
                break;
            case "Lighting":
                await lighting_action.Execute_Lighting_Topic_Action(target_address_ID, command_type, command, param_json_data);
                break;
            case "Water":
                await water_action.Execute_Water_Topic_Action(target_address_ID, command_type, command, param_json_data);
                break;
        }
    }
    catch(e)
    {
        debug("[Action] ExecAction() Error: " + e);
    }
});

var Action = function (){
    var self = this;
    
    self.Execute_Action = function(target_address_ID, command_topic, command_type, command, param_json_data)
    {
        try{
            event_emitter.emit('ExecAction', target_address_ID, command_topic, command_type, command, param_json_data);
        }
        catch(e)
        {
            debug('[Action] Execute_Action() Error ' + e);
        }
    }
}
module.exports = Action;


var debug = require('debug')(require('path').basename(__filename));

var Blind_Curtain_Action = require('./Blind_Curtain_Action.js');
var blind_curtain_action = new Blind_Curtain_Action();

var Circulating_Fan_Action = require('./Circulating_Fan_Action.js');
var circulating_fan_action = new Circulating_Fan_Action();

var Environment_Action = function (){
    var self = this;
    
    self.Execute_Environment_Topic_Action = async function(target_address_ID, command_type, command, param_json_data)
    {
        try{
            switch(command_type){
                case "Blind Curtain":
                    await blind_curtain_action.Execute_Blind_Curtain_Action(target_address_ID, command, param_json_data);
                    break;
                case "Circulating Fan":
                    await circulating_fan_action.Execute_Circulating_Fan_Action(target_address_ID, command, param_json_data);
                    break;
            }
        }
        catch(e)
        {
            debug('[Environment_Action] Execute_Environment_Topic_Action() Error ' + e);
        }
    }
}
module.exports = Environment_Action;

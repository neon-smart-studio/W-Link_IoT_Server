
var debug = require('debug')(require('path').basename(__filename));

var MQTT = require('../../MQTT.js');
var mqtt = new MQTT();

var MQTT_Dimmable_Switch_API = function (){
    var self = this;
    
    self.Get_Num_Of_Dimmable_Switch = async function(device_ID)
    {
        try{
            var mqtt_cmd = {
                "command":"get num of dimmable switch"
            }
            return (await mqtt.MQTT_GET_Request("Dimmable_Switch", device_ID, mqtt_cmd));
        }
        catch(e)
        {
            debug("[MQTT_Dimmable_Switch_API] Get_Num_Of_Dimmable_Switch() Error " + e);
        }
    };
    self.Get_Dimmable_Switch_Individual_Switch_Status = async function(device_ID, switch_index)
    {
        try{
            var mqtt_cmd = {
                "command":"get individual dimmable switch status",
                "sw_index": Number(switch_index)
            }
            return (await mqtt.MQTT_GET_Request("Dimmable_Switch", device_ID, mqtt_cmd));
        }
        catch(e)
        {
            debug("[MQTT_Dimmable_Switch_API] Get_Dimmable_Switch_Individual_Switch_Status() Error " + e);
        }
    };
    self.Get_Dimmable_Switch_All_Switch_Status = async function(device_ID)
    {
        try{
            var mqtt_cmd = {
                "command":"get all dimmable switch status"
            }
            return (await mqtt.MQTT_GET_Request("Dimmable_Switch", device_ID, mqtt_cmd));
        }
        catch(e)
        {
            debug("[MQTT_Dimmable_Switch_API] Get_Dimmable_Switch_All_Switch_Status() Error " + e);
        }
    };
};

module.exports = MQTT_Dimmable_Switch_API;
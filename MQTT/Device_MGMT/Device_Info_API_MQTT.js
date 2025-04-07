
var debug = require('debug')(require('path').basename(__filename));

var MQTT = require('../MQTT.js');
var mqtt = new MQTT();

var MQTT_Device_Info_API = function (){
    var self = this;
    
    self.Get_Device_Info = async function(device_ID)
    {
        try{
            var mqtt_cmd = {
                "command":"get device info"
            }
            return (await mqtt.MQTT_GET_Request("Device_Info", device_ID, mqtt_cmd));
        }
        catch(e)
        {
            debug("[MQTT_Device_Info_API] Get_Num_Of_Device_Info() Error " + e);
        }
    };
    self.Get_Device_Type = async function(device_ID)
    {
        try{
            var mqtt_cmd = {
                "command":"get device type"
            }
            return (await mqtt.MQTT_GET_Request("Device_Info", device_ID, mqtt_cmd));
        }
        catch(e)
        {
            debug("[MQTT_Device_Info_API] Get_Device_Type() Error " + e);
        }
    };
    self.Get_Device_Support_Attributes = async function(device_ID)
    {
        try{
            var mqtt_cmd = {
                "command":"get device support attributes"
            }
            return (await mqtt.MQTT_GET_Request("Device_Info", device_ID, mqtt_cmd));
        }
        catch(e)
        {
            debug("[MQTT_Device_Info_API] Get_Device_Support_Attributes() Error " + e);
        }
    };
};

module.exports = MQTT_Device_Info_API;
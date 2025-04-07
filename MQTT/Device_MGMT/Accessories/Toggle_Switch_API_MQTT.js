
var debug = require('debug')(require('path').basename(__filename));

var util = require("util");

var MQTT = require('../../MQTT.js');
var mqtt = new MQTT();

var Toggle_Switch_Last_State = [];

var MQTT_Toggle_Switch_API = function () {
    var self = this;
    
    self.Get_Num_Of_Toggle_Switch = async function (device_ID) {
        try {
            var mqtt_cmd = {
                "command": "get num of toggle switch"
            }
            return (await mqtt.MQTT_GET_Request("Toggle_Switch", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[MQTT_Toggle_Switch_API] Get_Num_Of_Toggle_Switch() Error " + e);
        }
    };
};

module.exports = MQTT_Toggle_Switch_API;
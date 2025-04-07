
var debug = require('debug')(require('path').basename(__filename));

var util = require("util");

var MQTT = require('../../MQTT.js');
var mqtt = new MQTT();

var MQTT_Motion_Sensor_API = function () {
    var self = this;
    
    self.Get_Num_Of_Motion_Sensor = async function (device_ID) {
        try {
            var mqtt_cmd = {
                "command": "get num of motion sensor"
            }
            return (await mqtt.MQTT_GET_Request("Motion_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[MQTT_Motion_Sensor_API] Get_Num_Of_Motion_Sensor() Error " + e);
        }
    };
};

module.exports = MQTT_Motion_Sensor_API;
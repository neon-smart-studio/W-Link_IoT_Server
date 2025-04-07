
var debug = require('debug')(require('path').basename(__filename));

var MQTT = require('../../MQTT.js');
var mqtt = new MQTT();

var Water_EC_Sensor_API_MQTT = function () {
    var self = this;
    
    self.Water_EC_Sensor_Get_Num_Of_Sensor = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get num of water ec sensor"
            }
            return (await mqtt.MQTT_GET_Request("Water_EC_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Water_EC_Sensor_API] Water_EC_Sensor_Get_Num_Of_Sensor() Error " + e);
        }
    };
    self.Water_EC_Sensor_Get_Individual_Sensor_Measure = async function (device_ID, sensor_index) {
        try {
            mqtt_cmd = {
                "sensor_index": sensor_index,
                "command": "get individual water ec sensor measure",
            }
            return (await mqtt.MQTT_GET_Request("Water_EC_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Water_EC_Sensor_API] Water_EC_Sensor_Get_Individual_Sensor_Measure() Error " + e);
        }
    };
    self.Water_EC_Sensor_Get_All_Sensor_Measure = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get all water ec sensor measure"
            }
            return (await mqtt.MQTT_GET_Request("Water_EC_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Water_EC_Sensor_API] Water_EC_Sensor_Get_All_Sensor_Measure() Error " + e);
        }
    };
    self.Water_EC_Sensor_Get_Individual_Sensor_Info = async function (device_ID, sensor_index) {
        try {
            mqtt_cmd = {
                "command": "get individual water ec sensor info",
                "sensor_index": Number(sensor_index)
            }
            return (await mqtt.MQTT_GET_Request("Water_EC_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Water_EC_Sensor_API] Water_EC_Sensor_Get_Individual_Sensor_Info() Error " + e);
        }
    };
    self.Water_EC_Sensor_Get_All_Sensor_Info = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get all water ec sensor info"
            }
            return (await mqtt.MQTT_GET_Request("Water_EC_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Water_EC_Sensor_API] Water_EC_Sensor_Get_All_Sensor_Info() Error " + e);
        }
    };
};

module.exports = Water_EC_Sensor_API_MQTT;
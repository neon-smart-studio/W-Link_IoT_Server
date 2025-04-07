
var debug = require('debug')(require('path').basename(__filename));

var MQTT = require('../../MQTT.js');
var mqtt = new MQTT();

var Water_Level_Sensor_API_MQTT = function () {
    var self = this;
    
    self.Water_Level_Sensor_Get_Num_Of_Sensor = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get num of water level sensor"
            }
            return (await mqtt.MQTT_GET_Request("Water_Level_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Water_Level_Sensor_API_MQTT] Water_Level_Sensor_Get_Num_Of_Sensor() Error " + e);
        }
    };
    self.Water_Level_Sensor_Get_Individual_Sensor_Measure = async function (device_ID, sensor_index) {
        try {
            mqtt_cmd = {
                "command": "get individual water level sensor measure",
                "sensor_index": sensor_index
            }
            return (await mqtt.MQTT_GET_Request("Water_Level_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Water_Level_Sensor_API_MQTT] Water_Level_Sensor_Get_Individual_Sensor_Measure() Error " + e);
        }
    };
    self.Water_Level_Sensor_Get_All_Sensor_Measure = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get all water level sensor measure"
            }
            return (await mqtt.MQTT_GET_Request("Water_Level_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Water_Level_Sensor_API_MQTT] Water_Level_Sensor_Get_All_Sensor_Measure() Error " + e);
        }
    };
    self.Water_Level_Sensor_Get_Individual_Sensor_Info = async function (device_ID, sensor_index) {
        try {
            mqtt_cmd = {
                "command": "get individual water level sensor info",
                "sensor_index": Number(sensor_index)
            }
            return (await mqtt.MQTT_GET_Request("Water_Level_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Water_Level_Sensor_API_MQTT] Water_Level_Sensor_Get_Individual_Sensor_Info() Error " + e);
        }
    };
    self.Water_Level_Sensor_Get_All_Sensor_Info = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get all water level sensor info"
            }
            return (await mqtt.MQTT_GET_Request("Water_Level_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Water_Level_Sensor_API_MQTT] Water_Level_Sensor_Get_All_Sensor_Info() Error " + e);
        }
    };
};

module.exports = Water_Level_Sensor_API_MQTT;
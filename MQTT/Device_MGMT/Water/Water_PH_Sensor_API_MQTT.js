
var debug = require('debug')(require('path').basename(__filename));

var MQTT = require('../../MQTT.js');
var mqtt = new MQTT();

var Water_PH_Sensor_API_MQTT = function () {
    var self = this;
    
    self.Water_PH_Sensor_Get_Num_Of_Sensor = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get num of water pH sensor"
            }
            return (await mqtt.MQTT_GET_Request("Water_PH_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Water_PH_Sensor_API_MQTT] Water_PH_Sensor_Get_Num_Of_Sensor() Error " + e);
        }
    };
    self.Water_PH_Sensor_Get_Individual_Sensor_Measure = async function (device_ID, sensor_index) {
        try {
            mqtt_cmd = {
                "command": "get individual water pH sensor measure",
            }
            return (await mqtt.MQTT_GET_Request("Water_PH_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Water_PH_Sensor_API_MQTT] Water_PH_Sensor_Get_Individual_Sensor_Measure() Error " + e);
        }
    };
    self.Water_PH_Sensor_Get_All_Sensor_Measure = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get all water pH sensor measure"
            }
            return (await mqtt.MQTT_GET_Request("Water_PH_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Water_PH_Sensor_API_MQTT] Water_PH_Sensor_Get_All_Sensor_Measure() Error " + e);
        }
    };
    self.Water_PH_Sensor_Get_Individual_Sensor_Info = async function (device_ID, sensor_index) {
        try {
            mqtt_cmd = {
                "command": "get individual water pH sensor info",
                "sensor_index": Number(sensor_index)
            }
            return (await mqtt.MQTT_GET_Request("Water_PH_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Water_PH_Sensor_API_MQTT] Water_PH_Sensor_Get_Individual_Sensor_Info() Error " + e);
        }
    };
    self.Water_PH_Sensor_Get_All_Sensor_Info = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get all water pH sensor info"
            }
            return (await mqtt.MQTT_GET_Request("Water_PH_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Water_PH_Sensor_API_MQTT] Water_PH_Sensor_Get_All_Sensor_Info() Error " + e);
        }
    };
};

module.exports = Water_PH_Sensor_API_MQTT;
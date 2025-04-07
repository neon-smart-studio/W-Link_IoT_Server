
var debug = require('debug')(require('path').basename(__filename));

var MQTT = require('../../MQTT.js');
var mqtt = new MQTT();

var Solar_Radiation_Sensor_API_MQTT = function () {
    var self = this;
    
    self.Solar_Radiation_Sensor_Get_Num_Of_Sensor = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get num of solar radiation sensor"
            }
            return (await mqtt.MQTT_GET_Request("Solar_Radiation_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Solar_Radiation_Sensor_API_MQTT] Solar_Radiation_Sensor_Get_Num_Of_Sensor() Error " + e);
        }
    };
    self.Solar_Radiation_Sensor_Get_Individual_Sensor_Measure = async function (device_ID, sensor_index) {
        try {
            mqtt_cmd = {
                "command": "get individual solar radiation sensor measure",
                "sensor_index": sensor_index
            }
            return (await mqtt.MQTT_GET_Request("Solar_Radiation_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Solar_Radiation_Sensor_API_MQTT] Solar_Radiation_Sensor_Get_Individual_Sensor_Measure() Error " + e);
        }
    };
    self.Solar_Radiation_Sensor_Get_All_Sensor_Measure = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get all solar radiation sensor measure"
            }
            return (await mqtt.MQTT_GET_Request("Solar_Radiation_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Solar_Radiation_Sensor_API_MQTT] Solar_Radiation_Sensor_Get_All_Sensor_Measure() Error " + e);
        }
    };
    self.Solar_Radiation_Sensor_Get_Individual_Sensor_Info = async function (device_ID, sensor_index) {
        try {
            mqtt_cmd = {
                "command": "get individual solar radiation sensor info",
                "sensor_index": sensor_index
            }
            return (await mqtt.MQTT_GET_Request("Solar_Radiation_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Solar_Radiation_Sensor_API_MQTT] Solar_Radiation_Sensor_Get_Individual_Sensor_Info() Error " + e);
        }
    };
    self.Solar_Radiation_Sensor_Get_All_Sensor_Info = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get all solar radiation sensor info"
            }
            return (await mqtt.MQTT_GET_Request("Solar_Radiation_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Solar_Radiation_Sensor_API_MQTT] Solar_Radiation_Sensor_Get_All_Sensor_Info() Error " + e);
        }
    };
};

module.exports = Solar_Radiation_Sensor_API_MQTT;
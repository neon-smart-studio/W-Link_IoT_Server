
var debug = require('debug')(require('path').basename(__filename));

var MQTT = require('../../MQTT.js');
var mqtt = new MQTT();

var Temperature_Sensor_API_MQTT = function () {
    var self = this;
    
    self.Temperature_Sensor_Get_Num_Of_Sensor = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get num of temperature sensor"
            }
            return (await mqtt.MQTT_GET_Request("Temperature_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Temperature_Sensor_API_MQTT] Temperature_Sensor_Get_Num_Of_Sensor() Error " + e);
        }
    };
    self.Temperature_Sensor_Get_Individual_Sensor_Status = async function (device_ID, sensor_index) {
        try {
            mqtt_cmd = {
                "command": "get individual temperature sensor measure",
                "sensor_index": sensor_index
            }
            return (await mqtt.MQTT_GET_Request("Temperature_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Temperature_Sensor_API_MQTT] Temperature_Sensor_Get_Individual_Sensor_Status() Error " + e);
        }
    };
    self.Temperature_Sensor_Get_All_Sensor_Status = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get all temperature sensor measure"
            }
            return (await mqtt.MQTT_GET_Request("Temperature_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Temperature_Sensor_API_MQTT] Temperature_Sensor_Get_All_Sensor_Status() Error " + e);
        }
    };
    self.Temperature_Sensor_Set_Individual_Sensor_Resolution = function (device_ID, sensor_index, resolution) {
        try {
            mqtt_cmd = {
                "command": "set individual temperature sensor resolution",
                "sensor_index": sensor_index,
                "ms_temperature_resolution": Number(resolution)
            }
            mqtt.MQTT_POST_Request("Temperature_Sensor", device_ID, mqtt_cmd);
        }
        catch (e) {
            debug("[Temperature_Sensor_API_MQTT] Temperature_Sensor_Set_Individual_Sensor_Resolution() Error " + e);
        }
    };
    self.Temperature_Sensor_Set_All_Sensor_Resolution = function (device_ID, resolution) {
        try {
            mqtt_cmd = {
                "command": "set all temperature sensor resolution",
                "ms_temperature_resolution": Number(resolution)
            }
            mqtt.MQTT_POST_Request("Temperature_Sensor", device_ID, mqtt_cmd);
        }
        catch (e) {
            debug("[Temperature_Sensor_API_MQTT] Temperature_Sensor_Set_All_Sensor_Resolution() Error " + e);
        }
    };
};

module.exports = Temperature_Sensor_API_MQTT;
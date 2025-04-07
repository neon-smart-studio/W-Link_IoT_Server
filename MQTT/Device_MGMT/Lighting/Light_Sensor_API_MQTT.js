
var debug = require('debug')(require('path').basename(__filename));

var MQTT = require('../../MQTT.js');
var mqtt = new MQTT();

var Light_Sensor_API_MQTT = function () {
    var self = this;
    
    self.Light_Sensor_Get_Num_Of_Sensor = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get num of light sensor"
            }
            return (await mqtt.MQTT_GET_Request("Light_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Light_Sensor_API_MQTT] Light_Sensor_Get_Num_Of_Sensor() Error " + e);
        }
    };
    self.Light_Sensor_Get_Individual_Sensor_Status = async function (device_ID, sensor_index) {
        try {
            mqtt_cmd = {
                "command": "get individual light sensor measure",
                "sensor_index": sensor_index
            }
            return (await mqtt.MQTT_GET_Request("Light_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Light_Sensor_API_MQTT] Light_Sensor_Get_Individual_Sensor_Status() Error " + e);
        }
    };
    self.Light_Sensor_Get_All_Sensor_Status = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get all light sensor measure"
            }
            return (await mqtt.MQTT_GET_Request("Light_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Light_Sensor_API_MQTT] Light_Sensor_Get_All_Sensor_Status() Error " + e);
        }
    };
    self.Light_Sensor_Set_Individual_Sensor_Resolution = function (device_ID, sensor_index, resolution) {
        try {
            mqtt_cmd = {
                "command": "set individual light sensor resolution",
                "sensor_index": sensor_index,
                "ms_temperature_resolution": Number(resolution)
            }
            mqtt.MQTT_POST_Request("Light_Sensor", device_ID, mqtt_cmd);
        }
        catch (e) {
            debug("[Light_Sensor_API_MQTT] Light_Sensor_Set_Individual_Sensor_Resolution() Error " + e);
        }
    };
    self.Light_Sensor_Set_All_Sensor_Resolution = function (device_ID, resolution) {
        try {
            mqtt_cmd = {
                "command": "set all light sensor resolution",
                "ms_temperature_resolution": Number(resolution)
            }
            mqtt.MQTT_POST_Request("Light_Sensor", device_ID, mqtt_cmd);
        }
        catch (e) {
            debug("[Light_Sensor_API_MQTT] Light_Sensor_Set_All_Sensor_Resolution() Error " + e);
        }
    };
};

module.exports = Light_Sensor_API_MQTT;
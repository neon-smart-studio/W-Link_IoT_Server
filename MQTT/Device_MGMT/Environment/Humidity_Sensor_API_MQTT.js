
var debug = require('debug')(require('path').basename(__filename));

var MQTT = require('../../MQTT.js');
var mqtt = new MQTT();

var Humidity_Sensor_API_MQTT = function () {
    var self = this;
    
    self.Humidity_Sensor_Get_Num_Of_Sensor = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get num of humidity sensor"
            }
            return (await mqtt.MQTT_GET_Request("Humidity_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Humidity_Sensor_API_MQTT] Humidity_Sensor_Get_Num_Of_Sensor() Error " + e);
        }
    };
    self.Humidity_Sensor_Get_Individual_Sensor_Status = async function (device_ID, sensor_index) {
        try {
            mqtt_cmd = {
                "command": "get individual humidity sensor measure",
                "sensor_index": sensor_index
            }
            return (await mqtt.MQTT_GET_Request("Humidity_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Humidity_Sensor_API_MQTT] Humidity_Sensor_Get_Individual_Sensor_Status() Error " + e);
        }
    };
    self.Humidity_Sensor_Get_All_Sensor_Status = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get all humidity sensor measure"
            }
            return (await mqtt.MQTT_GET_Request("Humidity_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Humidity_Sensor_API_MQTT] Humidity_Sensor_Get_All_Sensor_Status() Error " + e);
        }
    };
    self.Humidity_Sensor_Set_Individual_Sensor_Resolution = function (device_ID, sensor_index, resolution) {
        try {
            mqtt_cmd = {
                "command": "set individual humidity sensor resolution",
                "sensor_index": sensor_index,
                "ms_humidity_resolution": Number(resolution)
            }
            mqtt.MQTT_POST_Request("Humidity_Sensor", device_ID, mqtt_cmd);
        }
        catch (e) {
            debug("[Humidity_Sensor_API_MQTT] Humidity_Sensor_Set_Individual_Sensor_Resolution() Error " + e);
        }
    };
    self.Humidity_Sensor_Set_All_Sensor_Resolution = function (device_ID, resolution) {
        try {
            mqtt_cmd = {
                "command": "set all humidity sensor resolution",
                "ms_humidity_resolution": Number(resolution)
            }
            mqtt.MQTT_POST_Request("Humidity_Sensor", device_ID, mqtt_cmd);
        }
        catch (e) {
            debug("[Humidity_Sensor_API_MQTT] Humidity_Sensor_Set_All_Sensor_Resolution() Error " + e);
        }
    };
}

module.exports = Humidity_Sensor_API_MQTT;
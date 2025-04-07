
var debug = require('debug')(require('path').basename(__filename));

var MQTT = require('../../MQTT.js');
var mqtt = new MQTT();

var Pressure_Sensor_API_MQTT = function () {
    var self = this;
    
    self.Pressure_Sensor_Get_Num_Of_Sensor = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get num of pressure sensor"
            }
            return (await mqtt.MQTT_GET_Request("Pressure_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Pressure_Sensor_API_MQTT] Pressure_Sensor_Get_Num_Of_Sensor() Error " + e);
        }
    };
    self.Pressure_Sensor_Get_Individual_Sensor_Status = async function (device_ID, sensor_index) {
        try {
            mqtt_cmd = {
                "command": "get individual pressure sensor measure",
                "sensor_index": sensor_index
            }
            return (await mqtt.MQTT_GET_Request("Pressure_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Pressure_Sensor_API_MQTT] Pressure_Sensor_Get_Individual_Sensor_Status() Error " + e);
        }
    };
    self.Pressure_Sensor_Get_All_Sensor_Status = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get all pressure sensor measure"
            }
            return (await mqtt.MQTT_GET_Request("Pressure_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Pressure_Sensor_API_MQTT] Pressure_Sensor_Get_All_Sensor_Status() Error " + e);
        }
    };
    self.Pressure_Sensor_Set_Individual_Sensor_Resolution = function (device_ID, sensor_index, resolution) {
        try {
            mqtt_cmd = {
                "command": "set individual pressure sensor resolution",
                "sensor_index": sensor_index,
                "ms_pressure_resolution": Number(resolution)
            }
            mqtt.MQTT_POST_Request("Pressure_Sensor", device_ID, mqtt_cmd);
        }
        catch (e) {
            debug("[Pressure_Sensor_API_MQTT] Pressure_Sensor_Set_Individual_Sensor_Resolution() Error " + e);
        }
    };
    self.Pressure_Sensor_Set_All_Sensor_Resolution = function (device_ID, resolution) {
        try {
            mqtt_cmd = {
                "command": "set all pressure sensor resolution",
                "ms_pressure_resolution": Number(resolution)
            }
            mqtt.MQTT_POST_Request("Pressure_Sensor", device_ID, mqtt_cmd);
        }
        catch (e) {
            debug("[Pressure_Sensor_API_MQTT] Pressure_Sensor_Set_All_Sensor_Resolution() Error " + e);
        }
    };
};

module.exports = Pressure_Sensor_API_MQTT;
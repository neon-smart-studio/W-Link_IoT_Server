
var debug = require('debug')(require('path').basename(__filename));

var MQTT = require('../../MQTT.js');
var mqtt = new MQTT();

var Wind_Guage_API_MQTT = function () {
    var self = this;

    self.Wind_Guage_Get_Num_Of_Sensor = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get num of wind guage"
            }
            return (await mqtt.MQTT_GET_Request("Wind_Guage", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Wind_Guage_API_MQTT] Wind_Guage_Get_Num_Of_Sensor() Error " + e);
        }
    };
    self.Wind_Guage_Get_Individual_Sensor_Status = async function (device_ID, sensor_index) {
        try {
            mqtt_cmd = {
                "command": "get individual wind guage measure",
                "sensor_index": sensor_index
            }
            return (await mqtt.MQTT_GET_Request("Wind_Guage", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Wind_Guage_API_MQTT] Wind_Guage_Get_Individual_Sensor_Status() Error " + e);
        }
    };
    self.Wind_Guage_Get_All_Sensor_Status = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get all wind guage measure"
            }
            return (await mqtt.MQTT_GET_Request("Wind_Guage", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Wind_Guage_API_MQTT] Wind_Guage_Get_All_Sensor_Status() Error " + e);
        }
    };
}

module.exports = Wind_Guage_API_MQTT;
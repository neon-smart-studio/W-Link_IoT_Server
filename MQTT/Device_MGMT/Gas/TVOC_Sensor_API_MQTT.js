
var debug = require('debug')(require('path').basename(__filename));

var MQTT = require('../../MQTT.js');
var mqtt = new MQTT();

var TVOC_Sensor_API_MQTT = function () {
    var self = this;
    
    self.TVOC_Sensor_Get_Num_Of_Sensor = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get num of tvoc sensor"
            }
            return (await mqtt.MQTT_GET_Request("TVOC_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[TVOC_Sensor_API_MQTT] TVOC_Sensor_Get_Num_Of_Sensor() Error " + e);
        }
    };
    self.TVOC_Sensor_Get_Individual_Sensor_Status = async function (device_ID, sensor_index) {
        try {
            mqtt_cmd = {
                "command": "get individual tvoc sensor measure",
                "sensor_index": sensor_index
            }
            return (await mqtt.MQTT_GET_Request("TVOC_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[TVOC_Sensor_API_MQTT] TVOC_Sensor_Get_Individual_Sensor_Status() Error " + e);
        }
    };
    self.TVOC_Sensor_Get_All_Sensor_Status = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get all tvoc sensor measure"
            }
            return (await mqtt.MQTT_GET_Request("TVOC_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[TVOC_Sensor_API_MQTT] TVOC_Sensor_Get_All_Sensor_Status() Error " + e);
        }
    };
};

module.exports = TVOC_Sensor_API_MQTT;
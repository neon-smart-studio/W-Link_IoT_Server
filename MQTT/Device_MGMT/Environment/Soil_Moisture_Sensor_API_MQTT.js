
var debug = require('debug')(require('path').basename(__filename));

var MQTT = require('../../MQTT.js');
var mqtt = new MQTT();

var Soil_Moisture_Sensor_API_MQTT = function () {
    var self = this;
    
    self.Soil_Moisture_Sensor_Get_Num_Of_Sensor = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get num of soil moisture sensor"
            }
            return (await mqtt.MQTT_GET_Request("Soil_Moisture_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Soil_Moisture_Sensor_API_MQTT] Soil_Moisture_Sensor_Get_Num_Of_Sensor() Error " + e);
        }
    };
    self.Soil_Moisture_Sensor_Get_Individual_Sensor_Measure = async function (device_ID, sensor_index) {
        try {
            mqtt_cmd = {
                "command": "get individual soil moisture sensor measure",
                "sensor_index": sensor_index
            }
            return (await mqtt.MQTT_GET_Request("Soil_Moisture_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Soil_Moisture_Sensor_API_MQTT] Soil_Moisture_Sensor_Get_Individual_Sensor_Measure() Error " + e);
        }
    };
    self.Soil_Moisture_Sensor_Get_All_Sensor_Measure = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get all soil moisture sensor measure"
            }
            return (await mqtt.MQTT_GET_Request("Soil_Moisture_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Soil_Moisture_Sensor_API_MQTT] Soil_Moisture_Sensor_Get_All_Sensor_Measure() Error " + e);
        }
    };
};

module.exports = Soil_Moisture_Sensor_API_MQTT;

var debug = require('debug')(require('path').basename(__filename));

var MQTT = require('../../MQTT.js');
var mqtt = new MQTT();

var CO2_Sensor_API_MQTT = function () {
    var self = this;
    
    self.CO2_Sensor_Get_Num_Of_Sensor = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get num of co2 sensor"
            }
            return (await mqtt.MQTT_GET_Request("CO2_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[CO2_Sensor_API_MQTT] CO2_Sensor_Get_Num_Of_Sensor() Error " + e);
        }
    };
    self.CO2_Sensor_Get_Individual_Sensor_Status = async function (device_ID, sensor_index) {
        try {
            mqtt_cmd = {
                "command": "get individual co2 sensor measure",
                "sensor_index": sensor_index
            }
            return (await mqtt.MQTT_GET_Request("CO2_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[CO2_Sensor_API_MQTT] CO2_Sensor_Get_Individual_Sensor_Status() Error " + e);
        }
    };
    self.CO2_Sensor_Get_All_Sensor_Status = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get all co2 sensor measure"
            }
            return (await mqtt.MQTT_GET_Request("CO2_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[CO2_Sensor_API_MQTT] CO2_Sensor_Get_All_Sensor_Status() Error " + e);
        }
    };
};

module.exports = CO2_Sensor_API_MQTT;
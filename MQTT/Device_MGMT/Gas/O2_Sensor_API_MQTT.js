
var debug = require('debug')(require('path').basename(__filename));

var MQTT = require('../../MQTT.js');
var mqtt = new MQTT();

var O2_Sensor_API_MQTT = function () {
    var self = this;
    
    self.O2_Sensor_Get_Num_Of_Sensor = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get num of o2 sensor"
            }
            return (await mqtt.MQTT_GET_Request("O2_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[O2_Sensor_API_MQTT] O2_Sensor_Get_Num_Of_Sensor() Error " + e);
        }
    };
    self.O2_Sensor_Get_Individual_Sensor_Status = async function (device_ID, sensor_index) {
        try {
            mqtt_cmd = {
                "command": "get individual o2 sensor measure",
                "sensor_index": sensor_index
            }
            return (await mqtt.MQTT_GET_Request("O2_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[O2_Sensor_API_MQTT] O2_Sensor_Get_Individual_Sensor_Status() Error " + e);
        }
    };
    self.O2_Sensor_Get_All_Sensor_Status = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get all o2 sensor measure"
            }
            return (await mqtt.MQTT_GET_Request("O2_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[O2_Sensor_API_MQTT] O2_Sensor_Get_All_Sensor_Status() Error " + e);
        }
    };
};

module.exports = O2_Sensor_API_MQTT;
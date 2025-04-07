
var debug = require('debug')(require('path').basename(__filename));

var MQTT = require('../../MQTT.js');
var mqtt = new MQTT();

var Rain_Guage_API_MQTT = function () {
    var self = this;

    self.Rain_Guage_Get_Num_Of_Sensor = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get num of rain guage"
            }
            return (await mqtt.MQTT_GET_Request("Rain_Guage", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Rain_Guage_API_MQTT] Rain_Guage_Get_Num_Of_Sensor() Error " + e);
        }
    };
    self.Rain_Guage_Get_Individual_Sensor_Status = async function (device_ID, sensor_index) {
        try {
            mqtt_cmd = {
                "command": "get individual rain guage measure",
                "sensor_index": sensor_index
            }
            return (await mqtt.MQTT_GET_Request("Rain_Guage", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Rain_Guage_API_MQTT] Rain_Guage_Get_Individual_Sensor_Status() Error " + e);
        }
    };
    self.Rain_Guage_Get_All_Sensor_Status = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get all rain guage measure"
            }
            return (await mqtt.MQTT_GET_Request("Rain_Guage", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Rain_Guage_API_MQTT] Rain_Guage_Get_All_Sensor_Status() Error " + e);
        }
    };
}

module.exports = Rain_Guage_API_MQTT;
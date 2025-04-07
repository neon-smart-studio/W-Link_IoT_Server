
var debug = require('debug')(require('path').basename(__filename));

var MQTT = require('../../MQTT.js');
var mqtt = new MQTT();

var PM2_5_Sensor_API_MQTT = function () {
    var self = this;
    
    self.PM2_5_Sensor_Get_Num_Of_Sensor = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get num of pm2.5 sensor"
            }
            return (await mqtt.MQTT_GET_Request("PM2.5_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[PM2.5_Sensor_API_MQTT] PM2_5_Sensor_Get_Num_Of_Sensor() Error " + e);
        }
    };
    self.PM2_5_Sensor_Get_Individual_Sensor_Status = async function (device_ID, sensor_index) {
        try {
            mqtt_cmd = {
                "command": "get individual pm2.5 sensor measure",
                "sensor_index": sensor_index
            }
            return (await mqtt.MQTT_GET_Request("PM2.5_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[PM2.5_Sensor_API_MQTT] PM2_5_Sensor_Get_Individual_Sensor_Status() Error " + e);
        }
    };
    self.PM2_5_Sensor_Get_All_Sensor_Status = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get all pm2.5 sensor measure"
            }
            return (await mqtt.MQTT_GET_Request("PM2.5_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[PM2.5_Sensor_API_MQTT] PM2_5_Sensor_Get_All_Sensor_Status() Error " + e);
        }
    };
};

module.exports = PM2_5_Sensor_API_MQTT;
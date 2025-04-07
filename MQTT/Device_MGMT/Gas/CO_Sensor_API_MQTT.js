
var debug = require('debug')(require('path').basename(__filename));

var MQTT = require('../../MQTT.js');
var mqtt = new MQTT();

var CO_Sensor_API_MQTT = function () {
    var self = this;
    
    self.Set_Individual_CO_Sensor_Sensitivity = function (device_ID, sensor_index, sensitivity_nA_PPM) {
        try {
            var mqtt_cmd = {
                "command": "set individual co sensor sensitivity",
                "sensor_index": Number(sensor_index),
                "sensitivity_nA_PPM": Number(sensitivity_nA_PPM)
            }
            mqtt.MQTT_POST_Request("CO_Sensor", device_ID, mqtt_cmd);
        }
        catch (e) {
            debug("[CO_Sensor_API_MQTT] Set_Individual_CO_Sensor_Sensitivity() Error " + e);
        }
    };
    self.Set_All_CO_Sensor_Sensitivity = function (device_ID, sensitivity_nA_PPM) {
        try {
            var mqtt_cmd = {
                "command": "set all co sensor sensitivity",
                "sensitivity_nA_PPM": Number(sensitivity_nA_PPM)
            }
            mqtt.MQTT_POST_Request("CO_Sensor", device_ID, mqtt_cmd);
        }
        catch (e) {
            debug("[CO_Sensor_API_MQTT] Set_All_CO_Sensor_Sensitivity() Error " + e);
        }
    };
    self.CO_Sensor_Get_Num_Of_Sensor = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get num of co sensor"
            }
            return (await mqtt.MQTT_GET_Request("CO_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[CO_Sensor_API_MQTT] CO_Sensor_Get_Num_Of_Sensor() Error " + e);
        }
    };
    self.CO_Sensor_Get_Individual_Sensor_Status = async function (device_ID, sensor_index) {
        try {
            mqtt_cmd = {
                "command": "get individual co sensor measure",
                "sensor_index": sensor_index
            }
            return (await mqtt.MQTT_GET_Request("CO_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[CO_Sensor_API_MQTT] CO_Sensor_Get_Individual_Sensor_Status() Error " + e);
        }
    };
    self.CO_Sensor_Get_All_Sensor_Status = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get all co sensor measure"
            }
            return (await mqtt.MQTT_GET_Request("CO_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[CO_Sensor_API_MQTT] CO_Sensor_Get_All_Sensor_Status() Error " + e);
        }
    };
    self.CO_Sensor_Get_Individual_Sensor_Info = async function (device_ID, sensor_index) {
        try {
            mqtt_cmd = {
                "command": "get individual co sensor info",
                "sensor_index": sensor_index
            }
            return (await mqtt.MQTT_GET_Request("CO_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[CO_Sensor_API_MQTT] CO_Sensor_Get_Individual_Sensor_Info() Error " + e);
        }
    };
    self.CO_Sensor_Get_All_Sensor_Info = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get all co sensor info"
            }
            return (await mqtt.MQTT_GET_Request("CO_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[CO_Sensor_API_MQTT] CO_Sensor_Get_All_Sensor_Info() Error " + e);
        }
    };
}

module.exports = CO_Sensor_API_MQTT;
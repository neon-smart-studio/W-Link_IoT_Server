
var debug = require('debug')(require('path').basename(__filename));

var MQTT = require('../../MQTT.js');
var mqtt = new MQTT();

var SO2_Sensor_API_MQTT = function () {
    var self = this;
    
    self.Set_Individual_SO2_Sensor_Sensitivity = function (device_ID, sensor_index, sensitivity_nA_PPM) {
        try {
            var mqtt_cmd = {
                "command": "set individual so2 sensor sensitivity",
                "sensor_index": Number(sensor_index),
                "sensitivity_nA_PPM": Number(sensitivity_nA_PPM)
            }
            mqtt.MQTT_POST_Request("SO2_Sensor", device_ID, mqtt_cmd);
        }
        catch (e) {
            debug("[SO2_Sensor_API_MQTT] Set_Individual_SO2_Sensor_Sensitivity() Error " + e);
        }
    };
    self.Set_All_SO2_Sensor_Sensitivity = function (device_ID, sensitivity_nA_PPM) {
        try {
            var mqtt_cmd = {
                "command": "set all so2 sensor sensitivity",
                "sensitivity_nA_PPM": Number(sensitivity_nA_PPM)
            }
            mqtt.MQTT_POST_Request("SO2_Sensor", device_ID, mqtt_cmd);
        }
        catch (e) {
            debug("[SO2_Sensor_API_MQTT] Set_All_SO2_Sensor_Sensitivity() Error " + e);
        }
    };
    self.SO2_Sensor_Get_Num_Of_Sensor = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get num of so2 sensor"
            }
            return (await mqtt.MQTT_GET_Request("SO2_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[SO2_Sensor_API_MQTT] SO2_Sensor_Get_Num_Of_Sensor() Error " + e);
        }
    };
    self.SO2_Sensor_Get_Individual_Sensor_Status = async function (device_ID, sensor_index) {
        try {
            mqtt_cmd = {
                "command": "get individual so2 sensor measure",
                "sensor_index": sensor_index
            }
            return (await mqtt.MQTT_GET_Request("SO2_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[SO2_Sensor_API_MQTT] SO2_Sensor_Get_Individual_Sensor_Status() Error " + e);
        }
    };
    self.SO2_Sensor_Get_All_Sensor_Status = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get all so2 sensor measure"
            }
            return (await mqtt.MQTT_GET_Request("SO2_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[SO2_Sensor_API_MQTT] SO2_Sensor_Get_All_Sensor_Status() Error " + e);
        }
    };
    self.SO2_Sensor_Get_Individual_Sensor_Info = async function (device_ID, sensor_index) {
        try {
            mqtt_cmd = {
                "command": "get individual so2 sensor info",
                "sensor_index": sensor_index
            }
            return (await mqtt.MQTT_GET_Request("SO2_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[SO2_Sensor_API_MQTT] SO2_Sensor_Get_Individual_Sensor_Info() Error " + e);
        }
    };
    self.SO2_Sensor_Get_All_Sensor_Info = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get all so2 sensor info"
            }
            return (await mqtt.MQTT_GET_Request("SO2_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[SO2_Sensor_API_MQTT] SO2_Sensor_Get_All_Sensor_Info() Error " + e);
        }
    };
}

module.exports = SO2_Sensor_API_MQTT;
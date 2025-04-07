
var debug = require('debug')(require('path').basename(__filename));

var MQTT = require('../../MQTT.js');
var mqtt = new MQTT();

var O3_Sensor_API = function () {
    var self = this;
    
    self.Set_Individual_O3_Sensor_Sensitivity = function (device_ID, sensor_index, sensitivity_nA_PPM) {
        try {
            var mqtt_cmd = {
                "o3mmand": "set individual o3 sensor sensitivity",
                "sensor_index": Number(sensor_index),
                "sensitivity_nA_PPM": Number(sensitivity_nA_PPM)
            }
            mqtt.MQTT_POST_Request("O3_Sensor", device_ID, mqtt_cmd);
        }
        catch (e) {
            debug("[O3_Sensor_API] Set_Individual_O3_Sensor_Sensitivity() Error " + e);
        }
    };
    self.Set_All_O3_Sensor_Sensitivity = function (device_ID, sensitivity_nA_PPM) {
        try {
            var mqtt_cmd = {
                "o3mmand": "set all o3 sensor sensitivity",
                "sensitivity_nA_PPM": Number(sensitivity_nA_PPM)
            }
            mqtt.MQTT_POST_Request("O3_Sensor", device_ID, mqtt_cmd);
        }
        catch (e) {
            debug("[O3_Sensor_API] Set_All_O3_Sensor_Sensitivity() Error " + e);
        }
    };
    self.O3_Sensor_Get_Num_Of_Sensor = async function (device_ID) {
        try {
            mqtt_cmd = {
                "o3mmand": "get num of o3 sensor"
            }
            return (await mqtt.MQTT_GET_Request("O3_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[O3_Sensor_API] O3_Sensor_Get_Num_Of_Sensor() Error " + e);
        }
    };
    self.O3_Sensor_Get_Individual_Sensor_Status = async function (device_ID, sensor_index) {
        try {
            mqtt_cmd = {
                "o3mmand": "get individual o3 sensor measure",
                "sensor_index": sensor_index
            }
            return (await mqtt.MQTT_GET_Request("O3_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[O3_Sensor_API] O3_Sensor_Get_Individual_Sensor_Status() Error " + e);
        }
    };
    self.O3_Sensor_Get_All_Sensor_Status = async function (device_ID) {
        try {
            mqtt_cmd = {
                "o3mmand": "get all o3 sensor measure"
            }
            return (await mqtt.MQTT_GET_Request("O3_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[O3_Sensor_API] O3_Sensor_Get_All_Sensor_Status() Error " + e);
        }
    };
    self.O3_Sensor_Get_Individual_Sensor_Info = async function (device_ID, sensor_index) {
        try {
            mqtt_cmd = {
                "o3mmand": "get individual o3 sensor info",
                "sensor_index": sensor_index
            }
            return (await mqtt.MQTT_GET_Request("O3_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[O3_Sensor_API] O3_Sensor_Get_Individual_Sensor_Info() Error " + e);
        }
    };
    self.O3_Sensor_Get_All_Sensor_Info = async function (device_ID) {
        try {
            mqtt_cmd = {
                "o3mmand": "get all o3 sensor info"
            }
            return (await mqtt.MQTT_GET_Request("O3_Sensor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[O3_Sensor_API] O3_Sensor_Get_All_Sensor_Info() Error " + e);
        }
    };
}

module.exports = O3_Sensor_API;
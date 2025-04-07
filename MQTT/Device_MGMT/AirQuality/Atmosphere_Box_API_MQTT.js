
var debug = require('debug')(require('path').basename(__filename));

var MQTT = require('../../MQTT.js');
var mqtt = new MQTT();

var Atmosphere_Box_API_MQTT = function () {
    var self = this;
    
    self.Set_Atmosphere_Box_CO_Sensor_Sensitivity = function (device_ID, sensitivity_nA_PPM) {
        try {
            var mqtt_cmd = {
                "command": "set atmosphere box co sensor sensitivity",
                "sensitivity_nA_PPM": Number(sensitivity_nA_PPM)
            }
            mqtt.MQTT_POST_Request("Atmosphere_Box", device_ID, mqtt_cmd);
        }
        catch (e) {
            debug("[Atmosphere_Box_API_MQTT] Set_Atmosphere_Box_CO_Sensor_Sensitivity() Error " + e);
        }
    };
    self.Set_Atmosphere_Box_CO_Sensor_Resistance = function (device_ID, sensor_resistance) {
        try {
            var mqtt_cmd = {
                "command": "set atmosphere box co sensor resistance",
                "sensor_resistance": Number(sensor_resistance)
            }
            mqtt.MQTT_POST_Request("Atmosphere_Box", device_ID, mqtt_cmd);
        }
        catch (e) {
            debug("[Atmosphere_Box_API_MQTT] Set_Atmosphere_Box_CO_Sensor_Resistance() Error " + e);
        }
    };
    self.Set_Atmosphere_Box_CO_Sensor_Sensitivity_And_Resistance = function (device_ID, sensitivity_nA_PPM, sensor_resistance) {
        try {
            var mqtt_cmd = {
                "command": "set atmosphere box co sensor sensitivity and resistance",
                "sensitivity_nA_PPM": Number(sensitivity_nA_PPM),
                "sensor_resistance": Number(sensor_resistance)
            }
            mqtt.MQTT_POST_Request("Atmosphere_Box", device_ID, mqtt_cmd);
        }
        catch (e) {
            debug("[Atmosphere_Box_API_MQTT] Set_Atmosphere_Box_CO_Sensor_Sensitivity_And_Resistance() Error " + e);
        }
    };
    self.Atmosphere_Box_Get_Sensor_Status = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get atmosphere box sensor measure"
            }
            return (await mqtt.MQTT_GET_Request("Atmosphere_Box", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Atmosphere_Box_API_MQTT] Atmosphere_Box_Get_All_Sensor_Status() Error " + e);
        }
    };
    self.Atmosphere_Box_Get_Sensor_Info = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get atmosphere box sensor info"
            }
            return (await mqtt.MQTT_GET_Request("Atmosphere_Box", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Atmosphere_Box_API_MQTT] Atmosphere_Box_Get_All_Sensor_Info() Error " + e);
        }
    };
}

module.exports = Atmosphere_Box_API_MQTT;
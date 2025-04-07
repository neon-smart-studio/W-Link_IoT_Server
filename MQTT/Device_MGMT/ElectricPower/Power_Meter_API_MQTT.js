
var debug = require('debug')(require('path').basename(__filename));

var MQTT = require('../../MQTT.js');
var mqtt = new MQTT();

var Power_Meter_API = function () {
    var self = this;

    self.Get_Num_Of_Power_Meter = async function (device_ID) {
        try {
            var mqtt_cmd = {
                "command": "get num of power meter"
            }
            return (await mqtt.MQTT_GET_Request("Power_Meter", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Power_Meter_API] Get_Num_Of_Power_Meter() Error " + e);
        }
    };
    self.Get_Power_Meter_Individual_Meter_Status = async function (device_ID, meter_index) {
        try {
            var mqtt_cmd = {
                "meter_index": meter_index,
                "command": "get power meter individual meter status"
            }
            return (await mqtt.MQTT_GET_Request("Power_Meter", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Power_Meter_API] Get_Power_Meter_Individual_Meter_Status() Error " + e);
        }
    };
    self.Get_Power_Meter_All_Meter_Status = async function (device_ID) {
        try {
            var mqtt_cmd = {
                "command": "get power meter all meter status"
            }
            return (await mqtt.MQTT_GET_Request("Power_Meter", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Power_Meter_API] Get_Power_Meter_All_Meter_Status() Error " + e);
        }
    };
    self.Power_Meter_Set_Individual_Meter_On_Off = async function (device_ID, meter_index, on_off) {
        try {
            var mqtt_cmd = {
                "command": "set individual meter on/off state",
                "on_off": on_off,
                "meter_index": Number(meter_index)
            }
            mqtt.MQTT_POST_Request("Power_Meter", device_ID, mqtt_cmd);
        }
        catch (e) {
            debug("[Power_Meter_API] Power_Meter_Set_Individual_Meter_On_Off() Error " + e);
        }
    };
    self.Power_Meter_Toggle_Individual_Meter_On_Off = async function (device_ID, meter_index) {
        try {
            var mqtt_cmd = {
                "command": "toggle individual meter on/off state",
                "meter_index": Number(meter_index)
            }
            mqtt.MQTT_POST_Request("Power_Meter", device_ID, mqtt_cmd);
        }
        catch (e) {
            debug("[Power_Meter_API] Power_Meter_Toggle_Individual_Meter_On_Off() Error " + e);
        }
    };
    self.Power_Meter_Set_All_Meter_On_Off = async function (device_ID, on_off) {
        try {
            var mqtt_cmd = {
                "command": "set all meter on/off state",
                "on_off": on_off,
            }
            mqtt.MQTT_POST_Request("Power_Meter", device_ID, mqtt_cmd);
        }
        catch (e) {
            debug("[Power_Meter_API] Power_Meter_Set_All_Meter_On_Off() Error " + e);
        }
    };
    self.Power_Meter_Toggle_All_Meter_On_Off = async function (device_ID) {
        try {
            var mqtt_cmd = {
                "command": "toggle all meter on/off state"
            }
            mqtt.MQTT_POST_Request("Power_Meter", device_ID, mqtt_cmd);
        }
        catch (e) {
            debug("[Power_Meter_API] Power_Meter_Toggle_All_Meter_On_Off() Error " + e);
        }
    };
};

module.exports = Power_Meter_API;
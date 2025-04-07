
var debug = require('debug')(require('path').basename(__filename));

var util = require("util");

var MQTT = require('../../MQTT.js');
var mqtt = new MQTT();

var OnOff_Socket_API_MQTT = function () {
    var self = this;

    self.Get_Num_Of_OnOff_Socket = async function (device_ID) {
        try {
            var mqtt_cmd = {
                "command": "get num of on off socket"
            }
            return (await mqtt.MQTT_GET_Request("OnOff_Socket", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[OnOff_Socket_API_MQTT] Get_Num_Of_OnOff_Socket() Error " + e);
        }
    };
    self.Get_OnOff_Socket_Individual_Socket_Status = async function (device_ID, socket_index) {
        try {
            var mqtt_cmd = {
                "socket_index": socket_index,
                "command": "get on off socket individual socket status"
            }
            return (await mqtt.MQTT_GET_Request("OnOff_Socket", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[OnOff_Socket_API_MQTT] Get_OnOff_Socket_Individual_Socket_Status() Error " + e);
        }
    };
    self.Get_OnOff_Socket_All_Socket_Status = async function (device_ID) {
        try {
            var mqtt_cmd = {
                "command": "get on off socket all socket status"
            }
            return (await mqtt.MQTT_GET_Request("OnOff_Socket", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[OnOff_Socket_API_MQTT] Get_OnOff_Socket_All_Socket_Status() Error " + e);
        }
    };
    self.OnOff_Socket_Set_Individual_Socket_On_Off = async function (device_ID, socket_index, on_off) {
        try {
            var mqtt_cmd = {
                "command": "set individual socket on/off state",
                "on_off": on_off,
                "socket_index": Number(socket_index)
            }
            mqtt.MQTT_POST_Request("OnOff_Socket", device_ID, mqtt_cmd);
        }
        catch (e) {
            debug("[OnOff_Socket_API_MQTT] OnOff_Socket_Set_Individual_Socket_On_Off() Error " + e);
        }
    };
    self.OnOff_Socket_Toggle_Individual_Socket_On_Off = async function (device_ID, socket_index) {
        try {
            var mqtt_cmd = {
                "command": "toggle individual socket on/off state",
                "socket_index": Number(socket_index)
            }
            mqtt.MQTT_POST_Request("OnOff_Socket", device_ID, mqtt_cmd);
        }
        catch (e) {
            debug("[OnOff_Socket_API_MQTT] OnOff_Socket_Toggle_Individual_Socket_On_Off() Error " + e);
        }
    };
    self.OnOff_Socket_Set_All_Socket_On_Off = async function (device_ID, on_off) {
        try {
            var mqtt_cmd = {
                "command": "set all socket on/off state",
                "on_off": on_off,
            }
            mqtt.MQTT_POST_Request("OnOff_Socket", device_ID, mqtt_cmd);
        }
        catch (e) {
            debug("[OnOff_Socket_API_MQTT] OnOff_Socket_Set_All_Socket_On_Off() Error " + e);
        }
    };
    self.OnOff_Socket_Toggle_All_Socket_On_Off = async function (device_ID) {
        try {
            var mqtt_cmd = {
                "command": "toggle all socket on/off state"
            }
            mqtt.MQTT_POST_Request("OnOff_Socket", device_ID, mqtt_cmd);
        }
        catch (e) {
            debug("[OnOff_Socket_API_MQTT] OnOff_Socket_Toggle_All_Socket_On_Off() Error " + e);
        }
    };
};

module.exports = OnOff_Socket_API_MQTT;

var debug = require('debug')(require('path').basename(__filename));

var MQTT = require('../../MQTT.js');
var mqtt = new MQTT();

var EM_Valve_API_MQTT = function () {
    var self = this;
    
    self.EM_Valve_Get_Num_Of_Switch = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get num of switch"
            }
            return (await mqtt.MQTT_GET_Request("Electromagnetic_Valve", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[EM_Valve_API_MQTT] EM_Valve_Get_Num_Of_Switch() Error " + e);
        }
    };
    self.EM_Valve_Get_Main_Switch_Status = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get electromagnetic valve main switch status"
            }
            return (await mqtt.MQTT_GET_Request("Electromagnetic_Valve", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[EM_Valve_API_MQTT] EM_Valve_Get_Main_Switch_Status() Error " + e);
        }
    };
    self.EM_Valve_Get_Individual_Switch_Status = async function (device_ID, sw_index) {
        try {
            mqtt_cmd = {
                "command": "get electromagnetic valve individual switch status",
                "sw_index": sw_index
            }
            return (await mqtt.MQTT_GET_Request("Electromagnetic_Valve", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[EM_Valve_API_MQTT] EM_Valve_Get_Individual_Switch_Status() Error " + e);
        }
    };
    self.EM_Valve_Get_All_Switch_Status = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get electromagnetic valve all switch status"
            }
            return (await mqtt.MQTT_GET_Request("Electromagnetic_Valve", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[EM_Valve_API_MQTT] EM_Valve_Get_All_Switch_Status() Error " + e);
        }
    };
    self.EM_Valve_Main_Switch_Enable_Disable = function (device_ID, en_dis) {
        try {
            mqtt_cmd = {
                "command": "set main switch en/dis state",
                "enabled": en_dis
            };
            mqtt.MQTT_POST_Request("Electromagnetic_Valve", device_ID, mqtt_cmd);
        }
        catch (e) {
            debug("[EM_Valve_API_MQTT] EM_Valve_Main_Switch_Enable_Disable() Error " + e);
        }
    };
    self.EM_Valve_Main_Switch_On_Off = function (device_ID, on_off) {
        try {
            mqtt_cmd = {
                "command": "set main switch on/off state",
                "on_off": on_off
            };
            mqtt.MQTT_POST_Request("Electromagnetic_Valve", device_ID, mqtt_cmd);
        }
        catch (e) {
            debug("[EM_Valve_API_MQTT] EM_Valve_Main_Switch_On_Off() Error " + e);
        }
    };
    self.EM_Valve_Individual_Switch_Enable_Disable = function (device_ID, sw_index, en_dis) {
        try {
            mqtt_cmd = {
                "command": "set individual switch en/dis state",
                "enabled": en_dis,
                "sw_index": sw_index
            };
            mqtt.MQTT_POST_Request("Electromagnetic_Valve", device_ID, mqtt_cmd);
        }
        catch (e) {
            debug("[EM_Valve_API_MQTT] EM_Valve_Individual_Switch_Enable_Disable() Error " + e);
        }
    };
    self.EM_Valve_Individual_Switch_On_Off = function (device_ID, sw_index, on_off) {
        try {
            mqtt_cmd = {
                "command": "set individual switch on/off state",
                "on_off": on_off,
                "sw_index": sw_index
            };
            mqtt.MQTT_POST_Request("Electromagnetic_Valve", device_ID, mqtt_cmd);
        }
        catch (e) {
            debug("[EM_Valve_API_MQTT] EM_Valve_Individual_Switch_On_Off() Error " + e);
        }
    };
};

module.exports = EM_Valve_API_MQTT;
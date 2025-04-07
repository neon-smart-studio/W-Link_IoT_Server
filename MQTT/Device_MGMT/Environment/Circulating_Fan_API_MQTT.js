
var debug = require('debug')(require('path').basename(__filename));

var MQTT = require('../../MQTT.js');
var mqtt = new MQTT();

var Circulating_Fan_API_MQTT = function () {
    var self = this;
    
    self.Circulating_Fan_Get_All_Status = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get circulating fan all status"
            }
            return (await mqtt.MQTT_GET_Request("Circulating_Fan", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Circulating_Fan_API_MQTT] Circulating_Fan_Get_All_Status() Error " + e);
        }
    };
    self.Circulating_Fan_Get_On_Off_Status = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get on off status"
            }
            return (await mqtt.MQTT_GET_Request("Circulating_Fan", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Circulating_Fan_API_MQTT] Circulating_Fan_Get_On_Off_Status() Error " + e);
        }
    };
    self.Circulating_Fan_Get_Current_PWM_Level = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get current pwm level"
            }
            return (await mqtt.MQTT_GET_Request("Circulating_Fan", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Circulating_Fan_API_MQTT] Circulating_Fan_Get_Current_PWM_Level() Error " + e);
        }
    };
    self.Circulating_Fan_Turn_On_Off = function (device_ID, on_off) {
        try {
            if (on_off == true) {
                mqtt_cmd = {
                    "command": "turn on fan"
                };
            }
            else {
                mqtt_cmd = {
                    "command": "turn off fan"
                };
            }
            mqtt.MQTT_POST_Request("Circulating_Fan", device_ID, mqtt_cmd);
        }
        catch (e) {
            debug("[Circulating_Fan_API_MQTT] Circulating_Fan_Turn_On_Off() Error " + e);
        }
    };
    self.Circulating_Fan_Toggle_On_Off = function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "toggle fan on off"
            };
            mqtt.MQTT_POST_Request("Circulating_Fan", device_ID, mqtt_cmd);
        }
        catch (e) {
            debug("[Circulating_Fan_API_MQTT] Circulating_Fan_Toggle_On_Off() Error " + e);
        }
    };
    self.Circulating_Fan_Set_PWM_Level = function (device_ID, level) {
        try {
            mqtt_cmd = {
                "command": "set pwm level",
                "level": level
            };
            mqtt.MQTT_POST_Request("Circulating_Fan", device_ID, mqtt_cmd);
        }
        catch (e) {
            debug("[Circulating_Fan_API_MQTT] Circulating_Fan_Set_PWM_Level() Error " + e);
        }
    };
    self.Circulating_Fan_Step_PWM_Level_Up = function (device_ID, step_lvl) {
        try {
            mqtt_cmd = {
                command: "pwm step level up",
                step_up_size: step_lvl
            };
            mqtt.MQTT_POST_Request("Circulating_Fan", device_ID, mqtt_cmd);
        }
        catch (e) {
            debug("[Circulating_Fan_API_MQTT] Circulating_Fan_Step_PWM_Level_Up() Error " + e);
        }
    };
    self.Circulating_Fan_Step_PWM_Level_Down = function (device_ID, step_lvl) {
        try {
            mqtt_cmd = {
                command: "pwm step level down",
                step_down_size: step_lvl
            };
            mqtt.MQTT_POST_Request("Circulating_Fan", device_ID, mqtt_cmd);
        }
        catch (e) {
            debug("[Circulating_Fan_API_MQTT] Circulating_Fan_Step_PWM_Level_Down() Error " + e);
        }
    };
};

module.exports = Circulating_Fan_API_MQTT;
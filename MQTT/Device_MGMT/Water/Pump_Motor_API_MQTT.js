
var debug = require('debug')(require('path').basename(__filename));

var MQTT = require('../../MQTT.js');
var mqtt = new MQTT();

var Pump_Motor_API_MQTT = function () {
    var self = this;
    
    self.Pump_Motor_Get_All_Status = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get pump motor all status"
            }
            return (await mqtt.MQTT_GET_Request("Pump_Motor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Pump_Motor_API_MQTT] Pump_Motor_Get_All_Status() Error " + e);
        }
    };
    self.Pump_Motor_Get_On_Off_Status = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get on off status"
            }
            return (await mqtt.MQTT_GET_Request("Pump_Motor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Pump_Motor_API_MQTT] Pump_Motor_Get_On_Off_Status() Error " + e);
        }
    };
    self.Pump_Motor_Get_Current_PWM_Level = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get current pwm level"
            }
            return (await mqtt.MQTT_GET_Request("Pump_Motor", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Pump_Motor_API_MQTT] Pump_Motor_Get_Current_PWM_Level() Error " + e);
        }
    };
    self.Pump_Motor_Turn_On_Off = function (device_ID, on_off) {
        try {
            if (on_off == true) {
                mqtt_cmd = {
                    "command": "turn on motor"
                };
            }
            else {
                mqtt_cmd = {
                    "command": "turn off motor"
                };
            }
            mqtt.MQTT_POST_Request("Pump_Motor", device_ID, mqtt_cmd);
        }
        catch (e) {
            debug("[Pump_Motor_API_MQTT] Pump_Motor_Turn_On_Off() Error " + e);
        }
    };
    self.Pump_Motor_Toggle_On_Off = function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "toggle fan on off"
            };
            mqtt.MQTT_POST_Request("Pump_Motor", device_ID, mqtt_cmd);
        }
        catch (e) {
            debug("[Pump_Motor_API_MQTT] Pump_Motor_Toggle_On_Off() Error " + e);
        }
    };
    self.Pump_Motor_Set_PWM_Level = function (device_ID, level) {
        try {
            mqtt_cmd = {
                "command": "set pwm level",
                "level": level
            };
            mqtt.MQTT_POST_Request("Pump_Motor", device_ID, mqtt_cmd);
        }
        catch (e) {
            debug("[Pump_Motor_API_MQTT] Pump_Motor_Set_PWM_Level() Error " + e);
        }
    };
    self.Pump_Motor_Step_PWM_Level_Up = function (device_ID, step_lvl) {
        try {
            mqtt_cmd = {
                command: "pwm step level up",
                step_up_size: step_lvl
            };
            mqtt.MQTT_POST_Request("Pump_Motor", device_ID, mqtt_cmd);
        }
        catch (e) {
            debug("[Pump_Motor_API_MQTT] Pump_Motor_Step_PWM_Level_Up() Error " + e);
        }
    };
    self.Pump_Motor_Step_PWM_Level_Down = function (device_ID, step_lvl) {
        try {
            mqtt_cmd = {
                command: "pwm step level down",
                step_up_size: step_lvl
            };
            mqtt.MQTT_POST_Request("Pump_Motor", device_ID, mqtt_cmd);
        }
        catch (e) {
            debug("[Pump_Motor_API_MQTT] Pump_Motor_Step_PWM_Level_Down() Error " + e);
        }
    };
};

module.exports = Pump_Motor_API_MQTT;
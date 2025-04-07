
var debug = require('debug')(require('path').basename(__filename));

var util = require("util");

var MQTT = require('../../MQTT.js');
var mqtt = new MQTT();

var Dimmable_Socket_API_MQTT = function (){
    var self = this;
    
    self.Get_Num_Of_Dimmable_Socket = async function(device_ID)
    {
        try{
            var mqtt_cmd = {
                "command":"get num of dimmable socket"
            }
            return (await mqtt.MQTT_GET_Request("Dimmable_Socket", device_ID, mqtt_cmd));
        }
        catch(e)
        {
            debug("[Dimmable_Socket_API_MQTT] Get_Num_Of_Dimmable_Socket() Error " + e);
        }
    };
    self.Get_Dimmable_Socket_Individual_Socket_Status = async function(device_ID, socket_index)
    {
        try{
            var mqtt_cmd = {
                "socket_index": socket_index,
                "command":"get dimmable socket individual socket status"
            }
            return (await mqtt.MQTT_GET_Request("Dimmable_Socket", device_ID, mqtt_cmd));
        }
        catch(e)
        {
            debug("[Dimmable_Socket_API_MQTT] Get_Dimmable_Socket_Individual_Socket_Status() Error " + e);
        }
    };
    self.Get_Dimmable_Socket_All_Socket_Status = async function(device_ID)
    {
        try{
            var mqtt_cmd = {
                "command":"get dimmable socket all socket status"
            }
            return (await mqtt.MQTT_GET_Request("Dimmable_Socket", device_ID, mqtt_cmd));
        }
        catch(e)
        {
            debug("[Dimmable_Socket_API_MQTT] Get_Dimmable_Socket_All_Socket_Status() Error " + e);
        }
    };
    self.Dimmable_Socket_Set_Individual_Socket_On_Off = function(device_ID, socket_index, on_off)
    {
        try{
            var mqtt_cmd = {
                "command":"set individual socket on/off state",
                "on_off":on_off,
                "socket_index":Number(socket_index)
            }
            mqtt.MQTT_POST_Request("Dimmable_Socket", device_ID, mqtt_cmd);
        }
        catch(e)
        {
            debug("[Dimmable_Socket_API_MQTT] Dimmable_Socket_Set_Individual_Socket_On_Off() Error " + e);
        }
    };
    self.Dimmable_Socket_Toggle_Individual_Socket_On_Off = function(device_ID, socket_index)
    {
        try{
            var mqtt_cmd = {
                "command":"toggle socket on/off state",
                "socket_index":Number(socket_index)
            }
            mqtt.MQTT_POST_Request("Dimmable_Socket", device_ID, mqtt_cmd);
        }
        catch(e)
        {
            debug("[Dimmable_Socket_API_MQTT] Dimmable_Socket_Toggle_Individual_Socket_On_Off() Error " + e);
        }
    };
    self.Dimmable_Socket_Set_All_Socket_On_Off = function(device_ID, on_off)
    {
        try{
            var mqtt_cmd = {
                "command":"set all socket on/off state",
                "on_off":on_off,
            }
            mqtt.MQTT_POST_Request("Dimmable_Socket", device_ID, mqtt_cmd);
        }
        catch(e)
        {
            debug("[Dimmable_Socket_API_MQTT] Dimmable_Socket_Set_All_Socket_On_Off() Error " + e);
        }
    };
    self.Dimmable_Socket_Toggle_All_Socket_On_Off = function(device_ID)
    {
        try{
            var mqtt_cmd = {
                "command":"toggle all socket on/off state"
            }
            mqtt.MQTT_POST_Request("Dimmable_Socket", device_ID, mqtt_cmd);
        }
        catch(e)
        {
            debug("[Dimmable_Socket_API_MQTT] Dimmable_Socket_Toggle_All_Socket_On_Off() Error " + e);
        }
    };
    self.Dimmable_Socket_Set_Individual_Socket_PWM_Level = function(device_ID, socket_index, pwm_lvl)
    {
        try{
            var mqtt_cmd = {
                "command":"set individual socket pwm level",
                "pwm_level":Number(pwm_lvl),
                "socket_index":Number(socket_index)
            }
            mqtt.MQTT_POST_Request("Dimmable_Socket", device_ID, mqtt_cmd);
        }
        catch(e)
        {
            debug("[Dimmable_Socket_API_MQTT] Dimmable_Socket_Set_Individual_Socket_PWM_Level() Error " + e);
        }
    };
    self.Dimmable_Socket_Set_All_Socket_PWM_Level = function(device_ID, pwm_lvl)
    {
        try{
            var mqtt_cmd = {
                "command":"set all socket pwm level",
                "pwm_level":Number(pwm_lvl)
            }
            mqtt.MQTT_POST_Request("Dimmable_Socket", device_ID, mqtt_cmd);
        }
        catch(e)
        {
            debug("[Dimmable_Socket_API_MQTT] Dimmable_Socket_Set_All_Socket_PWM_Level() Error " + e);
        }
    };
};

module.exports = Dimmable_Socket_API_MQTT;
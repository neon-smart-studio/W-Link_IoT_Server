
var debug = require('debug')(require('path').basename(__filename));

var MQTT = require('../../MQTT.js');
var mqtt = new MQTT();

var Road_Sign_API_MQTT = function () {
    var self = this;
    
    self.Road_Sign_Set_Max_Speed_Limit = function (device_ID, max_speed_percentage) {
        try {
            var mqtt_cmd = {
                "command": "road sign set max speed limit percentage",
                "max_speed_percentage": Number(max_speed_percentage)
            }
            mqtt.MQTT_POST_Request("Road_Sign", device_ID, mqtt_cmd);
        }
        catch (e) {
            debug("[Road_Sign_API_MQTT] Road_Sign_Set_Max_Speed_Limit() Error " + e);
        }
    };
    self.Road_Sign_Get_Current_Alerting_State = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get road sign current alerting state"
            }
            return (await mqtt.MQTT_GET_Request("Road_Sign", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Road_Sign_API_MQTT] Road_Sign_Get_Current_Alerting_State() Error " + e);
        }
    };
    self.Road_Sign_Get_Max_Speed_Limit_Percentage = async function (device_ID) {
        try {
            mqtt_cmd = {
                command: "get road sign max speed limit percentage"
            }
            return (await mqtt.MQTT_GET_Request("Road_Sign", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Road_Sign_API_MQTT] Road_Sign_Get_Max_Speed_Limit_Percentage() Error " + e);
        }
    };
    self.Road_Sign_Get_All_Status = async function (device_ID) {
        try {
            mqtt_cmd = {
                command: "get road sign all status"
            }
            return (await mqtt.MQTT_GET_Request("Road_Sign", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Road_Sign_API_MQTT] Road_Sign_Get_All_Status() Error " + e);
        }
    };
}

module.exports = Road_Sign_API_MQTT;
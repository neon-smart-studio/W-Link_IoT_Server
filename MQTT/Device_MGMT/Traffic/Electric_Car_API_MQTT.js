
var debug = require('debug')(require('path').basename(__filename));

var MQTT = require('../../MQTT.js');
var mqtt = new MQTT();

var Electric_Car_API_MQTT = function () {
    var self = this;
    
    self.Electric_Car_Move_Forward = function (device_ID, move_speed_percentage) {
        try {
            var mqtt_cmd = {
                "command": "car move forward",
                "move_speed_percentage": Number(move_speed_percentage)
            }
            mqtt.MQTT_POST_Request("Electric_Car", device_ID, mqtt_cmd);
        }
        catch (e) {
            debug("[Electric_Car_API_MQTT] Electric_Car_Move_Forward() Error " + e);
        }
    };
    self.Electric_Car_Move_Back = function (device_ID, move_speed_percentage) {
        try {
            var mqtt_cmd = {
                "command": "car move back",
                "move_speed_percentage": Number(move_speed_percentage)
            }
            mqtt.MQTT_POST_Request("Electric_Car", device_ID, mqtt_cmd);
        }
        catch (e) {
            debug("[Electric_Car_API_MQTT] Electric_Car_Move_Back() Error " + e);
        }
    };
    self.Electric_Car_Stop = function (device_ID) {
        try {
            var mqtt_cmd = {
                "command": "car stop"
            }
            mqtt.MQTT_POST_Request("Electric_Car", device_ID, mqtt_cmd);
        }
        catch (e) {
            debug("[Electric_Car_API_MQTT] Electric_Car_Stop() Error " + e);
        }
    };
    self.Electric_Car_Turn_Left = function (device_ID, degree) {
        try {
            var mqtt_cmd = {
                "command": "car turn left",
                "turn_left_degree": Number(degree)
            }
            mqtt.MQTT_POST_Request("Electric_Car", device_ID, mqtt_cmd);
        }
        catch (e) {
            debug("[Electric_Car_API_MQTT] Electric_Car_Turn_Left() Error " + e);
        }
    };
    self.Electric_Car_Turn_Right = function (device_ID, degree) {
        try {
            var mqtt_cmd = {
                "command": "car turn right",
                "turn_left_degree": Number(degree)
            }
            mqtt.MQTT_POST_Request("Electric_Car", device_ID, mqtt_cmd);
        }
        catch (e) {
            debug("[Electric_Car_API_MQTT] Electric_Car_Turn_Right() Error " + e);
        }
    };
    self.Electric_Car_Turn_Straight = function (device_ID) {
        try {
            var mqtt_cmd = {
                "command": "car turn straight"
            }
            mqtt.MQTT_POST_Request("Electric_Car", device_ID, mqtt_cmd);
        }
        catch (e) {
            debug("[Electric_Car_API_MQTT] Electric_Car_Turn_Straight() Error " + e);
        }
    };
    self.Electric_Car_Set_Traffic_Light_State = function (device_ID, traffic_light_state) {
        try {
            var mqtt_cmd = {};
            switch(traffic_light_state)
            {
                case "Green":
                case "Yellow":
                case "Red":
                    mqtt_cmd = {
                        "command": "car set traffic light state",
                        "traffic_light_state": traffic_light_state
                    };
                    break;
                default:
                    return;
            }
            mqtt.MQTT_POST_Request("Electric_Car", device_ID, mqtt_cmd);
        }
        catch (e) {
            debug("[Electric_Car_API_MQTT] Electric_Car_Set_Traffic_Light_State() Error " + e);
        }
    };
    self.Electric_Car_Set_Max_Speed_Limit = function (device_ID, max_speed_percentage) {
        try {
            var mqtt_cmd = {
                "command": "car set max speed limit percentage",
                "max_speed_percentage": Number(max_speed_percentage)
            }
            mqtt.MQTT_POST_Request("Electric_Car", device_ID, mqtt_cmd);
        }
        catch (e) {
            debug("[Electric_Car_API_MQTT] Electric_Car_Set_Max_Speed_Limit() Error " + e);
        }
    };
    self.Electric_Car_Get_Current_Speed_Percentage = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get car current speed percentage"
            }
            return (await mqtt.MQTT_GET_Request("Electric_Car", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Electric_Car_API_MQTT] Electric_Car_Get_Current_Speed_Percentage() Error " + e);
        }
    };
    self.Electric_Car_Get_Current_Traffic_Light_State = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get car current traffic light state"
            }
            return (await mqtt.MQTT_GET_Request("Electric_Car", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Electric_Car_API_MQTT] Electric_Car_Get_Current_Traffic_Light_State() Error " + e);
        }
    };
    self.Electric_Car_Get_Max_Speed_Limit_Percentage = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get car max speed limit percentage"
            }
            return (await mqtt.MQTT_GET_Request("Electric_Car", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Electric_Car_API_MQTT] Electric_Car_Get_Max_Speed_Limit_Percentage() Error " + e);
        }
    };
    self.Electric_Car_Get_All_Status = async function (device_ID) {
        try {
            mqtt_cmd = {
                command: "get car all status"
            }
            return (await mqtt.MQTT_GET_Request("Electric_Car", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Electric_Car_API_MQTT] Electric_Car_Get_All_Status() Error " + e);
        }
    };
}

module.exports = Electric_Car_API_MQTT;
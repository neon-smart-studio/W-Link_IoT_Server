
var debug = require('debug')(require('path').basename(__filename));

var Pump_Motor_API = require('../../../Device_MGMT/Water/Pump_Motor_API.js');
var pump_motor_api = new Pump_Motor_API();

var Pump_Motor_API_MQTT = require('./Pump_Motor_API_MQTT.js');
var pump_motor_api_mqtt = new Pump_Motor_API_MQTT();

var WebSocket = require('../../../Web/WebSocket.js');
var websocket = new WebSocket();

var Pump_Motor_MQTT = function () {
    var self = this;

    self.Process_Pump_Motor_MQTT_POST_Message = async function (username, device_ID, post_pump_motor_json_data) {
        try {
            if (post_pump_motor_json_data.command != null) {
                var ws_report_cmd = {};
                var motor_status = [];

                switch (post_pump_motor_json_data.command) {
                    case "report pump motor status change":
                        motor_status = {
                            "on_off": post_pump_motor_json_data.on_off,
                            "pwm_level": post_pump_motor_json_data.current_pwm_level
                        }

                        ws_report_cmd = {
                            "command_type": "Pump Motor",
                            "command": "Report Pump Motor Status Change",
                            "device_ID": device_ID,
                            "on_off": post_pump_motor_json_data.on_off,
                            "pwm_level": post_pump_motor_json_data.current_pwm_level
                        }
                        websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User(username, 'Water', ws_report_cmd);
                        
                        break;
                }
            }
        }
        catch (e) {
            debug("[Pump_Motor_MQTT] Process_Pump_Motor_MQTT_POST_Message() Error " + e);
        };
    }

    self.Process_Pump_Motor_MQTT_GET_Message = async function (username, device_ID, get_pump_motor_json_data, rsp_callback) {
        try {
            if (get_pump_motor_json_data.command != null) {
                switch (get_pump_motor_json_data.command) {
                }
            }
        }
        catch (e) {
            debug("[Pump_Motor_MQTT] Process_Pump_Motor_MQTT_GET_Message() Error " + e);
        };
    }
}
module.exports = Pump_Motor_MQTT;
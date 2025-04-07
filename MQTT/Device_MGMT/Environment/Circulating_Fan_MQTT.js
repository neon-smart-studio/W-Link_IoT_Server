
var debug = require('debug')(require('path').basename(__filename));

var Circulating_Fan_API = require('../../../Device_MGMT/Environment/Circulating_Fan_API.js');
var circulating_fan_api = new Circulating_Fan_API();

var WebSocket = require('../../../Web/WebSocket.js');
var websocket = new WebSocket();

var Circulating_Fan_MQTT = function () {
    var self = this;

    self.Process_Circulating_Fan_MQTT_POST_Message = async function (username, device_ID, post_circulating_fan_json_data) {
        try {
            if (post_circulating_fan_json_data.command != null) {
                var ws_report_cmd = {};
                var fan_status = [];
                switch (post_circulating_fan_json_data.command) {
                    case "report circulating fan status change":
                        fan_status = {
                            "on_off": post_circulating_fan_json_data.on_off,
                            "pwm_level": post_circulating_fan_json_data.current_pwm_level
                        }

                        ws_report_cmd = {
                            "command_type": "Circulating Fan",
                            "command": "Report Circulating Fan Status Change",
                            "device_ID": device_ID,
                            "on_off": post_circulating_fan_json_data.on_off,
                            "pwm_level": post_circulating_fan_json_data.current_pwm_level
                        }
                        websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User(username, 'Environment', ws_report_cmd);
                        
                        break;
                }
            }
        }
        catch (e) {
            debug("[Circulating_Fan_MQTT] Process_Circulating_Fan_MQTT_POST_Message() Error " + e);
        }
    }

    self.Process_Circulating_Fan_MQTT_GET_Message = async function (username, device_ID, get_circulating_fan_json_data, rsp_callback) {
        try {
            if (get_circulating_fan_json_data.command != null) {
                switch (get_circulating_fan_json_data.command) {
                }
            }
        }
        catch (e) {
            debug("[Circulating_Fan_MQTT] Process_Circulating_Fan_MQTT_GET_Message() Error " + e);
        }
    }
}
module.exports = Circulating_Fan_MQTT;
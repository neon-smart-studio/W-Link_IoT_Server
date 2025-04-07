
var debug = require('debug')(require('path').basename(__filename));

var Dimmable_Socket_API = require('../../../Device_MGMT/ElectricPower/Dimmable_Socket_API.js');
var dimmable_socket_api = new Dimmable_Socket_API();

var WebSocket = require('../../../Web/WebSocket.js');
var websocket = new WebSocket();

var Dimmable_Socket_MQTT = function () {
    var self = this;

    self.Process_Dimmable_Socket_MQTT_POST_Message = async function (username, device_ID, post_dimmable_socket_json_data) {
        try {
            if (post_dimmable_socket_json_data.command != null) {
                var socket_status_list = [];
                var ws_report_cmd = {};
                
                switch (post_dimmable_socket_json_data.command) {
                    case "report dimmable socket status change":

                        for(var i = 0; i<post_dimmable_socket_json_data.num_of_dimmable_socket; i++)
                        {
                            socket_status_list.push({
                                "socket_index": post_dimmable_socket_json_data.individual_socket_status[i].socket_index,
                                "on_off": post_dimmable_socket_json_data.individual_socket_status[i].on_off,
                                "pwm_level": post_dimmable_socket_json_data.individual_socket_status[i].pwm_level
                            });
                        }
                        
                        ws_report_cmd = {
                            "command_type": "Dimmable Socket",
                            "command": "Report Dimmable Socket Status Change",
                            "device_ID": device_ID,
                            "num_of_dimmable_socket": post_dimmable_socket_json_data.num_of_dimmable_socket,
                            "socket_status_list": socket_status_list
                        }
                        websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User(username, 'Electrical', ws_report_cmd);
                        
                        break;
                }
            }
        }
        catch (e) {
            debug("[Dimmable_Socket_MQTT] Process_Dimmable_Socket_MQTT_POST_Message() Error " + e);
        }
    }

    self.Process_Dimmable_Socket_MQTT_GET_Message = async function (username, device_ID, get_dimmable_socket_json_data, rsp_callback) {
        try {
            if (get_dimmable_socket_json_data.command != null) {
                switch (get_dimmable_socket_json_data.command) {
                }
            }
        }
        catch (e) {
            debug("[Dimmable_Socket_MQTT] Process_Dimmable_Socket_MQTT_GET_Message() Error " + e);
        }
    }
}
module.exports = Dimmable_Socket_MQTT;
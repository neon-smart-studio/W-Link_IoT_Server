
var debug = require('debug')(require('path').basename(__filename));

var OnOff_Socket_API = require('../../../Device_MGMT/ElectricPower/OnOff_Socket_API.js');
var onoff_socket_api = new OnOff_Socket_API();

var WebSocket = require('../../../Web/WebSocket.js');
var websocket = new WebSocket();

var OnOff_Socket_MQTT = function () {
    var self = this;

    self.Process_OnOff_Socket_MQTT_POST_Message = async function (username, device_ID, post_onoff_socket_json_data) {
        try {
            if (post_onoff_socket_json_data.command != null) {
                var socket_status_list = [];
                var ws_report_cmd = {};

                switch (post_onoff_socket_json_data.command) {
                    case "report on off socket status change":

                        for(var i = 0; i<post_onoff_socket_json_data.num_of_onoff_socket; i++)
                        {
                            socket_status_list.push({
                                "socket_index": post_onoff_socket_json_data.individual_socket_status[i].socket_index,
                                "on_off": post_onoff_socket_json_data.individual_socket_status[i].on_off
                            });
                        }
                        
                        ws_report_cmd = {
                            "command_type": "OnOff Socket",
                            "command": "Report OnOff Socket Status Change",
                            "device_ID": device_ID,
                            "num_of_onoff_socket": post_onoff_socket_json_data.num_of_onoff_socket,
                            "socket_status_list": socket_status_list
                        }
                        websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User(username, 'Electrical', ws_report_cmd);
                        
                        break;
                }
            }
        }
        catch (e) {
            debug("[OnOff_Socket_MQTT] Process_OnOff_Socket_MQTT_POST_Message() Error " + e);
        }
    }

    self.Process_OnOff_Socket_MQTT_GET_Message = async function (username, device_ID, get_onoff_socket_json_data, rsp_callback) {
        try {
            if (get_onoff_socket_json_data.command != null) {
                switch (get_onoff_socket_json_data.command) {
                }
            }
        }
        catch (e) {
            debug("[OnOff_Socket_MQTT] Process_OnOff_Socket_MQTT_GET_Message() Error " + e);
        }
    }
}
module.exports = OnOff_Socket_MQTT;
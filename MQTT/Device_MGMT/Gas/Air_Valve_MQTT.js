
var debug = require('debug')(require('path').basename(__filename));

var Air_Valve_API = require('../../../Device_MGMT/Gas/Air_Valve_API.js');
var air_valve_api = new Air_Valve_API();

var Air_Valve_API_MQTT = require('./Air_Valve_API_MQTT.js');
var air_valve_api_mqtt = new Air_Valve_API_MQTT();

var WebSocket = require('../../../Web/WebSocket.js');
var websocket = new WebSocket();

var Air_Valve_MQTT = function () {
    var self = this;

    self.Process_Air_Valve_MQTT_POST_Message = async function (username, device_ID, post_air_valve_json_data) {
        try {
            if (post_air_valve_json_data.command != null) {
                var main_switch_status = {};
                var individual_switch_status_list = [];
                var ws_report_cmd = {};

                switch (post_air_valve_json_data.command) {
                    case "report air valve status change":
                        main_switch_status = {
                            "enabled": post_air_valve_json_data.main_switch_status.enabled,
                            "on_off": post_air_valve_json_data.main_switch_status.on_off
                        };

                        for(var i = 0; i<post_air_valve_json_data.num_of_air_valve; i++)
                        {
                            individual_switch_status_list.push({
                                "switch_index": post_air_valve_json_data.individual_sensor_status[i].sw_index,
                                "enabled": post_air_valve_json_data.individual_sensor_status[i].enabled,
                                "on_off": post_air_valve_json_data.individual_sensor_status[i].on_off
                            });
                        }
                        
                        ws_report_cmd = {
                            "command_type": "Air Valve",
                            "command": "Report Air Valve Status Change",
                            "device_ID": device_ID,
                            "num_of_air_valve": post_air_valve_json_data.num_of_air_valve,
                            "main_switch_status": main_switch_status,
                            "individual_switch_status": individual_switch_status_list
                        }
                        websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User(username, 'Water', ws_report_cmd);
                        
                        break;
                }
            }
        }
        catch (e) {
            debug("[Air_Valve_MQTT] Process_Air_Valve_MQTT_POST_Message() Error " + e);
        };
    }

    self.Process_Air_Valve_MQTT_GET_Message = async function (username, device_ID, get_air_valve_json_data, callback) {
        try {
            if (get_air_valve_json_data.command != null) {
                switch (get_air_valve_json_data.command) {
                }
            }
        }
        catch (e) {
            debug("[Air_Valve_MQTT] Process_Air_Valve_MQTT_GET_Message() Error " + e);
        }
    };
}
module.exports = Air_Valve_MQTT;
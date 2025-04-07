
var debug = require('debug')(require('path').basename(__filename));

var EM_Valve_API = require('../../../Device_MGMT/Water/Electromagnetic_Valve_API.js');
var em_valve_api = new EM_Valve_API();

var EM_Valve_API_MQTT = require('./Electromagnetic_Valve_API_MQTT.js');
var em_valve_api_mqtt = new EM_Valve_API_MQTT();

var WebSocket = require('../../../Web/WebSocket.js');
var websocket = new WebSocket();

var EM_Valve_MQTT = function () {
    var self = this;

    self.Process_Electromagnetic_Valve_MQTT_POST_Message = async function (username, device_ID, post_em_valve_json_data) {
        try {
            if (post_em_valve_json_data.command != null) {
                var main_switch_status = {};
                var individual_switch_status_list = [];
                var ws_report_cmd = {};
                
                switch (post_em_valve_json_data.command) {
                    case "report em valve status change":
                        main_switch_status = {
                            "enabled": post_em_valve_json_data.main_switch_status.enabled,
                            "on_off": post_em_valve_json_data.main_switch_status.on_off
                        };

                        for(var i = 0; i<post_em_valve_json_data.num_of_electromagnetic_valve; i++)
                        {
                            individual_switch_status_list.push({
                                "switch_index": post_em_valve_json_data.individual_sensor_status[i].sw_index,
                                "enabled": post_em_valve_json_data.individual_sensor_status[i].enabled,
                                "on_off": post_em_valve_json_data.individual_sensor_status[i].on_off
                            });
                        }
                        
                        ws_report_cmd = {
                            "command_type": "Electromagnetic Valve",
                            "command": "Report Electromagnetic Valve Status Change",
                            "device_ID": device_ID,
                            "num_of_electromagnetic_valve": post_em_valve_json_data.num_of_electromagnetic_valve,
                            "main_switch_status": main_switch_status,
                            "individual_switch_status": individual_switch_status_list
                        }
                        websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User(username, 'Water', ws_report_cmd);
                        
                        break;
                }
            }
        }
        catch (e) {
            debug("[EM_Valve_MQTT] Process_EM_Valve_MQTT_POST_Message() Error " + e);
        };
    }

    self.Process_Electromagnetic_Valve_MQTT_GET_Message = async function (username, device_ID, get_em_valve_json_data, callback) {
        try {
            if (get_em_valve_json_data.command != null) {
                switch (get_em_valve_json_data.command) {
                }
            }
        }
        catch (e) {
            debug("[EM_Valve_MQTT] Process_EM_Valve_MQTT_GET_Message() Error " + e);
        }
    };
}
module.exports = EM_Valve_MQTT;
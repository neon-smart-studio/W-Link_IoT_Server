
var debug = require('debug')(require('path').basename(__filename));

var Door_Window_Sensor_API = require('../../../Device_MGMT/Accessories/Door_Window_Sensor_API.js');
var door_window_sensor_api = new Door_Window_Sensor_API();

var WebSocket = require('../../../Web/WebSocket.js');
var websocket = new WebSocket();

var MQTT_APP = require('../../MQTT_APP.js');
var mqtt_app = new MQTT_APP();

var Door_Window_Sensor_MQTT = function () {
    var self = this;

    self.Process_Door_Window_Sensor_MQTT_POST_Message = async function (username, device_ID, post_door_window_sensor_json_data) {
        try {
            if (post_door_window_sensor_json_data.command != null) {
                var sensor_status_list = [];
                var ws_report_cmd = {};
                
                switch (post_door_window_sensor_json_data.command) {
                    case "report door/window sensor status change":

                        for(var i = 0; i<post_door_window_sensor_json_data.num_of_door_window_sensor; i++)
                        {
                            var switch_index = post_door_window_sensor_json_data.individual_switch_status[i].sw_index;

                            sensor_status_list.push({
                                "switch_index": switch_index,
                                "action": post_door_window_sensor_json_data.individual_switch_status[i].action
                            });
                            
                            await mqtt_app.MQTT_APP_Trigger_Bind_Action("Door/Window Sensor", device_ID, switch_index, post_door_window_sensor_json_data.individual_switch_status[i]);
                        }
                        
                        ws_report_cmd = {
                            "command_type": "Door/Window Sensor",
                            "command": "Report Door/Window Sensor Status Change",
                            "device_ID": device_ID,
                            "num_of_door_window_sensor": post_door_window_sensor_json_data.num_of_door_window_sensor,
                            "sensor_status_list": sensor_status_list
                        }
                        websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User(username, 'Accessories', ws_report_cmd);

                        break;
                }
            }
        }
        catch (e) {
            debug("[Door_Window_Sensor_MQTT] Process_Door_Window_Sensor_MQTT_POST_Message() Error " + e);
        }
    }

    self.Process_Door_Window_Sensor_MQTT_GET_Message = async function (username, device_ID, get_door_window_sensor_json_data, rsp_callback) {
        try {
            if (get_door_window_sensor_json_data.command != null) {
                switch (get_door_window_sensor_json_data.command) {
                }
            }
        }
        catch (e) {
            debug("[Door_Window_Sensor_MQTT] Process_Door_Window_Sensor_MQTT_GET_Message() Error " + e);
        }
    }
}
module.exports = Door_Window_Sensor_MQTT;
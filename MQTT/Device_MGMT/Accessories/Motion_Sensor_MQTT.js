
var debug = require('debug')(require('path').basename(__filename));

var Motion_Sensor_API = require('../../../Device_MGMT/Accessories/Motion_Sensor_API.js');
var motion_sensor_api = new Motion_Sensor_API();

var WebSocket = require('../../../Web/WebSocket.js');
var websocket = new WebSocket();

var MQTT_APP = require('../../MQTT_APP.js');
var mqtt_app = new MQTT_APP();

var Motion_Sensor_MQTT = function () {
    var self = this;

    self.Process_Motion_Sensor_MQTT_POST_Message = async function (username, device_ID, post_motion_sensor_json_data) {
        try {
            if (post_motion_sensor_json_data.command != null) {
                var switch_status_list = [];
                var ws_report_cmd = {};

                switch (post_motion_sensor_json_data.command) {
                    case "report motion sensor status change":
                        
                        for(var i = 0; i<post_motion_sensor_json_data.num_of_motion_sensor; i++)
                        {
                            var switch_index = post_motion_sensor_json_data.individual_switch_status[i].sw_index;

                            switch_status_list.push({
                                "switch_index": switch_index,
                                "action": post_motion_sensor_json_data.individual_switch_status[i].action
                            });
                            
                            await mqtt_app.MQTT_APP_Trigger_Bind_Action("Motion Sensor", device_ID, switch_index, post_motion_sensor_json_data.individual_switch_status[i]);
                        }
                        
                        ws_report_cmd = {
                            "command_type": "Motion Sensor",
                            "command": "Report Motion Sensor Status Change",
                            "device_ID": device_ID,
                            "num_of_motion_sensor": post_motion_sensor_json_data.num_of_motion_sensor,
                            "switch_status_list": switch_status_list
                        }
                        websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User(username, 'Accessories', ws_report_cmd);

                        break;
                }
            }
        }
        catch (e) {
            debug("[Motion_Sensor_MQTT] Process_Motion_Sensor_MQTT_POST_Message() Error " + e);
        }
    }

    self.Process_Motion_Sensor_MQTT_GET_Message = async function (username, device_ID, get_motion_sensor_json_data, rsp_callback) {
        try {
            if (get_motion_sensor_json_data.command != null) {
                switch (get_motion_sensor_json_data.command) {
                }
            }
        }
        catch (e) {
            debug("[Motion_Sensor_MQTT] Process_Motion_Sensor_MQTT_GET_Message() Error " + e);
        }
    }
}
module.exports = Motion_Sensor_MQTT;
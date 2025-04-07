
var debug = require('debug')(require('path').basename(__filename));

var Scene_Switch_API = require('../../../Device_MGMT/Accessories/Scene_Switch_API.js');
var scene_switch_api = new Scene_Switch_API();

var WebSocket = require('../../../Web/WebSocket.js');
var websocket = new WebSocket();

var MQTT_APP = require('../../MQTT_APP.js');
var mqtt_app = new MQTT_APP();

var Scene_Switch_MQTT = function () {
    var self = this;

    self.Process_Scene_Switch_MQTT_POST_Message = async function (username, device_ID, post_scene_switch_json_data) {
        try {
            if (post_scene_switch_json_data.command != null) {
                var switch_status_list = [];
                var ws_report_cmd = {};

                switch (post_scene_switch_json_data.command) {
                    case "report scene switch status change":

                        for(var i = 0; i<post_scene_switch_json_data.num_of_scene_switch; i++)
                        {
                            var switch_index = post_scene_switch_json_data.individual_switch_status[i].sw_index;

                            switch_status_list.push({
                                "switch_index": post_scene_switch_json_data.individual_switch_status[i].sw_index,
                                "action": post_scene_switch_json_data.individual_switch_status[i].action
                            });
                            
                            await mqtt_app.MQTT_APP_Trigger_Bind_Action("Scene Switch", device_ID, switch_index, post_scene_switch_json_data.individual_switch_status[i]);
                        }
                        
                        ws_report_cmd = {
                            "command_type": "Scene Switch",
                            "command": "Report Scene Switch Status Change",
                            "device_ID": device_ID,
                            "num_of_scene_switch": post_scene_switch_json_data.num_of_scene_switch,
                            "switch_status_list": switch_status_list
                        }
                        websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User(username, 'Accessories', ws_report_cmd);

                        break;
                }
            }
        }
        catch (e) {
            debug("[Scene_Switch_MQTT] Process_Scene_Switch_MQTT_POST_Message() Error " + e);
        }
    }

    self.Process_Scene_Switch_MQTT_GET_Message = async function (username, device_ID, get_scene_switch_json_data, rsp_callback) {
        try {
            if (get_scene_switch_json_data.command != null) {
                switch (get_scene_switch_json_data.command) {
                }
            }
        }
        catch (e) {
            debug("[Scene_Switch_MQTT] Process_Scene_Switch_MQTT_GET_Message() Error " + e);
        }
    }
}
module.exports = Scene_Switch_MQTT;
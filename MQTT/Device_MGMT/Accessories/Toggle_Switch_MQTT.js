
var debug = require('debug')(require('path').basename(__filename));

var Toggle_Switch_API = require('../../../Device_MGMT/Accessories/Toggle_Switch_API.js');
var toggle_switch_api = new Toggle_Switch_API();

var WebSocket = require('../../../Web/WebSocket.js');
var websocket = new WebSocket();

var MQTT_APP = require('../../MQTT_APP.js');
var mqtt_app = new MQTT_APP();

var Toggle_Switch_MQTT = function () {
    var self = this;

    self.Process_Toggle_Switch_MQTT_POST_Message = async function (username, device_ID, post_toggle_switch_json_data) {
        try {
            if (post_toggle_switch_json_data.command != null) {
                var switch_status_list = [];
                var ws_report_cmd = {};

                switch (post_toggle_switch_json_data.command) {
                    case "report toggle switch status change":

                        for(var i = 0; i<post_toggle_switch_json_data.num_of_toggle_switch; i++)
                        {
                            var switch_index = post_toggle_switch_json_data.individual_switch_status[i].sw_index;

                            switch_status_list.push({
                                "switch_index": switch_index,
                                "action": post_toggle_switch_json_data.individual_switch_status[i].action
                            });
                            
                            await mqtt_app.MQTT_APP_Trigger_Bind_Action("Toggle Switch", device_ID, switch_index, post_toggle_switch_json_data.individual_switch_status[i]);
                        }
                        
                        ws_report_cmd = {
                            "command_type": "Toggle Switch",
                            "command": "Report Toggle Switch Status Change",
                            "device_ID": device_ID,
                            "num_of_toggle_switch": post_toggle_switch_json_data.num_of_toggle_switch,
                            "switch_status_list": switch_status_list
                        }
                        websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User(username, 'Accessories', ws_report_cmd);

                        break;
                }
            }
        }
        catch (e) {
            debug("[Toggle_Switch_MQTT] Process_Toggle_Switch_MQTT_POST_Message() Error " + e);
        }
    }

    self.Process_Toggle_Switch_MQTT_GET_Message = async function (username, device_ID, get_toggle_switch_json_data, rsp_callback) {
        try {
            if (get_toggle_switch_json_data.command != null) {
                switch (get_toggle_switch_json_data.command) {
                }
            }
        }
        catch (e) {
            debug("[Toggle_Switch_MQTT] Process_Toggle_Switch_MQTT_GET_Message() Error " + e);
        }
    }
}
module.exports = Toggle_Switch_MQTT;
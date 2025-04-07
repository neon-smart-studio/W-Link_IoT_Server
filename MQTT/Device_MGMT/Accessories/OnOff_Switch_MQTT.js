
var debug = require('debug')(require('path').basename(__filename));

var OnOff_Switch_API = require('../../../Device_MGMT/Accessories/OnOff_Switch_API.js');
var onoff_switch_api = new OnOff_Switch_API();

var WebSocket = require('../../../Web/WebSocket.js');
var websocket = new WebSocket();

var MQTT_APP = require('../../MQTT_APP.js');
var mqtt_app = new MQTT_APP();

var OnOff_Switch_MQTT = function () {
    var self = this;

    self.Process_OnOff_Switch_MQTT_POST_Message = async function (username, device_ID, post_onoff_switch_json_data) {
        try {
            if (post_onoff_switch_json_data.command != null) {
                var switch_status_list = [];
                var ws_report_cmd = {};

                switch (post_onoff_switch_json_data.command) {
                    case "report on off switch status change":

                        for(var i = 0; i<post_onoff_switch_json_data.num_of_onoff_switch; i++)
                        {
                            var switch_index = post_onoff_switch_json_data.individual_switch_status[i].sw_index;

                            switch_status_list.push({
                                "switch_index": post_onoff_switch_json_data.individual_switch_status[i].sw_index,
                                "on_off": post_onoff_switch_json_data.individual_switch_status[i].on_off
                            });
                            
                            await mqtt_app.MQTT_APP_Trigger_Bind_Action("OnOff Switch", device_ID, switch_index, post_onoff_switch_json_data.individual_switch_status[i]);
                        }
                        
                        ws_report_cmd = {
                            "command_type": "OnOff Switch",
                            "command": "Report OnOff Switch Status Change",
                            "device_ID": device_ID,
                            "num_of_onoff_switch": post_onoff_switch_json_data.num_of_onoff_switch,
                            "switch_status_list": switch_status_list
                        }
                        websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User(username, 'Accessories', ws_report_cmd);
                        break;
                }
            }
        }
        catch (e) {
            debug("[OnOff_Switch_MQTT] Process_OnOff_Switch_MQTT_POST_Message() Error " + e);
        }
    }

    self.Process_OnOff_Switch_MQTT_GET_Message = async function (username, device_ID, get_onoff_switch_json_data, rsp_callback) {
        try {
            if (get_onoff_switch_json_data.command != null) {
                switch (get_onoff_switch_json_data.command) {
                }
            }
        }
        catch (e) {
            debug("[OnOff_Switch_MQTT] Process_OnOff_Switch_MQTT_GET_Message() Error " + e);
        }
    }
}
module.exports = OnOff_Switch_MQTT;
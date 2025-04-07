
var debug = require('debug')(require('path').basename(__filename));

var Dimmable_Switch_API = require('../../../Device_MGMT/Accessories/Dimmable_Switch_API.js');
var dimmable_switch_api = new Dimmable_Switch_API();

var WebSocket = require('../../../Web/WebSocket.js');
var websocket = new WebSocket();

var MQTT_APP = require('../../MQTT_APP.js');
var mqtt_app = new MQTT_APP();

var Dimmable_Switch_MQTT = function () {
    var self = this;

    self.Process_Dimmable_Switch_MQTT_POST_Message = async function (username, device_ID, post_dimmable_switch_json_data) {
        try {
            if (post_dimmable_switch_json_data.command != null) {
                var switch_status_list = [];
                var ws_report_cmd = {};
                switch (post_dimmable_switch_json_data.command) {
                    case "report dimmable switch status change":

                        for(var i = 0; i<post_dimmable_switch_json_data.num_of_dimmable_switch; i++)
                        {
                            var switch_index = post_dimmable_switch_json_data.individual_switch_status[i].sw_index;
                            switch_status_list.push({
                                "switch_index": switch_index,
                                "on_off": post_dimmable_switch_json_data.individual_switch_status[i].on_off,
                                "level": post_dimmable_switch_json_data.individual_switch_status[i].level
                            });
                            
                            await mqtt_app.MQTT_APP_Trigger_Bind_Action("Dimmable Switch", device_ID, switch_index, post_dimmable_switch_json_data.individual_switch_status[i]);
                        }
                        
                        ws_report_cmd = {
                            "command_type": "Dimmable Switch",
                            "command": "Report Dimmable Switch Status Change",
                            "device_ID": device_ID,
                            "num_of_dimmable_switch": post_dimmable_switch_json_data.num_of_dimmable_switch,
                            "switch_status_list": switch_status_list
                        }
                        websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User(username, 'Accessories', ws_report_cmd);
                        
                        break;
                }
            }
        }
        catch (e) {
            debug("[Dimmable_Switch_MQTT] Process_Dimmable_Switch_MQTT_POST_Message() Error " + e);
        }
    }

    self.Process_Dimmable_Switch_MQTT_GET_Message = async function (username, device_ID, get_dimmable_switch_json_data, rsp_callback) {
        try {
            if (get_dimmable_switch_json_data.command != null) {
                switch (get_dimmable_switch_json_data.command) {
                }
            }
        }
        catch (e) {
            debug("[Dimmable_Switch_MQTT] Process_Dimmable_Switch_MQTT_GET_Message() Error " + e);
        }
    }
}
module.exports = Dimmable_Switch_MQTT;
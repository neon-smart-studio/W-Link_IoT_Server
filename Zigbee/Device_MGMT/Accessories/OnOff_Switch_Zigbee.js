
var debug = require('debug')(require('path').basename(__filename));

var WebSocket = require('../../../Web/WebSocket.js');
var websocket = new WebSocket();

var Zigbee_APP = require('../../Zigbee_APP.js');
var zigbee_app = new Zigbee_APP();

var OnOff_Switch_Zigbee = function () {
    var self = this;

    self.Process_OnOff_Switch_Zigbee_Attribute_Report_Message = async function (device_ID, resolv_dev_info, endpoint, cluster, attribute_report_raw_json_data, attribute_report_resolved_json_data) {
        try {
            var switch_status_list = [];
            var ws_report_cmd = {};
            
            var switch_state = null;

            switch (cluster) {
                case "genBasic":
                    return null;
                case "genOnOff":
                    break;
                case "genMultistateInput":
                    break;
            }
            
            if(switch_state==null)
            {
                return null;
            }

            switch_status_list.push({
                "switch_index": 0,
                "action": switch_state
            });

            await zigbee_app.Zigbee_APP_Trigger_Bind_Action("OnOff Switch", device_ID, 0, switch_state);

            ws_report_cmd = {
                "command_type": "OnOff Switch",
                "command": "Report OnOff Switch Status Change",
                "device_ID": device_ID,
                "num_of_onoff_switch": 1,
                "switch_status_list": switch_status_list
            }

            websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User('everyone', 'Accessories', ws_report_cmd);
        }
        catch (e) {
            debug("[OnOff_Switch_Zigbee] Process_OnOff_Switch_Zigbee_Attribute_Report_Message() Error " + e);
        }
    }

    self.Process_OnOff_Switch_Zigbee_Cluster_Command_Message = async function (device_ID, resolv_dev_info, endpoint, cluster, command, cluster_command_json_data, resolved_cluster_json_data) {
        try {
            var switch_status_list = [];
            var ws_report_cmd = {};
            
            var switch_index = 0;
            var switch_state = "default";

            switch(resolv_dev_info.device.modelID)
            {
                case "TRADFRI open/close remote":
                    switch_index = 0;
                    switch (cluster) {
                        case "genOnOffs":
                            switch (command) {
                            }
                            break;
                    }
                    break;
            }
            
            if(switch_state==null)
            {
                return null;
            }

            switch_status_list.push({
                "switch_index": 0,
                "action": switch_state,
                "cluster": cluster,
                "command": command
            });

            if(switch_state=="default")
            {
                await zigbee_app.Zigbee_APP_Trigger_Default_Cluster_Action("OnOff Switch", device_ID, cluster, command, cluster_command_json_data, switch_index);
            }
            else{
                await zigbee_app.Zigbee_APP_Trigger_Bind_Action("OnOff Switch", device_ID, 0, switch_state);
            }

            ws_report_cmd = {
                "command_type": "OnOff Switch",
                "command": "Report OnOff Switch Status Change",
                "device_ID": device_ID,
                "num_of_onoff_switch": 1,
                "switch_status_list": switch_status_list
            }

            websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User('everyone', 'Accessories', ws_report_cmd);
        }
        catch (e) {
            debug("[OnOff_Switch_Zigbee] Process_OnOff_Switch_Zigbee_Cluster_Command_Message() Error " + e);
        }
    }
}
module.exports = OnOff_Switch_Zigbee;


var debug = require('debug')(require('path').basename(__filename));

var WebSocket = require('../../../Web/WebSocket.js');
var websocket = new WebSocket();

var Zigbee_APP = require('../../Zigbee_APP.js');
var zigbee_app = new Zigbee_APP();

var Toggle_Switch_Zigbee = function () {
    var self = this;

    self.Process_Toggle_Switch_Zigbee_Attribute_Report_Message = async function (device_ID, resolv_dev_info, endpoint, cluster, attribute_report_raw_json_data, attribute_report_resolved_json_data) {
        try {
            var switch_status_list = [];
            var ws_report_cmd = {};
            
            var switch_state = null;

            switch (cluster) {
                case "genBasic":
                    return null;
                case "genOnOff":
                    switch(resolv_dev_info.device.modelID)
                    {
                        case "lumi.sensor_switch":
                            switch(attribute_report_resolved_json_data.click)
                            {
                                case "long":
                                    switch_state = "hold";
                                    break;
                                case "long_release":
                                    switch_state = "release";
                                    break;
                                default:
                                    if(attribute_report_resolved_json_data==null) { return null; }
                                    switch_state = attribute_report_resolved_json_data.click;
                                    break;
                            }
                            return;
                        case "lumi.sensor_switch.aq2":
                        case "lumi.remote.b1acn01":
                        case "lumi.sensor_86sw1":
                        case "lumi.remote.b186acn01":
                            if(attribute_report_resolved_json_data==null) { return null; }
                            switch_state = attribute_report_resolved_json_data.click;
                            break;
                        default:
                            return null;
                    }
                    break;
                case "genMultistateInput":
                    switch(resolv_dev_info.device.modelID)
                    {
                        case "lumi.sensor_switch.aq2":
                        case "lumi.remote.b1acn01":
                        case "lumi.sensor_switch.aq3":
                        case "lumi.sensor_swit":
                        case "lumi.sensor_86sw1":
                        case "lumi.remote.b186acn01":
                            if(attribute_report_resolved_json_data==null) { return null; }
                            if(attribute_report_resolved_json_data.click!=null){switch_state = attribute_report_resolved_json_data.click;}
                            if(attribute_report_resolved_json_data.action!=null){switch_state = attribute_report_resolved_json_data.action;}
                            break;
                        default:
                            return null;
                    }
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

            await zigbee_app.Zigbee_APP_Trigger_Bind_Action("Toggle Switch", device_ID, 0, switch_state);

            ws_report_cmd = {
                "command_type": "Toggle Switch",
                "command": "Report Toggle Switch Status Change",
                "device_ID": device_ID,
                "num_of_toggle_switch": 1,
                "switch_status_list": switch_status_list
            }

            websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User('everyone', 'Accessories', ws_report_cmd);
        }
        catch (e) {
            debug("[Toggle_Switch_Zigbee] Process_Toggle_Switch_Zigbee_Attribute_Report_Message() Error " + e);
        }
    }

    self.Process_Toggle_Switch_Zigbee_Cluster_Command_Message = async function (device_ID, resolv_dev_info, endpoint, cluster, command, cluster_command_json_data, resolved_cluster_json_data) {
        try {
            var switch_status_list = [];
            var ws_report_cmd = {};
            
            switch_status_list.push({
                "switch_index": 0,
                "action": "default",
                "cluster": cluster,
                "command": command
            });

            await zigbee_app.Zigbee_APP_Trigger_Default_Cluster_Action("Toggle Switch", device_ID, cluster, command, cluster_command_json_data, 0);
        
            ws_report_cmd = {
                "command_type": "Toggle Switch",
                "command": "Report Toggle Switch Status Change",
                "device_ID": device_ID,
                "num_of_toggle_switch": 1,
                "switch_status_list": switch_status_list
            }

            websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User('everyone', 'Accessories', ws_report_cmd);
            
        }
        catch (e) {
            debug("[Toggle_Switch_Zigbee] Process_Toggle_Switch_Zigbee_Cluster_Command_Message() Error " + e);
        }
    }
}
module.exports = Toggle_Switch_Zigbee;


var debug = require('debug')(require('path').basename(__filename));

var WebSocket = require('../../../Web/WebSocket.js');
var websocket = new WebSocket();

var Zigbee_APP = require('../../Zigbee_APP.js');
var zigbee_app = new Zigbee_APP();

var Motion_Sensor_Zigbee = function () {
    var self = this;

    self.Process_Motion_Sensor_Zigbee_Attribute_Report_Message = async function (device_ID, resolv_dev_info, endpoint, cluster, attribute_report_raw_json_data, attribute_report_resolved_json_data) {
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
                        case "lumi.sensor_cube":
                        case "lumi.sensor_cube.aqgl01":
                        case "lumi.remote.b286opcn01":
                            //action : button_1_single
                            break;
                        case "lumi.remote.b486opcn01":
                        case "lumi.remote.b686opcn01":
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
                        case "lumi.sensor_cube":
                        case "lumi.sensor_cube.aqgl01":
                        case "lumi.remote.b286opcn01":
                        case "lumi.remote.b486opcn01":
                        case "lumi.remote.b686opcn01":
                            if(attribute_report_resolved_json_data==null) { return null; }
                            if(attribute_report_resolved_json_data.click!=null){switch_state = attribute_report_resolved_json_data.click;}
                            if(attribute_report_resolved_json_data.action!=null){switch_state = attribute_report_resolved_json_data.action;}
                            break;
                        case "lumi.remote.b186acn02":
                        case "lumi.sensor_86sw2', 'lumi.sensor_86sw2.es1', 'lumi.remote.b286acn01":
                        case "lumi.switch.b1laus01":
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

            await zigbee_app.Zigbee_APP_Trigger_Bind_Action("Motion Sensor", device_ID, 0, switch_state);

            ws_report_cmd = {
                "command_type": "Motion Sensor",
                "command": "Report Motion Sensor Status Change",
                "device_ID": device_ID,
                "num_of_motion_sensor": 1,
                "switch_status_list": switch_status_list
            }

            websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User('everyone', 'Accessories', ws_report_cmd);
        }
        catch (e) {
            debug("[Motion_Sensor_Zigbee] Process_Motion_Sensor_Zigbee_Attribute_Report_Message() Error " + e);
        }
    }

    self.Process_Motion_Sensor_Zigbee_Cluster_Command_Message = async function (device_ID, resolv_dev_info, endpoint, cluster, command, cluster_command_json_data, resolved_cluster_json_data) {
        try {
            var switch_status_list = [];
            var ws_report_cmd = {};
            
            switch_status_list.push({
                "switch_index": 0,
                "action": "default",
                "cluster": cluster,
                "command": command
            });

            await zigbee_app.Zigbee_APP_Trigger_Default_Cluster_Action("Motion Sensor", device_ID, cluster, command, cluster_command_json_data, 0);

            ws_report_cmd = {
                "command_type": "Motion Sensor",
                "command": "Report Motion Sensor Status Change",
                "device_ID": device_ID,
                "num_of_motion_sensor": 1,
                "switch_status_list": switch_status_list
            }

            websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User('everyone', 'Accessories', ws_report_cmd);
        }
        catch (e) {
            debug("[Motion_Sensor_Zigbee] Process_Motion_Sensor_Zigbee_Cluster_Command_Message() Error " + e);
        }
    }
}
module.exports = Motion_Sensor_Zigbee;

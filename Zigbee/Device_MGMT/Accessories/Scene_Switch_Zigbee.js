
var debug = require('debug')(require('path').basename(__filename));

var WebSocket = require('../../../Web/WebSocket.js');
var websocket = new WebSocket();

var Zigbee_APP = require('../../Zigbee_APP.js');
var zigbee_app = new Zigbee_APP();

var Scene_Switch_Zigbee = function () {
    var self = this;

    self.Process_Scene_Switch_Zigbee_Attribute_Report_Message = async function (device_ID, resolv_dev_info, endpoint, cluster, attribute_report_raw_json_data, attribute_report_resolved_json_data) {
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

            await zigbee_app.Zigbee_APP_Trigger_Bind_Action("Scene Switch", device_ID, 0, switch_state);

            ws_report_cmd = {
                "command_type": "Scene Switch",
                "command": "Report Scene Switch Status Change",
                "device_ID": device_ID,
                "num_of_scene_switch": 1,
                "switch_status_list": switch_status_list
            }

            websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User('everyone', 'Accessories', ws_report_cmd);
        }
        catch (e) {
            debug("[Scene_Switch_Zigbee] Process_Scene_Switch_Zigbee_Attribute_Report_Message() Error " + e);
        }
    }

    self.Process_Scene_Switch_Zigbee_Cluster_Command_Message = async function (device_ID, resolv_dev_info, endpoint, cluster, command, cluster_command_json_data, resolved_cluster_json_data) {
        try {
            var switch_status_list = [];
            var ws_report_cmd = {};
            
            var switch_index = 0;
            var switch_state = "default";

            switch(resolv_dev_info.device.modelID)
            {
                case "TRADFRI remote control":
                    switch_index = 0;
                    switch (cluster) {
                        case "genScenes":
                            switch (command) {
                                case "commandTradfriArrowSingle":
                                case "commandTradfriArrowHold":
                                case "commandTradfriArrowRelease":
                                    switch (resolved_cluster_json_data.action) {
                                        case "arrow_left_click":
                                            switch_state = "arrow_left";
                                            break;
                                        case "arrow_right_click":
                                            switch_state = "arrow_right";
                                            break;
                                    }
                                    break;
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
                await zigbee_app.Zigbee_APP_Trigger_Default_Cluster_Action("Scene Switch", device_ID, cluster, command, cluster_command_json_data, switch_index);
            }
            else{
                await zigbee_app.Zigbee_APP_Trigger_Bind_Action("Scene Switch", device_ID, 0, switch_state);
            }

            ws_report_cmd = {
                "command_type": "Scene Switch",
                "command": "Report Scene Switch Status Change",
                "device_ID": device_ID,
                "num_of_scene_switch": 1,
                "switch_status_list": switch_status_list
            }

            websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User('everyone', 'Accessories', ws_report_cmd);
        }
        catch (e) {
            debug("[Scene_Switch_Zigbee] Process_Scene_Switch_Zigbee_Cluster_Command_Message() Error " + e);
        }
    }
}
module.exports = Scene_Switch_Zigbee;

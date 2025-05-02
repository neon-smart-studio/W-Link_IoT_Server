
var debug = require('debug')(require('path').basename(__filename));

var WebSocket = require('../../../Web/WebSocket.js');
var websocket = new WebSocket();

var Zigbee_APP = require('../../Zigbee_APP.js');
var zigbee_app = new Zigbee_APP();

var OnOff_Socket_Zigbee = function () {
    var self = this;

    self.Process_OnOff_Socket_Zigbee_Attribute_Report_Message = async function (device_ID, resolv_dev_info, endpoint, cluster, attribute_report_raw_json_data, attribute_report_resolved_json_data) {
        try {
            var record_status_list = [];
            var socket_status_list = [];
            var ws_report_cmd = {};
            
            switch (cluster) {
                case "genBasic":
                    switch(resolv_dev_info.device.modelID)
                    {
                        case "lumi.plug":
                        case "lumi.plug.mitw01":
                        case "lumi.plug.mmeu01":
                        case "lumi.plug.maus01":
                        case "lumi.plug.maeu01":
                        case "lumi.ctrl_86plug'":
                        case "lumi.ctrl_86plug.aq1":
                            if(attribute_report_resolved_json_data==null) { return null; }

                            var on_off_state = false;
                            if(attribute_report_resolved_json_data.state=='ON'){on_off_state = true;}
                            if(attribute_report_resolved_json_data.state=='OFF'){on_off_state = false;}

                            var power_state = attribute_report_resolved_json_data.power;
                            var voltage_state = attribute_report_resolved_json_data.voltage;
                            var consumption_state = attribute_report_resolved_json_data.consumption;
                            var temperature_state = attribute_report_resolved_json_data.temperature;
                            
                            if(voltage_state==null || isNaN(voltage_state))
                            {
                                voltage_state = 0;
                            }
                            
                            record_status_list = [{
                                "name": "power",
                                "value": power_state
                            },{
                                "name": "voltage",
                                "value": voltage
                            },{
                                "name": "consumption",
                                "value": consumption_state
                            },{
                                "name": "temperature",
                                "value": temperature_state
                            }];

                            socket_status_list.push({
                                "socket_index": 0,
                                "on_off": on_off_state,
                                "power": power_state,
                                "voltage": voltage_state,
                                "consumption": consumption_state,
                                "temperature": temperature_state
                            });
                            break;
                        default:
                            return;
                    }
                    
                    await zigbee_app.Zigbee_APP_Record_Measure_State(device_ID, record_status_list);

                    ws_report_cmd = {
                        "command_type": "OnOff Socket",
                        "command": "Report OnOff Socket Current Measure",
                        "device_ID": device_ID,
                        "num_of_onoff_socket": 1,
                        "socket_status_list": socket_status_list
                    }

                    websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User('everyone', 'Electrical', ws_report_cmd);
                    break;
                case "genAnalogInput":
                    switch(resolv_dev_info.device.modelID)
                    {
                        case "lumi.plug":
                        case "lumi.plug.mitw01":
                        case "lumi.plug.mmeu01":
                        case "lumi.plug.maus01":
                        case "lumi.plug.maeu01":
                        case "lumi.ctrl_86plug'":
                        case "lumi.ctrl_86plug.aq1":
                        case "lumi.plug.maus01":
                            if(attribute_report_resolved_json_data==null) { return null; }
                            
                            socket_status_list.push({
                                "socket_index": 0,
                                "power": attribute_report_resolved_json_data.power
                            });

                            record_status_list = [{
                                "name": "power",
                                "value": attribute_report_resolved_json_data.power
                            }];
                            break;
                        default:
                            return;
                    }

                    await zigbee_app.Zigbee_APP_Record_Event_State(device_ID, "power", record_status_list);

                    ws_report_cmd = {
                        "command_type": "OnOff Socket",
                        "command": "Report OnOff Socket Status Change",
                        "device_ID": device_ID,
                        "num_of_onoff_socket": 1,
                        "socket_status_list": socket_status_list
                    }

                    websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User('everyone', 'Electrical', ws_report_cmd);
                    break;
                case "genOnOff":
                    switch(resolv_dev_info.device.modelID)
                    {
                        case "ZHA Smart Plug":
                        case "lumi.plug":
                        case "lumi.plug.mitw01":
                        case "lumi.plug.mmeu01":
                        case "lumi.plug.maus01":
                        case "lumi.plug.maeu01":
                        case "lumi.ctrl_86plug'":
                        case "lumi.ctrl_86plug.aq1":
                        case "lumi.plug.maus01":
                        default:
                            socket_status_list.push({
                                "socket_index": 0,
                                "on_off": attribute_report_raw_json_data.onOff
                            });

                            record_status_list = [{
                                "name": "on_off",
                                "value": attribute_report_raw_json_data.onOff
                            }];
                            break;
                    }
                    
                    await zigbee_app.Zigbee_APP_Record_Event_State(device_ID, "on_off", record_status_list);

                    ws_report_cmd = {
                        "command_type": "OnOff Socket",
                        "command": "Report OnOff Socket Status Change",
                        "device_ID": device_ID,
                        "num_of_onoff_socket": 1,
                        "socket_status_list": socket_status_list
                    }

                    websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User('everyone', 'Electrical', ws_report_cmd);
                    break;
            }

            return null;
        }
        catch (e) {
            debug("[OnOff_Socket_Zigbee] Process_OnOff_Socket_Zigbee_Attribute_Report_Message() Error " + e);
        }
    }
}
module.exports = OnOff_Socket_Zigbee;

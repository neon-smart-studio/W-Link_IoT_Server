
var debug = require('debug')(require('path').basename(__filename));

var Flow_Meter_API = require('../../../Device_MGMT/Water/Flow_Meter_API.js');
var flow_meter_api = new Flow_Meter_API();

var Flow_Meter_API_MQTT = require('./Flow_Meter_API_MQTT.js');
var flow_meter_api_mqtt = new Flow_Meter_API_MQTT();

var WebSocket = require('../../../Web/WebSocket.js');
var websocket = new WebSocket();

var Flow_Meter_MQTT = function () {
    var self = this;

    self.Process_Flow_Meter_MQTT_POST_Message = async function (username, device_ID, post_flow_meter_json_data) {
        try {
            if (post_flow_meter_json_data.command != null) {
                var record_status_list = [];
                var sensor_status_list = [];
                var ws_report_cmd = {};

                switch (post_flow_meter_json_data.command) {
                    case "report flow meter current measure":
                        for(var i = 0; i<post_flow_meter_json_data.num_of_flow_meter; i++)
                        {
                            var sensor_index = post_flow_meter_json_data.individual_sensor_status[i].sensor_index;
                            sensor_status_list.push({
                                "sensor_index": sensor_index,
                                "measure_L_min": post_flow_meter_json_data.individual_sensor_status[i].measure_L_min,
                                "measure_L_hour": post_flow_meter_json_data.individual_sensor_status[i].measure_L_hour
                            });
                            record_status_list.push({
                                "name": "sensor_"+sensor_index+"_measure_L_min",
                                "value": post_flow_meter_json_data.individual_sensor_status[i].measure_L_min
                            });
                            record_status_list.push({
                                "name": "sensor_"+sensor_index+"_measure_L_hour",
                                "value": post_flow_meter_json_data.individual_sensor_status[i].measure_water_ec_S_m
                            });
                        }
                        
                        await mqtt_app.MQTT_APP_Record_Measure_State(device_ID, record_status_list);

                        await mqtt_app.MQTT_APP_Trigger_Rule_Action("Flow Meter", device_ID, sensor_status_list);
                        
                        ws_report_cmd = {
                            "command_type": "Flow Meter",
                            "command": "Report Flow Meter Current Measure",
                            "device_ID": device_ID,
                            "num_of_flow_meter": post_flow_meter_json_data.num_of_flow_meter,
                            "sensor_status_list": sensor_status_list
                        }
                        websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User(username, 'Water', ws_report_cmd);
                        
                        break;
                    case "report flow meter status change":
                        for(var i = 0; i<post_flow_meter_json_data.num_of_flow_meter; i++)
                        {
                            sensor_status_list.push({
                                "sensor_index": post_flow_meter_json_data.individual_sensor_status[i].sensor_index,
                                "enabled": post_flow_meter_json_data.individual_sensor_status[i].enabled
                            });
                        }
                        
                        ws_report_cmd = {
                            "command_type": "Flow Meter",
                            "command": "Report Flow Meter Status Change",
                            "device_ID": device_ID,
                            "num_of_flow_meter": post_flow_meter_json_data.num_of_flow_meter,
                            "sensor_status_list": sensor_status_list
                        }
                        websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User(username, 'Water', ws_report_cmd);
                        
                        break;
                }
            }
        }
        catch (e) {
            debug("[Flow_Meter_MQTT] Process_Flow_Meter_MQTT_POST_Message() Error " + e);
        };
    }

    self.Process_Flow_Meter_MQTT_GET_Message = async function (username, device_ID, get_flow_meter_json_data, callback) {
        try {
            if (get_flow_meter_json_data.command != null) {
                switch (get_flow_meter_json_data.command) {
                }
            }
        }
        catch (e) {
            debug("[Flow_Meter_MQTT] Process_Flow_Meter_MQTT_GET_Message() Error " + e);
        };
    }
}
module.exports = Flow_Meter_MQTT;
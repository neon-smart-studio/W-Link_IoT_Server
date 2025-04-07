
var debug = require('debug')(require('path').basename(__filename));

var O2_Sensor_API = require('../../../Device_MGMT/Gas/O2_Sensor_API.js');
var o2_sensor_api = new O2_Sensor_API();

var O2_Sensor_API_MQTT = require('./O2_Sensor_API_MQTT.js');
var o2_sensor_api_mqtt = new O2_Sensor_API_MQTT();

var WebSocket = require('../../../Web/WebSocket.js');
var websocket = new WebSocket();

var O2_Sensor_MQTT = function () {
    var self = this;

    self.Process_O2_Sensor_MQTT_POST_Message = async function (username, device_ID, post_o2_sensor_json_data) {
        try {
            if (post_o2_sensor_json_data.command != null) {
                var record_status_list = [];
                var sensor_status_list = [];
                var ws_report_cmd = {};

                switch (post_o2_sensor_json_data.command) {
                    case "report o2 sensor current measure":
                        var device_info_json = await o2_sensor_api.O2_Sensor_Get_Device_Info(username, device_ID);
                        switch(device_info_json.sensor_model)
                        {
                            case "ME3-O2":
                                for(var i = 0; i<post_o2_sensor_json_data.num_of_o2_sensor; i++)
                                {
                                    var sensor_index = post_o2_sensor_json_data.individual_sensor_status[i].sensor_index;
                                    sensor_status_list.push({
                                        "sensor_index": sensor_index,
                                        "measure_o2_percentage": post_o2_sensor_json_data.individual_sensor_status[i].measure_o2_percentage,
                                    });
                                    record_status_list.push({
                                        "name": "sensor_"+sensor_index+"_measure_o2_percentage",
                                        "value": post_o2_sensor_json_data.individual_sensor_status[i].measure_o2_percentage
                                    });
                                }
                                break;
                            default:
                                for(var i = 0; i<post_o2_sensor_json_data.num_of_o2_sensor; i++)
                                {
                                    var sensor_index = post_o2_sensor_json_data.individual_sensor_status[i].sensor_index;
                                    sensor_status_list.push({
                                        "sensor_index": sensor_index,
                                        "measure_o2_percentage": post_o2_sensor_json_data.individual_sensor_status[i].measure_o2_percentage,
                                    });
                                    record_status_list.push({
                                        "name": "sensor_"+sensor_index+"_measure_o2_percentage",
                                        "value": post_o2_sensor_json_data.individual_sensor_status[i].measure_o2_percentage
                                    });
                                }
                                break;
                        }
                    
                        await mqtt_app.MQTT_APP_Record_Measure_State(device_ID, record_status_list);

                        await mqtt_app.MQTT_APP_Trigger_Rule_Action("O2 Sensor", device_ID, sensor_status_list);
                        
                        ws_report_cmd = {
                            "command_type": "O2 Sensor",
                            "command": "Report O2 Sensor Current Measure",
                            "device_ID": device_ID,
                            "num_of_o2_sensor": post_o2_sensor_json_data.num_of_o2_sensor,
                            "sensor_status_list": sensor_status_list
                        }
                        websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User(username, 'Gas', ws_report_cmd);
                        
                        break;
                    case "report o2 sensor status change":
                        var device_info_json = await o2_sensor_api.O2_Sensor_Get_Device_Info(username, device_ID);
                        switch(device_info_json.sensor_model)
                        {
                            case "ME3-O2":
                                for(var i = 0; i<post_o2_sensor_json_data.num_of_o2_sensor; i++)
                                {
                                    sensor_status_list.push({
                                        "sensor_index": post_o2_sensor_json_data.individual_sensor_status[i].sensor_index,
                                    });
                                }
                                break;
                            default:
                                for(var i = 0; i<post_o2_sensor_json_data.num_of_o2_sensor; i++)
                                {
                                    sensor_status_list.push({
                                        "sensor_index": post_o2_sensor_json_data.individual_sensor_status[i].sensor_index,
                                    });
                                }
                                break;
                        }
                        
                        ws_report_cmd = {
                            "command_type": "O2 Sensor",
                            "command": "Report O2 Sensor Status Change",
                            "device_ID": device_ID,
                            "num_of_o2_sensor": post_o2_sensor_json_data.num_of_o2_sensor,
                            "sensor_status_list": sensor_status_list
                        }
                        websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User(username, 'Gas', ws_report_cmd);
                        
                        break;
                }
            }
        }
        catch (e) {
            debug("[O2_Sensor_MQTT] Process_O2_Sensor_MQTT_POST_Message() Error " + e);
        }
    }

    self.Process_O2_Sensor_MQTT_GET_Message = async function (username, device_ID, get_o2_sensor_json_data, callback) {
        try {
            if (get_o2_sensor_json_data.command != null) {
                switch (get_o2_sensor_json_data.command) {
                }
            }
        }
        catch (e) {
            debug("[O2_Sensor_MQTT] Process_O2_Sensor_MQTT_GET_Message() Error " + e);
        }
    }
}
module.exports = O2_Sensor_MQTT;
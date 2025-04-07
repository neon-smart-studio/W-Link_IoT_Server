
var debug = require('debug')(require('path').basename(__filename));

var TVOC_Sensor_API = require('../../../Device_MGMT/Gas/TVOC_Sensor_API.js');
var tvoc_sensor_api = new TVOC_Sensor_API();

var WebSocket = require('../../../Web/WebSocket.js');
var websocket = new WebSocket();

var TVOC_Sensor_MQTT = function () {
    var self = this;

    self.Process_TVOC_Sensor_MQTT_POST_Message = async function (username, device_ID, post_tvoc_sensor_json_data) {
        try {
            if (post_tvoc_sensor_json_data.command != null) {
                var record_status_list = [];
                var sensor_status_list = [];
                var ws_report_cmd = {};

                switch (post_tvoc_sensor_json_data.command) {
                    case "report tvoc sensor current measure":
                        var device_info_json = await tvoc_sensor_api.TVOC_Sensor_Get_Device_Info(username, device_ID);
                        switch(device_info_json.sensor_model)
                        {
                            case "iAQ-Core":
                            case "MICS-VZ-89TE":
                                for(var i = 0; i<post_tvoc_sensor_json_data.num_of_tvoc_sensor; i++)
                                {
                                    var sensor_index = post_tvoc_sensor_json_data.individual_sensor_status[i].sensor_index;
                                    sensor_status_list.push({
                                        "sensor_index": sensor_index,
                                        "measure_co2_ppm": post_tvoc_sensor_json_data.individual_sensor_status[i].measure_co2_ppm,
                                        "measure_tvoc": post_tvoc_sensor_json_data.individual_sensor_status[i].measure_tvoc
                                    });
                                    record_status_list.push({
                                        "name": "sensor_"+sensor_index+"_measure_co2_ppm",
                                        "value": post_tvoc_sensor_json_data.individual_sensor_status[i].measure_co2_ppm
                                    });
                                    record_status_list.push({
                                        "name": "sensor_"+sensor_index+"_measure_tvoc",
                                        "value": post_tvoc_sensor_json_data.individual_sensor_status[i].measure_tvoc
                                    });
                                }
                                break;
                            default:
                                for(var i = 0; i<post_tvoc_sensor_json_data.num_of_tvoc_sensor; i++)
                                {
                                    var sensor_index = post_tvoc_sensor_json_data.individual_sensor_status[i].sensor_index;
                                    sensor_status_list.push({
                                        "sensor_index": sensor_index,
                                        "measure_tvoc": post_tvoc_sensor_json_data.individual_sensor_status[i].measure_tvoc
                                    });
                                    record_status_list.push({
                                        "name": "sensor_"+sensor_index+"_measure_tvoc",
                                        "value": post_tvoc_sensor_json_data.individual_sensor_status[i].measure_tvoc
                                    });
                                }
                                break;
                        }
                    
                        await mqtt_app.MQTT_APP_Record_Measure_State(device_ID, record_status_list);

                        await mqtt_app.MQTT_APP_Trigger_Rule_Action("TVOC Sensor", device_ID, sensor_status_list);
                        
                        ws_report_cmd = {
                            "command_type": "TVOC Sensor",
                            "command": "Report TVOC Sensor Current Measure",
                            "device_ID": device_ID,
                            "num_of_tvoc_sensor": post_tvoc_sensor_json_data.num_of_tvoc_sensor,
                            "sensor_status_list": sensor_status_list
                        }
                        websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User(username, 'Gas', ws_report_cmd);
                        
                        break;
                    case "report tvoc sensor status change":
                        var device_info_json = await tvoc_sensor_api.TVOC_Sensor_Get_Device_Info(username, device_ID);
                        switch(device_info_json.sensor_model)
                        {
                            case "iAQ-Core":
                            case "MICS-VZ-89TE":
                                for(var i = 0; i<post_tvoc_sensor_json_data.num_of_tvoc_sensor; i++)
                                {
                                    sensor_status_list.push({
                                        "sensor_index": post_tvoc_sensor_json_data.individual_sensor_status[i].sensor_index,
                                        "sensor_resistance": post_tvoc_sensor_json_data.individual_sensor_status[i].sensor_resistance
                                    });
                                }
                                break;
                            default:
                                for(var i = 0; i<post_tvoc_sensor_json_data.num_of_tvoc_sensor; i++)
                                {
                                    sensor_status_list.push({
                                        "sensor_index": post_tvoc_sensor_json_data.individual_sensor_status[i].sensor_index,
                                    });
                                }
                                break;
                        }
                        
                        ws_report_cmd = {
                            "command_type": "TVOC Sensor",
                            "command": "Report TVOC Sensor Status Change",
                            "device_ID": device_ID,
                            "num_of_tvoc_sensor": post_tvoc_sensor_json_data.num_of_tvoc_sensor,
                            "sensor_status_list": sensor_status_list
                        }
                        websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User(username, 'Gas', ws_report_cmd);
                        
                        break;
                }
            }
        }
        catch (e) {
            debug("[TVOC_Sensor_MQTT] Process_TVOC_Sensor_MQTT_POST_Message() Error " + e);
        }
    }

    self.Process_TVOC_Sensor_MQTT_GET_Message = async function (username, device_ID, get_tvoc_sensor_json_data, callback) {
        try {
            if (get_tvoc_sensor_json_data.command != null) {
                switch (get_tvoc_sensor_json_data.command) {
                }
            }
        }
        catch (e) {
            debug("[TVOC_Sensor_MQTT] Process_TVOC_Sensor_MQTT_GET_Message() Error " + e);
        }
    }
}
module.exports = TVOC_Sensor_MQTT;
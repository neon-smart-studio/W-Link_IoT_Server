
var debug = require('debug')(require('path').basename(__filename));

var PM2_5_Sensor_API = require('../../../Device_MGMT/Environment/PM2_5_Sensor_API.js');
var pm2_5_sensor_api = new PM2_5_Sensor_API();

var WebSocket = require('../../../Web/WebSocket.js');
var websocket = new WebSocket();

var PM2_5_Sensor_MQTT = function () {
    var self = this;

    self.Process_PM2_5_Sensor_MQTT_POST_Message = async function (username, device_ID, post_pm2_5_sensor_json_data) {
        try {
            if (post_pm2_5_sensor_json_data.command != null) {
                var record_status_list = [];
                var sensor_status_list = [];
                var ws_report_cmd = {};

                switch (post_pm2_5_sensor_json_data.command) {
                    case "report pm2.5 sensor current measure":
                        var device_info_json = await pm2_5_sensor_api.PM2_5_Sensor_Get_Device_Info(username, device_ID);
                        switch(device_info_json.sensor_model)
                        {
                            case "SMR59":
                                for(var i = 0; i<post_pm2_5_sensor_json_data.num_of_pm_2_5_sensor; i++)
                                {
                                    var sensor_index = post_pm2_5_sensor_json_data.individual_sensor_status[i].sensor_index;
                                    sensor_status_list.push({
                                        "sensor_index": sensor_index,
                                        "measure_temperature": post_pm2_5_sensor_json_data.individual_sensor_status[i].measure_temperature,
                                        "measure_pm_2_5": post_pm2_5_sensor_json_data.individual_sensor_status[i].measure_pm_2_5,
                                        "measure_pm_10": post_pm2_5_sensor_json_data.individual_sensor_status[i].measure_pm_10
                                    });
                                    record_status_list.push({
                                        "name": "sensor_"+sensor_index+"_measure_temperature",
                                        "value": post_pm2_5_sensor_json_data.individual_sensor_status[i].measure_temperature
                                    });
                                    record_status_list.push({
                                        "name": "sensor_"+sensor_index+"_measure_pm_2_5",
                                        "value": post_pm2_5_sensor_json_data.individual_sensor_status[i].measure_pm_2_5
                                    });
                                    record_status_list.push({
                                        "name": "sensor_"+sensor_index+"_measure_pm_10",
                                        "value": post_pm2_5_sensor_json_data.individual_sensor_status[i].measure_pm_10
                                    });
                                }
                                ws_report_cmd = {
                                    "command_type": "PM2.5 Sensor",
                                    "command": "Report PM2.5 Sensor Current Measure",
                                    "device_ID": device_ID,
                                    "num_of_pm_2_5_sensor": post_pm2_5_sensor_json_data.num_of_pm_2_5_sensor,
                                    "sensor_status_list": sensor_status_list
                                }
                                break;
                            case "DN7C3CA007":
                                for(var i = 0; i<post_pm2_5_sensor_json_data.num_of_pm_2_5_sensor; i++)
                                {
                                    var sensor_index = post_pm2_5_sensor_json_data.individual_sensor_status[i].sensor_index;
                                    sensor_status_list.push({
                                        "sensor_index": sensor_index,
                                        "measure_pm_2_5": post_pm2_5_sensor_json_data.individual_sensor_status[i].measure_pm_2_5,
                                    });
                                    record_status_list.push({
                                        "name": "sensor_"+sensor_index+"_measure_pm_2_5",
                                        "value": post_pm2_5_sensor_json_data.individual_sensor_status[i].measure_pm_2_5
                                    });
                                }
                                
                                record_status_list.push({
                                    "name": "environment_temperature",
                                    "value": rsp_json.environment_temperature
                                });
                                record_status_list.push({
                                    "name": "environment_humidity",
                                    "value": rsp_json.environment_humidity
                                });

                                ws_report_cmd = {
                                    "command_type": "PM2.5 Sensor",
                                    "command": "Report PM2.5 Sensor Current Measure",
                                    "device_ID": device_ID,
                                    "environment_temperature": rsp_json.environment_temperature,
                                    "environment_humidity": rsp_json.environment_humidity,
                                    "num_of_pm_2_5_sensor": post_pm2_5_sensor_json_data.num_of_pm_2_5_sensor,
                                    "sensor_status_list": sensor_status_list
                                }
                                break;
                            default:
                                for(var i = 0; i<post_pm2_5_sensor_json_data.num_of_pm_2_5_sensor; i++)
                                {
                                    var sensor_index = post_pm2_5_sensor_json_data.individual_sensor_status[i].sensor_index;
                                    sensor_status_list.push({
                                        "sensor_index": sensor_index,
                                        "measure_pm_2_5": post_pm2_5_sensor_json_data.individual_sensor_status[i].measure_pm_2_5,
                                    });
                                    record_status_list.push({
                                        "name": "sensor_"+sensor_index+"_measure_pm_2_5",
                                        "value": post_pm2_5_sensor_json_data.individual_sensor_status[i].measure_pm_2_5
                                    });
                                }
                                ws_report_cmd = {
                                    "command_type": "PM2.5 Sensor",
                                    "command": "Report PM2.5 Sensor Current Measure",
                                    "device_ID": device_ID,
                                    "num_of_pm_2_5_sensor": post_pm2_5_sensor_json_data.num_of_pm_2_5_sensor,
                                    "sensor_status_list": sensor_status_list
                                }
                                break;
                        }
                        
                        await mqtt_app.MQTT_APP_Record_Measure_State(device_ID, record_status_list);

                        await mqtt_app.MQTT_APP_Trigger_Rule_Action("PM2.5 Sensor", device_ID, sensor_status_list);
                        
                        websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User(username, 'Environment', ws_report_cmd);
                        
                        break;
                    case "report pm2.5 sensor status change":
                        var device_info_json = await pm2_5_sensor_api.PM2_5_Sensor_Get_Device_Info(username, device_ID);
                        switch(device_info_json.sensor_model)
                        {
                            case "SMR59":
                            case "DN7C3CA007":
                            default:
                                for(var i = 0; i<post_pm2_5_sensor_json_data.num_of_pm_2_5_sensor; i++)
                                {
                                    sensor_status_list.push({
                                        "sensor_index": post_pm2_5_sensor_json_data.individual_sensor_status[i].sensor_index,
                                        "ms_pm_2_5_resolution": post_pm2_5_sensor_json_data.individual_sensor_status[i].ms_pm_2_5_resolution
                                    });
                                }
                                break;
                        }
                        
                        ws_report_cmd = {
                            "command_type": "PM2.5 Sensor",
                            "command": "Report PM2.5 Sensor Status Change",
                            "device_ID": device_ID,
                            "num_of_pm_2_5_sensor": post_pm2_5_sensor_json_data.num_of_pm_2_5_sensor,
                            "sensor_status_list": sensor_status_list
                        }
                        websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User(username, 'Environment', ws_report_cmd);
                        
                        break;
                }
            }
        }
        catch (e) {
            debug("[PM2.5_Sensor_MQTT] Process_PM2_5_Sensor_MQTT_POST_Message() Error " + e);
        }
    }

    self.Process_PM2_5_Sensor_MQTT_GET_Message = async function (username, device_ID, get_pm2_5_sensor_json_data, callback) {
        try {
            if (get_pm2_5_sensor_json_data.command != null) {
                switch (get_pm2_5_sensor_json_data.command) {
                }
            }
        }
        catch (e) {
            debug("[PM2.5_Sensor_MQTT] Process_PM2_5_Sensor_MQTT_GET_Message() Error " + e);
        }
    }

}
module.exports = PM2_5_Sensor_MQTT;
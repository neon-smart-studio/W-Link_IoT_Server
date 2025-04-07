
var debug = require('debug')(require('path').basename(__filename));

var Humidity_Sensor_API = require('../../../Device_MGMT/Environment/Humidity_Sensor_API.js');
var humidity_sensor_api = new Humidity_Sensor_API();

var WebSocket = require('../../../Web/WebSocket.js');
var websocket = new WebSocket();

var Humidity_Sensor_MQTT = function () {
    var self = this;

    self.Process_Humidity_Sensor_MQTT_POST_Message = async function (username, device_ID, post_humidity_sensor_json_data) {
        try {
            if (post_humidity_sensor_json_data.command != null) {
                var record_status_list = [];
                var sensor_status_list = [];
                var ws_report_cmd = {};

                switch (post_humidity_sensor_json_data.command) {
                    case "report humidity sensor current measure":
                        var device_info_json = await humidity_sensor_api.Humidity_Sensor_Get_Device_Info(username, device_ID);
                        switch(device_info_json.sensor_model)
                        {
                            case "AM2315":
                            case "HDC1080":
                            case "Si7021":
                                for(var i = 0; i<post_humidity_sensor_json_data.num_of_humidity_sensor; i++)
                                {
                                    var sensor_index = post_humidity_sensor_json_data.individual_sensor_status[i].sensor_index;
                                    sensor_status_list.push({
                                        "sensor_index": sensor_index,
                                        "measure_temperature": post_humidity_sensor_json_data.individual_sensor_status[i].measure_temperature,
                                        "measure_humidity": post_humidity_sensor_json_data.individual_sensor_status[i].measure_humidity
                                    });
                                    record_status_list.push({
                                        "name": "sensor_"+sensor_index+"_measure_temperature",
                                        "value": post_humidity_sensor_json_data.individual_sensor_status[i].measure_temperature
                                    });
                                    record_status_list.push({
                                        "name": "sensor_"+sensor_index+"_measure_humidity",
                                        "value": post_humidity_sensor_json_data.individual_sensor_status[i].measure_humidity
                                    });
                                }
                                break;
                            default:
                                for(var i = 0; i<post_humidity_sensor_json_data.num_of_humidity_sensor; i++)
                                {
                                    var sensor_index = post_humidity_sensor_json_data.individual_sensor_status[i].sensor_index;
                                    sensor_status_list.push({
                                        "sensor_index": sensor_index,
                                        "measure_temperature": post_humidity_sensor_json_data.individual_sensor_status[i].measure_temperature,
                                        "measure_humidity": post_humidity_sensor_json_data.individual_sensor_status[i].measure_humidity
                                    });
                                    record_status_list.push({
                                        "name": "sensor_"+sensor_index+"_measure_temperature",
                                        "value": post_humidity_sensor_json_data.individual_sensor_status[i].measure_temperature
                                    });
                                    record_status_list.push({
                                        "name": "sensor_"+sensor_index+"_measure_humidity",
                                        "value": post_humidity_sensor_json_data.individual_sensor_status[i].measure_humidity
                                    });
                                }
                                break;
                        }
                        
                        await mqtt_app.MQTT_APP_Record_Measure_State(device_ID, record_status_list);

                        await mqtt_app.MQTT_APP_Trigger_Rule_Action("Humidity Sensor", device_ID, sensor_status_list);
                        
                        ws_report_cmd = {
                            "command_type": "Humidity Sensor",
                            "command": "Report Humidity Sensor Current Measure",
                            "device_ID": device_ID,
                            "num_of_humidity_sensor": post_humidity_sensor_json_data.num_of_humidity_sensor,
                            "sensor_status_list": sensor_status_list
                        }
                        websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User(username, 'Environment', ws_report_cmd);
                        
                        break;
                    case "report humidity sensor status change":
                        var device_info_json = await humidity_sensor_api.Humidity_Sensor_Get_Device_Info(username, device_ID);
                        switch(device_info_json.sensor_model)
                        {
                            case "AM2315":
                            case "HDC1080":
                            case "Si7021":
                                for(var i = 0; i<post_humidity_sensor_json_data.num_of_humidity_sensor; i++)
                                {
                                    sensor_status_list.push({
                                        "sensor_index": post_humidity_sensor_json_data.individual_sensor_status[i].sensor_index,
                                    });
                                }
                                break;
                            default:
                                for(var i = 0; i<post_humidity_sensor_json_data.num_of_humidity_sensor; i++)
                                {
                                    sensor_status_list.push({
                                        "sensor_index": post_humidity_sensor_json_data.individual_sensor_status[i].sensor_index,
                                        });
                                }
                                break;
                        }
                        
                        ws_report_cmd = {
                            "command_type": "Humidity Sensor",
                            "command": "Report Humidity Sensor Status Change",
                            "device_ID": device_ID,
                            "num_of_humidity_sensor": post_humidity_sensor_json_data.num_of_humidity_sensor,
                            "sensor_status_list": sensor_status_list
                        }
                        websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User(username, 'Environment', ws_report_cmd);
                        
                        break;
                }
            }
        }
        catch (e) {
            debug("[Humidity_Sensor_MQTT] Process_Humidity_Sensor_MQTT_POST_Message() Error " + e);
        }
    }

    self.Process_Humidity_Sensor_MQTT_GET_Message = async function (username, device_ID, get_humidity_sensor_json_data, callback) {
        try {
            if (get_humidity_sensor_json_data.command != null) {
                switch (get_humidity_sensor_json_data.command) {
                }
            }
        }
        catch (e) {
            debug("[Humidity_Sensor_MQTT] Process_Humidity_Sensor_MQTT_GET_Message() Error " + e);
        }
    }

}
module.exports = Humidity_Sensor_MQTT;

var debug = require('debug')(require('path').basename(__filename));

var Soil_Temperature_Sensor_API = require('../../../Device_MGMT/Environment/Soil_Temperature_Sensor_API.js');
var soil_temperature_sensor_api = new Soil_Temperature_Sensor_API();

var WebSocket = require('../../../Web/WebSocket.js');
var websocket = new WebSocket();

var Soil_Temperature_Sensor_MQTT = function () {
    var self = this;

    self.Process_Soil_Temperature_Sensor_MQTT_POST_Message = async function (username, device_ID, post_soil_temperature_sensor_json_data) {
        try {
            if (post_soil_temperature_sensor_json_data.command != null) {
                var record_status_list = [];
                var sensor_status_list = [];
                var ws_report_cmd = {};

                switch (post_soil_temperature_sensor_json_data.command) {
                    case "report soil temperature sensor current measure":
                        var device_info_json = await soil_temperature_sensor_api.Soil_Temperature_Sensor_Get_Device_Info(username, device_ID);
                        switch(device_info_json.sensor_model)
                        {
                            case "ST-TW":
                                for(var i = 0; i<post_soil_temperature_sensor_json_data.num_of_soil_temperature_sensor; i++)
                                {
                                    var sensor_index = post_soil_temperature_sensor_json_data.individual_sensor_status[i].sensor_index;
                                    sensor_status_list.push({
                                        "sensor_index": sensor_index,
                                        "measure_soil_temperature": post_soil_temperature_sensor_json_data.individual_sensor_status[i].measure_soil_temperature,
                                    });
                                    record_status_list.push({
                                        "name": "sensor_"+sensor_index+"_measure_soil_temperature",
                                        "value": post_soil_temperature_sensor_json_data.individual_sensor_status[i].measure_soil_temperature
                                    });
                                }
                                break;
                            default:
                                for(var i = 0; i<post_soil_temperature_sensor_json_data.num_of_soil_temperature_sensor; i++)
                                {
                                    var sensor_index = post_soil_temperature_sensor_json_data.individual_sensor_status[i].sensor_index;
                                    sensor_status_list.push({
                                        "sensor_index": sensor_index,
                                        "measure_soil_temperature": post_soil_temperature_sensor_json_data.individual_sensor_status[i].measure_soil_temperature,
                                    });
                                    record_status_list.push({
                                        "name": "sensor_"+sensor_index+"_measure_soil_temperature",
                                        "value": post_soil_temperature_sensor_json_data.individual_sensor_status[i].measure_soil_temperature
                                    });
                                }
                                break;
                        }

                        await mqtt_app.MQTT_APP_Record_Measure_State(device_ID, record_status_list);

                        await mqtt_app.MQTT_APP_Trigger_Rule_Action("Soil Temperature Sensor", device_ID, sensor_status_list);
                        
                        ws_report_cmd = {
                            "command_type": "Soil Temperature Sensor",
                            "command": "Report Soil Temperature Sensor Current Measure",
                            "device_ID": device_ID,
                            "num_of_soil_temperature_sensor": post_soil_temperature_sensor_json_data.num_of_soil_temperature_sensor,
                            "sensor_status_list": sensor_status_list
                        }
                        websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User(username, 'Environment', ws_report_cmd);
                        
                        break;
                    case "report soil temperature sensor status change":
                        var device_info_json = await soil_temperature_sensor_api.Soil_Temperature_Sensor_Get_Device_Info(username, device_ID);
                        switch(device_info_json.sensor_model)
                        {
                            case "ST-TW":
                            default:
                                for(var i = 0; i<post_soil_temperature_sensor_json_data.num_of_soil_temperature_sensor; i++)
                                {
                                    sensor_status_list.push({
                                        "sensor_index": post_soil_temperature_sensor_json_data.individual_sensor_status[i].sensor_index,
                                        "ms_humidity_resolution": post_soil_temperature_sensor_json_data.individual_sensor_status[i].ms_humidity_resolution
                                    });
                                }
                                break;
                        }
                        
                        ws_report_cmd = {
                            "command_type": "Soil Temperature Sensor",
                            "command": "Report Soil Temperature Sensor Status Change",
                            "device_ID": device_ID,
                            "num_of_soil_temperature_sensor": post_soil_temperature_sensor_json_data.num_of_soil_temperature_sensor,
                            "sensor_status_list": sensor_status_list
                        }
                        websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User(username, 'Environment', ws_report_cmd);
                        
                        break;
                }
            }
        }
        catch (e) {
            debug("[Soil_Temperature_Sensor_MQTT] Process_Soil_Temperature_Sensor_MQTT_POST_Message() Error " + e);
        }
    }

    self.Process_Soil_Temperature_Sensor_MQTT_GET_Message = async function (username, device_ID, get_soil_temperature_sensor_json_data, callback) {
        try {
            if (get_soil_temperature_sensor_json_data.command != null) {
                switch (get_soil_temperature_sensor_json_data.command) {
                }
            }
        }
        catch (e) {
            debug("[Soil_Temperature_Sensor_MQTT] Process_Soil_Temperature_Sensor_MQTT_GET_Message() Error " + e);
        }
    }

}
module.exports = Soil_Temperature_Sensor_MQTT;
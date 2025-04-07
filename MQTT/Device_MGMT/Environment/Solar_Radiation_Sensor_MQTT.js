
var debug = require('debug')(require('path').basename(__filename));

var Solar_Radiation_Sensor_API = require('../../../Device_MGMT/Environment/Solar_Radiation_Sensor_API.js');
var solar_radiation_sensor_api = new Solar_Radiation_Sensor_API();

var WebSocket = require('../../../Web/WebSocket.js');
var websocket = new WebSocket();

var Solar_Radiation_Sensor_MQTT = function () {
    var self = this;

    self.Process_Solar_Radiation_Sensor_MQTT_POST_Message = async function (username, device_ID, post_solar_radiation_sensor_json_data) {
        try {
            if (post_solar_radiation_sensor_json_data.command != null) {
                var record_status_list = [];
                var sensor_status_list = [];
                var ws_report_cmd = {};

                switch (post_solar_radiation_sensor_json_data.command) {
                    case "report solar radiation sensor current measure":
                        var device_info_json = await solar_radiation_sensor_api.Solar_Radiation_Sensor_Get_Device_Info(username, device_ID);
                        switch(device_info_json.sensor_model)
                        {
                            case "SMR30":
                                for(var i = 0; i<post_solar_radiation_sensor_json_data.num_of_solar_radiation_sensor; i++)
                                {
                                    var sensor_index = post_solar_radiation_sensor_json_data.individual_sensor_status[i].sensor_index;
                                    sensor_status_list.push({
                                        "sensor_index": sensor_index,
                                        "measure_temperature": post_solar_radiation_sensor_json_data.individual_sensor_status[i].measure_temperature,
                                        "measure_solar_radiation": post_solar_radiation_sensor_json_data.individual_sensor_status[i].measure_solar_radiation
                                    });
                                    record_status_list.push({
                                        "name": "sensor_"+sensor_index+"_measure_temperature",
                                        "value": post_solar_radiation_sensor_json_data.individual_sensor_status[i].measure_temperature
                                    });
                                    record_status_list.push({
                                        "name": "sensor_"+sensor_index+"_measure_solar_radiation",
                                        "value": post_solar_radiation_sensor_json_data.individual_sensor_status[i].measure_solar_radiation
                                    });
                                }
                                break;
                            default:
                                for(var i = 0; i<post_solar_radiation_sensor_json_data.num_of_solar_radiation_sensor; i++)
                                {
                                    var sensor_index = post_solar_radiation_sensor_json_data.individual_sensor_status[i].sensor_index;
                                    sensor_status_list.push({
                                        "sensor_index": sensor_index,
                                        "measure_solar_radiation": post_solar_radiation_sensor_json_data.individual_sensor_status[i].measure_solar_radiation
                                    });
                                    record_status_list.push({
                                        "name": "sensor_"+sensor_index+"_measure_solar_radiation",
                                        "value": post_solar_radiation_sensor_json_data.individual_sensor_status[i].measure_solar_radiation
                                    });
                                }
                                break;
                        }
                        
                        await mqtt_app.MQTT_APP_Record_Measure_State(device_ID, record_status_list);

                        await mqtt_app.MQTT_APP_Trigger_Rule_Action("Solar Radiation Sensor", device_ID, sensor_status_list);
                        
                        ws_report_cmd = {
                            "command_type": "Solar Radiation Sensor",
                            "command": "Report Solar Radiation Sensor Current Measure",
                            "device_ID": device_ID,
                            "num_of_solar_radiation_sensor": post_solar_radiation_sensor_json_data.num_of_solar_radiation_sensor,
                            "sensor_status_list": sensor_status_list
                        }
                        websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User(username, 'Environment', ws_report_cmd);
                        
                        break;
                    case "report solar radiation sensor status change":
                        var device_info_json = await solar_radiation_sensor_api.Solar_Radiation_Sensor_Get_Device_Info(username, device_ID);
                        switch(device_info_json.sensor_model)
                        {
                            case "SMR30":
                            default:
                                for(var i = 0; i<post_solar_radiation_sensor_json_data.num_of_solar_radiation_sensor; i++)
                                {
                                    sensor_status_list.push({
                                        "sensor_index": post_solar_radiation_sensor_json_data.individual_sensor_status[i].sensor_index,
                                    });
                                }
                                break;
                        }
                        
                        ws_report_cmd = {
                            "command_type": "Solar Radiation Sensor",
                            "command": "Report Solar Radiation Sensor Status Change",
                            "device_ID": device_ID,
                            "num_of_solar_radiation_sensor": post_solar_radiation_sensor_json_data.num_of_solar_radiation_sensor,
                            "sensor_status_list": sensor_status_list
                        }
                        websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User(username, 'Environment', ws_report_cmd);
                        
                        break;
                }
            }
        }
        catch (e) {
            debug("[Solar_Radiation_Sensor_MQTT] Process_Solar_Radiation_Sensor_MQTT_POST_Message() Error " + e);
        }
    }

    self.Process_Solar_Radiation_Sensor_MQTT_GET_Message = async function (username, device_ID, get_solar_radiation_sensor_json_data, callback) {
        try {
            if (get_solar_radiation_sensor_json_data.command != null) {
                switch (get_solar_radiation_sensor_json_data.command) {
                }
            }
        }
        catch (e) {
            debug("[Solar_Radiation_Sensor_MQTT] Process_Solar_Radiation_Sensor_MQTT_GET_Message() Error " + e);
        }
    }

}
module.exports = Solar_Radiation_Sensor_MQTT;

var debug = require('debug')(require('path').basename(__filename));

var Soil_Moisture_Sensor_API = require('../../../Device_MGMT/Environment/Soil_Moisture_Sensor_API.js');
var soil_moisture_sensor_api = new Soil_Moisture_Sensor_API();

var WebSocket = require('../../../Web/WebSocket.js');
var websocket = new WebSocket();

var Soil_Moisture_Sensor_MQTT = function () {
    var self = this;

    self.Process_Soil_Moisture_Sensor_MQTT_POST_Message = async function (username, device_ID, post_soil_moisture_sensor_json_data) {
        try {
            if (post_soil_moisture_sensor_json_data.command != null) {
                var record_status_list = [];
                var sensor_status_list = [];
                var ws_report_cmd = {};

                switch (post_soil_moisture_sensor_json_data.command) {
                    case "report soil moisture sensor current measure":
                        var device_info_json = await soil_moisture_sensor_api.Soil_Moisture_Sensor_Get_Device_Info(username, device_ID);
                        switch(device_info_json.sensor_model)
                        {
                            case "SWR-100":
                                for(var i = 0; i<post_soil_moisture_sensor_json_data.num_of_soil_moisture_sensor; i++)
                                {
                                    var sensor_index = post_soil_moisture_sensor_json_data.individual_sensor_status[i].sensor_index;
                                    sensor_status_list.push({
                                        "sensor_index": sensor_index,
                                        "measure_soil_moisture": post_soil_moisture_sensor_json_data.individual_sensor_status[i].measure_soil_moisture,
                                    });
                                    record_status_list.push({
                                        "name": "sensor_"+sensor_index+"_measure_soil_moisture",
                                        "value": post_soil_moisture_sensor_json_data.individual_sensor_status[i].measure_soil_moisture
                                    });
                                }
                                break;
                            default:
                                for(var i = 0; i<post_soil_moisture_sensor_json_data.num_of_soil_moisture_sensor; i++)
                                {
                                    var sensor_index = post_soil_moisture_sensor_json_data.individual_sensor_status[i].sensor_index;
                                    sensor_status_list.push({
                                        "sensor_index": sensor_index,
                                        "measure_soil_moisture": post_soil_moisture_sensor_json_data.individual_sensor_status[i].measure_soil_moisture,
                                    });
                                    record_status_list.push({
                                        "name": "sensor_"+sensor_index+"_measure_soil_moisture",
                                        "value": post_soil_moisture_sensor_json_data.individual_sensor_status[i].measure_soil_moisture
                                    });
                                }
                                break;
                        }
                        
                        await mqtt_app.MQTT_APP_Record_Measure_State(device_ID, record_status_list);

                        await mqtt_app.MQTT_APP_Trigger_Rule_Action("Soil Moisture Sensor", device_ID, sensor_status_list);
                        
                        ws_report_cmd = {
                            "command_type": "Soil Moisture Sensor",
                            "command": "Report Soil Moisture Sensor Current Measure",
                            "device_ID": device_ID,
                            "num_of_soil_moisture_sensor": post_soil_moisture_sensor_json_data.num_of_soil_moisture_sensor,
                            "sensor_status_list": sensor_status_list
                        }
                        websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User(username, 'Environment', ws_report_cmd);
                        
                        break;
                    case "report soil moisture sensor status change":
                        var device_info_json = await soil_moisture_sensor_api.Soil_Moisture_Sensor_Get_Device_Info(username, device_ID);
                        switch(device_info_json.sensor_model)
                        {
                            case "SWR-100":
                            default:
                                for(var i = 0; i<post_soil_moisture_sensor_json_data.num_of_soil_moisture_sensor; i++)
                                {
                                    sensor_status_list.push({
                                        "sensor_index": post_soil_moisture_sensor_json_data.individual_sensor_status[i].sensor_index,
                                    });
                                }
                                break;
                        }
                        
                        ws_report_cmd = {
                            "command_type": "Soil Moisture Sensor",
                            "command": "Report Soil Moisture Sensor Status Change",
                            "device_ID": device_ID,
                            "num_of_soil_moisture_sensor": post_soil_moisture_sensor_json_data.num_of_soil_moisture_sensor,
                            "sensor_status_list": sensor_status_list
                        }
                        websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User(username, 'Environment', ws_report_cmd);
                        
                        break;
                }
            }
        }
        catch (e) {
            debug("[Soil_Moisture_Sensor_MQTT] Process_Soil_Moisture_Sensor_MQTT_POST_Message() Error " + e);
        }
    }

    self.Process_Soil_Moisture_Sensor_MQTT_GET_Message = async function (username, device_ID, get_soil_moisture_sensor_json_data, callback) {
        try {
            if (get_soil_moisture_sensor_json_data.command != null) {
                switch (get_soil_moisture_sensor_json_data.command) {
                }
            }
        }
        catch (e) {
            debug("[Soil_Moisture_Sensor_MQTT] Process_Soil_Moisture_Sensor_MQTT_GET_Message() Error " + e);
        }
    }

}
module.exports = Soil_Moisture_Sensor_MQTT;
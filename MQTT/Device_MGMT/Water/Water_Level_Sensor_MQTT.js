
var debug = require('debug')(require('path').basename(__filename));

var Water_Level_Sensor_API = require('../../../Device_MGMT/Water/Water_Level_Sensor_API.js');
var water_level_sensor_api = new Water_Level_Sensor_API();

var Water_Level_Sensor_API_MQTT = require('./Water_Level_Sensor_API_MQTT.js');
var water_level_sensor_api_mqtt = new Water_Level_Sensor_API_MQTT();

var WebSocket = require('../../../Web/WebSocket.js');
var websocket = new WebSocket();

var Water_Level_Sensor_MQTT = function () {
    var self = this;

    self.Process_Water_Level_Sensor_MQTT_POST_Message = async function (username, device_ID, post_water_level_sensor_json_data) {
        try {
            if (post_water_level_sensor_json_data.command != null) {
                var record_status_list = [];
                var sensor_status_list = [];
                var ws_report_cmd = {};
                
                switch (post_water_level_sensor_json_data.command) {
                    case "report water level sensor current measure":
                        var device_info_json = await water_level_sensor_api.Water_Level_Sensor_Get_Device_Info(username, device_ID);
                        switch(device_info_json.sensor_model)
                        {
                            case "SMR02":
                                for(var i = 0; i<post_water_level_sensor_json_data.num_of_water_level_sensor; i++)
                                {
                                    var sensor_index = post_water_level_sensor_json_data.individual_sensor_status[i].sensor_index;
                                    sensor_status_list.push({
                                        "sensor_index": sensor_index,
                                        "measure_temperature": post_water_level_sensor_json_data.individual_sensor_status[i].measure_temperature,
                                        "measure_water_level": post_water_level_sensor_json_data.individual_sensor_status[i].measure_water_level
                                    });
                                    record_status_list.push({
                                        "name": "sensor_"+sensor_index+"_measure_temperature",
                                        "value": post_water_level_sensor_json_data.individual_sensor_status[i].measure_temperature
                                    });
                                    record_status_list.push({
                                        "name": "sensor_"+sensor_index+"_measure_water_level",
                                        "value": post_water_level_sensor_json_data.individual_sensor_status[i].measure_water_level
                                    });
                                }
                                break;
                            default:
                                for(var i = 0; i<post_water_level_sensor_json_data.num_of_water_level_sensor; i++)
                                {
                                    var sensor_index = post_water_level_sensor_json_data.individual_sensor_status[i].sensor_index;
                                    sensor_status_list.push({
                                        "sensor_index": sensor_index,
                                        "measure_water_level": post_water_level_sensor_json_data.individual_sensor_status[i].measure_water_level
                                    });
                                    record_status_list.push({
                                        "name": "sensor_"+sensor_index+"_measure_water_level",
                                        "value": post_water_level_sensor_json_data.individual_sensor_status[i].measure_water_level
                                    });
                                }
                                break;
                        }
                        
                        await mqtt_app.MQTT_APP_Record_Measure_State(device_ID, record_status_list);

                        await mqtt_app.MQTT_APP_Trigger_Rule_Action("Water Level Sensor", device_ID, sensor_status_list);
                        
                        ws_report_cmd = {
                            "command_type": "Water Level Sensor",
                            "command": "Report Water Level Sensor Current Measure",
                            "device_ID": device_ID,
                            "num_of_water_level_sensor": post_water_level_sensor_json_data.num_of_water_level_sensor,
                            "sensor_status_list": sensor_status_list
                        }
                        websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User(username, 'Water', ws_report_cmd);
                        
                        break;
                    case "report water level sensor status change":
                        var device_info_json = await water_level_sensor_api.Water_Level_Sensor_Get_Device_Info(username, device_ID);
                        switch(device_info_json.sensor_model)
                        {
                            case "SMR02":
                            default:
                                for(var i = 0; i<post_water_level_sensor_json_data.num_of_water_level_sensor; i++)
                                {
                                    sensor_status_list.push({
                                        "sensor_index": post_water_level_sensor_json_data.individual_sensor_status[i].sensor_index,
                                    });
                                }
                                break;
                        }
                        
                        ws_report_cmd = {
                            "command_type": "Water Level Sensor",
                            "command": "Report Water Level Sensor Status Change",
                            "device_ID": device_ID,
                            "num_of_water_level_sensor": post_water_level_sensor_json_data.num_of_water_level_sensor,
                            "sensor_status_list": sensor_status_list
                        }
                        websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User(username, 'Water', ws_report_cmd);
                        
                        break;
                }
            }
        }
        catch (e) {
            debug("[Water_Level_Sensor_MQTT] Process_Water_Level_Sensor_MQTT_POST_Message() Error " + e);
        };
    }

    self.Process_Water_Level_Sensor_MQTT_GET_Message = async function (username, device_ID, get_Water_Level_Sensor_json_data, rsp_callback) {
        try {
            if (get_Water_Level_Sensor_json_data.command != null) {
                switch (get_Water_Level_Sensor_json_data.command) {
                }
            }
        }
        catch (e) {
            debug("[Water_Level_Sensor_MQTT] Process_Water_Level_Sensor_MQTT_GET_Message() Error " + e);
        };
    }
}
module.exports = Water_Level_Sensor_MQTT;
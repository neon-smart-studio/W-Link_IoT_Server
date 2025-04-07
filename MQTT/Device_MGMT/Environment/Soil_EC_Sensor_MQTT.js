
var debug = require('debug')(require('path').basename(__filename));

var Soil_EC_Sensor_API = require('../../../Device_MGMT/Environment/Soil_EC_Sensor_API.js');
var soil_ec_sensor_api = new Soil_EC_Sensor_API();

var WebSocket = require('../../../Web/WebSocket.js');
var websocket = new WebSocket();

var Soil_EC_Sensor_MQTT = function () {
    var self = this;

    self.Process_Soil_EC_Sensor_MQTT_POST_Message = async function (username, device_ID, post_soil_ec_sensor_json_data) {
        try {
            if (post_soil_ec_sensor_json_data.command != null) {
                var record_status_list = [];
                var sensor_status_list = [];
                var ws_report_cmd = {};

                switch (post_soil_ec_sensor_json_data.command) {
                    case "report soil ec sensor current measure":
                    case "report soil electrical conductivity sensor current measure":
                        var device_info_json = await soil_ec_sensor_api.Soil_EC_Sensor_Get_Device_Info(username, device_ID);
                        switch(device_info_json.sensor_model)
                        {
                            case "ST-EC":
                                for(var i = 0; i<post_soil_ec_sensor_json_data.num_of_soil_ec_sensor; i++)
                                {
                                    var sensor_index = post_soil_ec_sensor_json_data.individual_sensor_status[i].sensor_index;
                                    sensor_status_list.push({
                                        "sensor_index": sensor_index,
                                        "measure_soil_ec_mS_cm": post_soil_ec_sensor_json_data.individual_sensor_status[i].measure_soil_ec_mS_cm,
                                        "measure_soil_ec_S_m": post_soil_ec_sensor_json_data.individual_sensor_status[i].measure_soil_ec_S_m
                                    });
                                    record_status_list.push({
                                        "name": "sensor_"+sensor_index+"_measure_soil_ec_mS_cm",
                                        "value": post_soil_ec_sensor_json_data.individual_sensor_status[i].measure_soil_ec_mS_cm
                                    });
                                    record_status_list.push({
                                        "name": "sensor_"+sensor_index+"_measure_soil_ec_S_m",
                                        "value": post_soil_ec_sensor_json_data.individual_sensor_status[i].measure_soil_ec_S_m
                                    });
                                }
                                break;
                            default:
                                for(var i = 0; i<post_soil_ec_sensor_json_data.num_of_soil_ec_sensor; i++)
                                {
                                    var sensor_index = post_soil_ec_sensor_json_data.individual_sensor_status[i].sensor_index;
                                    sensor_status_list.push({
                                        "sensor_index": sensor_index,
                                        "measure_soil_ec_S_m": post_soil_ec_sensor_json_data.individual_sensor_status[i].measure_soil_ec_S_m
                                    });
                                    record_status_list.push({
                                        "name": "sensor_"+sensor_index+"_measure_soil_ec_S_m",
                                        "value": post_soil_ec_sensor_json_data.individual_sensor_status[i].measure_soil_ec_S_m
                                    });
                                }
                                break;
                        }
                        
                        await mqtt_app.MQTT_APP_Record_Measure_State(device_ID, record_status_list);

                        await mqtt_app.MQTT_APP_Trigger_Rule_Action("Soil EC Sensor", device_ID, sensor_status_list);
                        
                        ws_report_cmd = {
                            "command_type": "Soil EC Sensor",
                            "command": "Report Soil EC Sensor Current Measure",
                            "device_ID": device_ID,
                            "num_of_soil_ec_sensor": post_soil_ec_sensor_json_data.num_of_soil_ec_sensor,
                            "sensor_status_list": sensor_status_list
                        }
                        websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User(username, 'Environment', ws_report_cmd);
                        
                        break;
                    case "report soil ec sensor status change":
                    case "report soil electrical conductivity sensor status change":
                        var device_info_json = await soil_ec_sensor_api.Soil_EC_Sensor_Get_Device_Info(username, device_ID);
                        switch(device_info_json.sensor_model)
                        {
                            case "ST-EC":
                            default:
                                for(var i = 0; i<post_soil_ec_sensor_json_data.num_of_soil_ec_sensor; i++)
                                {
                                    sensor_status_list.push({
                                        "sensor_index": post_soil_ec_sensor_json_data.individual_sensor_status[i].sensor_index,
                                    });
                                }
                                break;
                        }
                        
                        ws_report_cmd = {
                            "command_type": "Soil EC Sensor",
                            "command": "Report Soil EC Sensor Status Change",
                            "device_ID": device_ID,
                            "num_of_soil_ec_sensor": post_soil_ec_sensor_json_data.num_of_soil_ec_sensor,
                            "sensor_status_list": sensor_status_list
                        }
                        websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User(username, 'Environment', ws_report_cmd);
                        
                        break;
                }
            }
        }
        catch (e) {
            debug("[Soil_EC_Sensor_MQTT] Process_Soil_EC_Sensor_MQTT_POST_Message() Error " + e);
        }
    }

    self.Process_Soil_EC_Sensor_MQTT_GET_Message = async function (username, device_ID, get_soil_ec_sensor_json_data, callback) {
        try {
            if (get_soil_ec_sensor_json_data.command != null) {
                switch (get_soil_ec_sensor_json_data.command) {
                }
            }
        }
        catch (e) {
            debug("[Soil_EC_Sensor_MQTT] Process_Soil_EC_Sensor_MQTT_GET_Message() Error " + e);
        }
    }

}
module.exports = Soil_EC_Sensor_MQTT;
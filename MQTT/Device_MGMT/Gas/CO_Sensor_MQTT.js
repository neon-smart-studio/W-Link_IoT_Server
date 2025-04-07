
var debug = require('debug')(require('path').basename(__filename));

var CO_Sensor_API = require('../../../Device_MGMT/Gas/CO_Sensor_API.js');
var co_sensor_api = new CO_Sensor_API();

var CO_Sensor_API_MQTT = require('./CO_Sensor_API_MQTT.js');
var co_sensor_api_mqtt = new CO_Sensor_API_MQTT();

var WebSocket = require('../../../Web/WebSocket.js');
var websocket = new WebSocket();

var CO_Sensor_MQTT = function () {
    var self = this;

    self.Process_CO_Sensor_MQTT_POST_Message = async function (username, device_ID, post_co_sensor_json_data) {
        try {
            if (post_co_sensor_json_data.command != null) {
                var record_status_list = [];
                var sensor_status_list = [];
                var ws_report_cmd = {};

                switch (post_co_sensor_json_data.command) {
                    case "report co sensor current measure":
                        var device_info_json = await co_sensor_api.CO_Sensor_Get_Device_Info(username, device_ID);
                        switch(device_info_json.sensor_model)
                        {
                            case "SPEC-Sensor":
                                for(var i = 0; i<post_co_sensor_json_data.num_of_co_sensor; i++)
                                {
                                    var sensor_index = post_co_sensor_json_data.individual_sensor_status[i].sensor_index;
                                    sensor_status_list.push({
                                        "sensor_index": sensor_index,
                                        "measure_co_ppm": post_co_sensor_json_data.individual_sensor_status[i].measure_co_ppm,
                                    });
                                    record_status_list.push({
                                        "name": "sensor_"+sensor_index+"_measure_co_ppm",
                                        "value": post_co_sensor_json_data.individual_sensor_status[i].measure_co_ppm
                                    });
                                }
                                break;
                            default:
                                for(var i = 0; i<post_co_sensor_json_data.num_of_co_sensor; i++)
                                {
                                    var sensor_index = post_co_sensor_json_data.individual_sensor_status[i].sensor_index;
                                    sensor_status_list.push({
                                        "sensor_index": sensor_index,
                                        "measure_co_ppm": post_co_sensor_json_data.individual_sensor_status[i].measure_co_ppm,
                                    });
                                    record_status_list.push({
                                        "name": "sensor_"+sensor_index+"_measure_co_ppm",
                                        "value": post_co_sensor_json_data.individual_sensor_status[i].measure_co_ppm
                                    });
                                }
                                break;
                        }
                    
                        await mqtt_app.MQTT_APP_Record_Measure_State(device_ID, record_status_list);

                        await mqtt_app.MQTT_APP_Trigger_Rule_Action("CO Sensor", device_ID, sensor_status_list);
                        
                        ws_report_cmd = {
                            "command_type": "CO Sensor",
                            "command": "Report CO Sensor Current Measure",
                            "device_ID": device_ID,
                            "num_of_co_sensor": post_co_sensor_json_data.num_of_co_sensor,
                            "sensor_status_list": sensor_status_list
                        }
                        websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User(username, 'Gas', ws_report_cmd);
                        
                        break;
                    case "report co sensor status change":
                        var device_info_json = await co_sensor_api.CO_Sensor_Get_Device_Info(username, device_ID);
                        switch(device_info_json.sensor_model)
                        {
                            case "SPEC-Sensor":
                                for(var i = 0; i<post_co_sensor_json_data.num_of_co_sensor; i++)
                                {
                                    sensor_status_list.push({
                                        "sensor_index": post_co_sensor_json_data.individual_sensor_status[i].sensor_index,
                                    });
                                }
                                break;
                            default:
                                for(var i = 0; i<post_co_sensor_json_data.num_of_co_sensor; i++)
                                {
                                    sensor_status_list.push({
                                        "sensor_index": post_co_sensor_json_data.individual_sensor_status[i].sensor_index,
                                    });
                                }
                                break;
                        }
                        
                        ws_report_cmd = {
                            "command_type": "CO Sensor",
                            "command": "Report CO Sensor Status Change",
                            "device_ID": device_ID,
                            "num_of_co_sensor": post_co_sensor_json_data.num_of_co_sensor,
                            "sensor_status_list": sensor_status_list
                        }
                        websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User(username, 'Gas', ws_report_cmd);
                        
                        break;
                }
            }
        }
        catch (e) {
            debug("[CO_Sensor_MQTT] Process_CO_Sensor_MQTT_POST_Message() Error " + e);
        }
    }

    self.Process_CO_Sensor_MQTT_GET_Message = async function (username, device_ID, get_co_sensor_json_data, callback) {
        try {
            if (get_co_sensor_json_data.command != null) {
                switch (get_co_sensor_json_data.command) {
                }
            }
        }
        catch (e) {
            debug("[CO_Sensor_MQTT] Process_CO_Sensor_MQTT_GET_Message() Error " + e);
        }
    }

}
module.exports = CO_Sensor_MQTT;
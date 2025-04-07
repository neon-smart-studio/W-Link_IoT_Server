
var debug = require('debug')(require('path').basename(__filename));

var Light_Sensor_API = require('../../../Device_MGMT/Lighting/Light_Sensor_API.js');
var light_sensor_api = new Light_Sensor_API();

var WebSocket = require('../../../Web/WebSocket.js');
var websocket = new WebSocket();

var Light_Sensor_MQTT = function () {
    var self = this;

    self.Process_Light_Sensor_MQTT_POST_Message = async function (username, device_ID, post_light_sensor_json_data) {
        try {
            if (post_light_sensor_json_data.command != null) {
                var record_status_list = [];
                var sensor_status_list = [];
                var ws_report_cmd = {};

                switch (post_light_sensor_json_data.command) {
                    case "report light sensor current measure":
                        var device_info_json = await light_sensor_api.Light_Sensor_Get_Device_Info(username, device_ID);
                        switch(device_info_json.sensor_model)
                        {
                            case "BH1750FVI":
                                for(var i = 0; i<post_light_sensor_json_data.num_of_light_sensor; i++)
                                {
                                    var sensor_index = post_light_sensor_json_data.individual_sensor_status[i].sensor_index;
                                    sensor_status_list.push({
                                        "sensor_index": sensor_index,
                                        "measure_lux": post_light_sensor_json_data.individual_sensor_status[i].measure_lux,
                                    });
                                    record_status_list.push({
                                        "name": "sensor_"+sensor_index+"_measure_lux",
                                        "value": post_light_sensor_json_data.individual_sensor_status[i].measure_lux
                                    });
                                }
                                break;
                            default:
                                for(var i = 0; i<post_light_sensor_json_data.num_of_light_sensor; i++)
                                {
                                    var sensor_index = post_light_sensor_json_data.individual_sensor_status[i].sensor_index;
                                    sensor_status_list.push({
                                        "sensor_index": sensor_index,
                                        "measure_lux": post_light_sensor_json_data.individual_sensor_status[i].measure_lux,
                                    });
                                    record_status_list.push({
                                        "name": "sensor_"+sensor_index+"_measure_lux",
                                        "value": post_light_sensor_json_data.individual_sensor_status[i].measure_lux
                                    });
                                }
                                break;
                        }
                        
                        await mqtt_app.MQTT_APP_Record_Measure_State(device_ID, record_status_list);

                        await mqtt_app.MQTT_APP_Trigger_Rule_Action("Light Sensor", device_ID, sensor_status_list);
                        
                        ws_report_cmd = {
                            "command_type": "Light Sensor",
                            "command": "Report Light Sensor Current Measure",
                            "device_ID": device_ID,
                            "num_of_light_sensor": post_light_sensor_json_data.num_of_light_sensor,
                            "sensor_status_list": sensor_status_list
                        }
                        websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User(username, 'Lighting', ws_report_cmd);
                        
                        break;
                    case "report light sensor status change":
                        var device_info_json = await light_sensor_api.Light_Sensor_Get_Device_Info(username, device_ID);
                        switch(device_info_json.sensor_model)
                        {
                            case "BH1750FVI":
                                for(var i = 0; i<post_light_sensor_json_data.num_of_light_sensor; i++)
                                {
                                    sensor_status_list.push({
                                        "sensor_index": post_light_sensor_json_data.individual_sensor_status[i].sensor_index,
                                        "ms_lux_resolution": post_light_sensor_json_data.individual_sensor_status[i].ms_lux_resolution
                                    });
                                }
                                break;
                            default:
                                for(var i = 0; i<post_light_sensor_json_data.num_of_light_sensor; i++)
                                {
                                    sensor_status_list.push({
                                        "sensor_index": post_light_sensor_json_data.individual_sensor_status[i].sensor_index
                                    });
                                }
                                break;
                        }
                        
                        ws_report_cmd = {
                            "command_type": "Light Sensor",
                            "command": "Report Light Sensor Status Change",
                            "device_ID": device_ID,
                            "num_of_light_sensor": post_light_sensor_json_data.num_of_light_sensor,
                            "sensor_status_list": sensor_status_list
                        }
                        websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User(username, 'Lighting', ws_report_cmd);
                        
                        break;
                }
            }
        }
        catch (e) {
            debug("[Light_Sensor_MQTT] Process_Light_Sensor_MQTT_POST_Message() Error " + e);
        }
    }

    self.Process_Light_Sensor_MQTT_GET_Message = async function (username, device_ID, get_light_sensor_json_data, callback) {
        try {
            if (get_light_sensor_json_data.command != null) {
                switch (get_light_sensor_json_data.command) {
                }
            }
        }
        catch (e) {
            debug("[Light_Sensor_MQTT] Process_Light_Sensor_MQTT_GET_Message() Error " + e);
        }
    }
}
module.exports = Light_Sensor_MQTT;

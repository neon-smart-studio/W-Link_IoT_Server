
var debug = require('debug')(require('path').basename(__filename));

var Atmosphere_Box_API = require('../../../Device_MGMT/AirQuality/Atmosphere_Box_API.js');
var atmosphere_box_api = new Atmosphere_Box_API();

var WebSocket = require('../../../Web/WebSocket.js');
var websocket = new WebSocket();

var MQTT_APP = require('../../MQTT_APP.js');
var mqtt_app = new MQTT_APP();

var Atmosphere_Box_MQTT = function () {
    var self = this;

    self.Process_Atmosphere_Box_MQTT_POST_Message = async function (username, device_ID, post_atmosphere_box_json_data) {
        try {
            if (post_atmosphere_box_json_data.command != null) {
                var record_status_list = [];
                var analyze_attribute_list = [];
                var ws_report_cmd = {};
                
                switch (post_atmosphere_box_json_data.command) {
                    case "report atmosphere box current measure":
                        
                        var sensor_status = {
                            "measure_temperature": post_atmosphere_box_json_data.measure_temperature,
                            "measure_humidity": post_atmosphere_box_json_data.measure_humidity,
                            "measure_pm_2_5": post_atmosphere_box_json_data.measure_pm_2_5,
                            "measure_tvoc": post_atmosphere_box_json_data.measure_tvoc,
                            "measure_co_ppm": post_atmosphere_box_json_data.measure_co_ppm,
                            "measure_co2_ppm": post_atmosphere_box_json_data.measure_co2_ppm
                        };

                        for(var key in sensor_status)
                        {
                            record_status_list.push({
                                "name": key,
                                "value": sensor_status[key]
                            })
                            analyze_attribute_list.push(key);
                        }

                        await mqtt_app.MQTT_APP_Record_Measure_State(device_ID, record_status_list);

                        await mqtt_app.MQTT_APP_Trigger_Rule_Action("Atmosphere Box", device_ID, sensor_status);
                        
                        ws_report_cmd = {
                            "command_type": "Atmosphere Box",
                            "command": "Report Atmosphere Box Current Measure",
                            "device_ID": device_ID,
                            "measure_temperature": post_atmosphere_box_json_data.measure_temperature,
                            "measure_humidity": post_atmosphere_box_json_data.measure_humidity,
                            "measure_pm_2_5": post_atmosphere_box_json_data.measure_pm_2_5,
                            "measure_tvoc": post_atmosphere_box_json_data.measure_tvoc,
                            "measure_co_ppm": post_atmosphere_box_json_data.measure_co_ppm,
                            "measure_co2_ppm": post_atmosphere_box_json_data.measure_co2_ppm
                        };
                        websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User(username, 'AirQuality', ws_report_cmd);
                        
                        break;
                    case "report atmosphere box status change":
                        ws_report_cmd = {
                            "command_type": "Atmosphere Box",
                            "command": "Report Atmosphere Box Status Change",
                            "device_ID": device_ID,
                            "CO_sensor_info": {
                                "sensitivity_nA_PPM": post_atmosphere_box_json_data.CO_sensor_info.sensitivity_nA_PPM,
                                "sensor_resistance": post_atmosphere_box_json_data.CO_sensor_info.sensor_resistance
                            }
                        }
                        websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User(username, 'AirQuality', ws_report_cmd);
                        
                        break;
                }
            }
        }
        catch (e) {
            debug("[Atmosphere_Box_MQTT] Process_Atmosphere_Box_MQTT_POST_Message() Error " + e);
        }
    }

    self.Process_Atmosphere_Box_MQTT_GET_Message = async function (username, device_ID, get_atmosphere_box_json_data, callback) {
        try {
            if (get_atmosphere_box_json_data.command != null) {
                switch (get_atmosphere_box_json_data.command) {
                }
            }
        }
        catch (e) {
            debug("[Atmosphere_Box_MQTT] Process_Atmosphere_Box_MQTT_GET_Message() Error " + e);
        }
    }

}
module.exports = Atmosphere_Box_MQTT;
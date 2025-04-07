
var debug = require('debug')(require('path').basename(__filename));

var Weather_Station_API = require('../../../Device_MGMT/Weather/Weather_Station_API.js');
var weather_station_api = new Weather_Station_API();

var WebSocket = require('../../../Web/WebSocket.js');
var websocket = new WebSocket();

var MQTT_APP = require('../../MQTT_APP.js');
var mqtt_app = new MQTT_APP();

var Weather_Station_MQTT = function () {
    var self = this;

    self.Process_Weather_Station_MQTT_POST_Message = async function (username, device_ID, post_weather_station_json_data) {
        try {
            if (post_weather_station_json_data.command != null) {
                var record_status_list = [];
                var analyze_attribute_list = [];
                var ws_report_cmd = {};

                switch (post_weather_station_json_data.command) {
                    case "report weather station current measure":

                        var measure_result = {
                            "measure_temperature": post_weather_station_json_data.measure_temperature,
                            "measure_humidity": post_weather_station_json_data.measure_humidity,
                            "measure_rain_rate_mm_hr": post_weather_station_json_data.measure_rain_rate_mm_hr,
                            "measure_wind_speed": post_weather_station_json_data.measure_wind_speed,
                            "measure_wind_direction": post_weather_station_json_data.measure_wind_direction,
                            "measure_solar_radiation": post_weather_station_json_data.measure_solar_radiation,
                            "measure_UV_index": post_weather_station_json_data.measure_UV_index,
                            "measure_UV_MED_hr": post_weather_station_json_data.measure_UV_MED_hr,
                            "measure_wetness": post_weather_station_json_data.measure_wetness,
                            "measure_soil_temperature": get_rsp_json.measure_soil_temperature,
                            "measure_soil_moisture": get_rsp_json.measure_soil_moisture
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

                        await mqtt_app.MQTT_APP_Trigger_Rule_Action("Weather Station", device_ID, measure_result);
                        
                        ws_report_cmd = Object.assign({},{
                            "command_type": "Weather Station",
                            "command": "Report Weather Station Current Measure",
                            "device_ID": device_ID,
                        },measure_result);
                        
                        websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User(username, 'Weather', ws_report_cmd);
                        
                        break;
                    case "report weather station status change":
                        
                        ws_report_cmd = {
                            "command_type": "Weather Station",
                            "command": "Report Weather Station Status Change",
                            "device_ID": device_ID,
                            "fan_on_off": get_rsp_json.fan.on_off,
                            "fan_pwm_level": get_rsp_json.fan.current_pwm_level
                        }

                        websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User(username, 'Weather', ws_report_cmd);
                        
                        break;
                }
            }
        }
        catch (e) {
            debug("[Weather_Station_MQTT] Process_Weather_Station_MQTT_POST_Message() Error " + e);
        }
    }

    self.Process_Weather_Station_MQTT_GET_Message = async function (username, device_ID, get_weather_station_json_data, callback) {
        try {
            if (get_weather_station_json_data.command != null) {
                switch (get_weather_station_json_data.command) {
                }
            }
        }
        catch (e) {
            debug("[Weather_Station_MQTT] Process_Weather_Station_MQTT_GET_Message() Error " + e);
        }
    }

}
module.exports = Weather_Station_MQTT;
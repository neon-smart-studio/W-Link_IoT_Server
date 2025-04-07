
var debug = require('debug')(require('path').basename(__filename));

var Wind_Guage_API = require('../../../Device_MGMT/Environment/Wind_Guage_API.js');
var wind_guage_api = new Wind_Guage_API();

var WebSocket = require('../../../Web/WebSocket.js');
var websocket = new WebSocket();

var Wind_Guage_MQTT = function () {
    var self = this;

    self.Process_Wind_Guage_MQTT_POST_Message = async function (username, device_ID, post_wind_guage_json_data) {
        try {
            if (post_wind_guage_json_data.command != null) {
                var record_status_list = [];
                var guage_status_list = [];
                var ws_report_cmd = {};

                switch (post_wind_guage_json_data.command) {
                    case "report wind guage current measure":
                        var device_info_json = await wind_guage_api.Wind_Guage_Get_Device_Info(username, device_ID);
                        switch(device_info_json.guage_model)
                        {
                            case "YGC-FS":
                                for(var i = 0; i<post_wind_guage_json_data.num_of_wind_guage; i++)
                                {
                                    var guage_index = post_rain_guage_json_data.individual_guage_status[i].guage_index;
                                    guage_status_list.push({
                                        "guage_index": guage_index,
                                        "measure_wind_speed": post_wind_guage_json_data.individual_guage_status[i].measure_wind_speed,
                                        "measure_wind_direction": post_wind_guage_json_data.individual_guage_status[i].measure_wind_direction
                                    });
                                    record_status_list.push({
                                        "name": "guage_"+guage_index+"_measure_wind_speed",
                                        "value": post_rain_guage_json_data.individual_guage_status[i].measure_wind_speed
                                    });
                                    record_status_list.push({
                                        "name": "guage_"+guage_index+"_measure_wind_direction",
                                        "value": post_rain_guage_json_data.individual_guage_status[i].measure_wind_direction
                                    });
                                }
                                break;
                            default:
                                for(var i = 0; i<post_wind_guage_json_data.num_of_wind_guage; i++)
                                {
                                    var guage_index = post_rain_guage_json_data.individual_guage_status[i].guage_index;
                                    guage_status_list.push({
                                        "guage_index": guage_index,
                                        "measure_wind_speed": post_wind_guage_json_data.individual_guage_status[i].measure_wind_speed,
                                        "measure_wind_direction": post_wind_guage_json_data.individual_guage_status[i].measure_wind_direction
                                    });
                                    record_status_list.push({
                                        "name": "guage_"+guage_index+"_measure_wind_speed",
                                        "value": post_rain_guage_json_data.individual_guage_status[i].measure_wind_speed
                                    });
                                    record_status_list.push({
                                        "name": "guage_"+guage_index+"_measure_wind_direction",
                                        "value": post_rain_guage_json_data.individual_guage_status[i].measure_wind_direction
                                    });
                                }
                                break;
                        }
                        
                        await mqtt_app.MQTT_APP_Record_Measure_State(device_ID, record_status_list);

                        await mqtt_app.MQTT_APP_Trigger_Rule_Action("Wind Guage", device_ID, guage_status_list);
                        
                        ws_report_cmd = {
                            "command_type": "Wind Guage",
                            "command": "Report Wind Guage Current Measure",
                            "device_ID": device_ID,
                            "num_of_wind_guage": post_wind_guage_json_data.num_of_wind_guage,
                            "guage_status_list": guage_status_list
                        }
                        websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User(username, 'Environment', ws_report_cmd);
                        
                        break;
                    case "report wind guage status change":
                        var device_info_json = await wind_guage_api.Wind_Guage_Get_Device_Info(username, device_ID);
                        switch(device_info_json.guage_model)
                        {
                            case "YGC-FS":
                                for(var i = 0; i<post_wind_guage_json_data.num_of_wind_guage; i++)
                                {
                                    guage_status_list.push({
                                        "guage_index": post_wind_guage_json_data.individual_guage_status[i].guage_index,
                                        "measure_wind_speed": post_wind_guage_json_data.individual_guage_status[i].measure_wind_speed,
                                        "measure_wind_direction": post_wind_guage_json_data.individual_guage_status[i].measure_wind_direction
                                    });
                                }
                                break;
                            default:
                                for(var i = 0; i<post_wind_guage_json_data.num_of_wind_guage; i++)
                                {
                                    guage_status_list.push({
                                        "guage_index": post_wind_guage_json_data.individual_guage_status[i].guage_index,
                                        "measure_wind_speed": post_wind_guage_json_data.individual_guage_status[i].measure_wind_speed,
                                        "measure_wind_direction": post_wind_guage_json_data.individual_guage_status[i].measure_wind_direction
                                        });
                                }
                                break;
                        }
                        
                        ws_report_cmd = {
                            "command_type": "Wind Guage",
                            "command": "Report Wind Guage Status Change",
                            "device_ID": device_ID,
                            "num_of_wind_guage": post_wind_guage_json_data.num_of_wind_guage,
                            "guage_status_list": guage_status_list
                        }
                        websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User(username, 'Environment', ws_report_cmd);
                        
                        break;
                }
            }
        }
        catch (e) {
            debug("[Wind_Guage_MQTT] Process_Wind_Guage_MQTT_POST_Message() Error " + e);
        }
    }

    self.Process_Wind_Guage_MQTT_GET_Message = async function (username, device_ID, get_wind_guage_json_data, callback) {
        try {
            if (get_wind_guage_json_data.command != null) {
                switch (get_wind_guage_json_data.command) {
                }
            }
        }
        catch (e) {
            debug("[Wind_Guage_MQTT] Process_Wind_Guage_MQTT_GET_Message() Error " + e);
        }
    }

}
module.exports = Wind_Guage_MQTT;
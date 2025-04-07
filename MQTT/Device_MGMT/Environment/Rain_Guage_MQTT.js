
var debug = require('debug')(require('path').basename(__filename));

var Rain_Guage_API = require('../../../Device_MGMT/Environment/Rain_Guage_API.js');
var rain_guage_api = new Rain_Guage_API();

var WebSocket = require('../../../Web/WebSocket.js');
var websocket = new WebSocket();

var Traffic_APP = require('../../../Application/Traffic/Traffic_APP.js');
var traffic_app = new Traffic_APP();

var Rain_Guage_MQTT = function () {
    var self = this;

    self.Process_Rain_Guage_MQTT_POST_Message = async function (username, device_ID, post_rain_guage_json_data) {
        try {
            if (post_rain_guage_json_data.command != null) {
                var record_status_list = [];
                var guage_status_list = [];
                var ws_report_cmd = {};

                switch (post_rain_guage_json_data.command) {
                    case "report rain guage current measure":
                        var device_info_json = await rain_guage_api.Rain_Guage_Get_Device_Info(username, device_ID);
                        switch(device_info_json.guage_model)
                        {
                            case "WH0531":
                                for(var i = 0; i<post_rain_guage_json_data.num_of_rain_guage; i++)
                                {
                                    var guage_index = post_rain_guage_json_data.individual_guage_status[i].guage_index;
                                    guage_status_list.push({
                                        "guage_index": guage_index,
                                        "measure_rain_rate_mm_hr": post_rain_guage_json_data.individual_guage_status[i].measure_rain_rate_mm_hr
                                    });
                                    record_status_list.push({
                                        "name": "guage_"+guage_index+"_measure_rain_rate_mm_hr",
                                        "value": post_rain_guage_json_data.individual_guage_status[i].measure_rain_rate_mm_hr
                                    });
                                }
                                break;
                            default:
                                for(var i = 0; i<post_rain_guage_json_data.num_of_rain_guage; i++)
                                {
                                    var guage_index = post_rain_guage_json_data.individual_guage_status[i].guage_index;
                                    guage_status_list.push({
                                        "guage_index": guage_index,
                                        "measure_rain_rate_mm_hr": post_rain_guage_json_data.individual_guage_status[i].measure_rain_rate_mm_hr
                                    });
                                    record_status_list.push({
                                        "name": "guage_"+guage_index+"_measure_rain_rate_mm_hr",
                                        "value": post_rain_guage_json_data.individual_guage_status[i].measure_rain_rate_mm_hr
                                    });
                                }
                                break;
                        }
                        
                        await mqtt_app.MQTT_APP_Record_Measure_State(device_ID, record_status_list);

                        await mqtt_app.MQTT_APP_Trigger_Rule_Action("Rain Guage", device_ID, guage_status_list);
                        
                        ws_report_cmd = {
                            "command_type": "Rain Guage",
                            "command": "Report Rain Guage Current Measure",
                            "device_ID": device_ID,
                            "num_of_rain_guage": post_rain_guage_json_data.num_of_rain_guage,
                            "guage_status_list": guage_status_list
                        }
                        websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User(username, 'Environment', ws_report_cmd);
                        
                        break;
                    case "report rain guage status change":
                        var device_info_json = await rain_guage_api.Rain_Guage_Get_Device_Info(username, device_ID);
                        switch(device_info_json.guage_model)
                        {
                            case "WH0531":
                                for(var i = 0; i<post_rain_guage_json_data.num_of_rain_guage; i++)
                                {
                                    guage_status_list.push({
                                        "guage_index": post_rain_guage_json_data.individual_guage_status[i].guage_index,
                                        "measure_rain_rate_mm_hr": post_rain_guage_json_data.individual_guage_status[i].measure_rain_rate_mm_hr
                                    });
                                }
                                break;
                            default:
                                for(var i = 0; i<post_rain_guage_json_data.num_of_rain_guage; i++)
                                {
                                    guage_status_list.push({
                                        "guage_index": post_rain_guage_json_data.individual_guage_status[i].guage_index,
                                        "measure_rain_rate_mm_hr": post_rain_guage_json_data.individual_guage_status[i].measure_rain_rate_mm_hr
                                    });
                                }
                                break;
                        }
                        
                        ws_report_cmd = {
                            "command_type": "Rain Guage",
                            "command": "Report Rain Guage Status Change",
                            "device_ID": device_ID,
                            "num_of_rain_guage": post_rain_guage_json_data.num_of_rain_guage,
                            "guage_status_list": guage_status_list
                        }
                        
                        websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User(username, 'Environment', ws_report_cmd);
                        
                        break;
                }
            }
        }
        catch (e) {
            debug("[Rain_Guage_MQTT] Process_Rain_Guage_MQTT_POST_Message() Error " + e);
        }
    }

    self.Process_Rain_Guage_MQTT_GET_Message = async function (username, device_ID, get_rain_guage_json_data, callback) {
        try {
            if (get_rain_guage_json_data.command != null) {
                switch (get_rain_guage_json_data.command) {
                }
            }
        }
        catch (e) {
            debug("[Rain_Guage_MQTT] Process_Rain_Guage_MQTT_GET_Message() Error " + e);
        }
    }

}
module.exports = Rain_Guage_MQTT;
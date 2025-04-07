
var debug = require('debug')(require('path').basename(__filename));

var Road_Sign_API = require('../../../Device_MGMT/Traffic/Road_Sign_API.js');
var road_sign_api = new Road_Sign_API();

var Road_Sign_API_MQTT = require('./Road_Sign_API_MQTT.js');
var road_sign_api_mqtt = new Road_Sign_API_MQTT();

var WebSocket = require('../../../Web/WebSocket.js');
var websocket = new WebSocket();

var Traffic_APP = require('../../../Application/Traffic/Traffic_APP.js');
var traffic_app = new Traffic_APP();

var Road_Sign_MQTT = function () {
    var self = this;

    self.Process_Road_Sign_MQTT_POST_Message = async function (username, device_ID, post_road_sign_json_data) {
        try {
            if (post_road_sign_json_data.command != null) {
                var ws_report_cmd = {};

                switch (post_road_sign_json_data.command) {
                    case "report road sign status change":
                        ws_report_cmd = {
                            "command_type": "Road Sign",
                            "command": "Report Road Sign Status Change",
                            "device_ID": device_ID,
                            "road_sign_max_speed_limit_percentage": post_road_sign_json_data.road_sign_max_speed_limit_percentage,
                            "current_road_sign_alerting_state": post_road_sign_json_data.current_road_sign_alerting_state
                        }
                        
                        var road_sign_status = {
                            "road_sign_max_speed_limit_percentage": post_road_sign_json_data.road_sign_max_speed_limit_percentage,
                            "current_road_sign_alerting_state": post_road_sign_json_data.current_road_sign_alerting_state
                        }

                        websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User(username, 'Traffic', ws_report_cmd);
                        
                        traffic_app.Traffic_APP_Handle_Device_State_Change(username, "Road Sign", device_ID, road_sign_status);
                        
                        break;
                }
            }
        }
        catch (e) {
            debug("[Road_Sign_MQTT] Process_Road_Sign_MQTT_POST_Message() Error " + e);
        }
    }

    self.Process_Road_Sign_MQTT_GET_Message = async function (username, device_ID, get_road_sign_json_data, callback) {
        try {
            if (get_road_sign_json_data.command != null) {
                switch (get_road_sign_json_data.command) {
                }
            }
        }
        catch (e) {
            debug("[Road_Sign_MQTT] Process_Road_Sign_MQTT_GET_Message() Error " + e);
        }
    }

}
module.exports = Road_Sign_MQTT;
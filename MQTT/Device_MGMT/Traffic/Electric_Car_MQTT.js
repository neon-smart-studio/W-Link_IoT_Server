
var debug = require('debug')(require('path').basename(__filename));

var Electric_Car_API = require('../../../Device_MGMT/Traffic/Electric_Car_API.js');
var electric_car_api = new Electric_Car_API();

var Electric_Car_API_MQTT = require('./Electric_Car_API_MQTT.js');
var electric_car_api_mqtt = new Electric_Car_API_MQTT();

var WebSocket = require('../../../Web/WebSocket.js');
var websocket = new WebSocket();

var Traffic_APP = require('../../../Application/Traffic/Traffic_APP.js');
var traffic_app = new Traffic_APP();

var Electric_Car_MQTT = function () {
    var self = this;

    self.Process_Electric_Car_MQTT_POST_Message = async function (username, device_ID, post_electric_car_json_data) {
        try {
            if (post_electric_car_json_data.command != null) {
                var ws_report_cmd = {};

                switch (post_electric_car_json_data.command) {
                    case "report electric car status change":
                        ws_report_cmd = {
                            "command_type": "Electric Car",
                            "command": "Report Electric Car Status Change",
                            "device_ID": device_ID,
                            "current_speed_percentage": post_electric_car_json_data.current_speed_percentage,
                            "car_max_speed_limit_percentage": post_electric_car_json_data.car_max_speed_limit_percentage,
                            "current_traffic_light_state": post_electric_car_json_data.current_traffic_light_state
                        }

                        var electric_car_status = {
                            "current_speed_percentage": post_electric_car_json_data.current_speed_percentage,
                            "car_max_speed_limit_percentage": post_electric_car_json_data.car_max_speed_limit_percentage,
                            "current_traffic_light_state": post_electric_car_json_data.current_traffic_light_state
                        }

                        websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User(username, 'Traffic', ws_report_cmd);
                        
                        traffic_app.Traffic_APP_Handle_Device_State_Change(username, "Electric Car", device_ID, electric_car_status);
                        
                        break;
                }
            }
        }
        catch (e) {
            debug("[Electric_Car_MQTT] Process_Electric_Car_MQTT_POST_Message() Error " + e);
        }
    }

    self.Process_Electric_Car_MQTT_GET_Message = async function (username, device_ID, get_electric_car_json_data, callback) {
        try {
            if (get_electric_car_json_data.command != null) {
                switch (get_electric_car_json_data.command) {
                }
            }
        }
        catch (e) {
            debug("[Electric_Car_MQTT] Process_Electric_Car_MQTT_GET_Message() Error " + e);
        }
    }
    
}
module.exports = Electric_Car_MQTT;
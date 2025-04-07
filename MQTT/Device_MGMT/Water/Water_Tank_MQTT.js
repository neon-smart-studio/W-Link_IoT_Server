
var debug = require('debug')(require('path').basename(__filename));

var Water_Tank_API = require('../../../Device_MGMT/Water/Water_Tank_API.js');
var water_tank_api = new Water_Tank_API();

var Water_Tank_API_MQTT = require('./Water_Tank_API_MQTT.js');
var water_tank_api_mqtt = new Water_Tank_API_MQTT();

var WebSocket = require('../../../Web/WebSocket.js');
var websocket = new WebSocket();

var Water_Tank_MQTT = function () {
    var self = this;

    self.Process_Water_Tank_MQTT_POST_Message = async function (username, device_ID, post_water_tank_json_data) {
        try {
            if (post_water_tank_json_data.command != null) {
                var record_status_list = [];
                var tank_status_list = [];
                var ws_report_cmd = {};

                switch (post_water_tank_json_data.command) {
                    case "report water tank status change":
                        for(var i = 0; i<post_water_tank_json_data.num_of_water_tank; i++)
                        {
                            var tank_index = post_water_tank_json_data.individual_tank_status[i].tank_index;
                            tank_status_list.push({
                                "tank_index": tank_index,
                                "tank_water_level": post_water_tank_json_data.individual_tank_status[i].tank_water_level
                            });
                            record_status_list.push({
                                "name": "tank_"+tank_index+"_water_level",
                                "value": post_water_tank_json_data.individual_tank_status[i].tank_water_level
                            })
                        }
                        
                        await mqtt_app.MQTT_APP_Record_Measure_State(device_ID, record_status_list);

                        await mqtt_app.MQTT_APP_Trigger_Rule_Action("Water Tank", device_ID, tank_status_list);
                        
                        ws_report_cmd = {
                            "command_type": "Water Tank",
                            "command": "Report Water Tank Status Change",
                            "device_ID": device_ID,
                            "num_of_water_tank": post_water_tank_json_data.num_of_water_tank,
                            "tank_status_list": tank_status_list
                        }
                        websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User(username, 'Water', ws_report_cmd);
                        
                        break;
                }
            }
        }
        catch (e) {
            debug("[Water_Tank_MQTT] Process_Water_Tank_MQTT_POST_Message() Error " + e);
        };
    }

    self.Process_Water_Tank_MQTT_GET_Message = async function (username, device_ID, get_Water_Tank_json_data, rsp_callback) {
        try {
            if (get_Water_Tank_json_data.command != null) {
                switch (get_Water_Tank_json_data.command) {
                }
            }
        }
        catch (e) {
            debug("[Water_Tank_MQTT] Process_Water_Tank_MQTT_GET_Message() Error " + e);
        };
    }
}
module.exports = Water_Tank_MQTT;
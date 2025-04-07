
var debug = require('debug')(require('path').basename(__filename));

var Power_Meter_API_MQTT = require('./Power_Meter_API_MQTT.js');
var power_meter_api_mqtt = new Power_Meter_API_MQTT();

var WebSocket = require('../../../Web/WebSocket.js');
var websocket = new WebSocket();

var MQTT_APP = require('../../MQTT_APP.js');
var mqtt_app = new MQTT_APP();

var Power_Meter_MQTT = function () {
    var self = this;

    self.Process_Power_Meter_MQTT_POST_Message = async function (username, device_ID, post_power_meter_json_data) {
        try {
            if (post_power_meter_json_data.command != null) {
                var record_status_list = [];
                var analyze_attribute_list = [];
                var meter_status_list = [];
                var ws_report_cmd = {};

                switch (post_power_meter_json_data.command) {
                    case "report power meter current measure":

                        for(var i = 0; i<post_power_meter_json_data.num_of_power_meter; i++)
                        {
                            var meter_index = post_power_meter_json_data.individual_meter_status[i].meter_index;
                            meter_status_list.push({
                                "meter_index": meter_index,
                                "on_off": post_power_meter_json_data.individual_meter_status[i].on_off,
                                "measure_voltage": post_power_meter_json_data.individual_meter_status[i].measure_voltage,
                                "measure_amperage": post_power_meter_json_data.individual_meter_status[i].measure_amperage,
                                "measure_frequency": post_power_meter_json_data.individual_meter_status[i].measure_frequency,
                                "measure_power_factor": post_power_meter_json_data.individual_meter_status[i].measure_power_factor,
                                "measure_active_power": post_power_meter_json_data.individual_meter_status[i].measure_active_power,
                                "measure_apparent_power": post_power_meter_json_data.individual_meter_status[i].measure_apparent_power,
                                "measure_main_energy": post_power_meter_json_data.individual_meter_status[i].measure_main_energy,
                                "measure_negative_energy": post_power_meter_json_data.individual_meter_status[i].measure_negative_energy
                            });

                            var support_attr_list = [];
                            if(post_power_meter_json_data.individual_meter_status[i].on_off!=null)
                            {
                                support_attr_list.push("on_off");
                            }
                            if(post_power_meter_json_data.individual_meter_status[i].measure_voltage!=null)
                            {
                                support_attr_list.push("measure_voltage");
                            }
                            if(post_power_meter_json_data.individual_meter_status[i].measure_amperage!=null)
                            {
                                support_attr_list.push("measure_amperage");
                            }
                            if(post_power_meter_json_data.individual_meter_status[i].measure_frequency!=null)
                            {
                                support_attr_list.push("measure_frequency");
                            }
                            if(post_power_meter_json_data.individual_meter_status[i].measure_power_factor!=null)
                            {
                                support_attr_list.push("measure_power_factor");
                            }
                            if(post_power_meter_json_data.individual_meter_status[i].measure_active_power!=null)
                            {
                                support_attr_list.push("measure_active_power");
                            }
                            if(post_power_meter_json_data.individual_meter_status[i].measure_apparent_power!=null)
                            {
                                support_attr_list.push("measure_apparent_power");
                            }
                            if(post_power_meter_json_data.individual_meter_status[i].measure_main_energy!=null)
                            {
                                support_attr_list.push("measure_main_energy");
                            }
                            if(post_power_meter_json_data.individual_meter_status[i].measure_negative_energy!=null)
                            {
                                support_attr_list.push("measure_negative_energy");
                            }

                            for(var j = 0; j<support_attr_list.length; j++)
                            {
                                var key_name = support_attr_list[j];
                                var attr_name = "meter_"+meter_index+"_"+key_name;
                                record_status_list.push({
                                    "name": attr_name,
                                    "value": post_power_meter_json_data.individual_meter_status[i][key_name]
                                });
                                analyze_attribute_list.push(attr_name);
                            }
                        }
                        
                        await mqtt_app.MQTT_APP_Record_Measure_State(device_ID, record_status_list);

                        await mqtt_app.MQTT_APP_Trigger_Rule_Action("Power Meter", device_ID, meter_status_list);
                        
                        ws_report_cmd = {
                            "command_type": "Power Meter",
                            "command": "Report Power Meter Current Measure",
                            "device_ID": device_ID,
                            "num_of_power_meter": post_power_meter_json_data.num_of_power_meter,
                            "meter_status_list": meter_status_list
                        }
                        websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User(username, 'Electrical', ws_report_cmd);
                        
                        break;
                case "report power meter status change":

                    for(var i = 0; i<post_power_meter_json_data.num_of_power_meter; i++)
                    {
                        meter_status_list.push({
                            "meter_index": post_power_meter_json_data.individual_meter_status[i].meter_index,
                            "on_off": post_power_meter_json_data.individual_meter_status[i].on_off
                        });
                    }
                    
                    power_meter_api_mqtt.Power_Meter_Record_Current_OnOff_State(device_ID, {
                        "num_of_power_meter": post_power_meter_json_data.num_of_power_meter,
                        "individual_meter_status": meter_status_list
                    });

                    ws_report_cmd = {
                        "command_type": "Power Meter",
                        "command": "Report Power Meter Status Change",
                        "device_ID": device_ID,
                        "num_of_power_meter": post_power_meter_json_data.num_of_power_meter,
                        "meter_status_list": meter_status_list
                    }
                    websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User(username, 'Electrical', ws_report_cmd);
                    
                    break;
                }
            }
        }
        catch (e) {
            debug("[Power_Meter_MQTT] Process_Power_Meter_MQTT_POST_Message() Error " + e);
        }
    }

    self.Process_Power_Meter_MQTT_GET_Message = async function (username, device_ID, get_power_meter_json_data, rsp_callback) {
        try {
            if (get_power_meter_json_data.command != null) {
                switch (get_power_meter_json_data.command) {
                }
            }
        }
        catch (e) {
            debug("[Power_Meter_MQTT] Process_Power_Meter_MQTT_GET_Message() Error " + e);
        }
    }
}
module.exports = Power_Meter_MQTT;
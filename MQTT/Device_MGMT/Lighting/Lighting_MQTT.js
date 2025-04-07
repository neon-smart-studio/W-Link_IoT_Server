
var debug = require('debug')(require('path').basename(__filename));

var MQTT = require('../../MQTT.js');
var mqtt = new MQTT();

var Light_Sensor_MQTT = require('./Light_Sensor_MQTT.js');
var light_sensor_mqtt = new Light_Sensor_MQTT();

var WebSocket = require('../../../Web/WebSocket.js');
var websocket = new WebSocket();

function Process_Lighting_MQTT_POST_On_Off_Message(username, device_ID, post_on_off_json_data) {
    try {
        if (post_on_off_json_data.command != null) {
            var ws_report_cmd = {};
            var ws_report_dat = {};

            switch (post_on_off_json_data.command) {
                case "report light on off status change":
                    ws_report_dat = {
                        "on_off": post_on_off_json_data.on_off
                    }
                    ws_report_cmd = {
                        "command_type": "On Off",
                        "command": "Report Light On Off Status Change",
                        "device_ID": device_ID,
                        "light_status": ws_report_dat
                    }
                    websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User(username, 'Lighting', ws_report_cmd);
                    
                    break;
            }
        }
    }
    catch (e) {
        debug("[Lighting_MQTT] Process_Lighting_MQTT_POST_On_Off_Message() Error " + e);
    }
}

function Process_Lighting_MQTT_POST_Level_Message(username, device_ID, post_lvl_json_data) {
    try {
        if (post_lvl_json_data.command != null) {
            var ws_report_cmd = {};
            var ws_report_dat = {};

            switch (post_lvl_json_data.command) {
                case "report light level status change":
                ws_report_dat = {
                    "level": post_lvl_json_data.level
                }
                ws_report_cmd = {
                    "command_type": "Level",
                    "command": "Report Light Level Status Change",
                    "device_ID": device_ID,
                    "light_status": ws_report_dat
                }
                websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User(username, 'Lighting', ws_report_cmd);
                
                break;
            }
        }
    }
    catch (e) {
        debug("[Lighting_MQTT] Process_Lighting_MQTT_POST_Level_Message() Error " + e);
    }
}

function Process_Lighting_MQTT_POST_Colored_Message(username, device_ID, post_colored_json_data) {
    try {
        if (post_colored_json_data.command != null) {
            var ws_report_cmd = {};
            var ws_report_dat = {};

            switch (post_colored_json_data.command) {
                case "report light colored status change":
                    ws_report_dat = {
                        "hue": post_colored_json_data.hue,
                        "saturation": post_colored_json_data.saturation,
                        "enhanced_hue": post_colored_json_data.enhanced_hue,
                        "color_x": post_colored_json_data.color_x,
                        "color_y": post_colored_json_data.color_y
                    }
                    ws_report_cmd = {
                        "command_type": "Colored",
                        "command": "Report Light Colored Status Change",
                        "device_ID": device_ID,
                        "light_status": ws_report_dat
                    }
                    websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User(username, 'Lighting', ws_report_cmd);
                   
                    break;
            }
        }
    }
    catch (e) {
        debug("[Lighting_MQTT] Process_Lighting_MQTT_POST_Colored_Message() Error " + e);
    }
}

function Process_Lighting_MQTT_POST_Color_Temperature_Message(username, device_ID, post_color_temp_json_data) {
    try {
        if (post_color_temp_json_data.command != null) {
            var ws_report_cmd = {};
            var ws_report_dat = {};

            switch (post_color_temp_json_data.command) {
                case "report light color temperature status change":
                    ws_report_dat = {
                        "color_temperature": post_color_temp_json_data.color_temperature
                    }
                    ws_report_cmd = {
                        "command_type": "Color Temperature",
                        "command": "Report Light Color Temperature Status Change",
                        "device_ID": device_ID,
                        "light_status": ws_report_dat
                    }
                    websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User(username, 'Lighting', ws_report_cmd);
                    
                    break;
            }
        }
    }
    catch (e) {
        debug("[Lighting_MQTT] Process_Lighting_MQTT_POST_Color_Temperature_Message() Error " + e);
    }
}

function Process_Lighting_MQTT_GET_On_Off_Message(username, device_ID, get_on_off_json_data, callback) {
    try {
        if (get_on_off_json_data.command != null) {
            switch (get_on_off_json_data.command) {
            }
        }
        else {
            debug("Invalid Command");
        }
    }
    catch (e) {
        debug("[Lighting_MQTT] Process_Lighting_MQTT_GET_On_Off_Message() Error " + e);
    }
}

function Process_Lighting_MQTT_GET_Level_Message(username, device_ID, get_level_json_data, callback) {
    try {
        if (get_level_json_data.command != null) {
            switch (get_level_json_data.command) {
            }
        }
        else {
            debug("Invalid Command");
        }
    }
    catch (e) {
        debug("[Lighting_MQTT] Process_Lighting_MQTT_GET_Level_Message() Error " + e);
    }
}

function Process_Lighting_MQTT_GET_Colored_Message(username, device_ID, get_colored_json_data, callback) {
    try {
        if (get_colored_json_data.command != null) {
            switch (get_colored_json_data.command) {
            }
        }
        else {
            debug("Invalid Command");
        }
    }
    catch (e) {
        debug("[Lighting_MQTT] Process_Lighting_MQTT_GET_Colored_Message() Error " + e);
    }
}

function Process_Lighting_MQTT_GET_Color_Temperature_Message(username, device_ID, get_color_temp_json_data, callback) {
    try {
        if (get_color_temp_json_data.command != null) {
            switch (get_color_temp_json_data.command) {
            }
        }
        else {
            debug("Invalid Command");
        }
    }
    catch (e) {
        debug("[Lighting_MQTT] Process_Lighting_MQTT_GET_Color_Temperature_Message() Error " + e);
    }
}

async function Process_Lighting_Topic_MQTT_POST_Message(username, device_ID, post_json_data) {
    try {
        if (post_json_data.command_type != null) {
            switch (post_json_data.command_type) {
                case "Light Sensor":
                    await Lighting_MQTT.Process_Lighting_MQTT_POST_Message(username, device_ID, post_json_data);
                    break;
                case "On Off":
                    Process_Lighting_MQTT_POST_On_Off_Message(username, device_ID, post_json_data);
                    break;
                case "Level":
                    Process_Lighting_MQTT_POST_Level_Message(username, device_ID, post_json_data);
                    break;
                case "Colored":
                    Process_Lighting_MQTT_POST_Colored_Message(username, device_ID, post_json_data);
                    break;
                case "Color Temperature":
                    Process_Lighting_MQTT_POST_Color_Temperature_Message(username, device_ID, post_json_data);
                    break;
            }
        }
    }
    catch (e) {
        debug("[Lighting_MQTT] Process_Lighting_Topic_MQTT_POST_Message() Error " + e);
    }
}

async function Process_Lighting_Topic_MQTT_GET_Message(username, device_ID, get_json_data, callback) {
    try {
        if (get_json_data.command_type != null) {
            switch (get_json_data.command_type) {
                case "Light Sensor":
                    await Lighting_MQTT.Process_Lighting_MQTT_GET_Message(username, device_ID, get_json_data, callback);
                    break;
                case "On Off":
                    Process_Lighting_MQTT_GET_On_Off_Message(username, device_ID, get_json_data, callback);
                    break;
                case "Level":
                    Process_Lighting_MQTT_GET_Level_Message(username, device_ID, get_json_data, callback);
                    break;
                case "Colored":
                    Process_Lighting_MQTT_GET_Colored_Message(username, device_ID, get_json_data, callback);
                    break;
                case "Color Temperature":
                    Process_Lighting_MQTT_GET_Color_Temperature_Message(username, device_ID, get_json_data, callback);
                    break;
            }
        }
    }
    catch (e) {
        debug("[Lighting_MQTT] Process_Lighting_Topic_MQTT_GET_Message() Error " + e);
    }
}

var Lighting_MQTT = function () {
    var self = this;
    self.Lighting_MQTT_Init = function () {
        try {
            mqtt.Register_MQTT_Data_Channel_ID_And_Callbacks('Lighting', Process_Lighting_Topic_MQTT_POST_Message, Process_Lighting_Topic_MQTT_GET_Message);
            mqtt.Register_MQTT_Data_Channel_ID_And_Callbacks('Light_Sensor', light_sensor_mqtt.Process_Light_Sensor_MQTT_POST_Message, light_sensor_mqtt.Process_Light_Sensor_MQTT_GET_Message);
        }
        catch (e) {
            debug("[Lighting_MQTT] Lighting_MQTT_Init() Error " + e);
        }
    };
}
module.exports = Lighting_MQTT;
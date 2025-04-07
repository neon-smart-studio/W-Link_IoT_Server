
var debug = require('debug')(require('path').basename(__filename));

var util = require("util");

var MQTT = require('../../MQTT.js');
var mqtt = new MQTT();

var Device_MGR = require('../../../Util/Device_MGR.js');
var device_mgr = new Device_MGR();

const Lighting_Device_Type = "Lighting";

const ZB_CCT_Max = 6500;
const ZB_CCT_Min = 2000;
const ZB_CCT_2000_Mapped_Mired_Val = 500;
const ZB_CCT_6500_Mapped_Mired_Val = 156;
const ZB_Mired_CCT_Val_Step = (ZB_CCT_Max-ZB_CCT_Min)/(ZB_CCT_2000_Mapped_Mired_Val-ZB_CCT_6500_Mapped_Mired_Val);
const BLE_CCT_Max = 6500;
const BLE_CCT_Min = 1700;
const BLE_CCT_1700_Mapped_Mired_Val = 500;
const BLE_CCT_6500_Mapped_Mired_Val = 140;
const BLE_Mired_CCT_Val_Step = (BLE_CCT_Max-BLE_CCT_Min)/(BLE_CCT_1700_Mapped_Mired_Val-BLE_CCT_6500_Mapped_Mired_Val);

function Light_Identify_Command(device_ID, id_cmd) {
    var cmd = id_cmd;
    cmd.command_type = "Identify";
    mqtt.MQTT_POST_Request("Lighting", device_ID, cmd);
}

function Light_On_Off_Command(device_ID, on_off_tog_cmd) {
    var cmd = on_off_tog_cmd;
    cmd.command_type = "On Off";
    mqtt.MQTT_POST_Request("Lighting", device_ID, cmd);
}

function Light_Level_Command(device_ID, level_cmd) {
    var cmd = level_cmd;
    cmd.command_type = "Level";
    mqtt.MQTT_POST_Request("Lighting", device_ID, cmd);
}

function Light_Colored_Command(device_ID, color_cmd) {
    var cmd = color_cmd;
    cmd.command_type = "Colored";
    mqtt.MQTT_POST_Request("Lighting", device_ID, cmd);
}

function Light_Color_Temperature_Command(device_ID, color_cmd) {
    var cmd = color_cmd;
    cmd.command_type = "Color Temperature";
    mqtt.MQTT_POST_Request("Lighting", device_ID, cmd);
}

var Lighting_API_MQTT = function () {
    var self = this;

    self.MQTT_Light_Identify_Normal = async function (device_ID, duration) {
        try {
            var cmd = {
                command: "Identify Normal",
                duration: Number(duration)
            };
            Light_Identify_Command(device_ID, cmd);
        }
        catch (e) {
            debug("[Lighting_API_MQTT] MQTT_Light_Identify_Normal() Error " + e);
        }
    };

    self.MQTT_Light_Identify_With_Effect = async function (device_ID, effect) {
        try {
            var cmd = {};
            switch (effect) {
                case "Blink":
                case "Breathe":
                case "OK":
                case "Channel Change":
                case "Finish":
                case "Stop":
                    cmd.command = "Identify " + effect;
                    Light_Identify_Command(device_ID, cmd);
                    break;
                default:
                    break;
            }
        }
        catch (e) {
            debug("[Lighting_API_MQTT] MQTT_Light_Identify_With_Effect() Error " + e);
        }
    };

    self.MQTT_Light_Turn_On_Off = async function (device_ID, on_off) {
        try {
            var cmd = {};
            if(on_off==true)
            {
                cmd = {
                    command: "Turn On"
                }
            }
            else
            {
                cmd = {
                    command: "Turn Off"
                }
            }

            Light_On_Off_Command(device_ID, cmd);
        }
        catch (e) {
            debug("[Lighting_API_MQTT] MQTT_Light_Turn_On_Off() Error " + e);
        }
    };

    self.MQTT_Light_Toggle_OnOff = async function (device_ID) {
        try {
            var cmd = {
                command: "Toggle"
            };
            Light_On_Off_Command(device_ID, cmd);
        }
        catch (e) {
            debug("[Lighting_API_MQTT] MQTT_Light_Toggle_OnOff() Error " + e);
        }
    };

    self.MQTT_Light_Turn_On_With_Timed_Off = async function (device_ID, keep_on_time) {
        try {
            var cmd = {
                command: "Turn On With Timed Off",
                keep_on_time: keep_on_time
            };
            Light_On_Off_Command(device_ID, cmd);
        }
        catch (e) {
            debug("[Lighting_API_MQTT] MQTT_Light_Toggle_OnOff() Error " + e);
        }
    };

    self.MQTT_Light_Move_To_Level = async function (device_ID, level, trans_time, with_on_off) {
        try {
            if(level< 0 || level>100){
                return;
            }

            var level_256 = Math.round(level/100*255);

            var cmd = {
                command: "Move To Level",
                target_level: Number(level_256),
                trans_time: Number(trans_time)
            };
            if (with_on_off == 1) {
                cmd.with_on_off = true;
            }
            else {
                cmd.with_on_off = false;
            }
            Light_Level_Command(device_ID, cmd);
        }
        catch (e) {
            debug("[Lighting_API_MQTT] MQTT_Light_Move_To_Level() Error " + e);
        }
    };

    self.MQTT_Light_Move_Level_Up_Down = async function (device_ID, move_rate, direction, with_on_off) {
        try {
            if(move_rate< 0 || move_rate>100){
                return;
            }

            var mov_level_256 = Math.round(move_rate/100*255);

            var cmd = {};
            switch (direction) {
                case "Up":
                case "Down":
                    cmd.command = "Move Level";
                    cmd.direction = direction;
                    cmd.rate = Number(mov_level_256);
                    if (with_on_off == 1) {
                        cmd.with_on_off = true;
                    }
                    else {
                        cmd.with_on_off = false;
                    }
                    Light_Level_Command(device_ID, cmd);
                    break;
                default:
                    break;
            }
        }
        catch (e) {
            debug("[Lighting_API_MQTT] MQTT_Light_Move_Level_Up_Down() Error " + e);
        }
    };

    self.MQTT_Light_Step_Level_Up_Down = async function (device_ID, step_level, direction, trans_time, with_on_off) {
        try {
            if(step_level< 0 || step_level>100){
                return;
            }

            var step_level_256 = Math.round(step_level/100*255);

            var cmd = {};
            switch (direction) {
                case "Up":
                case "Down":
                    cmd.command = "Step Level";
                    cmd.direction = direction;
                    cmd.step_level = Number(step_level_256);
                    cmd.trans_time = Number(trans_time);
                    if (with_on_off == 1) {
                        cmd.with_on_off = true;
                    }
                    else {
                        cmd.with_on_off = false;
                    }
                    Light_Level_Command(device_ID, cmd);
                    break;
                default:
                    break;
            }
        }
        catch (e) {
            debug("[Lighting_API_MQTT] MQTT_Light_Step_Level_Up_Down() Error " + e);
        }
    };

    self.MQTT_Light_Stop_Level_Command = async function (device_ID) {
        try {
            var cmd = {
                command: "Stop Command"
            };
            Light_Level_Command(device_ID, cmd);
        }
        catch (e) {
            debug("[Lighting_API_MQTT] MQTT_Light_Stop_Level_Command() Error " + e);
        }
    };

    self.MQTT_Light_Move_To_Hue = async function (device_ID, hue, trans_time) {
        try {
            if(hue< 0 || hue>360){
                return;
            }

            var hue_256 = Math.round(hue/360*255);

            var cmd = {
                command: "Move To Hue",
                target_hue: Number(hue_256),
                trans_time: Number(trans_time)
            };
            Light_Colored_Command(device_ID, cmd);
        }
        catch (e) {
            debug("[Lighting_API_MQTT] MQTT_Light_Move_To_Hue() Error " + e);
        }
    };

    self.MQTT_Light_Move_To_Enhanced_Hue = async function (device_ID, hue, trans_time) {
        try {
            if(hue< 0 || hue>360){
                return;
            }

            var enhanced_hue_65536 = Math.round(hue/360*65535);

            var cmd = {
                command: "Move To Enhanced Hue",
                target_enhanced_hue: Number(enhanced_hue_65536),
                trans_time: Number(trans_time)
            };
            Light_Colored_Command(device_ID, cmd);
        }
        catch (e) {
            debug("[Lighting_API_MQTT] MQTT_Light_Move_To_Enhanced_Hue() Error " + e);
        }
    };

    self.MQTT_Light_Move_To_Saturation = async function (device_ID, saturation, trans_time) {
        try {
            if(saturation< 0 || saturation>100){
                return;
            }

            var sat_255 = Math.round(saturation/100*255);

            var cmd = {
                command: "Move To Saturation",
                target_sat: Number(sat_255),
                trans_time: Number(trans_time)
            };
            Light_Colored_Command(device_ID, cmd);
        }
        catch (e) {
            debug("[Lighting_API_MQTT] MQTT_Light_Move_To_Saturation() Error " + e);
        }
    };

    self.MQTT_Light_Move_To_Hue_And_Saturation = async function (device_ID, hue, saturation, trans_time) {
        try {
            if(hue< 0 || hue>360){
                return;
            }

            if(saturation< 0 || saturation>100){
                return;
            }

            var hue_255 = Math.round(hue/360*255);
            var sat_255 = Math.round(saturation/100*255);

            var cmd = {
                command: "Move To Hue and Saturation",
                target_hue: Number(hue_255),
                target_sat: Number(sat_255),
                trans_time: Number(trans_time)
            };
            Light_Colored_Command(device_ID, cmd);
        }
        catch (e) {
            debug("[Lighting_API_MQTT] MQTT_Light_Move_To_Hue_And_Saturation() Error " + e);
        }
    };

    self.MQTT_Light_Move_To_Enhanced_Hue_And_Saturation = async function (device_ID, hue, saturation, trans_time) {
        try {
            if(hue< 0 || hue>360){
                return;
            }

            if(saturation< 0 || saturation>100){
                return;
            }

            var enhanced_hue_65536 = Math.round(hue/360*65535);
            var sat_255 = Math.round(saturation/100*255);

            var cmd = {
                command: "Move To Enhanced Hue and Saturation",
                target_enhanced_hue: Number(enhanced_hue_65536),
                target_sat: Number(sat_255),
                trans_time: Number(trans_time)
            };
            Light_Colored_Command(device_ID, cmd);
        }
        catch (e) {
            debug("[Lighting_API_MQTT] MQTT_Light_Move_To_Enhanced_Hue_And_Saturation() Error " + e);
        }
    };

    self.MQTT_Light_Move_To_Color_XY = async function (device_ID, x, y, trans_time) {
        try {
            if(x< 0 || x>1){
                return;
            }

            if(y< 0 || y>1){
                return;
            }

            var color_x_65536 = Math.round(x*65535);
            var color_y_65536 = Math.round(y*65535);

            var cmd = {
                command: "Move To Color XY",
                target_X: Number(color_x_65536),
                target_Y: Number(color_y_65536),
                trans_time: Number(trans_time)
            };
            Light_Colored_Command(device_ID, cmd);
        }
        catch (e) {
            debug("[Lighting_API_MQTT] MQTT_Light_Move_To_Color_XY() Error " + e);
        }
    };

    self.MQTT_Light_Move_Hue_Up_Down = async function (device_ID, move_rate, direction) {
        try {
            if(move_rate< 0 || move_rate>360){
                return;
            }

            var mov_hue_256 = Math.round(move_rate/360*255);

            var cmd = {};
            switch (direction) {
                case "Up":
                case "Down":
                    cmd.command = "Move Hue";
                    cmd.direction = Number(direction);
                    cmd.rate = Number(mov_hue_256);
                    Light_Colored_Command(device_ID, cmd);
                    break;
                default:
                    break;
            }
        }
        catch (e) {
            debug("[Lighting_API_MQTT] MQTT_Light_Move_Hue_Up_Down() Error " + e);
        }
    };

    self.MQTT_Light_Move_Enhanced_Hue_Up_Down = async function (device_ID, move_rate, direction) {
        try {
            if(move_rate< 0 || move_rate>360){
                return;
            }

            var mov_enhanced_hue_65536 = Math.round(move_rate/360*65535);

            var cmd = {};
            switch (direction) {
                case "Up":
                case "Down":
                    cmd.command = "Move Enhanced Hue";
                    cmd.direction = Number(direction);
                    cmd.rate = Number(mov_enhanced_hue_65536);
                    Light_Colored_Command(device_ID, cmd);
                    break;
                default:
                    break;
            }
        }
        catch (e) {
            debug("[Lighting_API_MQTT] MQTT_Light_Move_Enhanced_Hue_Up_Down() Error " + e);
        }
    };

    self.MQTT_Light_Move_Saturation_Up_Down = async function (device_ID, move_rate, direction) {
        try {
            if(move_rate< 0 || move_rate>100){
                return;
            }

            var mov_sat_256 = Math.round(move_rate/100*255);

            var cmd = {};
            switch (direction) {
                case "Up":
                case "Down":
                    cmd.command = "Move Saturation";
                    cmd.direction = direction;
                    cmd.rate = Number(mov_sat_256);
                    Light_Colored_Command(device_ID, cmd);
                    break;
                default:
                    break;
            }
        }
        catch (e) {
            debug("[Lighting_API_MQTT] MQTT_Light_Move_Saturation_Up_Down() Error " + e);
        }
    };

    self.MQTT_Light_Move_Color_XY_Up_Down = async function (device_ID, move_rate_x, move_rate_y, direction) {
        try {
            if(move_rate_x< 0 || move_rate_x>1){
                return;
            }

            if(move_rate_y< 0 || move_rate_y>1){
                return;
            }

            var mov_color_x_65536 = Math.round(move_rate_x*65535);
            var mov_color_y_65536 = Math.round(move_rate_y*65535);

            var cmd = {};
            switch (direction) {
                case "Up":
                case "Down":
                    cmd.command = "Move Color XY";
                    cmd.direction = direction;
                    cmd.rate_X = Number(mov_color_x_65536);
                    cmd.rate_Y = Number(mov_color_y_65536);
                    Light_Colored_Command(device_ID, cmd);
                    break;
                default:
                    break;
            }
        }
        catch (e) {
            debug("[Lighting_API_MQTT] MQTT_Light_Move_Color_XY_Up_Down() Error " + e);
        }
    };

    self.MQTT_Light_Step_Hue_Up_Down = async function (device_ID, step_hue, direction, trans_time) {
        try {
            if(step_hue< 0 || step_hue>360){
                return;
            }

            var step_hue_256 = Math.round(step_hue/360*255);

            var cmd = {};
            switch (direction) {
                case "Up":
                case "Down":
                    cmd.command = "Step Hue";
                    cmd.direction = direction;
                    cmd.step_hue = Number(step_hue_256);
                    cmd.trans_time = Number(trans_time);
                    Light_Colored_Command(device_ID, cmd);
                    break;
                default:
                    break;
            }
        }
        catch (e) {
            debug("[Lighting_API_MQTT] MQTT_Light_Step_Hue_Up_Down() Error " + e);
        }
    };

    self.MQTT_Light_Step_Enhanced_Hue_Up_Down = async function (device_ID, step_enhanced_hue, direction, trans_time) {
        try {
            if(step_enhanced_hue< 0 || step_enhanced_hue>360){
                return;
            }

            var step_enhanced_hue_65536 = Math.round(step_enhanced_hue/360*65535);

            var cmd = {};
            switch (direction) {
                case "Up":
                case "Down":
                    cmd.command = "Step Enhanced Hue";
                    cmd.direction = direction;
                    cmd.step_enhanced_hue = Number(step_enhanced_hue_65536);
                    cmd.trans_time = Number(trans_time);
                    Light_Colored_Command(device_ID, cmd);
                    break;
                default:
                    break;
            }
        }
        catch (e) {
            debug("[Lighting_API_MQTT] MQTT_Light_Step_Enhanced_Hue_Up_Down() Error " + e);
        }
    };

    self.MQTT_Light_Step_Saturation_Up_Down = async function (device_ID, step_saturation, direction, trans_time) {
        try {
            if(step_saturation< 0 || step_saturation>100){
                return;
            }

            var step_sat_256 = Math.round(step_saturation/100*255);

            var cmd = {};
            switch (direction) {
                case "Up":
                case "Down":
                    cmd.command = "Step Saturation";
                    cmd.direction = direction;
                    cmd.step_sat = Number(step_sat_256);
                    cmd.trans_time = Number(trans_time);
                    Light_Colored_Command(device_ID, cmd);
                    break;
                default:
                    return;
            }
        }
        catch (e) {
            debug("[Lighting_API_MQTT] MQTT_Light_Step_Saturation_Up_Down() Error " + e);
        }
    };

    self.MQTT_Light_Step_Color_XY_Up_Down = async function (device_ID, step_x, step_y, direction, trans_time) {
        try {
            if(step_x< 0 || step_x>1){
                return;
            }

            if(step_y< 0 || step_y>1){
                return;
            }

            var step_color_x_65536 = Math.round(step_x*65535);
            var step_color_y_65536 = Math.round(step_y*65535);

            var cmd = {};
            switch (direction) {
                case "Up":
                case "Down":
                    cmd.command = "Step Color XY";
                    cmd.direction = direction;
                    cmd.step_x = Number(step_color_x_65536);
                    cmd.step_y = Number(step_color_y_65536);
                    cmd.trans_time = Number(trans_time);
                    Light_Colored_Command(device_ID, cmd);
                    break;
                default:
                    return;
            }
        }
        catch (e) {
            debug("[Lighting_API_MQTT] MQTT_Light_Step_Color_XY_Up_Down() Error " + e);
        }
    };

    self.MQTT_Light_Stop_Hue_Command = async function (device_ID) {
        try {
            var cmd = {
                command: "Stop Hue Command"
            };
            Light_Colored_Command(device_ID, cmd);
        }
        catch (e) {
            debug("[Lighting_API_MQTT] MQTT_Light_Stop_Hue_Command() Error " + e);
        }
    };

    self.MQTT_Light_Stop_Enhanced_Hue_Command = async function (device_ID) {
        try {
            var cmd = {
                command: "Stop Enhanced Hue Command"
            };
            Light_Colored_Command(device_ID, cmd);
        }
        catch (e) {
            debug("[Lighting_API_MQTT] MQTT_Light_Stop_Enhanced_Hue_Command() Error " + e);
        }
    };

    self.MQTT_Light_Stop_Saturation_Command = async function (device_ID) {
        try {
            var cmd = {
                command: "Stop Saturation Command"
            };
            Light_Colored_Command(device_ID, cmd);
        }
        catch (e) {
            debug("[Lighting_API_MQTT] MQTT_Light_Stop_Saturation_Command() Error " + e);
        }
    };

    self.MQTT_Light_Move_To_Color_Temperature = async function (device_ID, color_temp, trans_time) {
        try {
            var cmd = {
                command: "Move To Color Temperature",
                target_color_temperature: Number(color_temp),
                trans_time: Number(trans_time)
            };
            Light_Color_Temperature_Command(device_ID, cmd);
        }
        catch (e) {
            debug("[Lighting_API_MQTT] MQTT_Light_Move_To_Color_Temperature() Error " + e);
        }
    };

    self.MQTT_Light_Move_To_Mired_Color_Temperature = async function (device_ID, mired_color_temp, trans_time) {
        try {
            /*
            var cct_step_float = Math.round((ZB_CCT_2000_Mapped_Mired_Val-mired_color_temp)*ZB_Mired_CCT_Val_Step);
            var hue_cct_val = ZB_CCT_Min + cct_step_float;
            if(hue_cct_val>ZB_CCT_Max){hue_cct_mired_val = ZB_CCT_Max;}
            if(hue_cct_val<ZB_CCT_Min){hue_cct_mired_val = ZB_CCT_Min;}
            */
            var cct = color_converter.Transform_CCT(mired_color_temp, ZB_CCT_Min, ZB_CCT_Max, ZB_CCT_2000_Mapped_Mired_Val, ZB_CCT_6500_Mapped_Mired_Val, 'hk_to_dev');

            var cmd = {
                command: "Move To Color Temperature",
                target_color_temperature: Number(cct),
                trans_time: Number(trans_time)
            };
            Light_Color_Temperature_Command(device_ID, cmd);
        }
        catch (e) {
            debug("[Lighting_API_MQTT] MQTT_Light_Move_To_Mired_Color_Temperature() Error " + e);
        }
    };

    self.MQTT_Light_Step_Color_Temperature_Up_Down = async function (device_ID, step_color_temp, direction, trans_time) {
        try {
            var cmd = {};
            switch (direction) {
                case "Up":
                case "Down":
                    cmd.command = "Step Color Temperature";
                    cmd.direction = direction;
                    cmd.step_color_temperature = Number(step_color_temp);
                    cmd.trans_time = Number(trans_time);
                    Light_Colored_Command(device_ID, cmd);
                    break;
                default:
                    return;
            }
        }
        catch (e) {
            debug("[Lighting_API_MQTT] MQTT_Light_Step_Saturation_Up_Down() Error " + e);
        }
    };

    self.MQTT_Light_Step_Mired_Color_Temperature_Up_Down = async function (device_ID, step_mired_color_temp, direction, trans_time) {
        try {
            var cct_step_float = Math.round((step_mired_color_temp)*ZB_Mired_CCT_Val_Step);

            var cmd = {};
            switch (direction) {
                case "Up":
                case "Down":
                    cmd.command = "Step Color Temperature";
                    cmd.direction = direction;
                    cmd.step_color_temperature = Number(cct_step_float);
                    cmd.trans_time = Number(trans_time);
                    Light_Colored_Command(device_ID, cmd);
                    break;
                default:
                    return;
            }
        }
        catch (e) {
            debug("[Lighting_API_MQTT] MQTT_Light_Step_Saturation_Up_Down() Error " + e);
        }
    };

    self.Get_MQTT_Light_On_Off_Status = async function (device_ID) {
        try {
            var cmd = {
                command_type: "On Off",
                command: "Get Light On Off Status"
            };
            return (await mqtt.MQTT_GET_Request("Lighting", device_ID, cmd));
        }
        catch (e) {
            debug("[Lighting_API_MQTT] Get_MQTT_Light_On_Off_Status() Error " + e);
        }
    };

    self.Get_MQTT_Light_Current_Level = async function (device_ID) {
        try {
            var cmd = {
                command_type: "Level",
                command: "Get Light Current Level"
            };
            return (await mqtt.MQTT_GET_Request("Lighting", device_ID, cmd));
        }
        catch (e) {
            debug("[Lighting_API_MQTT] Get_MQTT_Light_Current_Level() Error " + e);
        }
    };

    self.Get_MQTT_Light_Current_Color = async function (device_ID) {
        try {
            var cmd = {
                command_type: "Colored",
                command: "Get Light Current Color"
            };
            return (await mqtt.MQTT_GET_Request("Lighting", device_ID, cmd));
        }
        catch (e) {
            debug("[Lighting_API_MQTT] Get_MQTT_Light_Current_Color() Error " + e);
        }
    };

    self.Get_MQTT_Light_Current_Color_Temperature = async function (device_ID) {
        try {
            var cmd = {
                command_type: "Color Temperature",
                command: "Get Light Current Color Temperature"
            };
            return (await mqtt.MQTT_GET_Request("Lighting", device_ID, cmd));
        }
        catch (e) {
            debug("[Lighting_API_MQTT] Get_MQTT_Light_Current_Color_Temperature() Error " + e);
        }
    };

    self.Get_MQTT_Light_All_Status = async function (device_ID) {
        try {
            var cmd = {
                command: "Get Light All Status"
            };
            return (await mqtt.MQTT_GET_Request("Lighting", device_ID, cmd));
        }
        catch (e) {
            debug("[Lighting_MQTT_API] Get_MQTT_Light_All_Status() Error " + e);
        }
    };
};

module.exports = Lighting_API_MQTT;
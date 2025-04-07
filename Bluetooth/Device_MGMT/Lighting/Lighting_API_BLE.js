
var debug = require('debug')(require('path').basename(__filename));

var util = require("util");

var BLE = require('../../BLE.js');
var ble = new BLE();

var Color_Converter = require('../../../Util/Color_Converter.js');
var color_converter = new Color_Converter();

var Xiaomi_Bedside_Lamp = require('./Xiaomi_Bedside_Lamp.js');
var ble_xiaomi_bedside_lamp = new Xiaomi_Bedside_Lamp();

const BLE_CCT_Max = 6500;
const BLE_CCT_Min = 1700;
const BLE_CCT_1700_Mapped_Mired_Val = 500;
const BLE_CCT_6500_Mapped_Mired_Val = 140;
const BLE_Mired_CCT_Val_Step = (BLE_CCT_Max-BLE_CCT_Min)/(BLE_CCT_1700_Mapped_Mired_Val-BLE_CCT_6500_Mapped_Mired_Val);

var Lighting_API_BLE = function () {
    var self = this;

    self.BLE_Light_Identify_Normal = async function (address_ID, duration) {
        try {
        }
        catch (e) {
            debug("[Lighting_API_BLE] BLE_Light_Identify_Normal() Error " + e);
        }
    };

    self.BLE_Light_Identify_With_Effect = async function (address_ID, effect) {
        try {
        }
        catch (e) {
            debug("[Lighting_API_BLE] BLE_Light_Identify_With_Effect() Error " + e);
        }
    };

    self.BLE_Light_Turn_On_Off = async function (address_ID, on_off) {
        try {
            if(on_off==true)
            {
                if(ble_xiaomi_bedside_lamp.Is_Xiaomi_Bedside_Lamp_Device(address_ID)==true)
                {
                    ble_xiaomi_bedside_lamp.Xiaomi_Lamp_Set_OnOff(address_ID, true);
                }
            }
            else
            {
                if(ble_xiaomi_bedside_lamp.Is_Xiaomi_Bedside_Lamp_Device(address_ID)==true)
                {
                    ble_xiaomi_bedside_lamp.Xiaomi_Lamp_Set_OnOff(address_ID, false);
                }
            }
        }
        catch (e) {
            debug("[Lighting_API_BLE] BLE_Light_Turn_On_Off() Error " + e);
        }
    };

    self.BLE_Light_Toggle_OnOff = async function (address_ID) {
        try {
        }
        catch (e) {
            debug("[Lighting_API_BLE] BLE_Light_Toggle_OnOff() Error " + e);
        }
    };

    self.BLE_Light_Turn_On_With_Timed_Off = async function (address_ID, keep_on_time) {
        try {
        }
        catch (e) {
            debug("[Lighting_API_BLE] BLE_Light_Turn_On_With_Timed_Off() Error " + e);
        }
    };

    self.BLE_Light_Move_To_Level = async function (address_ID, level, trans_time, with_on_off) {
        try {
            if(level< 0 || level>100){
                return;
            }

            if(ble_xiaomi_bedside_lamp.Is_Xiaomi_Bedside_Lamp_Device(address_ID)==true)
            {
                ble_xiaomi_bedside_lamp.Xiaomi_Lamp_Set_Bright(address_ID, level);
            }
        }
        catch (e) {
            debug("[Lighting_API_BLE] BLE_Light_Move_To_Level() Error " + e);
        }
    };

    self.BLE_Light_Move_Level_Up_Down = async function (address_ID, move_rate, direction, with_on_off) {
        try {
            if(move_rate< 0 || move_rate>100){
                return;
            }
        }
        catch (e) {
            debug("[Lighting_API_BLE] BLE_Light_Move_Level_Up_Down() Error " + e);
        }
    };

    self.BLE_Light_Step_Level_Up_Down = async function (address_ID, step_level, direction, trans_time, with_on_off) {
        try {
            if(step_level< 0 || step_level>100){
                return;
            }
        }
        catch (e) {
            debug("[Lighting_API_BLE] BLE_Light_Step_Level_Up_Down() Error " + e);
        }
    };

    self.BLE_Light_Stop_Level_Command = async function (address_ID) {
        try {
        }
        catch (e) {
            debug("[Lighting_API_BLE] BLE_Light_Stop_Level_Command() Error " + e);
        }
    };

    self.BLE_Light_Move_To_Hue = async function (address_ID, hue, trans_time) {
        try {
            if(hue< 0 || hue>360){
                return;
            }
            
        }
        catch (e) {
            debug("[Lighting_API_BLE] BLE_Light_Move_To_Hue() Error " + e);
        }
    };

    self.BLE_Light_Move_To_Enhanced_Hue = async function (address_ID, hue, trans_time) {
        try {
            if(hue< 0 || hue>360){
                return;
            }
        }
        catch (e) {
            debug("[Lighting_API_BLE] BLE_Light_Move_To_Enhanced_Hue() Error " + e);
        }
    };

    self.BLE_Light_Move_To_Saturation = async function (address_ID, saturation, trans_time) {
        try {
            if(saturation< 0 || saturation>100){
                return;
            }
        }
        catch (e) {
            debug("[Lighting_API_BLE] BLE_Light_Move_To_Saturation() Error " + e);
        }
    };

    self.BLE_Light_Move_To_Hue_And_Saturation = async function (address_ID, hue, saturation, trans_time) {
        try {
            if(hue< 0 || hue>360){
                return;
            }

            if(saturation< 0 || saturation>100){
                return;
            }

            if(ble_xiaomi_bedside_lamp.Is_Xiaomi_Bedside_Lamp_Device(address_ID)==true)
            {
                ble_xiaomi_bedside_lamp.Xiaomi_Lamp_Set_Hue_Sat(address_ID, hue, saturation);
            }
        }
        catch (e) {
            debug("[Lighting_API_BLE] BLE_Light_Move_To_Hue_And_Saturation() Error " + e);
        }
    };

    self.BLE_Light_Move_To_Enhanced_Hue_And_Saturation = async function (address_ID, hue, saturation, trans_time) {
        try {
            if(hue< 0 || hue>360){
                return;
            }

            if(saturation< 0 || saturation>100){
                return;
            }

            if(ble_xiaomi_bedside_lamp.Is_Xiaomi_Bedside_Lamp_Device(address_ID)==true)
            {
                ble_xiaomi_bedside_lamp.Xiaomi_Lamp_Set_Hue_Sat(address_ID, hue, saturation);
            }
        }
        catch (e) {
            debug("[Lighting_API_BLE] BLE_Light_Move_To_Enhanced_Hue_And_Saturation() Error " + e);
        }
    };

    self.BLE_Light_Move_To_Color_XY = async function (address_ID, x, y, trans_time) {
        try {
            if(x< 0 || x>1){
                return;
            }

            if(y< 0 || y>1){
                return;
            }
        }
        catch (e) {
            debug("[Lighting_API_BLE] BLE_Light_Move_To_Color_XY() Error " + e);
        }
    };

    self.BLE_Light_Move_Hue_Up_Down = async function (address_ID, move_rate, direction) {
        try {
            if(move_rate< 0 || move_rate>360){
                return;
            }
        }
        catch (e) {
            debug("[Lighting_API_BLE] BLE_Light_Move_Hue_Up_Down() Error " + e);
        }
    };

    self.BLE_Light_Move_Enhanced_Hue_Up_Down = async function (address_ID, move_rate, direction) {
        try {
            if(move_rate< 0 || move_rate>360){
                return;
            }
        }
        catch (e) {
            debug("[Lighting_API_BLE] BLE_Light_Move_Enhanced_Hue_Up_Down() Error " + e);
        }
    };

    self.BLE_Light_Move_Saturation_Up_Down = async function (address_ID, move_rate, direction) {
        try {
            if(move_rate< 0 || move_rate>100){
                return;
            }
        }
        catch (e) {
            debug("[Lighting_API_BLE] BLE_Light_Move_Saturation_Up_Down() Error " + e);
        }
    };

    self.BLE_Light_Move_Color_XY_Up_Down = async function (address_ID, move_rate_x, move_rate_y, direction) {
        try {
            if(move_rate_x< 0 || move_rate_x>1){
                return;
            }

            if(move_rate_y< 0 || move_rate_y>1){
                return;
            }
        }
        catch (e) {
            debug("[Lighting_API_BLE] BLE_Light_Move_Color_XY_Up_Down() Error " + e);
        }
    };

    self.BLE_Light_Step_Hue_Up_Down = async function (address_ID, step_hue, direction, trans_time) {
        try {
            if(step_hue< 0 || step_hue>360){
                return;
            }
        }
        catch (e) {
            debug("[Lighting_API_BLE] BLE_Light_Step_Hue_Up_Down() Error " + e);
        }
    };

    self.BLE_Light_Step_Enhanced_Hue_Up_Down = async function (address_ID, step_enhanced_hue, direction, trans_time) {
        try {
            if(step_enhanced_hue< 0 || step_enhanced_hue>360){
                return;
            }
        }
        catch (e) {
            debug("[Lighting_API_BLE] BLE_Light_Step_Enhanced_Hue_Up_Down() Error " + e);
        }
    };

    self.BLE_Light_Step_Saturation_Up_Down = async function (address_ID, step_saturation, direction, trans_time) {
        try {
            if(step_saturation< 0 || step_saturation>100){
                return;
            }
        }
        catch (e) {
            debug("[Lighting_API_BLE] BLE_Light_Step_Saturation_Up_Down() Error " + e);
        }
    };

    self.BLE_Light_Step_Color_XY_Up_Down = async function (address_ID, step_x, step_y, direction, trans_time) {
        try {
            if(step_x< 0 || step_x>1){
                return;
            }

            if(step_y< 0 || step_y>1){
                return;
            }
        }
        catch (e) {
            debug("[Lighting_API_BLE] BLE_Light_Step_Color_XY_Up_Down() Error " + e);
        }
    };

    self.BLE_Light_Stop_Hue_Command = async function (address_ID) {
        try {
        }
        catch (e) {
            debug("[Lighting_API_BLE] BLE_Light_Stop_Hue_Command() Error " + e);
        }
    };

    self.BLE_Light_Stop_Enhanced_Hue_Command = async function (address_ID) {
        try {
        }
        catch (e) {
            debug("[Lighting_API_BLE] BLE_Light_Stop_Enhanced_Hue_Command() Error " + e);
        }
    };

    self.BLE_Light_Stop_Saturation_Command = async function (address_ID) {
        try {
        }
        catch (e) {
            debug("[Lighting_API_BLE] BLE_Light_Stop_Saturation_Command() Error " + e);
        }
    };

    self.BLE_Light_Move_To_Color_Temperature = async function (address_ID, color_temp, trans_time) {
        try {
            if(ble_xiaomi_bedside_lamp.Is_Xiaomi_Bedside_Lamp_Device(address_ID)==true)
            {
                ble_xiaomi_bedside_lamp.Xiaomi_Lamp_Set_ColorTemperature(address_ID, color_temp);
            }
        }
        catch (e) {
            debug("[Lighting_API_BLE] BLE_Light_Move_To_Color_Temperature() Error " + e);
        }
    };

    self.BLE_Light_Move_To_Mired_Color_Temperature = async function (address_ID, mired_color_temp, trans_time) {
        try {
            var cct = color_converter.Transform_CCT(mired_color_temp, ZB_CCT_Min, ZB_CCT_Max, ZB_CCT_2000_Mapped_Mired_Val, ZB_CCT_6500_Mapped_Mired_Val, 'hk_to_dev');
            
            if(ble_xiaomi_bedside_lamp.Is_Xiaomi_Bedside_Lamp_Device(address_ID)==true)
            {
                ble_xiaomi_bedside_lamp.Xiaomi_Lamp_Set_ColorTemperature(address_ID, cct);
            }
        }
        catch (e) {
            debug("[Lighting_API_BLE] BLE_Light_Move_To_Mired_Color_Temperature() Error " + e);
        }
    };

    self.BLE_Light_Step_Color_Temperature_Up_Down = async function (address_ID, step_color_temp, direction, trans_time) {
        try {
        }
        catch (e) {
            debug("[Lighting_API_BLE] BLE_Light_Step_Saturation_Up_Down() Error " + e);
        }
    };

    self.BLE_Light_Step_Mired_Color_Temperature_Up_Down = async function (address_ID, step_mired_color_temp, direction, trans_time) {
        try {
            var cct_step_float = Math.round((step_mired_color_temp)*ZB_Mired_CCT_Val_Step);
        }
        catch (e) {
            debug("[Lighting_API_BLE] BLE_Light_Step_Saturation_Up_Down() Error " + e);
        }
    };

    self.Get_BLE_Light_On_Off_Status = async function (address_ID) {
        try {
        }
        catch (e) {
            debug("[Lighting_API_BLE] Get_BLE_Light_On_Off_Status() Error " + e);
        }
    };

    self.Get_BLE_Light_Current_Level = async function (address_ID) {
        try {
        }
        catch (e) {
            debug("[Lighting_API_BLE] Get_BLE_Light_Current_Level() Error " + e);
        }
    };

    self.Get_BLE_Light_Current_Color = async function (address_ID) {
        try {
        }
        catch (e) {
            debug("[Lighting_API_BLE] Get_BLE_Light_Current_Color() Error " + e);
        }
    };

    self.Get_BLE_Light_Current_Color_Temperature = async function (address_ID) {
        try {
        }
        catch (e) {
            debug("[Lighting_API_BLE] Get_BLE_Light_Current_Color_Temperature() Error " + e);
        }
    };
};

module.exports = Lighting_API_BLE;
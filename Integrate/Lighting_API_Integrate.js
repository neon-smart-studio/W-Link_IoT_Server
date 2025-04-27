
var debug = require('debug')(require('path').basename(__filename));

var Hue_Bridge_Lighting_API = require('./Hue_Bridge/Hue_Bridge_Lighting_API.js');
var hue_bridge_lighting_api = new Hue_Bridge_Lighting_API();

var LIFX_Lighting_API = require('./LIFX/LIFX_Lighting_API.js');
var lifx_lighting_api = new LIFX_Lighting_API();

var Yeelight_Lighting_API = require('./Yeelight/Yeelight_Lighting_API.js');
var yeelight_lighting_api = new Yeelight_Lighting_API();

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

var Lighting_API_Integrate = function () {
    var self = this;
    
    self.Integrate_Light_Identify_Normal = async function (target_type, target_protocol, address_ID, duration) {
        try {
            if(target_type=="Device")
            {
                if(target_protocol=="Hue API Tunnel")
                {
                    hue_bridge_lighting_api.Hue_Bridge_Light_Identify_Normal(address_ID, duration);
                }
            }
            else{
                hue_bridge_lighting_api.Hue_Bridge_Light_Identify_Normal(address_ID, duration);
            }
        }
        catch (e) {
            debug("[Lighting_API_Integrate] Light_Identify_Normal() Error " + e);
        }
    };

    self.Integrate_Light_Identify_With_Effect = async function (target_type, target_protocol, address_ID,effect) {
        try {
            if(target_type=="Device")
            {
                if(target_protocol=="Hue API Tunnel")
                {
                    hue_bridge_lighting_api.Hue_Bridge_Light_Identify_With_Effect(address_ID, effect);
                }
            }
            else{
                hue_bridge_lighting_api.Hue_Bridge_Light_Identify_With_Effect(address_ID, effect);
            }
        }
        catch (e) {
            debug("[Lighting_API_Integrate] Light_Identify_With_Effect() Error " + e);
        }
    };

    self.Integrate_Light_Turn_On_Off = async function (target_type, target_protocol, address_ID,on_off) {
        try {
            if(target_type=="Device")
            {
                if(target_protocol=="Hue API Tunnel")
                {
                    hue_bridge_lighting_api.Hue_Bridge_Light_Turn_On_Off(address_ID, on_off);
                }
                else if(target_protocol=="Yeelight API Tunnel")
                {
                    await yeelight_lighting_api.Yeelight_Light_Turn_On_Off(address_ID, on_off);
                }
                else if(target_protocol=="LIFX LAN")
                {
                    await lifx_lighting_api.Lifx_Light_Turn_On_Off(address_ID, on_off);
                }
            }
            else{
                hue_bridge_lighting_api.Hue_Bridge_Light_Turn_On_Off(address_ID, on_off);
            }
        }
        catch (e) {
            debug("[Lighting_API_Integrate] Light_Turn_On_Off() Error " + e);
        }
    };

    self.Integrate_Light_Toggle_OnOff = async function (target_type, target_protocol, address_ID) {
        try {
            if(target_type=="Device")
            {
                if(target_protocol=="Hue API Tunnel")
                {
                    hue_bridge_lighting_api.Hue_Bridge_Light_Toggle_OnOff(address_ID);
                }
                else if(target_protocol=="Yeelight API Tunnel")
                {
                    await yeelight_lighting_api.Yeelight_Light_Toggle_OnOff(address_ID);
                }
                else if(target_protocol=="LIFX LAN")
                {
                    await lifx_lighting_api.Lifx_Light_Toggle_OnOff(address_ID);
                }
            }
            else{
                hue_bridge_lighting_api.Hue_Bridge_Light_Toggle_OnOff(address_ID);
            }
        }
        catch (e) {
            debug("[Lighting_API_Integrate] Light_Toggle_OnOff() Error " + e);
        }
    };

    self.Integrate_Light_Turn_On_With_Timed_Off = async function (target_type, target_protocol, address_ID,keep_on_time) {
        try {
            if(target_type=="Device")
            {
                if(target_protocol=="Hue API Tunnel")
                {
                    hue_bridge_lighting_api.Hue_Bridge_Light_Turn_On_With_Timed_Off(address_ID, keep_on_time);
                }
            }
            else{
                hue_bridge_lighting_api.Hue_Bridge_Light_Turn_On_With_Timed_Off(address_ID, keep_on_time);
            }
        }
        catch (e) {
            debug("[Lighting_API_Integrate] Light_Turn_On_With_Timed_Off() Error " + e);
        }
    };

    self.Integrate_Light_Move_To_Level = async function (target_type, target_protocol, address_ID,level, trans_time, with_on_off) {
        try {
            if(level< 0 || level>100){
                return;
            }

            if(target_type=="Device")
            {
                if(target_protocol=="Hue API Tunnel")
                {
                    hue_bridge_lighting_api.Hue_Bridge_Light_Move_To_Level(address_ID, level, trans_time, with_on_off);
                }
                else if(target_protocol=="Yeelight API Tunnel")
                {
                    await yeelight_lighting_api.Yeelight_Light_Move_To_Level(address_ID, level, trans_time, with_on_off);
                }
                else if(target_protocol=="LIFX LAN")
                {
                    await lifx_lighting_api.Lifx_Light_Move_To_Level(address_ID, level, trans_time, with_on_off);
                }
            }
            else{
                hue_bridge_lighting_api.Hue_Bridge_Light_Move_To_Level(address_ID, level, trans_time, with_on_off);
            }
        }
        catch (e) {
            debug("[Lighting_API_Integrate] Light_Move_To_Level() Error " + e);
        }
    };

    self.Integrate_Light_Move_Level_Up_Down = async function (target_type, target_protocol, address_ID,move_rate, direction, with_on_off) {
        try {
            if(move_rate< 0 || move_rate>100){
                return;
            }

            if(target_type=="Device")
            {
                if(target_protocol=="Hue API Tunnel")
                {
                    hue_bridge_lighting_api.Hue_Bridge_Light_Move_Level_Up_Down(address_ID, move_rate, direction, with_on_off);
                }
            }
            else{
                hue_bridge_lighting_api.Hue_Bridge_Light_Move_Level_Up_Down(address_ID, move_rate, direction, with_on_off);
            }
        }
        catch (e) {
            debug("[Lighting_API_Integrate] Light_Move_Level_Up_Down() Error " + e);
        }
    };

    self.Integrate_Light_Step_Level_Up_Down = async function (target_type, target_protocol, address_ID,step_level, direction, trans_time, with_on_off) {
        try {
            if(step_level< 0 || step_level>100){
                return;
            }

            if(target_type=="Device")
            {
                if(target_protocol=="Hue API Tunnel")
                {
                    hue_bridge_lighting_api.Hue_Bridge_Light_Step_Level_Up_Down(address_ID, step_level, direction, trans_time, with_on_off);
                }
            }
            else{
                hue_bridge_lighting_api.Hue_Bridge_Light_Step_Level_Up_Down(address_ID, step_level, direction, trans_time, with_on_off);
            }
        }
        catch (e) {
            debug("[Lighting_API_Integrate] Light_Step_Level_Up_Down() Error " + e);
        }
    };

    self.Integrate_Light_Stop_Level_Command = async function (address_ID) {
        try {
            if(target_type=="Device")
            {
                if(target_protocol=="Hue API Tunnel")
                {
                    hue_bridge_lighting_api.Hue_Bridge_Light_Stop_Level_Command(address_ID);
                }
            }
            else{
                hue_bridge_lighting_api.Hue_Bridge_Light_Stop_Level_Command(address_ID);
            }
        }
        catch (e) {
            debug("[Lighting_API_Integrate] Light_Stop_Level_Command() Error " + e);
        }
    };

    self.Integrate_Light_Move_To_Hue = async function (target_type, target_protocol, address_ID,hue, trans_time) {
        try {
            if(hue< 0 || hue>360){
                return;
            }

            if(target_type=="Device")
            {
                if(target_protocol=="Hue API Tunnel")
                {
                    hue_bridge_lighting_api.Hue_Bridge_Light_Move_To_Hue(address_ID, hue, trans_time);
                }
                else if(target_protocol=="Yeelight API Tunnel")
                {
                    await yeelight_lighting_api.Yeelight_Light_Move_To_Hue(address_ID, hue, trans_time);
                }
                else if(target_protocol=="LIFX LAN")
                {
                    await lifx_lighting_api.Lifx_Light_Move_To_Hue(address_ID, hue, trans_time);
                }
            }
            else{
                hue_bridge_lighting_api.Hue_Bridge_Light_Move_To_Hue(address_ID, hue, trans_time);
            }
        }
        catch (e) {
            debug("[Lighting_API_Integrate] Light_Move_To_Hue() Error " + e);
        }
    };

    self.Integrate_Light_Move_To_Enhanced_Hue = async function (target_type, target_protocol, address_ID,hue, trans_time) {
        try {
            if(hue< 0 || hue>360){
                return;
            }

            if(target_type=="Device")
            {
                if(target_protocol=="Hue API Tunnel")
                {
                    hue_bridge_lighting_api.Hue_Bridge_Light_Move_To_Enhanced_Hue(address_ID, hue, trans_time);
                }
            }
            else{
                hue_bridge_lighting_api.Hue_Bridge_Light_Move_To_Enhanced_Hue(address_ID, hue, trans_time);
            }
        }
        catch (e) {
            debug("[Lighting_API_Integrate] Light_Move_To_Enhanced_Hue() Error " + e);
        }
    };

    self.Integrate_Light_Move_To_Saturation = async function (target_type, target_protocol, address_ID,saturation, trans_time) {
        try {
            if(saturation< 0 || saturation>100){
                return;
            }

            if(target_type=="Device")
            {
                if(target_protocol=="Hue API Tunnel")
                {
                    hue_bridge_lighting_api.Hue_Bridge_Light_Move_To_Saturation(address_ID, saturation, trans_time);
                }
                else if(target_protocol=="Yeelight API Tunnel")
                {
                    await yeelight_lighting_api.Yeelight_Light_Move_To_Saturation(address_ID, saturation, trans_time);
                }
                else if(target_protocol=="LIFX LAN")
                {
                    await lifx_lighting_api.Lifx_Light_Move_To_Saturation(address_ID, saturation, trans_time);
                }
            }
            else{
                hue_bridge_lighting_api.Hue_Bridge_Light_Move_To_Saturation(address_ID, saturation, trans_time);
            }
        }
        catch (e) {
            debug("[Lighting_API_Integrate] Light_Move_To_Saturation() Error " + e);
        }
    };

    self.Integrate_Light_Move_To_Hue_And_Saturation = async function (target_type, target_protocol, address_ID,hue, saturation, trans_time) {
        try {
            if(hue< 0 || hue>360){
                return;
            }

            if(saturation< 0 || saturation>100){
                return;
            }

            if(target_type=="Device")
            {
                if(target_protocol=="Hue API Tunnel")
                {
                    hue_bridge_lighting_api.Hue_Bridge_Light_Move_To_Hue_And_Saturation(address_ID, hue, saturation, trans_time);
                }
                else if(target_protocol=="Yeelight API Tunnel")
                {
                    await yeelight_lighting_api.Yeelight_Light_Move_To_Hue_And_Saturation(address_ID, hue, saturation, trans_time);
                }
                else if(target_protocol=="LIFX LAN")
                {
                    await lifx_lighting_api.Lifx_Light_Move_To_Hue_And_Saturation(address_ID, hue, saturation, trans_time);
                }
            }
            else{
                hue_bridge_lighting_api.Hue_Bridge_Light_Move_To_Hue_And_Saturation(address_ID, hue, saturation, trans_time);
            }
        }
        catch (e) {
            debug("[Lighting_API_Integrate] Light_Move_To_Hue_And_Saturation() Error " + e);
        }
    };

    self.Integrate_Light_Move_To_Enhanced_Hue_And_Saturation = async function (target_type, target_protocol, address_ID,hue, saturation, trans_time) {
        try {
            if(hue< 0 || hue>360){
                return;
            }

            if(saturation< 0 || saturation>100){
                return;
            }

            if(target_type=="Device")
            {
                if(target_protocol=="Hue API Tunnel")
                {
                    hue_bridge_lighting_api.Hue_Bridge_Light_Move_To_Enhanced_Hue_And_Saturation(address_ID, hue, saturation, trans_time);
                }
            }
            else{
                hue_bridge_lighting_api.Hue_Bridge_Light_Move_To_Enhanced_Hue_And_Saturation(address_ID, hue, saturation, trans_time);
            }
        }
        catch (e) {
            debug("[Lighting_API_Integrate] Light_Move_To_Enhanced_Hue_And_Saturation() Error " + e);
        }
    };

    self.Integrate_Light_Move_To_Color_XY = async function (target_type, target_protocol, address_ID,x, y, trans_time) {
        try {
            if(x< 0 || x>1){
                return;
            }

            if(y< 0 || y>1){
                return;
            }

            if(target_type=="Device")
            {
                if(target_protocol=="Hue API Tunnel")
                {
                    hue_bridge_lighting_api.Hue_Bridge_Light_Move_To_Color_XY(address_ID, x, y, trans_time);
                }
            }
            else{
                hue_bridge_lighting_api.Hue_Bridge_Light_Move_To_Color_XY(address_ID, x, y, trans_time);
            }
        }
        catch (e) {
            debug("[Lighting_API_Integrate] Light_Move_To_Color_XY() Error " + e);
        }
    };

    self.Integrate_Light_Move_Hue_Up_Down = async function (target_type, target_protocol, address_ID,move_rate, direction) {
        try {
            if(move_rate< 0 || move_rate>360){
                return;
            }

            if(target_type=="Device")
            {
                if(target_protocol=="Hue API Tunnel")
                {
                    hue_bridge_lighting_api.Hue_Bridge_Light_Move_Hue_Up_Down(address_ID, move_rate, direction);
                }
            }
            else{
                hue_bridge_lighting_api.Hue_Bridge_Light_Move_Hue_Up_Down(address_ID, move_rate, direction);
            }
        }
        catch (e) {
            debug("[Lighting_API_Integrate] Light_Move_Hue_Up_Down() Error " + e);
        }
    };

    self.Integrate_Light_Move_Enhanced_Hue_Up_Down = async function (target_type, target_protocol, address_ID,move_rate, direction) {
        try {
            if(move_rate< 0 || move_rate>360){
                return;
            }

            if(target_type=="Device")
            {
                if(target_protocol=="Hue API Tunnel")
                {
                    hue_bridge_lighting_api.Hue_Bridge_Light_Move_Enhanced_Hue_Up_Down(address_ID, move_rate, direction);
                }
            }
            else{
                hue_bridge_lighting_api.Hue_Bridge_Light_Move_Enhanced_Hue_Up_Down(address_ID, move_rate, direction);
            }
        }
        catch (e) {
            debug("[Lighting_API_Integrate] Light_Move_Enhanced_Hue_Up_Down() Error " + e);
        }
    };

    self.Integrate_Light_Move_Saturation_Up_Down = async function (target_type, target_protocol, address_ID,move_rate, direction) {
        try {
            if(move_rate< 0 || move_rate>100){
                return;
            }

            if(target_type=="Device")
            {
                if(target_protocol=="Hue API Tunnel")
                {
                    hue_bridge_lighting_api.Hue_Bridge_Light_Move_Saturation_Up_Down(address_ID, move_rate, direction);
                }
            }
            else{
                hue_bridge_lighting_api.Hue_Bridge_Light_Move_Saturation_Up_Down(address_ID, move_rate, direction);
            }
        }
        catch (e) {
            debug("[Lighting_API_Integrate] Light_Move_Saturation_Up_Down() Error " + e);
        }
    };

    self.Integrate_Light_Move_Color_XY_Up_Down = async function (target_type, target_protocol, address_ID,move_rate_x, move_rate_y, direction) {
        try {
            if(move_rate_x< 0 || move_rate_x>1){
                return;
            }

            if(move_rate_y< 0 || move_rate_y>1){
                return;
            }

            if(target_type=="Device")
            {
                if(target_protocol=="Hue API Tunnel")
                {
                    hue_bridge_lighting_api.Hue_Bridge_Light_Move_Color_XY_Up_Down(address_ID, move_rate_x, move_rate_y, direction);
                }
            }
            else{
                hue_bridge_lighting_api.Hue_Bridge_Light_Move_Color_XY_Up_Down(address_ID, move_rate_x, move_rate_y, direction);
            }
        }
        catch (e) {
            debug("[Lighting_API_Integrate] Light_Move_Color_XY_Up_Down() Error " + e);
        }
    };

    self.Integrate_Light_Step_Hue_Up_Down = async function (target_type, target_protocol, address_ID,step_hue, direction, trans_time) {
        try {
            if(step_hue< 0 || step_hue>360){
                return;
            }

            if(target_type=="Device")
            {
                if(target_protocol=="Hue API Tunnel")
                {
                    hue_bridge_lighting_api.Hue_Bridge_Light_Step_Hue_Up_Down(address_ID, step_hue, direction, trans_time);
                }
            }
            else{
                hue_bridge_lighting_api.Hue_Bridge_Light_Step_Hue_Up_Down(address_ID, step_hue, direction, trans_time);
            }
        }
        catch (e) {
            debug("[Lighting_API_Integrate] Light_Step_Hue_Up_Down() Error " + e);
        }
    };

    self.Integrate_Light_Step_Enhanced_Hue_Up_Down = async function (target_type, target_protocol, address_ID,step_enhanced_hue, direction, trans_time) {
        try {
            if(step_enhanced_hue< 0 || step_enhanced_hue>360){
                return;
            }

            if(target_type=="Device")
            {
                if(target_protocol=="Hue API Tunnel")
                {
                    hue_bridge_lighting_api.Hue_Bridge_Light_Step_Enhanced_Hue_Up_Down(address_ID, step_enhanced_hue, direction, trans_time);
                }
            }
            else{
                hue_bridge_lighting_api.Hue_Bridge_Light_Step_Enhanced_Hue_Up_Down(address_ID, step_enhanced_hue, direction, trans_time);
            }
        }
        catch (e) {
            debug("[Lighting_API_Integrate] Light_Step_Enhanced_Hue_Up_Down() Error " + e);
        }
    };

    self.Integrate_Light_Step_Saturation_Up_Down = async function (target_type, target_protocol, address_ID,step_saturation, direction, trans_time) {
        try {
            if(step_saturation< 0 || step_saturation>100){
                return;
            }

            if(target_type=="Device")
            {
                if(target_protocol=="Hue API Tunnel")
                {
                    hue_bridge_lighting_api.Hue_Bridge_Light_Step_Saturation_Up_Down(address_ID, step_saturation, direction, trans_time);
                }
            }
            else{
                hue_bridge_lighting_api.Hue_Bridge_Light_Step_Saturation_Up_Down(address_ID, step_saturation, direction, trans_time);
            }
        }
        catch (e) {
            debug("[Lighting_API_Integrate] Light_Step_Saturation_Up_Down() Error " + e);
        }
    };

    self.Integrate_Light_Step_Color_XY_Up_Down = async function (target_type, target_protocol, address_ID,step_x, step_y, direction, trans_time) {
        try {
            if(step_x< 0 || step_x>1){
                return;
            }

            if(step_y< 0 || step_y>1){
                return;
            }

            if(target_type=="Device")
            {
                if(target_protocol=="Hue API Tunnel")
                {
                    hue_bridge_lighting_api.Hue_Bridge_Light_Step_Color_XY_Up_Down(address_ID, step_x, step_y, direction, trans_time);
                }
            }
            else{
                hue_bridge_lighting_api.Hue_Bridge_Light_Step_Color_XY_Up_Down(address_ID, step_x, step_y, direction, trans_time);
            }
        }
        catch (e) {
            debug("[Lighting_API_Integrate] Light_Step_Color_XY_Up_Down() Error " + e);
        }
    };

    self.Integrate_Light_Stop_Hue_Command = async function (address_ID) {
        try {
            if(target_type=="Device")
            {
                if(target_protocol=="Hue API Tunnel")
                {
                    hue_bridge_lighting_api.Hue_Bridge_Light_Stop_Hue_Command(address_ID);
                }
            }
            else{
                hue_bridge_lighting_api.Hue_Bridge_Light_Stop_Hue_Command(address_ID);
            }
        }
        catch (e) {
            debug("[Lighting_API_Integrate] Light_Stop_Hue_Command() Error " + e);
        }
    };

    self.Integrate_Light_Stop_Enhanced_Hue_Command = async function (address_ID) {
        try {
            if(target_type=="Device")
            {
                if(target_protocol=="Hue API Tunnel")
                {
                    hue_bridge_lighting_api.Hue_Bridge_Light_Stop_Enhanced_Hue_Command(address_ID);
                }
            }
            else{
                hue_bridge_lighting_api.Hue_Bridge_Light_Stop_Enhanced_Hue_Command(address_ID);
            }
        }
        catch (e) {
            debug("[Lighting_API_Integrate] Light_Stop_Enhanced_Hue_Command() Error " + e);
        }
    };

    self.Integrate_Light_Stop_Saturation_Command = async function (address_ID) {
        try {
            if(target_type=="Device")
            {
                if(target_protocol=="Hue API Tunnel")
                {
                    hue_bridge_lighting_api.Hue_Bridge_Light_Stop_Saturation_Command(address_ID);
                }
            }
            else{
                hue_bridge_lighting_api.Hue_Bridge_Light_Stop_Saturation_Command(address_ID);
            }
        }
        catch (e) {
            debug("[Lighting_API_Integrate] Light_Stop_Saturation_Command() Error " + e);
        }
    };

    self.Integrate_Light_Move_To_Color_Temperature = async function (target_type, target_protocol, address_ID,color_temp, trans_time) {
        try {
            if(target_type=="Device")
            {
                if(target_protocol=="Hue API Tunnel")
                {
                    hue_bridge_lighting_api.Hue_Bridge_Light_Move_To_Color_Temperature(address_ID, color_temp, trans_time);
                }
                else if(target_protocol=="Yeelight API Tunnel")
                {
                    await yeelight_lighting_api.Yeelight_Light_Move_To_Color_Temperature(address_ID, color_temp, trans_time);
                }
                else if(target_protocol=="LIFX LAN")
                {
                    await lifx_lighting_api.Lifx_Light_Move_To_Color_Temperature(address_ID, color_temp, trans_time);
                }
            }
            else{
                hue_bridge_lighting_api.Hue_Bridge_Light_Move_To_Color_Temperature(address_ID, color_temp, trans_time);
            }
        }
        catch (e) {
            debug("[Lighting_API_Integrate] Light_Move_To_Color_Temperature() Error " + e);
        }
    };

    self.Integrate_Light_Move_To_Mired_Color_Temperature = async function (target_type, target_protocol, address_ID,mired_color_temp, trans_time) {
        try {
            if(target_type=="Device")
            {
                if(target_protocol=="Hue API Tunnel")
                {
                    hue_bridge_lighting_api.Hue_Bridge_Light_Move_To_Mired_Color_Temperature(address_ID, mired_color_temp, trans_time);
                }
            }
            else{
                hue_bridge_lighting_api.Hue_Bridge_Light_Move_To_Mired_Color_Temperature(address_ID, mired_color_temp, trans_time);
            }
        }
        catch (e) {
            debug("[Lighting_API_Integrate] Light_Move_To_Mired_Color_Temperature() Error " + e);
        }
    };

    self.Integrate_Light_Step_Color_Temperature_Up_Down = async function (target_type, target_protocol, address_ID,step_color_temp, direction, trans_time) {
        try {
            if(target_type=="Device")
            {
                if(target_protocol=="Hue API Tunnel")
                {
                    hue_bridge_lighting_api.Hue_Bridge_Light_Step_Color_Temperature_Up_Down(address_ID, step_color_temp, direction, trans_time);
                }
            }
            else{
                hue_bridge_lighting_api.Hue_Bridge_Light_Step_Color_Temperature_Up_Down(address_ID, step_color_temp, direction, trans_time);
            }
        }
        catch (e) {
            debug("[Lighting_API_Integrate] Light_Step_Saturation_Up_Down() Error " + e);
        }
    };

    self.Integrate_Light_Step_Mired_Color_Temperature_Up_Down = async function (target_type, target_protocol, address_ID,step_mired_color_temp, direction, trans_time) {
        try {
            if(target_type=="Device")
            {
                if(target_protocol=="Hue API Tunnel")
                {
                    hue_bridge_lighting_api.Hue_Bridge_Light_Step_Mired_Color_Temperature_Up_Down(address_ID, step_mired_color_temp, direction, trans_time);
                }
            }
            else{
                hue_bridge_lighting_api.Hue_Bridge_Light_Step_Mired_Color_Temperature_Up_Down(address_ID, step_mired_color_temp, direction, trans_time);
            }
        }
        catch (e) {
            debug("[Lighting_API_Integrate] Light_Step_Saturation_Up_Down() Error " + e);
        }
    };

    self.Get_Integrate_Light_On_Off_Status = async function (target_type, target_protocol, address_ID) {
        try {
            if(target_type!="Device")
            {
                return null;
            }

            var result = null;

            if(target_protocol=="Hue API Tunnel")
            {
                result = await hue_bridge_lighting_api.Get_Hue_Bridge_Light_On_Off_Status(address_ID);
            }
            else if(target_protocol=="Yeelight API Tunnel")
            {
                result = await yeelight_lighting_api.Get_Yeelight_Light_On_Off_Status(address_ID);
            }
            else if(target_protocol=="LIFX LAN")
            {
                result = await lifx_lighting_api.Get_Lifx_Light_On_Off_Status(address_ID);
            }
            
            if(result==null)
            {
                result = {
                    timeout: true,
                    username: 'everyone',
                    device_ID: address_ID
                };
            }
            else{
                if(result.timeout==null)
                {
                    result["timeout"] = false;
                }
                if(result.username==null)
                {
                    result["username"] = 'everyone';
                }
                if(result.device_ID==null)
                {
                    result["device_ID"] = address_ID;
                }
            }
            return result;
        }
        catch (e) {
            debug("[Lighting_API_Integrate] Get_Integrate_Light_On_Off_Status() Error " + e);
        }
    };

    self.Get_Integrate_Light_Current_Level = async function (target_type, target_protocol, address_ID) {
        try {
            if(target_type!="Device")
            {
                return null;
            }

            var result = null;

            if(target_protocol=="Hue API Tunnel")
            {
                result = await hue_bridge_lighting_api.Get_Hue_Bridge_Light_Current_Level(address_ID);
            }
            else if(target_protocol=="Yeelight API Tunnel")
            {
                result = await yeelight_lighting_api.Get_Yeelight_Light_Current_Level(address_ID);
            }
            else if(target_protocol=="LIFX LAN")
            {
                result = await lifx_lighting_api.Get_Lifx_Light_Current_Level(address_ID);
            }
            
            if(result==null)
            {
                result = {
                    timeout: true,
                    username: 'everyone',
                    device_ID: address_ID
                };
            }
            else{
                if(result.timeout==null)
                {
                    result["timeout"] = false;
                }
                if(result.username==null)
                {
                    result["username"] = 'everyone';
                }
                if(result.device_ID==null)
                {
                    result["device_ID"] = address_ID;
                }
            }
            return result;
        }
        catch (e) {
            debug("[Lighting_API_Integrate] Get_Integrate_Light_Current_Level() Error " + e);
        }
    };

    self.Get_Integrate_Light_Current_Color = async function (target_type, target_protocol, address_ID) {
        try {
            if(target_type!="Device")
            {
                return null;
            }

            var result = null;

            if(target_protocol=="Hue API Tunnel")
            {
                result = await hue_bridge_lighting_api.Get_Hue_Bridge_Light_Current_Color(address_ID);
            }
            else if(target_protocol=="Yeelight API Tunnel")
            {
                result = await yeelight_lighting_api.Get_Yeelight_Light_Current_Color(address_ID);
            }
            else if(target_protocol=="LIFX LAN")
            {
                result = await lifx_lighting_api.Get_Lifx_Light_Current_Color(address_ID);
            }
            
            if(result==null)
            {
                result = {
                    timeout: true,
                    username: 'everyone',
                    device_ID: address_ID
                };
            }
            else{
                if(result.timeout==null)
                {
                    result["timeout"] = false;
                }
                if(result.username==null)
                {
                    result["username"] = 'everyone';
                }
                if(result.device_ID==null)
                {
                    result["device_ID"] = address_ID;
                }
            }
            return result;
        }
        catch (e) {
            debug("[Lighting_API_Integrate] Get_Integrate_Light_Current_Color() Error " + e);
        }
    };

    self.Get_Integrate_Light_Current_Color_Temperature = async function (target_type, target_protocol, address_ID) {
        try {
            if(target_type!="Device")
            {
                return null;
            }

            var result = null;

            if(target_protocol=="Hue API Tunnel")
            {
                result = await hue_bridge_lighting_api.Get_Hue_Bridge_Light_Current_Color_Temperature(address_ID);
            }
            else if(target_protocol=="Yeelight API Tunnel")
            {
                result = await yeelight_lighting_api.Get_Yeelight_Light_Current_Color_Temperature(address_ID);
            }
            else if(target_protocol=="LIFX LAN")
            {
                result = await lifx_lighting_api.Get_Lifx_Light_Current_Color_Temperature(address_ID);
            }
            
            if(result==null)
            {
                result = {
                    timeout: true,
                    username: 'everyone',
                    device_ID: address_ID
                };
            }
            else{
                if(result.timeout==null)
                {
                    result["timeout"] = false;
                }
                if(result.username==null)
                {
                    result["username"] = 'everyone';
                }
                if(result.device_ID==null)
                {
                    result["device_ID"] = address_ID;
                }
            }
            return result;
        }
        catch (e) {
            debug("[Lighting_API_Integrate] Get_Integrate_Light_Current_Color_Temperature() Error " + e);
        }
    };
    self.Get_Integrate_Light_All_Status = async function (target_type, target_protocol, address_ID) {
        try {
            if(target_type!="Device")
            {
                return null;
            }

            var result = null;

            if(target_protocol=="Hue API Tunnel")
            {
                result = await hue_bridge_lighting_api.Get_Hue_Bridge_Light_All_Status(address_ID);
            }
            else if(target_protocol=="Yeelight API Tunnel")
            {
                result = await yeelight_lighting_api.Get_Yeelight_Light_All_Status(address_ID);
            }
            else if(target_protocol=="LIFX LAN")
            {
                result = await lifx_lighting_api.Get_Lifx_Light_All_Status(address_ID);
            }
            
            if(result==null)
            {
                result = {
                    timeout: true,
                    username: 'everyone',
                    device_ID: address_ID
                };
            }
            else{
                if(result.timeout==null)
                {
                    result["timeout"] = false;
                }
                if(result.username==null)
                {
                    result["username"] = 'everyone';
                }
                if(result.device_ID==null)
                {
                    result["device_ID"] = address_ID;
                }
            }
            return result;
        }
        catch (e) {
            debug("[Lighting_API_Integrate] Get_Integrate_Light_On_Off_Status() Error " + e);
        }
    };
};

module.exports = Lighting_API_Integrate;
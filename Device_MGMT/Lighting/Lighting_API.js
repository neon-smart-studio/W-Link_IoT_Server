
var debug = require('debug')(require('path').basename(__filename));

var Address_MGR = require('../../Util/Address_MGR.js');
var address_mgr = new Address_MGR();

var Lighting_API_MQTT = require('../../MQTT/Device_MGMT/Lighting/Lighting_API_MQTT.js');
var lighting_api_mqtt = new Lighting_API_MQTT();

var Lighting_API_Zigbee = require('../../Zigbee/Device_MGMT/Lighting/Lighting_API_Zigbee.js');
var lighting_api_zigbee = new Lighting_API_Zigbee();

var Lighting_API_BLE = require('../../Bluetooth/Device_MGMT/Lighting/Lighting_API_BLE.js');
var lighting_api_ble = new Lighting_API_BLE();

var Hue_Bridge_Lighting_API = require('../../Hue_Bridge/Hue_Bridge_Lighting_API.js');
var lighting_api_hue_bridge = new Hue_Bridge_Lighting_API();

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

var Lighting_API = function () {
    var self = this;
    
    self.Light_Identify_Normal = async function (address_ID, duration) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);

            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    if(address_info.target_protocol=="MQTT")
                    {
                        lighting_api_mqtt.MQTT_Light_Identify_Normal(address_ID, duration);
                    }
                    if(address_info.target_protocol=="Hue API Tunnel")
                    {
                        lighting_api_hue_bridge.Hue_Bridge_Light_Identify_Normal(address_ID, duration);
                    }
                }
                else if(address_info.target_network=="Zigbee")
                {
                    lighting_api_zigbee.Zigbee_Light_Identify_Normal(address_ID, duration);
                }
            }
            else{
                lighting_api_mqtt.MQTT_Light_Identify_Normal(address_ID, duration);
                lighting_api_hue_bridge.Hue_Bridge_Light_Identify_Normal(address_ID, duration);
                lighting_api_zigbee.Zigbee_Light_Identify_Normal(address_ID, duration);
            }
        }
        catch (e) {
            debug("[Lighting_API] Light_Identify_Normal() Error " + e);
        }
    };

    self.Light_Identify_With_Effect = async function (address_ID, effect) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);

            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    if(address_info.target_protocol=="MQTT")
                    {
                        lighting_api_mqtt.MQTT_Light_Identify_With_Effect(address_ID, effect);
                    }
                    if(address_info.target_protocol=="Hue API Tunnel")
                    {
                        lighting_api_hue_bridge.Hue_Bridge_Light_Identify_With_Effect(address_ID, effect);
                    }
                }
                else if(address_info.target_network=="Zigbee")
                {
                    lighting_api_zigbee.Zigbee_Light_Identify_With_Effect(address_ID, effect);
                }
            }
            else{
                lighting_api_mqtt.MQTT_Light_Identify_With_Effect(address_ID, effect);
                lighting_api_hue_bridge.Hue_Bridge_Light_Identify_With_Effect(address_ID, effect);
                lighting_api_zigbee.Zigbee_Light_Identify_With_Effect(address_ID, effect);
            }
        }
        catch (e) {
            debug("[Lighting_API] Light_Identify_With_Effect() Error " + e);
        }
    };

    self.Light_Turn_On_Off = async function (address_ID, on_off) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);

            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    if(address_info.target_protocol=="MQTT")
                    {
                        lighting_api_mqtt.MQTT_Light_Turn_On_Off(address_ID, on_off);
                    }
                    if(address_info.target_protocol=="Hue API Tunnel")
                    {
                        lighting_api_hue_bridge.Hue_Bridge_Light_Turn_On_Off(address_ID, on_off);
                    }
                }
                else if(address_info.target_network=="Zigbee")
                {
                    lighting_api_zigbee.Zigbee_Light_Turn_On_Off(address_ID, on_off);
                }
                else if(address_info.target_network=="Bluetooth LE")
                {
                    lighting_api_ble.BLE_Light_Turn_On_Off(address_ID, on_off);
                }
            }
            else{
                lighting_api_mqtt.MQTT_Light_Turn_On_Off(address_ID, on_off);
                lighting_api_hue_bridge.Hue_Bridge_Light_Turn_On_Off(address_ID, on_off);
                lighting_api_zigbee.Zigbee_Light_Turn_On_Off(address_ID, on_off);
                lighting_api_ble.BLE_Light_Turn_On_Off(address_ID, on_off);
            }
        }
        catch (e) {
            debug("[Lighting_API] Light_Turn_On_Off() Error " + e);
        }
    };

    self.Light_Toggle_OnOff = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);

            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    if(address_info.target_protocol=="MQTT")
                    {
                        lighting_api_mqtt.MQTT_Light_Toggle_OnOff(address_ID);
                    }
                    if(address_info.target_protocol=="Hue API Tunnel")
                    {
                        lighting_api_hue_bridge.Hue_Bridge_Light_Toggle_OnOff(address_ID);
                    }
                }
                else if(address_info.target_network=="Zigbee")
                {
                    lighting_api_zigbee.Zigbee_Light_Toggle_OnOff(address_ID);
                }
                else if(address_info.target_network=="Bluetooth LE")
                {
                    lighting_api_ble.BLE_Light_Toggle_OnOff(address_ID);
                }
            }
            else{
                lighting_api_mqtt.MQTT_Light_Toggle_OnOff(address_ID);
                lighting_api_hue_bridge.Hue_Bridge_Light_Toggle_OnOff(address_ID);
                lighting_api_zigbee.Zigbee_Light_Toggle_OnOff(address_ID);
                lighting_api_ble.BLE_Light_Toggle_OnOff(address_ID);
            }
        }
        catch (e) {
            debug("[Lighting_API] Light_Toggle_OnOff() Error " + e);
        }
    };

    self.Light_Turn_On_With_Timed_Off = async function (address_ID, keep_on_time) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);

            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    if(address_info.target_protocol=="MQTT")
                    {
                        lighting_api_mqtt.MQTT_Light_Turn_On_With_Timed_Off(address_ID, keep_on_time);
                    }
                    if(address_info.target_protocol=="Hue API Tunnel")
                    {
                        lighting_api_hue_bridge.Hue_Bridge_Light_Turn_On_With_Timed_Off(address_ID, keep_on_time);
                    }
                }
                else if(address_info.target_network=="Zigbee")
                {
                    lighting_api_zigbee.Zigbee_Light_Turn_On_With_Timed_Off(address_ID, keep_on_time);
                }
                else if(address_info.target_network=="Bluetooth LE")
                {
                    lighting_api_ble.BLE_Light_Turn_On_With_Timed_Off(address_ID, keep_on_time);
                }
            }
            else{
                lighting_api_mqtt.MQTT_Light_Turn_On_With_Timed_Off(address_ID, keep_on_time);
                lighting_api_hue_bridge.Hue_Bridge_Light_Turn_On_With_Timed_Off(address_ID, keep_on_time);
                lighting_api_zigbee.Zigbee_Light_Turn_On_With_Timed_Off(address_ID, keep_on_time);
                lighting_api_ble.BLE_Light_Turn_On_With_Timed_Off(address_ID, keep_on_time);
            }
        }
        catch (e) {
            debug("[Lighting_API] Light_Turn_On_With_Timed_Off() Error " + e);
        }
    };

    self.Light_Move_To_Level = async function (address_ID, level, trans_time, with_on_off) {
        try {
            if(level< 0 || level>100){
                return;
            }

            var address_info = await address_mgr.Read_Address_Info(address_ID);

            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    if(address_info.target_protocol=="MQTT")
                    {
                        lighting_api_mqtt.MQTT_Light_Move_To_Level(address_ID, level, trans_time, with_on_off);
                    }
                    if(address_info.target_protocol=="Hue API Tunnel")
                    {
                        lighting_api_hue_bridge.Hue_Bridge_Light_Move_To_Level(address_ID, level, trans_time, with_on_off);
                    }
                }
                else if(address_info.target_network=="Zigbee")
                {
                    lighting_api_zigbee.Zigbee_Light_Move_To_Level(address_ID, level, trans_time, with_on_off);
                }
                else if(address_info.target_network=="Bluetooth LE")
                {
                    lighting_api_ble.BLE_Light_Move_To_Level(address_ID, level, trans_time, with_on_off);
                }
            }
            else{
                lighting_api_mqtt.MQTT_Light_Move_To_Level(address_ID, level, trans_time, with_on_off);
                lighting_api_hue_bridge.Hue_Bridge_Light_Move_To_Level(address_ID, level, trans_time, with_on_off);
                lighting_api_zigbee.Zigbee_Light_Move_To_Level(address_ID, level, trans_time, with_on_off);
                lighting_api_ble.BLE_Light_Move_To_Level(address_ID, level, trans_time, with_on_off);
            }
        }
        catch (e) {
            debug("[Lighting_API] Light_Move_To_Level() Error " + e);
        }
    };

    self.Light_Move_Level_Up_Down = async function (address_ID, move_rate, direction, with_on_off) {
        try {
            if(move_rate< 0 || move_rate>100){
                return;
            }

            var address_info = await address_mgr.Read_Address_Info(address_ID);

            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    if(address_info.target_protocol=="MQTT")
                    {
                        lighting_api_mqtt.MQTT_Light_Move_Level_Up_Down(address_ID, move_rate, direction, with_on_off);
                    }
                    if(address_info.target_protocol=="Hue API Tunnel")
                    {
                        lighting_api_hue_bridge.Hue_Bridge_Light_Move_Level_Up_Down(address_ID, move_rate, direction, with_on_off);
                    }
                }
                else if(address_info.target_network=="Zigbee")
                {
                    lighting_api_zigbee.Zigbee_Light_Move_Level_Up_Down(address_ID, move_rate, direction, with_on_off);
                }
            }
            else{
                lighting_api_mqtt.MQTT_Light_Move_Level_Up_Down(address_ID, move_rate, direction, with_on_off);
                lighting_api_hue_bridge.Hue_Bridge_Light_Move_Level_Up_Down(address_ID, move_rate, direction, with_on_off);
                lighting_api_zigbee.Zigbee_Light_Move_Level_Up_Down(address_ID, move_rate, direction, with_on_off);
            }
        }
        catch (e) {
            debug("[Lighting_API] Light_Move_Level_Up_Down() Error " + e);
        }
    };

    self.Light_Step_Level_Up_Down = async function (address_ID, step_level, direction, trans_time, with_on_off) {
        try {
            if(step_level< 0 || step_level>100){
                return;
            }

            var address_info = await address_mgr.Read_Address_Info(address_ID);

            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    if(address_info.target_protocol=="MQTT")
                    {
                        lighting_api_mqtt.MQTT_Light_Step_Level_Up_Down(address_ID, step_level, direction, trans_time, with_on_off);
                    }
                    if(address_info.target_protocol=="Hue API Tunnel")
                    {
                        lighting_api_hue_bridge.Hue_Bridge_Light_Step_Level_Up_Down(address_ID, step_level, direction, trans_time, with_on_off);
                    }
                }
                else if(address_info.target_network=="Zigbee")
                {
                    lighting_api_zigbee.Zigbee_Light_Step_Level_Up_Down(address_ID, step_level, direction, trans_time, with_on_off);
                }
            }
            else{
                lighting_api_mqtt.MQTT_Light_Step_Level_Up_Down(address_ID, step_level, direction, trans_time, with_on_off);
                lighting_api_hue_bridge.Hue_Bridge_Light_Step_Level_Up_Down(address_ID, step_level, direction, trans_time, with_on_off);
                lighting_api_zigbee.Zigbee_Light_Step_Level_Up_Down(address_ID, step_level, direction, trans_time, with_on_off);
            }
        }
        catch (e) {
            debug("[Lighting_API] Light_Step_Level_Up_Down() Error " + e);
        }
    };

    self.Light_Stop_Level_Command = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);

            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    if(address_info.target_protocol=="MQTT")
                    {
                        lighting_api_mqtt.MQTT_Light_Stop_Level_Command(address_ID);
                    }
                    if(address_info.target_protocol=="Hue API Tunnel")
                    {
                        lighting_api_hue_bridge.Hue_Bridge_Light_Stop_Level_Command(address_ID);
                    }
                }
                else if(address_info.target_network=="Zigbee")
                {
                    lighting_api_zigbee.Zigbee_Light_Stop_Level_Command(address_ID);
                }
            }
            else{
                lighting_api_mqtt.MQTT_Light_Stop_Level_Command(address_ID);
                lighting_api_hue_bridge.Hue_Bridge_Light_Stop_Level_Command(address_ID);
                lighting_api_zigbee.Zigbee_Light_Stop_Level_Command(address_ID);
            }
        }
        catch (e) {
            debug("[Lighting_API] Light_Stop_Level_Command() Error " + e);
        }
    };

    self.Light_Move_To_Hue = async function (address_ID, hue, trans_time) {
        try {
            if(hue< 0 || hue>360){
                return;
            }

            var address_info = await address_mgr.Read_Address_Info(address_ID);

            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    if(address_info.target_protocol=="MQTT")
                    {
                        lighting_api_mqtt.MQTT_Light_Move_To_Hue(address_ID, hue, trans_time);
                    }
                    if(address_info.target_protocol=="Hue API Tunnel")
                    {
                        lighting_api_hue_bridge.Hue_Bridge_Light_Move_To_Hue(address_ID, hue, trans_time);
                    }
                }
                else if(address_info.target_network=="Zigbee")
                {
                    lighting_api_zigbee.Zigbee_Light_Move_To_Hue(address_ID, hue, trans_time);
                }
            }
            else{
                lighting_api_mqtt.MQTT_Light_Move_To_Hue(address_ID, hue, trans_time);
                lighting_api_hue_bridge.Hue_Bridge_Light_Move_To_Hue(address_ID, hue, trans_time);
                lighting_api_zigbee.Zigbee_Light_Move_To_Hue(address_ID, hue, trans_time);
            }
        }
        catch (e) {
            debug("[Lighting_API] Light_Move_To_Hue() Error " + e);
        }
    };

    self.Light_Move_To_Enhanced_Hue = async function (address_ID, hue, trans_time) {
        try {
            if(hue< 0 || hue>360){
                return;
            }

            var address_info = await address_mgr.Read_Address_Info(address_ID);

            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    if(address_info.target_protocol=="MQTT")
                    {
                        lighting_api_mqtt.MQTT_Light_Move_To_Enhanced_Hue(address_ID, hue, trans_time);
                    }
                    if(address_info.target_protocol=="Hue API Tunnel")
                    {
                        lighting_api_hue_bridge.Hue_Bridge_Light_Move_To_Enhanced_Hue(address_ID, hue, trans_time);
                    }
                }
                else if(address_info.target_network=="Zigbee")
                {
                    lighting_api_zigbee.Zigbee_Light_Move_To_Enhanced_Hue(address_ID, hue, trans_time);
                }
            }
            else{
                lighting_api_mqtt.MQTT_Light_Move_To_Enhanced_Hue(address_ID, hue, trans_time);
                lighting_api_hue_bridge.Hue_Bridge_Light_Move_To_Enhanced_Hue(address_ID, hue, trans_time);
                lighting_api_zigbee.Zigbee_Light_Move_To_Enhanced_Hue(address_ID, hue, trans_time);
            }
        }
        catch (e) {
            debug("[Lighting_API] Light_Move_To_Enhanced_Hue() Error " + e);
        }
    };

    self.Light_Move_To_Saturation = async function (address_ID, saturation, trans_time) {
        try {
            if(saturation< 0 || saturation>100){
                return;
            }

            var address_info = await address_mgr.Read_Address_Info(address_ID);

            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    if(address_info.target_protocol=="MQTT")
                    {
                        lighting_api_mqtt.MQTT_Light_Move_To_Saturation(address_ID, saturation, trans_time);
                    }
                    if(address_info.target_protocol=="Hue API Tunnel")
                    {
                        lighting_api_hue_bridge.Hue_Bridge_Light_Move_To_Saturation(address_ID, saturation, trans_time);
                    }
                }
                else if(address_info.target_network=="Zigbee")
                {
                    lighting_api_zigbee.Zigbee_Light_Move_To_Saturation(address_ID, saturation, trans_time);
                }
            }
            else{
                lighting_api_mqtt.MQTT_Light_Move_To_Saturation(address_ID, saturation, trans_time);
                lighting_api_hue_bridge.Hue_Bridge_Light_Move_To_Saturation(address_ID, saturation, trans_time);
                lighting_api_zigbee.Zigbee_Light_Move_To_Saturation(address_ID, saturation, trans_time);
            }
        }
        catch (e) {
            debug("[Lighting_API] Light_Move_To_Saturation() Error " + e);
        }
    };

    self.Light_Move_To_Hue_And_Saturation = async function (address_ID, hue, saturation, trans_time) {
        try {
            if(hue< 0 || hue>360){
                return;
            }

            if(saturation< 0 || saturation>100){
                return;
            }

            var address_info = await address_mgr.Read_Address_Info(address_ID);

            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    if(address_info.target_protocol=="MQTT")
                    {
                        lighting_api_mqtt.MQTT_Light_Move_To_Hue_And_Saturation(address_ID, hue, saturation, trans_time);
                    }
                    if(address_info.target_protocol=="Hue API Tunnel")
                    {
                        lighting_api_hue_bridge.Hue_Bridge_Light_Move_To_Hue_And_Saturation(address_ID, hue, saturation, trans_time);
                    }
                }
                else if(address_info.target_network=="Zigbee")
                {
                    lighting_api_zigbee.Zigbee_Light_Move_To_Hue_And_Saturation(address_ID, hue, saturation, trans_time);
                }
                else if(address_info.target_network=="Bluetooth LE")
                {
                    lighting_api_ble.BLE_Light_Move_To_Hue_And_Saturation(address_ID, hue, saturation, trans_time);
                }
            }
            else{
                lighting_api_mqtt.MQTT_Light_Move_To_Hue_And_Saturation(address_ID, hue, saturation, trans_time);
                lighting_api_hue_bridge.Hue_Bridge_Light_Move_To_Hue_And_Saturation(address_ID, hue, saturation, trans_time);
                lighting_api_zigbee.Zigbee_Light_Move_To_Hue_And_Saturation(address_ID, hue, saturation, trans_time);
                lighting_api_ble.BLE_Light_Move_To_Hue_And_Saturation(address_ID, hue, saturation, trans_time);
            }
        }
        catch (e) {
            debug("[Lighting_API] Light_Move_To_Hue_And_Saturation() Error " + e);
        }
    };

    self.Light_Move_To_Enhanced_Hue_And_Saturation = async function (address_ID, hue, saturation, trans_time) {
        try {
            if(hue< 0 || hue>360){
                return;
            }

            if(saturation< 0 || saturation>100){
                return;
            }

            var address_info = await address_mgr.Read_Address_Info(address_ID);

            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    if(address_info.target_protocol=="MQTT")
                    {
                        lighting_api_mqtt.MQTT_Light_Move_To_Enhanced_Hue_And_Saturation(address_ID, hue, saturation, trans_time);
                    }
                    if(address_info.target_protocol=="Hue API Tunnel")
                    {
                        lighting_api_hue_bridge.Hue_Bridge_Light_Move_To_Enhanced_Hue_And_Saturation(address_ID, hue, saturation, trans_time);
                    }
                }
                else if(address_info.target_network=="Zigbee")
                {
                    lighting_api_zigbee.Zigbee_Light_Move_To_Enhanced_Hue_And_Saturation(address_ID, hue, saturation, trans_time);
                }
                else if(address_info.target_network=="Bluetooth LE")
                {
                    lighting_api_ble.BLE_Light_Move_To_Enhanced_Hue_And_Saturation(address_ID, hue, saturation, trans_time);
                }
            }
            else{
                lighting_api_mqtt.MQTT_Light_Move_To_Enhanced_Hue_And_Saturation(address_ID, hue, saturation, trans_time);
                lighting_api_hue_bridge.Hue_Bridge_Light_Move_To_Enhanced_Hue_And_Saturation(address_ID, hue, saturation, trans_time);
                lighting_api_zigbee.Zigbee_Light_Move_To_Enhanced_Hue_And_Saturation(address_ID, hue, saturation, trans_time);
                lighting_api_ble.BLE_Light_Move_To_Enhanced_Hue_And_Saturation(address_ID, hue, saturation, trans_time);
            }
        }
        catch (e) {
            debug("[Lighting_API] Light_Move_To_Enhanced_Hue_And_Saturation() Error " + e);
        }
    };

    self.Light_Move_To_Color_XY = async function (address_ID, x, y, trans_time) {
        try {
            if(x< 0 || x>1){
                return;
            }

            if(y< 0 || y>1){
                return;
            }

            var address_info = await address_mgr.Read_Address_Info(address_ID);

            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    if(address_info.target_protocol=="MQTT")
                    {
                        lighting_api_mqtt.MQTT_Light_Move_To_Color_XY(address_ID, x, y, trans_time);
                    }
                    if(address_info.target_protocol=="Hue API Tunnel")
                    {
                        lighting_api_hue_bridge.Hue_Bridge_Light_Move_To_Color_XY(address_ID, x, y, trans_time);
                    }
                }
                else if(address_info.target_network=="Zigbee")
                {
                    lighting_api_zigbee.Zigbee_Light_Move_To_Color_XY(address_ID, x, y, trans_time);
                }
            }
            else{
                lighting_api_mqtt.MQTT_Light_Move_To_Color_XY(address_ID, x, y, trans_time);
                lighting_api_hue_bridge.Hue_Bridge_Light_Move_To_Color_XY(address_ID, x, y, trans_time);
                lighting_api_zigbee.Zigbee_Light_Move_To_Color_XY(address_ID, x, y, trans_time);
            }
        }
        catch (e) {
            debug("[Lighting_API] Light_Move_To_Color_XY() Error " + e);
        }
    };

    self.Light_Move_Hue_Up_Down = async function (address_ID, move_rate, direction) {
        try {
            if(move_rate< 0 || move_rate>360){
                return;
            }

            var address_info = await address_mgr.Read_Address_Info(address_ID);

            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    if(address_info.target_protocol=="MQTT")
                    {
                        lighting_api_mqtt.MQTT_Light_Move_Hue_Up_Down(address_ID, move_rate, direction);
                    }
                    if(address_info.target_protocol=="Hue API Tunnel")
                    {
                        lighting_api_hue_bridge.Hue_Bridge_Light_Move_Hue_Up_Down(address_ID, move_rate, direction);
                    }
                }
                else if(address_info.target_network=="Zigbee")
                {
                    lighting_api_zigbee.Zigbee_Light_Move_Hue_Up_Down(address_ID, move_rate, direction);
                }
            }
            else{
                lighting_api_mqtt.MQTT_Light_Move_Hue_Up_Down(address_ID, move_rate, direction);
                lighting_api_hue_bridge.Hue_Bridge_Light_Move_Hue_Up_Down(address_ID, move_rate, direction);
                lighting_api_zigbee.Zigbee_Light_Move_Hue_Up_Down(address_ID, move_rate, direction);
            }
        }
        catch (e) {
            debug("[Lighting_API] Light_Move_Hue_Up_Down() Error " + e);
        }
    };

    self.Light_Move_Enhanced_Hue_Up_Down = async function (address_ID, move_rate, direction) {
        try {
            if(move_rate< 0 || move_rate>360){
                return;
            }

            var address_info = await address_mgr.Read_Address_Info(address_ID);

            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    if(address_info.target_protocol=="MQTT")
                    {
                        lighting_api_mqtt.MQTT_Light_Move_Enhanced_Hue_Up_Down(address_ID, move_rate, direction);
                    }
                    if(address_info.target_protocol=="Hue API Tunnel")
                    {
                        lighting_api_hue_bridge.Hue_Bridge_Light_Move_Enhanced_Hue_Up_Down(address_ID, move_rate, direction);
                    }
                }
                else if(address_info.target_network=="Zigbee")
                {
                    lighting_api_zigbee.Zigbee_Light_Move_Enhanced_Hue_Up_Down(address_ID, move_rate, direction);
                }
            }
            else{
                lighting_api_mqtt.MQTT_Light_Move_Enhanced_Hue_Up_Down(address_ID, move_rate, direction);
                lighting_api_hue_bridge.Hue_Bridge_Light_Move_Enhanced_Hue_Up_Down(address_ID, move_rate, direction);
                lighting_api_zigbee.Zigbee_Light_Move_Enhanced_Hue_Up_Down(address_ID, move_rate, direction);
            }
        }
        catch (e) {
            debug("[Lighting_API] Light_Move_Enhanced_Hue_Up_Down() Error " + e);
        }
    };

    self.Light_Move_Saturation_Up_Down = async function (address_ID, move_rate, direction) {
        try {
            if(move_rate< 0 || move_rate>100){
                return;
            }

            var address_info = await address_mgr.Read_Address_Info(address_ID);

            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    if(address_info.target_protocol=="MQTT")
                    {
                        lighting_api_mqtt.MQTT_Light_Move_Saturation_Up_Down(address_ID, move_rate, direction);
                    }
                    if(address_info.target_protocol=="Hue API Tunnel")
                    {
                        lighting_api_hue_bridge.Hue_Bridge_Light_Move_Saturation_Up_Down(address_ID, move_rate, direction);
                    }
                }
                else if(address_info.target_network=="Zigbee")
                {
                    lighting_api_zigbee.Zigbee_Light_Move_Saturation_Up_Down(address_ID, move_rate, direction);
                }
            }
            else{
                lighting_api_mqtt.MQTT_Light_Move_Saturation_Up_Down(address_ID, move_rate, direction);
                lighting_api_hue_bridge.Hue_Bridge_Light_Move_Saturation_Up_Down(address_ID, move_rate, direction);
                lighting_api_zigbee.Zigbee_Light_Move_Saturation_Up_Down(address_ID, move_rate, direction);
            }
        }
        catch (e) {
            debug("[Lighting_API] Light_Move_Saturation_Up_Down() Error " + e);
        }
    };

    self.Light_Move_Color_XY_Up_Down = async function (address_ID, move_rate_x, move_rate_y, direction) {
        try {
            if(move_rate_x< 0 || move_rate_x>1){
                return;
            }

            if(move_rate_y< 0 || move_rate_y>1){
                return;
            }

            var address_info = await address_mgr.Read_Address_Info(address_ID);

            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    if(address_info.target_protocol=="MQTT")
                    {
                        lighting_api_mqtt.MQTT_Light_Move_Color_XY_Up_Down(address_ID, move_rate_x, move_rate_y, direction);
                    }
                    if(address_info.target_protocol=="Hue API Tunnel")
                    {
                        lighting_api_hue_bridge.Hue_Bridge_Light_Move_Color_XY_Up_Down(address_ID, move_rate_x, move_rate_y, direction);
                    }
                }
                else if(address_info.target_network=="Zigbee")
                {
                    lighting_api_zigbee.Zigbee_Light_Move_Color_XY_Up_Down(address_ID, move_rate_x, move_rate_y, direction);
                }
            }
            else{
                lighting_api_mqtt.MQTT_Light_Move_Color_XY_Up_Down(address_ID, move_rate_x, move_rate_y, direction);
                lighting_api_hue_bridge.Hue_Bridge_Light_Move_Color_XY_Up_Down(address_ID, move_rate_x, move_rate_y, direction);
                lighting_api_zigbee.Zigbee_Light_Move_Color_XY_Up_Down(address_ID, move_rate_x, move_rate_y, direction);
            }
        }
        catch (e) {
            debug("[Lighting_API] Light_Move_Color_XY_Up_Down() Error " + e);
        }
    };

    self.Light_Step_Hue_Up_Down = async function (address_ID, step_hue, direction, trans_time) {
        try {
            if(step_hue< 0 || step_hue>360){
                return;
            }

            var address_info = await address_mgr.Read_Address_Info(address_ID);

            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    if(address_info.target_protocol=="MQTT")
                    {
                        lighting_api_mqtt.MQTT_Light_Step_Hue_Up_Down(address_ID, step_hue, direction, trans_time);
                    }
                    if(address_info.target_protocol=="Hue API Tunnel")
                    {
                        lighting_api_hue_bridge.Hue_Bridge_Light_Step_Hue_Up_Down(address_ID, step_hue, direction, trans_time);
                    }
                }
                else if(address_info.target_network=="Zigbee")
                {
                    lighting_api_zigbee.Zigbee_Light_Step_Hue_Up_Down(address_ID, step_hue, direction, trans_time);
                }
            }
            else{
                lighting_api_mqtt.MQTT_Light_Step_Hue_Up_Down(address_ID, step_hue, direction, trans_time);
                lighting_api_hue_bridge.Hue_Bridge_Light_Step_Hue_Up_Down(address_ID, step_hue, direction, trans_time);
                lighting_api_zigbee.Zigbee_Light_Step_Hue_Up_Down(address_ID, step_hue, direction, trans_time);
            }
        }
        catch (e) {
            debug("[Lighting_API] Light_Step_Hue_Up_Down() Error " + e);
        }
    };

    self.Light_Step_Enhanced_Hue_Up_Down = async function (address_ID, step_enhanced_hue, direction, trans_time) {
        try {
            if(step_enhanced_hue< 0 || step_enhanced_hue>360){
                return;
            }

            var address_info = await address_mgr.Read_Address_Info(address_ID);

            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    if(address_info.target_protocol=="MQTT")
                    {
                        lighting_api_mqtt.MQTT_Light_Step_Enhanced_Hue_Up_Down(address_ID, step_enhanced_hue, direction, trans_time);
                    }
                    if(address_info.target_protocol=="Hue API Tunnel")
                    {
                        lighting_api_hue_bridge.Hue_Bridge_Light_Step_Enhanced_Hue_Up_Down(address_ID, step_enhanced_hue, direction, trans_time);
                    }
                }
                else if(address_info.target_network=="Zigbee")
                {
                    lighting_api_zigbee.Zigbee_Light_Step_Enhanced_Hue_Up_Down(address_ID, step_enhanced_hue, direction, trans_time);
                }
            }
            else{
                lighting_api_mqtt.MQTT_Light_Step_Enhanced_Hue_Up_Down(address_ID, step_enhanced_hue, direction, trans_time);
                lighting_api_hue_bridge.Hue_Bridge_Light_Step_Enhanced_Hue_Up_Down(address_ID, step_enhanced_hue, direction, trans_time);
                lighting_api_zigbee.Zigbee_Light_Step_Enhanced_Hue_Up_Down(address_ID, step_enhanced_hue, direction, trans_time);
            }
        }
        catch (e) {
            debug("[Lighting_API] Light_Step_Enhanced_Hue_Up_Down() Error " + e);
        }
    };

    self.Light_Step_Saturation_Up_Down = async function (address_ID, step_saturation, direction, trans_time) {
        try {
            if(step_saturation< 0 || step_saturation>100){
                return;
            }

            var address_info = await address_mgr.Read_Address_Info(address_ID);

            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    if(address_info.target_protocol=="MQTT")
                    {
                        lighting_api_mqtt.MQTT_Light_Step_Saturation_Up_Down(address_ID, step_saturation, direction, trans_time);
                    }
                    if(address_info.target_protocol=="Hue API Tunnel")
                    {
                        lighting_api_hue_bridge.Hue_Bridge_Light_Step_Saturation_Up_Down(address_ID, step_saturation, direction, trans_time);
                    }
                }
                else if(address_info.target_network=="Zigbee")
                {
                    lighting_api_zigbee.Zigbee_Light_Step_Saturation_Up_Down(address_ID, step_saturation, direction, trans_time);
                }
            }
            else{
                lighting_api_mqtt.MQTT_Light_Step_Saturation_Up_Down(address_ID, step_saturation, direction, trans_time);
                lighting_api_hue_bridge.Hue_Bridge_Light_Step_Saturation_Up_Down(address_ID, step_saturation, direction, trans_time);
                lighting_api_zigbee.Zigbee_Light_Step_Saturation_Up_Down(address_ID, step_saturation, direction, trans_time);
            }
        }
        catch (e) {
            debug("[Lighting_API] Light_Step_Saturation_Up_Down() Error " + e);
        }
    };

    self.Light_Step_Color_XY_Up_Down = async function (address_ID, step_x, step_y, direction, trans_time) {
        try {
            if(step_x< 0 || step_x>1){
                return;
            }

            if(step_y< 0 || step_y>1){
                return;
            }

            var address_info = await address_mgr.Read_Address_Info(address_ID);

            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    if(address_info.target_protocol=="MQTT")
                    {
                        lighting_api_mqtt.MQTT_Light_Step_Color_XY_Up_Down(address_ID, step_x, step_y, direction, trans_time);
                    }
                    if(address_info.target_protocol=="Hue API Tunnel")
                    {
                        lighting_api_hue_bridge.Hue_Bridge_Light_Step_Color_XY_Up_Down(address_ID, step_x, step_y, direction, trans_time);
                    }
                }
                else if(address_info.target_network=="Zigbee")
                {
                    lighting_api_zigbee.Zigbee_Light_Step_Color_XY_Up_Down(address_ID, step_x, step_y, direction, trans_time);
                }
            }
            else{
                lighting_api_mqtt.MQTT_Light_Step_Color_XY_Up_Down(address_ID, step_x, step_y, direction, trans_time);
                lighting_api_hue_bridge.Hue_Bridge_Light_Step_Color_XY_Up_Down(address_ID, step_x, step_y, direction, trans_time);
                lighting_api_zigbee.Zigbee_Light_Step_Color_XY_Up_Down(address_ID, step_x, step_y, direction, trans_time);
            }
        }
        catch (e) {
            debug("[Lighting_API] Light_Step_Color_XY_Up_Down() Error " + e);
        }
    };

    self.Light_Stop_Hue_Command = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);

            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    if(address_info.target_protocol=="MQTT")
                    {
                        lighting_api_mqtt.MQTT_Light_Stop_Hue_Command(address_ID);
                    }
                    if(address_info.target_protocol=="Hue API Tunnel")
                    {
                        lighting_api_hue_bridge.Hue_Bridge_Light_Stop_Hue_Command(address_ID);
                    }
                }
                else if(address_info.target_network=="Zigbee")
                {
                    lighting_api_zigbee.Zigbee_Light_Stop_Hue_Command(address_ID);
                }
            }
            else{
                lighting_api_mqtt.MQTT_Light_Stop_Hue_Command(address_ID);
                lighting_api_hue_bridge.Hue_Bridge_Light_Stop_Hue_Command(address_ID);
                lighting_api_zigbee.Zigbee_Light_Stop_Hue_Command(address_ID);
            }
        }
        catch (e) {
            debug("[Lighting_API] Light_Stop_Hue_Command() Error " + e);
        }
    };

    self.Light_Stop_Enhanced_Hue_Command = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);

            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    if(address_info.target_protocol=="MQTT")
                    {
                        lighting_api_mqtt.MQTT_Light_Stop_Enhanced_Hue_Command(address_ID);
                    }
                    if(address_info.target_protocol=="Hue API Tunnel")
                    {
                        lighting_api_hue_bridge.Hue_Bridge_Light_Stop_Enhanced_Hue_Command(address_ID);
                    }
                }
                else if(address_info.target_network=="Zigbee")
                {
                    lighting_api_zigbee.Zigbee_Light_Stop_Enhanced_Hue_Command(address_ID);
                }
            }
            else{
                lighting_api_mqtt.MQTT_Light_Stop_Enhanced_Hue_Command(address_ID);
                lighting_api_hue_bridge.Hue_Bridge_Light_Stop_Enhanced_Hue_Command(address_ID);
                lighting_api_zigbee.Zigbee_Light_Stop_Enhanced_Hue_Command(address_ID);
            }
        }
        catch (e) {
            debug("[Lighting_API] Light_Stop_Enhanced_Hue_Command() Error " + e);
        }
    };

    self.Light_Stop_Saturation_Command = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);

            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    if(address_info.target_protocol=="MQTT")
                    {
                        lighting_api_mqtt.MQTT_Light_Stop_Saturation_Command(address_ID);
                    }
                    if(address_info.target_protocol=="Hue API Tunnel")
                    {
                        lighting_api_hue_bridge.Hue_Bridge_Light_Stop_Saturation_Command(address_ID);
                    }
                }
                else if(address_info.target_network=="Zigbee")
                {
                    lighting_api_zigbee.Zigbee_Light_Stop_Saturation_Command(address_ID);
                }
            }
            else{
                lighting_api_mqtt.MQTT_Light_Stop_Saturation_Command(address_ID);
                lighting_api_hue_bridge.Hue_Bridge_Light_Stop_Saturation_Command(address_ID);
                lighting_api_zigbee.Zigbee_Light_Stop_Saturation_Command(address_ID);
            }
        }
        catch (e) {
            debug("[Lighting_API] Light_Stop_Saturation_Command() Error " + e);
        }
    };

    self.Light_Move_To_Color_Temperature = async function (address_ID, color_temp, trans_time) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);

            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    if(address_info.target_protocol=="MQTT")
                    {
                        lighting_api_mqtt.MQTT_Light_Move_To_Color_Temperature(address_ID, color_temp, trans_time);
                    }
                    if(address_info.target_protocol=="Hue API Tunnel")
                    {
                        lighting_api_hue_bridge.Hue_Bridge_Light_Move_To_Color_Temperature(address_ID, color_temp, trans_time);
                    }
                }
                else if(address_info.target_network=="Zigbee")
                {
                    lighting_api_zigbee.Zigbee_Light_Move_To_Color_Temperature(address_ID, color_temp, trans_time);
                }
                else if(address_info.target_network=="Bluetooth LE")
                {
                    lighting_api_ble.BLE_Light_Move_To_Color_Temperature(address_ID, color_temp, trans_time);
                }
            }
            else{
                lighting_api_mqtt.MQTT_Light_Move_To_Color_Temperature(address_ID, color_temp, trans_time);
                lighting_api_hue_bridge.Hue_Bridge_Light_Move_To_Color_Temperature(address_ID, color_temp, trans_time);
                lighting_api_zigbee.Zigbee_Light_Move_To_Color_Temperature(address_ID, color_temp, trans_time);
                lighting_api_ble.BLE_Light_Move_To_Color_Temperature(address_ID, color_temp, trans_time);
            }
        }
        catch (e) {
            debug("[Lighting_API] Light_Move_To_Color_Temperature() Error " + e);
        }
    };

    self.Light_Move_To_Mired_Color_Temperature = async function (address_ID, mired_color_temp, trans_time) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);

            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    if(address_info.target_protocol=="MQTT")
                    {
                        lighting_api_mqtt.MQTT_Light_Move_To_Mired_Color_Temperature(address_ID, mired_color_temp, trans_time);
                    }
                    if(address_info.target_protocol=="Hue API Tunnel")
                    {
                        lighting_api_hue_bridge.Hue_Bridge_Light_Move_To_Mired_Color_Temperature(address_ID, mired_color_temp, trans_time);
                    }
                }
                else if(address_info.target_network=="Zigbee")
                {
                    lighting_api_zigbee.Zigbee_Light_Move_To_Mired_Color_Temperature(address_ID, mired_color_temp, trans_time);
                }
                else if(address_info.target_network=="Bluetooth LE")
                {
                    lighting_api_ble.BLE_Light_Move_To_Mired_Color_Temperature(address_ID, mired_color_temp, trans_time);
                }
            }
            else{
                lighting_api_mqtt.MQTT_Light_Move_To_Mired_Color_Temperature(address_ID, mired_color_temp, trans_time);
                lighting_api_hue_bridge.Hue_Bridge_Light_Move_To_Mired_Color_Temperature(address_ID, mired_color_temp, trans_time);
                lighting_api_zigbee.Zigbee_Light_Move_To_Mired_Color_Temperature(address_ID, mired_color_temp, trans_time);
                lighting_api_ble.BLE_Light_Move_To_Mired_Color_Temperature(address_ID, mired_color_temp, trans_time);
            }
        }
        catch (e) {
            debug("[Lighting_API] Light_Move_To_Mired_Color_Temperature() Error " + e);
        }
    };

    self.Light_Step_Color_Temperature_Up_Down = async function (address_ID, step_color_temp, direction, trans_time) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);

            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    if(address_info.target_protocol=="MQTT")
                    {
                        lighting_api_mqtt.MQTT_Light_Step_Color_Temperature_Up_Down(address_ID, step_color_temp, direction, trans_time);
                    }
                    if(address_info.target_protocol=="Hue API Tunnel")
                    {
                        lighting_api_hue_bridge.Hue_Bridge_Light_Step_Color_Temperature_Up_Down(address_ID, step_color_temp, direction, trans_time);
                    }
                }
                else if(address_info.target_network=="Zigbee")
                {
                    lighting_api_zigbee.Zigbee_Light_Step_Color_Temperature_Up_Down(address_ID, step_color_temp, direction, trans_time);
                }
            }
            else{
                lighting_api_mqtt.MQTT_Light_Step_Color_Temperature_Up_Down(address_ID, step_color_temp, direction, trans_time);
                lighting_api_hue_bridge.Hue_Bridge_Light_Step_Color_Temperature_Up_Down(address_ID, step_color_temp, direction, trans_time);
                lighting_api_zigbee.Zigbee_Light_Step_Color_Temperature_Up_Down(address_ID, step_color_temp, direction, trans_time);
            }
        }
        catch (e) {
            debug("[Lighting_API] Light_Step_Saturation_Up_Down() Error " + e);
        }
    };

    self.Light_Step_Mired_Color_Temperature_Up_Down = async function (address_ID, step_mired_color_temp, direction, trans_time) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);

            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    if(address_info.target_protocol=="MQTT")
                    {
                        lighting_api_mqtt.MQTT_Light_Step_Mired_Color_Temperature_Up_Down(address_ID, step_mired_color_temp, direction, trans_time);
                    }
                    if(address_info.target_protocol=="Hue API Tunnel")
                    {
                        lighting_api_hue_bridge.Hue_Bridge_Light_Step_Mired_Color_Temperature_Up_Down(address_ID, step_mired_color_temp, direction, trans_time);
                    }
                }
                else if(address_info.target_network=="Zigbee")
                {
                    lighting_api_zigbee.Zigbee_Light_Step_Mired_Color_Temperature_Up_Down(address_ID, step_mired_color_temp, direction, trans_time);
                }
            }
            else{
                lighting_api_mqtt.MQTT_Light_Step_Mired_Color_Temperature_Up_Down(address_ID, step_mired_color_temp, direction, trans_time);
                lighting_api_hue_bridge.Hue_Bridge_Light_Step_Mired_Color_Temperature_Up_Down(address_ID, step_mired_color_temp, direction, trans_time);
                lighting_api_zigbee.Zigbee_Light_Step_Mired_Color_Temperature_Up_Down(address_ID, step_mired_color_temp, direction, trans_time);
            }
        }
        catch (e) {
            debug("[Lighting_API] Light_Step_Saturation_Up_Down() Error " + e);
        }
    };

    self.Get_Light_On_Off_Status = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }

            var result = null;

            if(address_info.target_network=="TCP/IP")
            {
                if(address_info.target_protocol=="MQTT")
                {
                    result = await lighting_api_mqtt.Get_MQTT_Light_On_Off_Status(address_ID);
                }
                if(address_info.target_protocol=="Hue API Tunnel")
                {
                    result = await lighting_api_hue_bridge.Get_Hue_Bridge_Light_On_Off_Status(address_ID);
                }
            }
            else if(address_info.target_network=="Zigbee")
            {
                result = await lighting_api_zigbee.Get_Zigbee_Light_On_Off_Status(address_ID);
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
            debug("[Lighting_API] Get_Light_On_Off_Status() Error " + e);
        }
    };

    self.Get_Light_Current_Level = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }

            var result = null;

            if(address_info.target_network=="TCP/IP")
            {
                if(address_info.target_protocol=="MQTT")
                {
                    result = await lighting_api_mqtt.Get_MQTT_Light_Current_Level(address_ID);
                }
                if(address_info.target_protocol=="Hue API Tunnel")
                {
                    result = await lighting_api_hue_bridge.Get_Hue_Bridge_Light_Current_Level(address_ID);
                }
            }
            else if(address_info.target_network=="Zigbee")
            {
                result = await lighting_api_zigbee.Get_Zigbee_Light_Current_Level(address_ID);
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
            debug("[Lighting_API] Get_Light_Current_Level() Error " + e);
        }
    };

    self.Get_Light_Current_Color = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }

            var result = null;

            if(address_info.target_network=="TCP/IP")
            {
                if(address_info.target_protocol=="MQTT")
                {
                    result = await lighting_api_mqtt.Get_MQTT_Light_Current_Color(address_ID);
                }
                if(address_info.target_protocol=="Hue API Tunnel")
                {
                    result = await lighting_api_hue_bridge.Get_Hue_Bridge_Light_Current_Color(address_ID);
                }
            }
            else if(address_info.target_network=="Zigbee")
            {
                result = await lighting_api_zigbee.Get_Zigbee_Light_Current_Color(address_ID);
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
            debug("[Lighting_API] Get_Light_Current_Color() Error " + e);
        }
    };

    self.Get_Light_Current_Color_Temperature = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }

            var result = null;

            if(address_info.target_network=="TCP/IP")
            {
                if(address_info.target_protocol=="MQTT")
                {
                    result = await lighting_api_mqtt.Get_MQTT_Light_Current_Color_Temperature(address_ID);
                }
                if(address_info.target_protocol=="Hue API Tunnel")
                {
                    result = await lighting_api_hue_bridge.Get_Hue_Bridge_Light_Current_Color_Temperature(address_ID);
                }
            }
            else if(address_info.target_network=="Zigbee")
            {
                result = await lighting_api_zigbee.Get_Zigbee_Light_Current_Color_Temperature(address_ID);
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
            debug("[Lighting_API] Get_Light_Current_Color_Temperature() Error " + e);
        }
    };
    self.Get_Light_All_Status = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }

            var result = null;

            if(address_info.target_network=="TCP/IP")
            {
                if(address_info.target_protocol=="MQTT")
                {
                    result = await lighting_api_mqtt.Get_MQTT_Light_All_Status(address_ID);
                }
                if(address_info.target_protocol=="Hue API Tunnel")
                {
                    result = await lighting_api_hue_bridge.Get_Hue_Bridge_Light_All_Status(address_ID);
                }
            }
            else if(address_info.target_network=="Zigbee")
            {
                result = await lighting_api_zigbee.Get_Zigbee_Light_All_Status(address_ID);
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
            debug("[Lighting_API] Get_Light_On_Off_Status() Error " + e);
        }
    };
};

module.exports = Lighting_API;
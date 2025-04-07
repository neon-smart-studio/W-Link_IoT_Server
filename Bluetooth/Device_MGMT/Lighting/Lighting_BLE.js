
var debug = require('debug')(require('path').basename(__filename));

var Lighting_API = require('../../../Device_MGMT/Lighting/Lighting_API.js');
var lighting_api = new Lighting_API();

var WebSocket = require('../../../Web/WebSocket.js');
var websocket = new WebSocket();

var Xiaomi_Bedside_Lamp = require('./Xiaomi_Bedside_Lamp.js');
var ble_xiaomi_bedside_lamp = new Xiaomi_Bedside_Lamp();

var Lighting_BLE = function () {
    var self = this;

    self.Lighting_BLE_Handle_New_Device = function (device_ID, peripheral_dev_info) {
        try {
            if(peripheral_dev_info.id!=device_ID)
            {
                return false;
            }

            var is_lighting_device = false;

            is_lighting_device = ble_xiaomi_bedside_lamp.Is_Xiaomi_Bedside_Lamp_Local_Name(peripheral_dev_info.advertisement.localName);
            if(is_lighting_device==true)
            {
                return is_lighting_device;
            }

            return is_lighting_device;
        }
        catch (e) {
            debug("[Lighting_BLE] Lighting_BLE_Handle_New_Device() Error " + e);
        }
    }

    self.Lighting_BLE_Resolv_Device_Type = function (device_ID, peripheral_dev_info) {
        try {
            var device_Type = null;

            if(ble_xiaomi_bedside_lamp.Is_Xiaomi_Bedside_Lamp_Local_Name(peripheral_dev_info.advertisement.localName)==true)
            {
                device_Type = ble_xiaomi_bedside_lamp.Get_Xiaomi_Bedside_Lamp_Device_Type();
            }

            return device_Type;
        }
        catch (e) {
            debug("[Lighting_BLE] Lighting_BLE_Resolv_Device_Type() Error " + e);
        }
    }

    self.Lighting_BLE_Handle_Device_Connected = async function (device_ID, basic_device_info, peripheral_dev_info) {
        try {
            var success = false;

            if(ble_xiaomi_bedside_lamp.Is_Xiaomi_Bedside_Lamp_Local_Name(peripheral_dev_info.advertisement.localName)==true)
            {
                success = await ble_xiaomi_bedside_lamp.On_Xiaomi_Bedside_Lamp_Connected(device_ID, basic_device_info);
            }

            return success;
        }
        catch (e) {
            debug("[Lighting_BLE] Process_Lighting_BLE_Attribute_Report_Message() Error " + e);
        }
    }
}
module.exports = Lighting_BLE;

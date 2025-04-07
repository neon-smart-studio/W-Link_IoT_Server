
var debug = require('debug')(require('path').basename(__filename));

var Humidity_Sensor_API = require('../../../Device_MGMT/Environment/Humidity_Sensor_API.js');
var humidity_sensor_api = new Humidity_Sensor_API();

var Xiaomi_Humidity_Sensor = require('./Xiaomi_Humidity_Sensor.js');
var ble_xiaomi_humidity_sensor = new Xiaomi_Humidity_Sensor();

var Environment_BLE = function () {
    var self = this;

    self.Environment_BLE_Handle_New_Device = function (device_ID, peripheral_dev_info) {
        try {
            if(peripheral_dev_info.id!=device_ID)
            {
                return false;
            }

            var is_humidity_sensor_device = false;

            is_humidity_sensor_device = ble_xiaomi_humidity_sensor.Is_Xiaomi_Humidity_Sensor_Local_Name(peripheral_dev_info.advertisement.localName);
            if(is_humidity_sensor_device==true)
            {
                return is_humidity_sensor_device;
            }

            return is_humidity_sensor_device;
        }
        catch (e) {
            debug("[Environment_BLE] Environment_BLE_Handle_New_Device() Error " + e);
        }
    }

    self.Environment_BLE_Resolv_Device_Type = function (device_ID, peripheral_dev_info) {
        try {
            var device_Type = null;

            if(ble_xiaomi_humidity_sensor.Is_Xiaomi_Humidity_Sensor_Local_Name(peripheral_dev_info.advertisement.localName)==true)
            {
                device_Type = ble_xiaomi_humidity_sensor.Get_Xiaomi_Humidity_Sensor_Device_Type();
            }

            return device_Type;
        }
        catch (e) {
            debug("[Environment_BLE] Environment_BLE_Resolv_Device_Type() Error " + e);
        }
    }

    self.Environment_BLE_Handle_Device_Connected = async function (device_ID, basic_device_info, peripheral_dev_info) {
        try {
            var success = false;

            if(ble_xiaomi_humidity_sensor.Is_Xiaomi_Humidity_Sensor_Local_Name(peripheral_dev_info.advertisement.localName)==true)
            {
                success = await ble_xiaomi_humidity_sensor.On_Xiaomi_Humidity_Sensor_Connected(device_ID, basic_device_info);
            }

            return success;
        }
        catch (e) {
            debug("[Environment_BLE] Process_Environment_BLE_Attribute_Report_Message() Error " + e);
        }
    }
}
module.exports = Environment_BLE;

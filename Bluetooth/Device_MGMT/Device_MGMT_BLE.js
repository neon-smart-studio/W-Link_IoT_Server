
var debug = require('debug')(require('path').basename(__filename));

var Device_MGMT_API = require('../../Device_MGMT/Device_MGMT_API.js');
var device_mgmt_api = new Device_MGMT_API();

var Environment_BLE = require('./Environment/Environment_BLE.js');
var environment_ble = new Environment_BLE();

var Lighting_BLE = require('./Lighting/Lighting_BLE.js');
var lighting_ble = new Lighting_BLE();

var Device_MGMT_BLE = function (){
    var self = this;

    self.Device_MGMT_BLE_Handle_Discovered_Device = function (device_ID, peripheral_dev_info){
        try {
            if(peripheral_dev_info.id!=device_ID)
            {
                return;
            }

            var connect_to_dev = false;
            
            if(environment_ble.Environment_BLE_Handle_New_Device(device_ID, peripheral_dev_info)==true)
            {
                connect_to_dev = true;
                return connect_to_dev;
            }

            if(lighting_ble.Lighting_BLE_Handle_New_Device(device_ID, peripheral_dev_info)==true)
            {
                connect_to_dev = true;
                return connect_to_dev;
            }

            return connect_to_dev;
        }
        catch(e)
        {
            debug("[Device_MGMT_BLE] Device_MGMT_BLE_Check_Supported() Error " + e);
        }
    }

    self.Device_MGMT_BLE_Handle_New_Device = async function (device_ID, basic_device_info, peripheral_dev_info){
        try {
            if(basic_device_info==null || peripheral_dev_info==null)
            {
                return;
            }

            if(peripheral_dev_info.id!=device_ID)
            {
                return;
            }

            var success = false;
            var device_Type = "";

            device_Type = environment_ble.Environment_BLE_Resolv_Device_Type(device_ID, peripheral_dev_info);
            if(device_Type!=null)
            {
                success = await environment_ble.Environment_BLE_Handle_Device_Connected(device_ID, basic_device_info, peripheral_dev_info);
            }
            
            device_Type = lighting_ble.Lighting_BLE_Resolv_Device_Type(device_ID, peripheral_dev_info);
            if(device_Type!=null)
            {
                success = await lighting_ble.Lighting_BLE_Handle_Device_Connected(device_ID, basic_device_info, peripheral_dev_info);
            }
            
            if(success==true)
            {
                var device_ID = peripheral_dev_info.id;
                var devInf = {
                    "device_ID":device_ID,
                    "device_Name":basic_device_info.device_Name,
                    "network_Type":"Bluetooth LE",
                    "device_Type":device_Type,
                    "ble_device_info":peripheral_dev_info
                };

                device_mgmt_api.Device_MGMT_Save_Device_Info('everyone', device_Type, device_ID, devInf);
            }

        }
        catch(e)
        {
            debug("[Device_MGMT_BLE] Device_MGMT_BLE_Handle_Device_Connected() Error " + e);
        }
    }

};
module.exports = Device_MGMT_BLE;

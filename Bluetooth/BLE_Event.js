// Example express application adding the parse-server module to expose Parse
// compatible API routes.
var debug = console.log;//require('debug')(require('path').basename(__filename));

var BLE = require('./BLE.js');
var ble = new BLE();

var Device_MGMT_BLE = require('./Device_MGMT/Device_MGMT_BLE');
var device_mgmt_ble = new Device_MGMT_BLE();

async function Handle_BLE_Discover_Device(device_ID, peripheral_dev_info)
{
    try {
    }
    catch (e) {
        debug("[BLE_Event] Handle_BLE_Discover_Device() Error " + e);
    };
}

async function Handle_BLE_Device_Connected(device_ID, peripheral_dev_info)
{
    try {
        var device_name = await ble.BLE_Read_Device_Name(device_ID);
        if(device_name==null)
        {
            device_name = peripheral_dev_info.advertisement.localName;
        }
        
        var basic_device_info = {
            device_Name: device_name
        };

        await device_mgmt_ble.Device_MGMT_BLE_Handle_New_Device(device_ID, basic_device_info, peripheral_dev_info);
    }
    catch (e) {
        debug("[BLE_Event] Handle_BLE_Device_Connected() Error " + e);
    };
}

async function Handle_BLE_Device_Disconnected(device_ID, peripheral_dev_info)
{
    try {
    }
    catch (e) {
        debug("[BLE_Event] Handle_BLE_Device_Disconnected() Error " + e);
    };
}

var BLE_Event = function () {
    var self = this;

    self.BLE_Event_Init = async function () {
        try {
            ble.BLE_Register_Callbacks(Handle_BLE_Discover_Device, Handle_BLE_Device_Connected, Handle_BLE_Device_Disconnected);
        }
        catch (e) {
            debug("[BLE_Event] BLE_Event_Init() Error " + e);
        };
    };
};


module.exports = BLE_Event;
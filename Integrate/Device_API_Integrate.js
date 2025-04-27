
var debug = require('debug')(require('path').basename(__filename));

var Hue_Bridge_Device_API = require('./Hue_Bridge/Hue_Bridge_Device_API.js');
var hue_bridge_device_api = new Hue_Bridge_Device_API();

var LIFX_Device_API = require('./LIFX/LIFX_Device_API.js');
var lifx_device_api = new LIFX_Device_API();

var Yeelight_Device_API = require('./Yeelight/Yeelight_Device_API.js');
var yeelight_device_api = new Yeelight_Device_API();

var Device_API_Integrate = function () {
    var self = this;
    
    self.Rename_Integrate_Device = async function (target_network, target_protocol, username, device_ID, new_name) {
        try {
            switch(target_protocol)
            {
                case "Hue API Tunnel":
                    await hue_bridge_device_api.Rename_Hue_Bridge_Device(username, device_ID, new_name);
                    break;
                case "Yeelight API Tunnel":
                    await yeelight_device_api.Rename_Yeelight_Device(username, device_ID, new_name);
                    break;
                case "LIFX LAN":
                    await lifx_device_api.Rename_Lifx_Device(username, device_ID, new_name);
                    break;
            }
        }
        catch (e) {
            debug("[Device_API_Integrate] Integrate_Device_Change_Name() Error " + e);
        }
    }

    self.Remove_Integrate_Device = async function (target_network, target_protocol, username, device_ID) {
        try {
            switch(target_protocol)
            {
                case "Hue API Tunnel":
                    await hue_bridge_device_api.Remove_Hue_Bridge_Device(username, device_ID);
                    break;
                case "Yeelight API Tunnel":
                    await yeelight_device_api.Remove_Yeelight_Device(username, device_ID);
                    break;
                case "LIFX LAN":
                    await lifx_device_api.Remove_Lifx_Device(username, device_ID, new_name);
                    break;
            }
        }
        catch (e) {
            debug("[Device_API_Integrate] Remove_Integrate_Device() Error " + e);
        }
    }
};

module.exports = Device_API_Integrate;
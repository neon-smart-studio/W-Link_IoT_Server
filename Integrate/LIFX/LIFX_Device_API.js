var debug = require('debug')(require('path').basename(__filename));

const lifx = require('node-lifx-lan');

var Device_MGR = require('../../Util/Device_MGR.js');
var device_mgr = new Device_MGR();

var lifx_discovered_device_obj_list = {};
var lifx_linked_device_obj_list = {};

const Lifx_Device_Type = "Lighting";

async function discoverViaLifxLan(timeoutMs = 1000) {
    try {
        let results = [];
        let discoveryResults = await lifx.discover({"wait": timeoutMs});
        discoveryResults.forEach(dev => {
            results.push({
                "ip": dev.ip,
                "mac": dev.mac,
                "name": dev.deviceInfo.label,
                "port": dev._lifxLanUdp._UDP_PORT,
                "hwVersion": dev.deviceInfo.hwVersion,
                "productId": dev.deviceInfo.productId,
                "productName": dev.deviceInfo.productName,
                "vendorId": dev.deviceInfo.vendorId,
                "vendorName": dev.deviceInfo.vendorName,
            });
        });
        return results;
    } catch (e) {
        debug("[Lifx_Device_API] discoverViaLifxLan() Error " + e);
        return null;
    }
}

var Lifx_Device_API = function () {
    var self = this;

    self.Discover_Nearby_LIFX = async function (username) {
        try {
            let discoveryResults = await discoverViaLifxLan(5000);
            return {
                num_of_lifx: discoveryResults.length,
                discovered_lifx_list: discoveryResults
            };
        } catch (e) {
            debug("[Lifx_Device_API] Discover_Nearby_LIFX() Error " + e);
        }
    };
    self.Link_To_Lifx_Device = async function (username, ip, mac) {
        try {
            let lifx_device_obj = await lifx.createDevice({ ip: ip, mac: mac });
            let deviceInfo = await lifx_device_obj.getDeviceInfo();
            
            let device_type = null;

            switch(deviceInfo.productName)
            {
                case "LIFX Mini Color":
                case "LIFX Color 1000":
                    device_type = "Colored Light";
                    break;
                case "LIFX Mini White":
                    device_type = "Dimmable Light";
                    break;
                default:
                    return;
            }

            let device_ID = lifx_device_obj.mac.replace(/:/g, "") + deviceInfo.productId.toString() + deviceInfo.hwVersion.toString();

            const lifx_new_dev_info = {
                "device_Name": deviceInfo.label,
                "network_Type": "TCP/IP",
                "protocol_Type": "LIFX LAN",
                "device_Type": device_type,
                "ip_address": lifx_device_obj.ip,
                "mac_address": lifx_device_obj.mac,
                "port": lifx_device_obj._lifxLanUdp._UDP_PORT,
                "hwVersion": deviceInfo.hwVersion,
                "productId": deviceInfo.productId,
                "productName": deviceInfo.productName,
                "vendorId": deviceInfo.vendorId,
                "vendorName": deviceInfo.vendorName,
            };
    
            return await device_mgr.Save_Device_Info(device_type, username, device_ID, lifx_new_dev_info);
        } catch (e) {
            debug("[Lifx_Device_API] Link_To_Lifx_Device() Error " + e);
            return false;
        }
    };
    
    self.Rename_Lifx_Device = async function (username, device_ID, new_name) {
        try {
            return await device_mgr.Device_Change_Name(Lifx_Device_Type, username, device_ID, new_name);
        } catch (e) {
            debug("[Lifx_Device_API] Rename_Lifx_Device() Error " + e);
        }
    };

    self.Remove_Lifx_Device = async function (username, device_ID) {
        try {
            delete lifx_linked_device_obj_list[device_ID];
            return await device_mgr.Remove_Device(Lifx_Device_Type, username, device_ID);
        } catch (e) {
            debug("[Lifx_Device_API] Remove_Lifx_Device() Error " + e);
        }
    };

    self.Get_Lifx_Device_Session = async function (username, device_ID) {
        try {
            var session = lifx_linked_device_obj_list[device_ID];
            if (!session) {
                var device_inf = await device_mgr.Read_Device_Inf(Lifx_Device_Type, username, device_ID);
                if (!device_inf) return null;

                session = lifx_discovered_device_obj_list[device_ID];
                lifx_linked_device_obj_list[device_ID] = session;
            }

            return session;
        } catch (e) {
            debug("[Lifx_Device_API] Get_Lifx_Device_Session() Error " + e);
        }
    };
};

module.exports = Lifx_Device_API;

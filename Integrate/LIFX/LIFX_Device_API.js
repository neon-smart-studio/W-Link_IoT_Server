var debug = require('debug')(require('path').basename(__filename));

const lifx = require('node-lifx-lan');

var Address_MGR = require('../../Util/Address_MGR.js');
var address_mgr = new Address_MGR();

var Device_MGR = require('../../Util/Device_MGR.js');
var device_mgr = new Device_MGR();

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
                    device_type = "Extended Color Light";
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
            if(await device_mgr.Is_Exist("Extended Color Light", username, device_ID))
            {
                return await device_mgr.Device_Change_Name("Extended Color Light", username, device_ID, new_name);
            }
            if(await device_mgr.Is_Exist("Dimmable Light", username, device_ID))
            {
                return await device_mgr.Device_Change_Name("Dimmable Light", username, device_ID, new_name);
            }
            return false;
        } catch (e) {
            debug("[Lifx_Device_API] Rename_Lifx_Device() Error " + e);
        }
    };

    self.Remove_Lifx_Device = async function (username, device_ID) {
        try {
            if(await device_mgr.Is_Exist("Extended Color Light", username, device_ID))
            {
                return await device_mgr.Remove_Device("Extended Color Light", username, device_ID);
            }
            if(await device_mgr.Is_Exist("Dimmable Light", username, device_ID))
            {
                return await device_mgr.Remove_Device("Dimmable Light", username, device_ID);
            }
            return false;
        } catch (e) {
            debug("[Lifx_Device_API] Remove_Lifx_Device() Error " + e);
        }
    };

    self.Get_Lifx_Device_Session = async function (username, device_ID) {
        try {
            var address_inf = await address_mgr.Read_Address_Info(device_ID);
            if (!address_inf) return null;

            let lifx_device_obj = await lifx.createDevice({ ip: address_inf.ip_address, mac: address_inf.mac_address });
            let deviceInfo = await lifx_device_obj.getDeviceInfo();

            let device_type = null;
            switch(deviceInfo.productName)
            {
                case "LIFX Mini Color":
                case "LIFX Color 1000":
                    device_type = "Extended Color Light";
                    break;
                case "LIFX Mini White":
                    device_type = "Dimmable Light";
                    break;
                default:
                    return;
            }

            lifx_device_obj["deviceInfo"] = deviceInfo;
            lifx_device_obj["device_Type"] = device_type;
            
            return lifx_device_obj;
        } catch (e) {
            debug("[Lifx_Device_API] Get_Lifx_Device_Session() Error " + e);
        }
    };
};

module.exports = Lifx_Device_API;

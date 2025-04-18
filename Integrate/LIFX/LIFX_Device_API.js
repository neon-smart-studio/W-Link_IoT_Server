var debug = require('debug')(require('path').basename(__filename));

const LifxLan = require('node-lifx-lan');
var lifx = new LifxLan();

var Device_MGR = require('../Util/Device_MGR.js');
var device_mgr = new Device_MGR();

var lifx_discovered_device_obj_list = {};
var lifx_linked_device_obj_list = {};

const Lifx_Device_Type = "Lighting";

var Lifx_Device_API = function () {
    var self = this;

    self.Discover_Lifx_Device = async function (discover_duration) {
        try {
            if (discover_duration >= 60000) {
                discover_duration = 60000;
            }

            var discover_results = await lifx.discover(discover_duration);
            discover_results.forEach(dev => {
                if (dev.macAddress) {
                    lifx_discovered_device_obj_list[dev.macAddress] = dev;
                }
            });

            return discover_results;
        } catch (e) {
            debug("[Lifx_Device_API] Discover_Lifx_Device() Error " + e);
        }
    };

    self.Link_To_Lifx_Device = async function (username, lifx_ID) {
        try {
            if (!lifx_discovered_device_obj_list[lifx_ID]) {
                let results = await lifx.discover(5000);
                results.forEach(dev => {
                    if (dev.macAddress) {
                        lifx_discovered_device_obj_list[dev.macAddress] = dev;
                    }
                });

                if (!lifx_discovered_device_obj_list[lifx_ID]) {
                    return false;
                }
            }

            var lifx_device_obj = lifx_discovered_device_obj_list[lifx_ID];
            var device_Type = "Colored Light";
            var light_name = `LIFX ${lifx_device_obj.productName || 'Light'}`;

            lifx_linked_device_obj_list[lifx_ID] = lifx_device_obj;

            var lifx_new_dev_info = {
                "device_Name": light_name,
                "network_Type": "LAN",
                "protocol_Type": "LIFX LAN Protocol",
                "device_Type": device_Type,
                "model": lifx_device_obj.productName,
                "ip_address": lifx_device_obj.ip,
                "port": 56700 // default LIFX UDP port
            };
            return await device_mgr.Save_Device_Info(Lifx_Device_Type, username, lifx_ID, lifx_new_dev_info);
        } catch (e) {
            debug("[Lifx_Device_API] Link_To_Lifx_Device() Error " + e);
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

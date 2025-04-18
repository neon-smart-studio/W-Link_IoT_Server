
var debug = require('debug')(require('path').basename(__filename));

var Device_MGR = require('../Util/Device_MGR.js');
var device_mgr = new Device_MGR();

var Twinkly_Request_API = require('./Twinkly_Request_API.js');
var twinkly_request_api = new Twinkly_Request_API();

async function do_Query_Device_Info(ip_address)
{
    /*
        json = {
            device_name: <String>,
            product_code: <String>,
            hw_id: <String>,
            number_of_led: <Number>,
            led_profile: <String>,
        }
    */
    var result = await twinkly_request_api.Twinkly_GET_Request(ip_address, "/gestalt");
    if(result==null)
    {
        return null;
    }
    return result.body;
}

const Twinkly_Device_Type = "Lighting";

var Twinkly_Device_API = function () {
    var self = this;

    self.Link_To_Twinkly_Light_Device = async function (username, ip_address) {
        try {
            var query_dev_info = await do_Query_Device_Info(ip_address);
            if(query_dev_info==null)
            {
                return false;
            }

            var twinkly_device_ID = query_dev_info.product_code + query_dev_info.led_profile + query_dev_info.hw_id;

            var twinkly_new_dev_info = {
                "device_Name": query_dev_info.device_name,
                "network_Type": "TCP/IP",
                "protocol_Type": "Twinkly API Tunnel",
                "device_Type": "Fairy Light",
                "led_profile": query_dev_info.led_profile,
                "led_type": Number(query_dev_info.led_type),
                "wire_type": Number(query_dev_info.wire_type),
                "uuid": query_dev_info.uuid,
                "ip_address": ip_address,
                "mac": query_dev_info.mac,
                "product_name": query_dev_info.product_name,
                "product_code": query_dev_info.product_code,
                "hw_id": query_dev_info.hw_id,
                "hw_version": query_dev_info.hardware_version,
                "fw_family": query_dev_info.fw_family,
                "number_of_led": Number(query_dev_info.number_of_led),
                "max_supported_led": Number(query_dev_info.max_supported_led),
                "frame_rate": Number(query_dev_info.frame_rate),
                "movie_capacity": Number(query_dev_info.movie_capacity)
            };
            return await device_mgr.Save_Device_Info(Twinkly_Device_Type, username, twinkly_device_ID, twinkly_new_dev_info);
        }
        catch (e) {
            debug("[Twinkly_Device_API] Link_To_Twinkly_Light_Device() Error " + e);
        }
    };
    
    self.Rename_Twinkly_Light_Device = async function (username, address_ID, new_name) {
        try {
            return await device_mgr.Device_Change_Name(Twinkly_Device_Type, username, address_ID, new_name);
        }
        catch (e) {
            debug("[Twinkly_Device_API] Rename_Twinkly_Light_Device() Error " + e);
        }
    };

    self.Remove_Twinkly_Light_Device = async function (username, address_ID) {
        try {
            var light_device_info = await device_mgr.Read_Device_Inf(Twinkly_Device_Type, username, address_ID);
            if(light_device_info==null)
            {
                return false;
            }

            if(light_device_info.ip_address!=null)
            {
                twinkly_request_api.Twinkly_Clear_Authentication_Token(light_device_info.ip_address);
            }

            return await device_mgr.Remove_Device(Twinkly_Device_Type, username, address_ID);
        }
        catch (e) {
            debug("[Twinkly_Device_API] Remove_Twinkly_Light_Device() Error " + e);
        }
    };

    self.Get_Twinkly_Light_LED_Counts = async function (address_ID) {
        try {
            var result = await device_mgr.Read_Device_Inf(Twinkly_Device_Type, null, address_ID);
            if(result==null)
            {
                return null;
            }
            return result.number_of_led;
        }
        catch (e) {
            debug("[Twinkly_Device_API] Read_Twinkly_Light_Device_Info() Error " + e);
        }
    };
    self.Get_Twinkly_Light_LED_Profile = async function (address_ID) {
        try {
            var result = await device_mgr.Read_Device_Inf(Twinkly_Device_Type, null, address_ID);
            if(result==null)
            {
                return null;
            }
            return result.led_profile;
        }
        catch (e) {
            debug("[Twinkly_Device_API] Read_Twinkly_Light_Device_Info() Error " + e);
        }
    };

};

module.exports = Twinkly_Device_API;

var debug = require('debug')(require('path').basename(__filename));

var Map_Device_Info = function (){
    var self = this;

    self.Map_Device_Info = function(user, device_ID, device_Name, device_protocol_type, dev_inf_json)
    {
        let devInf = null;

        if(device_protocol_type=="Hue API Tunnel")
        {
            if(dev_inf_json.device_Type=="Hue Bridge")
            {
                devInf = {
                    "user": user,
                    "device_ID":device_ID,
                    "device_Name":device_Name,
                    "network_Type":dev_inf_json.network_Type,
                    "protocol_Type":dev_inf_json.protocol_Type,
                    "device_Type":dev_inf_json.device_Type,
                    "IP_address": dev_inf_json.IP_address,
                    "software_version": dev_inf_json.software_version,
                    "apiversion": dev_inf_json.apiversion,
                    "manufacture": dev_inf_json.manufacture,
                    "modelID": dev_inf_json.modelID,
                    "authenticated_user": dev_inf_json.authenticated_user,
                    "bridge_configuration": dev_inf_json.bridge_configuration
                };
            }
            else{
                bridge_address_ID = dev_inf_json.bridge_address_ID;
                devInf = {
                    "user": user,
                    "device_ID":device_ID,
                    "device_Name":device_Name,
                    "network_Type":dev_inf_json.network_Type,
                    "protocol_Type":dev_inf_json.protocol_Type,
                    "device_Network":dev_inf_json.device_Network,
                    "device_Type":dev_inf_json.device_Type,
                    "bridge_address_ID": bridge_address_ID,
                    "node_ID": Number(dev_inf_json.node_ID),
                    "unique_ID": dev_inf_json.unique_ID,
                    "software_version": dev_inf_json.software_version,
                    "manufacture": dev_inf_json.manufacture,
                    "modelID": dev_inf_json.modelID,
                    "capabilities": dev_inf_json.capabilities,
                    "config": dev_inf_json.config
                };
            }
        }
        else if(device_protocol_type=="Twinkly API Tunnel")
        {
            devInf = {
                "user": user,
                "device_ID":device_ID,
                "device_Name": device_Name,
                "network_Type":dev_inf_json.network_Type,
                "protocol_Type":dev_inf_json.protocol_Type,
                "device_Type":dev_inf_json.device_Type,
                "led_profile": dev_inf_json.led_profile,
                "led_type": Number(dev_inf_json.led_type),
                "wire_type": Number(dev_inf_json.wire_type),
                "uuid": dev_inf_json.uuid,
                "ip_address": dev_inf_json.ip_address,
                "mac": dev_inf_json.mac,
                "product_name": dev_inf_json.product_name,
                "product_code": dev_inf_json.product_code,
                "hw_id": dev_inf_json.hw_id,
                "hw_version": dev_inf_json.hw_version,
                "fw_family": dev_inf_json.fw_family,
                "number_of_led": Number(dev_inf_json.number_of_led),
                "max_supported_led": Number(dev_inf_json.max_supported_led),
                "frame_rate": Number(dev_inf_json.frame_rate),
                "movie_capacity": Number(dev_inf_json.movie_capacity)
            };
        }
        else if(device_protocol_type=="Yeelink API Tunnel")
        {
            devInf = {
                "user": user,
                "device_ID":device_ID,
                "device_Name": device_Name,
                "network_Type": "TCP/IP",
                "protocol_Type": "Yeelink API Tunnel",
                "device_Type":dev_inf_json.device_Type,
                "model": dev_inf_json.model,
                "ip_address": dev_inf_json.ip_address,
                "port": dev_inf_json.port
            };
        }
        else if(device_protocol_type=="LIFX LAN")
        {
            devInf = {
                "user": user,
                "device_ID":device_ID,
                "device_Name": device_Name,
                "network_Type": "TCP/IP",
                "protocol_Type": "LIFX LAN",
                "device_Type":dev_inf_json.device_Type,
                "ip_address": dev_inf_json.ip_address,
                "mac_address": dev_inf_json.mac_address,
                "port": dev_inf_json.port,
                "port": dev_inf_json.port,
                "hwVersion": dev_inf_json.hwVersion,
                "productId": dev_inf_json.productId,
                "productName": dev_inf_json.productName,
                "vendorId": dev_inf_json.vendorId,
                "vendorName": dev_inf_json.vendorName,
            };
        }

        return devInf;
    }
}
module.exports = Map_Device_Info;
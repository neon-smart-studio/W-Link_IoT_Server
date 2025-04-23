
var debug = require('debug')(require('path').basename(__filename));

const config = require('config');

var util = require("util");

var DataBase = require('../../DataBase/DataBase.js');
var database = new DataBase();

const Address_MGR_DB_Name = 'address';
const Address_MGR_Collection_Name = 'All_Address_List';

async function Save_Hue_Bridge_Device_Address_Info(address, target_type, target_network, target_protocol)
{
    try{
        if(address==null || target_type==null || target_network==null)
        {
            return false;
        }

        if(target_type!="Device" && target_type!="device" && target_type!="Group" && target_type!="group")
        {
            return false;
        }

        var success = await database.DataBase_Open(Address_MGR_DB_Name);
        if(success==false)
        {
            return null;
        }

        success = await database.Database_EnsureIndex(Address_MGR_DB_Name, Address_MGR_Collection_Name, "address", true);
        if(success==false)
        {
            await database.DataBase_Close(Address_MGR_DB_Name);
            return false;
        }

        var count = await database.Database_Count(Address_MGR_DB_Name, Address_MGR_Collection_Name, {'address': address});
        if(count<0)
        {
            await database.DataBase_Close(Address_MGR_DB_Name);
            return false;
        }

        var exist = false;
        if(count>0){
            exist = true;
        }

        var address_info = {
            address: address,
            target_type: target_type,
            target_network: target_network,
            target_protocol: target_protocol
        };

        if(exist==true)
        {
            success = await database.Database_Update(Address_MGR_DB_Name, Address_MGR_Collection_Name, {'address': address}, address_info, false);
            if(success==false)
            {
                await database.DataBase_Close(Address_MGR_DB_Name);
                return false;
            }
        }
        else{
            success = await database.Database_Insert(Address_MGR_DB_Name, Address_MGR_Collection_Name, address_info);
            if(success==false)
            {
                await database.DataBase_Close(Address_MGR_DB_Name);
                return false;
            }
        }

        await database.DataBase_Close(Address_MGR_DB_Name);

        return true;
    }
    catch(e)
    {
        debug("[Address_Info] Save_Hue_Bridge_Device_Address_Info() Error: " + e);
    }
};

async function Save_Hue_API_Tunnel_Device_Address_Info(address, host_hue_bridge_ID, device_no_ID)
{
    try{
        if(address==null || host_hue_bridge_ID==null)
        {
            return false;
        }

        var success = await database.DataBase_Open(Address_MGR_DB_Name);
        if(success==false)
        {
            return null;
        }

        success = await database.Database_EnsureIndex(Address_MGR_DB_Name, Address_MGR_Collection_Name, "address", true);
        if(success==false)
        {
            await database.DataBase_Close(Address_MGR_DB_Name);
            return false;
        }

        var count = await database.Database_Count(Address_MGR_DB_Name, Address_MGR_Collection_Name, {'address': address});
        if(count<0)
        {
            await database.DataBase_Close(Address_MGR_DB_Name);
            return false;
        }

        var exist = false;
        if(count>0){
            exist = true;
        }

        var address_info = {
            address: address,
            target_type: "Device",
            target_network: "TCP/IP",
            target_protocol: "Hue API Tunnel",
            host_hue_bridge_ID: host_hue_bridge_ID,
            device_no_ID: device_no_ID
        };

        if(exist==true)
        {
            success = await database.Database_Update(Address_MGR_DB_Name, Address_MGR_Collection_Name, {'address': address}, address_info, false);
            if(success==false)
            {
                await database.DataBase_Close(Address_MGR_DB_Name);
                return false;
            }
        }
        else{
            success = await database.Database_Insert(Address_MGR_DB_Name, Address_MGR_Collection_Name, address_info);
            if(success==false)
            {
                await database.DataBase_Close(Address_MGR_DB_Name);
                return false;
            }
        }

        await database.DataBase_Close(Address_MGR_DB_Name);

        return true;
    }
    catch(e)
    {
        debug("[Address_Info] Save_Hue_API_Tunnel_Device_Address_Info() Error: " + e);
    }
};

async function Save_Twinkly_API_Tunnel_Device_Address_Info(address, twinkly_light_IP)
{
    try{
        if(address==null || twinkly_light_IP==null)
        {
            return false;
        }

        var success = await database.DataBase_Open(Address_MGR_DB_Name);
        if(success==false)
        {
            return null;
        }

        success = await database.Database_EnsureIndex(Address_MGR_DB_Name, Address_MGR_Collection_Name, "address", true);
        if(success==false)
        {
            await database.DataBase_Close(Address_MGR_DB_Name);
            return false;
        }

        var count = await database.Database_Count(Address_MGR_DB_Name, Address_MGR_Collection_Name, {'address': address});
        if(count<0)
        {
            await database.DataBase_Close(Address_MGR_DB_Name);
            return false;
        }

        var exist = false;
        if(count>0){
            exist = true;
        }

        var address_info = {
            address: address,
            target_type: "Device",
            target_network: "TCP/IP",
            target_protocol: "Twinkly API Tunnel",
            ip_address: twinkly_light_IP
        };

        if(exist==true)
        {
            success = await database.Database_Update(Address_MGR_DB_Name, Address_MGR_Collection_Name, {'address': address}, address_info, false);
            if(success==false)
            {
                await database.DataBase_Close(Address_MGR_DB_Name);
                return false;
            }
        }
        else{
            success = await database.Database_Insert(Address_MGR_DB_Name, Address_MGR_Collection_Name, address_info);
            if(success==false)
            {
                await database.DataBase_Close(Address_MGR_DB_Name);
                return false;
            }
        }

        await database.DataBase_Close(Address_MGR_DB_Name);

        return true;
    }
    catch(e)
    {
        debug("[Address_Info] Save_Twinkly_API_Tunnel_Device_Address_Info() Error: " + e);
    }
};

async function Save_Yeelight_Device_Address_Info(address, yeelight_IP, yeelight_port)
{
    try{
        if(address==null || yeelight_IP==null || yeelight_port==null)
        {
            return false;
        }

        var success = await database.DataBase_Open(Address_MGR_DB_Name);
        if(success==false)
        {
            return null;
        }

        success = await database.Database_EnsureIndex(Address_MGR_DB_Name, Address_MGR_Collection_Name, "address", true);
        if(success==false)
        {
            await database.DataBase_Close(Address_MGR_DB_Name);
            return false;
        }

        var count = await database.Database_Count(Address_MGR_DB_Name, Address_MGR_Collection_Name, {'address': address});
        if(count<0)
        {
            await database.DataBase_Close(Address_MGR_DB_Name);
            return false;
        }

        var exist = false;
        if(count>0){
            exist = true;
        }

        var address_info = {
            address: address,
            target_type: "Device",
            target_network: "TCP/IP",
            target_protocol: "Yeelight API Tunnel",
            ip_address: yeelight_IP,
            port: yeelight_port
        };

        if(exist==true)
        {
            success = await database.Database_Update(Address_MGR_DB_Name, Address_MGR_Collection_Name, {'address': address}, address_info, false);
            if(success==false)
            {
                await database.DataBase_Close(Address_MGR_DB_Name);
                return false;
            }
        }
        else{
            success = await database.Database_Insert(Address_MGR_DB_Name, Address_MGR_Collection_Name, address_info);
            if(success==false)
            {
                await database.DataBase_Close(Address_MGR_DB_Name);
                return false;
            }
        }

        await database.DataBase_Close(Address_MGR_DB_Name);

        return true;
    }
    catch(e)
    {
        debug("[Address_Info] Save_Yeelight_Device_Address_Info() Error: " + e);
    }
};

async function Save_LIFX_LAN_Device_Address_Info(address, lifx_light_IP, lifx_light_mac)
{
    try{
        if(address==null || lifx_light_IP==null || lifx_light_mac==null)
        {
            return false;
        }

        var success = await database.DataBase_Open(Address_MGR_DB_Name);
        if(success==false)
        {
            return null;
        }

        success = await database.Database_EnsureIndex(Address_MGR_DB_Name, Address_MGR_Collection_Name, "address", true);
        if(success==false)
        {
            await database.DataBase_Close(Address_MGR_DB_Name);
            return false;
        }

        var count = await database.Database_Count(Address_MGR_DB_Name, Address_MGR_Collection_Name, {'address': address});
        if(count<0)
        {
            await database.DataBase_Close(Address_MGR_DB_Name);
            return false;
        }

        var exist = false;
        if(count>0){
            exist = true;
        }

        var address_info = {
            address: address,
            target_type: "Device",
            target_network: "TCP/IP",
            target_protocol: "LIFX LAN",
            ip_address: lifx_light_IP,
            mac_address: lifx_light_mac
        };

        if(exist==true)
        {
            success = await database.Database_Update(Address_MGR_DB_Name, Address_MGR_Collection_Name, {'address': address}, address_info, false);
            if(success==false)
            {
                await database.DataBase_Close(Address_MGR_DB_Name);
                return false;
            }
        }
        else{
            success = await database.Database_Insert(Address_MGR_DB_Name, Address_MGR_Collection_Name, address_info);
            if(success==false)
            {
                await database.DataBase_Close(Address_MGR_DB_Name);
                return false;
            }
        }

        await database.DataBase_Close(Address_MGR_DB_Name);

        return true;
    }
    catch(e)
    {
        debug("[Address_Info] Save_LIFX_LAN_Device_Address_Info() Error: " + e);
    }
};

var Address_Info = function (){
    var self = this;

    self.Fetch_Integrate_Ext_Address_Info = function(addr_doc)
    {
        try{
            let result = {};

            if(addr_doc[0].target_network=="TCP/IP")
            {
                let target_protocol = addr_doc[0].target_protocol;
                let target_type = addr_doc[0].target_type;
                if(target_protocol=="Hue API Tunnel")
                {
                    if(target_type=="Device")
                    {
                        result["host_hue_bridge_ID"] = addr_doc[0].host_hue_bridge_ID;
                        result["device_no_ID"] = addr_doc[0].device_no_ID;
                    }
                }
                else if(target_protocol=="Yeelight API Tunnel")
                {
                    if(target_type=="Device")
                    {
                        result["ip_address"] = addr_doc[0].ip_address;
                        result["mac_address"] = addr_doc[0].mac_address;
                    }
                }
                else if(target_protocol=="LIFX LAN")
                {
                    if(target_type=="Device")
                    {
                        result["ip_address"] = addr_doc[0].ip_address;
                        result["mac_address"] = addr_doc[0].mac_address;
                    }
                }
                else if(target_protocol=="Twinkly API Tunnel")
                {
                    if(target_type=="Device")
                    {
                        result["ip_address"] = addr_doc[0].ip_address;
                        result["port"] = addr_doc[0].port;
                    }
                }
            }
            return result;
        }
        catch(e)
        {
            debug("[Address_Info] Read_Address_Info() Error: " + e);
        }
    };

    self.Save_Integrate_Address_Info = async function(address, target_type, target_network, target_protocol, dev_inf_json)
    {
        try{
            let success = false;

            if(target_protocol=="Hue API Tunnel")
            {
                if(dev_inf_json.device_Type=="Hue Bridge")
                {
                    success = await Save_Hue_Bridge_Device_Address_Info(address, target_type, target_network, target_protocol);
                }
                else{
                    success = await Save_Hue_API_Tunnel_Device_Address_Info(address, bridge_address_ID, Number(dev_inf_json.node_ID));
                }
            }
            else if(target_protocol=="Yeelight API Tunnel")
            {
                success = await Save_Yeelight_Device_Address_Info(address, dev_inf_json.ip_address, dev_inf_json.port);
            }
            else if(target_protocol=="LIFX LAN")
            {
                success = await Save_LIFX_LAN_Device_Address_Info(address, dev_inf_json.ip_address, dev_inf_json.mac_address);
            }
            else if(target_protocol=="Twinkly API Tunnel")
            {
                success = await Save_Twinkly_API_Tunnel_Device_Address_Info(address, dev_inf_json.ip_address);
            }

            return success;
        }
        catch(e)
        {
            debug("[Address_Info] Save_Integrate_Address_Info() Error: " + e);
        }
    }
    
};

module.exports = Address_Info;
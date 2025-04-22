
var debug = require('debug')(require('path').basename(__filename));

const config = require('config');

var Zigbee = require('../Zigbee/Zigbee.js');
var zigbee = new Zigbee();

var Address_MGR = require('./Address_MGR.js');
var address_mgr = new Address_MGR();

var Bind_MGR = require('./Bind_MGR.js');
var bind_mgr = new Bind_MGR();

var DataBase = require('../DataBase/DataBase.js');
var database = new DataBase();

var Integrate_Address_Info = require('../Integrate/Util/Address_Info.js');
var integrate_address_info = new Integrate_Address_Info();

var Integrate_Device_Info = require('../Integrate/Util/Device_Info.js');
var integrate_device_info = new Integrate_Device_Info();

const Device_MGR_DB_Name = 'device';

/*  schema
Device_Info = {
    user: <String>, //username 使用者名稱,
    device_ID: <String>, //裝置唯一ID
    device_Name: <String>, //裝置名稱
    network_Type: <String>, //裝置網路類型 ex: Wi-Fi / Bluetooth LE / Zigbee
    protocol_Type: <String>, //裝置協定類型 注意:僅Wi-Fi網路類型有效
                             // ex MQTT / MIIO
    device_Type: <String>, //裝置類型
    software_version: <String>, //裝置軟體版本 注意:僅Wi-Fi網路類型有效
    os_name: <String>, //裝置OS名稱 注意:僅Wi-Fi網路類型有效
    os_version: <String>, //裝置OS版本 注意:僅Wi-Fi網路類型有效
    manufacture: <String>, //裝置製造廠商 注意:僅Wi-Fi網路類型有效
    ble_device_info: <Object> //BLE裝置內容 注意:僅Bluetooth LE網路類型有效
    zigbee_device_info: <Object> //Zigbee裝置內容 注意:僅Zigbee網路類型有效
};
*/

var Device_MGR = function (){
    var self = this;

    self.Save_Device_Info = async function(device_Type, user, device_ID, dev_inf_json)
    {
        try{
            if(device_Type==null){
                return false;
            }

            if(dev_inf_json.network_Type==null){
                return false;
            }

            var success = false;

            success = await database.DataBase_Open(Device_MGR_DB_Name);
            if(success==false)
            {
                return false;
            }

            success = await database.Database_EnsureIndex(Device_MGR_DB_Name, device_Type, "device_ID", true);
            if(success==false)
            {
                await database.DataBase_Close(Device_MGR_DB_Name);
                return false;
            }

            var count = await database.Database_Count(Device_MGR_DB_Name, device_Type, {'device_ID': device_ID});
            if(count<0)
            {
                await database.DataBase_Close(Device_MGR_DB_Name);
                return false;
            }

            var exist = false;
            if(count>0){
                exist = true;
            }

            var devInf = {};

            var dev_name = dev_inf_json.device_Type;

            if(exist==true)
            {
                var old_dev_info = await database.Database_Find(Device_MGR_DB_Name, device_Type, {'device_ID': device_ID}, null);
                if(old_dev_info==null)
                {
                    await database.DataBase_Close(Device_MGR_DB_Name);
                    return false;
                }
                dev_name = old_dev_info[0].device_Name;
                if(dev_inf_json.device_Name!=null)
                {
                    if(dev_name!=dev_inf_json.device_Name)
                    {
                        dev_name = dev_inf_json.device_Name;
                    }
                }
            }
            else{
                if(dev_inf_json.device_Name!=null)
                {
                    dev_name = dev_inf_json.device_Name;
                }    
            }

            var device_protocol_type = "Any";

            switch(dev_inf_json.network_Type){
                case "TCP/IP":
                    if(dev_inf_json.protocol_Type==null){
                        await database.DataBase_Close(Device_MGR_DB_Name);
                        return false;
                    }
        
                    device_protocol_type = dev_inf_json.protocol_Type;

                    if(device_protocol_type=="MQTT")
                    {
                        devInf = {
                            "user": user,
                            "device_ID":device_ID,
                            "device_Name":dev_name,
                            "network_Type":dev_inf_json.network_Type,
                            "protocol_Type":dev_inf_json.protocol_Type,
                            "device_Type":dev_inf_json.device_Type,
                            "software_version":dev_inf_json.software_version,
                            "os_name":dev_inf_json.os_name,
                            "os_version":dev_inf_json.os_version,
                            "manufacture":dev_inf_json.manufacture
                        };
                        
                        if(dev_inf_json.modelID!=null){
                            devInf["model"] = dev_inf_json.modelID;
                        }
                        else{
                            devInf["model"] = "W-Link Generic " + dev_inf_json.device_Type
                        }

                        if(dev_inf_json.sensor_model!=null){
                            devInf["sensor_model"] = dev_inf_json.sensor_model;
                        }
                    }
                    else
                    {
                        devInf = integrate_device_info.Map_Device_Info(user, device_ID, dev_name, device_protocol_type, dev_inf_json);
                    }
                    break;
                case "Zigbee":
                    if(dev_inf_json.zigbee_device_info!=null)
                    {
                        devInf = {
                            "user": user,
                            "device_ID":device_ID,
                            "device_Name":dev_name,
                            "network_Type":dev_inf_json.network_Type,
                            "device_Type":dev_inf_json.device_Type,
                            "zigbee_device_info": dev_inf_json.zigbee_device_info
                        };
                    }
                    else{
                        devInf = {
                            "user": user,
                            "device_ID":device_ID,
                            "device_Name":dev_name,
                            "network_Type":dev_inf_json.network_Type,
                            "device_Type":dev_inf_json.device_Type
                        };
                    }

                    if(dev_inf_json.zigbee_device_info._modelID!=null){
                        devInf["model"] = dev_inf_json.zigbee_device_info._modelID;
                    }
                    else{
                        devInf["model"] = "W-Link Generic " + dev_inf_json.device_Type
                    }

                    break;
                case "Bluetooth LE":
                    if(dev_inf_json.ble_device_info!=null)
                    {
                        devInf = {
                            "user": user,
                            "device_ID":device_ID,
                            "device_Name":dev_name,
                            "network_Type":dev_inf_json.network_Type,
                            "device_Type":dev_inf_json.device_Type,
                            "ble_device_info": dev_inf_json.ble_device_info
                        };
                    }
                    else{
                        devInf = {
                            "user": user,
                            "device_ID":device_ID,
                            "device_Name":dev_name,
                            "network_Type":dev_inf_json.network_Type,
                            "device_Type":dev_inf_json.device_Type
                        };
                    }
                    break;
                default:
                    await database.DataBase_Close(Device_MGR_DB_Name);
                    return false;
            }

            if(dev_inf_json.sensor_model!=null){
                devInf["sensor_model"] = dev_inf_json.sensor_model;
            }
            
            if(count>1)
            {
                success = await database.Database_Remove(Device_MGR_DB_Name, device_Type, {'device_ID': device_ID}, true);
                if(success==false)
                {
                    await database.DataBase_Close(Device_MGR_DB_Name);
                    return false;
                }
                exist = false;
            }

            if(exist==true)
            {
                success = await database.Database_Update(Device_MGR_DB_Name, device_Type, {'device_ID': device_ID}, devInf, false);
                if(success==false)
                {
                    await database.DataBase_Close(Device_MGR_DB_Name);
                    return false;
                }
            }
            else{
                success = await database.Database_Insert(Device_MGR_DB_Name, device_Type, devInf);
                if(success==false)
                {
                    await database.DataBase_Close(Device_MGR_DB_Name);
                    return false;
                }
            }

            await database.DataBase_Close(Device_MGR_DB_Name);

            if(dev_inf_json.network_Type=="TCP/IP")
            {
                if(device_protocol_type!="MQTT")
                {
                    success = await integrate_address_info.Save_Integrate_Address_Info(device_ID, "Device", dev_inf_json.network_Type, device_protocol_type, dev_inf_json);
                }
                else
                {
                    success = await address_mgr.Save_Address_Info(device_ID, "Device", dev_inf_json.network_Type, device_protocol_type);
                }
            }
            else
            {
                success = await address_mgr.Save_Address_Info(device_ID, "Device", dev_inf_json.network_Type, device_protocol_type);
            }
            
            return success;
        }
        catch(e)
        {
            debug("[Device_MGR] Save_Device_Info() Error: " + e);
        }
    }

    self.Device_Change_Owner = async function(device_Type, old_user, device_ID, new_user)
    {
        try{
            if(device_Type==null){
                return false;
            }

            var success = false;

            success = await database.DataBase_Open(Device_MGR_DB_Name);
            if(success==false)
            {
                return false;
            }
            
            var dev_docs = await database.Database_Find(Device_MGR_DB_Name, device_Type, {'device_ID': device_ID}, null);
            if(dev_docs==null || dev_docs.length==0)
            {
                await database.DataBase_Close(Device_MGR_DB_Name);
                return false;
            }
            var dev_doc = dev_docs[0];
            
            if(dev_doc.user!=old_user && dev_doc.user!="everyone")
            {
                await database.DataBase_Close(Device_MGR_DB_Name);
                return false;
            }

            dev_doc.user = new_user;

            success = await database.Database_Update(Device_MGR_DB_Name, device_Type, {'device_ID': device_ID}, dev_doc, false);
            if(success==false)
            {
                await database.DataBase_Close(Device_MGR_DB_Name);
                return false;
            }
            
            await database.DataBase_Close(Device_MGR_DB_Name);

            if(success)
            {
                await spreadsheet_device_mgr.Device_Change_Owner(device_Type, old_user, device_ID, new_user);
            }

            return success;
        }
        catch(e)
        {
            debug("[Device_MGR] Device_Change_Owner() Error: " + e);
        }
    }

    self.Device_Change_Name = async function(device_Type, user, device_ID, new_Name)
    {
        try{
            if(device_Type==null){
                return false;
            }

            var success = false;

            success = await database.DataBase_Open(Device_MGR_DB_Name);
            if(success==false)
            {
                return false;
            }
            
            var dev_docs = await database.Database_Find(Device_MGR_DB_Name, device_Type, {'device_ID': device_ID}, null);
            if(dev_docs==null || dev_docs.length==0)
            {
                await database.DataBase_Close(Device_MGR_DB_Name);
                return false;
            }
            var dev_doc = dev_docs[0];
            
            if(dev_doc.user!=user && dev_doc.user!="everyone")
            {
                await database.DataBase_Close(Device_MGR_DB_Name);
                return;
            }

            dev_doc.device_Name = new_Name;

            success = await database.Database_Update(Device_MGR_DB_Name, device_Type, {'device_ID': device_ID}, dev_doc, false);
            if(success==false)
            {
                await database.DataBase_Close(Device_MGR_DB_Name);
                return false;
            }
            
            await database.DataBase_Close(Device_MGR_DB_Name);

            if(success)
            {
                await spreadsheet_device_mgr.Device_Change_Name(device_Type, user, device_ID, new_Name);
            }

            return success;
        }
        catch(e)
        {
            debug("[Device_MGR] Device_Change_Name() Error: " + e);
        }
    }

    self.Get_Device_List_All_User = async function(device_Type)
    {
        try{
            if(device_Type==null){
                return null;
            }

            var rsp_json = {};

            var success = false;

            success = await database.DataBase_Open(Device_MGR_DB_Name);
            if(success==false)
            {
                return null;
            }
            
            var dev_docs = await database.Database_Find(Device_MGR_DB_Name, device_Type, {}, null);
            if(dev_docs==null)
            {
                await database.DataBase_Close(Device_MGR_DB_Name);
                return null;
            }
            
            await database.DataBase_Close(Device_MGR_DB_Name);

            rsp_json.device_list = dev_docs;

            return rsp_json;
        }
        catch(e)
        {
            debug("[Device_MGR] Get_Device_List_All_User() Error: " + e);
        }
    }

    self.Get_Device_List_Specific_User = async function(device_Type, user)
    {
        try{
            if(device_Type==null){
                return null;
            }

            var rsp_json = {};

            var success = false;

            success = await database.DataBase_Open(Device_MGR_DB_Name);
            if(success==false)
            {
                return null;
            }
            
            var db_query = { $or: [ { 'user': user }, { 'user': 'everyone' } ] };
            var dev_docs = await database.Database_Find(Device_MGR_DB_Name, device_Type, db_query, null);
            if(dev_docs==null)
            {
                await database.DataBase_Close(Device_MGR_DB_Name);
                return null;
            }
            
            await database.DataBase_Close(Device_MGR_DB_Name);

            rsp_json.device_list = dev_docs;

            return rsp_json;
        }
        catch(e)
        {
            debug("[Device_MGR] Get_Device_List_Specific_User() Error: " + e);
        }
    }

    self.Read_Device_Inf = async function(device_Type, user, device_ID)
    {
        try{
            if(device_Type==null){
                return null;
            }

            var result = null;
            var success = false;

            success = await database.DataBase_Open(Device_MGR_DB_Name);
            if(success==false)
            {
                return null;
            }
            
            var db_query = null;
            if(user!=null && user !="everyone")
            {
                db_query = {'user': user, 'device_ID': device_ID };
            }
            else{
                db_query = {'device_ID': device_ID};
            }
            
            var dev_docs = await database.Database_Find(Device_MGR_DB_Name, device_Type, db_query, null);
            if(dev_docs==null || dev_docs.length==0)
            {
                await database.DataBase_Close(Device_MGR_DB_Name);
                return null;
            }
            
            await database.DataBase_Close(Device_MGR_DB_Name);

            result = dev_docs[0];

            return result;
        }
        catch(e)
        {
            debug("[Device_MGR] Read_Device_Inf() Error: " + e);
        }
    }
    
    self.Get_Device_Network_Type = async function(device_Type, device_ID)
    {
        try{
            if(device_Type==null){
                return null;
            }

            var result = null;
            var success = false;

            success = await database.DataBase_Open(Device_MGR_DB_Name);
            if(success==false)
            {
                return null;
            }
            
            var dev_docs = await database.Database_Find(Device_MGR_DB_Name, device_Type, {'device_ID': device_ID}, null);
            if(dev_docs==null || dev_docs.length==0)
            {
                await database.DataBase_Close(Device_MGR_DB_Name);
                return null;
            }
            
            await database.DataBase_Close(Device_MGR_DB_Name);

            result = dev_docs[0].network_Type;

            return result;
        }
        catch(e)
        {
            debug("[Device_MGR] Get_Device_Network_Type() Error: " + e);
        }
    }

    self.Get_Device_Model = async function(device_Type, device_ID)
    {
        try{
            if(device_Type==null){
                return null;
            }

            var result = null;
            var success = false;

            success = await database.DataBase_Open(Device_MGR_DB_Name);
            if(success==false)
            {
                return null;
            }
            
            var dev_docs = await database.Database_Find(Device_MGR_DB_Name, device_Type, {'device_ID': device_ID}, null);
            if(dev_docs==null || dev_docs.length==0)
            {
                await database.DataBase_Close(Device_MGR_DB_Name);
                return null;
            }
            
            await database.DataBase_Close(Device_MGR_DB_Name);

            result = dev_docs[0].model;

            return result;
        }
        catch(e)
        {
            debug("[Device_MGR] Get_Device_Model() Error: " + e);
        }
    }

    self.Get_Device_Owner = async function(device_Type, device_ID)
    {
        try{
            if(device_Type==null){
                return null;
            }

            var result = null;
            var success = false;

            success = await database.DataBase_Open(Device_MGR_DB_Name);
            if(success==false)
            {
                return null;
            }
            
            var dev_docs = await database.Database_Find(Device_MGR_DB_Name, device_Type, {'device_ID': device_ID}, null);
            if(dev_docs==null || dev_docs.length==0)
            {
                await database.DataBase_Close(Device_MGR_DB_Name);
                return null;
            }
            
            await database.DataBase_Close(Device_MGR_DB_Name);

            result = dev_docs[0].user;
            
            return result;
        }
        catch(e)
        {
            debug("[Device_MGR] Get_Device_Owner() Error: " + e);
        }
    }

    self.Remove_Device = async function(device_Type, user, device_ID)
    {
        try{
            if(device_Type==null){
                return false;
            }

            var success = false;

            success = await database.DataBase_Open(Device_MGR_DB_Name);
            if(success==false)
            {
                return false;
            }

            var db_query = { $or: [ { 'user': user, 'device_ID': device_ID }, { 'user': 'everyone', 'device_ID': device_ID } ] };
            
            var dev_docs = await database.Database_Find(Device_MGR_DB_Name, device_Type, db_query, null);
            if(dev_docs==null || dev_docs.length==0)
            {
                await database.DataBase_Close(Device_MGR_DB_Name);
                return null;
            }
            
            success = await database.Database_Remove(Device_MGR_DB_Name, device_Type, db_query, true);
            if(success==false)
            {
                await database.DataBase_Close(Device_MGR_DB_Name);
                return false;
            }
            
            await database.DataBase_Close(Device_MGR_DB_Name);
            
            success = await address_mgr.Delete_Address_Info(device_ID);
            if(success==false)
            {
                return false;
            }

            var network_Type = dev_docs[0].network_Type;
            if(network_Type=="Zigbee")
            {
                var resolv_entinity = zigbee.Zigbee_ResolveEntity(dev_docs[0].zigbee_device_info._ieeeAddr);
                resolv_entinity.device.removeFromNetwork();
            }

            success = await bind_mgr.Remove_Bind_Action_Info(device_Type, user, device_ID);

            if(success)
            {
                await spreadsheet_device_mgr.Remove_Device(device_Type, user, device_ID);
            }

            return success;
        }
        catch(e)
        {
            debug("[Device_MGR] Remove_Device() Error: " + e);
        }
    }

    self.Remove_All_Device = async function(device_Type, user)
    {
        try{
            if(device_Type==null){
                return false;
            }

            var success = false;

            success = await database.DataBase_Open(Device_MGR_DB_Name);
            if(success==false)
            {
                return false;
            }

            var db_query = { $or: [ { 'user': user}, { 'user': 'everyone'} ] };

            var all_dev_docs = await database.Database_Find(Device_MGR_DB_Name, device_Type, db_query, null);
            if(all_dev_docs==null)
            {
                await database.DataBase_Close(Device_MGR_DB_Name);
                return null;
            }
            
            success = await database.Database_Remove(Device_MGR_DB_Name, device_Type, db_query, false);
            if(success==false)
            {
                await database.DataBase_Close(Device_MGR_DB_Name);
                return false;
            }
            
            await database.DataBase_Close(Device_MGR_DB_Name);

            for(var i = 0; i<all_dev_docs.length; i++)
            {
                await address_mgr.Delete_Address_Info(dev_doc[i].device_ID);

                await bind_mgr.Remove_Bind_Action_Info(device_Type, user, dev_doc[i].device_ID);

                var network_Type = dev_doc[i].network_Type;
                if(network_Type=="Zigbee")
                {
                    var resolv_entinity = zigbee.Zigbee_ResolveEntity(dev_doc[i].zigbee_device_info.ieeeAddr);
                    resolv_entinity.device.removeFromNetwork();
                }
            }

            if(success)
            {
                await spreadsheet_device_mgr.Remove_All_Device(device_Type, user);
            }

            return success;
        }
        catch(e)
        {
            debug("[Device_MGR] Remove_All_Device() Error: " + e);
        }
    }
}
module.exports = Device_MGR;

var debug = require('debug')(require('path').basename(__filename));

const config = require('config');

var util = require("util");

var DataBase = require('../DataBase/DataBase.js');
var database = new DataBase();

var Integrate_Address_Info = require('../Integrate/Util/Address_Info.js');
var integrate_address_info = new Integrate_Address_Info();

const Address_MGR_DB_Name = 'address';
const Address_MGR_Collection_Name = 'All_Address_List';

/* shema
var address_info = {
    target_type: "Device"/"Group", // Device or Group/Broadcast Address
    target_network: <network>, // Network Type ex: WiFi/Zigbee/BLE
    target_protocol: <protocol>, // Protocol type ex: MQTT/MIIO/HTTP
}
*/

function Check_Is_Broadcast_Address(address)
{
    if(address=="Broadcast")
    {
        return true;
    }
    return false;
}

var Address_MGR = function (){
    var self = this;

    self.Get_Address_Destination_Type = async function(address)
    {
        try{
            if(Check_Is_Broadcast_Address(address)==true)
            {
                return "Broadcast";
            }

            var result = null;

            var success = await database.DataBase_Open(Address_MGR_DB_Name);
            if(success==false)
            {
                return null;
            }

            var addr_doc = await database.Database_Find(Address_MGR_DB_Name, Address_MGR_Collection_Name, {'address':address}, null);
            if(addr_doc==null || addr_doc.length==0)
            {
                await database.DataBase_Close(Address_MGR_DB_Name);
                return null;
            }
            
            await database.DataBase_Close(Address_MGR_DB_Name);

            result = addr_doc[0].target_type;

            return result;
        }
        catch(e)
        {
            debug("[Address_MGR] Get_Address_Destination_Type() Error: " + e);
        }
    };

    self.Get_Address_Target_Network = async function(address)
    {
        try{
            if(Check_Is_Broadcast_Address(address)==true)
            {
                return "Any";
            }

            var result = null;

            var success = await database.DataBase_Open(Address_MGR_DB_Name);
            if(success==false)
            {
                return null;
            }

            var addr_doc = await database.Database_Find(Address_MGR_DB_Name, Address_MGR_Collection_Name, {'address':address}, null);
            if(addr_doc==null || addr_doc.length==0)
            {
                await database.DataBase_Close(Address_MGR_DB_Name);
                return null;
            }
            
            await database.DataBase_Close(Address_MGR_DB_Name);

            result = addr_doc[0].target_network;

            return result;
        }
        catch(e)
        {
            debug("[Address_MGR] Get_Address_Target_Network() Error: " + e);
        }
    };

    self.Get_Address_Target_Protocol = async function(address)
    {
        try{
            if(Check_Is_Broadcast_Address(address)==true)
            {
                return "Any";
            }

            var result = null;

            var success = await database.DataBase_Open(Address_MGR_DB_Name);
            if(success==false)
            {
                return null;
            }

            var addr_doc = await database.Database_Find(Address_MGR_DB_Name, Address_MGR_Collection_Name, {'address':address}, null);
            if(addr_doc==null || addr_doc.length==0)
            {
                await database.DataBase_Close(Address_MGR_DB_Name);
                return null;
            }
            
            await database.DataBase_Close(Address_MGR_DB_Name);

            result = addr_doc[0].target_protocol;

            return result;
        }
        catch(e)
        {
            debug("[Address_MGR] Get_Address_Target_Protocol() Error: " + e);
        }
    };

    self.Read_Address_Info = async function(address)
    {
        try{
            if(Check_Is_Broadcast_Address(address)==true)
            {
                return {
                    target_type: "Broadcast",
                    target_network: "Any",
                    target_protocol: "Any"
                }
            }

            var success = await database.DataBase_Open(Address_MGR_DB_Name);
            if(success==false)
            {
                return null;
            }

            var addr_doc = await database.Database_Find(Address_MGR_DB_Name, Address_MGR_Collection_Name, {'address':address}, null);
            if(addr_doc==null || addr_doc.length==0)
            {
                await database.DataBase_Close(Address_MGR_DB_Name);
                return null;
            }
            
            await database.DataBase_Close(Address_MGR_DB_Name);

            let result = integrate_address_info.Fetch_Integrate_Ext_Address_Info(addr_doc);

            result["target_type"] = addr_doc[0].target_type;
            result["target_network"] = addr_doc[0].target_network;
            result["target_protocol"] = addr_doc[0].target_protocol;

            return result;
        }
        catch(e)
        {
            debug("[Address_MGR] Read_Address_Info() Error: " + e);
        }
    };

    self.Save_Address_Info = async function(address, target_type, target_network, target_protocol)
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
            debug("[Address_MGR] Save_Address_Info() Error: " + e);
        }
    };

    self.Delete_Address_Info = async function(address)
    {
        try{
            if(address==null)
            {
                return false;
            }

            if(Check_Is_Broadcast_Address(address)==true)
            {
                return false;
            }

            var success = await database.DataBase_Open(Address_MGR_DB_Name);
            if(success==false)
            {
                return false;
            }

            success = await database.Database_Remove(Address_MGR_DB_Name, Address_MGR_Collection_Name, {'address': address}, true);
            if(success==false)
            {
                await database.DataBase_Close(Address_MGR_DB_Name);
                return false;
            }

            await database.DataBase_Close(Address_MGR_DB_Name);

            return true;
        }
        catch(e)
        {
            debug("[Address_MGR] Delete_Address_Info() Error: " + e);
        }
    }

    self.Delete_All_Device_Type_Address_Info = async function()
    {
        try{
            var success = await database.DataBase_Open(Address_MGR_DB_Name);
            if(success==false)
            {
                return false;
            }

            var query = { $or: [ { 'target_type': "Device"}, { 'target_type': 'device'} ] };
            success = await database.Database_Remove(Address_MGR_DB_Name, Address_MGR_Collection_Name, query, true);
            if(success==false)
            {
                await database.DataBase_Close(Address_MGR_DB_Name);
                return false;
            }

            await database.DataBase_Close(Address_MGR_DB_Name);

            return true;
        }
        catch(e)
        {
            debug("[Address_MGR] Delete_All_Device_Type_Address_Info() Error: " + e);
        }
    }

    self.Delete_All_Group_Type_Address_Info = async function()
    {
        try{
            var success = await database.DataBase_Open(Address_MGR_DB_Name);
            if(success==false)
            {
                return false;
            }

            var query = { $or: [ { 'target_type': "Group"}, { 'target_type': 'group'} ] };
            success = await database.Database_Remove(Address_MGR_DB_Name, Address_MGR_Collection_Name, query, true);
            if(success==false)
            {
                await database.DataBase_Close(Address_MGR_DB_Name);
                return false;
            }

            await database.DataBase_Close(Address_MGR_DB_Name);

            return true;
        }
        catch(e)
        {
            debug("[Address_MGR] Delete_All_Group_Type_Address_Info() Error: " + e);
        }
    }
};

module.exports = Address_MGR;

var debug = require('debug')(require('path').basename(__filename));

const config = require('config');

var uuid = require('uuid');

var DataBase = require('../DataBase/DataBase.js');
var database = new DataBase();

var Bind_MGR = require('./Bind_MGR.js');
var bind_mgr = new Bind_MGR();

var Address_MGR = require('./Address_MGR.js');
var address_mgr = new Address_MGR();

var MQTT_Group = require('../MQTT/Group/Group_API_MQTT.js');
var mqtt_group = new MQTT_Group();

var Zigbee_Group = require('../Zigbee/Zigbee_Group.js');
var zigbee_group = new Zigbee_Group();

var Hue_Bridge_Group = require('../Hue_Bridge/Hue_Bridge_Group_API.js');
var hue_bridge_group = new Hue_Bridge_Group();

const Group_MGR_DB_Name = 'group';

/* schema
Group_Info = {
    user: <String>, //username 使用者名稱,
    group_ID: <String>, //群組唯一ID
    group_Name: <String>, //群組名稱
    Mapped_Zigbee_Group_ID: <String>, //Zigbee內網群組唯一ID
    MQTT_Device_List:[
        <String>, // MQTT裝置ID
    ],
    BLE_Device_List:[
        <String>, // BLE裝置ID
    ],
    Zigbee_Device_List:[
        <String>, // Zigbee裝置ID
    ],
    Hue_Bridge_Group_List:[
        Bridge_Address_ID: <String>, //Hue Bridge唯一ID
        Mapped_Group_ID: <String>, //Hue Bridge內網群組唯一ID
        Device_List: [
            <String>, // Hue Bridge子裝置ID
        ]
    ],
    Twinkly_Device_List:[
        Twinkly_Device_ID: <String>, // Twinkly唯一ID
        Twinkly_IP_Address: <String>, // Twinkly IP位址
    ]
};
*/

var Group_MGR = function (){
    var self = this;
    
    self.Create_New_Group = async function(device_Type, user, group_Name, device_ID_list, group_Ext_Info)
    {
        try{
            if(device_Type==null){
                return null;
            }

            if(group_Name==null || group_Name==''){
                group_Name = "New Group";
            }
            
            var group_UUID = uuid.v1();

            var group_ID = group_UUID.split('-').join('');

            var new_group_doc = {
                user: user,
                group_ID: group_ID,
                group_Name: group_Name,
                Mapped_Zigbee_Group_ID: -1,
                MQTT_Device_List:[],
                BLE_Device_List:[],
                Zigbee_Device_List:[],
                Hue_Bridge_Group_List:[],
                Twinkly_Device_List:[],
                group_Ext_Info: group_Ext_Info
            }

            var new_zigbee_group_ID = await zigbee_group.Zigbee_CreateGroup(group_ID);
            if(new_zigbee_group_ID<0)
            {
                return null;
            }
            new_group_doc.Mapped_Zigbee_Group_ID = new_zigbee_group_ID;

            var success = await database.DataBase_Open(Group_MGR_DB_Name);
            if(success==false)
            {
                return null;
            }

            success = await database.Database_EnsureIndex(Group_MGR_DB_Name, device_Type, "group_ID", true);
            if(success==false)
            {
                database.DataBase_Close(Group_MGR_DB_Name);
                return null;
            }

            var count = await database.Database_Count(Group_MGR_DB_Name, device_Type, {'group_ID': group_ID});

            var exist = false;
            if(count>0){
                exist = true;
            }

            database.DataBase_Close(Group_MGR_DB_Name);

            if(exist==true)
            {
                return null;
            }

            if(device_ID_list!=null && device_ID_list.length>0)
            {
                for(var i = 0; i<device_ID_list.length; i++)
                {
                    var device_ID = device_ID_list[i];
    
                    var device_address_info = await address_mgr.Read_Address_Info(device_ID);
                    if(device_address_info.target_type!="Device" && device_address_info.target_type!="device")
                    {
                        continue;
                    }

                    if(device_address_info.target_network=="TCP/IP")
                    {
                        if(device_address_info.target_protocol=="MQTT")
                        {
                            new_group_doc.MQTT_Device_List.push(device_ID);
                        }
                        
                        if(device_address_info.target_protocol=="Hue API Tunnel")
                        {
                            if(device_address_info.host_hue_bridge_ID==null)
                            {
                                continue;
                            }

                            var bridge_addr_found = new_group_doc.Hue_Bridge_Group_List.find(hue_bridge_group_item => hue_bridge_group_item.Bridge_Address_ID==device_address_info.host_hue_bridge_ID);
                            if(bridge_addr_found==null)
                            {
                                new_group_doc.Hue_Bridge_Group_List.push({
                                    Bridge_Address_ID: device_address_info.host_hue_bridge_ID,
                                    Mapped_Group_ID: -1,
                                    Device_List: [device_ID_list[i]]
                                });
                            }
                            else{
                                var hue_bridge_group_index = new_group_doc.Hue_Bridge_Group_List.indexOf(bridge_addr_found);
                                if(hue_bridge_group_index>=0)
                                {
                                    new_group_doc.Hue_Bridge_Group_List[hue_bridge_group_index].Device_List.push(device_ID_list[i]);
                                }
                            }
                        }
                        else if(device_address_info.target_protocol=="Twinkly API Tunnel")
                        {
                            new_group_doc.Twinkly_Device_List.push({
                                Twinkly_Device_ID: device_ID_list[i],
                                Twinkly_IP_Address: device_address_info.ip_address
                            });
                        }
                    }
                    else if(device_address_info.target_network=="Bluetooth LE")
                    {
                        new_group_doc.BLE_Device_List.push(device_ID);
                    }
                    else if(device_address_info.target_network=="Zigbee")
                    {
                        success = await zigbee_group.Zigbee_AddDeviceToGroup(new_group_doc.Mapped_Zigbee_Group_ID, device_ID);
                        debug("[Group_MGR] Zigbee_AddDeviceToGroup() = " + success);
                        if(success==false)
                        {
                            continue;
                        }
                        new_group_doc.Zigbee_Device_List.push(device_ID);
                    }
                }
            }
            
            var Hue_Bridge_ID_List = [];
            for(var i = 0; i<new_group_doc.Hue_Bridge_Group_List.length; i++)
            {
                var Hue_Bridge_Group_Info = new_group_doc.Hue_Bridge_Group_List[i];
                var created_group_ID = await hue_bridge_group.Create_Hue_Bridge_Group(user, Hue_Bridge_Group_Info[i].Bridge_Address_ID, group_Name, Hue_Bridge_Group_Info[i].Device_List);
                if(created_group_ID==null)
                {
                    return false;
                }
                
                Hue_Bridge_ID_List.push(Hue_Bridge_Group_Info[i].Bridge_Address_ID);
                new_group_doc.Hue_Bridge_Group_List[i].Mapped_Group_ID = created_group_ID;
            }

            var success = await database.DataBase_Open(Group_MGR_DB_Name);
            if(success==false)
            {
                return null;
            }

            success = await database.Database_Insert(Group_MGR_DB_Name, device_Type, new_group_doc);
            if(success==false)
            {
                database.DataBase_Close(Group_MGR_DB_Name);
                return null;
            }

            database.DataBase_Close(Group_MGR_DB_Name);

            success = await address_mgr.Save_Address_Info(group_ID, "Group", "Any", "Any");

            return group_ID;
        }
        catch(e)
        {
            debug("[Group_MGR] Create_New_Group() Error: " + e);
        }
    }

    self.Group_Change_Name = async function(device_Type, user, group_ID, new_Name)
    {
        try{
            if(device_Type==null){
                return false;
            }

            if(new_Name==null || new_Name=="")
            {
                return false;
            }

            var success = await database.DataBase_Open(Group_MGR_DB_Name);
            if(success==false)
            {
                return false;
            }

            const db_query = { $or: [ { 'user': user, 'group_ID':group_ID }, { 'user': 'everyone', 'group_ID':group_ID } ] };

            var gp_doc = await database.Database_Find(Group_MGR_DB_Name, device_Type, db_query, null);
            if(gp_doc==null || gp_doc.length==0)
            {
                database.DataBase_Close(Group_MGR_DB_Name);
                return false;
            }

            var new_gp_inf = gp_doc[0];
            new_gp_inf.group_Name = new_Name;

            success = await database.Database_Update(Group_MGR_DB_Name, device_Type, db_query, new_gp_inf, false);
            if(success==false)
            {
                database.DataBase_Close(Group_MGR_DB_Name);
                return false;
            }

            database.DataBase_Close(Group_MGR_DB_Name);
            
            for(var i = 0; i<new_gp_inf.Hue_Bridge_Group_List.length; i++)
            {
                var Hue_Bridge_Group_Info = new_gp_inf.Hue_Bridge_Group_List[i];
                await hue_bridge_group.Rename_Hue_Bridge_Group(user, Hue_Bridge_Group_Info[i].Bridge_Address_ID, Hue_Bridge_Group_Info[i].Mapped_Group_ID, new_Name);
            }

            return true;
        }
        catch(e)
        {
            debug("[Group_MGR] Group_Change_Name() Error: " + e);
        }
    }

    self.Remove_Group = async function(device_Type, user, group_ID)
    {
        try{
            if(device_Type==null){
                return false;
            }

            var success = await database.DataBase_Open(Group_MGR_DB_Name);
            if(success==false)
            {
                return false;
            }

            const db_query = { $or: [ { 'user': user, 'group_ID': group_ID }, { 'user': 'everyone', 'group_ID': group_ID } ] };

            var gp_doc = await database.Database_Find(Group_MGR_DB_Name, device_Type, db_query, null);
            if(gp_doc==null || gp_doc.length==0)
            {
                database.DataBase_Close(Group_MGR_DB_Name);
                return false;
            }
            var delete_gp_doc = gp_doc[0];

            success = await database.Database_Remove(Group_MGR_DB_Name, device_Type, db_query, true);
            if(success==false)
            {
                database.DataBase_Close(Group_MGR_DB_Name);
                return false;
            }

            database.DataBase_Close(Group_MGR_DB_Name);

            success = await zigbee_group.Zigbee_DeleteGroup(delete_gp_doc.Mapped_Zigbee_Group_ID);
            if(success==false)
            {
                return false;
            }

            for(var i = 0; i<delete_gp_doc.Hue_Bridge_Group_List.length; i++)
            {
                var Hue_Bridge_Group_Info = delete_gp_doc.Hue_Bridge_Group_List[i];
                await hue_bridge_group.Remove_One_Group(user, Hue_Bridge_Group_Info[i].Bridge_Address_ID, Hue_Bridge_Group_Info[i].Mapped_Group_ID);
            }

            success = await address_mgr.Delete_Address_Info(group_ID);
            if(success==false)
            {
                return false;
            }

            success = await bind_mgr.Remove_Bind_Action_Info(device_Type, user, group_ID);

            return success;
        }
        catch(e)
        {
            debug("[Group_MGR] Remove_Group() Error: " + e);
        }
    }

    self.Get_Group_List = async function(device_Type, user)
    {
        try{
            if(device_Type==null){
                return null;
            }

            var rsp_json = {};

            var success = await database.DataBase_Open(Group_MGR_DB_Name);
            if(success==false)
            {
                return null;
            }

            const db_query = { $or: [ { 'user': user }, { 'user': 'everyone' } ] };

            var gp_docs = await database.Database_Find(Group_MGR_DB_Name, device_Type, db_query, null);
            if(gp_docs==null || gp_docs.length==0)
            {
                database.DataBase_Close(Group_MGR_DB_Name);
                return null;
            }

            database.DataBase_Close(Group_MGR_DB_Name);

            rsp_json.group_list = gp_docs;

            return rsp_json;
        }
        catch(e)
        {
            debug("[Group_MGR] Get_Group_List() Error: " + e);
        }
    }

    self.Get_Group_Info = async function(device_Type, user, group_ID)
    {
        try{
            if(device_Type==null){
                return null;
            }

            var success = await database.DataBase_Open(Group_MGR_DB_Name);
            if(success==false)
            {
                return null;
            }

            var db_query = null;
            if(user!=null)
            {
                db_query = { $or: [ { 'user': user, 'group_ID': group_ID }, { 'user': 'everyone', 'group_ID': group_ID } ] };
            }
            else{
                db_query = {'group_ID': group_ID};
            }
            
            var gp_doc = await database.Database_Find(Group_MGR_DB_Name, device_Type, db_query, null);
            if(gp_doc==null || gp_doc.length==0)
            {
                database.DataBase_Close(Group_MGR_DB_Name);
                return null;
            }

            database.DataBase_Close(Group_MGR_DB_Name);

            return gp_doc[0];
        }
        catch(e)
        {
            debug("[Group_MGR] Get_Group_Info() Error: " + e);
        }
    }
    
    self.Get_Group_Ext_Info = async function(device_Type, user, group_ID)
    {
        try{
            if(device_Type==null){
                return null;
            }

            var success = await database.DataBase_Open(Group_MGR_DB_Name);
            if(success==false)
            {
                return null;
            }

            const db_query = { $or: [ { 'user': user, 'group_ID': group_ID }, { 'user': 'everyone', 'group_ID': group_ID } ] };

            var gp_doc = await database.Database_Find(Group_MGR_DB_Name, device_Type, db_query, null);
            if(gp_doc==null || gp_doc.length==0)
            {
                database.DataBase_Close(Group_MGR_DB_Name);
                return null;
            }

            database.DataBase_Close(Group_MGR_DB_Name);

            return gp_doc[0].group_Ext_Info;
        }
        catch(e)
        {
            debug("[Group_MGR] Get_Group_Ext_Info() Error: " + e);
        }
    }

    self.Update_Group_Ext_Info = async function(device_Type, user, group_ID, new_group_Ext_Info)
    {
        try{
            if(device_Type==null){
                return false;
            }

            var success = await database.DataBase_Open(Group_MGR_DB_Name);
            if(success==false)
            {
                return false;
            }

            const db_query = { $or: [ { 'user': user, 'group_ID': group_ID }, { 'user': 'everyone', 'group_ID': group_ID } ] };

            var gp_doc = await database.Database_Find(Group_MGR_DB_Name, device_Type, db_query, null);
            if(gp_doc==null || gp_doc.length==0)
            {
                database.DataBase_Close(Group_MGR_DB_Name);
                return false;
            }

            gp_doc[0].group_Ext_Info = new_group_Ext_Info;

            success = await database.Database_Update(Group_MGR_DB_Name, device_Type, db_query, gp_doc[0], false);
            if(success==false)
            {
                database.DataBase_Close(Group_MGR_DB_Name);
                return false;
            }

            database.DataBase_Close(Group_MGR_DB_Name);

            return true;
        }
        catch(e)
        {
            debug("[Group_MGR] Update_Group_Ext_Info() Error: " + e);
        }
    }

    self.Get_Group_Device_List = async function(device_Type, user, group_ID)
    {
        try{
            if(device_Type==null){
                return null;
            }

            var device_lst = [];
            var rsp_json = {};

            var success = await database.DataBase_Open(Group_MGR_DB_Name);
            if(success==false)
            {
                return null;
            }

            const db_query = { $or: [ { 'user': user, 'group_ID': group_ID }, { 'user': 'everyone', 'group_ID': group_ID } ] };

            var gp_docs = await database.Database_Find(Group_MGR_DB_Name, device_Type, db_query, null);
            if(gp_docs==null || gp_docs.length==0)
            {
                database.DataBase_Close(Group_MGR_DB_Name);
                return null;
            }

            database.DataBase_Close(Group_MGR_DB_Name);

            if(gp_docs[0].MQTT_Device_List!=null)
            {
                for(var i = 0; i<gp_docs[0].MQTT_Device_List.length; i++)
                {
                    device_lst.push(gp_docs[0].MQTT_Device_List[i]);
                }
            }
            if(gp_docs[0].BLE_Device_List!=null)
            {
                for(var i = 0; i<gp_docs[0].BLE_Device_List.length; i++)
                {
                    device_lst.push(gp_docs[0].BLE_Device_List[i]);
                }
            }
            if(gp_docs[0].Zigbee_Device_List!=null)
            {
                for(var i = 0; i<gp_docs[0].Zigbee_Device_List.length; i++)
                {
                    device_lst.push(gp_docs[0].Zigbee_Device_List[i]);
                }
            }
            if(gp_docs[0].Hue_Bridge_Group_List!=null)
            {
                for(var i = 0; i<gp_docs[0].Hue_Bridge_Group_List.length; i++)
                {
                    var hue_bridge_group_device_list = gp_docs[0].Hue_Bridge_Group_List[i].Device_List;
                    for(var j = 0; j<hue_bridge_group_device_list.length; j++)
                    {
                        device_lst.push(hue_bridge_group_device_list[j]);
                    }
                }
            }
            if(gp_docs[0].Twinkly_Device_List!=null)
            {
                for(var i = 0; i<gp_docs[0].Twinkly_Device_List.length; i++)
                {
                    device_lst.push(gp_docs[0].Twinkly_Device_List[i].Twinkly_Device_ID);
                }
            }

            database.DataBase_Close(Group_MGR_DB_Name);
            
            rsp_json.group_ID = group_ID;
            rsp_json.group_device_list = device_lst;

            return rsp_json;
        }
        catch(e)
        {
            debug("[Group_MGR] Get_Group_Device_List() Error: " + e);
        }
    }

    self.Edit_Group_Device_List = async function(device_Type, user, group_ID, new_device_list)
    {
        try{
            if(device_Type==null){
                return false;
            }

            var success = await database.DataBase_Open(Group_MGR_DB_Name);
            if(success==false)
            {
                return false;
            }

            const db_query = { $or: [ { 'user': user, 'group_ID': group_ID }, { 'user': 'everyone', 'group_ID': group_ID } ] };

            var gp_docs = await database.Database_Find(Group_MGR_DB_Name, device_Type, db_query, null);
            if(gp_docs==null || gp_docs.length==0)
            {
                database.DataBase_Close(Group_MGR_DB_Name);
                return false;
            }

            if(gp_docs[0].Mapped_Zigbee_Group_ID<0)
            {
                var new_zigbee_group_ID = await zigbee_group.Zigbee_CreateGroup(group_ID);
                if(new_zigbee_group_ID<0)
                {
                    database.DataBase_Close(Group_MGR_DB_Name);
                    return false;
                }
                gp_docs[0].Mapped_Zigbee_Group_ID = new_zigbee_group_ID;

                success = await database.Database_Update(Group_MGR_DB_Name, device_Type, db_query, group_Doc, false);
                if(success==false)
                {
                    database.DataBase_Close(Group_MGR_DB_Name);
                    return false;
                }
            }

            database.DataBase_Close(Group_MGR_DB_Name);

            var Old_MQTT_Device_List = gp_docs[0].MQTT_Device_List;
            var Old_BLE_Device_List = gp_docs[0].BLE_Device_List;
            var Old_Zigbee_Device_List = gp_docs[0].Zigbee_Device_List;
            var New_MQTT_Device_List = [];
            var New_BLE_Device_List = [];
            var New_Zigbee_Device_List = [];

            var Old_Hue_Bridge_List = [];
            for(var i = 0; i<gp_docs[0].Hue_Bridge_Group_List.length; i++)
            {
                Old_Hue_Bridge_List.push(gp_docs[0].Hue_Bridge_Group_List[i].Bridge_Address_ID);
            }
            var New_Hue_Bridge_List = [];
            var New_Hue_Bridge_Group_Device_List = [[]];

            var Old_Twinkly_Device_List = [];
            for(var i = 0; i<gp_docs[0].Twinkly_Device_List.length; i++)
            {
                Old_Twinkly_Device_List.push(gp_docs[0].Twinkly_Device_List[i].Twinkly_Device_ID);
            }
            var New_Twinkly_Device_List = [];

            for(var i = 0; i<new_device_list.length; i++)
            {
                var device_address_info = await address_mgr.Read_Address_Info(new_device_list[i]);
                if(device_address_info.target_type!="Device" && device_address_info.target_type!="device")
                {
                    continue;
                }

                if(device_address_info.target_network=="TCP/IP")
                {
                    if(device_address_info.target_protocol=="MQTT")
                    {
                        New_MQTT_Device_List.push(new_device_list[i]);
                    }
                    if(device_address_info.target_protocol=="Hue API Tunnel")
                    {
                        if(device_address_info.host_hue_bridge_ID==null)
                        {
                            continue;
                        }

                        var bridge_addr_found = New_Hue_Bridge_List.find(hue_bridge_ID => hue_bridge_ID==device_address_info.host_hue_bridge_ID);
                        if(bridge_addr_found==null)
                        {
                            New_Hue_Bridge_List.push(device_address_info.host_hue_bridge_ID);
                        }
                        New_Hue_Bridge_Group_Device_List[device_address_info.host_hue_bridge_ID].push(new_device_list[i]);
                    }
                    else if(device_address_info.target_protocol=="Twinkly API Tunnel")
                    {
                        if(device_address_info.ip_address==null)
                        {
                            continue;
                        }
                        New_Twinkly_Device_List.push(new_device_list[i]);
                    }
                }
                else if(device_address_info.target_network=="Bluetooth LE")
                {
                    New_BLE_Device_List.push(new_device_list[i]);
                }
                else if(device_address_info.target_network=="Zigbee")
                {
                    New_Zigbee_Device_List.push(new_device_list[i]);
                }
            }
            
            var delete_MQTT_Device_List = Old_MQTT_Device_List.filter(mqtt_device_ID => !New_MQTT_Device_List.includes(mqtt_device_ID));
            var add_MQTT_Device_List = New_MQTT_Device_List.filter(mqtt_device_ID => !Old_MQTT_Device_List.includes(mqtt_device_ID));
            
            var delete_BLE_Device_List = Old_BLE_Device_List.filter(ble_device_ID => !New_BLE_Device_List.includes(ble_device_ID));
            var add_BLE_Device_List = New_BLE_Device_List.filter(ble_device_ID => !Old_BLE_Device_List.includes(ble_device_ID));
            
            var delete_Zigbee_Device_List = Old_Zigbee_Device_List.filter(zigbee_device_ID => !New_Zigbee_Device_List.includes(zigbee_device_ID));
            var add_Zigbee_Device_List = New_Zigbee_Device_List.filter(zigbee_device_ID => !Old_Zigbee_Device_List.includes(zigbee_device_ID));
            
            var delete_Hue_Bridge_Device_List = Old_Hue_Bridge_List.filter(hue_bridge_device_ID => !New_Hue_Bridge_List.includes(hue_bridge_device_ID));
            var add_Hue_Bridge_Device_List = New_Hue_Bridge_List.filter(hue_bridge_device_ID => !Old_Hue_Bridge_List.includes(hue_bridge_device_ID));
            var exist_Hue_Bridge_Device_List = New_Hue_Bridge_List.filter(hue_bridge_device_ID => Old_Hue_Bridge_List.includes(hue_bridge_device_ID));
            
            var delete_Twinkly_Device_List = Old_Twinkly_Device_List.filter(twinkly_device_ID => !New_Twinkly_Device_List.includes(twinkly_device_ID));
            var add_Twinkly_Device_List = New_Twinkly_Device_List.filter(twinkly_device_ID => !Old_Twinkly_Device_List.includes(twinkly_device_ID));
            
            for(var i = 0; i<delete_MQTT_Device_List.length; i++)
            {
                await mqtt_group.Group_Remove_Device_From_Group(delete_MQTT_Device_List[i], group_ID);
            }
            for(var i = 0; i<add_MQTT_Device_List.length; i++)
            {
                await mqtt_group.Group_Add_Device_To_Group(add_MQTT_Device_List[i], group_ID);
            }
            /*
            for(var i = 0; i<delete_BLE_Device_List.length; i++)
            {
            }
            for(var i = 0; i<add_BLE_Device_List.length; i++)
            {
            }
            */
            for(var i = 0; i<delete_Zigbee_Device_List.length; i++)
            {
                success = await zigbee_group.Zigbee_RemoveDeviceFromGroup(gp_docs[0].Mapped_Zigbee_Group_ID, delete_Zigbee_Device_List[i]);
                if(success==false)
                {
                    return false;
                }
            }
            for(var i = 0; i<add_Zigbee_Device_List.length; i++)
            {
                success = await zigbee_group.Zigbee_AddDeviceToGroup(gp_docs[0].Mapped_Zigbee_Group_ID, add_Zigbee_Device_List[i]);
                if(success==false)
                {
                    return false;
                }
            }

            var New_Hue_Bridge_Group_List = [];
            for(var i = 0; i<delete_Hue_Bridge_Device_List.length; i++)
            {
                var bridge_addr_found = gp_docs[0].Hue_Bridge_Group_List.find(hue_bridge_group_item => hue_bridge_group_item.Bridge_Address_ID==delete_Hue_Bridge_Device_List[i]);
                if(bridge_addr_found!=null)
                {
                    hue_bridge_group.Remove_One_Group(user, bridge_addr_found.Bridge_Address_ID, bridge_addr_found.Mapped_Group_ID);
                }
            }
            for(var i = 0; i<exist_Hue_Bridge_Device_List.length; i++)
            {
                var bridge_addr_found = gp_docs[0].Hue_Bridge_Group_List.find(hue_bridge_group_item => hue_bridge_group_item.Bridge_Address_ID==delete_Hue_Bridge_Device_List[i]);
                if(bridge_addr_found!=null)
                {
                    var hue_bridge_ID = bridge_addr_found.Bridge_Address_ID;
                    var hue_mapped_group_ID = bridge_addr_found.Mapped_Group_ID;

                    success = await hue_bridge_group.Edit_Hue_Bridge_Group_Light_List(user, hue_bridge_ID, hue_mapped_group_ID, New_Hue_Bridge_Group_Device_List[hue_bridge_ID]);
                    if(success==false)
                    {
                        return false;
                    }

                    New_Hue_Bridge_Group_List.push({
                        Bridge_Address_ID: hue_bridge_ID,
                        Mapped_Group_ID: hue_mapped_group_ID,
                        Device_List: New_Hue_Bridge_Group_Device_List[hue_bridge_ID]
                    });
                }
            }
            for(var i = 0; i<add_Hue_Bridge_Device_List.length; i++)
            {
                var hue_bridge_ID = bridge_addr_found.Bridge_Address_ID;
                var created_hue_group_ID = await hue_bridge_group.Create_Hue_Bridge_Group(user, bridge_addr_found.Bridge_Address_ID, New_Hue_Bridge_Group_Device_List[hue_bridge_ID]);
                
                if(created_hue_group_ID==null)
                {
                    return false;
                }

                New_Hue_Bridge_Group_List.push({
                    Bridge_Address_ID: hue_bridge_ID,
                    Mapped_Group_ID: created_hue_group_ID,
                    Device_List: New_Hue_Bridge_Group_Device_List[hue_bridge_ID]
                });
            }
            /*
            for(var i = 0; i<delete_Twinkly_Device_List.length; i++)
            {
            }
            for(var i = 0; i<add_Twinkly_Device_List.length; i++)
            {
            }
            */
            var new_group_doc = gp_docs[0];
            new_group_doc.MQTT_Device_List = New_MQTT_Device_List;
            new_group_doc.BLE_Device_List = New_BLE_Device_List;
            new_group_doc.Zigbee_Device_List = New_Zigbee_Device_List;
            new_group_doc.New_Hue_Bridge_Group_List = New_Hue_Bridge_Group_List;
            new_group_doc.Twinkly_Device_List = New_Twinkly_Device_List;

            success = await database.DataBase_Open(Group_MGR_DB_Name);
            if(success==false)
            {
                return false;
            }

            success = await database.Database_Update(Group_MGR_DB_Name, device_Type, db_query, new_group_doc, false);
            if(success==false)
            {
                database.DataBase_Close(Group_MGR_DB_Name);
                return false;
            }

            database.DataBase_Close(Group_MGR_DB_Name);
            
            return true;
        }
        catch(e)
        {
            debug("[Group_MGR] Edit_Group_Device_List() Error: " + e);
        }
    }

    self.Add_Device_To_Group = async function(device_Type, user, group_ID, device_ID)
    {
        try{
            if(device_Type==null){
                return false;
            }

            var device_address_info = await address_mgr.Read_Address_Info(device_ID);
            if(device_address_info.target_type!="Device" && device_address_info.target_type!="device")
            {
                return false;
            }

            var success = await database.DataBase_Open(Group_MGR_DB_Name);
            if(success==false)
            {
                return false;
            }

            const db_query = { $or: [ { 'user': user, 'group_ID': group_ID }, { 'user': 'everyone', 'group_ID': group_ID } ] };

            var gp_doc = await database.Database_Find(Group_MGR_DB_Name, device_Type, db_query, null);
            if(gp_doc==null || gp_doc.length==0)
            {
                database.DataBase_Close(Group_MGR_DB_Name);
                return false;
            }
            
            if(gp_docs[0].Mapped_Zigbee_Group_ID<0)
            {
                var new_zigbee_group_ID = await zigbee_group.Zigbee_CreateGroup(group_ID);
                if(new_zigbee_group_ID<0)
                {
                    database.DataBase_Close(Group_MGR_DB_Name);
                    return false;
                }
                gp_docs[0].Mapped_Zigbee_Group_ID = new_zigbee_group_ID;

                success = await database.Database_Update(Group_MGR_DB_Name, device_Type, db_query, group_Doc, false);
                if(success==false)
                {
                    database.DataBase_Close(Group_MGR_DB_Name);
                    return false;
                }
            }

            database.DataBase_Close(Group_MGR_DB_Name);

            var group_Doc = gp_doc[0];

            var mqtt_found = group_Doc.MQTT_Device_List.find(mqtt_device_ID => mqtt_device_ID==device_ID);
            var ble_found = group_Doc.BLE_Device_List.find(ble_device_ID => ble_device_ID==device_ID);
            var zigbee_found = group_Doc.Zigbee_Device_List.find(zigbee_device_ID => zigbee_device_ID==device_ID);
            var twinkly_found = group_Doc.Twinkly_Device_List.find(twinkly_device_inf => twinkly_device_inf.Twinkly_Device_ID==device_ID);

            var hue_bridge_found = false;
            var bridge_addr_found = group_Doc.Hue_Bridge_Group_List.find(hue_bridge_ID => hue_bridge_ID==device_address_info.host_hue_bridge_ID);
            if(bridge_addr_found!=null)
            {
                hue_bridge_found = bridge_addr_found.Device_List.find(hue_bridge_device_ID => hue_bridge_device_ID==device_ID);
            }

            if(mqtt_found!=null || ble_found!=null || zigbee_found!=null || hue_bridge_found!=null || twinkly_found!=null)
            {
                return false;
            }

            if(device_address_info.target_network=="TCP/IP")
            {
                if(device_address_info.target_protocol=="MQTT")
                {
                    await mqtt_group.Group_Add_Device_To_Group(device_ID, group_ID);
                    group_Doc.MQTT_Device_List.push(device_ID);
                }
                else if(device_address_info.target_protocol=="Hue API Tunnel")
                {
                    var bridge_addr_found = group_Doc.Hue_Bridge_Group_List.find(hue_bridge_ID => hue_bridge_ID==device_address_info.host_hue_bridge_ID);
                    if(bridge_addr_found==null)
                    {
                        if(device_address_info.host_hue_bridge_ID==null)
                        {
                            return false;
                        }

                        var hue_bridge_ID = device_address_info.host_hue_bridge_ID;

                        var created_hue_group_ID = await hue_bridge_group.Create_Hue_Bridge_Group(user, hue_bridge_ID, group_Doc.group_Name, [device_ID]);
                        if(created_hue_group_ID==null)
                        {
                            return false;
                        }

                        group_Doc.Hue_Bridge_Group_List.push({
                            Bridge_Address_ID: device_address_info.host_hue_bridge_ID,
                            Mapped_Group_ID: created_hue_group_ID,
                            Device_List: [device_ID]
                        });
                    }
                    else
                    {
                        var hue_bridge_ID = bridge_addr_found.Bridge_Address_ID;

                        var index = group_Doc.Hue_Bridge_Group_List.indexOf(bridge_addr_found);
                        if(index<0)
                        {
                            return false;
                        }

                        var new_device_list = group_Doc.Hue_Bridge_Group_List[index].Device_List;
                        new_device_list.push(device_ID);

                        var success = await hue_bridge_group.Edit_Hue_Bridge_Group_Light_List(user, hue_bridge_ID, hue_mapped_group_ID, new_device_list);
                        if(success==false)
                        {
                            return false;
                        }

                        group_Doc.Hue_Bridge_Group_List[index].Device_List = new_device_list;
                    }
                }
                else if(device_address_info.target_protocol=="Twinkly API Tunnel")
                {
                    group_Doc.Twinkly_Device_List.push({
                        Twinkly_Device_ID: device_ID,
                        Twinkly_IP_Address: device_address_info.ip_address
                    });
                }
            }
            else if(device_address_info.target_network=="Bluetooth LE")
            {
                group_Doc.BLE_Device_List.push(device_ID);
            }
            else if(device_address_info.target_network=="Zigbee")
            {
                success = await zigbee_group.Zigbee_AddDeviceToGroup(group_Doc.Mapped_Zigbee_Group_ID, device_ID);
                if(success==false)
                {
                    return false;
                }
                group_Doc.Zigbee_Device_List.push(device_ID);
            }
            
            success = await database.DataBase_Open(Group_MGR_DB_Name);
            if(success==false)
            {
                return false;
            }

            success = await database.Database_Update(Group_MGR_DB_Name, device_Type, db_query, group_Doc, false);
            if(success==false)
            {
                database.DataBase_Close(Group_MGR_DB_Name);
                return false;
            }

            database.DataBase_Close(Group_MGR_DB_Name);
            
            return true;
        }
        catch(e)
        {
            debug("[Group_MGR] Add_Device_To_Group() Error: " + e);
        }
    }
    
    self.Remove_Device_From_Group = async function(device_Type, user, group_ID, device_ID)
    {
        try{
            if(device_Type==null){
                return false;
            }

            var device_address_info = await address_mgr.Read_Address_Info(device_ID);
            if(device_address_info.target_type!="Device" && device_address_info.target_type!="device")
            {
                return false;
            }

            var success = await database.DataBase_Open(Group_MGR_DB_Name);
            if(success==false)
            {
                return false;
            }

            const db_query = { $or: [ { 'user': user, 'group_ID': group_ID }, { 'user': 'everyone', 'group_ID': group_ID } ] };

            var gp_doc = await database.Database_Find(Group_MGR_DB_Name, device_Type, db_query, null);
            if(gp_doc==null || gp_doc.length==0)
            {
                database.DataBase_Close(Group_MGR_DB_Name);
                return false;
            }

            if(gp_docs[0].Mapped_Zigbee_Group_ID<0)
            {
                var new_zigbee_group_ID = await zigbee_group.Zigbee_CreateGroup(group_ID);
                if(new_zigbee_group_ID<0)
                {
                    database.DataBase_Close(Group_MGR_DB_Name);
                    return false;
                }
                gp_docs[0].Mapped_Zigbee_Group_ID = new_zigbee_group_ID;

                success = await database.Database_Update(Group_MGR_DB_Name, device_Type, db_query, group_Doc, false);
                if(success==false)
                {
                    database.DataBase_Close(Group_MGR_DB_Name);
                    return false;
                }
            }

            database.DataBase_Close(Group_MGR_DB_Name);

            var group_Doc = gp_doc[0];

            var mqtt_found = group_Doc.MQTT_Device_List.find(mqtt_device_ID => mqtt_device_ID==device_ID);
            var ble_found = group_Doc.BLE_Device_List.find(ble_device_ID => ble_device_ID==device_ID);
            var zigbee_found = group_Doc.Zigbee_Device_List.find(zigbee_device_ID => zigbee_device_ID==device_ID);
            var twinkly_found = group_Doc.Zigbee_Device_List.find(twinkly_device_inf => twinkly_device_inf.Twinkly_Device_ID==device_ID);

            var hue_bridge_found = false;
            var bridge_addr_found = group_Doc.Hue_Bridge_Group_List.find(hue_bridge_ID => hue_bridge_ID==device_address_info.host_hue_bridge_ID);
            if(bridge_addr_found!=null)
            {
                hue_bridge_found = bridge_addr_found.Device_List.find(hue_bridge_device_ID => hue_bridge_device_ID==device_ID);
            }

            if(mqtt_found!=null || ble_found!=null || zigbee_found!=null || hue_bridge_found!=null || twinkly_found!=null)
            {
                return false;
            }

            if(device_address_info.target_network=="TCP/IP")
            {
                if(device_address_info.target_protocol=="MQTT")
                {
                    await mqtt_group.Group_Add_Device_To_Group(mqtt_device_ID[index], group_ID);
                    group_Doc.MQTT_Device_List.forEach(function(mqtt_device_ID, index, array){
                        if(mqtt_device_ID[index]==device_ID)
                        {
                            delete mqtt_device_ID[index];
                        }
                    });
                }
                else if(device_address_info.target_protocol=="Hue API Tunnel")
                {
                    var bridge_addr_found = group_Doc.Hue_Bridge_Group_List.find(hue_bridge_ID => hue_bridge_ID==device_address_info.host_hue_bridge_ID);
                    if(bridge_addr_found==null)
                    {
                        return false;
                    }

                    var index = group_Doc.Hue_Bridge_Group_List.indexOf(bridge_addr_found);
                    if(index<0)
                    {
                        return false;
                    }

                    if(device_address_info.host_hue_bridge_ID==null)
                    {
                        return false;
                    }

                    var hue_bridge_ID = bridge_addr_found.host_hue_bridge_ID;

                    var new_device_list = bridge_addr_found.Device_List;
                    new_device_list.forEach(function(hue_bridge_group_device_ID, index, array){
                        if(hue_bridge_group_device_ID[index]==device_ID)
                        {
                            delete hue_bridge_group_device_ID[index];
                        }
                    });

                    if(new_device_list.length==0)
                    {
                        success = await hue_bridge_group.Remove_One_Group(user, hue_bridge_ID, bridge_addr_found.Mapped_Zigbee_Group_ID);
                        
                    }
                    else{
                        success = await hue_bridge_group.Edit_Hue_Bridge_Group_Light_List(user, hue_bridge_ID, bridge_addr_found.Mapped_Zigbee_Group_ID, new_device_list);
                    }

                    if(success==false)
                    {
                        return false;
                    }

                    group_Doc.Hue_Bridge_Group_List = new_device_list;
                }
                else if(device_address_info.target_protocol=="Twinkly API Tunnel")
                {
                    group_Doc.Twinkly_Device_List.forEach(function(twinkly_device_ID, index, array){
                        if(twinkly_device_ID[index]==device_ID)
                        {
                            delete twinkly_device_ID[index];
                        }
                    });
                }
            }
            else if(device_address_info.target_network=="Bluetooth LE")
            {
                group_Doc.BLE_Device_List.forEach(function(ble_device_ID, index, array){
                    if(ble_device_ID[index]==device_ID)
                    {
                        delete ble_device_ID[index];
                    }
                });
            }
            else if(device_address_info.target_network=="Zigbee")
            {
                success = zigbee_group.Zigbee_RemoveDeviceFromGroup(group_Doc.Mapped_Zigbee_Group_ID, device_ID)
                if(success==false)
                {
                    return false;
                }
                group_Doc.Zigbee_Device_List.forEach(function(zigbee_device_ID, index, array){
                    if(zigbee_device_ID[index]==device_ID)
                    {
                        delete zigbee_device_ID[index];
                    }
                });
            }
            
            success = await database.Database_Update(Group_MGR_DB_Name, device_Type, db_query, group_Doc, false);
            if(success==false)
            {
                database.DataBase_Close(Group_MGR_DB_Name);
                return false;
            }

            database.DataBase_Close(Group_MGR_DB_Name);
            
            return true;
        }
        catch(e)
        {
            debug("[Group_MGR] Remove_Device_From_Group() Error: " + e);
        }
    }
}
module.exports = Group_MGR;

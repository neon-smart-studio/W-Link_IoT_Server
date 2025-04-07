
var debug = require('debug')(require('path').basename(__filename));

const config = require('config');

var Zigbee_Core = require('./Zigbee_Core.js');
var zigbee_core = new Zigbee_Core();

var DataBase = require('../DataBase/DataBase.js');
//var database = new DataBase(config.get('default_database_type'));
var database = new DataBase("TingoDB");

const Zigbee_Group_DB_Name = 'zigbee_group';
const Zigbee_Group_Collection_Name = 'group_list';

var Zigbee_Group = function () {
    var self = this;
    
    self.Zigbee_CreateGroup = async function(mapped_global_group_ID)
    {
        try{
            var created_zigbee_group_ID = -1;

            var znp_all_groups_objs = zigbee_core.Zigbee_Core_Get_Groups();

            var success = await database.DataBase_Open(Zigbee_Group_DB_Name);
            if(success==false)
            {
                return -1;
            }

            var new_zigbee_group_ID = 1;

            if(znp_all_groups_objs.length>0)
            {
                var sorted_group_list = znp_all_groups_objs.sort(function (a, b) {
                    return a.group_ID > b.group_ID ? 1 : -1;
                });
                
                new_zigbee_group_ID = -1;
                for(var i = 1; i<65535; i++)
                {
                    var found = sorted_group_list.find(group_obj => group_obj.groupID==i);
                    if(found==null){
                        new_zigbee_group_ID = i;
                        break;
                    }
                }

                if(new_zigbee_group_ID<0)
                {
                    database.DataBase_Close(Zigbee_Group_DB_Name);
                    return -1;
                }
            }

            var znp_group_obj = zigbee_core.Zigbee_Core_Create_Group(new_zigbee_group_ID);
            if(znp_group_obj==null)
            {
                database.DataBase_Close(Zigbee_Group_DB_Name);
                return -1;
            }

            znp_group_obj["Mapped_Global_Group_ID"] = mapped_global_group_ID;

            success = await database.Database_Insert(Zigbee_Group_DB_Name, Zigbee_Group_Collection_Name, znp_group_obj);
            if(success==false)
            {
                database.DataBase_Close(Zigbee_Group_DB_Name);
                return false;
            }

            database.DataBase_Close(Zigbee_Group_DB_Name);

            created_zigbee_group_ID = new_zigbee_group_ID;

            return created_zigbee_group_ID;
        }
        catch(e)
        {
            debug("[Zigbee_Group] Zigbee_CreateGroup() Error: " + e);
        }
    }
    
    self.Zigbee_GetGroupInfo = async function(zigbee_group_ID)
    {
        try{
            var zigbee_group_info = null;

            var success = await database.DataBase_Open(Zigbee_Group_DB_Name);
            if(success==false)
            {
                return null;
            }

            var zigbee_group_docs = await database.Database_Find(Zigbee_Group_DB_Name, Zigbee_Group_Collection_Name, {"groupID": zigbee_group_ID}, null);
            if(zigbee_group_docs==null || zigbee_group_docs.length==0)
            {
                database.DataBase_Close(Zigbee_Group_DB_Name);
                return null;
            }

            database.DataBase_Close(Zigbee_Group_DB_Name);

            var znp_group_obj = zigbee_core.Zigbee_Core_Get_Group_By_ID(zigbee_group_ID);
            if(znp_group_obj==null)
            {
                znp_group_obj = zigbee_core.Zigbee_Core_Create_Group(zigbee_group_ID);
                if(znp_group_obj==null)
                {
                    return;
                }
            }
            
            zigbee_group_info = znp_group_obj;

            return zigbee_group_info;
        }
        catch(e)
        {
            debug("[Zigbee_Group] Zigbee_GetGroupInfo() Error: " + e);
        }
    }
    
    self.Zigbee_Get_Zigbee_Group_ID_By_Global_Group_ID = async function(global_group_ID)
    {
        try{
            var success = await database.DataBase_Open(Zigbee_Group_DB_Name);
            if(success==false)
            {
                return null;
            }

            var zigbee_group_docs = await database.Database_Find(Zigbee_Group_DB_Name, Zigbee_Group_Collection_Name, {"Mapped_Global_Group_ID": global_group_ID}, null);
            if(zigbee_group_docs==null || zigbee_group_docs.length==0)
            {
                database.DataBase_Close(Zigbee_Group_DB_Name);
                return null;
            }

            database.DataBase_Close(Zigbee_Group_DB_Name);

            return zigbee_group_docs[0].groupID;
        }
        catch(e)
        {
            debug("[Zigbee_Group] Zigbee_Get_Zigbee_Group_ID_By_Global_Group_ID() Error: " + e);
        }
    }
    
    self.Zigbee_Get_Global_Group_ID_By_Zigbee_Group_ID = async function(zigbee_group_ID)
    {
        try{
            var success = await database.DataBase_Open(Zigbee_Group_DB_Name);
            if(success==false)
            {
                return null;
            }

            var zigbee_group_docs = await database.Database_Find(Zigbee_Group_DB_Name, Zigbee_Group_Collection_Name, {"groupID": zigbee_group_ID}, null);
            if(zigbee_group_docs==null || zigbee_group_docs.length==0)
            {
                database.DataBase_Close(Zigbee_Group_DB_Name);
                return null;
            }

            database.DataBase_Close(Zigbee_Group_DB_Name);

            return zigbee_group_docs[0].Mapped_Global_Group_ID;
        }
        catch(e)
        {
            debug("[Zigbee_Group] Zigbee_Get_Zigbee_Group_ID_By_Global_Group_ID() Error: " + e);
        }
    }
    
    self.Zigbee_GetAllGroups = async function()
    {
        try{
            var all_zigbee_group_info = {};

            var success = await database.DataBase_Open(Zigbee_Group_DB_Name);
            if(success==false)
            {
                return null;
            }

            var zigbee_group_docs = await database.Database_Find(Zigbee_Group_DB_Name, Zigbee_Group_Collection_Name, {}, null);
            if(zigbee_group_docs==null)
            {
                database.DataBase_Close(Zigbee_Group_DB_Name);
                return null;
            }

            database.DataBase_Close(Zigbee_Group_DB_Name);
            
            for(var i = 0; i<zigbee_group_docs.length; i++)
            {
                var znp_group_obj = zigbee_core.Zigbee_Core_Get_Group_By_ID(zigbee_group_docs[i].groupID);
                if(znp_group_obj==null)
                {
                    znp_group_obj = zigbee_core.Zigbee_Core_Create_Group(zigbee_group_docs[i].groupID);
                    if(znp_group_obj==null)
                    {
                        continue;
                    }
                }
                all_zigbee_group_info.push(znp_group_obj);
            }
            
            return all_zigbee_group_info;
        }
        catch(e)
        {
            debug("[Zigbee_Group] Zigbee_GetAllGroups() Error: " + e);
        }
    }
    
    self.Zigbee_DeleteGroup = async function(zigbee_group_ID)
    {
        try{
            var success = await database.DataBase_Open(Zigbee_Group_DB_Name);
            if(success==false)
            {
                return false;
            }

            var success = await database.Database_Remove(Zigbee_Group_DB_Name, Zigbee_Group_Collection_Name, {"groupID": zigbee_group_ID}, false);
            if(success==false)
            {
                database.DataBase_Close(Zigbee_Group_DB_Name);
                return false;
            }

            database.DataBase_Close(Zigbee_Group_DB_Name);
            
            return true;
        }
        catch(e)
        {
            debug("[Zigbee_Group] Zigbee_DeleteGroup() Error: " + e);
        }
    }

    self.Zigbee_AddDeviceToGroup = async function(zigbee_group_ID, device_ID)
    {
        try{
            var zigbeeAddr = String(device_ID);
            if(zigbeeAddr.indexOf("x")<0)
            {
                zigbeeAddr = "0x"+zigbeeAddr
            }

            var resolv_zigbee_dev_info = zigbee_core.Zigbee_Core_Resolve_Entity(zigbeeAddr);
            if(resolv_zigbee_dev_info==null)
            {
                return false;
            }

            var success = await database.DataBase_Open(Zigbee_Group_DB_Name);
            if(success==false)
            {
                return false;
            }

            var zigbee_group_doc = await database.Database_Find(Zigbee_Group_DB_Name, Zigbee_Group_Collection_Name, {"groupID": zigbee_group_ID}, null);
            if(zigbee_group_doc==null || zigbee_group_doc.length==0)
            {
                database.DataBase_Close(Zigbee_Group_DB_Name);
                return false;
            }

            database.DataBase_Close(Zigbee_Group_DB_Name);
            
            var znp_group_obj = zigbee_core.Zigbee_Core_Get_Group_By_ID(zigbee_group_ID);

            await resolv_zigbee_dev_info.endpoint.addToGroup(znp_group_obj);
            
            return true;
        }
        catch(e)
        {
            debug("[Zigbee_Group] Zigbee_AddDeviceToGroup() Error: " + e);
        }
    }
    
    self.Zigbee_RemoveDeviceFromGroup = async function(zigbee_group_ID, device_ID)
    {
        try{
            var zigbeeAddr = String(device_ID);
            if(zigbeeAddr.indexOf("x")<0)
            {
                zigbeeAddr = "0x"+zigbeeAddr
            }

            var resolv_zigbee_dev_info = zigbee_core.Zigbee_Core_Resolve_Entity(device_ID);
            if(resolv_zigbee_dev_info==null)
            {
                return false;
            }

            var success = await database.DataBase_Open(Zigbee_Group_DB_Name);
            if(success==false)
            {
                return false;
            }

            var zigbee_group_doc = await database.Database_Find(Zigbee_Group_DB_Name, Zigbee_Group_Collection_Name, {"groupID": zigbee_group_ID}, null);
            if(zigbee_group_doc==null || zigbee_group_doc.length==0)
            {
                database.DataBase_Close(Zigbee_Group_DB_Name);
                return false;
            }

            database.DataBase_Close(Zigbee_Group_DB_Name);

            var znp_group_obj = zigbee_core.Zigbee_Core_Get_Group_By_ID(zigbee_group_ID);

            await resolv_zigbee_dev_info.endpoint.removeFromGroup(znp_group_obj);

            return true;
        }
        catch(e)
        {
            debug("[Zigbee_Group] Zigbee_RemoveDeviceFromGroup() Error: " + e);
        }
    }
};
    
module.exports = Zigbee_Group;
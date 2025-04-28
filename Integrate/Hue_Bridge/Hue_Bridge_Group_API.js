
var debug = require('debug')(require('path').basename(__filename));

const config = require('config');

var uuid = require('uuid');

var DataBase = require('../../DataBase/DataBase.js');
var database = new DataBase();

var Address_MGR = require('../../Util/Address_MGR.js');
var address_mgr = new Address_MGR();

var Hue_Bridge_API = require('./Hue_Bridge_Device_API.js');
var hue_bridge_api = new Hue_Bridge_API();

var Hue_Bridge_Light_API = require('../Hue_Bridge/Hue_Bridge_Light_API.js');
var hue_bridge_light_api = new Hue_Bridge_Light_API();

const Group_MGR_DB_Name = 'group';
const Lighting_Device_Type = "Lighting";

var Hue_Bridge_Group_API = function () {
    var self = this;

    self.Hue_Bridge_Synchronize_All_Group_Info = async function (username, bridge_address_ID) {
        try {
            var session = await hue_bridge_api.Get_Hue_Bridge_Session_By_ID(username, bridge_address_ID);
            if(session==null)
            {
                return false;
            }
    
            var all_groups = await session.groups.getAll();
            
            var success = true;

            for(var i = 0; i<all_groups.length; i++)
            {
                var group_ID = null;
                var device_ID_list = [];
                
                for(var j = 0; j<all_groups[i].lights.length; j++)
                {
                    var light_addr_ID = await hue_bridge_light_api.Hue_Bridge_Get_Light_Address_ID_By_Node_ID(username, bridge_address_ID, all_groups[i].lights[j]);
                    if(light_addr_ID!=null)
                    {
                        device_ID_list.push(light_addr_ID);
                    }
                }

                success = await database.DataBase_Open(Group_MGR_DB_Name);
                if(success==false)
                {
                    continue;
                }
    
                var exist;
                const hue_bridge_db_query = { $or: [ { 'user': username, 'Hue_Bridge_Group_List': {$elemMatch: { Bridge_Address_ID: bridge_address_ID, Mapped_Group_ID: Number(all_groups[i].id) } } },
                                            { 'user': 'everyone', 'Hue_Bridge_Group_List': {$elemMatch: { Bridge_Address_ID: bridge_address_ID, Mapped_Group_ID: Number(all_groups[i].id) } } } ] };
            
                var gp_doc = await database.Database_Find(Group_MGR_DB_Name, Lighting_Device_Type, hue_bridge_db_query, null);
                if(gp_doc==null || gp_doc.length==0)
                {
                    exist = false;
                }
                else
                {
                    exist = true;
                }

                if(exist==false)
                {
                    var group_UUID = uuid.v1();
            
                    group_ID = group_UUID.split('-').join('');
                    
                    var hue_group_Name = "New Group";
                    if(all_groups[i].name!=null)
                    {
                        hue_group_Name = all_groups[i].name;
                    }

                    var new_group_doc = {
                        user: username,
                        group_ID: group_ID,
                        group_Name: hue_group_Name,
                        Mapped_Zigbee_Group_ID: -1,
                        MQTT_Device_List:[],
                        BLE_Device_List:[],
                        Zigbee_Device_List:[],
                        Hue_Bridge_Group_List:[
                            {
                                Bridge_Address_ID: bridge_address_ID,
                                Mapped_Group_ID: Number(all_groups[i].id),
                                Device_List: device_ID_list
                            }
                        ],
                        group_Ext_Info: {}
                    }
            
                    success = await database.Database_Insert(Group_MGR_DB_Name, Lighting_Device_Type, new_group_doc);
                }
                else{
                    group_ID = gp_doc[0].group_ID

                    var changed = false;
                    const update_db_query = { $or: [ { 'user': username, 'group_ID': gp_doc[0].group_ID }, { 'user': 'everyone', 'group_ID': gp_doc[0].group_ID } ] };
        
                    for(var k = 0; k<gp_doc[0].Hue_Bridge_Group_List.length; k++)
                    {
                        if(gp_doc[0].Hue_Bridge_Group_List[k].Bridge_Address_ID==bridge_address_ID)
                        {
                            changed = true;
                            gp_doc[0].Hue_Bridge_Group_List[k].Mapped_Group_ID = Number(all_groups[i].id);
                            gp_doc[0].Hue_Bridge_Group_List[k].Device_List = device_ID_list;
                        }
                    }
        
                    if(changed)
                    {
                        success = await database.Database_Update(Group_MGR_DB_Name, Lighting_Device_Type, update_db_query, gp_doc[0], false);
                    }
                }
                    
                await database.DataBase_Close(Group_MGR_DB_Name);
                    
                if(success==true)
                {
                    success = await address_mgr.Save_Address_Info(group_ID, 'Group', 'Any', 'Any');
                }
            }

            return success;
        }
        catch (e) {
            debug("[Hue_Bridge_Group_API] Hue_Bridge_Synchronize_All_Group_Info() Error " + e);
        }
    };
    
    self.Create_Hue_Bridge_Group = async function (username, bridge_address_ID, group_name, light_list) {
        try {
            var bridge_session = await hue_bridge_api.Get_Hue_Bridge_Session_By_ID(username, bridge_address_ID);
            if(bridge_session==null)
            {
                return null;
            }

            const newGroup = model.createLightGroup();
            // The name of the new group to create
            newGroup.name = group_name;
            // The array of light ids that will be in the group
            newGroup.lights = light_list;
        
            return await bridge_session.groups.createGroup(newGroup);
        }
        catch (e) {
            debug("[Hue_Bridge_Group_API] Create_Hue_Bridge_Group() Error " + e);
        }
    };

    self.Rename_Hue_Bridge_Group = async function (username, bridge_address_ID, hue_group_ID, new_name) {
        try {
            var bridge_session = await Get_Hue_Bridge_Session_By_ID(username, bridge_address_ID);
            if(bridge_session==null)
            {
                return false;
            }

            var hue_group = await bridge_session.groups.getGroup(Number(hue_group_ID));

            hue_group.name = new_name;
            
            await bridge_session.groups.updateGroupAttributes(group);
            
            return true;
        }
        catch (e) {
            debug("[Hue_Bridge_Group_API] Rename_Hue_Bridge_Group() Error " + e);
        }
    };

    self.Remove_One_Group = async function (username, bridge_address_ID, hue_group_ID) {
        try {
            var bridge_session = await Get_Hue_Bridge_Session_By_ID(username, bridge_address_ID);
            if(bridge_session==null)
            {
                return false;
            }

            await bridge_session.groups.deleteGroup(Number(hue_group_ID));

            return true;
        }
        catch (e) {
            debug("[Hue_Bridge_Group_API] Remove_One_Group() Error " + e);
        }
    };

    self.Edit_Hue_Bridge_Group_Light_List = async function (username, bridge_address_ID, hue_group_ID, light_list) {
        try {
            var bridge_session = await Get_Hue_Bridge_Session_By_ID(username, bridge_address_ID);
            if(bridge_session==null)
            {
                return false;
            }

            var hue_group = await bridge_session.groups.getGroup(Number(hue_group_ID));

            hue_group.lights = light_list;
            
            await bridge_session.groups.updateGroupAttributes(hue_group);
            
            return true;
        }
        catch (e) {
            debug("[Hue_Bridge_Group_API] Edit_Hue_Bridge_Group_Light_List() Error " + e);
        }
    };
    
    self.Get_Hue_Bridge_Group_Light_List = async function (username, bridge_address_ID, hue_group_ID) {
        try {
            var bridge_session = await Get_Hue_Bridge_Session_By_ID(username, bridge_address_ID);
            if(bridge_session==null)
            {
                return null;
            }

            var hue_group = await bridge_session.groups.getGroup(Number(hue_group_ID));

            return hue_group.lights;
        }
        catch (e) {
            debug("[Hue_Bridge_Group_API] Get_Hue_Bridge_Group_Light_List() Error " + e);
        }
    };
};

module.exports = Hue_Bridge_Group_API;
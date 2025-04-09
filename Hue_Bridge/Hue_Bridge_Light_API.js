
var debug = require('debug')(require('path').basename(__filename));

const config = require('config');

var uuid = require('uuid');

var DataBase = require('../DataBase/DataBase.js');
//var database = new DataBase(config.get('default_database_type'));
var database = new DataBase("TingoDB");

var Device_MGR = require('../Util/Device_MGR.js');
var device_mgr = new Device_MGR();

var Hue_Bridge_API = require('./Hue_Bridge_Device_API.js');
var hue_bridge_api = new Hue_Bridge_API();

const Device_MGR_DB_Name = 'device';
const Lighting_Device_Type = "Lighting";

async function Delete_All_Hue_Bridge_Light(user, bridge_address_ID)
{
    try{
        var success = false;

        success = await database.DataBase_Open(Device_MGR_DB_Name);
        if(success==false)
        {
            return false;
        }

        var db_query = { $or: [ { 'user': user, 'bridge_address_ID': bridge_address_ID}, 
                        { 'user': 'everyone', 'bridge_address_ID': bridge_address_ID} ] };
        
        success = await database.Database_Remove(Device_MGR_DB_Name, Lighting_Device_Type, db_query, false);
        if(success==false)
        {
            database.DataBase_Close(Device_MGR_DB_Name);
            return false;
        }
        
        database.DataBase_Close(Device_MGR_DB_Name);

        return success;
    }
    catch(e)
    {
        debug("[Device_MGR] Delete_All_Hue_Bridge_Light() Error: " + e);
    }
}

var Hue_Bridge_Light_API = function () {
    var self = this;

    self.Hue_Bridge_Get_Light_Address_ID_By_Node_ID = async function (username, bridge_address_ID, light_node_ID) {
        try {
            var success = await database.DataBase_Open(Device_MGR_DB_Name);
            if(success==false)
            {
                return null;
            }
        
            const hue_bridge_db_query = { $or: [ { 'user': username, 'bridge_address_ID': bridge_address_ID, 'node_ID': Number(light_node_ID) },
                            { 'user': 'everyone', 'bridge_address_ID': bridge_address_ID, 'node_ID': Number(light_node_ID) } ] };

            var dev_docs = await database.Database_Find(Device_MGR_DB_Name, Lighting_Device_Type, hue_bridge_db_query, null);
            if(dev_docs==null || dev_docs.length==0)
            {
                database.DataBase_Close(Device_MGR_DB_Name);
                return null;
            }

            database.DataBase_Close(Device_MGR_DB_Name);

            return dev_docs[0].device_ID;
        }
        catch (e) {
            debug("[Hue_Bridge_Light_API] Hue_Bridge_Get_Light_Address_ID_By_Node_ID() Error " + e);
        }
    }
    self.Hue_Bridge_Synchronize_All_Light_Info = async function (username, bridge_address_ID) {
        try {
            var session = await hue_bridge_api.Get_Hue_Bridge_Session_By_ID(username, bridge_address_ID);
            if(session==null)
            {
                return false;
            }
            if((await Delete_All_Hue_Bridge_Light(username, bridge_address_ID))==false)
            {
                return false;
            }

            var all_lights = await session.lights.getAll();
            for(var i = 0; i<all_lights.length; i++)
            {
                var light_info = all_lights[i];
    
                var uidPatternArray = light_info.uniqueid.split(":");
                var uidStr = "";
                for(var j = 0; j<uidPatternArray.length; j++){uidStr = uidStr+uidPatternArray[j];}
                uidPatternArray = uidStr.split("-");
    
                var light_address_ID = uidPatternArray[0];
    
                var light_type = "";
                switch(light_info.type)
                {
                    case "Onoff light":
                        light_type = "On Off Light";
                        break;
                    case "Dimmable light":
                        light_type = "Dimmable Light";
                        break;
                    case "Colored light":
                        light_type = "Colored Light";
                        break;
                    case "Extended color light":
                        light_type = "Extended Color Light";
                        break;
                    case "Color temperature light":
                        light_type = "Color Temperature Light";
                        break;
                    default: 
                        continue;
                }
    
                var light_device_info = {
                    device_Name: light_info.name,
                    network_Type: "TCP/IP",
                    protocol_Type: "Hue API Tunnel",
                    device_Network: "Zigbee",
                    device_Type: light_type,
                    bridge_address_ID: bridge_address_ID,
                    node_ID: Number(light_info.id),
                    unique_ID: light_info.uniqueid,
                    software_version: light_info.swversion,
                    manufacture: light_info.manufacture,
                    modelID: light_info.modelid,
                    capabilities: light_info.capabilities,
                    config: light_info.config
                }
            
                await device_mgr.Save_Device_Info(Lighting_Device_Type, username, light_address_ID, light_device_info);
            }
            return true;
        }
        catch (e) {
            debug("[Hue_Bridge_Light_API] Hue_Bridge_Synchronize_All_Light_Info() Error " + e);
        }
    };
    
    self.Rename_Hue_Bridge_Light_Device = async function (username, address_ID, new_name) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info==null)
            {
                return false;
            }
        
            if(address_info.target_type!="Device")
            {
                return false;
            }

            var session = await hue_bridge_api.Get_Hue_Bridge_Session_By_ID(username, address_info.host_hue_bridge_ID);
            if(session==null)
            {
                return false;
            }
    
            var light_session = await session.bridge_session_list[0].lights.getLight(Number(address_info.device_no_ID));

            light_session.name = new_name;
            await session.bridge_session_list[0].lights.renameLight(light_session);

            return true;
        }
        catch (e) {
            debug("[Hue_Bridge_Light_API] Rename_Hue_Bridge_Light_Device() Error " + e);
        }
    };

    self.Remove_One_Light = async function (username, address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info==null)
            {
                return false;
            }
        
            if(address_info.target_type!="Device")
            {
                return false;
            }

            var session = await hue_bridge_api.Get_Hue_Bridge_Session_By_ID(username, address_info.host_hue_bridge_ID);
            if(session==null)
            {
                return false;
            }
    
            await session.bridge_session_list[0].lights.deleteLight(Number(address_info.device_no_ID));

            return true;
        }
        catch (e) {
            debug("[Hue_Bridge_Light_API] Remove_One_Light() Error " + e);
        }
    };

};

module.exports = Hue_Bridge_Light_API;
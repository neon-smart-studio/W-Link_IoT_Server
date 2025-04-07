
var debug = require('debug')(require('path').basename(__filename));

const v3 = require('node-hue-api').v3
  , discovery = v3.discovery
  , hueApi = v3.api 
;

const hueAppName = 'W-Link';

var Device_MGR = require('../Util/Device_MGR.js');
var device_mgr = new Device_MGR();

const Hue_Bridge_Device_Type = "Hue Bridge";

var Hue_Bridge_Session_List = [];
var Hue_Bridge_Configuration_List = [];

var Hue_Bridge_API = function () {
    var self = this;

    self.Discover_Nearby_Hue_Bridge = async function (){
        try {
            var discoveryResults = [];
            try {
                discoveryResults = await discovery.nupnpSearch();
            }
            catch (e) {
                debug("[Hue_Bridge_API] Hue Bridge uPnP Search Error " + e);
                return {
                    num_of_hue_bridge: 0,
                    discovered_hue_bridge_list: []
                }
            }  
            
            return {
                num_of_hue_bridge: discoveryResults.length,
                discovered_hue_bridge_list: discoveryResults
            }
        }
        catch (e) {
            debug("[Hue_Bridge_API] Discover_Hue_Bridge() Error " + e);
        }
    }

    self.Link_To_Hue_Bridge = async function (username, hue_bridge_ip) {
        try {
            var authenticatedApi = Hue_Bridge_Session_List[hue_bridge_ip];
            if(authenticatedApi==null)
            {
                // Create an unauthenticated instance of the Hue API so that we can create a new user
                const unauthenticatedApi = await hueApi.createLocal(hue_bridge_ip).connect();
                
                var errCode = 0;
                var createdUser = null;

                var auth_timeout = false;
                setTimeout(()=>{auth_timeout = true;}, 20000);
                do
                {
                    try{
                        createdUser = await unauthenticatedApi.users.createUser(hueAppName, username);
                        if(createdUser!=null)
                        {
                            errCode = 0;
                        }
                    }
                    catch(err)
                    {
                        errCode = err.getHueErrorType();
                    }
                }while(!auth_timeout && createdUser==null);

                if(errCode!=0)
                {
                    if (err.getHueErrorType() === 101) {
                        debug("[Hue_Bridge_API] The Link button on the bridge was not pressed. Please press the Link button and try again.");
                    }
                    return false;
                }
            
                // Create a new API instance that is authenticated with the new user we created
                authenticatedApi = await hueApi.createLocal(hue_bridge_ip).connect(createdUser.username);

                Hue_Bridge_Session_List[hue_bridge_ip] = authenticatedApi;
            }
            
            // Do something with the authenticated user/api
            var hue_bridge_configuration = await authenticatedApi.configuration.getConfiguration();
            Hue_Bridge_Configuration_List[hue_bridge_ip] = hue_bridge_configuration;

            var macPatternArray = hue_bridge_configuration.mac.split(":");

            var macStr = "";
            for(var i = 0; i<macPatternArray.length; i++){macStr = macStr+macPatternArray[i];}
            var hue_bridge_address_ID = hue_bridge_configuration.modelid + macStr;

            var hue_bridge_device_inf = {
                device_Name: hue_bridge_configuration.name,
                network_Type: "TCP/IP",
                protocol_Type: "Hue API Tunnel",
                device_Type: "Hue Bridge",
                IP_address: hue_bridge_ip,
                software_version: hue_bridge_configuration.swversion,
                apiversion: hue_bridge_configuration.apiversion,
                manufacture: "Philips",
                modelID: hue_bridge_configuration.modelid,
                authenticated_user: createdUser,
                bridge_configuration: hue_bridge_configuration
            }
            
            return await device_mgr.Save_Device_Info(Hue_Bridge_Device_Type, username, hue_bridge_address_ID, hue_bridge_device_inf);
        } catch(err) {
            debug("[Hue_Bridge_API] Link_Hue_Bridge_Device() Error " + err);
        }
    }

    self.Get_Hue_Bridge_Session_By_ID = async function (username, address_ID) {
        try{
            var bridge_info = await device_mgr.Read_Device_Inf(Hue_Bridge_Device_Type, username, address_ID);
            if(bridge_info==null)
            {
                return null;
            }
            if(bridge_info.authenticated_user==null)
            {
                Hue_Bridge_Session_List[bridge_info.IP_address] = null;
                return null;
            }
            if(Hue_Bridge_Session_List[bridge_info.IP_address]==null)
            {
                var authenticatedApi
                try{
                    authenticatedApi = await hueApi.createLocal(bridge_info.IP_address).connect(bridge_info.authenticated_user.username);
                }
                catch(e)
                {
                    debug("[Hue_Bridge_API] Get_Hue_Bridge_Session_By_ID() Connect Error " + e);
                    return null;
                }
                Hue_Bridge_Session_List[bridge_info.IP_address] = authenticatedApi;
            }
            return Hue_Bridge_Session_List[bridge_info.IP_address];
        }
        catch (e) {
            debug("[Hue_Bridge_API] Get_Hue_Bridge_Session_By_ID() Error " + e);
        }
    }

    self.Hue_Bridge_Device_Change_Name = async function (username, address_ID, new_name) {
        try {
            var session = await this.Get_Hue_Bridge_Session_By_ID(username, address_ID);
            if(session==null)
            {
                return false;
            }

            session.configuration.setConfiguration({name: new_name});

            return true;
        }
        catch (e) {
            debug("[Hue_Bridge_API] Hue_Bridge_Device_Change_Name() Error " + e);
        }
    }

    self.Hue_Bridge_Remove_Device = async function (username, address_ID) {
        try {
            var session = await this.Get_Hue_Bridge_Session_By_ID(username, address_ID);
            if(session==null)
            {
                return false;
            }
            session.users.deleteUser(username);

            return true;
        }
        catch (e) {
            debug("[Hue_Bridge_API] Hue_Bridge_Remove_Device() Error " + e);
        }
    }
}

module.exports = Hue_Bridge_API;
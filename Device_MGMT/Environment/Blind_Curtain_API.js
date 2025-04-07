
var debug = require('debug')(require('path').basename(__filename));

var Address_MGR = require('../../Util/Address_MGR.js');
var address_mgr = new Address_MGR();
/*
var Blind_Curtain_API_MQTT = require('../../MQTT/Device_MGMT/Environment/Blind_Curtain_API_MQTT.js');
var blind_curtain_api_mqtt = new Blind_Curtain_API_MQTT();
*/
var Blind_Curtain_API_Zigbee = require('../../Zigbee/Device_MGMT/Environment/Blind_Curtain_API_Zigbee.js');
var blind_curtain_api_zigbee = new Blind_Curtain_API_Zigbee();

var Blind_Curtain_API = function () {
    var self = this;
    
    self.Blind_Curtain_Open_Close = async function (address_ID, open_close) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }

            var result = null;
            
            if(address_info.target_network=="TCP/IP")
            {
                //await blind_curtain_api_mqtt.Blind_Curtain_Open_Close(address_ID, open_close);
            }
            if(address_info.target_network=="Zigbee")
            {
                await blind_curtain_api_zigbee.Blind_Curtain_Open_Close(address_ID, open_close);
            }

            return result;
        }
        catch (e) {
            debug("[Blind_Curtain_API] Blind_Curtain_Open_Close() Error " + e);
        }
    };
    self.Blind_Curtain_Toggle_State = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }

            var result = null;
            
            if(address_info.target_network=="TCP/IP")
            {
                //await blind_curtain_api_mqtt.Blind_Curtain_Toggle_State(address_ID);
            }
            if(address_info.target_network=="Zigbee")
            {
                await blind_curtain_api_zigbee.Blind_Curtain_Toggle_State(address_ID);
            }

            return result;
        }
        catch (e) {
            debug("[Blind_Curtain_API] Blind_Curtain_Toggle_State() Error " + e);
        }
    };
    self.Blind_Curtain_Lift_To_Position = async function (address_ID, lift_percentage) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }

            var result = null;
            
            if(address_info.target_network=="TCP/IP")
            {
                //await blind_curtain_api_mqtt.Blind_Curtain_Lift_To_Position(address_ID, lift_percentage);
            }
            if(address_info.target_network=="Zigbee")
            {
                await blind_curtain_api_zigbee.Blind_Curtain_Lift_To_Position(address_ID, lift_percentage);
            }

            return result;
        }
        catch (e) {
            debug("[Blind_Curtain_API] Blind_Curtain_Lift_To_Position() Error " + e);
        }
    };
    self.Blind_Curtain_Tilt_To_Position = async function (address_ID, tilt_percentage) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }

            var result = null;
            
            if(address_info.target_network=="TCP/IP")
            {
                //await blind_curtain_api_mqtt.Blind_Curtain_Tilt_To_Position(address_ID, tilt_percentage);
            }
            if(address_info.target_network=="Zigbee")
            {
                await blind_curtain_api_zigbee.Blind_Curtain_Tilt_To_Position(address_ID, tilt_percentage);
            }

            return result;
        }
        catch (e) {
            debug("[Blind_Curtain_API] Blind_Curtain_Tilt_To_Position() Error " + e);
        }
    };
    self.Blind_Curtain_Stop_Moveing = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }

            var result = null;
            
            if(address_info.target_network=="TCP/IP")
            {
                //await blind_curtain_api_mqtt.Blind_Curtain_Stop_Moveing(address_ID);
            }
            if(address_info.target_network=="Zigbee")
            {
                await blind_curtain_api_zigbee.Blind_Curtain_Stop_Moveing(address_ID);
            }

            return result;
        }
        catch (e) {
            debug("[Blind_Curtain_API] Blind_Curtain_Stop_Moveing() Error " + e);
        }
    };
    self.Blind_Curtain_Get_Current_Position = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }

            var result = null;
            
            if(address_info.target_network=="TCP/IP")
            {
                //result = await blind_curtain_api_mqtt.Blind_Curtain_Get_Current_Position(address_ID);
            }
            if(address_info.target_network=="Zigbee")
            {
                result = await blind_curtain_api_zigbee.Blind_Curtain_Get_Current_Position(address_ID);
            }

            if(result==null)
            {
                result = {
                    timeout: true,
                    username: 'everyone',
                    device_ID: address_ID
                };
            }
            else{
                if(result.timeout==null)
                {
                    result["timeout"] = false;
                }
                if(result.username==null)
                {
                    result["username"] = 'everyone';
                }
                if(result.device_ID==null)
                {
                    result["device_ID"] = address_ID;
                }
            }
            return result;
        }
        catch (e) {
            debug("[Blind_Curtain_API] Blind_Curtain_Get_On_Off_Status() Error " + e);
        }
    };
};

module.exports = Blind_Curtain_API;
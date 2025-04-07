
var debug = require('debug')(require('path').basename(__filename));

var Address_MGR = require('../../Util/Address_MGR.js');
var address_mgr = new Address_MGR();

var OnOff_Socket_API_MQTT = require('../../MQTT/Device_MGMT/ElectricPower/OnOff_Socket_API_MQTT.js');
var onoff_socket_api_mqtt = new OnOff_Socket_API_MQTT();

var OnOff_Socket_API_Zigbee = require('../../Zigbee/Device_MGMT/ElectricPower/OnOff_Socket_API_Zigbee.js');
var onoff_socket_api_zigbee = new OnOff_Socket_API_Zigbee();

var OnOff_Socket_API = function () {
    var self = this;
    
    self.Get_Num_Of_OnOff_Socket = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }
            
            var result = null;

            if(address_info.target_network=="TCP/IP")
            {
                result = await onoff_socket_api_mqtt.Get_Num_Of_OnOff_Socket(address_ID);
            }
            else if(address_info.target_network=="Zigbee")
            {
                result = await onoff_socket_api_zigbee.Get_Num_Of_OnOff_Socket(address_ID);
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
            debug("[OnOff_Socket_API] Get_Num_Of_OnOff_Socket() Error " + e);
        }
    };
    self.Get_OnOff_Socket_Individual_Socket_Status = async function (address_ID, socket_index) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }

            var result = null;

            if(address_info.target_network=="TCP/IP")
            {
                result = await onoff_socket_api_mqtt.Get_OnOff_Socket_Individual_Socket_Status(address_ID, socket_index);
            }
            else if(address_info.target_network=="Zigbee")
            {
                result = await onoff_socket_api_zigbee.Get_OnOff_Socket_Individual_Socket_Status(address_ID, socket_index);
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
            debug("[OnOff_Socket_API] Get_OnOff_Socket_Individual_Socket_Status() Error " + e);
        }
    };
    self.Get_OnOff_Socket_All_Socket_Status = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }

            var result = null;

            if(address_info.target_network=="TCP/IP")
            {
                result = await onoff_socket_api_mqtt.Get_OnOff_Socket_All_Socket_Status(address_ID);
            }
            else if(address_info.target_network=="Zigbee")
            {
                result = await onoff_socket_api_zigbee.Get_OnOff_Socket_All_Socket_Status(address_ID);
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
            debug("[OnOff_Socket_API] Get_OnOff_Socket_All_Socket_Status() Error " + e);
        }
    };
    self.OnOff_Socket_Set_Individual_Socket_On_Off = async function (address_ID, socket_index, on_off) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);

            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    onoff_socket_api_mqtt.OnOff_Socket_Set_Individual_Socket_On_Off(address_ID, socket_index, on_off);
                }
                else if(address_info.target_network=="Zigbee")
                {
                    await onoff_socket_api_zigbee.OnOff_Socket_Set_Individual_Socket_On_Off(address_ID, socket_index, on_off);
                }
            }
            else{
                onoff_socket_api_mqtt.OnOff_Socket_Set_Individual_Socket_On_Off(address_ID, socket_index, on_off);
                await onoff_socket_api_zigbee.OnOff_Socket_Set_Individual_Socket_On_Off(address_ID, socket_index, on_off);
            }
        }
        catch (e) {
            debug("[OnOff_Socket_API] OnOff_Socket_Individual_Socket_On_Off() Error " + e);
        }
    };
    self.OnOff_Socket_Toggle_Individual_Socket_On_Off = async function (address_ID, socket_index) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);

            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    onoff_socket_api_mqtt.OnOff_Socket_Toggle_Individual_Socket_On_Off(address_ID, socket_index);
                }
                else if(address_info.target_network=="Zigbee")
                {
                    await onoff_socket_api_zigbee.OnOff_Socket_Toggle_Individual_Socket_On_Off(address_ID, socket_index);
                }
            }
            else{
                onoff_socket_api_mqtt.OnOff_Socket_Toggle_Individual_Socket_On_Off(address_ID, socket_index);
                await onoff_socket_api_zigbee.OnOff_Socket_Toggle_Individual_Socket_On_Off(address_ID, socket_index);
            }
        }
        catch (e) {
            debug("[OnOff_Socket_API] OnOff_Socket_Toggle_Individual_Socket_On_Off() Error " + e);
        }
    };
    self.OnOff_Socket_Set_All_Socket_On_Off = async function (address_ID, on_off) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);

            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    onoff_socket_api_mqtt.OnOff_Socket_Set_All_Socket_On_Off(address_ID, on_off);
                }
                else if(address_info.target_network=="Zigbee")
                {
                    await onoff_socket_api_zigbee.OnOff_Socket_Set_All_Socket_On_Off(address_ID, on_off);
                }
            }
            else{
                onoff_socket_api_mqtt.OnOff_Socket_Set_All_Socket_On_Off(address_ID, on_off);
                await onoff_socket_api_zigbee.OnOff_Socket_Set_All_Socket_On_Off(address_ID, on_off);
            }
        }
        catch (e) {
            debug("[OnOff_Socket_API] OnOff_Socket_Set_All_Socket_On_Off() Error " + e);
        }
    };
    self.OnOff_Socket_Toggle_All_Socket_On_Off = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);

            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    onoff_socket_api_mqtt.OnOff_Socket_Toggle_All_Socket_On_Off(address_ID);
                }
                else if(address_info.target_network=="Zigbee")
                {
                    await onoff_socket_api_zigbee.OnOff_Socket_Toggle_All_Socket_On_Off(address_ID);
                }
            }
            else{
                onoff_socket_api_mqtt.OnOff_Socket_Toggle_All_Socket_On_Off(address_ID);
                await onoff_socket_api_zigbee.OnOff_Socket_Toggle_All_Socket_On_Off(address_ID);
            }
        }
        catch (e) {
            debug("[OnOff_Socket_API] OnOff_Socket_Toggle_All_Socket_On_Off() Error " + e);
        }
    };
};

module.exports = OnOff_Socket_API;
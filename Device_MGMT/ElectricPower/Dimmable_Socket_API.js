
var debug = require('debug')(require('path').basename(__filename));

var Address_MGR = require('../../Util/Address_MGR.js');
var address_mgr = new Address_MGR();

var Dimmable_Socket_API_MQTT = require('../../MQTT/Device_MGMT/ElectricPower/Dimmable_Socket_API_MQTT.js');
var dimmable_socket_api_mqtt = new Dimmable_Socket_API_MQTT();

var Dimmable_Socket_API = function (){
    var self = this;

    self.Get_Num_Of_Dimmable_Socket = async function(address_ID)
    {
        try{
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }

            var result = null;

            if(address_info.target_network=="TCP/IP")
            {
                result = await dimmable_socket_api_mqtt.Get_Num_Of_Dimmable_Socket(address_ID);
            }

            return result;
        }
        catch(e)
        {
            debug("[Dimmable_Socket_API] Get_Num_Of_Dimmable_Socket() Error " + e);
        }
    };
    self.Get_Dimmable_Socket_Individual_Socket_Status = async function(address_ID, socket_index)
    {
        try{
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }

            var result = null;

            if(address_info.target_network=="TCP/IP")
            {
                result = await dimmable_socket_api_mqtt.Get_Dimmable_Socket_Individual_Socket_Status(address_ID, socket_index);
            }
            
            return result;
        }
        catch(e)
        {
            debug("[Dimmable_Socket_API] Get_Dimmable_Socket_Individual_Socket_Status() Error " + e);
        }
    };
    self.Get_Dimmable_Socket_All_Socket_Status = async function(address_ID)
    {
        try{
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }
            
            var result = null;

            if(address_info.target_network=="TCP/IP")
            {
                result = await dimmable_socket_api_mqtt.Get_Dimmable_Socket_All_Socket_Status(address_ID);
            }
            
            return result;
        }
        catch(e)
        {
            debug("[Dimmable_Socket_API] Get_Dimmable_Socket_All_Socket_Status() Error " + e);
        }
    };
    self.Dimmable_Socket_Set_Individual_Socket_On_Off = async function(address_ID, socket_index, on_off)
    {
        try{
            var address_info = await address_mgr.Read_Address_Info(address_ID);

            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    dimmable_socket_api_mqtt.Dimmable_Socket_Set_Individual_Socket_On_Off(address_ID, socket_index, on_off);
                }
            }
            else{
                dimmable_socket_api_mqtt.Dimmable_Socket_Set_Individual_Socket_On_Off(address_ID, socket_index, on_off);
            }
        }
        catch(e)
        {
            debug("[Dimmable_Socket_API] Dimmable_Socket_Individual_Socket_On_Off() Error " + e);
        }
    };
    self.Dimmable_Socket_Toggle_Individual_Socket_On_Off = async function(address_ID, socket_index)
    {
        try{
            var address_info = await address_mgr.Read_Address_Info(address_ID);

            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    dimmable_socket_api_mqtt.Dimmable_Socket_Toggle_Individual_Socket_On_Off(address_ID, socket_index);
                }
            }
            else{
                dimmable_socket_api_mqtt.Dimmable_Socket_Toggle_Individual_Socket_On_Off(address_ID, socket_index);
            }
        }
        catch(e)
        {
            debug("[Dimmable_Socket_API] Dimmable_Socket_Toggle_Individual_Socket_On_Off() Error " + e);
        }
    };
    self.Dimmable_Socket_Set_All_Socket_On_Off = async function(address_ID, on_off)
    {
        try{
            var address_info = await address_mgr.Read_Address_Info(address_ID);

            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    dimmable_socket_api_mqtt.Dimmable_Socket_Set_All_Socket_On_Off(address_ID, on_off);
                }
            }
            else{
                dimmable_socket_api_mqtt.Dimmable_Socket_Set_All_Socket_On_Off(address_ID, on_off);
            }
        }
        catch(e)
        {
            debug("[Dimmable_Socket_API] Dimmable_Socket_All_Socket_On_Off() Error " + e);
        }
    };
    self.Dimmable_Socket_Toggle_All_Socket_On_Off = async function(address_ID)
    {
        try{
            var address_info = await address_mgr.Read_Address_Info(address_ID);

            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    dimmable_socket_api_mqtt.Dimmable_Socket_Toggle_All_Socket_On_Off(address_ID);
                }
            }
            else{
                dimmable_socket_api_mqtt.Dimmable_Socket_Toggle_All_Socket_On_Off(address_ID);
            }
        }
        catch(e)
        {
            debug("[Dimmable_Socket_API] Dimmable_Socket_Toggle_All_Socket_On_Off() Error " + e);
        }
    };
    self.Dimmable_Socket_Set_Individual_Socket_PWM_Level = async function(address_ID, socket_index, pwm_lvl)
    {
        try{
            var address_info = await address_mgr.Read_Address_Info(address_ID);

            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    dimmable_socket_api_mqtt.Dimmable_Socket_Set_Individual_Socket_PWM_Level(address_ID, socket_index, pwm_lvl);
                }
            }
            else{
                dimmable_socket_api_mqtt.Dimmable_Socket_Set_Individual_Socket_PWM_Level(address_ID, socket_index, pwm_lvl);
            }
        }
        catch(e)
        {
            debug("[Dimmable_Socket_API] Dimmable_Socket_Individual_Socket_PWM_Level() Error " + e);
        }
    };
    self.Dimmable_Socket_Set_All_Socket_PWM_Level = async function(address_ID, pwm_lvl)
    {
        try{
            var address_info = await address_mgr.Read_Address_Info(address_ID);

            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    dimmable_socket_api_mqtt.Dimmable_Socket_Set_All_Socket_PWM_Level(address_ID, pwm_lvl);
                }
            }
            else{
                dimmable_socket_api_mqtt.Dimmable_Socket_Set_All_Socket_PWM_Level(address_ID, pwm_lvl);
            }
        }
        catch(e)
        {
            debug("[Dimmable_Socket_API] Dimmable_Socket_All_Socket_PWM_Level() Error " + e);
        }
    };
};

module.exports = Dimmable_Socket_API;
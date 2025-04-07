
var debug = require('debug')(require('path').basename(__filename));

var Address_MGR = require('../../Util/Address_MGR.js');
var address_mgr = new Address_MGR();

var Circulating_Fan_API_MQTT = require('../../MQTT/Device_MGMT/Environment/Circulating_Fan_API_MQTT.js');
var circulating_fan_api_mqtt = new Circulating_Fan_API_MQTT();

var Circulating_Fan_API = function () {
    var self = this;
    
    self.Circulating_Fan_Get_All_Status = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }

            var result = null;
            
            if(address_info.target_network=="TCP/IP")
            {
                result = await circulating_fan_api_mqtt.Circulating_Fan_Get_All_Status(address_ID);
            }

            return result;
        }
        catch (e) {
            debug("[Circulating_Fan_API] Circulating_Fan_Get_All_Status() Error " + e);
        }
    };
    self.Circulating_Fan_Get_On_Off_Status = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }

            var result = null;
            
            if(address_info.target_network=="TCP/IP")
            {
                result = await circulating_fan_api_mqtt.Circulating_Fan_Get_On_Off_Status(address_ID);
            }

            return result;
        }
        catch (e) {
            debug("[Circulating_Fan_API] Circulating_Fan_Get_On_Off_Status() Error " + e);
        }
    };
    self.Circulating_Fan_Get_Current_PWM_Level = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }

            var result = null;
            
            if(address_info.target_network=="TCP/IP")
            {
                result = await circulating_fan_api_mqtt.Circulating_Fan_Get_Current_PWM_Level(address_ID);
            }

            return result;
        }
        catch (e) {
            debug("[Circulating_Fan_API] Circulating_Fan_Get_Current_PWM_Level() Error " + e);
        }
    };
    self.Circulating_Fan_Turn_On_Off = async function (address_ID, on_off) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            
            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    circulating_fan_api_mqtt.Circulating_Fan_Turn_On_Off(address_ID, on_off);
                }
            }
            else{
                circulating_fan_api_mqtt.Circulating_Fan_Turn_On_Off(address_ID, on_off);
            }
        }
        catch (e) {
            debug("[Circulating_Fan_API] Circulating_Fan_Turn_On_Off() Error " + e);
        }
    };
    self.Circulating_Fan_Toggle_On_Off = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }

            var result = null;
            
            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    circulating_fan_api_mqtt.Circulating_Fan_Toggle_On_Off(address_ID);
                }
            }
            else{
                circulating_fan_api_mqtt.Circulating_Fan_Toggle_On_Off(address_ID);
            }

            return result;
        }
        catch (e) {
            debug("[Circulating_Fan_API] Circulating_Fan_Toggle_On_Off() Error " + e);
        }
    };
    self.Circulating_Fan_Set_PWM_Level = async function (address_ID, level) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            
            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    circulating_fan_api_mqtt.Circulating_Fan_Set_PWM_Level(address_ID, level);
                }
            }
            else{
                circulating_fan_api_mqtt.Circulating_Fan_Set_PWM_Level(address_ID, level);
            }
        }
        catch (e) {
            debug("[Circulating_Fan_API] Circulating_Fan_Set_PWM_Level() Error " + e);
        }
    };
    self.Circulating_Fan_Step_PWM_Level_Up = async function (address_ID, step_lvl) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            
            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    circulating_fan_api_mqtt.Circulating_Fan_Step_PWM_Level_Up(address_ID, step_lvl);
                }
            }
            else{
                circulating_fan_api_mqtt.Circulating_Fan_Step_PWM_Level_Up(address_ID, step_lvl);
            }
        }
        catch (e) {
            debug("[Circulating_Fan_API] Circulating_Fan_Step_PWM_Level_Up() Error " + e);
        }
    };
    self.Circulating_Fan_Step_PWM_Level_Down = async function (address_ID, step_lvl) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            
            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    circulating_fan_api_mqtt.Circulating_Fan_Step_PWM_Level_Down(address_ID, step_lvl);
                }
            }
            else{
                circulating_fan_api_mqtt.Circulating_Fan_Step_PWM_Level_Down(address_ID, step_lvl);
            }
        }
        catch (e) {
            debug("[Circulating_Fan_API] Circulating_Fan_Step_PWM_Level_Down() Error " + e);
        }
    };
};

module.exports = Circulating_Fan_API;

var debug = require('debug')(require('path').basename(__filename));

var Address_MGR = require('../../Util/Address_MGR.js');
var address_mgr = new Address_MGR();

var Air_Valve_API_MQTT = require('../../MQTT/Device_MGMT/Gas/Air_Valve_API_MQTT.js');
var air_wave_api_mqtt = new Air_Valve_API_MQTT();

var Air_Valve_API = function () {
    var self = this;
    
    self.Air_Valve_Get_Num_Of_Switch = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }

            var result = null;
            
            if(address_info.target_network=="TCP/IP")
            {
                result = await air_wave_api_mqtt.Air_Valve_Get_Num_Of_Switch(address_ID);
            }

            return result;
        }
        catch (e) {
            debug("[Air_Valve_API] Air_Valve_Get_Num_Of_Switch() Error " + e);
        }
    };
    self.Air_Valve_Get_Main_Switch_Status = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }

            var result = null;
            
            if(address_info.target_network=="TCP/IP")
            {
                result = await air_wave_api_mqtt.Air_Valve_Get_Main_Switch_Status(address_ID);
            }

            return result;
        }
        catch (e) {
            debug("[Air_Valve_API] Air_Valve_Get_Main_Switch_Status() Error " + e);
        }
    };
    self.Air_Valve_Get_Individual_Switch_Status = async function (address_ID, sw_index) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }

            var result = null;
            
            if(address_info.target_network=="TCP/IP")
            {
                result = await air_wave_api_mqtt.Air_Valve_Get_Individual_Switch_Status(address_ID, sw_index);
            }

            return result;
        }
        catch (e) {
            debug("[Air_Valve_API] Air_Valve_Get_Individual_Switch_Status() Error " + e);
        }
    };
    self.Air_Valve_Get_All_Switch_Status = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }

            var result = null;
            
            if(address_info.target_network=="TCP/IP")
            {
                result = await air_wave_api_mqtt.Air_Valve_Get_All_Switch_Status(address_ID);
            }

            return result;
        }
        catch (e) {
            debug("[Air_Valve_API] Air_Valve_Get_All_Switch_Status() Error " + e);
        }
    };
    self.Air_Valve_Set_Main_Switch_Enable_Disable = async function (address_ID, en_dis) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            
            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    air_wave_api_mqtt.Air_Valve_Set_Main_Switch_Enable_Disable(address_ID, en_dis);
                }
            }
            else{
                air_wave_api_mqtt.Air_Valve_Set_Main_Switch_Enable_Disable(address_ID, en_dis);
            }
        }
        catch (e) {
            debug("[Air_Valve_API] Air_Valve_Set_Main_Switch_Enable_Disable() Error " + e);
        }
    };
    self.Air_Valve_Set_Main_Switch_On_Off = async function (address_ID, on_off) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            
            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    air_wave_api_mqtt.Air_Valve_Set_Main_Switch_On_Off(address_ID, on_off);
                }
            }
            else{
                air_wave_api_mqtt.Air_Valve_Set_Main_Switch_On_Off(address_ID, on_off);
            }
        }
        catch (e) {
            debug("[Air_Valve_API] Air_Valve_Set_Main_Switch_On_Off() Error " + e);
        }
    };
    self.Air_Valve_Toggle_Main_Switch_Enable_Disable = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            
            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    air_wave_api_mqtt.Air_Valve_Toggle_Main_Switch_Enable_Disable(address_ID);
                }
            }
            else{
                air_wave_api_mqtt.Air_Valve_Toggle_Main_Switch_Enable_Disable(address_ID);
            }
        }
        catch (e) {
            debug("[Air_Valve_API] Air_Valve_Toggle_Main_Switch_Enable_Disable() Error " + e);
        }
    };
    self.Air_Valve_Toggle_Main_Switch_On_Off = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            
            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    air_wave_api_mqtt.Air_Valve_Toggle_Main_Switch_On_Off(address_ID);
                }
            }
            else{
                air_wave_api_mqtt.Air_Valve_Toggle_Main_Switch_On_Off(address_ID);
            }
        }
        catch (e) {
            debug("[Air_Valve_API] Air_Valve_Toggle_Main_Switch_On_Off() Error " + e);
        }
    };
    self.Air_Valve_Set_Individual_Switch_Enable_Disable = async function (address_ID, sw_index, en_dis) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            
            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    air_wave_api_mqtt.Air_Valve_Set_Individual_Switch_Enable_Disable(address_ID, sw_index, en_dis);
                }
            }
            else{
                air_wave_api_mqtt.Air_Valve_Set_Individual_Switch_Enable_Disable(address_ID, sw_index, en_dis);
            }
        }
        catch (e) {
            debug("[Air_Valve_API] Air_Valve_Set_Individual_Switch_Enable_Disable() Error " + e);
        }
    };
    self.Air_Valve_Set_Individual_Switch_On_Off = async function (address_ID, sw_index, on_off) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            
            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    air_wave_api_mqtt.Air_Valve_Set_Individual_Switch_On_Off(address_ID, sw_index, on_off);
                }
            }
            else{
                air_wave_api_mqtt.Air_Valve_Set_Individual_Switch_On_Off(address_ID, sw_index, on_off);
            }
        }
        catch (e) {
            debug("[Air_Valve_API] Air_Valve_Set_Individual_Switch_On_Off() Error " + e);
        }
    };
    self.Air_Valve_Toggle_Individual_Switch_Enable_Disable = async function (address_ID, sw_index, en_dis) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            
            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    air_wave_api_mqtt.Air_Valve_Toggle_Individual_Switch_Enable_Disable(address_ID, sw_index, en_dis);
                }
            }
            else{
                air_wave_api_mqtt.Air_Valve_Toggle_Individual_Switch_Enable_Disable(address_ID, sw_index, en_dis);
            }
        }
        catch (e) {
            debug("[Air_Valve_API] Air_Valve_Toggle_Individual_Switch_Enable_Disable() Error " + e);
        }
    };
    self.Air_Valve_Toggle_Individual_Switch_On_Off = async function (address_ID, sw_index, on_off) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            
            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    air_wave_api_mqtt.Air_Valve_Toggle_Individual_Switch_On_Off(address_ID, sw_index, on_off);
                }
            }
            else{
                air_wave_api_mqtt.Air_Valve_Toggle_Individual_Switch_On_Off(address_ID, sw_index, on_off);
            }
        }
        catch (e) {
            debug("[Air_Valve_API] Air_Valve_Toggle_Individual_Switch_On_Off() Error " + e);
        }
    };
}

module.exports = Air_Valve_API;
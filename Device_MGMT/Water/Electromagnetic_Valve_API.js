
var debug = require('debug')(require('path').basename(__filename));

var Address_MGR = require('../../Util/Address_MGR.js');
var address_mgr = new Address_MGR();

var EM_Valve_API_MQTT = require('../../MQTT/Device_MGMT/Water/Electromagnetic_Valve_API_MQTT.js');
var em_valve_api_mqtt = new EM_Valve_API_MQTT();

var EM_Valve_API = function () {
    var self = this;
    
    self.EM_Valve_Get_Num_Of_Switch = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }

            var result = null;
            
            if(address_info.target_network=="TCP/IP")
            {
                result = await em_valve_api_mqtt.EM_Valve_Get_Num_Of_Switch(address_ID);
            }

            return result;
        }
        catch (e) {
            debug("[Electromagnetic_Valve_API] EM_Valve_Get_Num_Of_Switch() Error " + e);
        }
    };
    self.EM_Valve_Get_Main_Switch_Status = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }

            var result = null;
            
            if(address_info.target_network=="TCP/IP")
            {
                result = await em_valve_api_mqtt.EM_Valve_Get_Main_Switch_Status(address_ID);
            }

            return result;
        }
        catch (e) {
            debug("[Electromagnetic_Valve_API] EM_Valve_Get_Main_Switch_Status() Error " + e);
        }
    };
    self.EM_Valve_Get_Individual_Switch_Status = async function (address_ID, sw_index) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }

            var result = null;
            
            if(address_info.target_network=="TCP/IP")
            {
                result = await em_valve_api_mqtt.EM_Valve_Get_Individual_Switch_Status(address_ID, sw_index);
            }

            return result;
        }
        catch (e) {
            debug("[Electromagnetic_Valve_API] EM_Valve_Get_Individual_Switch_Status() Error " + e);
        }
    };
    self.EM_Valve_Get_All_Switch_Status = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }

            var result = null;
            
            if(address_info.target_network=="TCP/IP")
            {
                result = await em_valve_api_mqtt.EM_Valve_Get_All_Switch_Status(address_ID);
            }

            return result;
        }
        catch (e) {
            debug("[Electromagnetic_Valve_API] EM_Valve_Get_All_Switch_Status() Error " + e);
        }
    };
    self.EM_Valve_Main_Switch_Enable_Disable = async function (address_ID, en_dis) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            
            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    em_valve_api_mqtt.EM_Valve_Main_Switch_Enable_Disable(address_ID, en_dis);
                }
            }
            else{
                em_valve_api_mqtt.EM_Valve_Main_Switch_Enable_Disable(address_ID, en_dis);
            }
        }
        catch (e) {
            debug("[Electromagnetic_Valve_API] EM_Valve_Main_Switch_Enable_Disable() Error " + e);
        }
    };
    self.EM_Valve_Main_Switch_On_Off = async function (address_ID, on_off) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            
            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    em_valve_api_mqtt.EM_Valve_Main_Switch_On_Off(address_ID, on_off);
                }
            }
            else{
                em_valve_api_mqtt.EM_Valve_Main_Switch_On_Off(address_ID, on_off);
            }
        }
        catch (e) {
            debug("[Electromagnetic_Valve_API] EM_Valve_Main_Switch_On_Off() Error " + e);
        }
    };
    self.EM_Valve_Individual_Switch_Enable_Disable = async function (address_ID, sw_index, en_dis) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            
            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    em_valve_api_mqtt.EM_Valve_Individual_Switch_Enable_Disable(address_ID, sw_index, en_dis);
                }
            }
            else{
                em_valve_api_mqtt.EM_Valve_Individual_Switch_Enable_Disable(address_ID, sw_index, en_dis);
            }
        }
        catch (e) {
            debug("[Electromagnetic_Valve_API] EM_Valve_Individual_Switch_Enable_Disable() Error " + e);
        }
    };
    self.EM_Valve_Individual_Switch_On_Off = async function (address_ID, sw_index, on_off) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            
            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    em_valve_api_mqtt.EM_Valve_Individual_Switch_Enable_Disable(address_ID, sw_index, on_off);
                }
            }
            else{
                em_valve_api_mqtt.EM_Valve_Individual_Switch_Enable_Disable(address_ID, sw_index, on_off);
            }
        }
        catch (e) {
            debug("[Electromagnetic_Valve_API] EM_Valve_Individual_Switch_On_Off() Error " + e);
        }
    };
};

module.exports = EM_Valve_API;
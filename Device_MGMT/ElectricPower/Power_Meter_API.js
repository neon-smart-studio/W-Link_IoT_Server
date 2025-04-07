
var debug = require('debug')(require('path').basename(__filename));

var Address_MGR = require('../../Util/Address_MGR.js');
var address_mgr = new Address_MGR();

var Power_Meter_API_MQTT = require('../../MQTT/Device_MGMT/ElectricPower/Power_Meter_API_MQTT.js');
var power_meter_api_mqtt = new Power_Meter_API_MQTT();

var Power_Meter_API = function () {
    var self = this;
    
    self.Get_Num_Of_Power_Meter = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }

            var result = null;

            if(address_info.target_network=="TCP/IP")
            {
                result = await power_meter_api_mqtt.Get_Num_Of_Power_Meter(address_ID);
            }

            return result;
        }
        catch (e) {
            debug("[Power_Meter_API] Get_Num_Of_Power_Meter() Error " + e);
        }
    };
    self.Get_Power_Meter_Individual_Meter_Status = async function (address_ID, meter_index) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }

            var result = null;

            if(address_info.target_network=="TCP/IP")
            {
                result = await power_meter_api_mqtt.Get_Power_Meter_Individual_Meter_Status(address_ID, meter_index);
            }

            return result;
        }
        catch (e) {
            debug("[Power_Meter_API] Get_Power_Meter_Individual_Meter_Status() Error " + e);
        }
    };
    self.Get_Power_Meter_All_Meter_Status = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }

            var result = null;

            if(address_info.target_network=="TCP/IP")
            {
                result = await power_meter_api_mqtt.Get_Power_Meter_All_Meter_Status(address_ID);
            }

            return result;
        }
        catch (e) {
            debug("[Power_Meter_API] Get_Power_Meter_All_Meter_Status() Error " + e);
        }
    };
    self.Power_Meter_Set_Individual_Meter_On_Off = async function (address_ID, meter_index, on_off) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);

            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    power_meter_api_mqtt.Power_Meter_Set_Individual_Meter_On_Off(address_ID, meter_index, on_off);
                }
            }
            else{
                power_meter_api_mqtt.Power_Meter_Set_Individual_Meter_On_Off(address_ID, meter_index, on_off);
            }
        }
        catch (e) {
            debug("[Power_Meter_API] Power_Meter_Individual_Meter_On_Off() Error " + e);
        }
    };
    self.Power_Meter_Toggle_Individual_Meter_On_Off = async function (address_ID, meter_index) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);

            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    power_meter_api_mqtt.Power_Meter_Toggle_Individual_Meter_On_Off(address_ID, meter_index);
                }
            }
            else{
                power_meter_api_mqtt.Power_Meter_Toggle_Individual_Meter_On_Off(address_ID, meter_index);
            }
        }
        catch (e) {
            debug("[Power_Meter_API] Power_Meter_Toggle_Individual_Meter_On_Off() Error " + e);
        }
    };
    self.Power_Meter_Set_All_Meter_On_Off = async function (address_ID, on_off) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);

            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    power_meter_api_mqtt.Power_Meter_Set_All_Meter_On_Off(address_ID, on_off);
                }
            }
            else{
                power_meter_api_mqtt.Power_Meter_Set_All_Meter_On_Off(address_ID, on_off);
            }
        }
        catch (e) {
            debug("[Power_Meter_API] Power_Meter_All_Meter_On_Off() Error " + e);
        }
    };
    self.Power_Meter_Toggle_All_Meter_On_Off = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);

            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    power_meter_api_mqtt.Power_Meter_Toggle_All_Meter_On_Off(address_ID);
                }
            }
            else{
                power_meter_api_mqtt.Power_Meter_Toggle_All_Meter_On_Off(address_ID);
            }
        }
        catch (e) {
            debug("[Power_Meter_API] Power_Meter_Toggle_All_Meter_On_Off() Error " + e);
        }
    };
};

module.exports = Power_Meter_API;
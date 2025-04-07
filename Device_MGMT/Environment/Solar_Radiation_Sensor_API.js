
var debug = require('debug')(require('path').basename(__filename));

var Address_MGR = require('../../Util/Address_MGR.js');
var address_mgr = new Address_MGR();

var Solar_Radiation_Sensor_API_MQTT = require('../../MQTT/Device_MGMT/Environment/Solar_Radiation_Sensor_API_MQTT.js');
var solar_radiation_sensor_api_mqtt = new Solar_Radiation_Sensor_API_MQTT();

var Solar_Radiation_Sensor_API = function () {
    var self = this;
    
    self.Solar_Radiation_Sensor_Get_Num_Of_Sensor = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }

            var result = null;
            
            if(address_info.target_network=="TCP/IP")
            {
                result = await solar_radiation_sensor_api_mqtt.Solar_Radiation_Sensor_Get_Num_Of_Sensor(address_ID);
            }

            return result;
        }
        catch (e) {
            debug("[SolarRadiation_Sensor_API] Solar_Radiation_Sensor_Get_Num_Of_Sensor() Error " + e);
        }
    };
    self.Solar_Radiation_Sensor_Get_Individual_Sensor_Measure = async function (address_ID, sensor_index) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }

            var result = null;
            
            if(address_info.target_network=="TCP/IP")
            {
                result = await solar_radiation_sensor_api_mqtt.Solar_Radiation_Sensor_Get_Individual_Sensor_Measure(address_ID, sensor_index);
            }

            return result;
        }
        catch (e) {
            debug("[SolarRadiation_Sensor_API] Solar_Radiation_Sensor_Get_Individual_Sensor_Measure() Error " + e);
        }
    };
    self.Solar_Radiation_Sensor_Get_All_Sensor_Measure = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }

            var result = null;
            
            if(address_info.target_network=="TCP/IP")
            {
                result = await solar_radiation_sensor_api_mqtt.Solar_Radiation_Sensor_Get_All_Sensor_Measure(address_ID);
            }

            return result;
        }
        catch (e) {
            debug("[SolarRadiation_Sensor_API] Solar_Radiation_Sensor_Get_All_Sensor_Measure() Error " + e);
        }
    };
    self.Solar_Radiation_Sensor_Get_Individual_Sensor_Info = async function (address_ID, sensor_index) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }

            var result = null;
            
            if(address_info.target_network=="TCP/IP")
            {
                result = await solar_radiation_sensor_api_mqtt.Solar_Radiation_Sensor_Get_Individual_Sensor_Info(address_ID, sensor_index);
            }

            return result;
        }
        catch (e) {
            debug("[SolarRadiation_Sensor_API] Solar_Radiation_Sensor_Get_Individual_Sensor_Info() Error " + e);
        }
    };
    self.Solar_Radiation_Sensor_Get_All_Sensor_Info = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }
            
            var result = null;
            
            if(address_info.target_network=="TCP/IP")
            {
                result = await solar_radiation_sensor_api_mqtt.Solar_Radiation_Sensor_Get_All_Sensor_Info(address_ID);
            }

            return result;
        }
        catch (e) {
            debug("[SolarRadiation_Sensor_API] Solar_Radiation_Sensor_Get_All_Sensor_Info() Error " + e);
        }
    };
};

module.exports = Solar_Radiation_Sensor_API;

var debug = require('debug')(require('path').basename(__filename));

var Address_MGR = require('../../Util/Address_MGR.js');
var address_mgr = new Address_MGR();

var Pressure_Sensor_API_MQTT = require('../../MQTT/Device_MGMT/Environment/Pressure_Sensor_API_MQTT.js');
var pressure_sensor_api_mqtt = new Pressure_Sensor_API_MQTT();

var Pressure_Sensor_API = function () {
    var self = this;
    
    self.Pressure_Sensor_Get_Num_Of_Sensor = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }
            
            var result = null;
            
            if(address_info.target_network=="TCP/IP")
            {
                result = await pressure_sensor_api_mqtt.Pressure_Sensor_Get_Num_Of_Sensor(address_ID);
            }
            else if(address_info.target_network=="Zigbee")
            {
            }

            return result;
        }
        catch (e) {
            debug("[Pressure_Sensor_API] Pressure_Sensor_Get_Num_Of_Sensor() Error " + e);
        }
    };
    self.Pressure_Sensor_Get_Individual_Sensor_Status = async function (address_ID, sensor_index) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }
            
            var result = null;
            
            if(address_info.target_network=="TCP/IP")
            {
                result = await pressure_sensor_api_mqtt.Pressure_Sensor_Get_Individual_Sensor_Status(address_ID, sensor_index);
            }
            else if(address_info.target_network=="Zigbee")
            {
            }

            return result;
        }
        catch (e) {
            debug("[Pressure_Sensor_API] Pressure_Sensor_Get_Individual_Sensor_Status() Error " + e);
        }
    };
    self.Pressure_Sensor_Get_All_Sensor_Status = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }
            
            var result = null;
            
            if(address_info.target_network=="TCP/IP")
            {
                result = await pressure_sensor_api_mqtt.Pressure_Sensor_Get_All_Sensor_Status(address_ID);
            }
            else if(address_info.target_network=="Zigbee")
            {
            }

            return result;
        }
        catch (e) {
            debug("[Pressure_Sensor_API] Pressure_Sensor_Get_All_Sensor_Status() Error " + e);
        }
    };
    self.Pressure_Sensor_Set_Individual_Sensor_Resolution = async function (address_ID, sensor_index, resolution) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            
            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    pressure_sensor_api_mqtt.Pressure_Sensor_Set_Individual_Sensor_Resolution(address_ID, sensor_index, resolution);
                }
            }
            else{
                pressure_sensor_api_mqtt.Pressure_Sensor_Set_Individual_Sensor_Resolution(address_ID, sensor_index, resolution);
            }
        }
        catch (e) {
            debug("[Pressure_Sensor_API] Pressure_Sensor_Set_Individual_Sensor_Resolution() Error " + e);
        }
    };
    self.Pressure_Sensor_Set_All_Sensor_Resolution = async function (address_ID, resolution) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            
            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    pressure_sensor_api_mqtt.Pressure_Sensor_Set_All_Sensor_Resolution(address_ID, resolution);
                }
            }
            else{
                pressure_sensor_api_mqtt.Pressure_Sensor_Set_All_Sensor_Resolution(address_ID, resolution);
            }
        }
        catch (e) {
            debug("[Pressure_Sensor_API] Pressure_Sensor_Set_All_Sensor_Resolution() Error " + e);
        }
    };
};

module.exports = Pressure_Sensor_API;
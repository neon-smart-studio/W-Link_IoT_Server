
var debug = require('debug')(require('path').basename(__filename));

var Address_MGR = require('../../Util/Address_MGR.js');
var address_mgr = new Address_MGR();

var CO2_Sensor_API_MQTT = require('../../MQTT/Device_MGMT/Gas/CO2_Sensor_API_MQTT.js');
var co2_sensor_api_mqtt = new CO2_Sensor_API_MQTT();

var CO2_Sensor_API = function () {
    var self = this;
    
    self.CO2_Sensor_Get_Num_Of_Sensor = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }
            
            var result = null;
            
            if(address_info.target_network=="TCP/IP")
            {
                result = await co2_sensor_api_mqtt.CO2_Sensor_Get_Num_Of_Sensor(address_ID);
            }
            
            return result;
        }
        catch (e) {
            debug("[CO2_Sensor_API] CO2_Sensor_Get_Num_Of_Sensor() Error " + e);
        }
    };
    self.CO2_Sensor_Get_Individual_Sensor_Status = async function (address_ID, sensor_index) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }
            
            var result = null;
            
            if(address_info.target_network=="TCP/IP")
            {
                result = await co2_sensor_api_mqtt.CO2_Sensor_Get_Individual_Sensor_Status(address_ID, sensor_index);
            }
            
            return result;
        }
        catch (e) {
            debug("[CO2_Sensor_API] CO2_Sensor_Get_Individual_Sensor_Status() Error " + e);
        }
    };
    self.CO2_Sensor_Get_All_Sensor_Status = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }
            
            var result = null;
            
            if(address_info.target_network=="TCP/IP")
            {
                result = await co2_sensor_api_mqtt.CO2_Sensor_Get_All_Sensor_Status(address_ID);
            }
            
            return result;
        }
        catch (e) {
            debug("[CO2_Sensor_API] CO2_Sensor_Get_All_Sensor_Status() Error " + e);
        }
    };
};

module.exports = CO2_Sensor_API;
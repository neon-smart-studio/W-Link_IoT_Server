
var debug = require('debug')(require('path').basename(__filename));

var Address_MGR = require('../../Util/Address_MGR.js');
var address_mgr = new Address_MGR();

var Soil_EC_Sensor_API_MQTT = require('../../MQTT/Device_MGMT/Environment/Soil_EC_Sensor_API_MQTT.js');
var soil_ec_sensor_api_mqtt = new Soil_EC_Sensor_API_MQTT();

var Soil_EC_Sensor_API = function () {
    var self = this;
    
    self.Soil_EC_Sensor_Get_Num_Of_Sensor = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }

            var result = null;
            
            if(address_info.target_network=="TCP/IP")
            {
                result = await soil_ec_sensor_api_mqtt.Soil_EC_Sensor_Get_Num_Of_Sensor(address_ID);
            }

            return result;
        }
        catch (e) {
            debug("[Soil_EC_Sensor_API] Soil_EC_Sensor_Get_Num_Of_Sensor() Error " + e);
        }
    };
    self.Soil_EC_Sensor_Get_Individual_Sensor_Measure = async function (address_ID, sensor_index) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }

            var result = null;
            
            if(address_info.target_network=="TCP/IP")
            {
                result = await soil_ec_sensor_api_mqtt.Soil_EC_Sensor_Get_Individual_Sensor_Measure(address_ID, sensor_index);
            }

            return result;
        }
        catch (e) {
            debug("[Soil_EC_Sensor_API] Soil_EC_Sensor_Get_Individual_Sensor_Measure() Error " + e);
        }
    };
    self.Soil_EC_Sensor_Get_All_Sensor_Measure = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }
            
            var result = null;
            
            if(address_info.target_network=="TCP/IP")
            {
                result = await soil_ec_sensor_api_mqtt.Soil_EC_Sensor_Get_All_Sensor_Measure(address_ID);
            }

            return result;
        }
        catch (e) {
            debug("[Soil_EC_Sensor_API] Soil_EC_Sensor_Get_All_Sensor_Measure() Error " + e);
        }
    };
};

module.exports = Soil_EC_Sensor_API;
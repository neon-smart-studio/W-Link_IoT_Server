
var debug = require('debug')(require('path').basename(__filename));

var Address_MGR = require('../../Util/Address_MGR.js');
var address_mgr = new Address_MGR();

var TVOC_Sensor_API_MQTT = require('../../MQTT/Device_MGMT/Gas/TVOC_Sensor_API_MQTT.js');
var tvoc_sensor_api_mqtt = new TVOC_Sensor_API_MQTT();

var TVOC_Sensor_API = function () {
    var self = this;
    
    self.TVOC_Sensor_Get_Num_Of_Sensor = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }
            
            var result = null;
            
            if(address_info.target_network=="TCP/IP")
            {
                result = await tvoc_sensor_api_mqtt.TVOC_Sensor_Get_Num_Of_Sensor(address_ID);
            }
            
            return result;
        }
        catch (e) {
            debug("[TVOC_Sensor_API] TVOC_Sensor_Get_Num_Of_Sensor() Error " + e);
        }
    };
    self.TVOC_Sensor_Get_Individual_Sensor_Status = async function (address_ID, sensor_index) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }
            
            var result = null;
            
            if(address_info.target_network=="TCP/IP")
            {
                result = await tvoc_sensor_api_mqtt.TVOC_Sensor_Get_Individual_Sensor_Status(address_ID, sensor_index);
            }
            
            return result;
        }
        catch (e) {
            debug("[TVOC_Sensor_API] TVOC_Sensor_Get_Individual_Sensor_Status() Error " + e);
        }
    };
    self.TVOC_Sensor_Get_All_Sensor_Status = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }
            
            var result = null;
            
            if(address_info.target_network=="TCP/IP")
            {
                result = await tvoc_sensor_api_mqtt.TVOC_Sensor_Get_All_Sensor_Status(address_ID);
            }
            
            return result;
        }
        catch (e) {
            debug("[TVOC_Sensor_API] TVOC_Sensor_Get_All_Sensor_Status() Error " + e);
        }
    };
};

module.exports = TVOC_Sensor_API;
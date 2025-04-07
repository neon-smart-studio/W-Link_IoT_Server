
var debug = require('debug')(require('path').basename(__filename));

var Address_MGR = require('../../Util/Address_MGR.js');
var address_mgr = new Address_MGR();

var PM2_5_Sensor_API_MQTT = require('../../MQTT/Device_MGMT/Environment/PM2_5_Sensor_API_MQTT.js');
var pm2_5_sensor_api_mqtt = new PM2_5_Sensor_API_MQTT();

var PM2_5_Sensor_API = function () {
    var self = this;
    
    self.PM2_5_Sensor_Get_Num_Of_Sensor = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }

            var result = null;
            
            if(address_info.target_network=="TCP/IP")
            {
                result = await pm2_5_sensor_api_mqtt.PM2_5_Sensor_Get_Num_Of_Sensor(address_ID);
            }

            return result;
        }
        catch (e) {
            debug("[PM2.5_Sensor_API] PM2_5_Sensor_Get_Num_Of_Sensor() Error " + e);
        }
    };
    self.PM2_5_Sensor_Get_Individual_Sensor_Status = async function (address_ID, sensor_index) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }
            
            var result = null;
            
            if(address_info.target_network=="TCP/IP")
            {
                result = await pm2_5_sensor_api_mqtt.PM2_5_Sensor_Get_Individual_Sensor_Status(address_ID, sensor_index);
            }

            return result;
        }
        catch (e) {
            debug("[PM2.5_Sensor_API] PM2_5_Sensor_Get_Individual_Sensor_Status() Error " + e);
        }
    };
    self.PM2_5_Sensor_Get_All_Sensor_Status = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }
            
            var result = null;
            
            if(address_info.target_network=="TCP/IP")
            {
                result = await pm2_5_sensor_api_mqtt.PM2_5_Sensor_Get_All_Sensor_Status(address_ID);
            }

            return result;
        }
        catch (e) {
            debug("[PM2.5_Sensor_API] PM2_5_Sensor_Get_All_Sensor_Status() Error " + e);
        }
    };
};

module.exports = PM2_5_Sensor_API;
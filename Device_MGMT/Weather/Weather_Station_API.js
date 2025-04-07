
var debug = require('debug')(require('path').basename(__filename));

var Address_MGR = require('../../Util/Address_MGR.js');
var address_mgr = new Address_MGR();

var Weather_Station_API_MQTT = require('../../MQTT/Device_MGMT/Weather/Weather_Station_API_MQTT.js');
var weather_station_api_mqtt = new Weather_Station_API_MQTT();

var Weather_Station_API = function () {
    var self = this;
    
    self.Weather_Station_Get_Current_Measure = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }
            
            var result = null;
            
            if(address_info.target_network=="TCP/IP")
            {
                result = await weather_station_api_mqtt.Weather_Station_Get_Current_Measure(address_ID);
            }

            return result;
        }
        catch (e) {
            debug("[Weather_Station_API] Weather_Station_Get_All_Sensor_Status() Error " + e);
        }
    };
}

module.exports = Weather_Station_API;
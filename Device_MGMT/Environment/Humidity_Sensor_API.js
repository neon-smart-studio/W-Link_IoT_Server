
var debug = require('debug')(require('path').basename(__filename));

var Address_MGR = require('../../Util/Address_MGR.js');
var address_mgr = new Address_MGR();

var Humidity_Sensor_API_MQTT = require('../../MQTT/Device_MGMT/Environment/Humidity_Sensor_API_MQTT.js');
var humidity_sensor_api_mqtt = new Humidity_Sensor_API_MQTT();

var Humidity_Sensor_API_Zigbee = require('../../Zigbee/Device_MGMT/Environment/Humidity_Sensor_API_Zigbee.js');
var humidity_sensor_api_zigbee = new Humidity_Sensor_API_Zigbee();

var Humidity_Sensor_API = function () {
    var self = this;
    
    self.Humidity_Sensor_Get_Num_Of_Sensor = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }

            var result = null;
            
            if(address_info.target_network=="TCP/IP")
            {
                result = await humidity_sensor_api_mqtt.Humidity_Sensor_Get_Num_Of_Sensor(address_ID);
            }
            else if(address_info.target_network=="Zigbee")
            {
                result = await humidity_sensor_api_zigbee.Humidity_Sensor_Get_Num_Of_Sensor(address_ID);
            }

            if(result==null)
            {
                result = {
                    timeout: true,
                    username: 'everyone',
                    device_ID: address_ID
                };
            }
            else{
                if(result.timeout==null)
                {
                    result["timeout"] = false;
                }
                if(result.username==null)
                {
                    result["username"] = 'everyone';
                }
                if(result.device_ID==null)
                {
                    result["device_ID"] = address_ID;
                }
            }
            return result;
        }
        catch (e) {
            debug("[Humidity_Sensor_API] Humidity_Sensor_Get_Num_Of_Sensor() Error " + e);
        }
    };
    self.Humidity_Sensor_Get_Individual_Sensor_Status = async function (address_ID, sensor_index) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }

            var result = null;
            
            if(address_info.target_network=="TCP/IP")
            {
                result = await humidity_sensor_api_mqtt.Humidity_Sensor_Get_Individual_Sensor_Status(address_ID, sensor_index);
            }
            else if(address_info.target_network=="Zigbee")
            {
                result = await humidity_sensor_api_zigbee.Humidity_Sensor_Get_Individual_Sensor_Status(address_ID, sensor_index);
            }

            if(result==null)
            {
                result = {
                    timeout: true,
                    username: 'everyone',
                    device_ID: address_ID
                };
            }
            else{
                if(result.timeout==null)
                {
                    result["timeout"] = false;
                }
                if(result.username==null)
                {
                    result["username"] = 'everyone';
                }
                if(result.device_ID==null)
                {
                    result["device_ID"] = address_ID;
                }
            }
            return result;
        }
        catch (e) {
            debug("[Humidity_Sensor_API] Humidity_Sensor_Get_Individual_Sensor_Status() Error " + e);
        }
    };
    self.Humidity_Sensor_Get_All_Sensor_Status = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }

            var result = null;
            
            if(address_info.target_network=="TCP/IP")
            {
                result = await humidity_sensor_api_mqtt.Humidity_Sensor_Get_All_Sensor_Status(address_ID);
            }
            else if(address_info.target_network=="Zigbee")
            {
                result = await humidity_sensor_api_zigbee.Humidity_Sensor_Get_All_Sensor_Status(address_ID);
            }

            if(result==null)
            {
                result = {
                    timeout: true,
                    username: 'everyone',
                    device_ID: address_ID
                };
            }
            else{
                if(result.timeout==null)
                {
                    result["timeout"] = false;
                }
                if(result.username==null)
                {
                    result["username"] = 'everyone';
                }
                if(result.device_ID==null)
                {
                    result["device_ID"] = address_ID;
                }
            }
            return result;
        }
        catch (e) {
            debug("[Humidity_Sensor_API] Humidity_Sensor_Get_All_Sensor_Status() Error " + e);
        }
    };
    self.Humidity_Sensor_Set_Individual_Sensor_Resolution = async function (address_ID, sensor_index, resolution) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            
            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    humidity_sensor_api_mqtt.Humidity_Sensor_Set_Individual_Sensor_Resolution(address_ID, sensor_index, resolution);
                }
                else if(address_info.target_network=="Zigbee")
                {
                }
            }
            else{
                humidity_sensor_api_mqtt.Humidity_Sensor_Set_Individual_Sensor_Resolution(address_ID, sensor_index, resolution);
            }
        }
        catch (e) {
            debug("[Humidity_Sensor_API] Humidity_Sensor_Set_Individual_Sensor_Resolution() Error " + e);
        }
    };
    self.Humidity_Sensor_Set_All_Sensor_Resolution = async function (address_ID, resolution) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            
            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    humidity_sensor_api_mqtt.Humidity_Sensor_Set_All_Sensor_Resolution(address_ID, resolution);
                }
                else if(address_info.target_network=="Zigbee")
                {
                }
            }
            else{
                humidity_sensor_api_mqtt.Humidity_Sensor_Set_All_Sensor_Resolution(address_ID, resolution);
            }
        }
        catch (e) {
            debug("[Humidity_Sensor_API] Humidity_Sensor_Set_All_Sensor_Resolution() Error " + e);
        }
    };
}

module.exports = Humidity_Sensor_API;
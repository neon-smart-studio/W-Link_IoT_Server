
var debug = require('debug')(require('path').basename(__filename));

var Address_MGR = require('../../Util/Address_MGR.js');
var address_mgr = new Address_MGR();

var Light_Sensor_API_MQTT = require('../../MQTT/Device_MGMT/Lighting/Light_Sensor_API_MQTT.js');
var light_sensor_api_mqtt = new Light_Sensor_API_MQTT();

var Light_Sensor_API_Zigbee = require('../../Zigbee/Device_MGMT/Lighting/Light_Sensor_API_Zigbee.js');
var light_sensor_api_zigbee = new Light_Sensor_API_Zigbee();

var Light_Sensor_API = function () {
    var self = this;

    self.Light_Sensor_Get_Num_Of_Sensor = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }

            var result = null;

            if(address_info.target_network=="TCP/IP")
            {
                result = await light_sensor_api_mqtt.Light_Sensor_Get_Num_Of_Sensor(address_ID);
            }
            else if(address_info.target_network=="Zigbee")
            {
                result = await light_sensor_api_zigbee.Light_Sensor_Get_Num_Of_Sensor(address_ID);
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
            debug("[Light_Sensor_API] Light_Sensor_Get_Num_Of_Sensor() Error " + e);
        }
    };
    self.Light_Sensor_Get_Individual_Sensor_Status = async function (address_ID, sensor_index) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }

            var result = null;

            if(address_info.target_network=="TCP/IP")
            {
                result = await light_sensor_api_mqtt.Light_Sensor_Get_Individual_Sensor_Status(address_ID, sensor_index);
            }
            else if(address_info.target_network=="Zigbee")
            {
                result = await light_sensor_api_zigbee.Light_Sensor_Get_Individual_Sensor_Status(address_ID, sensor_index);
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
            debug("[Light_Sensor_API] Light_Sensor_Get_Individual_Sensor_Status() Error " + e);
        }
    };
    self.Light_Sensor_Get_All_Sensor_Status = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }

            var result = null;

            if(address_info.target_network=="TCP/IP")
            {
                result = await light_sensor_api_mqtt.Light_Sensor_Get_All_Sensor_Status(address_ID);
            }
            else if(address_info.target_network=="Zigbee")
            {
                result = await light_sensor_api_zigbee.Light_Sensor_Get_All_Sensor_Status(address_ID);
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
            debug("[Light_Sensor_API] Light_Sensor_Get_All_Sensor_Status() Error " + e);
        }
    };
    self.Light_Sensor_Set_Individual_Sensor_Resolution = async function (address_ID, sensor_index, resolution) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);

            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    light_sensor_api_mqtt.Light_Sensor_Set_Individual_Sensor_Resolution(address_ID, sensor_index, resolution);
                }
            }
            else{
                light_sensor_api_mqtt.Light_Sensor_Set_Individual_Sensor_Resolution(address_ID, sensor_index, resolution);
            }
        }
        catch (e) {
            debug("[Light_Sensor_API] Light_Sensor_Set_Individual_Sensor_Resolution() Error " + e);
        }
    };
    self.Light_Sensor_Set_All_Sensor_Resolution = async function (address_ID, resolution) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);

            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    light_sensor_api_mqtt.Light_Sensor_Set_All_Sensor_Resolution(address_ID, resolution);
                }
            }
            else{
                light_sensor_api_mqtt.Light_Sensor_Set_All_Sensor_Resolution(address_ID, resolution);
            }
        }
        catch (e) {
            debug("[Light_Sensor_API] Light_Sensor_Set_All_Sensor_Resolution() Error " + e);
        }
    };
};

module.exports = Light_Sensor_API;

var debug = require('debug')(require('path').basename(__filename));

var Address_MGR = require('../../Util/Address_MGR.js');
var address_mgr = new Address_MGR();

var Door_Window_Sensor_API_MQTT = require('../../MQTT/Device_MGMT/Accessories/Door_Window_Sensor_API_MQTT.js');
var door_window_sensor_api_mqtt = new Door_Window_Sensor_API_MQTT();
/*
var Door_Window_Sensor_API_Zigbee = require('../../Zigbee/Device_MGMT/Accessories/Door_Window_Sensor_API_Zigbee.js');
var door_window_sensor_api_zigbee = new Door_Window_Sensor_API_Zigbee();
*/

var Door_Window_Sensor_API = function () {
    var self = this;
    
    self.Get_Door_Window_Sensor_Support_Actions = async function(username, address_ID)
    {
        try{
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }

            return {
                support_actions: ["open", "close"]
            };
        }
        catch(e)
        {
          debug("[Door_Window_Sensor_API] Get_Door_Window_Sensor_Support_Actions() Error " + e);
        }
    };
    self.Get_Num_Of_Door_Window_Sensor = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }
            
            var result = null;

            if(address_info.target_network=="TCP/IP")
            {
                result =await door_window_sensor_api_mqtt.Get_Num_Of_Door_Window_Sensor(address_ID);
            }
            else if(address_info.target_network=="Zigbee")
            {
            }

            return result;
        }
        catch (e) {
            debug("[Door_Window_Sensor_API] Get_Num_Of_Door_Window_Sensor() Error " + e);
        }
    };
};

module.exports = Door_Window_Sensor_API;
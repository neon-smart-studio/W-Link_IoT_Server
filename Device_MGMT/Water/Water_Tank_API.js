
var debug = require('debug')(require('path').basename(__filename));

var Address_MGR = require('../../Util/Address_MGR.js');
var address_mgr = new Address_MGR();

var Water_Tank_API_MQTT = require('../../MQTT/Device_MGMT/Water/Water_Tank_API_MQTT.js');
var water_tank_api_mqtt = new Water_Tank_API_MQTT();

var Water_Tank_API = function () {
    var self = this;
    
    self.Water_Tank_Get_Num_Of_Tank = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }
            
            var result = null;
            
            if(address_info.target_network=="TCP/IP")
            {
                result = await water_tank_api_mqtt.Water_Tank_Get_Num_Of_Tank(address_ID);
            }

            return result;
        }
        catch (e) {
            debug("[Water_Tank_API] Water_Tank_Get_Num_Of_Tank() Error " + e);
        }
    };
    self.Water_Tank_Get_Individual_Tank_Status = async function (address_ID, tank_index) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }
            
            var result = null;
            
            if(address_info.target_network=="TCP/IP")
            {
                result = await water_tank_api_mqtt.Water_Tank_Get_Individual_Tank_Status(address_ID, tank_index);
            }

            return result;
        }
        catch (e) {
            debug("[Water_Tank_API] Water_Tank_Get_Individual_Tank_Status() Error " + e);
        }
    };
    self.Water_Tank_Get_All_Tank_Status = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }
            
            var result = null;
            
            if(address_info.target_network=="TCP/IP")
            {
                result = await water_tank_api_mqtt.Water_Tank_Get_All_Tank_Status(address_ID);
            }

            return result;
        }
        catch (e) {
            debug("[Water_Tank_API] Water_Tank_Get_All_Tank_Status() Error " + e);
        }
    };
};

module.exports = Water_Tank_API;
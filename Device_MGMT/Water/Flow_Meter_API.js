
var debug = require('debug')(require('path').basename(__filename));

var Address_MGR = require('../../Util/Address_MGR.js');
var address_mgr = new Address_MGR();

var Flow_Meter_API_MQTT = require('../../MQTT/Device_MGMT/Water/Flow_Meter_API_MQTT.js');
var flow_meter_api_mqtt = new Flow_Meter_API_MQTT();

var Flow_Meter_API = function () {
    var self = this;
    
    self.Flow_Meter_Get_Num_Of_Flow_Sensor = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }
            
            var result = null;
            
            if(address_info.target_network=="TCP/IP")
            {
                result = await flow_meter_api_mqtt.Flow_Meter_Get_Num_Of_Flow_Sensor(address_ID);
            }
            else if(address_info.target_network=="Zigbee")
            {
            }

            return result;
        }
        catch (e) {
            debug("[Flow_Meter_API] Flow_Meter_Get_Num_Of_Flow_Sensor() Error " + e);
        }
    };
    self.Flow_Meter_Get_Individual_Sensor_Status = async function (address_ID, sensor_index) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }
            
            var result = null;
            
            if(address_info.target_network=="TCP/IP")
            {
                result = await flow_meter_api_mqtt.Flow_Meter_Get_Individual_Sensor_Status(address_ID, sensor_index);
            }
            else if(address_info.target_network=="Zigbee")
            {
            }

            return result;
        }
        catch (e) {
            debug("[Flow_Meter_API] Flow_Meter_Get_Individual_Sensor_Status() Error " + e);
        }
    };
    self.Flow_Meter_Get_All_Sensor_Status = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }
            
            var result = null;
            
            if(address_info.target_network=="TCP/IP")
            {
                result = await flow_meter_api_mqtt.Flow_Meter_Get_All_Sensor_Status(address_ID);
            }
            else if(address_info.target_network=="Zigbee")
            {
            }

            return result;
        }
        catch (e) {
            debug("[Flow_Meter_API] Flow_Meter_Get_All_Sensor_Status() Error " + e);
        }
    };
    self.Flow_Meter_Individual_Sensor_Enable_Disable = async function (address_ID, sensor_index, en_dis) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            
            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    flow_meter_api_mqtt.Flow_Meter_Individual_Sensor_Enable_Disable(address_ID, sensor_index, en_dis);
                }
                else if(address_info.target_network=="Zigbee")
                {
                }
            }
            else{
                flow_meter_api_mqtt.Flow_Meter_Individual_Sensor_Enable_Disable(address_ID, sensor_index, en_dis);
            }
        }
        catch (e) {
            debug("[Flow_Meter_API] Flow_Meter_Individual_Sensor_Enable_Disable() Error " + e);
        }
    };
};

module.exports = Flow_Meter_API;
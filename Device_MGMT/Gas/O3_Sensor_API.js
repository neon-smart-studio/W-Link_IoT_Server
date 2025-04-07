
var debug = require('debug')(require('path').basename(__filename));

var Address_MGR = require('../../Util/Address_MGR.js');
var address_mgr = new Address_MGR();

var O3_Sensor_API_MQTT = require('../../MQTT/Device_MGMT/Gas/O3_Sensor_API_MQTT.js');
var o3_sensor_api_mqtt = new O3_Sensor_API_MQTT();

var O3_Sensor_API = function () {
    var self = this;
    
    self.Set_All_O3_Sensor_Sensitivity = async function (address_ID, sensitivity_nA_PPM) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            
            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    o3_sensor_api_mqtt.Set_All_O3_Sensor_Sensitivity(address_ID, sensitivity_nA_PPM);
                }
            }
            else{
                o3_sensor_api_mqtt.Set_All_O3_Sensor_Sensitivity(address_ID, sensitivity_nA_PPM);
            }
        }
        catch (e) {
            debug("[O3_Sensor_API] Set_All_O3_Sensor_Sensitivity() Error " + e);
        }
    };
    self.Set_Individual_O3_Sensor_Resistance = async function (address_ID, sensor_index, sensor_resistance) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            
            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    o3_sensor_api_mqtt.Set_Individual_O3_Sensor_Resistance(address_ID, sensor_index, sensor_resistance);
                }
            }
            else{
                o3_sensor_api_mqtt.Set_Individual_O3_Sensor_Resistance(address_ID, sensor_index, sensor_resistance);
            }
        }
        catch (e) {
            debug("[O3_Sensor_API] Set_Individual_O3_Sensor_Resistance() Error " + e);
        }
    };
    self.Set_All_O3_Sensor_Resistance = async function (address_ID, sensor_resistance) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            
            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    o3_sensor_api_mqtt.Set_All_O3_Sensor_Resistance(address_ID, sensor_resistance);
                }
            }
            else{
                o3_sensor_api_mqtt.Set_All_O3_Sensor_Resistance(address_ID, sensor_resistance);
            }
        }
        catch (e) {
            debug("[O3_Sensor_API] Set_All_O3_Sensor_Resistance() Error " + e);
        }
    };
    self.Set_Individual_O3_Sensor_Sensitivity_And_Resistance = async function (address_ID, sensitivity_nA_PPM, sensor_resistance) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            
            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    o3_sensor_api_mqtt.Set_Individual_O3_Sensor_Sensitivity_And_Resistance(address_ID, sensitivity_nA_PPM, sensor_resistance);
                }
            }
            else{
                o3_sensor_api_mqtt.Set_Individual_O3_Sensor_Sensitivity_And_Resistance(address_ID, sensitivity_nA_PPM, sensor_resistance);
            }
        }
        catch (e) {
            debug("[O3_Sensor_API] Set_Individual_O3_Sensor_Sensitivity_And_Resistance() Error " + e);
        }
    };
    self.O3_Sensor_Get_Num_Of_Sensor = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }
            
            var result = null;
            
            if(address_info.target_network=="TCP/IP")
            {
                result = await o3_sensor_api_mqtt.O3_Sensor_Get_Num_Of_Sensor(address_ID);
            }
            
            return result;
        }
        catch (e) {
            debug("[O3_Sensor_API] O3_Sensor_Get_Num_Of_Sensor() Error " + e);
        }
    };
    self.O3_Sensor_Get_Individual_Sensor_Status = async function (address_ID, sensor_index) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }
            
            var result = null;
            
            if(address_info.target_network=="TCP/IP")
            {
                result = await o3_sensor_api_mqtt.O3_Sensor_Get_Individual_Sensor_Status(address_ID, sensor_index);
            }
            
            return result;
        }
        catch (e) {
            debug("[O3_Sensor_API] O3_Sensor_Get_Individual_Sensor_Status() Error " + e);
        }
    };
    self.O3_Sensor_Get_All_Sensor_Status = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }
            
            var result = null;
            
            if(address_info.target_network=="TCP/IP")
            {
                result = await o3_sensor_api_mqtt.O3_Sensor_Get_All_Sensor_Status(address_ID);
            }
            
            return result;
        }
        catch (e) {
            debug("[O3_Sensor_API] O3_Sensor_Get_All_Sensor_Status() Error " + e);
        }
    };
    self.O3_Sensor_Get_Individual_Sensor_Info = async function (address_ID, sensor_index) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }
            
            var result = null;
            
            if(address_info.target_network=="TCP/IP")
            {
                result = await o3_sensor_api_mqtt.O3_Sensor_Get_Individual_Sensor_Info(address_ID, sensor_index);
            }
            
            return result;
        }
        catch (e) {
            debug("[O3_Sensor_API] O3_Sensor_Get_Individual_Sensor_Info() Error " + e);
        }
    };
    self.O3_Sensor_Get_All_Sensor_Info = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }
            
            var result = null;
            
            if(address_info.target_network=="TCP/IP")
            {
                result = await o3_sensor_api_mqtt.O3_Sensor_Get_All_Sensor_Info(address_ID);
            }
            
            return result;
        }
        catch (e) {
            debug("[O3_Sensor_API] O3_Sensor_Get_All_Sensor_Info() Error " + e);
        }
    };
}

module.exports = O3_Sensor_API;
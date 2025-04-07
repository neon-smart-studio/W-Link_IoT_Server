
var debug = require('debug')(require('path').basename(__filename));

var Address_MGR = require('../../Util/Address_MGR.js');
var address_mgr = new Address_MGR();

var Atmosphere_Box_API_MQTT = require('../../MQTT/Device_MGMT/AirQuality/Atmosphere_Box_API_MQTT.js');
var atmosphere_box_api_mqtt = new Atmosphere_Box_API_MQTT();

var Atmosphere_Box_API = function () {
    var self = this;
    
    self.Atmosphere_Box_Get_Support_Attributes = async function(address_ID)
    {
        try{
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }
            
            var result = null;

            if(address_info.target_network=="TCP/IP")
            {
                await atmosphere_box_api_mqtt.Atmosphere_Box_Record_Current_State(address_ID, state);
            }

            return result;
        }
        catch(e)
        {
          debug("[Atmosphere_Box_API] Atmosphere_Box_Record_Current_State() Error " + e);
        }
    };
    self.Set_Atmosphere_Box_CO_Sensor_Sensitivity = async function (address_ID, sensitivity_nA_PPM) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }
            
            if(address_info.target_network=="TCP/IP")
            {
                atmosphere_box_api_mqtt.Set_Atmosphere_Box_CO_Sensor_Sensitivity(address_ID, sensitivity_nA_PPM);
            }
        }
        catch (e) {
            debug("[Atmosphere_Box_API] Set_Atmosphere_Box_CO_Sensor_Sensitivity() Error " + e);
        }
    };
    self.Set_Atmosphere_Box_CO_Sensor_Resistance = async function (address_ID, sensor_resistance) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return;
            }
            
            if(address_info.target_network=="TCP/IP")
            {
                atmosphere_box_api_mqtt.Set_Atmosphere_Box_CO_Sensor_Resistance(address_ID, sensor_resistance);
            }
        }
        catch (e) {
            debug("[Atmosphere_Box_API] Set_Atmosphere_Box_CO_Sensor_Resistance() Error " + e);
        }
    };
    self.Set_Atmosphere_Box_CO_Sensor_Sensitivity_And_Resistance = async function (address_ID, sensitivity_nA_PPM, sensor_resistance) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return;
            }
            
            if(address_info.target_network=="TCP/IP")
            {
                atmosphere_box_api_mqtt.Set_Atmosphere_Box_CO_Sensor_Sensitivity_And_Resistance(address_ID, sensitivity_nA_PPM, sensor_resistance);
            }
        }
        catch (e) {
            debug("[Atmosphere_Box_API] Set_Atmosphere_Box_CO_Sensor_Sensitivity_And_Resistance() Error " + e);
        }
    };
    self.Atmosphere_Box_Get_Sensor_Status = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }
            
            var result = null;

            if(address_info.target_network=="TCP/IP")
            {
                result = await atmosphere_box_api_mqtt.Atmosphere_Box_Get_Sensor_Status(address_ID);
            }

            return result;
        }
        catch (e) {
            debug("[Atmosphere_Box_API] Atmosphere_Box_Get_All_Sensor_Status() Error " + e);
        }
    };
    self.Atmosphere_Box_Get_Sensor_Info = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }
            
            var result = null;

            if(address_info.target_network=="TCP/IP")
            {
                result = await atmosphere_box_api_mqtt.Atmosphere_Box_Get_Sensor_Info(address_ID);
            }

            return result;
        }
        catch (e) {
            debug("[Atmosphere_Box_API] Atmosphere_Box_Get_All_Sensor_Info() Error " + e);
        }
    };
}

module.exports = Atmosphere_Box_API;
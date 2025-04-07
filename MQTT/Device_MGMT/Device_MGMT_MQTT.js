
var debug = require('debug')(require('path').basename(__filename));

var Water_MQTT = require('./Water/Water_MQTT.js');
var water_mqtt = new Water_MQTT();
var Lighting_MQTT = require('./Lighting/Lighting_MQTT.js');
var lighting_mqtt = new Lighting_MQTT();
var Gas_MQTT = require('./Gas/Gas_MQTT.js');
var gas_mqtt = new Gas_MQTT();
var Environment_MQTT = require('./Environment/Environment_MQTT.js');
var environment_mqtt = new Environment_MQTT();
var ElectricPower_MQTT = require('./ElectricPower/ElectricPower_MQTT.js');
var electricpower_mqtt = new ElectricPower_MQTT();
var Air_Quality_MQTT = require('./AirQuality/Air_Quality_MQTT.js');
var air_quality_mqtt = new Air_Quality_MQTT();
var Weather_MQTT = require('./Weather/Weather_MQTT.js');
var weather_mqtt = new Weather_MQTT();
var Accessories_MQTT = require('./Accessories/Accessories_MQTT.js');
var accessories_mqtt = new Accessories_MQTT();

var Device_MGMT_API = require('../../Device_MGMT/Device_MGMT_API.js');
var device_mgmt_api = new Device_MGMT_API();

var MQTT_Device_Last_Registration_Time = [];
const MQTT_Device_Registration_Time_Min_Interval = 1000

var Device_MGMT_MQTT = function (){
    var self = this;
    
    self.Process_MQTT_Device_Registration_Event = function(username, device_ID, device_info_json_data)
    {
        try{
            var current_time_ms = Date.now();
            if(MQTT_Device_Last_Registration_Time[device_ID]!=null)
            {
                var diff_time = current_time_ms - MQTT_Device_Last_Registration_Time[device_ID];
                if(diff_time<MQTT_Device_Registration_Time_Min_Interval)
                {
                    return;
                }
            }

            if(device_info_json_data.network_type==null){
                debug("Invalid Network Type: " + device_info_json_data.network_type);
                return;
            }
            debug("Network Type: " + device_info_json_data.network_type);

            if(device_info_json_data.Device.device_type==null){
                debug("Invalid Device Type: " + device_info_json_data.Device.network_type);
                return;
            }
            debug("Device Type: " + device_info_json_data.Device.device_type);

            var devInf = {
                "device_ID":device_ID,
                "device_Name":device_info_json_data.Device.device_type,
                "network_Type":"TCP/IP",
                "protocol_Type": "MQTT",
                "device_Type":device_info_json_data.Device.device_type,
                "software_version":device_info_json_data.Version.software,
                "os_name":device_info_json_data.Version.os_name,
                "os_version":device_info_json_data.Version.os_version,
                "manufacture":device_info_json_data.Device.manufacture
            };

            if(device_info_json_data.Device.sensor_model!=null){
                devInf["sensor_model"] = device_info_json_data.Device.sensor_model;
            }

            MQTT_Device_Last_Registration_Time[device_ID] = current_time_ms;

            device_mgmt_api.Device_MGMT_Save_Device_Info(username, device_info_json_data.Device.device_type, device_ID, devInf);
        }
        catch(e)
        {
            debug("[Device_MGMT_MQTT] Process_MQTT_Device_Registration_Event() Error " + e);
        }
    }

    self.Device_MGMT_MQTT_Init = function()
    {
        try{
            water_mqtt.Water_MQTT_Init();
            lighting_mqtt.Lighting_MQTT_Init();
            gas_mqtt.Gas_MQTT_Init();
            environment_mqtt.Environment_MQTT_Init();
            electricpower_mqtt.ElectricPower_MQTT_Init();
            weather_mqtt.Weather_MQTT_Init();
            air_quality_mqtt.Air_Quality_MQTT_Init();
            traffic_mqtt.Traffic_MQTT_Init();
            accessories_mqtt.Accessories_MQTT_Init();
        }
        catch(e)
        {
            debug("[Device_MGMT_MQTT] Device_MGMT_MQTT_Init() Error " + e);
        }
    };
};
module.exports = Device_MGMT_MQTT;


var debug = require('debug')(require('path').basename(__filename));

var Address_MGR = require('../Util/Address_MGR.js');
var address_mgr = new Address_MGR();

var Device_MGR = require('../Util/Device_MGR.js');
var device_mgr = new Device_MGR();

var Atmosphere_Box_API = require('./AirQuality/Atmosphere_Box_API.js');
var atmosphere_box_api = new Atmosphere_Box_API();

var Weather_Station_API = require('./Weather/Weather_Station_API.js');
var weather_station_API = new Weather_Station_API();

var EM_Valve_API = require('./Water/Electromagnetic_Valve_API.js');
var em_valve_api = new EM_Valve_API();
var Flow_Meter_API = require('./Water/Flow_Meter_API.js');
var flow_meter_api = new Flow_Meter_API();
var Pump_Motor_API = require('./Water/Pump_Motor_API.js');
var pump_motor_api = new Pump_Motor_API();
var Water_EC_Sensor_API = require('./Water/Water_EC_Sensor_API.js');
var water_ec_sensor_api = new Water_EC_Sensor_API();
var Water_Level_Sensor_API = require('./Water/Water_Level_Sensor_API.js');
var water_level_sensor_api = new Water_Level_Sensor_API();
var Water_PH_Sensor_API = require('./Water/Water_PH_Sensor_API.js');
var water_PH_sensor_api = new Water_PH_Sensor_API();
var Water_Tank_API = require('./Water/Water_Tank_API.js');
var water_tank_api = new Water_Tank_API();

var Light_Sensor_API = require('./Lighting/Light_Sensor_API.js');
var light_sensor_api = new Light_Sensor_API();
var Lighting_API = require('./Lighting/Lighting_API.js');
var lighting_api = new Lighting_API();

var Air_Valve_API = require('./Gas/Air_Valve_API.js');
var air_valve_api = new Air_Valve_API();
var CO_Sensor_API = require('./Gas/CO_Sensor_API.js');
var co_sensor_api = new CO_Sensor_API();
var CO2_Sensor_API = require('./Gas/CO2_Sensor_API.js');
var co2_sensor_api = new CO2_Sensor_API();
var NO2_Sensor_API = require('./Gas/NO2_Sensor_API.js');
var no2_sensor_api = new NO2_Sensor_API();
var O2_Sensor_API = require('./Gas/O2_Sensor_API.js');
var o2_sensor_api = new O2_Sensor_API();
var O3_Sensor_API = require('./Gas/O3_Sensor_API.js');
var o3_sensor_api = new O3_Sensor_API();
var SO2_Sensor_API = require('./Gas/SO2_Sensor_API.js');
var so2_sensor_api = new SO2_Sensor_API();
var TVOC_Sensor_API = require('./Gas/TVOC_Sensor_API.js');
var tvoc_sensor_api = new TVOC_Sensor_API();

var Blind_Curtain_API = require('./Environment/Blind_Curtain_API.js');
var blind_curtain_api = new Blind_Curtain_API();
var Circulating_Fan_API = require('./Environment/Circulating_Fan_API.js');
var circulating_fan_api = new Circulating_Fan_API();
var Humidity_Sensor_API = require('./Environment/Humidity_Sensor_API.js');
var humidity_sensor_api = new Humidity_Sensor_API();
var PM2_5_Sensor_API = require('./Environment/PM2_5_Sensor_API.js');
var pm2_5_sensor_api = new PM2_5_Sensor_API();
var Pressure_Sensor_API = require('./Environment/Pressure_Sensor_API.js');
var pressure_sensor_api = new Pressure_Sensor_API();
var Soil_EC_Sensor_API = require('./Environment/Soil_EC_Sensor_API.js');
var soil_ec_sensor_api = new Soil_EC_Sensor_API();
var Soil_Moisture_Sensor_API = require('./Environment/Soil_Moisture_Sensor_API.js');
var soil_moisture_sensor_api = new Soil_Moisture_Sensor_API();
var Soil_Temperature_Sensor_API = require('./Environment/Soil_Temperature_Sensor_API.js');
var soil_temperature_sensor_api = new Soil_Temperature_Sensor_API();
var Solar_Radiation_Sensor_API = require('./Environment/Solar_Radiation_Sensor_API.js');
var solar_radiation_sensor_api = new Solar_Radiation_Sensor_API();
var Temperature_Sensor_API = require('./Environment/Temperature_Sensor_API.js');
var temperature_sensor_api = new Temperature_Sensor_API();
var Rain_Guage_API = require('./Environment/Rain_Guage_API.js');
var rain_guage_api = new Rain_Guage_API();
var Wind_Guage_API = require('./Environment/Wind_Guage_API.js');
var wind_guage_api = new Wind_Guage_API();

var Dimmable_Socket_API = require('./ElectricPower/Dimmable_Socket_API.js');
var dimmable_socket_api = new Dimmable_Socket_API();
var OnOff_Socket_API = require('./ElectricPower/OnOff_Socket_API.js');
var onoff_socket_api = new OnOff_Socket_API();
var Power_Meter_API = require('./ElectricPower/Power_Meter_API.js');
var power_meter_api = new Power_Meter_API();

var OnOff_Switch_API = require('./Accessories/OnOff_Switch_API.js');
var onoff_switch_api = new OnOff_Switch_API();
var Dimmable_Switch_API = require('./Accessories/Dimmable_Switch_API.js');
var dimmable_switch_api = new Dimmable_Switch_API();
var Toggle_Switch_API = require('./Accessories/Toggle_Switch_API.js');
var toggle_switch_api = new Toggle_Switch_API();
var Scene_Switch_API = require('./Accessories/Scene_Switch_API.js');
var scene_switch_api = new Scene_Switch_API();
var Motion_Sensor_API = require('./Accessories/Motion_Sensor_API.js');
var motion_sensor_api = new Motion_Sensor_API();
var Door_Window_Sensor_API = require('./Accessories/Door_Window_Sensor_API.js');
var door_window_sensor_api = new Door_Window_Sensor_API();

var Device_Info_API_MQTT = require('../MQTT/Device_MGMT/Device_Info_API_MQTT.js');
var device_info_api_mqtt = new Device_Info_API_MQTT();

var Device_MGMT_API_Zigbee = require('../Zigbee/Device_MGMT/Device_MGMT_API_Zigbee.js');
var device_info_api_zigbee = new Device_MGMT_API_Zigbee();

var MQTT_Device_Support_Attributes_Info_Cache = [];

var Device_MGMT_API = function () {
    var self = this;

    self.Device_MGMT_Save_Device_Info = async function (username, device_type, device_ID, device_inf) {
        try {
            switch(device_type){
                case "On Off Switch":
                    device_type = "OnOff Switch";
                    break;
                case "On Off Light":
                    device_type = "OnOff Light";
                    break;
                case "On Off Plug In Unit":
                    device_type = "OnOff Plug In Unit";
                    break;
                case "On Off Socket":
                    device_type = "OnOff Socket";
                    break;
            }
            await device_mgr.Save_Device_Info(device_type, username, device_ID, device_inf);
        }
        catch (e) {
            debug("[Device_MGMT_API] Device_MGMT_Save_Device_Info() Error " + e);
        }
    };

    self.Device_MGMT_Get_Device_Num_Of_Node = async function (device_type, device_ID) {
        try {
            var num_of_node = 0;
            var rsp_json = null;
            switch(device_type){
                case "Electromagnetic Valve":
                    rsp_json = await em_valve_api.EM_Valve_Get_Num_Of_Switch(device_ID);
                    if(rsp_json!=null) { num_of_node = rsp_json.num_of_electromagnetic_valve; }
                    break;
                case "Flow Meter":
                    rsp_json = await flow_meter_api.Flow_Meter_Get_Num_Of_Flow_Sensor(device_ID);
                    if(rsp_json!=null) { num_of_node = rsp_json.num_of_flow_meter; }
                    break;
                case "Pump Motor":
                    num_of_node = 1;
                    break;
                case "Water Level Sensor":
                    rsp_json = await water_level_sensor_api.Water_Level_Sensor_Get_Num_Of_Sensor(device_ID);
                    if(rsp_json!=null) { num_of_node = rsp_json.num_of_water_level_sensor; }
                    break;
                case "Water EC Sensor":
                    rsp_json = await water_ec_sensor_api.Water_EC_Sensor_Get_Num_Of_Sensor(device_ID);
                    if(rsp_json!=null) { num_of_node = rsp_json.num_of_water_ec_sensor; }
                    break;
                case "Water PH Sensor":
                    rsp_json = await water_PH_sensor_api.Water_PH_Sensor_Get_Num_Of_Sensor(device_ID);
                    if(rsp_json!=null) { num_of_node = rsp_json.num_of_water_pH_sensor; }
                    break;
                case "Water Tank":
                    rsp_json = await water_tank_api.Water_Tank_Get_Num_Of_Tank(device_ID);
                    if(rsp_json!=null) { num_of_node = rsp_json.num_of_water_tank; }
                    break;

                case "OnOff Switch":
                    rsp_json = await onoff_switch_api.Get_Num_Of_OnOff_Switch(device_ID);
                    if(rsp_json!=null) { num_of_node = rsp_json.num_of_onoff_switch; }
                    break;
                case "Dimmable Switch":
                    rsp_json = await dimmable_switch_api.Get_Num_Of_Dimmable_Switch(device_ID);
                    if(rsp_json!=null) { num_of_node = rsp_json.num_of_dimmable_switch; }
                    break;
                case "Toggle Switch":
                    rsp_json = await toggle_switch_api.Get_Num_Of_Toggle_Switch(device_ID);
                    if(rsp_json!=null) { num_of_node = rsp_json.num_of_toggle_switch; }
                    break;
                case "Scene Switch":
                    rsp_json = await scene_switch_api.Get_Num_Of_Scene_Switch(device_ID);
                    if(rsp_json!=null) { num_of_node = rsp_json.num_of_scene_switch; }
                    break;
                case "Motion Sensor":
                    rsp_json = await motion_sensor_api.Get_Num_Of_Motion_Sensor(device_ID);
                    if(rsp_json!=null) { num_of_node = rsp_json.num_of_motion_sensor; }
                    break;
                case "Door/Window Sensor":
                    rsp_json = await door_window_sensor_api.Get_Num_Of_Door_Window_Sensor(device_ID);
                    if(rsp_json!=null) { num_of_node = rsp_json.num_of_door_window_sensor; }
                    break;
                    
                case "OnOff Light":
                case "OnOff Plug In Unit":
                case "Dimmable Light":
                case "Dimmable Plug In Unit":
                case "Colored Light":
                case "Color Temperature Light":
                case "Extended Color Light":
                    num_of_node = 1;
                    break;
                        
                case "Light Sensor":
                    rsp_json = await light_sensor_api.Light_Sensor_Get_Num_Of_Sensor(device_ID);
                    if(rsp_json!=null) { num_of_node = rsp_json.num_of_light_sensor; }
                    break;

                case "Air Valve":
                    rsp_json = await air_valve_api.Air_Valve_Get_Num_Of_Switch(device_ID);
                    if(rsp_json!=null) { num_of_node = rsp_json.num_of_air_valve; }
                    break;
                case "CO Sensor":
                    rsp_json = await co_sensor_api.CO_Sensor_Get_Num_Of_Sensor(device_ID);
                    if(rsp_json!=null) { num_of_node = rsp_json.num_of_co_sensor; }
                    break;
                case "CO2 Sensor":
                    rsp_json = await co2_sensor_api.CO2_Sensor_Get_Num_Of_Sensor(device_ID);
                    if(rsp_json!=null) { num_of_node = rsp_json.num_of_co2_sensor; }
                    break;
                case "NO2 Sensor":
                    rsp_json = await no2_sensor_api.NO2_Sensor_Get_Num_Of_Sensor(device_ID);
                    if(rsp_json!=null) { num_of_node = rsp_json.num_of_no2_sensor; }
                    break;
                case "O2 Sensor":
                    rsp_json = await o2_sensor_api.O2_Sensor_Get_Num_Of_Sensor(device_ID);
                    if(rsp_json!=null) { num_of_node = rsp_json.num_of_o2_sensor; }
                    break;
                case "O3 Sensor":
                    rsp_json = await o3_sensor_api.O3_Sensor_Get_Num_Of_Sensor(device_ID);
                    if(rsp_json!=null) { num_of_node = rsp_json.num_of_o3_sensor; }
                    break;
                case "SO2 Sensor":
                    rsp_json = await so2_sensor_api.SO2_Sensor_Get_Num_Of_Sensor(device_ID);
                    if(rsp_json!=null) { num_of_node = rsp_json.num_of_so2_sensor; }
                    break;
                case "TVOC Sensor":
                    rsp_json = await tvoc_sensor_api.TVOC_Sensor_Get_Num_Of_Sensor(device_ID);
                    if(rsp_json!=null) { num_of_node = rsp_json.num_of_tvoc_sensor; }
                    break;

                case "Blind Curtain":
                case "Circulating Fan":
                    num_of_node = 1;
                    break;
                case "Humidity Sensor":
                    rsp_json = await humidity_sensor_api.Humidity_Sensor_Get_Num_Of_Sensor(device_ID);
                    if(rsp_json!=null) { num_of_node = rsp_json.num_of_humidity_sensor; }
                    break;
                case "PM2.5 Sensor":
                    rsp_json = await pm2_5_sensor_api.PM2_5_Sensor_Get_Num_Of_Sensor(device_ID);
                    if(rsp_json!=null) { num_of_node = rsp_json.num_of_pm_2_5_sensor; }
                    break;
                case "Pressure Sensor":
                    rsp_json = await pressure_sensor_api.Pressure_Sensor_Get_Num_Of_Sensor(device_ID);
                    if(rsp_json!=null) { num_of_node = rsp_json.num_of_pressure_sensor; }
                    break;
                case "Soil EC Sensor":
                    rsp_json = await soil_ec_sensor_api.Soil_EC_Sensor_Get_Num_Of_Sensor(device_ID);
                    if(rsp_json!=null) { num_of_node = rsp_json.num_of_soil_ec_sensor; }
                    break;
                case "Soil Moisture Sensor":
                    rsp_json = await soil_moisture_sensor_api.Soil_Moisture_Sensor_Get_Num_Of_Sensor(device_ID);
                    if(rsp_json!=null) { num_of_node = rsp_json.num_of_soil_moisture_sensor; }
                    break;
                case "Soil Temperature Sensor":
                    rsp_json = await soil_temperature_sensor_api.Soil_Temperature_Sensor_Get_Num_Of_Sensor(device_ID);
                    if(rsp_json!=null) { num_of_node = rsp_json.num_of_soil_temperature_sensor; }
                    break;
                case "Solar Radiation Sensor":
                    rsp_json = await solar_radiation_sensor_api.Solar_Radiation_Sensor_Get_Num_Of_Sensor(device_ID);
                    if(rsp_json!=null) { num_of_node = rsp_json.num_of_solar_radiation_sensor; }
                    break;
                case "Temperature Sensor":
                    rsp_json = await temperature_sensor_api.Temperature_Sensor_Get_Num_Of_Sensor(device_ID);
                    if(rsp_json!=null) { num_of_node = rsp_json.num_of_temperature_sensor; }
                    break;
                case "Rain Guage":
                    rsp_json = await rain_guage_api.Rain_Guage_Get_Num_Of_Sensor(device_ID);
                    if(rsp_json!=null) { num_of_node = rsp_json.num_of_rain_guage; }
                    break;
                case "Wind Guage":
                    rsp_json = await wind_guage_api.Wind_Guage_Get_Num_Of_Sensor(device_ID);
                    if(rsp_json!=null) { num_of_node = rsp_json.num_of_wind_guage; }
                    break;

                case "OnOff Socket":
                    rsp_json = await onoff_socket_api.Get_Num_Of_OnOff_Socket(device_ID);
                    if(rsp_json!=null) { num_of_node = rsp_json.num_of_onoff_socket; }
                    break;
                case "Dimmable Socket":
                    rsp_json = await dimmable_socket_api.Get_Num_Of_Dimmable_Socket(device_ID);
                    if(rsp_json!=null) { num_of_node = rsp_json.num_of_dimmable_socket; }
                    break;
                case "Power Meter":
                    rsp_json = await power_meter_api.Get_Num_Of_Power_Meter(device_ID);
                    if(rsp_json!=null) { num_of_node = rsp_json.num_of_power_meter; }
                    break;

                case "Electric Car":
                case "Road Sign":
                    num_of_node = 1;
                    break;
                    
                case "Atmosphere Box":
                case "Weather Station":
                    num_of_node = 1;
                    break;

                default:
                    debug("Unsupport Device Type: " + device_type);
                    break;
            }

            return {
                num_of_node: num_of_node
            }
        }
        catch (e) {
            debug("[Device_MGMT_API] Device_MGMT_Get_Device_Num_Of_Node() Error " + e);
        }
    };

    self.Get_Device_Support_Attributes = async function (device_type, address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }
            
            var result = null;

            if(address_info.target_network==null)
            {
                return null;
            }

            if(address_info.target_network=="TCP/IP")
            {
                if(address_info.target_protocol==null)
                {
                    return null;
                }
            
                if(address_info.target_protocol=="MQTT")
                {
                    if(MQTT_Device_Support_Attributes_Info_Cache[device_ID]==null)
                    {
                        result = await device_info_api_mqtt.Get_Device_Support_Attributes(address_ID);
                        MQTT_Device_Support_Attributes_Info_Cache[device_ID] = result;
                    }
                    else{
                        result = MQTT_Device_Support_Attributes_Info_Cache[device_ID];
                    }
                }
            }
            if(address_info.target_network=="Zigbee")
            {
                result = await device_info_api_zigbee.Get_Device_Support_Attributes(device_type, address_ID);
            }

            return result;
        }
        catch (e) {
            debug("[Device_MGMT_API] Get_Device_Support_Attributes() Error " + e);
        }
    };
}

module.exports = Device_MGMT_API;
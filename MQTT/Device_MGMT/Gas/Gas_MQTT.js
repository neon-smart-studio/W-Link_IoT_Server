
var debug = require('debug')(require('path').basename(__filename));

var MQTT = require('../../MQTT.js');
var mqtt = new MQTT();

var Air_Valve_MQTT = require('./Air_Valve_MQTT.js');
var air_valve_mqtt = new Air_Valve_MQTT();
var CO_Sensor_MQTT = require('./CO_Sensor_MQTT.js');
var co_sensor_mqtt = new CO_Sensor_MQTT();
var CO2_Sensor_MQTT = require('./CO2_Sensor_MQTT.js');
var co2_sensor_mqtt = new CO2_Sensor_MQTT();
var NO2_Sensor_MQTT = require('./NO2_Sensor_MQTT.js');
var no2_sensor_mqtt = new NO2_Sensor_MQTT();
var O2_Sensor_MQTT = require('./O2_Sensor_MQTT.js');
var o2_sensor_mqtt = new O2_Sensor_MQTT();
var O3_Sensor_MQTT = require('./O3_Sensor_MQTT.js');
var o3_sensor_mqtt = new O3_Sensor_MQTT();
var SO2_Sensor_MQTT = require('./SO2_Sensor_MQTT.js');
var so2_sensor_mqtt = new SO2_Sensor_MQTT();
var TVOC_Sensor_MQTT = require('./TVOC_Sensor_MQTT.js');
var tvoc_sensor_mqtt = new TVOC_Sensor_MQTT();

var Gas_MQTT = function (){
    var self = this;
    self.Gas_MQTT_Init = function()
    {
        try {
            mqtt.Register_MQTT_Data_Channel_ID_And_Callbacks('Air_Valve', air_valve_mqtt.Process_Air_Valve_MQTT_POST_Message, air_valve_mqtt.Process_Air_Valve_MQTT_GET_Message);
            mqtt.Register_MQTT_Data_Channel_ID_And_Callbacks('CO_Sensor', co_sensor_mqtt.Process_CO_Sensor_MQTT_POST_Message, co_sensor_mqtt.Process_CO_Sensor_MQTT_GET_Message);
            mqtt.Register_MQTT_Data_Channel_ID_And_Callbacks('CO2_Sensor', co2_sensor_mqtt.Process_CO2_Sensor_MQTT_POST_Message, co2_sensor_mqtt.Process_CO2_Sensor_MQTT_GET_Message);
            mqtt.Register_MQTT_Data_Channel_ID_And_Callbacks('NO2_Sensor', no2_sensor_mqtt.Process_NO2_Sensor_MQTT_POST_Message, no2_sensor_mqtt.Process_NO2_Sensor_MQTT_GET_Message);
            mqtt.Register_MQTT_Data_Channel_ID_And_Callbacks('O2_Sensor', o2_sensor_mqtt.Process_O2_Sensor_MQTT_POST_Message, o2_sensor_mqtt.Process_O2_Sensor_MQTT_GET_Message);
            mqtt.Register_MQTT_Data_Channel_ID_And_Callbacks('O3_Sensor', o3_sensor_mqtt.Process_O3_Sensor_MQTT_POST_Message, o3_sensor_mqtt.Process_O3_Sensor_MQTT_GET_Message);
            mqtt.Register_MQTT_Data_Channel_ID_And_Callbacks('SO2_Sensor', so2_sensor_mqtt.Process_SO2_Sensor_MQTT_POST_Message, so2_sensor_mqtt.Process_SO2_Sensor_MQTT_GET_Message);
            mqtt.Register_MQTT_Data_Channel_ID_And_Callbacks('TVOC_Sensor', tvoc_sensor_mqtt.Process_TVOC_Sensor_MQTT_POST_Message, tvoc_sensor_mqtt.Process_TVOC_Sensor_MQTT_GET_Message);
        }
        catch (e) {
            debug("[Gas_MQTT] Gas_MQTT_Init() Error " + e);
        }
    };
};
module.exports = Gas_MQTT;

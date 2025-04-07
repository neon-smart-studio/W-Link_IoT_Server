
var debug = require('debug')(require('path').basename(__filename));

var MQTT = require('../../MQTT.js');
var mqtt = new MQTT();

var Circulating_Fan_MQTT = require('./Circulating_Fan_MQTT.js');
var circulating_fan_mqtt = new Circulating_Fan_MQTT();
var Humidity_Sensor_MQTT = require('./Humidity_Sensor_MQTT.js');
var humidity_sensor_mqtt = new Humidity_Sensor_MQTT();
var PM2_5_Sensor_MQTT = require('./PM2_5_Sensor_MQTT.js');
var pm2_5_sensor_mqtt = new PM2_5_Sensor_MQTT();
var Pressure_Sensor_MQTT = require('./Pressure_Sensor_MQTT.js');
var pressure_sensor_mqtt = new Pressure_Sensor_MQTT();
var Soil_EC_Sensor_MQTT = require('./Soil_EC_Sensor_MQTT.js');
var soil_ec_sensor_mqtt = new Soil_EC_Sensor_MQTT();
var Soil_Moisture_Sensor_MQTT = require('./Soil_Moisture_Sensor_MQTT.js');
var soil_moisture_sensor_mqtt = new Soil_Moisture_Sensor_MQTT();
var Soil_Temperature_Sensor_MQTT = require('./Soil_Temperature_Sensor_MQTT.js');
var soil_temperature_sensor_mqtt = new Soil_Temperature_Sensor_MQTT();
var Solar_Radiation_Sensor_MQTT = require('./Solar_Radiation_Sensor_MQTT.js');
var solar_radiation_sensor_mqtt = new Solar_Radiation_Sensor_MQTT();
var Temperature_Sensor_MQTT = require('./Temperature_Sensor_MQTT.js');
var temperature_sensor_mqtt = new Temperature_Sensor_MQTT();
var Rain_Guage_MQTT = require('./Rain_Guage_MQTT.js');
var rain_guage_mqtt = new Rain_Guage_MQTT();
var Wind_Guage_MQTT = require('./Wind_Guage_MQTT.js');
var wind_guage_mqtt = new Wind_Guage_MQTT();

var Environment_MQTT = function (){
    var self = this;
    self.Environment_MQTT_Init = function()
    {
        try {
            mqtt.Register_MQTT_Data_Channel_ID_And_Callbacks('Circulating_Fan', circulating_fan_mqtt.Process_Circulating_Fan_MQTT_POST_Message, circulating_fan_mqtt.Process_Circulating_Fan_MQTT_GET_Message);
            mqtt.Register_MQTT_Data_Channel_ID_And_Callbacks('Humidity_Sensor', humidity_sensor_mqtt.Process_Humidity_Sensor_MQTT_POST_Message, humidity_sensor_mqtt.Process_Humidity_Sensor_MQTT_GET_Message);
            mqtt.Register_MQTT_Data_Channel_ID_And_Callbacks('PM2.5_Sensor', pm2_5_sensor_mqtt.Process_PM2_5_Sensor_MQTT_POST_Message, pm2_5_sensor_mqtt.Process_PM2_5_Sensor_MQTT_GET_Message);
            mqtt.Register_MQTT_Data_Channel_ID_And_Callbacks('Pressure_Sensor', pressure_sensor_mqtt.Process_Pressure_Sensor_MQTT_POST_Message, pressure_sensor_mqtt.Process_Pressure_Sensor_MQTT_GET_Message);
            mqtt.Register_MQTT_Data_Channel_ID_And_Callbacks('Soil_EC_Sensor', soil_ec_sensor_mqtt.Process_Soil_Electrical_Conductivity_Sensor_MQTT_POST_Message, soil_ec_sensor_mqtt.Process_Soil_Electrical_Conductivity_Sensor_MQTT_GET_Message);
            mqtt.Register_MQTT_Data_Channel_ID_And_Callbacks('Soil_Moisture_Sensor', soil_moisture_sensor_mqtt.Process_Soil_Moisture_Sensor_MQTT_POST_Message, soil_moisture_sensor_mqtt.Process_Soil_Moisture_Sensor_MQTT_GET_Message);
            mqtt.Register_MQTT_Data_Channel_ID_And_Callbacks('Soil_Temperature_Sensor', soil_temperature_sensor_mqtt.Process_Soil_Temperature_Sensor_MQTT_POST_Message, soil_temperature_sensor_mqtt.Process_Soil_Temperature_Sensor_MQTT_GET_Message);
            mqtt.Register_MQTT_Data_Channel_ID_And_Callbacks('Solar_Radiation_Sensor', solar_radiation_sensor_mqtt.Process_Solar_Radiation_Sensor_MQTT_POST_Message, solar_radiation_sensor_mqtt.Process_Solar_Radiation_Sensor_MQTT_GET_Message);
            mqtt.Register_MQTT_Data_Channel_ID_And_Callbacks('Temperature_Sensor', temperature_sensor_mqtt.Process_Temperature_Sensor_MQTT_POST_Message, temperature_sensor_mqtt.Process_Temperature_Sensor_MQTT_GET_Message);
            mqtt.Register_MQTT_Data_Channel_ID_And_Callbacks('Rain_Guage', rain_guage_mqtt.Process_Rain_Guage_MQTT_POST_Message, rain_guage_mqtt.Process_Rain_Guage_MQTT_GET_Message);
            mqtt.Register_MQTT_Data_Channel_ID_And_Callbacks('Wind_Guage', wind_guage_mqtt.Process_Wind_Guage_MQTT_POST_Message, wind_guage_mqtt.Process_Wind_Guage_MQTT_GET_Message);
        }
        catch (e) {
            debug("[Environment_MQTT] Environment_MQTT_Init() Error " + e);
        }
    };
};
module.exports = Environment_MQTT;

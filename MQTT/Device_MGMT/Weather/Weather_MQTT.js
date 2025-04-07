
var debug = require('debug')(require('path').basename(__filename));

var MQTT = require('../../MQTT.js');
var mqtt = new MQTT();

var Weather_Station_MQTT = require('./Weather_Station_MQTT.js');
var weather_station_mqtt = new Weather_Station_MQTT();

var Weather_MQTT = function (){
    var self = this;
    self.Weather_MQTT_Init = function()
    {
        try {
            mqtt.Register_MQTT_Data_Channel_ID_And_Callbacks('Weather_Station', weather_station_mqtt.Process_Weather_Station_MQTT_POST_Message, weather_station_mqtt.Process_Weather_Station_MQTT_GET_Message);
        }
        catch (e) {
            debug("[Weather_MQTT] Weather_MQTT_Init() Error " + e);
        }
    };
};
module.exports = Weather_MQTT;

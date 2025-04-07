
var debug = require('debug')(require('path').basename(__filename));

var MQTT = require('../../MQTT.js');
var mqtt = new MQTT();

var Electric_Car_MQTT = require('./Electric_Car_MQTT.js');
var electric_car_mqtt = new Electric_Car_MQTT();
var Road_Sign_MQTT = require('./Road_Sign_MQTT.js');
var road_sign_mqtt = new Road_Sign_MQTT();

var Traffic_MQTT = function (){
    var self = this;
    self.Traffic_MQTT_Init = function()
    {
        try {
            mqtt.Register_MQTT_Data_Channel_ID_And_Callbacks('Electric_Car', electric_car_mqtt.Process_Electric_Car_MQTT_POST_Message, electric_car_mqtt.Process_Electric_Car_MQTT_GET_Message);
            mqtt.Register_MQTT_Data_Channel_ID_And_Callbacks('Road_Sign', road_sign_mqtt.Process_Road_Sign_MQTT_POST_Message, road_sign_mqtt.Process_Road_Sign_MQTT_GET_Message);
        }
        catch (e) {
            debug("[Traffic_MQTT] Traffic_MQTT_Init() Error " + e);
        }
    };
};
module.exports = Traffic_MQTT;

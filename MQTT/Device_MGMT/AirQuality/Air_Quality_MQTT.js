
var debug = require('debug')(require('path').basename(__filename));

var MQTT = require('../../MQTT.js');
var mqtt = new MQTT();

var Atmosphere_Box_MQTT = require('./Atmosphere_Box_MQTT.js');
var atmosphere_box_mqtt = new Atmosphere_Box_MQTT();

var Air_Quality_MQTT = function (){
    var self = this;
    self.Air_Quality_MQTT_Init = function()
    {
        try {
            mqtt.Register_MQTT_Data_Channel_ID_And_Callbacks('Atmosphere_Box', atmosphere_box_mqtt.Process_Atmosphere_Box_MQTT_POST_Message, atmosphere_box_mqtt.Process_Atmosphere_Box_MQTT_GET_Message);
        }
        catch (e) {
            debug("[Air_Quality_MQTT] Air_Quality_MQTT_Init() Error " + e);
        }
    };
};
module.exports = Air_Quality_MQTT;

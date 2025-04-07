
var debug = require('debug')(require('path').basename(__filename));

var MQTT = require('../../MQTT.js');
var mqtt = new MQTT();

var OnOff_Socket_MQTT = require('./OnOff_Socket_MQTT.js');
var onoff_socket_mqtt = new OnOff_Socket_MQTT();
var Dimmable_Socket_MQTT = require('./Dimmable_Socket_MQTT.js');
var dimmable_socket_mqtt = new Dimmable_Socket_MQTT();
var Power_Meter_MQTT = require('./Power_Meter_MQTT.js');
var power_meter_mqtt = new Power_Meter_MQTT();

var ElectricPower_MQTT = function (){
    var self = this;
    self.ElectricPower_MQTT_Init = function()
    {
        try {
            mqtt.Register_MQTT_Data_Channel_ID_And_Callbacks('OnOff_Socket', onoff_socket_mqtt.Process_OnOff_Socket_MQTT_POST_Message, onoff_socket_mqtt.Process_OnOff_Socket_MQTT_GET_Message);
            mqtt.Register_MQTT_Data_Channel_ID_And_Callbacks('Dimmable_Socket', dimmable_socket_mqtt.Process_Dimmable_Socket_MQTT_POST_Message, dimmable_socket_mqtt.Process_Dimmable_Socket_MQTT_GET_Message);
            mqtt.Register_MQTT_Data_Channel_ID_And_Callbacks('Power_Meter', power_meter_mqtt.Process_Power_Meter_MQTT_POST_Message, power_meter_mqtt.Process_Power_Meter_MQTT_GET_Message);
        }
        catch (e) {
            debug("[ElectricPower_MQTT] ElectricPower_MQTT_Init() Error " + e);
        }
    };
};
module.exports = ElectricPower_MQTT;

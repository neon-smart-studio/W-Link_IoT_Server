
var debug = require('debug')(require('path').basename(__filename));

var MQTT = require('../../MQTT.js');
var mqtt = new MQTT();

var OnOff_Switch_MQTT = require('./OnOff_Switch_MQTT.js');
var onoff_switch_mqtt = new OnOff_Switch_MQTT();
var Dimmable_Switch_MQTT = require('./Dimmable_Switch_MQTT.js');
var dimmable_switch_mqtt = new Dimmable_Switch_MQTT();
var Toggle_Switch_MQTT = require('./Toggle_Switch_MQTT.js');
var toggle_switch_mqtt = new Toggle_Switch_MQTT();
var Scene_Switch_MQTT = require('./Scene_Switch_MQTT.js');
var scene_switch_mqtt = new Scene_Switch_MQTT();
var Door_Window_Sensor_MQTT = require('./Door_Window_Sensor_MQTT.js');
var door_window_sensor_mqtt = new Door_Window_Sensor_MQTT();
var Motion_Sensor_MQTT = require('./Motion_Sensor_MQTT.js');
var motion_sensor_mqtt = new Motion_Sensor_MQTT();

var Accessories_MQTT = function (){
    var self = this;
    self.Accessories_MQTT_Init = function()
    {
        try {
            mqtt.Register_MQTT_Data_Channel_ID_And_Callbacks('OnOff_Switch', onoff_switch_mqtt.Process_OnOff_Switch_MQTT_POST_Message, onoff_switch_mqtt.Process_OnOff_Switch_MQTT_GET_Message);
            mqtt.Register_MQTT_Data_Channel_ID_And_Callbacks('Dimmable_Switch', dimmable_switch_mqtt.Process_Dimmable_Switch_MQTT_POST_Message, dimmable_switch_mqtt.Process_Dimmable_Switch_MQTT_GET_Message);
            mqtt.Register_MQTT_Data_Channel_ID_And_Callbacks('Toggle_Switch', toggle_switch_mqtt.Process_Toggle_Switch_MQTT_POST_Message, toggle_switch_mqtt.Process_Toggle_Switch_MQTT_GET_Message);
            mqtt.Register_MQTT_Data_Channel_ID_And_Callbacks('Scene_Switch', scene_switch_mqtt.Process_Scene_Switch_MQTT_POST_Message, scene_switch_mqtt.Process_Scene_Switch_MQTT_GET_Message);
            mqtt.Register_MQTT_Data_Channel_ID_And_Callbacks('Door_Window_Sensor', door_window_sensor_mqtt.Process_Door_Window_Sensor_MQTT_POST_Message, door_window_sensor_mqtt.Process_Door_Window_Sensor_MQTT_GET_Message);
            mqtt.Register_MQTT_Data_Channel_ID_And_Callbacks('Motion_Sensor', motion_sensor_mqtt.Process_Motion_Sensor_MQTT_POST_Message, motion_sensor_mqtt.Process_Motion_Sensor_MQTT_GET_Message);
        }
        catch (e) {
            debug("[Accessories_MQTT] Accessories_MQTT_Init() Error " + e);
        }
    };
};
module.exports = Accessories_MQTT;

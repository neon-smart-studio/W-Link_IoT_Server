
var debug = require('debug')(require('path').basename(__filename));

var MQTT = require('../../MQTT.js');
var mqtt = new MQTT();

var Electromagnetic_Valve_MQTT = require('./Electromagnetic_Valve_MQTT.js');
var em_valve_mqtt = new Electromagnetic_Valve_MQTT();
var Flow_Meter_MQTT = require('./Flow_Meter_MQTT.js');
var flow_meter_mqtt = new Flow_Meter_MQTT();
var Pump_Motor_MQTT = require('./Pump_Motor_MQTT.js');
var pump_motor_mqtt = new Pump_Motor_MQTT();
var Water_EC_Sensor_MQTT = require('./Water_EC_Sensor_MQTT.js');
var water_ec_sensor_mqtt = new Water_EC_Sensor_MQTT();
var Water_Level_Sensor_MQTT = require('./Water_Level_Sensor_MQTT.js');
var water_level_sensor_mqtt = new Water_Level_Sensor_MQTT();
var Water_PH_Sensor_MQTT = require('./Water_PH_Sensor_MQTT.js');
var water_ph_sensor_mqtt = new Water_PH_Sensor_MQTT();
var Water_Tank_MQTT = require('./Water_Tank_MQTT.js');
var water_tank_mqtt = new Water_Tank_MQTT();

var Water_MQTT = function (){
    var self = this;
    self.Water_MQTT_Init = function()
    {
        try {
            mqtt.Register_MQTT_Data_Channel_ID_And_Callbacks('Electromagnetic_Valve', em_valve_mqtt.Process_Electromagnetic_Valve_MQTT_POST_Message, em_valve_mqtt.Process_Electromagnetic_Valve_MQTT_GET_Message);
            mqtt.Register_MQTT_Data_Channel_ID_And_Callbacks('Flow_Meter', flow_meter_mqtt.Process_Flow_Meter_MQTT_POST_Message, flow_meter_mqtt.Process_Flow_Meter_MQTT_GET_Message);
            mqtt.Register_MQTT_Data_Channel_ID_And_Callbacks('Pump_Motor', pump_motor_mqtt.Process_Pump_Motor_MQTT_POST_Message, pump_motor_mqtt.Process_Pump_Motor_MQTT_GET_Message);
            mqtt.Register_MQTT_Data_Channel_ID_And_Callbacks('Water_EC_Sensor', water_ec_sensor_mqtt.Process_Water_Electrical_Conductivity_Sensor_MQTT_POST_Message, water_ec_sensor_mqtt.Process_Water_Electrical_Conductivity_Sensor_MQTT_GET_Message);
            mqtt.Register_MQTT_Data_Channel_ID_And_Callbacks('Water_Level_Sensor', water_level_sensor_mqtt.Process_Water_Level_Sensor_MQTT_POST_Message, water_level_sensor_mqtt.Process_Water_Level_Sensor_MQTT_GET_Message);
            mqtt.Register_MQTT_Data_Channel_ID_And_Callbacks('Water_PH_Sensor', water_ph_sensor_mqtt.Process_Water_PH_Sensor_MQTT_POST_Message, water_ph_sensor_mqtt.Process_Water_PH_Sensor_MQTT_GET_Message);
            mqtt.Register_MQTT_Data_Channel_ID_And_Callbacks('Water_Tank', water_tank_mqtt.Process_Water_Tank_MQTT_POST_Message, water_tank_mqtt.Process_Water_Tank_MQTT_GET_Message);
        }
        catch (e) {
            debug("[Water_MQTT] Water_MQTT_Init() Error " + e);
        };
    };
};
module.exports = Water_MQTT;

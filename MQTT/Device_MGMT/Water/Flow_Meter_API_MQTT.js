
var debug = require('debug')(require('path').basename(__filename));

var MQTT = require('../../MQTT.js');
var mqtt = new MQTT();

var Flow_Meter_API_MQTT = function () {
    var self = this;
    
    self.Flow_Meter_Get_Num_Of_Flow_Sensor = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get num of flow meter"
            }
            return (await mqtt.MQTT_GET_Request("Flow_Meter", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Flow_Meter_API_MQTT] Flow_Meter_Get_Num_Of_Flow_Sensor() Error " + e);
        }
    };
    self.Flow_Meter_Get_Individual_Sensor_Status = async function (device_ID, sensor_index) {
        try {
            mqtt_cmd = {
                "command": "get individual flow meter measure",
                "sensor_index": sensor_index
            }
            return (await mqtt.MQTT_GET_Request("Flow_Meter", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Flow_Meter_API_MQTT] Flow_Meter_Get_Individual_Sensor_Status() Error " + e);
        }
    };
    self.Flow_Meter_Get_All_Sensor_Status = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get all flow meter measure"
            }
            return (await mqtt.MQTT_GET_Request("Flow_Meter", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Flow_Meter_API_MQTT] Flow_Meter_Get_All_Sensor_Status() Error " + e);
        }
    };
    self.Flow_Meter_Individual_Sensor_Enable_Disable = function (device_ID, sensor_index, en_dis) {
        try {
            mqtt_cmd = {
                "command": "set individual flow meter en/dis state",
                "enabled": en_dis,
                "sensor_index": sensor_index
            };
            mqtt.MQTT_POST_Request("Flow_Meter", device_ID, mqtt_cmd);
        }
        catch (e) {
            debug("[Flow_Meter_API_MQTT] Flow_Meter_Individual_Sensor_Enable_Disable() Error " + e);
        }
    };
};

module.exports = Flow_Meter_API_MQTT;
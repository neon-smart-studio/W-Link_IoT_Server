
var debug = require('debug')(require('path').basename(__filename));

var MQTT = require('../../MQTT.js');
var mqtt = new MQTT();

var Weather_Station_API_MQTT = function () {
    var self = this;
    
    self.Weather_Station_Get_Current_Measure = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get weather station current measure"
            }
            return (await mqtt.MQTT_GET_Request("Weather_Station", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Weather_Station_API_MQTT] Weather_Station_Get_All_Sensor_Status() Error " + e);
        }
    };
}

module.exports = Weather_Station_API_MQTT;
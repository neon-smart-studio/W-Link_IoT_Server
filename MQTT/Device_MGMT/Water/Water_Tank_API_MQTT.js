
var debug = require('debug')(require('path').basename(__filename));

var MQTT = require('../../MQTT.js');
var mqtt = new MQTT();

var Water_Tank_API_MQTT = function () {
    var self = this;
    
    self.Water_Tank_Get_Num_Of_Tank = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get num of water tank"
            }
            return (await mqtt.MQTT_GET_Request("Water_Tank", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Water_Tank_API_MQTT] Water_Tank_Get_Num_Of_Tank() Error " + e);
        }
    };
    self.Water_Tank_Get_Individual_Tank_Status = async function (device_ID, tank_index) {
        try {
            mqtt_cmd = {
                "command": "get individual water tank status",
                "tank_index": tank_index
            }
            return (await mqtt.MQTT_GET_Request("Water_Tank", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Water_Tank_API_MQTT] Water_Tank_Get_Individual_Tank_Status() Error " + e);
        }
    };
    self.Water_Tank_Get_All_Tank_Status = async function (device_ID) {
        try {
            mqtt_cmd = {
                "command": "get all water tank status"
            }
            return (await mqtt.MQTT_GET_Request("Water_Tank", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[Water_Tank_API_MQTT] Water_Tank_Get_All_Tank_Status() Error " + e);
        }
    };
};

module.exports = Water_Tank_API_MQTT;
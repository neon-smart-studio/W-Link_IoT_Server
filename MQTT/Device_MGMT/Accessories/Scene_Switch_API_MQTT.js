
var debug = require('debug')(require('path').basename(__filename));

var util = require("util");

var MQTT = require('../../MQTT.js');
var mqtt = new MQTT();

var MQTT_Scene_Switch_API = function () {
    var self = this;
    
    self.Get_Num_Of_Scene_Switch = async function (device_ID) {
        try {
            var mqtt_cmd = {
                "command": "get num of scene switch"
            }
            return (await mqtt.MQTT_GET_Request("Scene_Switch", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[MQTT_Scene_Switch_API] Get_Num_Of_Scene_Switch() Error " + e);
        }
    };
};

module.exports = MQTT_Scene_Switch_API;
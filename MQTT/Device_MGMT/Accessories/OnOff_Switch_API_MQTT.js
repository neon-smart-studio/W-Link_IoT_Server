
var debug = require('debug')(require('path').basename(__filename));

var util = require("util");

var MQTT = require('../../MQTT.js');
var mqtt = new MQTT();

var MQTT_OnOff_Switch_API = function () {
    var self = this;
    
    self.Get_Num_Of_OnOff_Switch = async function (device_ID) {
        try {
            var mqtt_cmd = {
                "command": "get num of on off switch"
            }
            return (await mqtt.MQTT_GET_Request("OnOff_Switch", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[MQTT_OnOff_Switch_API] Get_Num_Of_OnOff_Switch() Error " + e);
        }
    };
    self.Get_OnOff_Switch_Individual_Switch_Status = async function (device_ID, switch_index) {
        try {
            var mqtt_cmd = {
                "command": "get individual on off switch status",
                "sw_index": Number(switch_index)
            }
            return (await mqtt.MQTT_GET_Request("OnOff_Switch", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[MQTT_OnOff_Switch_API] Get_OnOff_Switch_Individual_Switch_Status() Error " + e);
        }
    };
    self.Get_OnOff_Switch_All_Switch_Status = async function (device_ID) {
        try {
            var mqtt_cmd = {
                "command": "get all on off switch status"
            }
            return (await mqtt.MQTT_GET_Request("OnOff_Switch", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[MQTT_OnOff_Switch_API] Get_OnOff_Switch_All_Switch_Status() Error " + e);
        }
    };
};

module.exports = MQTT_OnOff_Switch_API;
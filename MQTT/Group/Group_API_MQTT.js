
var debug = require('debug')(require('path').basename(__filename));

var MQTT = require('../MQTT.js');
var mqtt = new MQTT();

var MQTT_Group_API = function (){
    var self = this;

    self.Group_Add_Device_To_Group = async function(device_ID, group_ID)
    {
        try{
            var mqtt_cmd = {
                "command":"Add This Device To Group",
                "group_ID": group_ID
            }
            return (await mqtt.MQTT_POST_Request("Group", device_ID, mqtt_cmd));
        }
        catch(e)
        {
            debug("[MQTT_Group_API] Group_Add_Device_To_Group() Error " + e);
        }
    };
    self.Group_Remove_Device_From_Group = async function(device_ID, group_ID)
    {
        try{
            var mqtt_cmd = {
                "command":"Remove This Device From Group",
                "group_ID": group_ID
            }
            return (await mqtt.MQTT_POST_Request("Group", device_ID, mqtt_cmd));
        }
        catch(e)
        {
            debug("[MQTT_Group_API] Group_Remove_Device_From_Group() Error " + e);
        }
    };
    self.Group_Remove_This_Group = async function(group_ID)
    {
        try{
            var mqtt_cmd = {
                "command":"Remove This Group",
                "group_ID": group_ID
            }
            return (await mqtt.MQTT_POST_Request("Group", group_ID, mqtt_cmd));
        }
        catch(e)
        {
            debug("[MQTT_Group_API] Group_Remove_This_Group() Error " + e);
        }
    };
};

module.exports = MQTT_Group_API;
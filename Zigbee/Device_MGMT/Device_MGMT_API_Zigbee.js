
var debug = require('debug')(require('path').basename(__filename));

var Light_Sensor_API_Zigbee = require('./Lighting/Light_Sensor_API_Zigbee.js');
var light_sensor_api_zigbee = new Light_Sensor_API_Zigbee();
var Lighting_API_Zigbee = require('./Lighting/Lighting_API_Zigbee.js');
var lighting_api_zigbee = new Lighting_API_Zigbee();

var Blind_Curtain_API_Zigbee = require('./Environment/Blind_Curtain_API_Zigbee.js');
var blind_curtain_api_zigbee = new Blind_Curtain_API_Zigbee();
var Humidity_Sensor_API_Zigbee = require('./Environment/Humidity_Sensor_API_Zigbee.js');
var humidity_sensor_api_zigbee = new Humidity_Sensor_API_Zigbee();

var OnOff_Socket_API_Zigbee = require('./ElectricPower/OnOff_Socket_API_Zigbee.js');
var onoff_socket_api_zigbee = new OnOff_Socket_API_Zigbee();

var Toggle_Switch_API_Zigbee = require('./Accessories/Toggle_Switch_API_Zigbee.js');
var toggle_switch_api_zigbee = new Toggle_Switch_API_Zigbee();
var Scene_Switch_API_Zigbee = require('./Accessories/Scene_Switch_API_Zigbee.js');
var scene_switch_api_zigbee = new Scene_Switch_API_Zigbee();
var Motion_Sensor_API_Zigbee = require('./Accessories/Motion_Sensor_API_Zigbee.js');
var motion_sensor_api_zigbee = new Motion_Sensor_API_Zigbee();
/*
var Door_Window_Sensor_API_Zigbee = require('./Accessories/Door_Window_Sensor_API_Zigbee.js');
var door_window_sensor_api_zigbee = new Door_Window_Sensor_API_Zigbee();
*/
var Device_MGMT_API_Zigbee = function () {
    var self = this;

    self.Get_Device_Support_Attributes = async function (device_type, device_ID) {
        try {
            var result = null;
    
            switch(device_type)
            {
                case "On Off Light":
                case "On Off Plug In Unit":
                case "Dimmable Light":
                case "Dimmable Plug In Unit":
                case "Colored Light":
                case "Color Temperature Light":
                case "Extended Color Light":
                    result = await lighting_api_zigbee.Lighting_Get_Support_Attributes(device_type, device_ID);
                    break;
                case "Light Sensor":
                    result = await light_sensor_api_zigbee.Light_Sensor_Get_Support_Attributes(device_type, device_ID);
                    break;
                case "Humidity Sensor":
                    result = await humidity_sensor_api_zigbee.Humidity_Sensor_Get_Support_Attributes(device_type, device_ID);
                    break;
            }

            return result;
        }
        catch (e) {
            debug("[Device_MGMT_API_Zigbee] Get_Device_Support_Attributes() Error " + e);
        }
    };
}

module.exports = Device_MGMT_API_Zigbee;
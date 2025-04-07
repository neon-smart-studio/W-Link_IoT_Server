
var debug = require('debug')(require('path').basename(__filename));

const config = require('config');

var WebSocket = require('./WebSocket.js');
var websocket = new WebSocket();

var MQTT_WebSocket = require('./Network_MGMT/MQTT/MQTT_WebSocket.js');
var mqtt_websocket = new MQTT_WebSocket();

var Zigbee_WebSocket = require('./Network_MGMT/Zigbee/Zigbee_WebSocket.js');
var zigbee_websocket = new Zigbee_WebSocket();
var Bluetooth_WebSocket = require('./Network_MGMT/Bluetooth/Bluetooth_WebSocket.js');
var bluetooth_websocket = new Bluetooth_WebSocket();

var Records_WebSocket = require('./Records/Records_WebSocket.js');
var records_websocket = new Records_WebSocket();
var Devices_WebSocket = require('./Device_MGMT/Devices_WebSocket.js');
var devices_websocket = new Devices_WebSocket();
var Groups_WebSocket = require('./Group_MGMT/Groups_WebSocket.js');
var groups_websocket = new Groups_WebSocket();

var Bind_Unbind_WebSocket = require('./Bind_Unbind/Bind_Unbind_WebSocket.js');
var bind_unbind_websocket = new Bind_Unbind_WebSocket();

var Rules_WebSocket = require('./Rules/Rules_WebSocket.js');
var rules_websocket = new Rules_WebSocket();

var Accessories_WebSocket = require('./Device_MGMT/Accessories/Accessories_WebSocket.js');
var accessories_websocket = new Accessories_WebSocket();
var Lighting_WebSocket = require('./Device_MGMT/Lighting/Lighting_WebSocket.js');
var lighting_websocket = new Lighting_WebSocket();
var Water_WebSocket = require('./Device_MGMT/Water/Water_WebSocket.js');
var water_websocket = new Water_WebSocket();
var Environment_WebSocket = require('./Device_MGMT/Environment/Environment_WebSocket.js');
var environment_websocket = new Environment_WebSocket();
var Gas_WebSocket = require('./Device_MGMT/Gas/Gas_WebSocket.js');
var gas_websocket = new Gas_WebSocket();
var ElectricPower_WebSocket = require('./Device_MGMT/ElectricPower/ElectricPower_WebSocket.js');
var electricpower_websocket = new ElectricPower_WebSocket();

var AirQuality_WebSocket = require('./Device_MGMT/AirQuality/Air_Quality_WebSocket.js');
var airquality_websocket = new AirQuality_WebSocket();
var Weather_WebSocket = require('./Device_MGMT/Weather/Weather_WebSocket.js');
var weather_websocket = new Weather_WebSocket();
var Bridge_WebSocket = require('./Device_MGMT/Bridge/Bridge_WebSocket.js');
var bridge_websocket = new Bridge_WebSocket();

var WebSocket_APP = function () {
    var self = this;

    self.WebSocket_APP_Init = function () {
        try {
            websocket.Register_WebSocket_Topic_And_Callbacks("MQTT", mqtt_websocket.Process_MQTT_Topic_WebSocket_POST_Message, mqtt_websocket.Process_MQTT_Topic_WebSocket_GET_Message);

            websocket.Register_WebSocket_Topic_And_Callbacks("Zigbee", zigbee_websocket.Process_Zigbee_Topic_WebSocket_POST_Message, zigbee_websocket.Process_Zigbee_Topic_WebSocket_GET_Message);
            websocket.Register_WebSocket_Topic_And_Callbacks("Bluetooth", bluetooth_websocket.Process_Bluetooth_Topic_WebSocket_POST_Message, bluetooth_websocket.Process_Bluetooth_Topic_WebSocket_GET_Message);
            
            websocket.Register_WebSocket_Topic_And_Callbacks("Devices", devices_websocket.Process_Devices_Topic_WebSocket_POST_Message, devices_websocket.Process_Devices_Topic_WebSocket_GET_Message);
            websocket.Register_WebSocket_Topic_And_Callbacks("Groups", groups_websocket.Process_Groups_Topic_WebSocket_POST_Message, groups_websocket.Process_Groups_Topic_WebSocket_GET_Message);
            websocket.Register_WebSocket_Topic_And_Callbacks("BindUnbind", bind_unbind_websocket.Process_Bind_Unbind_Topic_WebSocket_POST_Message, bind_unbind_websocket.Process_Bind_Unbind_Topic_WebSocket_GET_Message);
            websocket.Register_WebSocket_Topic_And_Callbacks("Rules", rules_websocket.Process_Rules_Topic_WebSocket_POST_Message, rules_websocket.Process_Rules_Topic_WebSocket_GET_Message);
            websocket.Register_WebSocket_Topic_And_Callbacks("Records", records_websocket.Process_Records_Topic_WebSocket_POST_Message, records_websocket.Process_Records_Topic_WebSocket_GET_Message);
            
            websocket.Register_WebSocket_Topic_And_Callbacks("Accessories", accessories_websocket.Process_Accessories_Topic_WebSocket_POST_Message, accessories_websocket.Process_Accessories_Topic_WebSocket_GET_Message);
            websocket.Register_WebSocket_Topic_And_Callbacks("Water", water_websocket.Process_Water_Topic_WebSocket_POST_Message, water_websocket.Process_Water_Topic_WebSocket_GET_Message);
            websocket.Register_WebSocket_Topic_And_Callbacks("Lighting", lighting_websocket.Process_Lighting_Topic_WebSocket_POST_Message, lighting_websocket.Process_Lighting_Topic_WebSocket_GET_Message);
            websocket.Register_WebSocket_Topic_And_Callbacks("Gas", gas_websocket.Process_Gas_Topic_WebSocket_POST_Message, gas_websocket.Process_Gas_Topic_WebSocket_GET_Message);
            websocket.Register_WebSocket_Topic_And_Callbacks("Environment", environment_websocket.Process_Environment_Topic_WebSocket_POST_Message, environment_websocket.Process_Environment_Topic_WebSocket_GET_Message);
            websocket.Register_WebSocket_Topic_And_Callbacks("Electrical", electricpower_websocket.Process_Electric_Power_Topic_WebSocket_POST_Message, electricpower_websocket.Process_Electric_Power_Topic_WebSocket_GET_Message);

            websocket.Register_WebSocket_Topic_And_Callbacks("AirQuality", airquality_websocket.Process_Air_Quality_Topic_WebSocket_POST_Message, airquality_websocket.Process_Air_Quality_Topic_WebSocket_GET_Message);
            websocket.Register_WebSocket_Topic_And_Callbacks("Weather", weather_websocket.Process_Weather_Topic_WebSocket_POST_Message, weather_websocket.Process_Weather_Topic_WebSocket_GET_Message);
            websocket.Register_WebSocket_Topic_And_Callbacks("Bridge", bridge_websocket.Process_Bridge_Topic_WebSocket_POST_Message, bridge_websocket.Process_Bridge_Topic_WebSocket_GET_Message);
        }
        catch (e) {
            debug("[WebSocket APP] WebSocket_APP_Init() Error " + e);
        }
    };
};

module.exports = WebSocket_APP;
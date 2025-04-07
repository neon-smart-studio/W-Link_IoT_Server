// Example express application adding the parse-server module to expose Parse
// compatible API routes.
var debug = require('debug')(require('path').basename(__filename));

require('events').EventEmitter.defaultMaxListeners = 100;

var Web = require('./Web/Web.js');
var web = new Web();

var MQTT = require('./MQTT/MQTT.js');
var mqtt = new MQTT();

var WebSocket_APP = require('./Web/WebSocket_APP.js');
var websocket_app = new WebSocket_APP();

var Zigbee = require('./Zigbee/Zigbee.js');
var zigbee = new Zigbee();
var Zigbee_Event = require('./Zigbee/Zigbee_Event.js');
var zigbee_event = new Zigbee_Event();

var BLE = require('./Bluetooth/BLE.js');
var ble = new BLE();
var BLE_Event = require('./Bluetooth/BLE_Event.js');
var ble_event = new BLE_Event();

process.on('uncaughtException', err => {
  if (err == "Error: LIBUSB_TRANSFER_STALL" || err == "Error: LIBUSB_TRANSFER_ERROR")
  {
      if (err == "Error: LIBUSB_TRANSFER_STALL") console.log("LIBUSB_TRANSFER_STALL");
      if (err == "Error: LIBUSB_TRANSFER_ERROR") console.log("LIBUSB_TRANSFER_ERROR");
  }
  else { 
      console.log("Error: "+ err);
  }
});

async function main()
{
  await zigbee.Zigbee_Start();
  zigbee_event.Zigbee_Event_Init();
  
  await ble.BLE_Start();
  ble_event.Zigbee_Event_Init();

  web.Web_Init();

  websocket_app.WebSocket_APP_Init();

  mqtt.MQTT_Init();
  mqtt_event.MQTT_Event_Init();

  web.Web_Start();
}

main();
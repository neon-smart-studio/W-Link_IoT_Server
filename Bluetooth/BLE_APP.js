// Example express application adding the parse-server module to expose Parse
// compatible API routes.
var debug = console.log;//require('debug')(require('path').basename(__filename));

var BLE = require('./BLE.js');
var ble = new BLE();

var BLE_Service_Device_Info = require('./Services/Device_Information_Service.js');
var ble_service_device_info = new BLE_Service_Device_Info();

var BLE_APP = function () {
    var self = this;

};


module.exports = BLE_APP;
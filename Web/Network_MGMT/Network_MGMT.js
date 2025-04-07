
var debug = require('debug')(require('path').basename(__filename));

const config = require('config');

var express = require('express');
var network_mgmt_router = express.Router();

var fs = require('fs');
var Web = require('../Web.js');
var web = new Web();

var html_asolute_path = web.html_asolute_path;

//network_mgmt_router.use('/WiFi', require('./WiFi/WiFi.js'));

network_mgmt_router.use('/WebSocket', require('./WebSocket/WebSocket.js'));
network_mgmt_router.use('/MQTT', require('./MQTT/MQTT.js'));
network_mgmt_router.use('/Zigbee', require('./Zigbee/Zigbee.js'));
network_mgmt_router.use('/Bluetooth', require('./Bluetooth/Bluetooth.js'));

network_mgmt_router.get('/', function(req, res) {
    res.redirect("https://" + req.headers['host'] + "/");
});

module.exports = network_mgmt_router;

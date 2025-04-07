
var debug = require('debug')(require('path').basename(__filename));

const config = require('config');

var express = require('express');
var device_mgmt_router = express.Router();

var fs = require('fs');
var Web = require('../Web.js');
var web = new Web();

var html_asolute_path = web.html_asolute_path;

device_mgmt_router.use('/Weather', require('./Weather/Weather.js'));
device_mgmt_router.use('/AirQuality', require('./AirQuality/Air_Quality.js'));
device_mgmt_router.use('/Bridge', require('./Bridge/Bridge.js'));
device_mgmt_router.use('/Water', require('./Water/Water.js'));
device_mgmt_router.use('/Lighting', require('./Lighting/Lighting.js'));
device_mgmt_router.use('/Environment', require('./Environment/Environment.js'));
device_mgmt_router.use('/Gas', require('./Gas/Gas.js'));
device_mgmt_router.use('/ElectricPower', require('./ElectricPower/ElectricPower.js'));
device_mgmt_router.use('/Accessories', require('./Accessories/Accessories.js'));

device_mgmt_router.get('/', function(req, res) {
    res.redirect("https://" + req.headers['host'] + "/");
});

module.exports = device_mgmt_router;

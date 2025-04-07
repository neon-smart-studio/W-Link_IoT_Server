
var debug = require('debug')(require('path').basename(__filename));

const config = require('config');

var express = require('express');
var service_router = express.Router();

var fs = require('fs');
var Web = require('../Web.js');
var web = new Web();

var html_asolute_path = web.html_asolute_path;

service_router.use('/Records', require('./Records/Records.js'));
service_router.use('/Environment_Management', require('./Environment_Management/Environment_Management.js'));
service_router.use('/Lighting_Automation', require('./Lighting_Automation/Lighting_Automation.js'));
service_router.use('/Power_Management', require('./Power_Management/Power_Management.js'));
service_router.use('/Water_Management', require('./Water_Management/Water_Management.js'));


service_router.get('/', function(req, res) {
    res.redirect("https://" + req.headers['host'] + "/");
});

module.exports = service_router;

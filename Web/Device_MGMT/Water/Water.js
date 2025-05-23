
var debug = require('debug')(require('path').basename(__filename));

const config = require('config');

var express = require('express');
var water_device_router = express.Router();

var fs = require('fs');

var Web = require('../../Web.js');
var web = new Web();

var html_asolute_path = web.html_asolute_path;

water_device_router.use('/Electromagnetic_Valve', require('./Electromagnetic_Valve.js'));
water_device_router.use('/Pump_Motor', require('./Pump_Motor.js'));
water_device_router.use('/Flow_Meter', require('./Flow_Meter.js'));
water_device_router.use('/Water_Level_Sensor', require('./Water_Level_Sensor.js'));
water_device_router.use('/Water_PH_Sensor', require('./Water_PH_Sensor.js'));
water_device_router.use('/Water_EC_Sensor', require('./Water_EC_Sensor.js'));
water_device_router.use('/Water_Tank', require('./Water_Tank.js'));

water_device_router.get('/', async function(req, res) {
    var template_page_params = {};

    template_page_params['session_token'] = req.session.id;
    template_page_params['language'] = "Chinese";
    template_page_params['topic'] = "Water";
    template_page_params['device_type'] = "Not Specific";
    template_page_params['nav_page_info'] = JSON.parse(fs.readFileSync(html_asolute_path+"/website_map.json", "utf8"));
    
    res.render(html_asolute_path + '/device_mgmt/device_mgmt', template_page_params);
});
module.exports = water_device_router;

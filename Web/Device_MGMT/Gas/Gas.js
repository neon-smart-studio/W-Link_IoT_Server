
var debug = require('debug')(require('path').basename(__filename));

const config = require('config');

var express = require('express');
var gas_router = express.Router();

var fs = require('fs');
var Web = require('../../Web.js');
var web = new Web();

var html_asolute_path = web.html_asolute_path;

gas_router.use('/Air_Valve', require('./Air_Valve.js'));
gas_router.use('/O2_Sensor', require('./O2_Sensor.js'));
gas_router.use('/CO2_Sensor', require('./CO2_Sensor.js'));
gas_router.use('/O3_Sensor', require('./O3_Sensor.js'));
gas_router.use('/CO_Sensor', require('./CO_Sensor.js'));
gas_router.use('/SO2_Sensor', require('./SO2_Sensor.js'));
gas_router.use('/NO2_Sensor', require('./NO2_Sensor.js'));
gas_router.use('/TVOC_Sensor', require('./TVOC_Sensor.js'));

gas_router.get('/', async function(req, res) {
    var template_page_params = {};

    template_page_params['session_token'] = req.session.id;
    template_page_params['language'] = "Chinese";
    template_page_params['topic'] = "Gas";
    template_page_params['device_type'] = "Not Specific";
    template_page_params['nav_page_info'] = JSON.parse(fs.readFileSync(html_asolute_path+"/website_map.json", "utf8"));
    
    res.render(html_asolute_path + '/device_mgmt/device_mgmt', template_page_params);
});
module.exports = gas_router;

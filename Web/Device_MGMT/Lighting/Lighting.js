
var debug = require('debug')(require('path').basename(__filename));

const config = require('config');

var express = require('express');
var lighting_router = express.Router();

var fs = require('fs');
var Web = require('../../Web.js');
var web = new Web();

var html_asolute_path = web.html_asolute_path;

lighting_router.use('/OnOff_Light', require('./OnOff_Light.js'));
lighting_router.use('/Dimmable_Light', require('./Dimmable_Light.js'));
lighting_router.use('/Colored_Light', require('./Colored_Light.js'));
lighting_router.use('/ColorTemperature_Light', require('./ColorTemperature_Light.js'));
lighting_router.use('/Light_Sensor', require('./Light_Sensor.js'));

lighting_router.get('/', async function(req, res) {
    var template_page_params = {};

    template_page_params['session_token'] = req.session.id;
    template_page_params['language'] = "Chinese";
    template_page_params['topic'] = "Lighting";
    template_page_params['device_type'] = "Not Specific";
    template_page_params['nav_page_info'] = JSON.parse(fs.readFileSync(html_asolute_path+"/website_map.json", "utf8"));
    
    res.render(html_asolute_path + '/device_mgmt/device_mgmt', template_page_params);
});
module.exports = lighting_router;


var debug = require('debug')(require('path').basename(__filename));

const config = require('config');

var express = require('express');
var environment_router = express.Router();

var fs = require('fs');
var Web = require('../../Web.js');
var web = new Web();
var Account_MGR = require('../../../Util/Account_MGR.js');
var account_mgr = new Account_MGR();

var html_asolute_path = web.html_asolute_path;

environment_router.use('/Blind_Curtain', require('./Blind_Curtain.js'));
environment_router.use('/Circulating_Fan', require('./Circulating_Fan.js'));
environment_router.use('/Temperature_Sensor', require('./Temperature_Sensor.js'));
environment_router.use('/Humidity_Sensor', require('./Humidity_Sensor.js'));
environment_router.use('/Pressure_Sensor', require('./Pressure_Sensor.js'));
environment_router.use('/PM2_5_Sensor', require('./PM2_5_Sensor.js'));
environment_router.use('/SolarRadiation_Sensor', require('./Solar_Radiation_Sensor.js'));
environment_router.use('/SoilTemperature_Sensor', require('./Soil_Temperature_Sensor.js'));
environment_router.use('/SoilMoisture_Sensor', require('./Soil_Moisture_Sensor.js'));
environment_router.use('/SoilEC_Sensor', require('./Soil_EC_Sensor.js'));
environment_router.use('/Rain_Guage', require('./Rain_Guage.js'));
environment_router.use('/Wind_Guage', require('./Wind_Guage.js'));

environment_router.get('/', async function(req, res) {
    var template_page_params = {};

    var username = "everyone";
    
    if(config.get('account_login')==true)
    {
        username = await account_mgr.Find_User_By_UI_Session_Token(req.session.id);
        if(username==null)
        {
            res.redirect("https://" + req.headers['host'] + "/");
            return;
        }
    }

    template_page_params['session_token'] = req.session.id;
    template_page_params['language'] = "Chinese";
    template_page_params['username'] = username;
    template_page_params['topic'] = "Environment";
    template_page_params['device_type'] = "Not Specific";
    template_page_params['nav_page_info'] = JSON.parse(fs.readFileSync(html_asolute_path+"/website_map.json", "utf8"));
    res.render(html_asolute_path + '/device_mgmt/device_mgmt', template_page_params);
});
module.exports = environment_router;

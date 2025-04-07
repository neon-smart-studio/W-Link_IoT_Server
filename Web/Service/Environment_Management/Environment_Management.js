
var debug = require('debug')(require('path').basename(__filename));

const config = require('config');

var express = require('express');
var environment_management = express.Router();

var fs = require('fs');
var Web = require('../../Web.js');
var web = new Web();

var html_asolute_path = web.html_asolute_path;

environment_management.use('/Groups_Management', require('./Groups_Management.js'));
environment_management.use('/Bind_Unbind', require('./Bind_Unbind.js'));
environment_management.use('/Rules_Management', require('./Rules_Management.js'));

environment_management.get('/', async function(req, res) {
    var template_page_params = {};

    template_page_params['session_token'] = req.session.id;
    template_page_params['language'] = "Chinese";
    template_page_params['topic'] = "EnvironmentManagement";
    template_page_params['sub_service'] = "Not Specific";
    template_page_params['nav_page_info'] = JSON.parse(fs.readFileSync(html_asolute_path+"/website_map.json", "utf8"));
    
    res.render(html_asolute_path + '/service/service', template_page_params);
});
module.exports = environment_management;

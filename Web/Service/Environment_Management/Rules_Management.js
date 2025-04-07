
var debug = require('debug')(require('path').basename(__filename));

const config = require('config');

var express = require('express');
var rules_management_router = express.Router();

var fs = require('fs');
var Web = require('../../Web.js');
var web = new Web();

var html_asolute_path = web.html_asolute_path;

rules_management_router.get('/', async function(req, res) {
    var template_page_params = {};

    template_page_params['session_token'] = req.session.id;
    template_page_params['language'] = "Chinese";
    template_page_params['topic'] = "EnvironmentManagement";
    template_page_params['sub_service'] = "Rules Management";
    template_page_params['nav_page_info'] = JSON.parse(fs.readFileSync(html_asolute_path+"/website_map.json", "utf8"));

    res.render(html_asolute_path + '/rule_mgmt/rule_mgmt', template_page_params);
});
module.exports = rules_management_router;

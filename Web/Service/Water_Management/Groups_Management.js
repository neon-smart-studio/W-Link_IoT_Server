
var debug = require('debug')(require('path').basename(__filename));

const config = require('config');

var express = require('express');
var groups_mgmt_router = express.Router();

var fs = require('fs');
var Web = require('../../Web.js');
var web = new Web();

var html_asolute_path = web.html_asolute_path;

groups_mgmt_router.get('/', async function(req, res) {
    var template_page_params = {};

    template_page_params['session_token'] = req.session.id;
    template_page_params['language'] = "Chinese";
    template_page_params['topic'] = "WaterManagement";
    template_page_params['sub_service'] = "Groups Management";
    template_page_params['nav_page_info'] = JSON.parse(fs.readFileSync(html_asolute_path+"/website_map.json", "utf8"));

    res.render(html_asolute_path + '/group_mgmt/group_mgmt', template_page_params);
});
module.exports = groups_mgmt_router;

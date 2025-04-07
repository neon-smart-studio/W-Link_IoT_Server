
var debug = require('debug')(require('path').basename(__filename));

const config = require('config');

var express = require('express');
var accessories_router = express.Router();

var fs = require('fs');
var Web = require('../../Web.js');
var web = new Web();
var Account_MGR = require('../../../Util/Account_MGR.js');
var account_mgr = new Account_MGR();

var html_asolute_path = web.html_asolute_path;

accessories_router.use('/OnOff_Switch', require('./OnOff_Switch.js'));
accessories_router.use('/Toggle_Switch', require('./Toggle_Switch.js'));
accessories_router.use('/Dimmable_Switch', require('./Dimmable_Switch.js'));
accessories_router.use('/Scene_Switch', require('./Scene_Switch.js'));
accessories_router.use('/Motion_Sensor', require('./Motion_Sensor.js'));
accessories_router.use('/Door_Window_Sensor', require('./Door_Window_Sensor.js'));

accessories_router.get('/', async function(req, res) {
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
    template_page_params['topic'] = "Accessories";
    template_page_params['device_type'] = "Not Specific";
    template_page_params['nav_page_info'] = JSON.parse(fs.readFileSync(html_asolute_path+"/website_map.json", "utf8"));
    res.render(html_asolute_path + '/device_mgmt/device_mgmt', template_page_params);
});
module.exports = accessories_router;

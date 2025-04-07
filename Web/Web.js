
var debug = require('debug')(require('path').basename(__filename));

const config = require('config');

var path = require('path');
var fs = require('fs');
var express = require('express');
var session = require('express-session');

var WebSocket_Server = require('./WebSocket.js');
var websocket_server = new WebSocket_Server();

var html_asolute_path = __dirname + "/html";

var webserver_exp = null;
var WebServer = null;

var httpport = process.env.PORT || 80;

if(config.get('support_SSL_Web')==true)
{
  var ssl_webserver_exp = null;
  var SSL_WebServer = null;

  var httpsport = process.env.PORT || 443;

  var web_ssl_options = {
    key: fs.readFileSync(__dirname + '/SSL/wlink_key.pem'),
    cert: fs.readFileSync(__dirname + '/SSL/wlink_cert.pem'),
  };
}

const sessionParser = session({
  secret: 'recommand 128 bytes random string', // 建议使用 128 个字符的随机字符串
  cookie: { secure: true, maxAge: 365 * 24 * 60 * 60 * 1000 },
  saveUninitialized: true,
  secret: '$eCuRiTy',
  resave: false
});

function Web_UI_Init(web_express)
{
  web_express.use(sessionParser);

  web_express.set('view engine', 'ejs');
  
  // Parse Server plays nicely with the rest of your web routes
  web_express.get('/', async function (req, res) {
    var index_page_params = {};
    
    index_page_params['session_token'] = req.session.id;
    index_page_params['language'] = "Chinese";
    index_page_params['background_img_file'] = "default.jpg";
    
    index_page_params['nav_page_info'] = JSON.parse(fs.readFileSync(html_asolute_path + "/website_map.json", "utf8"));
    res.render(html_asolute_path + '/index', index_page_params);
  });

  web_express.use('/Network_MGMT', require('./Network_MGMT/Network_MGMT.js'));
  web_express.use('/Device_MGMT', require('./Device_MGMT/Device_MGMT.js'));
  web_express.use('/Service', require('./Service/Service.js'));

  web_express.use(express.static(html_asolute_path));
}

var Web = function () {
  var self = this;
  self.Web_SSL_Info = web_ssl_options;
  self.html_asolute_path = html_asolute_path;

  self.Web_Init = function () {
    try {
      webserver_exp = express();
      
      if(config.get('support_SSL_Web')==true)
      {
        ssl_webserver_exp = express();
        
        Web_UI_Init(ssl_webserver_exp);
      }
      else{
        Web_UI_Init(webserver_exp);
      }

      websocket_server.WebSocket_Init();
    }
    catch (e) {
      debug("[Web] Web_Init() Error " + e);
    }
  };
  self.Web_Start = function () {
    try {
      // Parse Server plays nicely with the rest of your web routes
      
      if(config.get('support_SSL_Web')==true)
      {
        webserver_exp.use(function (req, res, next) {
          res.redirect("https://" + req.headers['host'] + req.url);
        });

        ssl_webserver_exp.use(function (req, res, next) {
          res.status(404).render('404', { status: 404, title: '404 錯誤 - 找不到頁面' });
        });

        SSL_WebServer = require('https').createServer(web_ssl_options, ssl_webserver_exp);
        SSL_WebServer.listen(httpsport, function () {
          debug('ssl webserver running on port ' + httpsport + '.');
          debug('Make sure port ' + httpsport + ' is not used by another program. ex: VMWare Hostd(VMWare Workstation Remote Access).');
        });
      }
      else{
        webserver_exp.use(function (req, res, next) {
          res.status(404).render('404', { status: 404, title: '404 錯誤 - 找不到頁面' });
        });
      }
      
      WebServer = require('http').createServer(webserver_exp);
      WebServer.listen(httpport, function () {
        debug('webserver running on port ' + httpport + '.');
      });
    }
    catch (e) {
      debug("[Web] Web_Start() Error " + e);
    }
  };
};

module.exports = Web;

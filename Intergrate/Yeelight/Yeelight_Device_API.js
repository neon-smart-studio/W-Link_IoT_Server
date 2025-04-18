
var debug = require('debug')(require('path').basename(__filename));

var Yeelight = require('node-yeelight');
var yeelight = new Yeelight();

var Device_MGR = require('../Util/Device_MGR.js');
var device_mgr = new Device_MGR();

yeelight.on('ready', function() {
    debug("[Yeelight_Device_API] Yeelight Ready");
});
yeelight.listen();

var yeelight_discover_device_timeout_timer = null;

var yeelight_discovered_device_obj_list = [];
var yeelight_linked_device_obj_list = [];

const Yeelight_Device_Type = "Lighting";

function do_Get_Yeelight_ID(yeelight_obj)
{
    var id_str = yeelight_obj.id;
    
    var indexOfHexTag = id_str.indexOf("x");
    var device_ID = (indexOfHexTag>=0) ? id_str.substring(indexOfHexTag+1) : id_str;

    return device_ID;
}

var Yeelight_Device_API = function () {
    var self = this;

    self.Discover_Yeelight_Device = async function (discover_duration) {
        try {
            if(discover_duration>=60000)
            {
                discover_duration = 60000;
            }

            var discover_results = [];

            const do_discover_yeelight = function(){
              return new Promise(function(resolve, reject) {
                process.nextTick(() => {
                    yeelight.on('deviceadded', function(device) {
                        var yeelight_ID = do_Get_Yeelight_ID(device);
                        yeelight_discovered_device_obj_list[yeelight_ID] = device;
                        discover_results.push(device);
                    });
                    yeelight.discover();
                    yeelight_discover_device_timeout_timer = setTimeout(()=>{
                        yeelight.on('deviceadded', ()=>{});
                        resolve();
                    }, discover_duration);
                });
              });
            }

            await do_discover_yeelight();

            return discover_results;
        }
        catch (e) {
            debug("[Yeelight_Discover_API] Discover_Yeelight_Device() Error " + e);
        }
    };

    self.Link_To_Yeelight_Device = async function (username, yeelight_ID) {
        try {
            if(yeelight_discovered_device_obj_list[yeelight_ID]==null)
            {
                const do_discover_yeelight = function(){
                  return new Promise(function(resolve, reject) {
                    process.nextTick(() => {
                        yeelight.on('deviceadded', function(device) {
                            var dev_ID = do_Get_Yeelight_ID(device);
                            yeelight_discovered_device_obj_list[dev_ID] = device;
                            
                            if(dev_ID==yeelight_ID)
                            {
                                clearTimeout(yeelight_discover_device_timeout_timer);
                                resolve();
                            }
                        });
                        yeelight.discover();
                        yeelight_discover_device_timeout_timer = setTimeout(()=>{
                            yeelight.on('deviceadded', ()=>{});
                            resolve();
                        }, 5000);
                    });
                  });
                }
    
                await do_discover_yeelight();

                if(yeelight_discovered_device_obj_list[yeelight_ID]==null)
                {
                    return false;
                }
            }

            var yeelight_device_obj = yeelight_discovered_device_obj_list[yeelight_ID];

            var light_model = yeelight_device_obj.model;
            if(light_model==null || light_model=="Unknown")
            {
                return false;
            }

            var light_name = yeelight_ID;
            var device_Type;
            switch(light_model)
            {
                case "white":
                    device_Type = "Color Temperature Light";
                    if(light_name=="")
                    {
                        light_name = "Yeelight CCT"
                    }
                    break;
                case "color":
                    device_Type = "Colored Light";
                    if(light_name=="")
                    {
                        light_name = "Yeelight Colored"
                    }
                    break;
            }

            yeelight_linked_device_obj_list[device_ID] = yeelight_device_obj;

            var yeelight_new_dev_info = {
                "device_Name": light_name,
                "network_Type": "TCP/IP",
                "protocol_Type": "Yeelink API Tunnel",
                "device_Type": device_Type,
                "model": light_model,
                "ip_address": yeelight_device_obj.host,
                "port": yeelight_device_obj.port
            };
            return await device_mgr.Save_Device_Info(Yeelight_Device_Type, username, yeelight_ID, yeelight_new_dev_info);
        }
        catch (e) {
            debug("[Yeelight_Device_API] Yeelight_Connect_To_Light_Device() Error " + e);
        }
    };
    
    self.Rename_Yeelight_Device = async function (username, device_ID, new_name) {
        try {
            return await device_mgr.Device_Change_Name(Yeelight_Device_Type, username, device_ID, new_name);
        }
        catch (e) {
            debug("[Yeelight_Device_API] Rename_Yeelight_Device() Error " + e);
        }
    };

    self.Remove_Yeelight_Device = async function (username, device_ID) {
        try {
            delete yeelight_linked_device_obj_list[device_ID];

            return await device_mgr.Remove_Device(Yeelight_Device_Type, username, device_ID);
        }
        catch (e) {
            debug("[Yeelight_Device_API] Remove_Yeelight_Device() Error " + e);
        }
    };

    self.Get_Yeelight_Device_Session = async function (username, device_ID) {
        try {
            var session = yeelight_linked_device_obj_list[device_ID];
            if(session==null)
            {
                var device_inf = await device_mgr.Read_Device_Inf(Yeelight_Device_Type, username, device_ID);
                if(device_inf==null)
                {
                    return null;
                }
                var yeelight_ID = device_inf.yeelight_ID;

                session = yeelight_discovered_device_obj_list[yeelight_ID];
                yeelight_linked_device_obj_list[device_ID] = session;
            }

            return session;
        }
        catch (e) {
            debug("[Yeelight_Device_API] Get_Yeelight_Device_Session() Error " + e);
        }
    };
};

module.exports = Yeelight_Device_API;
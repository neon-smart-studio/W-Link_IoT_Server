
var debug = require('debug')(require('path').basename(__filename));

var WebSocket = require('../../WebSocket.js');
var websocket = new WebSocket();

var Yeelight_Device_API = require('../../../Integrate/Yeelight/Yeelight_Device_API.js');
var yeelight_device_api = new Yeelight_Device_API();

var Yeelight_WebSocket = function (){
    var self = this;
    
    self.Process_Yeelight_WebSocket_POST_Message = async function(username, post_yeelight_json_data)
    {
        try{
            if(post_yeelight_json_data.command!=null){
                switch(post_yeelight_json_data.command){
                    case "Link To Yeelight":
                        if(post_yeelight_json_data.ip!=null){
                            var link_status = await yeelight_device_api.Link_To_Yeelight_Device(username, post_yeelight_json_data.ip);
                            if(link_status)
                            {
                                var ws_report_cmd = {
                                    "command_type": "Yeelight",
                                    "command": "Report Yeelight Link Successfully",
                                    "ip": post_yeelight_json_data.ip
                                }
            
                                websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User(username, 'Integrate', ws_report_cmd);
                            }
                        }
                        break;
                }
            }
        }
        catch(e)
        {
            debug('[Yeelight_WebSocket] Process_Yeelight_WebSocket_POST_Message() Error ' + e);
        }
    }

    self.Process_Yeelight_WebSocket_GET_Message = async function(username, get_yeelight_json_data)
    {
        try{
            var rsp_json = null;
            if(get_yeelight_json_data.command!=null){
                switch(get_yeelight_json_data.command){
                    case "Discover Nearby Yeelight":
                        rsp_json = await yeelight_device_api.Discover_Nearby_Yeelight(username);
                        break;
                }
            }
            return rsp_json;
        }
        catch(e)
        {
            debug('[Yeelight_WebSocket] Process_Yeelight_WebSocket_GET_Message() Error ' + e);
        }
    }

}
module.exports = Yeelight_WebSocket;
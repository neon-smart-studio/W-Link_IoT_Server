
var debug = require('debug')(require('path').basename(__filename));

var WebSocket = require('../../WebSocket.js');
var websocket = new WebSocket();

var LIFX_Device_API = require('../../../Integrate/LIFX/LIFX_Device_API.js');
var lifx_device_api = new LIFX_Device_API();

var LIFX_WebSocket = function (){
    var self = this;
    
    self.Process_LIFX_WebSocket_POST_Message = async function(username, post_lifx_json_data)
    {
        try{
            if(post_lifx_json_data.command!=null){
                switch(post_lifx_json_data.command){
                    case "Link To LIFX":
                        if(post_lifx_json_data.ip!=null && post_lifx_json_data.mac!=null){
                            var link_status = await lifx_device_api.Link_To_Lifx_Device(username, post_lifx_json_data.ip, post_lifx_json_data.mac);
                            if(link_status)
                            {
                                var ws_report_cmd = {
                                    "command_type": "LIFX",
                                    "command": "Report LIFX Link Successfully",
                                    "ip": post_lifx_json_data.ip,
                                    "mac": post_lifx_json_data.mac,
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
            debug('[LIFX_WebSocket] Process_LIFX_WebSocket_POST_Message() Error ' + e);
        }
    }

    self.Process_LIFX_WebSocket_GET_Message = async function(username, get_lifx_json_data)
    {
        try{
            var rsp_json = null;
            if(get_lifx_json_data.command!=null){
                switch(get_lifx_json_data.command){
                    case "Discover Nearby LIFX":
                        rsp_json = await lifx_device_api.Discover_Nearby_LIFX(username);
                        break;
                }
            }
            return rsp_json;
        }
        catch(e)
        {
            debug('[LIFX_WebSocket] Process_LIFX_WebSocket_GET_Message() Error ' + e);
        }
    }

}
module.exports = LIFX_WebSocket;
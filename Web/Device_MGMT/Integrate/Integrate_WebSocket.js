
var debug = require('debug')(require('path').basename(__filename));

var Hue_Bridge_WebSocket = require('./Hue_Bridge_WebSocket.js');
var hue_bridge_webSocket = new Hue_Bridge_WebSocket();

var LIFX_WebSocket = require('./LIFX_WebSocket.js');
var lifx_webSocket = new LIFX_WebSocket();

var Integrate_WebSocket = function (){
    var self = this;
    
    self.Process_Integrate_Topic_WebSocket_POST_Message = async function(username, post_json_data)
    {
        try{
            if(post_json_data.command_type!=null){
                switch(post_json_data.command_type){
                    case "Hue Bridge":
                        await hue_bridge_webSocket.Process_Hue_Bridge_WebSocket_POST_Message(username, post_json_data);
                        break;
                    case "LIFX":
                        await lifx_webSocket.Process_LIFX_WebSocket_POST_Message(username, post_json_data);
                        break;
                }
            }
        }
        catch(e)
        {
            debug('[Integrate_WebSocket] Process_Integrate_WebSocket_POST_Message() Error ' + e);
        }
    }

    self.Process_Integrate_Topic_WebSocket_GET_Message = async function(username, get_json_data)
    {
        try{
            var rsp_json = null;
            if(get_json_data.command_type!=null){
                switch(get_json_data.command_type){
                    case "Hue Bridge":
                        rsp_json = await hue_bridge_webSocket.Process_Hue_Bridge_WebSocket_GET_Message(username, get_json_data);
                        break;
                    case "LIFX":
                        rsp_json = await lifx_webSocket.Process_LIFX_WebSocket_GET_Message(username, get_json_data);
                        break;
                }
            }
            return rsp_json;
        }
        catch(e)
        {
            debug('[Integrate_WebSocket] Process_Integrate_WebSocket_GET_Message() Error ' + e);
        }
    }
}
module.exports = Integrate_WebSocket;

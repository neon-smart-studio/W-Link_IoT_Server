
var debug = require('debug')(require('path').basename(__filename));

var Atmosphere_Box_WebSocket = require('./Atmosphere_Box_WebSocket.js');
var atmosphere_box_webSocket = new Atmosphere_Box_WebSocket();

var Air_Quality_WebSocket = function (){
    var self = this;
    
    self.Process_Air_Quality_Topic_WebSocket_POST_Message = async function(username, post_json_data)
    {
        try{
            if(post_json_data.command_type!=null){
                switch(post_json_data.command_type){
                    case "Atmosphere Box":
                        await atmosphere_box_webSocket.Process_Atmosphere_Box_WebSocket_POST_Message(username, post_json_data);
                        break;
                }
            }
        }
        catch(e)
        {
            debug('[Air_Quality_WebSocket] Process_Air_Quality_Topic_WebSocket_POST_Message() Error ' + e);
        }
    }

    self.Process_Air_Quality_Topic_WebSocket_GET_Message = async function(username, get_json_data)
    {
        try{
            var rsp_json = null;
            if(get_json_data.command_type!=null){
                switch(get_json_data.command_type){
                    case "Atmosphere Box":
                        rsp_json = await atmosphere_box_webSocket.Process_Atmosphere_Box_WebSocket_GET_Message(username, get_json_data);
                        break;
                }
            }
            return rsp_json;
        }
        catch(e)
        {
            debug('[Air_Quality_WebSocket] Process_Air_Quality_Topic_WebSocket_GET_Message() Error ' + e);
        }
    }
}
module.exports = Air_Quality_WebSocket;

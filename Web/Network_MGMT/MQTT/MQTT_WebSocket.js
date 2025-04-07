
var debug = require('debug')(require('path').basename(__filename));

var WebSocket = require('../../WebSocket.js');
var websocket = new WebSocket();

var MQTT_WebSocket = function (){
    var self = this;
    
    self.Process_MQTT_Topic_WebSocket_POST_Message = async function(username, post_json_data)
    {
        try{
            if(post_json_data.command!=null){
                switch(get_json_data.command){
                }
            }
        }
        catch(e)
        {
            debug('[MQTT_WebSocket] Process_MQTT_Topic_WebSocket_POST_Message() Error ' + e);
        }
    }

    self.Process_MQTT_Topic_WebSocket_GET_Message = async function(username, get_json_data)
    {
        try{
            var rsp_json = null;
            if(get_json_data.command!=null){
                switch(get_json_data.command){
                }
            }
            return rsp_json;
        }
        catch(e)
        {
            debug('[MQTT_WebSocket] Process_MQTT_Topic_WebSocket_GET_Message() Error ' + e);
        }
    }
}
module.exports = MQTT_WebSocket;


var debug = require('debug')(require('path').basename(__filename));

var Weather_Station_WebSocket = require('./Weather_Station_WebSocket.js');
var weather_station_webSocket = new Weather_Station_WebSocket();

var Weather_WebSocket = function (){
    var self = this;
    
    self.Process_Weather_Topic_WebSocket_POST_Message = async function(username, post_json_data)
    {
        try{
            if(post_json_data.command_type!=null){
                switch(post_json_data.command_type){
                    case "Weather Station":
                        await weather_station_webSocket.Process_Weather_Station_WebSocket_POST_Message(username, post_json_data);
                        break;
                }
            }
        }
        catch(e)
        {
            debug('[Weather_WebSocket] Process_Weather_WebSocket_POST_Message() Error ' + e);
        }
    }

    self.Process_Weather_Topic_WebSocket_GET_Message = async function(username, get_json_data)
    {
        try{
            var rsp_json = null;
            if(get_json_data.command_type!=null){
                switch(get_json_data.command_type){
                    case "Weather Station":
                        rsp_json = await weather_station_webSocket.Process_Weather_Station_WebSocket_GET_Message(username, get_json_data);
                        break;
                }
            }
            return rsp_json;
        }
        catch(e)
        {
            debug('[Weather_WebSocket] Process_Weather_WebSocket_GET_Message() Error ' + e);
        }
    }
}
module.exports = Weather_WebSocket;

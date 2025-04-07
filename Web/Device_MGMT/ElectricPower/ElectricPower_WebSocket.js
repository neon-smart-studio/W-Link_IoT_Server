
var debug = require('debug')(require('path').basename(__filename));

var OnOff_Socket_WebSocket = require('./OnOff_Socket_WebSocket.js');
var onoff_socket_webSocket = new OnOff_Socket_WebSocket();
var Dimmable_Socket_WebSocket = require('./Dimmable_Socket_WebSocket.js');
var dimmable_socket_webSocket = new Dimmable_Socket_WebSocket();
var Power_Meter_WebSocket = require('./Power_Meter_WebSocket.js');
var power_meter_webSocket = new Power_Meter_WebSocket();

var Electric_Power_WebSocket = function (){
    var self = this;
    
    self.Process_Electric_Power_Topic_WebSocket_POST_Message = async function(username, post_json_data)
    {
        try{
            if(post_json_data.command_type!=null){
                switch(post_json_data.command_type){
                    case "OnOff Socket":
                        await onoff_socket_webSocket.Process_OnOff_Socket_WebSocket_POST_Message(username, post_json_data);
                        break;
                    case "Dimmable Socket":
                        await dimmable_socket_webSocket.Process_Dimmable_Socket_WebSocket_POST_Message(username, post_json_data);
                        break;
                    case "Power Meter":
                        await power_meter_webSocket.Process_Power_Meter_WebSocket_POST_Message(username, post_json_data);
                        break;
                }
            }
        }
        catch(e)
        {
            debug('[Electric_Power_WebSocket] Process_Electric_Power_Topic_WebSocket_POST_Message() Error ' + e);
        }
    }

    self.Process_Electric_Power_Topic_WebSocket_GET_Message = async function(username, get_json_data)
    {
        try{
            var rsp_json = null;
            if(get_json_data.command_type!=null){
                switch(get_json_data.command_type){
                    case "OnOff Socket":
                        rsp_json = await onoff_socket_webSocket.Process_OnOff_Socket_WebSocket_GET_Message(username, get_json_data);
                        break;
                    case "Dimmable Socket":
                        rsp_json = await dimmable_socket_webSocket.Process_Dimmable_Socket_WebSocket_GET_Message(username, get_json_data);
                        break;
                    case "Power Meter":
                        rsp_json = await power_meter_webSocket.Process_Power_Meter_WebSocket_GET_Message(username, get_json_data);
                        break;
                }
            }
            return rsp_json;
        }
        catch(e)
        {
            debug('[Electric_Power_WebSocket] Process_Electric_Power_Topic_WebSocket_GET_Message() Error ' + e);
        }
    }
}
module.exports = Electric_Power_WebSocket;

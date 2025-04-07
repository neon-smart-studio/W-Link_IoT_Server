
var debug = require('debug')(require('path').basename(__filename));

var Air_Valve_WebSocket = require('./Air_Valve_WebSocket.js');
var air_valve_webSocket = new Air_Valve_WebSocket();
var CO_Sensor_WebSocket = require('./CO_Sensor_WebSocket.js');
var co_sensor_webSocket = new CO_Sensor_WebSocket();
var CO2_Sensor_WebSocket = require('./CO2_Sensor_WebSocket.js');
var co2_sensor_webSocket = new CO2_Sensor_WebSocket();
var NO2_Sensor_WebSocket = require('./NO2_Sensor_WebSocket.js');
var no2_sensor_webSocket = new NO2_Sensor_WebSocket();
var O2_Sensor_WebSocket = require('./O2_Sensor_WebSocket.js');
var o2_sensor_webSocket = new O2_Sensor_WebSocket();
var O3_Sensor_WebSocket = require('./O3_Sensor_WebSocket.js');
var o3_sensor_webSocket = new O3_Sensor_WebSocket();
var SO2_Sensor_WebSocket = require('./SO2_Sensor_WebSocket.js');
var so2_sensor_webSocket = new SO2_Sensor_WebSocket();
var TVOC_Sensor_WebSocket = require('./TVOC_Sensor_WebSocket.js');
var tvoc_sensor_webSocket = new TVOC_Sensor_WebSocket();

var Gas_WebSocket = function (){
    var self = this;
    
    self.Process_Gas_Topic_WebSocket_POST_Message = async function(username, post_json_data)
    {
        try{
            if(post_json_data.command_type!=null){
                switch(post_json_data.command_type){
                    case "Air Valve":
                        await air_valve_webSocket.Process_Air_Valve_WebSocket_POST_Message(username, post_json_data);
                        break;
                    case "CO Sensor":
                        await co_sensor_webSocket.Process_CO_Sensor_WebSocket_POST_Message(username, post_json_data);
                        break;
                    case "CO2 Sensor":
                        await co2_sensor_webSocket.Process_CO2_Sensor_WebSocket_POST_Message(username, post_json_data);
                        break;
                    case "NO2 Sensor":
                        await no2_sensor_webSocket.Process_NO2_Sensor_WebSocket_POST_Message(username, post_json_data);
                        break;
                    case "O2 Sensor":
                        await o2_sensor_webSocket.Process_O2_Sensor_WebSocket_POST_Message(username, post_json_data);
                        break;
                    case "O3 Sensor":
                        await o3_sensor_webSocket.Process_O3_Sensor_WebSocket_POST_Message(username, post_json_data);
                        break;
                    case "SO2 Sensor":
                        await so2_sensor_webSocket.Process_SO2_Sensor_WebSocket_POST_Message(username, post_json_data);
                        break;
                    case "TVOC Sensor":
                        await tvoc_sensor_webSocket.Process_TVOC_Sensor_WebSocket_POST_Message(username, post_json_data);
                        break;
                }
            }
        }
        catch(e)
        {
            debug('[Gas_WebSocket] Process_Gas_WebSocket_POST_Message() Error ' + e);
        }
    }

    self.Process_Gas_Topic_WebSocket_GET_Message = async function(username, get_json_data)
    {
        try{
            var rsp_json = null;
            if(get_json_data.command_type!=null){
                switch(get_json_data.command_type){
                    case "Air Valve":
                        rsp_json = await air_valve_webSocket.Process_Air_Valve_WebSocket_GET_Message(username, get_json_data);
                        break;
                    case "CO Sensor":
                        rsp_json = await co_sensor_webSocket.Process_CO_Sensor_WebSocket_GET_Message(username, get_json_data);
                        break;
                    case "CO2 Sensor":
                        rsp_json = await co2_sensor_webSocket.Process_CO2_Sensor_WebSocket_GET_Message(username, get_json_data);
                        break;
                    case "NO2 Sensor":
                        rsp_json = await no2_sensor_webSocket.Process_NO2_Sensor_WebSocket_GET_Message(username, get_json_data);
                        break;
                    case "O2 Sensor":
                        rsp_json = await o2_sensor_webSocket.Process_O2_Sensor_WebSocket_GET_Message(username, get_json_data);
                        break;
                    case "O3 Sensor":
                        rsp_json = await o3_sensor_webSocket.Process_O3_Sensor_WebSocket_GET_Message(username, get_json_data);
                        break;
                    case "SO2 Sensor":
                        rsp_json = await so2_sensor_webSocket.Process_SO2_Sensor_WebSocket_GET_Message(username, get_json_data);
                        break;
                    case "TVOC Sensor":
                        rsp_json = await tvoc_sensor_webSocket.Process_TVOC_Sensor_WebSocket_GET_Message(username, get_json_data);
                        break;
                }
            }
            return rsp_json;
        }
        catch(e)
        {
            debug('[Gas_WebSocket] Process_Gas_WebSocket_GET_Message() Error ' + e);
        }
    }
}
module.exports = Gas_WebSocket;

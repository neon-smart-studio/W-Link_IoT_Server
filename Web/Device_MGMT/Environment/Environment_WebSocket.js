
var debug = require('debug')(require('path').basename(__filename));

var Blind_Curtain_WebSocket = require('./Blind_Curtain_WebSocket.js');
var blind_curtain_webSocket = new Blind_Curtain_WebSocket();
var Circulating_Fan_WebSocket = require('./Circulating_Fan_WebSocket.js');
var circulating_fan_webSocket = new Circulating_Fan_WebSocket();
var Humidity_Sensor_WebSocket = require('./Humidity_Sensor_WebSocket.js');
var humidity_sensor_webSocket = new Humidity_Sensor_WebSocket();
var PM2_5_Sensor_WebSocket = require('./PM2_5_Sensor_WebSocket.js');
var pm2_5_sensor_webSocket = new PM2_5_Sensor_WebSocket();
var Pressure_Sensor_WebSocket = require('./Pressure_Sensor_WebSocket.js');
var pressure_sensor_webSocket = new Pressure_Sensor_WebSocket();
var Soil_EC_Sensor_WebSocket = require('./Soil_EC_Sensor_WebSocket.js');
var soil_ec_sensor_webSocket = new Soil_EC_Sensor_WebSocket();
var Soil_Moisture_Sensor_WebSocket = require('./Soil_Moisture_Sensor_WebSocket.js');
var soil_moisture_sensor_webSocket = new Soil_Moisture_Sensor_WebSocket();
var Soil_Temperature_Sensor_WebSocket = require('./Soil_Temperature_Sensor_WebSocket.js');
var soil_temperature_sensor_webSocket = new Soil_Temperature_Sensor_WebSocket();
var Solar_Radiation_Sensor_WebSocket = require('./Solar_Radiation_Sensor_WebSocket.js');
var solar_radiation_sensor_webSocket = new Solar_Radiation_Sensor_WebSocket();
var Temperature_Sensor_WebSocket = require('./Temperature_Sensor_WebSocket.js');
var temperature_sensor_webSocket = new Temperature_Sensor_WebSocket();
var Rain_Guage_WebSocket = require('./Rain_Guage_WebSocket.js');
var rain_guage_webSocket = new Rain_Guage_WebSocket();
var Wind_Guage_WebSocket = require('./Wind_Guage_WebSocket.js');
var wind_guage_webSocket = new Wind_Guage_WebSocket();

var Environment_WebSocket = function (){
    var self = this;
    
    self.Process_Environment_Topic_WebSocket_POST_Message = async function(username, post_json_data)
    {
        try{
            if(post_json_data.command_type!=null){
                switch(post_json_data.command_type){
                    case "Blind Curtain":
                        await blind_curtain_webSocket.Process_Blind_Curtain_WebSocket_POST_Message(username, post_json_data);
                        break;
                    case "Circulating Fan":
                        await circulating_fan_webSocket.Process_Circulating_Fan_WebSocket_POST_Message(username, post_json_data);
                        break;
                    case "Humidity Sensor":
                        await humidity_sensor_webSocket.Process_Humidity_Sensor_WebSocket_POST_Message(username, post_json_data);
                        break;
                    case "PM2.5 Sensor":
                        await pm2_5_sensor_webSocket.Process_PM2_5_Sensor_WebSocket_POST_Message(username, post_json_data);
                        break;
                    case "Pressure Sensor":
                        await pressure_sensor_webSocket.Process_Pressure_Sensor_WebSocket_POST_Message(username, post_json_data);
                        break;
                    case "Soil EC Sensor":
                        await soil_ec_sensor_webSocket.Process_Soil_EC_Sensor_WebSocket_POST_Message(username, post_json_data);
                        break;
                    case "Soil Moisture Sensor":
                        await soil_moisture_sensor_webSocket.Process_Soil_Moisture_Sensor_WebSocket_POST_Message(username, post_json_data);
                        break;
                    case "Soil Temperature Sensor":
                        await soil_temperature_sensor_webSocket.Process_Soil_Temperature_Sensor_WebSocket_POST_Message(username, post_json_data);
                        break;
                    case "Solar Radiation Sensor":
                        await solar_radiation_sensor_webSocket.Process_Solar_Radiation_Sensor_WebSocket_POST_Message(username, post_json_data);
                        break;
                    case "Temperature Sensor":
                        await temperature_sensor_webSocket.Process_Temperature_Sensor_WebSocket_POST_Message(username, post_json_data);
                        break;
                    case "Rain Guage":
                        await rain_guage_webSocket.Process_Rain_Guage_WebSocket_POST_Message(username, post_json_data);
                        break;
                    case "Wind Guage":
                        await wind_guage_webSocket.Process_Wind_Guage_WebSocket_POST_Message(username, post_json_data);
                        break;
                }
            }
        }
        catch(e)
        {
            debug('[Environment_WebSocket] Process_Environment_Topic_WebSocket_POST_Message() Error ' + e);
        }
    }

    self.Process_Environment_Topic_WebSocket_GET_Message = async function(username, get_json_data)
    {
        try{
            var rsp_json = null;
            if(get_json_data.command_type!=null){
                switch(get_json_data.command_type){
                    case "Blind Curtain":
                        rsp_json = await blind_curtain_webSocket.Process_Blind_Curtain_WebSocket_GET_Message(username, get_json_data);
                        break;
                    case "Circulating Fan":
                        rsp_json = await circulating_fan_webSocket.Process_Circulating_Fan_WebSocket_GET_Message(username, get_json_data);
                        break;
                    case "Humidity Sensor":
                        rsp_json = await humidity_sensor_webSocket.Process_Humidity_Sensor_WebSocket_GET_Message(username, get_json_data);
                        break;
                    case "PM2.5 Sensor":
                        rsp_json = await pm2_5_sensor_webSocket.Process_PM2_5_Sensor_WebSocket_GET_Message(username, get_json_data);
                        break;
                    case "Pressure Sensor":
                        rsp_json = await pressure_sensor_webSocket.Process_Pressure_Sensor_WebSocket_GET_Message(username, get_json_data);
                        break;
                    case "Soil EC Sensor":
                        rsp_json = await soil_ec_sensor_webSocket.Process_Soil_EC_Sensor_WebSocket_GET_Message(username, get_json_data);
                        break;
                    case "Soil Moisture Sensor":
                        rsp_json = await soil_moisture_sensor_webSocket.Process_Soil_Moisture_Sensor_WebSocket_GET_Message(username, get_json_data);
                        break;
                    case "Soil Temperature Sensor":
                        rsp_json = await soil_temperature_sensor_webSocket.Process_Soil_Temperature_Sensor_WebSocket_GET_Message(username, get_json_data);
                        break;
                    case "Solar Radiation Sensor":
                        rsp_json = await solar_radiation_sensor_webSocket.Process_Solar_Radiation_Sensor_WebSocket_GET_Message(username, get_json_data);
                        break;
                    case "Temperature Sensor":
                        rsp_json = await temperature_sensor_webSocket.Process_Temperature_Sensor_WebSocket_GET_Message(username, get_json_data);
                        break;
                    case "Rain Guage":
                        rsp_json = await rain_guage_webSocket.Process_Rain_Guage_WebSocket_GET_Message(username, get_json_data);
                        break;
                    case "Wind Guage":
                        rsp_json = await wind_guage_webSocket.Process_Wind_Guage_WebSocket_GET_Message(username, get_json_data);
                        break;
                }
            }
            return rsp_json;
        }
        catch(e)
        {
            debug('[Environment_WebSocket] Process_Environment_Topic_WebSocket_GET_Message() Error ' + e);
        }
    }
}
module.exports = Environment_WebSocket;

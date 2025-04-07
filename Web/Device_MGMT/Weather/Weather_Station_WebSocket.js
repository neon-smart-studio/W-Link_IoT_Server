
var debug = require('debug')(require('path').basename(__filename));

var Weather_Station_API = require('../../../Device_MGMT/Weather/Weather_Station_API.js');
var weather_station_api = new Weather_Station_API();

var Weather_Station_WebSocket = function (){
    var self = this;
    
    self.Process_Weather_Station_WebSocket_POST_Message = async function(username, post_weather_station_json_data)
    {
        try{
            if(post_weather_station_json_data.command!=null){
                switch(post_weather_station_json_data.command){
                }
            }
        }
        catch(e)
        {
            debug('[Weather_Station_WebSocket] Process_Weather_Station_WebSocket_POST_Message() Error ' + e);
        }
    }

    self.Process_Weather_Station_WebSocket_GET_Message = async function(username, get_weather_station_json_data)
    {
        try{
            var rsp_json = null;
            if(get_weather_station_json_data.command!=null){
                switch(get_weather_station_json_data.command){
                    case "Get Weather Station Current Measure":
                        if(get_weather_station_json_data.device_ID!=null){
                            var get_rsp_json = await weather_station_api.Weather_Station_Get_Current_Measure(get_weather_station_json_data.device_ID);
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_weather_station_json_data.device_ID
                                };
                            }
                            else{
                                rsp_json = {
                                    "timeout": false,
                                    "device_ID": get_weather_station_json_data.device_ID,
                                    "measure_temperature": get_rsp_json.measure_temperature,
                                    "measure_humidity": get_rsp_json.measure_humidity,
                                    "measure_rain_rate_mm_hr": get_rsp_json.measure_rain_rate_mm_hr,
                                    "measure_wind_speed": get_rsp_json.measure_wind_speed,
                                    "measure_wind_diration": get_rsp_json.measure_wind_diration,
                                    "measure_solar_radiation": get_rsp_json.measure_solar_radiation,
                                    "measure_UV_index": get_rsp_json.measure_UV_index,
                                    "measure_UV_MED_hr": get_rsp_json.measure_UV_MED_hr,
                                    "measure_wetness": get_rsp_json.measure_wetness,
                                    "measure_soil_temperature": get_rsp_json.measure_soil_temperature,
                                    "measure_soil_moisture": get_rsp_json.measure_soil_moisture
                                };
                            }
                        }
                        break;
                }
            }
            return rsp_json;
        }
        catch(e)
        {
            debug('[Weather_Station_WebSocket] Process_Weather_Station_WebSocket_GET_Message() Error ' + e);
        }
    }

}
module.exports = Weather_Station_WebSocket;

var debug = require('debug')(require('path').basename(__filename));

var Atmosphere_Box_API = require('../../../Device_MGMT/AirQuality/Atmosphere_Box_API.js');
var atmosphere_box_api = new Atmosphere_Box_API();

var Atmosphere_Box_WebSocket = function (){
    var self = this;
    
    self.Process_Atmosphere_Box_WebSocket_POST_Message = async function(username, post_atmosphere_box_json_data)
    {
        try{
            if(post_atmosphere_box_json_data.command!=null){
                switch(post_atmosphere_box_json_data.command){
                }
            }
        }
        catch(e)
        {
            debug('[Atmosphere_Box_WebSocket] Process_Atmosphere_Box_WebSocket_POST_Message() Error ' + e);
        }
    }

    self.Process_Atmosphere_Box_WebSocket_GET_Message = async function(username, get_atmosphere_box_json_data, callback)
    {
        try{
            var rsp_json = null;
            if(get_atmosphere_box_json_data.command!=null){
                switch(get_atmosphere_box_json_data.command){
                    case "Get Atmosphere Box Sensor Status":
                        if(get_atmosphere_box_json_data.device_ID!=null){
                            var get_rsp_json = await atmosphere_box_api.Atmosphere_Box_Get_Sensor_Status(get_atmosphere_box_json_data.device_ID);
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_atmosphere_box_json_data.device_ID
                                };
                            }
                            else{
                                rsp_json = {
                                    "timeout": false,
                                    "device_ID": get_atmosphere_box_json_data.device_ID,
                                    "measure_temperature": get_rsp_json.measure_temperature,
                                    "measure_humidity": get_rsp_json.measure_humidity,
                                    "measure_pm_2_5": get_rsp_json.measure_pm_2_5,
                                    "measure_tvoc": get_rsp_json.measure_tvoc,
                                    "measure_co_ppm": get_rsp_json.measure_co_ppm,
                                    "measure_co2_ppm": get_rsp_json.measure_co2_ppm
                                };
                            }
                        }
                        break;
                    case "Get Atmosphere Box Sensor Info":
                        if(get_atmosphere_box_json_data.device_ID!=null){
                            var get_rsp_json = await atmosphere_box_api.Atmosphere_Box_Get_Sensor_Info(get_atmosphere_box_json_data.device_ID);
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_atmosphere_box_json_data.device_ID
                                };
                            }
                            else{
                                rsp_json = {
                                    "timeout": false,
                                    "device_ID": get_atmosphere_box_json_data.device_ID,
                                    "CO_sensor_info": {
                                        "sensitivity_nA_PPM": get_rsp_json.CO_sensor_info.sensitivity_nA_PPM,
                                        "sensor_resistance": get_rsp_json.CO_sensor_info.sensor_resistance
                                    }
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
        debug('[Atmosphere_Box_WebSocket] Process_Atmosphere_Box_WebSocket_GET_Message() Error ' + e);
    }
    }

}
module.exports = Atmosphere_Box_WebSocket;
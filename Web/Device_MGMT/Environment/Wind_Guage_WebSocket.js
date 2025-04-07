
var debug = require('debug')(require('path').basename(__filename));

var Device_MGR = require('../../../Util/Device_MGR.js');
var device_mgr = new Device_MGR();

var Wind_Guage_API = require('../../../Device_MGMT/Environment/Wind_Guage_API.js');
var wind_guage_api = new Wind_Guage_API();

const Wind_Guage_Device_Type = "Wind Guage";

var Wind_Guage_WebSocket = function (){
    var self = this;
    
    self.Process_Wind_Guage_WebSocket_POST_Message = async function(username, post_wind_guage_json_data)
    {
        try{
            if(post_wind_guage_json_data.command!=null){
                switch(post_wind_guage_json_data.command){
                }
            }
        }
        catch(e)
        {
            debug('[Wind_Guage_WebSocket] Process_Wind_Guage_WebSocket_POST_Message() Error ' + e);
        }
    }

    self.Process_Wind_Guage_WebSocket_GET_Message = async function(username, get_wind_guage_json_data)
    {
        try{
            var rsp_json = null;
            if(get_wind_guage_json_data.command!=null){
                switch(get_wind_guage_json_data.command){
                    case "Get Num Of Wind Guage":
                        if(get_wind_guage_json_data.device_ID!=null){
                            var get_rsp_json = await wind_guage_api.Wind_Guage_Get_Num_Of_Sensor(get_wind_guage_json_data.device_ID);
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_wind_guage_json_data.device_ID
                                };
                            }
                            else{
                                rsp_json = {
                                    "timeout": false,
                                    "device_ID": get_wind_guage_json_data.device_ID,
                                    "num_of_wind_guage": get_rsp_json.num_of_wind_guage
                                };
                            }
                        }
                        break;
                    case "Get Individual Wind Guage Status":
                        if(get_wind_guage_json_data.device_ID!=null && get_wind_guage_json_data.guage_index!=null){
                            var device_info_json = await device_mgr.Read_Device_Inf(Wind_Guage_Device_Type, username, get_wind_guage_json_data.device_ID);
                            var get_rsp_json = await wind_guage_api.Wind_Guage_Get_Individual_Sensor_Status(get_wind_guage_json_data.device_ID, get_wind_guage_json_data.guage_index);
                            
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_wind_guage_json_data.device_ID
                                };
                            }
                            else{
                                switch(device_info_json.guage_model)
                                {
                                    case "YGC-FS":
                                        rsp_json = {
                                            "timeout": false,
                                            "device_ID": get_wind_guage_json_data.device_ID,
                                            "guage_index": get_rsp_json.guage_index,
                                            "measure_wind_speed": get_rsp_json.measure_wind_speed,
                                            "measure_wind_direction": get_rsp_json.measure_wind_direction
                                        };
                                        break;
                                    default:
                                        rsp_json = {
                                            "timeout": false,
                                            "device_ID": get_wind_guage_json_data.device_ID,
                                            "guage_index": get_rsp_json.guage_index,
                                            "measure_wind_speed": get_rsp_json.measure_wind_speed,
                                            "measure_wind_direction": get_rsp_json.measure_wind_direction
                                        };
                                        break;
                                }
                            }
                        }
                        break;
                    case "Get All Wind Guage Status":
                        if(get_wind_guage_json_data.device_ID!=null){
                            var device_info_json = await device_mgr.Read_Device_Inf(Wind_Guage_Device_Type, username, get_wind_guage_json_data.device_ID);
                            var get_rsp_json = await wind_guage_api.Wind_Guage_Get_All_Sensor_Status(get_wind_guage_json_data.device_ID);
                            var guage_status_list = [];
                            
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_wind_guage_json_data.device_ID
                                };
                            }
                            else{
                                switch(device_info_json.guage_model)
                                {
                                    case "YGC-FS":
                                        for(var i = 0; i<get_rsp_json.num_of_wind_guage; i++)
                                        {
                                            guage_status_list.push({
                                                "guage_index": get_rsp_json.individual_guage_status[i].guage_index,
                                                "measure_wind_speed": get_rsp_json.individual_guage_status[i].measure_wind_speed,
                                                "measure_wind_direction": get_rsp_json.individual_guage_status[i].measure_wind_direction
                                            });
                                        }
                                        break;
                                    default:
                                        for(var i = 0; i<get_rsp_json.num_of_wind_guage; i++)
                                        {
                                            guage_status_list.push({
                                                "guage_index": get_rsp_json.individual_guage_status[i].guage_index,
                                                "measure_wind_speed": get_rsp_json.individual_guage_status[i].measure_wind_speed,
                                                "measure_wind_direction": get_rsp_json.individual_guage_status[i].measure_wind_direction
                                            });
                                        }
                                        break;
                                }
                                rsp_json = {
                                    "timeout": false,
                                    "device_ID": get_wind_guage_json_data.device_ID,
                                    "num_of_wind_guage": get_rsp_json.num_of_wind_guage,
                                    "guage_status_list": guage_status_list
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
            debug('[Wind_Guage_WebSocket] Process_Wind_Guage_WebSocket_GET_Message() Error ' + e);
        }
    }

}
module.exports = Wind_Guage_WebSocket;
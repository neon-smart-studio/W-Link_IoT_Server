
var debug = require('debug')(require('path').basename(__filename));

var Device_MGR = require('../../../Util/Device_MGR.js');
var device_mgr = new Device_MGR();

var Rain_Guage_API = require('../../../Device_MGMT/Environment/Rain_Guage_API.js');
var rain_guage_api = new Rain_Guage_API();

const Rain_Guage_Device_Type = "Rain Guage";

var Rain_Guage_WebSocket = function (){
    var self = this;
    
    self.Process_Rain_Guage_WebSocket_POST_Message = async function(username, post_rain_guage_json_data)
    {
        try{
            if(post_rain_guage_json_data.command!=null){
                switch(post_rain_guage_json_data.command){
                }
            }
        }
        catch(e)
        {
            debug('[Rain_Guage_WebSocket] Process_Rain_Guage_WebSocket_POST_Message() Error ' + e);
        }
    }

    self.Process_Rain_Guage_WebSocket_GET_Message = async function(username, get_rain_guage_json_data)
    {
        try{
            var rsp_json = null;
            if(get_rain_guage_json_data.command!=null){
                switch(get_rain_guage_json_data.command){
                    case "Get Num Of Rain Guage":
                        if(get_rain_guage_json_data.device_ID!=null){
                            var get_rsp_json = await rain_guage_api.Rain_Guage_Get_Num_Of_Sensor(get_rain_guage_json_data.device_ID);
                            
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_rain_guage_json_data.device_ID
                                };
                            }
                            else{
                                rsp_json = {
                                    "timeout": false,
                                    "device_ID": get_rain_guage_json_data.device_ID,
                                    "num_of_rain_guage": get_rsp_json.num_of_rain_guage
                                };
                            }
                        }
                        break;
                    case "Get Individual Rain Guage Status":
                        if(get_rain_guage_json_data.device_ID!=null && get_rain_guage_json_data.guage_index!=null){
                            var device_info_json = await device_mgr.Read_Device_Inf(Rain_Guage_Device_Type, username, get_rain_guage_json_data.device_ID);
                            var get_rsp_json = await rain_guage_api.Rain_Guage_Get_Individual_Sensor_Status(get_rain_guage_json_data.device_ID, get_rain_guage_json_data.guage_index);
                            
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_rain_guage_json_data.device_ID
                                };
                            }
                            else{
                                switch(device_info_json.guage_model)
                                {
                                    case "WH0531":
                                        rsp_json = {
                                            "timeout": false,
                                            "device_ID": get_rain_guage_json_data.device_ID,
                                            "guage_index": get_rsp_json.guage_index,
                                            "measure_rain_rate_mm_hr": get_rsp_json.measure_rain_rate_mm_hr,
                                        };
                                        break;
                                    default:
                                        rsp_json = {
                                            "timeout": false,
                                            "device_ID": get_rain_guage_json_data.device_ID,
                                            "guage_index": get_rsp_json.guage_index,
                                            "measure_rain_rate_mm_hr": get_rsp_json.measure_rain_rate_mm_hr,
                                        };
                                        break;
                                }
                            }
                        }
                        break;
                    case "Get All Rain Guage Status":
                        if(get_rain_guage_json_data.device_ID!=null){
                            var device_info_json = await device_mgr.Read_Device_Inf(Rain_Guage_Device_Type, username, get_rain_guage_json_data.device_ID);
                            var get_rsp_json = await rain_guage_api.Rain_Guage_Get_All_Sensor_Status(get_rain_guage_json_data.device_ID);
                            var guage_status_list = [];

                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_rain_guage_json_data.device_ID
                                };
                            }
                            else{
                                switch(device_info_json.guage_model)
                                {
                                    case "WH0531":
                                        for(var i = 0; i<get_rsp_json.num_of_rain_guage; i++)
                                        {
                                            guage_status_list.push({
                                                "guage_index": get_rsp_json.individual_guage_status[i].guage_index,
                                                "measure_rain_rate_mm_hr": get_rsp_json.individual_guage_status[i].measure_rain_rate_mm_hr
                                            });
                                        }
                                        break;
                                    default:
                                        for(var i = 0; i<get_rsp_json.num_of_rain_guage; i++)
                                        {
                                            guage_status_list.push({
                                                "guage_index": get_rsp_json.individual_guage_status[i].guage_index,
                                                "measure_rain_rate_mm_hr": get_rsp_json.individual_guage_status[i].measure_rain_rate_mm_hr
                                            });
                                        }
                                        break;
                                }
                                rsp_json = {
                                    "timeout": false,
                                    "device_ID": get_rain_guage_json_data.device_ID,
                                    "num_of_rain_guage": get_rsp_json.num_of_rain_guage,
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
            debug('[Rain_Guage_WebSocket] Process_Rain_Guage_WebSocket_GET_Message() Error ' + e);
        }
    }

}
module.exports = Rain_Guage_WebSocket;
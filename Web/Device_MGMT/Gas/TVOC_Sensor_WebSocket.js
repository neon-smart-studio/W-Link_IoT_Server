
var debug = require('debug')(require('path').basename(__filename));

var Device_MGR = require('../../../Util/Device_MGR.js');
var device_mgr = new Device_MGR();

var TVOC_Sensor_API = require('../../../Device_MGMT/Gas/TVOC_Sensor_API.js');
var tvoc_sensor_api = new TVOC_Sensor_API();

const TVOC_Sensor_Device_Type = "TVOC Sensor";

var TVOC_Sensor_WebSocket = function (){
    var self = this;
    
    self.Process_TVOC_Sensor_WebSocket_POST_Message = async function(username, post_tvoc_sensor_json_data)
    {
        try{
            if(post_tvoc_sensor_json_data.command!=null){
                switch(post_tvoc_sensor_json_data.command){
                }
            }
        }
        catch(e)
        {
            debug('[TVOC_Sensor_WebSocket] Process_TVOC_Sensor_WebSocket_POST_Message() Error ' + e);
        }
    }
    
    self.Process_TVOC_Sensor_WebSocket_GET_Message = async function(username, get_tvoc_sensor_json_data)
    {
        try{
            var rsp_json = null;
            if(get_tvoc_sensor_json_data.command!=null){
                switch(get_tvoc_sensor_json_data.command){
                    case "Get Num Of TVOC Sensor":
                        if(get_tvoc_sensor_json_data.device_ID!=null){
                            var get_rsp_json = await tvoc_sensor_api.TVOC_Sensor_Get_Num_Of_Sensor(get_tvoc_sensor_json_data.device_ID);
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_tvoc_sensor_json_data.device_ID
                                };
                            }
                            else{
                                rsp_json = {
                                    "timeout": false,
                                    "device_ID": get_tvoc_sensor_json_data.device_ID,
                                    "num_of_tvoc_sensor": get_rsp_json.num_of_tvoc_sensor
                                };
                            }
                        }
                        break;
                    case "Get Individual TVOC Sensor Status":
                        if(get_tvoc_sensor_json_data.device_ID!=null && get_tvoc_sensor_json_data.sensor_index!=null){
                            var device_info_json = await device_mgr.Read_Device_Inf(TVOC_Sensor_Device_Type, username, get_tvoc_sensor_json_data.device_ID);
                            var get_rsp_json = await tvoc_sensor_api.TVOC_Sensor_Get_Individual_Sensor_Status(get_tvoc_sensor_json_data.device_ID, get_tvoc_sensor_json_data.sensor_index);
                            
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_tvoc_sensor_json_data.device_ID
                                };
                            }
                            else{
                                switch(device_info_json.sensor_model)
                                {
                                    case "iAQ-Core":
                                    case "MICS-VZ-89TE":
                                        rsp_json = {
                                            "timeout": false,
                                            "device_ID": get_tvoc_sensor_json_data.device_ID,
                                            "sensor_index": get_rsp_json.sensor_index,
                                            "sensor_resistance": get_rsp_json.sensor_resistance,
                                            "measure_co2_ppm": get_rsp_json.ms_co2_ppm,
                                            "measure_tvoc": get_rsp_json.ms_tvoc
                                        };
                                        break;
                                    default:
                                        rsp_json = {
                                            "timeout": false,
                                            "device_ID": get_tvoc_sensor_json_data.device_ID,
                                            "sensor_index": get_rsp_json.sensor_index,
                                            "measure_tvoc": get_rsp_json.ms_tvoc
                                        };
                                        break;
                                }
                            }
                        }
                        break;
                    case "Get All TVOC Sensor Status":
                        if(get_tvoc_sensor_json_data.device_ID!=null){
                            var device_info_json = await device_mgr.Read_Device_Inf(TVOC_Sensor_Device_Type, username, get_tvoc_sensor_json_data.device_ID);
                            var get_rsp_json = await tvoc_sensor_api.TVOC_Sensor_Get_All_Sensor_Status(get_tvoc_sensor_json_data.device_ID);
                            var sensor_status_list = [];

                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_tvoc_sensor_json_data.device_ID
                                };
                            }
                            else{
                                switch(device_info_json.sensor_model)
                                {
                                    case "iAQ-Core":
                                    case "MICS-VZ-89TE":
                                        for(var i = 0; i<get_rsp_json.num_of_tvoc_sensor; i++)
                                        {
                                            sensor_status_list.push({
                                                "sensor_index": get_rsp_json.individual_sensor_status[i].sensor_index,
                                                "sensor_resistance": get_rsp_json.individual_sensor_status[i].sensor_resistance,
                                                "measure_co2_ppm": get_rsp_json.individual_sensor_status[i].ms_co2_ppm,
                                                "measure_tvoc": get_rsp_json.individual_sensor_status[i].ms_tvoc
                                            });
                                        }
                                        rsp_json = {
                                            "timeout": false,
                                            "device_ID": get_tvoc_sensor_json_data.device_ID,
                                            "num_of_tvoc_sensor": get_rsp_json.num_of_tvoc_sensor,
                                            "sensor_status_list": sensor_status_list
                                        };
                                        break;
                                    default:
                                        for(var i = 0; i<get_rsp_json.num_of_tvoc_sensor; i++)
                                        {
                                            sensor_status_list.push({
                                                "sensor_index": get_rsp_json.individual_sensor_status[i].sensor_index,
                                                "measure_tvoc": get_rsp_json.individual_sensor_status[i].ms_tvoc
                                            });
                                        }
                                        rsp_json = {
                                            "timeout": false,
                                            "device_ID": get_tvoc_sensor_json_data.device_ID,
                                            "num_of_tvoc_sensor": get_rsp_json.num_of_tvoc_sensor,
                                            "sensor_status_list": sensor_status_list
                                        };
                                        break;
                                }
                            }
                        }
                        break;
                }
            }
            return rsp_json;
        }
        catch(e)
        {
            debug('[TVOC_Sensor_WebSocket] Process_TVOC_Sensor_WebSocket_GET_Message() Error ' + e);
        }
    }
}
module.exports = TVOC_Sensor_WebSocket;
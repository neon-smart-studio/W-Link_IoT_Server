
var debug = require('debug')(require('path').basename(__filename));

var Device_MGR = require('../../../Util/Device_MGR.js');
var device_mgr = new Device_MGR();

var SO2_Sensor_API = require('../../../Device_MGMT/Gas/SO2_Sensor_API.js');
var so2_sensor_api = new SO2_Sensor_API();

const SO2_Sensor_Device_Type = "SO2 Sensor";

var SO2_Sensor_WebSocket = function (){
    var self = this;
    
    self.Process_SO2_Sensor_WebSocket_POST_Message = async function(username, post_so2_sensor_json_data)
    {
        try{
            if(post_so2_sensor_json_data.command!=null){
                switch(post_so2_sensor_json_data.command){
                }
            }
        }
        catch(e)
        {
            debug('[SO2_Sensor_WebSocket] Process_SO2_Sensor_WebSocket_POST_Message() Error ' + e);
        }
    }
    
    self.Process_SO2_Sensor_WebSocket_GET_Message = async function(username, get_so2_sensor_json_data)
    {
        try{
            var rsp_json = null;
            if(get_so2_sensor_json_data.command!=null){
                switch(get_so2_sensor_json_data.command){
                    case "Get Num Of SO2 Sensor":
                        if(get_so2_sensor_json_data.device_ID!=null){
                            var get_rsp_json = await so2_sensor_api.SO2_Sensor_Get_Num_Of_Sensor(get_so2_sensor_json_data.device_ID);
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_so2_sensor_json_data.device_ID
                                };
                            }
                            else{
                                rsp_json = {
                                    "timeout": false,
                                    "device_ID": get_so2_sensor_json_data.device_ID,
                                    "num_of_so2_sensor": get_rsp_json.num_of_so2_sensor
                                };
                            }
                        }
                        break;
                    case "Get Individual SO2 Sensor Status":
                        if(get_so2_sensor_json_data.device_ID!=null && get_so2_sensor_json_data.sensor_index!=null){
                            var device_info_json = await device_mgr.Read_Device_Inf(SO2_Sensor_Device_Type, username, get_so2_sensor_json_data.device_ID);
                            var get_rsp_json = await so2_sensor_api.SO2_Sensor_Get_Individual_Sensor_Status(get_so2_sensor_json_data.device_ID, get_so2_sensor_json_data.sensor_index);
                            
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_so2_sensor_json_data.device_ID
                                };
                            }
                            else{
                                switch(device_info_json.sensor_model)
                                {
                                    case "SPEC-Sensor":
                                        rsp_json = {
                                            "timeout": false,
                                            "device_ID": get_so2_sensor_json_data.device_ID,
                                            "sensor_index": get_rsp_json.sensor_index,
                                            "measure_so2_ppm": get_rsp_json.measure_so2_ppm
                                        };
                                        break;
                                    default:
                                        rsp_json = {
                                            "timeout": false,
                                            "device_ID": get_so2_sensor_json_data.device_ID,
                                            "sensor_index": get_rsp_json.sensor_index,
                                            "measure_so2_ppm": get_rsp_json.measure_so2_ppm
                                        };
                                        break;
                                }
                            }
                        }
                        break;
                    case "Get All SO2 Sensor Status":
                        if(get_so2_sensor_json_data.device_ID!=null){
                            var device_info_json = await device_mgr.Read_Device_Inf(SO2_Sensor_Device_Type, username, get_so2_sensor_json_data.device_ID);
                            var get_rsp_json = await so2_sensor_api.SO2_Sensor_Get_All_Sensor_Status(get_so2_sensor_json_data.device_ID);
                            var sensor_status_list = [];

                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_so2_sensor_json_data.device_ID
                                };
                            }
                            else{
                                switch(device_info_json.sensor_model)
                                {
                                    case "SPEC-Sensor":
                                        for(var i = 0; i<get_rsp_json.num_of_so2_sensor; i++)
                                        {
                                            sensor_status_list.push({
                                                "sensor_index": get_rsp_json.individual_sensor_status[i].sensor_index,
                                                "measure_so2_ppm": get_rsp_json.individual_sensor_status[i].measure_so2_ppm
                                            });
                                        }
                                        rsp_json = {
                                            "timeout": false,
                                            "device_ID": get_so2_sensor_json_data.device_ID,
                                            "num_of_so2_sensor": get_rsp_json.num_of_so2_sensor,
                                            "sensor_status_list": sensor_status_list
                                        };
                                        break;
                                    default:
                                        for(var i = 0; i<get_rsp_json.num_of_so2_sensor; i++)
                                        {
                                            sensor_status_list.push({
                                                "sensor_index": get_rsp_json.individual_sensor_status[i].sensor_index,
                                                "measure_so2_ppm": get_rsp_json.individual_sensor_status[i].measure_so2_ppm
                                            });
                                        }
                                        rsp_json = {
                                            "timeout": false,
                                            "device_ID": get_so2_sensor_json_data.device_ID,
                                            "num_of_so2_sensor": get_rsp_json.num_of_so2_sensor,
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
            debug('[SO2_Sensor_WebSocket] Process_SO2_Sensor_WebSocket_GET_Message() Error ' + e);
        }
    }
}
module.exports = SO2_Sensor_WebSocket;
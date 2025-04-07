
var debug = require('debug')(require('path').basename(__filename));

var Device_MGR = require('../../../Util/Device_MGR.js');
var device_mgr = new Device_MGR();

var Pressure_Sensor_API = require('../../../Device_MGMT/Environment/Pressure_Sensor_API.js');
var pressure_sensor_api = new Pressure_Sensor_API();

const Pressure_Sensor_Device_Type = "Pressure Sensor";

var Pressure_Sensor_WebSocket = function (){
    var self = this;
    
    self.Process_Pressure_Sensor_WebSocket_POST_Message = async function(username, post_pressure_sensor_json_data)
    {
        try{
            if(post_pressure_sensor_json_data.command!=null){
                switch(post_pressure_sensor_json_data.command){
                    case "Set Individual Pressure Sensor Resolution":
                        if(post_pressure_sensor_json_data.device_ID!=null && post_pressure_sensor_json_data.sensor_index!=null && post_pressure_sensor_json_data.resolution!=null){
                            await pressure_sensor_api.Pressure_Sensor_Set_Individual_Sensor_Resolution(post_pressure_sensor_json_data.device_ID, post_pressure_sensor_json_data.sensor_index, post_pressure_sensor_json_data.resolution);
                        }
                        break;
                    case "Set All Pressure Sensor Resolution":
                        if(post_pressure_sensor_json_data.device_ID!=null && post_pressure_sensor_json_data.resolution!=null){
                            await pressure_sensor_api.Pressure_Sensor_Set_All_Sensor_Resolution(post_pressure_sensor_json_data.device_ID, post_pressure_sensor_json_data.resolution);
                        }
                        break;
                }
            }
        }
        catch(e)
        {
            debug('[Pressure_Sensor_WebSocket] Process_Pressure_Sensor_WebSocket_POST_Message() Error ' + e);
        }
    }

    self.Process_Pressure_Sensor_WebSocket_GET_Message = async function(username, get_pressure_sensor_json_data)
    {
        try{
            var rsp_json = null;
            if(get_pressure_sensor_json_data.command!=null){
                switch(get_pressure_sensor_json_data.command){
                    case "Get Num Of Pressure Sensor":
                        if(get_pressure_sensor_json_data.device_ID!=null){
                            var get_rsp_json = await pressure_sensor_api.Pressure_Sensor_Get_Num_Of_Sensor(get_pressure_sensor_json_data.device_ID);
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_pressure_sensor_json_data.device_ID
                                };
                            }
                            else{
                                rsp_json = {
                                    "timeout": false,
                                    "device_ID": get_pressure_sensor_json_data.device_ID,
                                    "num_of_pressure_sensor": get_rsp_json.num_of_pressure_sensor
                                };
                            }
                        }
                        break;
                    case "Get Individual Pressure Sensor Status":
                        if(get_pressure_sensor_json_data.device_ID!=null && get_pressure_sensor_json_data.sensor_index!=null){
                            var device_info_json = await device_mgr.Read_Device_Inf(Pressure_Sensor_Device_Type, username, get_pressure_sensor_json_data.device_ID);
                            var get_rsp_json = await pressure_sensor_api.Pressure_Sensor_Get_Individual_Sensor_Status(get_pressure_sensor_json_data.device_ID, get_pressure_sensor_json_data.sensor_index);

                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_pressure_sensor_json_data.device_ID
                                };
                            }
                            else{
                                switch(device_info_json.sensor_model)
                                {
                                    case "BMP085":
                                        rsp_json = {
                                            "timeout": false,
                                            "device_ID": get_pressure_sensor_json_data.device_ID,
                                            "sensor_index": get_rsp_json.sensor_index,
                                            "measure_temperature": get_rsp_json.measure_temperature,
                                            "measure_pressure": get_rsp_json.measure_pressure,
                                            "ms_pressure_resolution": get_rsp_json.ms_pressure_resolution
                                        };
                                        break;
                                    default:
                                        rsp_json = {
                                            "timeout": false,
                                            "device_ID": get_pressure_sensor_json_data.device_ID,
                                            "sensor_index": get_rsp_json.sensor_index,
                                            "measure_pressure": get_rsp_json.measure_pressure
                                        };
                                        break;
                                }
                            }
                        }
                        break;
                    case "Get All Pressure Sensor Status":
                        if(get_pressure_sensor_json_data.device_ID!=null){
                            var device_info_json = await device_mgr.Read_Device_Inf(Pressure_Sensor_Device_Type, username, get_pressure_sensor_json_data.device_ID);
                            var get_rsp_json = await pressure_sensor_api.Pressure_Sensor_Get_All_Sensor_Status(get_pressure_sensor_json_data.device_ID);
                            var sensor_status_list = [];

                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_pressure_sensor_json_data.device_ID
                                };
                            }
                            else{
                                switch(device_info_json.sensor_model)
                                {
                                    case "BMP085":
                                        for(var i = 0; i<get_rsp_json.num_of_pressure_sensor; i++)
                                        {
                                            sensor_status_list.push({
                                                "sensor_index": get_rsp_json.individual_sensor_status[i].sensor_index,
                                                "measure_temperature": get_rsp_json.individual_sensor_status[i].measure_temperature,
                                                "measure_pressure": get_rsp_json.individual_sensor_status[i].measure_pressure,
                                                "ms_pressure_resolution": get_rsp_json.individual_sensor_status[i].ms_pressure_resolution
                                            });
                                        }
                                        rsp_json = {
                                            "timeout": false,
                                            "device_ID": get_pressure_sensor_json_data.device_ID,
                                            "num_of_pressure_sensor": get_rsp_json.num_of_pressure_sensor,
                                            "sensor_status_list": sensor_status_list
                                        };
                                        break;
                                    default:
                                        for(var i = 0; i<get_rsp_json.num_of_pressure_sensor; i++)
                                        {
                                            sensor_status_list.push({
                                                "sensor_index": get_rsp_json.individual_sensor_status[i].sensor_index,
                                                "measure_pressure": get_rsp_json.individual_sensor_status[i].measure_pressure
                                            });
                                        }
                                        rsp_json = {
                                            "timeout": false,
                                            "device_ID": get_pressure_sensor_json_data.device_ID,
                                            "num_of_pressure_sensor": get_rsp_json.num_of_pressure_sensor,
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
            debug('[Pressure_Sensor_WebSocket] Process_Pressure_Sensor_WebSocket_GET_Message() Error ' + e);
        }
    }

}
module.exports = Pressure_Sensor_WebSocket;
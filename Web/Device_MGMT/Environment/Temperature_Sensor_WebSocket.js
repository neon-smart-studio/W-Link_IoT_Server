
var debug = require('debug')(require('path').basename(__filename));

var Device_MGR = require('../../../Util/Device_MGR.js');
var device_mgr = new Device_MGR();

var Temperature_Sensor_API = require('../../../Device_MGMT/Environment/Temperature_Sensor_API.js');
var temperature_sensor_api = new Temperature_Sensor_API();

const Temperature_Sensor_Device_Type = "Temperature Sensor";

var Temperature_Sensor_WebSocket = function (){
    var self = this;
    
    self.Process_Temperature_Sensor_WebSocket_POST_Message = async function(username, post_temperature_sensor_json_data)
    {
        try{
            if(post_temperature_sensor_json_data.command!=null){
                switch(post_temperature_sensor_json_data.command){
                    case "Set Individual Temperature Sensor Resolution":
                        if(post_temperature_sensor_json_data.device_ID!=null && post_temperature_sensor_json_data.sensor_index!=null && post_temperature_sensor_json_data.resolution!=null){
                            await temperature_sensor_api.Temperature_Sensor_Set_Individual_Sensor_Resolution(post_temperature_sensor_json_data.device_ID, post_temperature_sensor_json_data.sensor_index, post_temperature_sensor_json_data.resolution);
                        }
                        break;
                    case "Set All Temperature Sensor Resolution":
                        if(post_temperature_sensor_json_data.device_ID!=null && post_temperature_sensor_json_data.resolution!=null){
                            await temperature_sensor_api.Temperature_Sensor_Set_All_Sensor_Resolution(post_temperature_sensor_json_data.device_ID, post_temperature_sensor_json_data.resolution);
                        }
                        break;
                }
            }
        }
        catch(e)
        {
            debug('[Temperature_Sensor_WebSocket] Process_Temperature_Sensor_WebSocket_POST_Message() Error ' + e);
        }
    }

    self.Process_Temperature_Sensor_WebSocket_GET_Message = async function(username, get_temperature_sensor_json_data)
    {
        try{
            var rsp_json = null;
            if(get_temperature_sensor_json_data.command!=null){
                switch(get_temperature_sensor_json_data.command){
                    case "Get Num Of Temperature Sensor":
                        if(get_temperature_sensor_json_data.device_ID!=null){
                            var get_rsp_json = await temperature_sensor_api.Temperature_Sensor_Get_Num_Of_Sensor(get_temperature_sensor_json_data.device_ID);
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_temperature_sensor_json_data.device_ID
                                };
                            }
                            else{
                                rsp_json = {
                                    "timeout": false,
                                    "device_ID": get_temperature_sensor_json_data.device_ID,
                                    "num_of_temperature_sensor": get_rsp_json.num_of_temperature_sensor
                                };
                            }
                        }
                        break;
                    case "Get Individual Temperature Sensor Status":
                        if(get_temperature_sensor_json_data.device_ID!=null && get_temperature_sensor_json_data.sensor_index!=null){
                            var device_info_json = await device_mgr.Read_Device_Inf(Temperature_Sensor_Device_Type, username, get_temperature_sensor_json_data.device_ID);
                            var get_rsp_json = await temperature_sensor_api.Temperature_Sensor_Get_Individual_Sensor_Status(get_temperature_sensor_json_data.device_ID, get_temperature_sensor_json_data.sensor_index);
                                    
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_temperature_sensor_json_data.device_ID
                                };
                            }
                            else{
                                switch(device_info_json.sensor_model)
                                {
                                    case "DS18S20":
                                    case "DS18B20":
                                        rsp_json = {
                                            "timeout": false,
                                            "device_ID": get_temperature_sensor_json_data.device_ID,
                                            "sensor_index": get_rsp_json.sensor_index,
                                            "sensor_ID": get_rsp_json.ID,
                                            "measure_temperature": get_rsp_json.measure_temperature,
                                            "ms_temperature_resolution": get_rsp_json.ms_temperature_resolution
                                        };
                                        break;
                                    default:
                                        rsp_json = {
                                            "timeout": false,
                                            "device_ID": get_temperature_sensor_json_data.device_ID,
                                            "sensor_index": get_rsp_json.sensor_index,
                                            "measure_temperature": get_rsp_json.measure_temperature
                                        };
                                        break;
                                }
                            }
                        }
                        break;
                    case "Get All Temperature Sensor Status":
                        if(get_temperature_sensor_json_data.device_ID!=null){
                            var device_info_json = await device_mgr.Read_Device_Inf(Temperature_Sensor_Device_Type, username, get_temperature_sensor_json_data.device_ID);
                            var get_rsp_json = await temperature_sensor_api.Temperature_Sensor_Get_All_Sensor_Status(get_temperature_sensor_json_data.device_ID);
                            var sensor_status_list = [];

                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_temperature_sensor_json_data.device_ID
                                };
                            }
                            else{
                                switch(device_info_json.sensor_model)
                                {
                                    case "DS18S20":
                                    case "DS18B20":
                                        for(var i = 0; i<get_rsp_json.num_of_temperature_sensor; i++)
                                        {
                                            sensor_status_list.push({
                                                "sensor_index": get_rsp_json.individual_sensor_status[i].sensor_index,
                                                "sensor_ID": get_rsp_json.individual_sensor_status[i].ID,
                                                "measure_temperature": get_rsp_json.individual_sensor_status[i].measure_temperature,
                                                "ms_temperature_resolution": get_rsp_json.individual_sensor_status[i].ms_temperature_resolution
                                            });
                                        }
                                        rsp_json = {
                                            "timeout": false,
                                            "device_ID": get_temperature_sensor_json_data.device_ID,
                                            "num_of_temperature_sensor": get_rsp_json.num_of_temperature_sensor,
                                            "sensor_status_list": sensor_status_list
                                        };
                                        break;
                                    default:
                                        for(var i = 0; i<get_rsp_json.num_of_temperature_sensor; i++)
                                        {
                                            sensor_status_list.push({
                                                "sensor_index": get_rsp_json.individual_sensor_status[i].sensor_index,
                                                "measure_temperature": get_rsp_json.individual_sensor_status[i].measure_temperature
                                            });
                                        }
                                        rsp_json = {
                                            "timeout": false,
                                            "device_ID": get_temperature_sensor_json_data.device_ID,
                                            "num_of_temperature_sensor": get_rsp_json.num_of_temperature_sensor,
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
            debug('[Temperature_Sensor_WebSocket] Process_Temperature_Sensor_WebSocket_GET_Message() Error ' + e);
        }
    }

}
module.exports = Temperature_Sensor_WebSocket;

var debug = require('debug')(require('path').basename(__filename));

var Device_MGR = require('../../../Util/Device_MGR.js');
var device_mgr = new Device_MGR();

var Solar_Radiation_Sensor_API = require('../../../Device_MGMT/Environment/Solar_Radiation_Sensor_API.js');
var solar_radiation_sensor_api = new Solar_Radiation_Sensor_API();

const Solar_Radiation_Sensor_Device_Type = "Solar Radiation Sensor";

var Solar_Radiation_Sensor_WebSocket = function (){
    var self = this;
    
    self.Process_Solar_Radiation_Sensor_WebSocket_POST_Message = async function(username, post_solar_radiation_sensor_json_data)
    {
        try{
            if(post_solar_radiation_sensor_json_data.command!=null){
                switch(post_solar_radiation_sensor_json_data.command){
                    case "Set Individual Solar Radiation Sensor Resolution":
                        if(post_solar_radiation_sensor_json_data.device_ID!=null && post_solar_radiation_sensor_json_data.sensor_index!=null && post_solar_radiation_sensor_json_data.resolution!=null){
                            await solar_radiation_sensor_api.Solar_Radiation_Sensor_Set_Individual_Sensor_Resolution(post_solar_radiation_sensor_json_data.device_ID, post_solar_radiation_sensor_json_data.sensor_index, post_solar_radiation_sensor_json_data.resolution);
                        }
                        break;
                    case "Set All Solar Radiation Sensor Resolution":
                        if(post_solar_radiation_sensor_json_data.device_ID!=null && post_solar_radiation_sensor_json_data.resolution!=null){
                            await solar_radiation_sensor_api.Solar_Radiation_Sensor_Set_All_Sensor_Resolution(post_solar_radiation_sensor_json_data.device_ID, post_solar_radiation_sensor_json_data.resolution);
                        }
                        break;
                }
            }
        }
        catch(e)
        {
            debug('[Solar_Radiation_Sensor_WebSocket] Process_Solar_Radiation_Sensor_WebSocket_POST_Message() Error ' + e);
        }
    }

    self.Process_Solar_Radiation_Sensor_WebSocket_GET_Message = async function(username, get_solar_radiation_sensor_json_data)
    {
        try{
            var rsp_json = null;
            if(get_solar_radiation_sensor_json_data.command!=null){
                switch(get_solar_radiation_sensor_json_data.command){
                    case "Get Num Of Solar Radiation Sensor":
                        if(get_solar_radiation_sensor_json_data.device_ID!=null){
                            var get_rsp_json = await solar_radiation_sensor_api.Solar_Radiation_Sensor_Get_Num_Of_Sensor(get_solar_radiation_sensor_json_data.device_ID);
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_solar_radiation_sensor_json_data.device_ID
                                };
                            }
                            else{
                                rsp_json = {
                                    "timeout": false,
                                    "device_ID": get_solar_radiation_sensor_json_data.device_ID,
                                    "num_of_solar_radiation_sensor": get_rsp_json.num_of_solar_radiation_sensor
                                };
                            }
                        }
                        break;
                    case "Get Individual Solar Radiation Sensor Status":
                        if(get_solar_radiation_sensor_json_data.device_ID!=null && get_solar_radiation_sensor_json_data.sensor_index!=null){
                            var device_info_json = await device_mgr.Read_Device_Inf(Solar_Radiation_Sensor_Device_Type, username, get_solar_radiation_sensor_json_data.device_ID);
                            var get_rsp_json = await solar_radiation_sensor_api.Solar_Radiation_Sensor_Get_Individual_Sensor_Status(get_solar_radiation_sensor_json_data.device_ID, get_solar_radiation_sensor_json_data.sensor_index);
                            
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_solar_radiation_sensor_json_data.device_ID
                                };
                            }
                            else{
                                switch(device_info_json.sensor_model)
                                {
                                    case "SMR30":
                                        rsp_json = {
                                            "timeout": false,
                                            "device_ID": get_solar_radiation_sensor_json_data.device_ID,
                                            "sensor_index": get_rsp_json.sensor_index,
                                            "measure_temperature": get_rsp_json.measure_temperature,
                                            "measure_solar_radiation": get_rsp_json.measure_solar_radiation
                                        };
                                        break;
                                    default:
                                        rsp_json = {
                                            "timeout": false,
                                            "device_ID": get_solar_radiation_sensor_json_data.device_ID,
                                            "sensor_index": get_rsp_json.sensor_index,
                                            "measure_solar_radiation": get_rsp_json.measure_solar_radiation
                                        };
                                        break;
                                }
                            }
                        }
                        break;
                    case "Get All Solar Radiation Sensor Status":
                        if(get_solar_radiation_sensor_json_data.device_ID!=null){
                            var device_info_json = await device_mgr.Read_Device_Inf(Solar_Radiation_Sensor_Device_Type, username, get_solar_radiation_sensor_json_data.device_ID);
                            var get_rsp_json = await solar_radiation_sensor_api.Solar_Radiation_Sensor_Get_All_Sensor_Status(get_solar_radiation_sensor_json_data.device_ID);
                            var sensor_status_list = [];

                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_solar_radiation_sensor_json_data.device_ID
                                };
                            }
                            else{
                                switch(device_info_json.sensor_model)
                                {
                                    case "SMR30":
                                        for(var i = 0; i<get_rsp_json.num_of_solar_radiation_sensor; i++)
                                        {
                                            sensor_status_list.push({
                                                "sensor_index": get_rsp_json.individual_sensor_status[i].sensor_index,
                                                "measure_temperature": get_rsp_json.individual_sensor_status[i].measure_temperature,
                                                "measure_solar_radiation": get_rsp_json.individual_sensor_status[i].measure_solar_radiation
                                            });
                                        }
                                        rsp_json = {
                                            "timeout": false,
                                            "device_ID": get_solar_radiation_sensor_json_data.device_ID,
                                            "num_of_solar_radiation_sensor": get_rsp_json.num_of_solar_radiation_sensor,
                                            "sensor_status_list": sensor_status_list
                                        };
                                        break;
                                    default:
                                        for(var i = 0; i<get_rsp_json.num_of_solar_radiation_sensor; i++)
                                        {
                                            sensor_status_list.push({
                                                "sensor_index": get_rsp_json.individual_sensor_status[i].sensor_index,
                                                "measure_solar_radiation": get_rsp_json.individual_sensor_status[i].measure_solar_radiation
                                            });
                                        }
                                        rsp_json = {
                                            "timeout": false,
                                            "device_ID": get_solar_radiation_sensor_json_data.device_ID,
                                            "num_of_solar_radiation_sensor": get_rsp_json.num_of_solar_radiation_sensor,
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
        debug('[Solar_Radiation_Sensor_WebSocket] Process_Solar_Radiation_Sensor_WebSocket_GET_Message() Error ' + e);
    }
    }

}
module.exports = Solar_Radiation_Sensor_WebSocket;
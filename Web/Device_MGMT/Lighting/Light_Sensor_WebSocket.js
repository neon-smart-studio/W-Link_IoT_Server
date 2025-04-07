
var debug = require('debug')(require('path').basename(__filename));

var Device_MGR = require('../../../Util/Device_MGR.js');
var device_mgr = new Device_MGR();

var Light_Sensor_API = require('../../../Device_MGMT/Lighting/Light_Sensor_API.js');
var light_sensor_api = new Light_Sensor_API();

const Light_Sensor_Device_Type = "Light Sensor";

var Light_Sensor_WebSocket = function (){
    var self = this;
    
    self.Process_Light_Sensor_WebSocket_POST_Message = async function(username, post_light_sensor_json_data)
    {
        try{
            if(post_light_sensor_json_data.command!=null){
                switch(post_light_sensor_json_data.command){
                    case "Set Individual Light Sensor Resolution":
                        if(post_light_sensor_json_data.device_ID!=null && post_light_sensor_json_data.sensor_index!=null && post_light_sensor_json_data.resolution!=null){
                            await light_sensor_api.Light_Sensor_Set_Individual_Sensor_Resolution(post_light_sensor_json_data.device_ID, post_light_sensor_json_data.sensor_index, post_light_sensor_json_data.resolution);
                        }
                        break;
                    case "Set All Light Sensor Resolution":
                        if(post_light_sensor_json_data.device_ID!=null && post_light_sensor_json_data.resolution!=null){
                            await light_sensor_api.Light_Sensor_Set_All_Sensor_Resolution(post_light_sensor_json_data.device_ID, post_light_sensor_json_data.resolution);
                        }
                        break;
                }
            }
        }
        catch(e)
        {
            debug('[Light_Sensor_WebSocket] Process_Light_Sensor_WebSocket_POST_Message() Error ' + e);
        }
    }
    
    self.Process_Light_Sensor_WebSocket_GET_Message = async function(username, get_light_sensor_json_data)
    {
        try{
            var rsp_json = null;
            if(get_light_sensor_json_data.command!=null){
                switch(get_light_sensor_json_data.command){
                    case "Get Num Of Light Sensor":
                        if(get_light_sensor_json_data.device_ID!=null){
                            var get_rsp_json = await light_sensor_api.Light_Sensor_Get_Num_Of_Sensor(get_light_sensor_json_data.device_ID);
                            
                            if(get_rsp_json.timeout==true){
                                return {
                                    "timeout": true,
                                    "device_ID": get_light_sensor_json_data.device_ID
                                };
                            }

                            rsp_json = {
                                "timeout": false,
                                "device_ID": get_light_sensor_json_data.device_ID,
                                "num_of_light_sensor": get_rsp_json.num_of_light_sensor
                            };
                        }
                        break;
                    case "Get Individual Light Sensor Status":
                        if(get_light_sensor_json_data.device_ID!=null && get_light_sensor_json_data.sensor_index!=null){
                            var device_info_json = await device_mgr.Read_Device_Inf(Light_Sensor_Device_Type, username, get_light_sensor_json_data.device_ID);
                            var get_rsp_json = await light_sensor_api.Light_Sensor_Get_Individual_Sensor_Status(get_light_sensor_json_data.device_ID, get_light_sensor_json_data.sensor_index);
                            
                            var sensor_status_json = null;

                            if(get_rsp_json.timeout==true){
                                return {
                                    "timeout": true,
                                    "device_ID": get_light_sensor_json_data.device_ID
                                };
                            }

                            rsp_json = {
                                "timeout": false,
                                "device_ID": get_light_sensor_json_data.device_ID,
                                "sensor_index": get_rsp_json.sensor_index,
                            };

                            switch(device_info_json.model)
                            {
                                case "W-Link Generic Light Sensor":
                                    switch(device_info_json.sensor_model)
                                    {
                                        case "BH1750FVI":
                                            sensor_status_json = {
                                                "ms_lux_resolution": get_rsp_json.ms_lux_resolution,
                                                "measure_lux": get_rsp_json.measure_lux
                                            };
                                            break;
                                        default:
                                            sensor_status_json = {
                                                "measure_lux": get_rsp_json.measure_lux
                                            };
                                            break;
                                    }
                                    break;
                                case "lumi.sen_ill.mgl01":
                                default:
                                    sensor_status_json = {
                                        "measure_lux": get_rsp_json.measure_lux
                                    };
                                    break;
                            }

                            if(sensor_status_json!=null)
                            {
                                rsp_json = Object.assign({}, rsp_json, sensor_status_json);
                            }
                        }
                        break;
                    case "Get All Light Sensor Status":
                        if(get_light_sensor_json_data.device_ID!=null){
                            var device_info_json = await device_mgr.Read_Device_Inf(Light_Sensor_Device_Type, username, get_light_sensor_json_data.device_ID);
                            var get_rsp_json = await light_sensor_api.Light_Sensor_Get_All_Sensor_Status(get_light_sensor_json_data.device_ID);
                            
                            var sensor_status_list = [];

                            if(get_rsp_json.timeout==true){
                                return {
                                    "timeout": true,
                                    "device_ID": get_light_sensor_json_data.device_ID
                                };
                            }

                            switch(device_info_json.model)
                            {
                                case "W-Link Generic Light Sensor":
                                    switch(device_info_json.sensor_model)
                                    {
                                        case "BH1750FVI":
                                            for(var i = 0; i<get_rsp_json.num_of_light_sensor; i++)
                                            {
                                                sensor_status_list.push({
                                                    "sensor_index": get_rsp_json.individual_sensor_status[i].sensor_index,
                                                    "ms_lux_resolution": get_rsp_json.individual_sensor_status[i].ms_lux_resolution,
                                                    "measure_lux": get_rsp_json.individual_sensor_status[i].measure_lux
                                                });
                                            }
                                            break;
                                        default:
                                            for(var i = 0; i<get_rsp_json.num_of_light_sensor; i++)
                                            {
                                                sensor_status_list.push({
                                                    "sensor_index": get_rsp_json.individual_sensor_status[i].sensor_index,
                                                    "measure_lux": get_rsp_json.individual_sensor_status[i].measure_lux
                                                });
                                            }
                                            break;
                                    }
                                    break;
                                case "lumi.sen_ill.mgl01":
                                default:
                                    for(var i = 0; i<get_rsp_json.num_of_light_sensor; i++)
                                    {
                                        sensor_status_list.push({
                                            "sensor_index": get_rsp_json.individual_sensor_status[i].sensor_index,
                                            "measure_lux": get_rsp_json.individual_sensor_status[i].measure_lux
                                        });
                                    }
                                    break;
                            }
                            
                            rsp_json = {
                                "timeout": false,
                                "device_ID": get_light_sensor_json_data.device_ID,
                                "num_of_light_sensor": get_rsp_json.num_of_light_sensor,
                                "sensor_status_list": sensor_status_list
                            };
                        }
                        break;
                }
            }
            return rsp_json;
        }
        catch(e)
        {
            debug('[Light_Sensor_WebSocket] Process_Light_Sensor_WebSocket_GET_Message() Error ' + e);
        }
    }
}

module.exports = Light_Sensor_WebSocket;

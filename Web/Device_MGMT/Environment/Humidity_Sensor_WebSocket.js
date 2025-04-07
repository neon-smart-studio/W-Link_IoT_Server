
var debug = require('debug')(require('path').basename(__filename));

var Device_MGR = require('../../../Util/Device_MGR.js');
var device_mgr = new Device_MGR();

var Humidity_Sensor_API = require('../../../Device_MGMT/Environment/Humidity_Sensor_API.js');
var humidity_sensor_api = new Humidity_Sensor_API();

const Humidity_Sensor_Device_Type = "Humidity Sensor";

var Humidity_Sensor_WebSocket = function (){
    var self = this;
    
    self.Process_Humidity_Sensor_WebSocket_POST_Message = async function(username, post_humidity_sensor_json_data)
    {
        try{
            if(post_humidity_sensor_json_data.command!=null){
                switch(post_humidity_sensor_json_data.command){
                    case "Set Individual Humidity Sensor Resolution":
                        if(post_humidity_sensor_json_data.device_ID!=null && post_humidity_sensor_json_data.sensor_index!=null && post_humidity_sensor_json_data.resolution!=null){
                            await humidity_sensor_api.Humidity_Sensor_Set_Individual_Sensor_Resolution(post_humidity_sensor_json_data.device_ID, post_humidity_sensor_json_data.sensor_index, post_humidity_sensor_json_data.resolution);
                        }
                        break;
                    case "Set All Humidity Sensor Resolution":
                        if(post_humidity_sensor_json_data.device_ID!=null && post_humidity_sensor_json_data.resolution!=null){
                            await humidity_sensor_api.Humidity_Sensor_Set_All_Sensor_Resolution(post_humidity_sensor_json_data.device_ID, post_humidity_sensor_json_data.resolution);
                        }
                        break;
                }
            }
        }
        catch(e)
        {
            debug('[Humidity_Sensor_WebSocket] Process_Humidity_Sensor_WebSocket_POST_Message() Error ' + e);
        }
    }

    self.Process_Humidity_Sensor_WebSocket_GET_Message = async function(username, get_humidity_sensor_json_data)
    {
        try{
            var rsp_json = null;
            if(get_humidity_sensor_json_data.command!=null){
                switch(get_humidity_sensor_json_data.command){
                    case "Get Num Of Humidity Sensor":
                        if(get_humidity_sensor_json_data.device_ID!=null){
                            var get_rsp_json = await humidity_sensor_api.Humidity_Sensor_Get_Num_Of_Sensor(get_humidity_sensor_json_data.device_ID);
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_humidity_sensor_json_data.device_ID
                                };
                            }
                            else{
                                rsp_json = {
                                    "timeout": false,
                                    "device_ID": get_humidity_sensor_json_data.device_ID,
                                    "num_of_humidity_sensor": get_rsp_json.num_of_humidity_sensor
                                };
                            }
                        }
                        break;
                    case "Get Individual Humidity Sensor Status":
                        if(get_humidity_sensor_json_data.device_ID!=null && get_humidity_sensor_json_data.sensor_index!=null){
                            var device_info_json = await device_mgr.Read_Device_Inf(Humidity_Sensor_Device_Type, username, get_humidity_sensor_json_data.device_ID);
                            var get_rsp_json = await humidity_sensor_api.Humidity_Sensor_Get_Individual_Sensor_Status(get_humidity_sensor_json_data.device_ID, get_humidity_sensor_json_data.sensor_index);
                            
                            var sensor_status_json = null;

                            if(get_rsp_json.timeout==true){
                                return {
                                    "timeout": true,
                                    "device_ID": get_humidity_sensor_json_data.device_ID
                                };
                            }

                            rsp_json = {
                                "timeout": false,
                                "device_ID": get_humidity_sensor_json_data.device_ID,
                                "sensor_index": get_rsp_json.sensor_index,
                            };

                            switch(device_info_json.model)
                            {
                                case "W-Link Generic Humidity Sensor":
                                    switch(device_info_json.sensor_model)
                                    {
                                        case "AM2315":
                                        case "HDC1080":
                                        case "Si7021":
                                            sensor_status_json = {
                                                "measure_temperature": get_rsp_json.measure_temperature,
                                                "measure_humidity": get_rsp_json.measure_humidity,
                                            };
                                            break;
                                        default:
                                            sensor_status_json = {
                                                "measure_humidity": get_rsp_json.measure_humidity,
                                            };
                                            break;
                                    }
                                    break;
                                case "lumi.weather":
                                    sensor_status_json = {
                                        "measure_temperature": get_rsp_json.measure_temperature,
                                        "measure_humidity": get_rsp_json.measure_humidity,
                                        "measure_pressure": get_rsp_json.measure_pressure
                                    };
                                    break;
                                case "lumi.sens":
                                case "lumi.sensor_ht":
                                    sensor_status_json = {
                                        "measure_temperature": get_rsp_json.measure_temperature,
                                        "measure_humidity": get_rsp_json.measure_humidity,
                                    };
                                    break;
                                default:
                                    sensor_status_json = {
                                        "measure_humidity": get_rsp_json.measure_humidity,
                                    };
                                    break;
                            }

                            if(sensor_status_json!=null)
                            {
                                rsp_json = Object.assign({}, rsp_json, sensor_status_json);
                            }
                        }
                        break;
                    case "Get All Humidity Sensor Status":
                        if(get_humidity_sensor_json_data.device_ID!=null){
                            var device_info_json = await device_mgr.Read_Device_Inf(Humidity_Sensor_Device_Type, username, get_humidity_sensor_json_data.device_ID);
                            var get_rsp_json = await humidity_sensor_api.Humidity_Sensor_Get_All_Sensor_Status(get_humidity_sensor_json_data.device_ID);
                            
                            var sensor_status_list = [];
                            
                            if(get_rsp_json.timeout==true){
                                return {
                                    "timeout": true,
                                    "device_ID": get_humidity_sensor_json_data.device_ID
                                };
                            }
                            
                            switch(device_info_json.model)
                            {
                                case "W-Link Generic Humidity Sensor":
                                    switch(device_info_json.sensor_model)
                                    {
                                        case "AM2315":
                                        case "HDC1080":
                                        case "Si7021":
                                            for(var i = 0; i<get_rsp_json.num_of_humidity_sensor; i++)
                                            {
                                                sensor_status_list.push({
                                                    "sensor_index": get_rsp_json.individual_sensor_status[i].sensor_index,
                                                    "measure_temperature": get_rsp_json.individual_sensor_status[i].measure_temperature,
                                                    "measure_humidity": get_rsp_json.individual_sensor_status[i].measure_humidity
                                                });
                                            }
                                            break;
                                        default:
                                            for(var i = 0; i<get_rsp_json.num_of_humidity_sensor; i++)
                                            {
                                                sensor_status_list.push({
                                                    "sensor_index": get_rsp_json.individual_sensor_status[i].sensor_index,
                                                    "measure_humidity": get_rsp_json.individual_sensor_status[i].measure_humidity
                                                });
                                            }
                                            break;
                                    }
                                    break;
                                case "lumi.weather":
                                    for(var i = 0; i<get_rsp_json.num_of_humidity_sensor; i++)
                                    {
                                        sensor_status_list.push({
                                            "sensor_index": get_rsp_json.individual_sensor_status[i].sensor_index,
                                            "measure_temperature": get_rsp_json.individual_sensor_status[i].measure_temperature,
                                            "measure_humidity": get_rsp_json.individual_sensor_status[i].measure_humidity,
                                            "measure_pressure": get_rsp_json.individual_sensor_status[i].measure_pressure
                                        });
                                    }
                                    break;
                                case "lumi.sens":
                                case "lumi.sensor_ht":
                                    for(var i = 0; i<get_rsp_json.num_of_humidity_sensor; i++)
                                    {
                                        sensor_status_list.push({
                                            "sensor_index": get_rsp_json.individual_sensor_status[i].sensor_index,
                                            "measure_temperature": get_rsp_json.individual_sensor_status[i].measure_temperature,
                                            "measure_humidity": get_rsp_json.individual_sensor_status[i].measure_humidity
                                        });
                                    }
                                    break;
                                default:
                                    for(var i = 0; i<get_rsp_json.num_of_humidity_sensor; i++)
                                    {
                                        sensor_status_list.push({
                                            "sensor_index": get_rsp_json.individual_sensor_status[i].sensor_index,
                                            "measure_humidity": get_rsp_json.individual_sensor_status[i].measure_humidity
                                        });
                                    }
                                    break;
                            }

                            rsp_json = {
                                "timeout": false,
                                "device_ID": get_humidity_sensor_json_data.device_ID,
                                "num_of_humidity_sensor": get_rsp_json.num_of_humidity_sensor,
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
            debug('[Humidity_Sensor_WebSocket] Process_Humidity_Sensor_WebSocket_GET_Message() Error ' + e);
        }
    }

}
module.exports = Humidity_Sensor_WebSocket;
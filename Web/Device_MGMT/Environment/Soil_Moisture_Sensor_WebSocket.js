
var debug = require('debug')(require('path').basename(__filename));

var Device_MGR = require('../../../Util/Device_MGR.js');
var device_mgr = new Device_MGR();

var Soil_Moisture_Sensor_API = require('../../../Device_MGMT/Environment/Soil_Moisture_Sensor_API.js');
var soil_moisture_sensor_api = new Soil_Moisture_Sensor_API();

const Soil_Moisture_Sensor_Device_Type = "Soil Moisture Sensor";

var Soil_Moisture_Sensor_WebSocket = function (){
    var self = this;
    
    self.Process_Soil_Moisture_Sensor_WebSocket_POST_Message = async function(username, post_soil_moisture_sensor_json_data)
    {
        try{
            if(post_soil_moisture_sensor_json_data.command!=null){
                switch(post_soil_moisture_sensor_json_data.command){
                    case "Set Individual Soil Moisture Sensor Resolution":
                        if(post_soil_moisture_sensor_json_data.device_ID!=null && post_soil_moisture_sensor_json_data.sensor_index!=null && post_soil_moisture_sensor_json_data.resolution!=null){
                            await soil_moisture_sensor_api.Soil_Moisture_Sensor_Set_Individual_Sensor_Resolution(post_soil_moisture_sensor_json_data.device_ID, post_soil_moisture_sensor_json_data.sensor_index, post_soil_moisture_sensor_json_data.resolution);
                        }
                        break;
                    case "Set All Soil Moisture Sensor Resolution":
                        if(post_soil_moisture_sensor_json_data.device_ID!=null && post_soil_moisture_sensor_json_data.resolution!=null){
                            await soil_moisture_sensor_api.Soil_Moisture_Sensor_Set_All_Sensor_Resolution(post_soil_moisture_sensor_json_data.device_ID, post_soil_moisture_sensor_json_data.resolution);
                        }
                        break;
                }
            }
        }
        catch(e)
        {
            debug('[Soil_Moisture_Sensor_WebSocket] Process_Soil_Moisture_Sensor_WebSocket_POST_Message() Error ' + e);
        }
    }

    self.Process_Soil_Moisture_Sensor_WebSocket_GET_Message = async function(username, get_soil_moisture_sensor_json_data)
    {
        try{
            var rsp_json = null;
            if(get_soil_moisture_sensor_json_data.command!=null){
                switch(get_soil_moisture_sensor_json_data.command){
                    case "Get Num Of Soil Moisture Sensor":
                        if(get_soil_moisture_sensor_json_data.device_ID!=null){
                            var get_rsp_json = await soil_moisture_sensor_api.Soil_Moisture_Sensor_Get_Num_Of_Sensor(get_soil_moisture_sensor_json_data.device_ID);
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_soil_moisture_sensor_json_data.device_ID
                                };
                            }
                            else{
                                rsp_json = {
                                    "timeout": false,
                                    "device_ID": get_soil_moisture_sensor_json_data.device_ID,
                                    "num_of_soil_moisture_sensor": get_rsp_json.num_of_soil_moisture_sensor
                                };
                            }
                        }
                        break;
                    case "Get Individual Soil Moisture Sensor Status":
                        if(get_soil_moisture_sensor_json_data.device_ID!=null && get_soil_moisture_sensor_json_data.sensor_index!=null){
                            var device_info_json = await device_mgr.Read_Device_Inf(Soil_Moisture_Sensor_Device_Type, username, get_soil_moisture_sensor_json_data.device_ID);
                            var get_rsp_json = await soil_moisture_sensor_api.Soil_Moisture_Sensor_Get_Individual_Sensor_Status(get_soil_moisture_sensor_json_data.device_ID, get_soil_moisture_sensor_json_data.sensor_index);
                            
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_soil_moisture_sensor_json_data.device_ID
                                };
                            }
                            else{
                                switch(device_info_json.sensor_model)
                                {
                                    case "SWR-100":
                                        rsp_json = {
                                            "timeout": false,
                                            "device_ID": get_soil_moisture_sensor_json_data.device_ID,
                                            "sensor_index": get_rsp_json.sensor_index,
                                            "measure_soil_moisture": get_rsp_json.measure_soil_moisture
                                        };
                                        break;
                                    default:
                                        rsp_json = {
                                            "timeout": false,
                                            "device_ID": get_soil_moisture_sensor_json_data.device_ID,
                                            "sensor_index": get_rsp_json.sensor_index,
                                            "measure_soil_moisture": get_rsp_json.measure_soil_moisture
                                        };
                                        break;
                                }
                            }
                        }
                        break;
                    case "Get All Soil Moisture Sensor Status":
                        if(get_soil_moisture_sensor_json_data.device_ID!=null){
                            var device_info_json = await device_mgr.Read_Device_Inf(Soil_Moisture_Sensor_Device_Type, username, get_soil_moisture_sensor_json_data.device_ID);
                            var get_rsp_json = await soil_moisture_sensor_api.Soil_Moisture_Sensor_Get_All_Sensor_Status(get_soil_moisture_sensor_json_data.device_ID);
                            var sensor_status_list = [];

                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_soil_moisture_sensor_json_data.device_ID
                                };
                            }
                            else{
                                switch(device_info_json.sensor_model)
                                {
                                    case "SWR-100":
                                        for(var i = 0; i<get_rsp_json.num_of_soil_moisture_sensor; i++)
                                        {
                                            sensor_status_list.push({
                                                "sensor_index": get_rsp_json.individual_sensor_status[i].sensor_index,
                                                "measure_soil_moisture": get_rsp_json.individual_sensor_status[i].measure_soil_moisture
                                            });
                                        }
                                        rsp_json = {
                                            "timeout": false,
                                            "device_ID": get_soil_moisture_sensor_json_data.device_ID,
                                            "num_of_soil_moisture_sensor": get_rsp_json.num_of_soil_moisture_sensor,
                                            "sensor_status_list": sensor_status_list
                                        };
                                        break;
                                    default:
                                        for(var i = 0; i<get_rsp_json.num_of_soil_moisture_sensor; i++)
                                        {
                                            sensor_status_list.push({
                                                "sensor_index": get_rsp_json.individual_sensor_status[i].sensor_index,
                                                "measure_soil_moisture": get_rsp_json.individual_sensor_status[i].measure_soil_moisture
                                            });
                                        }
                                        rsp_json = {
                                            "timeout": false,
                                            "device_ID": get_soil_moisture_sensor_json_data.device_ID,
                                            "num_of_soil_moisture_sensor": get_rsp_json.num_of_soil_moisture_sensor,
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
            debug('[Soil_Moisture_Sensor_WebSocket] Process_Soil_Moisture_Sensor_WebSocket_GET_Message() Error ' + e);
        }
    }

}
module.exports = Soil_Moisture_Sensor_WebSocket;
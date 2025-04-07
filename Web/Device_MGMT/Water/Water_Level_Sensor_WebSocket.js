
var debug = require('debug')(require('path').basename(__filename));

var Device_MGR = require('../../../Util/Device_MGR.js');
var device_mgr = new Device_MGR();

var Water_Level_Sensor_API = require('../../../Device_MGMT/Water/Water_Level_Sensor_API.js');
var water_level_sensor_api = new Water_Level_Sensor_API();

const Water_Level_Sensor_Device_Type = "Water Level Sensor";

var Water_Level_Sensor_WebSocket = function (){
    var self = this;
    
    self.Process_Water_Level_Sensor_WebSocket_POST_Message = async function(username, post_water_level_Sensor_json_data)
    {
        try{
            if(post_water_level_Sensor_json_data.command!=null){
                switch(post_water_level_Sensor_json_data.command){
                    case "Water Level Sensor Device Change Name":
                        if(post_water_level_Sensor_json_data.device_ID!=null && post_water_level_Sensor_json_data.device_Name!=null){
                            await water_level_sensor_api.Water_Level_Sensor_Device_Change_Name(username, post_water_level_Sensor_json_data.device_ID, post_water_level_Sensor_json_data.device_Name);
                        }
                        break;
                    case "Remove One Water Level Sensor Device":
                        if(post_water_level_Sensor_json_data.device_ID!=null){
                            await water_level_sensor_api.Water_Level_Sensor_Remove_Device(username, post_water_level_Sensor_json_data.device_ID);
                        }
                        break;
                    case "Remove All Water Level Sensor Device":
                        await water_level_sensor_api.Water_Level_Sensor_Remove_All_Device(username);
                        break;
                }
            }
        }
        catch(e)
        {
            debug('[Water_Level_Sensor_WebSocket] Process_Water_Level_Sensor_WebSocket_POST_Message() Error ' + e);
        }
    }

    self.Process_Water_Level_Sensor_WebSocket_GET_Message = async function(username, get_water_level_sensor_json_data)
    {
        try{
            var rsp_json = null;
            if(get_water_level_sensor_json_data.command!=null){
                switch(get_water_level_sensor_json_data.command){
                    case "Get Num Of Water Level Sensor":
                        if(get_water_level_sensor_json_data.device_ID!=null){
                            var get_rsp_json = await water_level_sensor_api.Water_Level_Sensor_Get_Num_Of_Sensor(get_water_level_sensor_json_data.device_ID);
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_water_level_sensor_json_data.device_ID
                                };
                            }
                            else{
                                rsp_json = {
                                    "timeout": false,
                                    "device_ID": get_water_level_sensor_json_data.device_ID,
                                    "num_of_water_level_sensor": get_rsp_json.num_of_water_level_sensor
                                };
                            }
                        }
                        break;
                    case "Get Individual Water Level Sensor Measure":
                        if(get_water_level_sensor_json_data.device_ID!=null && get_water_level_sensor_json_data.sensor_index!=null){
                            var device_info_json = await device_mgr.Read_Device_Inf(Water_Level_Sensor_Device_Type, username, get_water_level_sensor_json_data.device_ID);
                            var get_rsp_json = await water_level_sensor_api.Water_Level_Sensor_Get_Individual_Sensor_Measure(get_water_level_sensor_json_data.device_ID, get_water_level_sensor_json_data.sensor_index);
                            
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_water_level_sensor_json_data.device_ID
                                };
                            }
                            else{
                                switch(device_info_json.sensor_model)
                                {
                                    case "SMR02":
                                        rsp_json = {
                                            "timeout": false,
                                            "device_ID": get_water_level_sensor_json_data.device_ID,
                                            "sensor_index": get_rsp_json.sensor_index,
                                            "measure_temperature": get_rsp_json.measure_temperature,
                                            "measure_water_level": get_rsp_json.measure_water_level
                                        };
                                        break;
                                    default:
                                        rsp_json = {
                                            "timeout": false,
                                            "device_ID": get_water_level_sensor_json_data.device_ID,
                                            "sensor_index": get_rsp_json.sensor_index,
                                            "measure_water_level": get_rsp_json.measure_water_level
                                        };
                                        break;
                                }
                            }
                        }
                        break;
                    case "Get All Water Level Sensor Measure":
                        if(get_water_level_sensor_json_data.device_ID!=null){
                            var device_info_json = await device_mgr.Read_Device_Inf(Water_Level_Sensor_Device_Type, username, get_water_level_sensor_json_data.device_ID);
                            var get_rsp_json = await water_level_sensor_api.Water_Level_Sensor_Get_All_Sensor_Measure(get_water_level_sensor_json_data.device_ID);
                            var sensor_status_list = [];

                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_water_level_sensor_json_data.device_ID
                                };
                            }
                            else{
                                switch(device_info_json.sensor_model)
                                {
                                    case "SMR07":
                                        for(var i = 0; i<get_rsp_json.num_of_water_level_sensor; i++)
                                        {
                                            sensor_status_list.push({
                                                "sensor_index": get_rsp_json.individual_sensor_status[i].sensor_index,
                                                "measure_temperature": get_rsp_json.individual_sensor_status[i].measure_temperature,
                                                "measure_water_level": get_rsp_json.individual_sensor_status[i].measure_water_level
                                            });
                                        }
                                        rsp_json = {
                                            "timeout": false,
                                            "device_ID": get_water_level_sensor_json_data.device_ID,
                                            "num_of_water_level_sensor": get_rsp_json.num_of_water_level_sensor,
                                            "sensor_status_list": sensor_status_list
                                        };
                                        break;
                                    default:
                                        for(var i = 0; i<get_rsp_json.num_of_water_level_sensor; i++)
                                        {
                                            sensor_status_list.push({
                                                "sensor_index": get_rsp_json.individual_sensor_status[i].sensor_index,
                                                "measure_water_level": get_rsp_json.individual_sensor_status[i].measure_water_level
                                            });
                                        }
                                        rsp_json = {
                                            "timeout": false,
                                            "device_ID": get_water_level_sensor_json_data.device_ID,
                                            "num_of_water_level_sensor": get_rsp_json.num_of_water_level_sensor,
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
            debug('[Water_Level_Sensor_WebSocket] Process_Water_Level_Sensor_WebSocket_GET_Message() Error ' + e);
        }
    }
}
module.exports = Water_Level_Sensor_WebSocket;
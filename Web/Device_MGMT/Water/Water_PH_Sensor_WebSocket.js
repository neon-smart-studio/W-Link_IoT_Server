
var debug = require('debug')(require('path').basename(__filename));

var Device_MGR = require('../../../Util/Device_MGR.js');
var device_mgr = new Device_MGR();

var Water_PH_Sensor_API = require('../../../Device_MGMT/Water/Water_PH_Sensor_API.js');
var water_PH_sensor_api = new Water_PH_Sensor_API();

const Water_PH_Sensor_Device_Type = "Water PH Sensor";

var Water_PH_Sensor_WebSocket = function (){
    var self = this;
    
    self.Process_Water_PH_Sensor_WebSocket_POST_Message = async function(username, post_water_pH_Sensor_json_data)
    {
        try{
            if(post_water_pH_Sensor_json_data.command!=null){
                switch(post_water_pH_Sensor_json_data.command){
                    case "Water PH Sensor Device Change Name":
                        if(post_water_pH_Sensor_json_data.device_ID!=null && post_water_pH_Sensor_json_data.device_Name!=null){
                            await water_PH_sensor_api.Water_PH_Sensor_Device_Change_Name(username, post_water_pH_Sensor_json_data.device_ID, post_water_pH_Sensor_json_data.device_Name);
                        }
                        break;
                    case "Remove One Water PH Sensor Device":
                        if(post_water_pH_Sensor_json_data.device_ID!=null){
                            await water_PH_sensor_api.Water_PH_Sensor_Remove_Device(username, post_water_pH_Sensor_json_data.device_ID);
                        }
                        break;
                    case "Remove All Water PH Sensor Device":
                        await water_PH_sensor_api.Water_PH_Sensor_Remove_All_Device(username);
                        break;
                }
            }
        }
        catch(e)
        {
            debug('[Water_PH_Sensor_WebSocket] Process_Water_PH_Sensor_WebSocket_POST_Message() Error ' + e);
        }
    }

    self.Process_Water_PH_Sensor_WebSocket_GET_Message = async function(username, get_water_pH_sensor_json_data)
    {
        try{
            var rsp_json = null;
            if(get_water_pH_sensor_json_data.command!=null){
                switch(get_water_pH_sensor_json_data.command){
                    case "Get Num Of Water PH Sensor":
                        if(get_water_pH_sensor_json_data.device_ID!=null){
                            var get_rsp_json = await water_PH_sensor_api.Water_PH_Sensor_Get_Num_Of_Sensor(get_water_pH_sensor_json_data.device_ID);
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_water_pH_sensor_json_data.device_ID
                                };
                            }
                            else{
                                rsp_json = {
                                    "timeout": false,
                                    "device_ID": get_water_pH_sensor_json_data.device_ID,
                                    "num_of_water_pH_sensor": get_rsp_json.num_of_water_pH_sensor
                                };
                            } 
                        }
                        break;
                    case "Get Individual Water PH Sensor Measure":
                        if(get_water_pH_sensor_json_data.device_ID!=null){
                            var device_info_json = await device_mgr.Read_Device_Inf(Water_PH_Sensor_Device_Type, username, get_water_pH_sensor_json_data.device_ID);
                            var get_rsp_json = await water_PH_sensor_api.Water_PH_Sensor_Get_Individual_Sensor_Measure(get_water_pH_sensor_json_data.device_ID);
                            
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_water_pH_sensor_json_data.device_ID
                                };
                            }
                            else{
                                switch(device_info_json.sensor_model)
                                {
                                    case "SMR04":
                                        rsp_json = {
                                            "timeout": false,
                                            "device_ID": get_water_pH_sensor_json_data.device_ID,
                                            "sensor_index": get_rsp_json.sensor_index,
                                            "measure_temperature": get_rsp_json.measure_temperature,
                                            "measure_water_pH": get_rsp_json.measure_water_pH
                                        };
                                        break;
                                    default:
                                        rsp_json = {
                                            "timeout": false,
                                            "device_ID": get_water_pH_sensor_json_data.device_ID,
                                            "sensor_index": get_rsp_json.sensor_index,
                                            "measure_water_pH": get_rsp_json.measure_water_pH
                                        };
                                        break;
                                }
                            }
                        }
                        break;
                    case "Get All Water PH Sensor Measure":
                        if(get_water_pH_sensor_json_data.device_ID!=null){
                            var device_info_json = await device_mgr.Read_Device_Inf(Water_PH_Sensor_Device_Type, username, get_water_pH_sensor_json_data.device_ID);
                            var get_rsp_json = await water_PH_sensor_api.Water_PH_Sensor_Get_All_Sensor_Measure();
                            var sensor_status_list = [];

                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_water_pH_sensor_json_data.device_ID
                                };
                            }
                            else{
                                switch(device_info_json.sensor_model)
                                {
                                    case "SMR04":
                                        for(var i = 0; i<get_rsp_json.num_of_water_pH_sensor; i++)
                                        {
                                            sensor_status_list.push({
                                                "sensor_index": get_rsp_json.individual_sensor_status[i].sensor_index,
                                                "measure_temperature": get_rsp_json.individual_sensor_status[i].measure_temperature,
                                                "measure_water_pH": get_rsp_json.individual_sensor_status[i].measure_water_pH
                                            });
                                        }
                                        rsp_json = {
                                            "timeout": false,
                                            "device_ID": get_water_pH_sensor_json_data.device_ID,
                                            "num_of_water_pH_sensor": get_rsp_json.num_of_water_pH_sensor,
                                            "sensor_status_list": sensor_status_list
                                        };
                                        break;
                                    default:
                                        for(var i = 0; i<get_rsp_json.num_of_water_pH_sensor; i++)
                                        {
                                            sensor_status_list.push({
                                                "sensor_index": get_rsp_json.individual_sensor_status[i].sensor_index,
                                                "measure_water_pH": get_rsp_json.individual_sensor_status[i].measure_water_pH
                                            });
                                        }
                                        rsp_json = {
                                            "timeout": false,
                                            "device_ID": get_water_pH_sensor_json_data.device_ID,
                                            "num_of_water_pH_sensor": get_rsp_json.num_of_water_pH_sensor,
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
            debug('[Water_PH_Sensor_WebSocket] Process_Water_PH_Sensor_WebSocket_GET_Message() Error ' + e);
        }
    }
}
module.exports = Water_PH_Sensor_WebSocket;
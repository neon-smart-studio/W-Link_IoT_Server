
var debug = require('debug')(require('path').basename(__filename));

var Device_MGR = require('../../../Util/Device_MGR.js');
var device_mgr = new Device_MGR();

var O2_Sensor_API = require('../../../Device_MGMT/Gas/O2_Sensor_API.js');
var o2_sensor_api = new O2_Sensor_API();

const O2_Sensor_Device_Type = "O2 Sensor";

var O2_Sensor_WebSocket = function (){
    var self = this;
    
    self.Process_O2_Sensor_WebSocket_POST_Message = async function(username, post_o2_sensor_json_data)
    {
        try{
            if(post_o2_sensor_json_data.command!=null){
                switch(post_o2_sensor_json_data.command){
                }
            }
        }
        catch(e)
        {
            debug('[O2_Sensor_WebSocket] Process_O2_Sensor_WebSocket_POST_Message() Error ' + e);
        }
    }
    
    self.Process_O2_Sensor_WebSocket_GET_Message = async function(username, get_o2_sensor_json_data)
    {
        try{
            var rsp_json = null;
            if(get_o2_sensor_json_data.command!=null){
                switch(get_o2_sensor_json_data.command){
                    case "Get Num Of O2 Sensor":
                        if(get_o2_sensor_json_data.device_ID!=null){
                            var get_rsp_json = await o2_sensor_api.O2_Sensor_Get_Num_Of_Sensor(get_o2_sensor_json_data.device_ID);
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_o2_sensor_json_data.device_ID
                                };
                            }
                            else{
                                rsp_json = {
                                    "timeout": false,
                                    "device_ID": get_o2_sensor_json_data.device_ID,
                                    "num_of_o2_sensor": get_rsp_json.num_of_o2_sensor
                                };
                            }
                        }
                        break;
                    case "Get Individual O2 Sensor Status":
                        if(get_o2_sensor_json_data.device_ID!=null && get_o2_sensor_json_data.sensor_index!=null){
                            var device_info_json = await device_mgr.Read_Device_Inf(O2_Sensor_Device_Type, username, get_o2_sensor_json_data.device_ID);
                            var get_rsp_json = await o2_sensor_api.O2_Sensor_Get_Individual_Sensor_Status(get_o2_sensor_json_data.device_ID, get_o2_sensor_json_data.sensor_index);
                            
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_o2_sensor_json_data.device_ID
                                };
                            }
                            else{
                                switch(device_info_json.sensor_model)
                                {
                                    case "ME3-O2":
                                        rsp_json = {
                                            "timeout": false,
                                            "device_ID": get_o2_sensor_json_data.device_ID,
                                            "sensor_index": get_rsp_json.sensor_index,
                                            "measure_o2_percentage": get_rsp_json.measure_o2_percentage
                                        };
                                        break;
                                    default:
                                        rsp_json = {
                                            "timeout": false,
                                            "device_ID": get_o2_sensor_json_data.device_ID,
                                            "sensor_index": get_rsp_json.sensor_index,
                                            "measure_o2_percentage": get_rsp_json.measure_o2_percentage
                                        };
                                        break;
                                }
                            }
                        }
                        break;
                    case "Get All O2 Sensor Status":
                        if(get_o2_sensor_json_data.device_ID!=null){
                            var device_info_json = await device_mgr.Read_Device_Inf(O2_Sensor_Device_Type, username, get_o2_sensor_json_data.device_ID);
                            var get_rsp_json = await o2_sensor_api.O2_Sensor_Get_All_Sensor_Status(get_o2_sensor_json_data.device_ID);
                            var sensor_status_list = [];

                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_o2_sensor_json_data.device_ID
                                };
                            }
                            else{
                                switch(device_info_json.sensor_model)
                                {
                                    case "ME3-O2":
                                        for(var i = 0; i<get_rsp_json.num_of_o2_sensor; i++)
                                        {
                                            sensor_status_list.push({
                                                "sensor_index": get_rsp_json.individual_sensor_status[i].sensor_index,
                                                "measure_o2_percentage": get_rsp_json.individual_sensor_status[i].measure_o2_percentage
                                            });
                                        }
                                        rsp_json = {
                                            "timeout": false,
                                            "device_ID": get_o2_sensor_json_data.device_ID,
                                            "num_of_o2_sensor": get_rsp_json.num_of_o2_sensor,
                                            "sensor_status_list": sensor_status_list
                                        };
                                        break;
                                    default:
                                        for(var i = 0; i<get_rsp_json.num_of_o2_sensor; i++)
                                        {
                                            sensor_status_list.push({
                                                "sensor_index": get_rsp_json.individual_sensor_status[i].sensor_index,
                                                "measure_o2_percentage": get_rsp_json.individual_sensor_status[i].measure_o2_percentage
                                            });
                                        }
                                        rsp_json = {
                                            "timeout": false,
                                            "device_ID": get_o2_sensor_json_data.device_ID,
                                            "num_of_o2_sensor": get_rsp_json.num_of_o2_sensor,
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
            debug('[O2_Sensor_WebSocket] Process_O2_Sensor_WebSocket_GET_Message() Error ' + e);
        }
    }
}
module.exports = O2_Sensor_WebSocket;
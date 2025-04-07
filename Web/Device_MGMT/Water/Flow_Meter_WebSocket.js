
var debug = require('debug')(require('path').basename(__filename));

var Flow_Meter_API = require('../../../Device_MGMT/Water/Flow_Meter_API.js');
var flow_meter_api = new Flow_Meter_API();

var Flow_Meter_WebSocket = function (){
    var self = this;
    
    self.Process_Flow_Meter_WebSocket_POST_Message = async function(username, post_flow_meter_json_data)
    {
        try{
            if(post_flow_meter_json_data.command!=null){
                switch(post_flow_meter_json_data.command){
                    case "Set Individual Sensor En/Dis State":
                        if(post_flow_meter_json_data.device_ID!=null && post_flow_meter_json_data.sensor_index!=null){
                            await flow_meter_api.Flow_Meter_Individual_Sensor_Enable_Disable(post_flow_meter_json_data.device_ID, post_flow_meter_json_data.sensor_index, post_flow_meter_json_data.enabled);
                        }
                        break;
                }
            }
        }
        catch(e)
        {
            debug('[Flow_Meter_WebSocket] Process_Flow_Meter_WebSocket_POST_Message() Error ' + e);
        }
    }

    self.Process_Flow_Meter_WebSocket_GET_Message = async function(username, get_flow_meter_json_data)
    {
        try{
            var rsp_json = null;
            if(get_flow_meter_json_data.command!=null){
                switch(get_flow_meter_json_data.command){
                    case "Get Num Of Flow Sensor":
                        if(get_flow_meter_json_data.device_ID!=null){
                            var get_rsp_json = await flow_meter_api.Flow_Meter_Get_Num_Of_Flow_Sensor(get_flow_meter_json_data.device_ID);
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_flow_meter_json_data.device_ID
                                };
                            }
                            else{
                                rsp_json = {
                                    "timeout": false,
                                    "device_ID": get_flow_meter_json_data.device_ID,
                                    "num_of_flow_meter": get_rsp_json.num_of_flow_meter
                                };
                            }
                        }
                        break;
                    case "Get Individual Flow Meter Status":
                        if(get_flow_meter_json_data.device_ID!=null && get_flow_meter_json_data.sensor_index!=null){
                            var get_rsp_json = await flow_meter_api.Flow_Meter_Get_Individual_Sensor_Status(get_flow_meter_json_data.device_ID, get_flow_meter_json_data.sensor_index);
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_flow_meter_json_data.device_ID
                                };
                            }
                            else{
                                rsp_json = {
                                    "timeout": false,
                                    "device_ID": get_flow_meter_json_data.device_ID,
                                    "sensor_index": get_rsp_json.sensor_index,
                                    "enabled": get_rsp_json.enabled,
                                    "measure_L_min": get_rsp_json.measure_L_min,
                                    "measure_L_hour": get_rsp_json.measure_L_hour
                                };
                            }
                        }
                        break;
                    case "Get All Flow Meter Status":
                        if(get_flow_meter_json_data.device_ID!=null){
                            var get_rsp_json = await flow_meter_api.Flow_Meter_Get_All_Sensor_Status(get_flow_meter_json_data.device_ID);
                            var sensor_status_list = [];

                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_flow_meter_json_data.device_ID
                                };
                            }
                            else{
                                for(var i = 0; i<get_rsp_json.num_of_flow_meter; i++)
                                {
                                    sensor_status_list.push({
                                        "sensor_index": get_rsp_json.individual_sensor_status[i].sensor_index,
                                        "enabled": get_rsp_json.individual_sensor_status[i].enabled,
                                        "measure_L_min": get_rsp_json.individual_sensor_status[i].measure_L_min,
                                        "measure_L_hour": get_rsp_json.individual_sensor_status[i].measure_L_hour
                                    });
                                }
                                rsp_json = {
                                    "timeout": false,
                                    "device_ID": get_flow_meter_json_data.device_ID,
                                    "num_of_flow_meter": get_rsp_json.num_of_flow_meter,
                                    "sensor_status_list": sensor_status_list
                                };
                            }
                        }
                        break;
                }
            }
            return rsp_json;
        }
        catch(e)
        {
            debug('[Flow_Meter_WebSocket] Process_Flow_Meter_WebSocket_GET_Message() Error ' + e);
        }
    }
}
module.exports = Flow_Meter_WebSocket;
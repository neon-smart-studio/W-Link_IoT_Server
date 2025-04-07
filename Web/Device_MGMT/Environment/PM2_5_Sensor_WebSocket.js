
var debug = require('debug')(require('path').basename(__filename));

var Device_MGR = require('../../../Util/Device_MGR.js');
var device_mgr = new Device_MGR();

var PM2_5_Sensor_API = require('../../../Device_MGMT/Environment/PM2_5_Sensor_API.js');
var pm2_5_sensor_api = new PM2_5_Sensor_API();

const PM2_5_Sensor_Device_Type = "PM2.5 Sensor";

var PM2_5_Sensor_WebSocket = function (){
    var self = this;
    
    self.Process_PM2_5_Sensor_WebSocket_POST_Message = async function(username, post_pm2_5_sensor_json_data)
    {
        try{
            if(post_pm2_5_sensor_json_data.command!=null){
                switch(post_pm2_5_sensor_json_data.command){
                    case "Set Individual PM2.5 Sensor Resolution":
                        if(post_pm2_5_sensor_json_data.device_ID!=null && post_pm2_5_sensor_json_data.sensor_index!=null && post_pm2_5_sensor_json_data.resolution!=null){
                            await pm2_5_sensor_api.PM2_5_Sensor_Set_Individual_Sensor_Resolution(post_pm2_5_sensor_json_data.device_ID, post_pm2_5_sensor_json_data.sensor_index, post_pm2_5_sensor_json_data.resolution);
                        }
                        break;
                    case "Set All PM2.5 Sensor Resolution":
                        if(post_pm2_5_sensor_json_data.device_ID!=null && post_pm2_5_sensor_json_data.resolution!=null){
                            await pm2_5_sensor_api.PM2_5_Sensor_Set_All_Sensor_Resolution(post_pm2_5_sensor_json_data.device_ID, post_pm2_5_sensor_json_data.resolution);
                        }
                        break;
                }
            }
        }
        catch(e)
        {
            debug('[PM2_5_Sensor_WebSocket] Process_PM2_5_Sensor_WebSocket_POST_Message() Error ' + e);
        }
    }

    self.Process_PM2_5_Sensor_WebSocket_GET_Message = async function(username, get_pm2_5_sensor_json_data)
    {
        try{
            var rsp_json = null;
            if(get_pm2_5_sensor_json_data.command!=null){
                switch(get_pm2_5_sensor_json_data.command){
                    case "Get Num Of PM2.5 Sensor":
                        if(get_pm2_5_sensor_json_data.device_ID!=null){
                            var get_rsp_json = await pm2_5_sensor_api.PM2_5_Sensor_Get_Num_Of_Sensor(get_pm2_5_sensor_json_data.device_ID);
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_pm2_5_sensor_json_data.device_ID
                                };
                            }
                            else{
                                rsp_json = {
                                    "timeout": false,
                                    "device_ID": get_pm2_5_sensor_json_data.device_ID,
                                    "num_of_pm_2_5_sensor": get_rsp_json.num_of_pm_2_5_sensor
                                };
                            }
                        }
                        break;
                    case "Get Individual PM2.5 Sensor Status":
                        if(get_pm2_5_sensor_json_data.device_ID!=null && get_pm2_5_sensor_json_data.sensor_index!=null){
                            var device_info_json = await device_mgr.Read_Device_Inf(PM2_5_Sensor_Device_Type, username, get_pm2_5_sensor_json_data.device_ID);
                            var get_rsp_json = await pm2_5_sensor_api.PM2_5_Sensor_Get_Individual_Sensor_Status(get_pm2_5_sensor_json_data.device_ID, get_pm2_5_sensor_json_data.sensor_index);
                            
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_pm2_5_sensor_json_data.device_ID
                                };
                            }
                            else{
                                switch(device_info_json.sensor_model)
                                {
                                    case "SMR59":
                                        rsp_json = {
                                            "timeout": false,
                                            "device_ID": get_pm2_5_sensor_json_data.device_ID,
                                            "sensor_index": get_rsp_json.sensor_index,
                                            "measure_temperature": get_rsp_json.measure_temperature,
                                            "measure_pm_2_5": get_rsp_json.measure_pm_2_5,
                                            "measure_pm_10": get_rsp_json.measure_pm_10
                                        };
                                        break;
                                    case "DN7C3CA007":
                                        rsp_json = {
                                            "timeout": false,
                                            "device_ID": get_pm2_5_sensor_json_data.device_ID,
                                            "sensor_index": get_rsp_json.sensor_index,
                                            "environment_temperature": get_rsp_json.environment_temperature,
                                            "environment_humidity": get_rsp_json.environment_humidity,
                                            "measure_pm_2_5": get_rsp_json.measure_pm_2_5
                                        };
                                        break;
                                    default:
                                        rsp_json = {
                                            "timeout": false,
                                            "device_ID": get_pm2_5_sensor_json_data.device_ID,
                                            "sensor_index": get_rsp_json.sensor_index,
                                            "measure_pm_2_5": get_rsp_json.measure_pm_2_5
                                        };
                                        break;
                                }
                            }
                        }
                        break;
                    case "Get All PM2.5 Sensor Status":
                        if(get_pm2_5_sensor_json_data.device_ID!=null){
                            var device_info_json = await device_mgr.Read_Device_Inf(PM2_5_Sensor_Device_Type, username, get_pm2_5_sensor_json_data.device_ID);
                            var get_rsp_json = await pm2_5_sensor_api.PM2_5_Sensor_Get_All_Sensor_Status(get_pm2_5_sensor_json_data.device_ID);

                            var sensor_status_list = [];
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_pm2_5_sensor_json_data.device_ID
                                };
                            }
                            else{
                                switch(device_info_json.sensor_model)
                                {
                                    case "SMR59":
                                        for(var i = 0; i<get_rsp_json.num_of_pm_2_5_sensor; i++)
                                        {
                                            sensor_status_list.push({
                                                "sensor_index": get_rsp_json.individual_sensor_status[i].sensor_index,
                                                "measure_temperature": get_rsp_json.individual_sensor_status[i].measure_temperature,
                                                "measure_pm_2_5": get_rsp_json.individual_sensor_status[i].measure_pm_2_5,
                                                "measure_pm_10": get_rsp_json.individual_sensor_status[i].measure_pm_10
                                            });
                                        }
                                        rsp_json = {
                                            "timeout": false,
                                            "device_ID": get_pm2_5_sensor_json_data.device_ID,
                                            "num_of_pm_2_5_sensor": get_rsp_json.num_of_pm_2_5_sensor,
                                            "sensor_status_list": sensor_status_list
                                        };
                                        break;
                                    case "DN7C3CA007":
                                        for(var i = 0; i<get_rsp_json.num_of_pm_2_5_sensor; i++)
                                        {
                                            sensor_status_list.push({
                                                "sensor_index": get_rsp_json.individual_sensor_status[i].sensor_index,
                                                "measure_pm_2_5": get_rsp_json.individual_sensor_status[i].measure_pm_2_5
                                            });
                                        }
                                        rsp_json = {
                                            "timeout": false,
                                            "device_ID": get_pm2_5_sensor_json_data.device_ID,
                                            "num_of_pm_2_5_sensor": get_rsp_json.num_of_pm_2_5_sensor,
                                            "environment_temperature": get_rsp_json.environment_temperature,
                                            "environment_humidity": get_rsp_json.environment_humidity,
                                            "sensor_status_list": sensor_status_list
                                        };
                                        break;
                                    default:
                                        for(var i = 0; i<get_rsp_json.num_of_pm_2_5_sensor; i++)
                                        {
                                            sensor_status_list.push({
                                                "sensor_index": get_rsp_json.individual_sensor_status[i].sensor_index,
                                                "measure_pm_2_5": get_rsp_json.individual_sensor_status[i].measure_pm_2_5
                                            });
                                        }
                                        rsp_json = {
                                            "timeout": false,
                                            "device_ID": get_pm2_5_sensor_json_data.device_ID,
                                            "num_of_pm_2_5_sensor": get_rsp_json.num_of_pm_2_5_sensor,
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
            debug('[PM2_5_Sensor_WebSocket] Process_PM2_5_Sensor_WebSocket_GET_Message() Error ' + e);
        }
    }

}
module.exports = PM2_5_Sensor_WebSocket;
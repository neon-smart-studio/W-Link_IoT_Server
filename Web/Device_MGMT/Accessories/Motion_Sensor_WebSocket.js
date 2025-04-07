
var debug = require('debug')(require('path').basename(__filename));

var Motion_Sensor_API = require('../../../Device_MGMT/Accessories/Motion_Sensor_API.js');
var motion_sensor_api = new Motion_Sensor_API();

var Motion_Sensor_WebSocket = function (){
    var self = this;
    
    self.Process_Motion_Sensor_WebSocket_POST_Message = async function(username, post_motion_sensor_json_data)
    {
        try{
            if(post_motion_sensor_json_data.command!=null){
                switch(post_motion_sensor_json_data.command){
                    case "Config Motion Sensor Reaction Time":
                        if(post_motion_sensor_json_data.device_ID!=null && post_motion_sensor_json_data.sensor_index!=null && post_motion_sensor_json_data.reaction_time!=null){
                            await motion_sensor_api.Config_Motion_Sensor_Reaction_Time(username, post_motion_sensor_json_data.device_ID, post_motion_sensor_json_data.sensor_index, post_motion_sensor_json_data.reaction_time);
                        }
                        break;
                }
            }
        }
        catch(e)
        {
            debug('[Motion_Sensor_WebSocket] Process_Motion_Sensor_WebSocket_POST_Message() Error ' + e);
        }
    }

    self.Process_Motion_Sensor_WebSocket_GET_Message = async function(username, get_motion_sensor_json_data)
    {
        try{
            var rsp_json = null;
            if(get_motion_sensor_json_data.command!=null){
                switch(get_motion_sensor_json_data.command){
                    case "Get Motion Sensor Reaction Time":
                        if(get_motion_sensor_json_data.device_ID!=null && get_motion_sensor_json_data.sensor_index!=null && get_motion_sensor_json_data.reaction_time!=null){
                            rsp_json = await motion_sensor_api.Get_Motion_Sensor_Reaction_Time(username, get_motion_sensor_json_data.device_ID, get_motion_sensor_json_data.sensor_index, get_motion_sensor_json_data.reaction_time);
                        }
                        break;
                    case "Get Motion Sensor Support Actions":
                        if(get_motion_sensor_json_data.device_ID!=null){
                            var get_rsp_json = await motion_sensor_api.Get_Motion_Sensor_Support_Actions(username, get_motion_sensor_json_data.device_ID);
                            rsp_json = {
                                "device_ID": get_motion_sensor_json_data.device_ID,
                                "support_actions": get_rsp_json.support_actions
                            };
                        }
                        break;
                    case "Get Num Of Motion Sensor":
                        if(get_motion_sensor_json_data.device_ID!=null){
                            var get_rsp_json = await motion_sensor_api.Get_Num_Of_Motion_Sensor(get_motion_sensor_json_data.device_ID);
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_motion_sensor_json_data.device_ID
                                };
                            }
                            else{
                                rsp_json = {
                                    "timeout": false,
                                    "device_ID": get_motion_sensor_json_data.device_ID,
                                    "num_of_motion_sensor": get_rsp_json.num_of_motion_sensor
                                };
                            }
                        }
                        break;
                    case "Get Motion Sensor Individual Sensor Info":
                        if(get_motion_sensor_json_data.device_ID!=null && get_motion_sensor_json_data.sensor_index!=null){
                            get_rsp_json = await motion_sensor_api.Get_Motion_Sensor_Individual_Sensor_Info(get_motion_sensor_json_data.device_ID, get_motion_sensor_json_data.sensor_index);
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_motion_sensor_json_data.device_ID
                                };
                            }
                            else{
                                var last_action = "None";
                                if(get_rsp_json.last_action)
                                {
                                    last_action = get_rsp_json.last_action;
                                }
                                rsp_json = {
                                    "timeout": false,
                                    "device_ID": get_onoff_socket_json_data.device_ID,
                                    "sensor_index": get_rsp_json.sensor_index,
                                    "support_actions": get_rsp_json.support_actions,
                                    "last_action": last_action
                                };
                            }
                        }
                        break;
                    case "Get Motion Sensor All Sensor Info":
                        if(get_motion_sensor_json_data.device_ID!=null){
                            get_rsp_json = await motion_sensor_api.Get_Motion_Sensor_All_Sensor_Info(get_motion_sensor_json_data.device_ID);
                            var sensor_info_list = [];
                            
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_motion_sensor_json_data.device_ID
                                };
                            }
                            else{
                                var last_action;

                                for(var i = 0; i<get_rsp_json.num_of_motion_sensor; i++)
                                {
                                    last_action = "None";
                                    if(get_rsp_json.individual_sensor_info[i].last_action)
                                    {
                                        last_action = get_rsp_json.individual_sensor_info[i].last_action;
                                    }
                                    sensor_info_list.push({
                                        "sensor_index": get_rsp_json.individual_sensor_info[i].sensor_index,
                                        "support_actions": get_rsp_json.individual_sensor_info[i].support_actions,
                                        "last_action": last_action
                                    });
                                }
                                rsp_json = {
                                    "timeout": false,
                                    "device_ID": get_motion_sensor_json_data.device_ID,
                                    "num_of_motion_sensor": get_rsp_json.num_of_motion_sensor,
                                    "sensor_info_list": sensor_info_list
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
            debug('[Motion_Sensor_WebSocket] Process_Motion_Sensor_WebSocket_GET_Message() Error ' + e);
        }
    }
}
module.exports = Motion_Sensor_WebSocket;

var debug = require('debug')(require('path').basename(__filename));

var Door_Window_Sensor_API = require('../../../Device_MGMT/Accessories/Door_Window_Sensor_API.js');
var door_window_sensor_api = new Door_Window_Sensor_API();

var Door_Window_Sensor_WebSocket = function (){
    var self = this;
    
    self.Process_Door_Window_Sensor_WebSocket_POST_Message = async function(username, post_door_window_sensor_json_data)
    {
        try{
            if(post_door_window_sensor_json_data.command!=null){
                switch(post_door_window_sensor_json_data.command){
                }
            }
        }
        catch(e)
        {
            debug('[Door_Window_Sensor_WebSocket] Process_Door_Window_Sensor_WebSocket_POST_Message() Error ' + e);
        }
    }

    self.Process_Door_Window_Sensor_WebSocket_GET_Message = async function(username, get_door_window_sensor_json_data)
    {
        try{
            var rsp_json = null;
            if(get_door_window_sensor_json_data.command!=null){
                switch(get_door_window_sensor_json_data.command){
                    case "Get Door/Window Sensor Support Actions":
                        if(get_door_window_sensor_json_data.device_ID!=null){
                            var get_rsp_json = await door_window_sensor_api.Get_Door_Window_Sensor_Support_Actions(username, get_door_window_sensor_json_data.device_ID);
                            rsp_json = {
                                "device_ID": get_door_window_sensor_json_data.device_ID,
                                "support_actions": get_rsp_json.support_actions
                            };
                        }
                        break;
                    case "Get Num Of Door/Window Sensor":
                        if(get_door_window_sensor_json_data.device_ID!=null){
                            var get_rsp_json = await door_window_sensor_api.Get_Num_Of_Door_Window_Sensor(get_door_window_sensor_json_data.device_ID);
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_door_window_sensor_json_data.device_ID
                                };
                            }
                            else{
                                rsp_json = {
                                    "timeout": false,
                                    "device_ID": get_door_window_sensor_json_data.device_ID,
                                    "num_of_door_window_sensor": get_rsp_json.num_of_door_window_sensor
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
            debug('[Door_Window_Sensor_WebSocket] Process_Door_Window_Sensor_WebSocket_GET_Message() Error ' + e);
        }
    }
}
module.exports = Door_Window_Sensor_WebSocket;
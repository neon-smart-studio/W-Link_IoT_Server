
var debug = require('debug')(require('path').basename(__filename));

var Device_MGR = require('../../../Util/Device_MGR.js');
var device_mgr = new Device_MGR();

var OnOff_Switch_WebSocket = require('./OnOff_Switch_WebSocket.js');
var onoff_switch_webSocket = new OnOff_Switch_WebSocket();
var Dimmable_Switch_WebSocket = require('./Dimmable_Switch_WebSocket.js');
var dimmable_switch_webSocket = new Dimmable_Switch_WebSocket();
var Toggle_Switch_WebSocket = require('./Toggle_Switch_WebSocket.js');
var toggle_switch_webSocket = new Toggle_Switch_WebSocket();
var Scene_Switch_WebSocket = require('./Scene_Switch_WebSocket.js');
var scene_switch_webSocket = new Scene_Switch_WebSocket();
var Motion_Sensor_WebSocket = require('./Motion_Sensor_WebSocket.js');
var motion_sensor_webSocket = new Motion_Sensor_WebSocket();
var Door_Window_Sensor_WebSocket = require('./Door_Window_Sensor_WebSocket.js');
var door_window_sensor_webSocket = new Door_Window_Sensor_WebSocket();

var OnOff_Switch_API = require('../../../Device_MGMT/Accessories/OnOff_Switch_API.js');
var onoff_switch_api = new OnOff_Switch_API();
var Dimmable_Switch_API = require('../../../Device_MGMT/Accessories/Dimmable_Switch_API.js');
var dimmable_switch_api = new Dimmable_Switch_API();
var Toggle_Switch_API = require('../../../Device_MGMT/Accessories/Toggle_Switch_API.js');
var toggle_switch_api = new Toggle_Switch_API();
var Scene_Switch_API = require('../../../Device_MGMT/Accessories/Scene_Switch_API.js');
var scene_switch_api = new Scene_Switch_API();
var Motion_Sensor_API = require('../../../Device_MGMT/Accessories/Motion_Sensor_API.js');
var motion_sensor_api = new Motion_Sensor_API();
var Door_Window_Sensor_API = require('../../../Device_MGMT/Accessories/Door_Window_Sensor_API.js');
var door_window_sensor_api = new Door_Window_Sensor_API();

async function Process_Accessories_WebSocket_POST_Message(username, post_json_data)
{
    try{
        if(post_json_data.command!=null){
        }
    }
    catch(e)
    {
        debug('[Accessories_WebSocket] Process_Accessories_WebSocket_POST_Message() Error ' + e);
    }
}

async function Process_Accessories_WebSocket_GET_Message(username, get_json_data)
{
    try{
        var rsp_json = null;
        if(get_json_data.command!=null){
            switch(get_json_data.command){
                case "Get All Accessories Device List":
                    var device_list = [];

                    var onoff_switch_list_json = await device_mgr.Get_Device_List_Specific_User("OnOff Switch", username);
                    var dimmable_switch_list_json = await device_mgr.Get_Device_List_Specific_User("Dimmable Switch", username);
                    var toggle_switch_list_json = await device_mgr.Get_Device_List_Specific_User("Toggle Switch", username);
                    var scene_switch_list_json = await device_mgr.Get_Device_List_Specific_User("Scene Switch", username);
                    var motion_sensor_list_json = await device_mgr.Get_Device_List_Specific_User("Motion Sensor", username);
                    var door_window_sensor_list_json = await device_mgr.Get_Device_List_Specific_User("Door/Window Sensor", username);

                    if(onoff_switch_list_json!=null){
                        device_list = device_list.concat(onoff_switch_list_json.device_list);
                    }
                    if(dimmable_switch_list_json!=null){
                        device_list = device_list.concat(dimmable_switch_list_json.device_list);
                    }
                    if(toggle_switch_list_json!=null){
                        device_list = device_list.concat(toggle_switch_list_json.device_list);
                    }
                    if(scene_switch_list_json!=null){
                        device_list = device_list.concat(scene_switch_list_json.device_list);
                    }
                    if(motion_sensor_list_json!=null){
                        device_list = device_list.concat(motion_sensor_list_json.device_list);
                    }
                    if(door_window_sensor_list_json!=null){
                        device_list = device_list.concat(door_window_sensor_list_json.device_list);
                    }
                    
                    rsp_json = {
                        device_list: device_list
                    };
                    break;
            }
        }
        return rsp_json;
    }
    catch(e)
    {
        debug('[Accessories_WebSocket] Process_Accessories_WebSocket_GET_Message() Error ' + e);
    }
}

var Accessories_WebSocket = function (){
    var self = this;
    
    self.Process_Accessories_Topic_WebSocket_POST_Message = async function(username, post_json_data)
    {
        try{
            if(post_json_data.command_type==null){
                await Process_Accessories_WebSocket_POST_Message(username, post_json_data);
            }
            else{
                switch(post_json_data.command_type){
                    case "OnOff Switch":
                        await onoff_switch_webSocket.Process_OnOff_Switch_WebSocket_POST_Message(username, post_json_data);
                        break;
                    case "Dimmable Switch":
                        await dimmable_switch_webSocket.Process_Dimmable_Switch_WebSocket_POST_Message(username, post_json_data);
                        break;
                    case "Toggle Switch":
                        await toggle_switch_webSocket.Process_Toggle_Switch_WebSocket_POST_Message(username, post_json_data);
                        break;
                    case "Scene Switch":
                        await scene_switch_webSocket.Process_Scene_Switch_WebSocket_POST_Message(username, post_json_data);
                        break;
                    case "Motion Sensor":
                        await motion_sensor_webSocket.Process_Motion_Sensor_WebSocket_POST_Message(username, post_json_data);
                        break;
                    case "Door/Window Sensor":
                        await door_window_sensor_webSocket.Process_Door_Window_Sensor_WebSocket_POST_Message(username, post_json_data);
                        break;
                }
            }
        }
        catch(e)
        {
            debug('[Accessories_WebSocket] Process_Accessories_Topic_WebSocket_POST_Message() Error ' + e);
        }
    }

    self.Process_Accessories_Topic_WebSocket_GET_Message = async function(username, get_json_data)
    {
        try{
            var rsp_json = null;
            if(get_json_data.command_type==null){
                rsp_json = await Process_Accessories_WebSocket_GET_Message(username, get_json_data);
            }
            else{
                switch(get_json_data.command_type){
                    case "OnOff Switch":
                        rsp_json = await onoff_switch_webSocket.Process_OnOff_Switch_WebSocket_GET_Message(username, get_json_data);
                        break;
                    case "Dimmable Switch":
                        rsp_json = await dimmable_switch_webSocket.Process_Dimmable_Switch_WebSocket_GET_Message(username, get_json_data);
                        break;
                    case "Toggle Switch":
                        rsp_json = await toggle_switch_webSocket.Process_Toggle_Switch_WebSocket_GET_Message(username, get_json_data);
                        break;
                    case "Scene Switch":
                        rsp_json = await scene_switch_webSocket.Process_Scene_Switch_WebSocket_GET_Message(username, get_json_data);
                        break;
                    case "Motion Sensor":
                        rsp_json = await motion_sensor_webSocket.Process_Motion_Sensor_WebSocket_GET_Message(username, get_json_data);
                        break;
                    case "Door/Window Sensor":
                        rsp_json = await door_window_sensor_webSocket.Process_Door_Window_Sensor_WebSocket_GET_Message(username, get_json_data);
                        break;
                }
            }
            return rsp_json;
        }
        catch(e)
        {
            debug('[Accessories_WebSocket] Process_Accessories_Topic_WebSocket_GET_Message() Error ' + e);
        }
    }
}
module.exports = Accessories_WebSocket;

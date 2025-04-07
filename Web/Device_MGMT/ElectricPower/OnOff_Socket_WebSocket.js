
var debug = require('debug')(require('path').basename(__filename));

var OnOff_Socket_API = require('../../../Device_MGMT/ElectricPower/OnOff_Socket_API.js');
var onoff_socket_api = new OnOff_Socket_API();

var OnOff_Socket_WebSocket = function (){
    var self = this;
    
    self.Process_OnOff_Socket_WebSocket_POST_Message = async function(username, post_onoff_socket_json_data)
    {
        try{
            if(post_onoff_socket_json_data.command!=null){
                switch(post_onoff_socket_json_data.command){
                    case "Turn On Individual OnOff Socket":
                        if(post_onoff_socket_json_data.device_ID!=null && post_onoff_socket_json_data.socket_index!=null){
                            await onoff_socket_api.OnOff_Socket_Set_Individual_Socket_On_Off(post_onoff_socket_json_data.device_ID, post_onoff_socket_json_data.socket_index, true);
                        }
                        break;
                    case "Turn Off Individual OnOff Socket":
                        if(post_onoff_socket_json_data.device_ID!=null && post_onoff_socket_json_data.socket_index!=null){
                            await onoff_socket_api.OnOff_Socket_Set_Individual_Socket_On_Off(post_onoff_socket_json_data.device_ID, post_onoff_socket_json_data.socket_index, false);
                        }
                        break;
                    case "Turn On All OnOff Socket":
                        if(post_onoff_socket_json_data.device_ID!=null){
                            await onoff_socket_api.OnOff_Socket_Set_All_Socket_On_Off(post_onoff_socket_json_data.device_ID, true);
                        }
                        break;
                    case "Turn Off All OnOff Socket":
                        if(post_onoff_socket_json_data.device_ID!=null){
                            await onoff_socket_api.OnOff_Socket_Set_All_Socket_On_Off(post_onoff_socket_json_data.device_ID, false);
                        }
                        break;
                }
            }
        }
        catch(e)
        {
            debug('[OnOff_Socket_WebSocket] Process_OnOff_Socket_WebSocket_POST_Message() Error ' + e);
        }
    }

    self.Process_OnOff_Socket_WebSocket_GET_Message = async function(username, get_onoff_socket_json_data)
    {
        try{
            var rsp_json = null;
            if(get_onoff_socket_json_data.command!=null){
                switch(get_onoff_socket_json_data.command){
                    case "Get Num Of OnOff Socket":
                        if(get_onoff_socket_json_data.device_ID!=null){
                            var get_rsp_json = await onoff_socket_api.Get_Num_Of_OnOff_Socket(get_onoff_socket_json_data.device_ID);
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_onoff_socket_json_data.device_ID
                                };
                            }
                            else{
                                rsp_json = {
                                    "timeout": false,
                                    "device_ID": get_onoff_socket_json_data.device_ID,
                                    "num_of_onoff_socket": get_rsp_json.num_of_onoff_socket
                                };
                            }
                        }
                        break;
                    case "Get Individual OnOff Socket Status":
                        if(get_onoff_socket_json_data.device_ID!=null && get_onoff_socket_json_data.socket_index!=null){
                            var get_rsp_json = await onoff_socket_api.Get_OnOff_Socket_Individual_Socket_Status(get_onoff_socket_json_data.device_ID, get_onoff_socket_json_data.socket_index);
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_onoff_socket_json_data.device_ID
                                };
                            }
                            else{
                                rsp_json = {
                                    "timeout": false,
                                    "device_ID": get_onoff_socket_json_data.device_ID,
                                    "socket_index": get_rsp_json.socket_index,
                                    "on_off": get_rsp_json.on_off
                                };
                            }
                        }
                        break;
                    case "Get All OnOff Socket Status":
                        if(get_onoff_socket_json_data.device_ID!=null){
                            var get_rsp_json = await onoff_socket_api.Get_OnOff_Socket_All_Socket_Status(get_onoff_socket_json_data.device_ID);
                            var socket_status_list = [];

                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_onoff_socket_json_data.device_ID
                                };
                            }
                            else{
                                for(var i = 0; i<get_rsp_json.num_of_onoff_socket; i++)
                                {
                                    socket_status_list.push({
                                        "socket_index": get_rsp_json.individual_socket_status[i].socket_index,
                                        "on_off": get_rsp_json.individual_socket_status[i].on_off
                                    });
                                }
                                rsp_json = {
                                    "timeout": false,
                                    "device_ID": get_onoff_socket_json_data.device_ID,
                                    "num_of_onoff_socket": get_rsp_json.num_of_onoff_socket,
                                    "socket_status_list": socket_status_list
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
            debug('[OnOff_Socket_WebSocket] Process_OnOff_Socket_WebSocket_GET_Message() Error ' + e);
        }
    }
}
module.exports = OnOff_Socket_WebSocket;
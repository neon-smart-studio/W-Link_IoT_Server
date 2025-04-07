
var debug = require('debug')(require('path').basename(__filename));

var Dimmable_Socket_API = require('../../../Device_MGMT/ElectricPower/Dimmable_Socket_API.js');
var dimmable_socket_api = new Dimmable_Socket_API();

var Dimmable_Socket_WebSocket = function (){
    var self = this;
        
    self.Process_Dimmable_Socket_WebSocket_POST_Message = async function(username, post_dimmable_socket_json_data)
    {
        try{
            if(post_dimmable_socket_json_data.command!=null){
                switch(post_dimmable_socket_json_data.command){
                    case "Turn On Individual Dimmable Socket":
                        if(post_dimmable_socket_json_data.device_ID!=null && post_dimmable_socket_json_data.socket_index!=null){
                            await dimmable_socket_api.Dimmable_Socket_Set_Individual_Socket_On_Off(post_dimmable_socket_json_data.device_ID, post_dimmable_socket_json_data.socket_index, true);
                        }
                        break;
                    case "Turn Off Individual Dimmable Socket":
                        if(post_dimmable_socket_json_data.device_ID!=null && post_dimmable_socket_json_data.socket_index!=null){
                            await dimmable_socket_api.Dimmable_Socket_Set_Individual_Socket_On_Off(post_dimmable_socket_json_data.device_ID, post_dimmable_socket_json_data.socket_index, false);
                        }
                        break;
                    case "Turn On All Dimmable Socket":
                        if(post_dimmable_socket_json_data.device_ID!=null){
                            await dimmable_socket_api.Dimmable_Socket_Set_All_Socket_On_Off(post_dimmable_socket_json_data.device_ID, true);
                        }
                        break;
                    case "Turn Off All Dimmable Socket":
                        if(post_dimmable_socket_json_data.device_ID!=null){
                            await dimmable_socket_api.Dimmable_Socket_Set_All_Socket_On_Off(post_dimmable_socket_json_data.device_ID, false);
                        }
                        break;
                    case "Individual Dimmable Socket Set Pwm Level":
                        if(post_dimmable_socket_json_data.device_ID!=null && post_dimmable_socket_json_data.socket_index!=null && post_dimmable_socket_json_data.level!=null){
                            await dimmable_socket_api.Dimmable_Socket_Set_Individual_Socket_PWM_Level(post_dimmable_socket_json_data.device_ID, post_dimmable_socket_json_data.socket_index, post_dimmable_socket_json_data.level);
                        }
                    case "All Dimmable Socket Set Pwm Level":
                        if(post_dimmable_socket_json_data.device_ID!=null && post_dimmable_socket_json_data.level!=null){
                            await dimmable_socket_api.Dimmable_Socket_Set_All_Socket_PWM_Level(post_dimmable_socket_json_data.device_ID, post_dimmable_socket_json_data.level);
                        }
                        break;
                }
            }
        }
        catch(e)
        {
            debug('[Dimmable_Socket_WebSocket] Process_Dimmable_Socket_WebSocket_POST_Message() Error ' + e);
        }
    }

    self.Process_Dimmable_Socket_WebSocket_GET_Message = async function(username, get_dimmable_socket_json_data)
    {
        try{
            var rsp_json = null;
            if(get_dimmable_socket_json_data.command!=null){
                switch(get_dimmable_socket_json_data.command){
                    case "Get Num Of Dimmable Socket":
                        if(get_dimmable_socket_json_data.device_ID!=null){
                            var get_rsp_json = await dimmable_socket_api.Get_Num_Of_Dimmable_Socket(get_dimmable_socket_json_data.device_ID);
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_dimmable_socket_json_data.device_ID
                                };
                            }
                            else{
                                rsp_json = {
                                    "timeout": false,
                                    "device_ID": get_dimmable_socket_json_data.device_ID,
                                    "num_of_dimmable_socket": get_rsp_json.num_of_dimmable_socket
                                };
                            }
                        }
                        break;
                    case "Get Individual Dimmable Socket Status":
                        if(get_dimmable_socket_json_data.device_ID!=null && get_dimmable_socket_json_data.socket_index!=null){
                            var get_rsp_json = await dimmable_socket_api.Get_Dimmable_Socket_Individual_Socket_Status(get_dimmable_socket_json_data.device_ID, get_dimmable_socket_json_data.socket_index);
                            if(socket_status_list.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_dimmable_socket_json_data.device_ID
                                };
                            }
                            else{
                                rsp_json = {
                                    "timeout": false,
                                    "device_ID": get_dimmable_socket_json_data.device_ID,
                                    "socket_index": socket_status_list.socket_index,
                                    "on_off": socket_status_list.on_off,
                                    "pwm_level": socket_status_list.pwm_level
                                };
                            }
                        }
                        break;
                    case "Get All Dimmable Socket Status":
                        if(get_dimmable_socket_json_data.device_ID!=null){
                            var get_rsp_json = await dimmable_socket_api.Get_Dimmable_Socket_All_Socket_Status(get_dimmable_socket_json_data.device_ID);
                            var socket_status_list = [];

                            if(socket_status_list.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_dimmable_socket_json_data.device_ID
                                };
                            }
                            else{
                                for(var i = 0; i<socket_status_list.num_of_dimmable_socket; i++)
                                {
                                    socket_status_list.push({
                                        "socket_index": socket_status_list.individual_socket_status[i].socket_index,
                                        "on_off": socket_status_list.individual_socket_status[i].on_off,
                                        "pwm_level": socket_status_list.individual_socket_status[i].pwm_level
                                    });
                                }
                                rsp_json = {
                                    "timeout": false,
                                    "device_ID": get_dimmable_socket_json_data.device_ID,
                                    "num_of_dimmable_socket": socket_status_list.num_of_dimmable_socket,
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
            debug('[Dimmable_Socket_WebSocket] Process_Dimmable_Socket_WebSocket_GET_Message() Error ' + e);
        }
    }
}
module.exports = Dimmable_Socket_WebSocket;
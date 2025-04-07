
var debug = require('debug')(require('path').basename(__filename));

var Blind_Curtain_API = require('../../../Device_MGMT/Environment/Blind_Curtain_API.js');
var blind_curtain_api = new Blind_Curtain_API();

var Blind_Curtain_WebSocket = function (){
    var self = this;
    
    self.Process_Blind_Curtain_WebSocket_POST_Message = async function(username, post_blind_curtain_json_data)
    {
        try{
            if(post_blind_curtain_json_data.command!=null){
                switch(post_blind_curtain_json_data.command){
                    case "Blind Curtain Open":
                        if(post_blind_curtain_json_data.device_ID!=null){
                            await blind_curtain_api.Blind_Curtain_Open_Close(post_blind_curtain_json_data.device_ID, true);
                        }
                        break;
                    case "Blind Curtain Close":
                        if(post_blind_curtain_json_data.device_ID!=null){
                            await blind_curtain_api.Blind_Curtain_Open_Close(post_blind_curtain_json_data.device_ID, false);
                        }
                        break;
                    case "Blind Curtain Toggle State":
                        if(post_blind_curtain_json_data.device_ID!=null){
                            await blind_curtain_api.Blind_Curtain_Toggle_State(post_blind_curtain_json_data.device_ID, false);
                        }
                        break;
                    case "Blind Curtain Move To Position":
                        if(post_blind_curtain_json_data.device_ID!=null && post_blind_curtain_json_data.lift_percentage!=null){
                            await blind_curtain_api.Blind_Curtain_Lift_To_Position(post_blind_curtain_json_data.device_ID, post_blind_curtain_json_data.lift_percentage);
                        }
                        else if(post_blind_curtain_json_data.device_ID!=null && post_blind_curtain_json_data.tilt_percentage!=null){
                            await blind_curtain_api.Blind_Curtain_Tilt_To_Position(post_blind_curtain_json_data.device_ID, post_blind_curtain_json_data.tilt_percentage);
                        }
                        break;
                    case "Blind Curtain Stop Moving":
                        if(post_blind_curtain_json_data.device_ID!=null){
                            await blind_curtain_api.Blind_Curtain_Stop_Moveing(post_blind_curtain_json_data.device_ID);
                        }
                        break;
                }
            }
        }
        catch(e)
        {
            debug('[Blind_Curtain_WebSocket] Process_Blind_Curtain_WebSocket_POST_Message() Error ' + e);
        }
    }

    self.Process_Blind_Curtain_WebSocket_GET_Message = async function(username, get_blind_curtain_json_data)
    {
        try{
            var rsp_json = null;
            if(get_blind_curtain_json_data.command!=null){
                switch(get_blind_curtain_json_data.command){
                    case "Get Blind Curtain Current Position":
                        if(get_blind_curtain_json_data.device_ID!=null){
                            var get_rsp_json = await blind_curtain_api.Blind_Curtain_Get_Current_Position(get_blind_curtain_json_data.device_ID);
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_blind_curtain_json_data.device_ID
                                };
                            }
                            else{
                                rsp_json = {
                                    "timeout": false,
                                    "device_ID": get_blind_curtain_json_data.device_ID,
                                    "percentage": get_rsp_json.lift_percentage
                                };
                            }
                        }
                        break;
                    case "Get Blind Curtain All Status":
                        if(get_blind_curtain_json_data.device_ID!=null){
                            var get_rsp_json = await blind_curtain_api.Blind_Curtain_Get_Current_Position(get_blind_curtain_json_data.device_ID);
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_blind_curtain_json_data.device_ID
                                };
                            }
                            else{
                                rsp_json = {
                                    "timeout": false,
                                    "device_ID": get_blind_curtain_json_data.device_ID,
                                    "lift_percentage": get_rsp_json.lift_percentage,
                                    "tilt_percentage": get_rsp_json.tilt_percentage
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
            debug('[Blind_Curtain_WebSocket] Process_Blind_Curtain_WebSocket_GET_Message() Error ' + e);
        }
    }
}
module.exports = Blind_Curtain_WebSocket;
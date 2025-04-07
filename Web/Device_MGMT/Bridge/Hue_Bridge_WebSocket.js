
var debug = require('debug')(require('path').basename(__filename));

var WebSocket = require('../../WebSocket.js');
var websocket = new WebSocket();

var Hue_Bridge_Device_API = require('../../../Hue_Bridge/Hue_Bridge_Device_API.js');
var hue_bridge_device_api = new Hue_Bridge_Device_API();

var Hue_Bridge_Light_API = require('../../../Hue_Bridge/Hue_Bridge_Light_API.js');
var hue_bridge_light_api = new Hue_Bridge_Light_API();

var Hue_Bridge_Group_API = require('../../../Hue_Bridge/Hue_Bridge_Group_API.js');
var hue_bridge_group_api = new Hue_Bridge_Group_API();

var Hue_Bridge_WebSocket = function (){
    var self = this;
    
    self.Process_Hue_Bridge_WebSocket_POST_Message = async function(username, post_hue_bridge_json_data)
    {
        try{
            if(post_hue_bridge_json_data.command!=null){
                switch(post_hue_bridge_json_data.command){
                    case "Link To Hue Bridge":
                        if(post_hue_bridge_json_data.bridge_IP!=null){
                            var link_status = await hue_bridge_device_api.Link_To_Hue_Bridge(username, post_hue_bridge_json_data.bridge_IP);
                            if(link_status)
                            {
                                var ws_report_cmd = {
                                    "command_type": "Hue Bridge",
                                    "command": "Report Hue Bridge Link Successfully",
                                    "bridge_IP": post_hue_bridge_json_data.bridge_IP,
                                }
            
                                websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User(username, 'Bridge', ws_report_cmd);
                            }
                        }
                        break;
                    case "Hue Bridge Synchronize All Light Info":
                        if(post_hue_bridge_json_data.device_ID!=null){
                            var sync_status = await hue_bridge_light_api.Hue_Bridge_Synchronize_All_Light_Info(username, post_hue_bridge_json_data.device_ID);
                            var ws_report_cmd = {};
                            if(sync_status)
                            {
                                ws_report_cmd = {
                                    "command_type": "Hue Bridge",
                                    "command": "Report Hue Bridge Synchronize Lights Successfully",
                                    "device_ID": post_hue_bridge_json_data.device_ID
                                }
                            }
                            else{
                                ws_report_cmd = {
                                    "command_type": "Hue Bridge",
                                    "command": "Report Hue Bridge Synchronize Lights Failed",
                                    "device_ID": post_hue_bridge_json_data.device_ID
                                }
                            }
                            websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User(username, 'Bridge', ws_report_cmd);
                        }
                        break;
                    case "Hue Bridge Synchronize All Group Info":
                        if(post_hue_bridge_json_data.device_ID!=null){
                            var sync_status = await hue_bridge_group_api.Hue_Bridge_Synchronize_All_Group_Info(username, post_hue_bridge_json_data.device_ID);
                            var ws_report_cmd = {};
                            if(sync_status)
                            {
                                ws_report_cmd = {
                                    "command_type": "Hue Bridge",
                                    "command": "Report Hue Bridge Synchronize Groups Successfully",
                                    "device_ID": post_hue_bridge_json_data.device_ID
                                }
                            }
                            else{
                                ws_report_cmd = {
                                    "command_type": "Hue Bridge",
                                    "command": "Report Hue Bridge Synchronize Groups Failed",
                                    "device_ID": post_hue_bridge_json_data.device_ID
                                }
                            }
                            websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User(username, 'Bridge', ws_report_cmd);
                        }
                        break;
                }
            }
        }
        catch(e)
        {
            debug('[Hue_Bridge_WebSocket] Process_Hue_Bridge_WebSocket_POST_Message() Error ' + e);
        }
    }

    self.Process_Hue_Bridge_WebSocket_GET_Message = async function(username, get_hue_bridge_json_data)
    {
        try{
            var rsp_json = null;
            if(get_hue_bridge_json_data.command!=null){
                switch(get_hue_bridge_json_data.command){
                    case "Discover Nearby Hue Bridge":
                        rsp_json = await hue_bridge_device_api.Discover_Nearby_Hue_Bridge(username);
                        break;
                }
            }
            return rsp_json;
        }
        catch(e)
        {
            debug('[Hue_Bridge_WebSocket] Process_Hue_Bridge_WebSocket_GET_Message() Error ' + e);
        }
    }

}
module.exports = Hue_Bridge_WebSocket;
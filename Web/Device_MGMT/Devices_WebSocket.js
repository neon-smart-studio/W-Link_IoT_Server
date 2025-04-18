
var debug = require('debug')(require('path').basename(__filename));

var Device_MGMT_API = require('../../Device_MGMT/Device_MGMT_API.js');
var device_mgmt_api = new Device_MGMT_API();

var Device_MGR = require('../../Util/Device_MGR.js');
var device_mgr = new Device_MGR();

var Hue_Bridge_Device_API = require('../../Integrate/Hue_Bridge/Hue_Bridge_Device_API.js');
var hue_bridge_device_api = new Hue_Bridge_Device_API();

var Devices_WebSocket = function (){
    var self = this;
    
    self.Process_Devices_Topic_WebSocket_POST_Message = async function(username, post_device_json_data)
    {
        try{
            var mapped_device_type = null
            if(post_device_json_data.device_type!=null){
                switch(post_device_json_data.device_type)
                {
                    //Lighting
                    case "OnOff Light":
                    case "Dimmable Light":
                    case "Color Temperature Light":
                    case "Colored Light":
                    case "Extended Color Light":
                        mapped_device_type = "Lighting";
                        break;
                    default:
                        mapped_device_type = post_device_json_data.device_type;
                        break;
                }
                
                if(post_device_json_data.command!=null){
                    switch(post_device_json_data.command){
                        case "Device Change Name":
                            if(post_device_json_data.device_ID!=null && post_device_json_data.device_Name!=null){
                                await device_mgr.Device_Change_Name(mapped_device_type, username, post_device_json_data.device_ID, post_device_json_data.device_Name);
                                
                                switch(post_device_json_data.device_type)
                                {
                                    case "Hue Bridge":
                                        await hue_bridge_device_api.Hue_Bridge_Device_Change_Name(username, post_device_json_data.device_ID, post_device_json_data.device_Name);
                                        break;
                                }
                            }
                            break;
                        case "Remove One Device":
                            if(post_device_json_data.device_ID!=null){
                                await device_mgr.Remove_Device(mapped_device_type, username, post_device_json_data.device_ID);
                                
                                switch(post_device_json_data.device_type)
                                {
                                    case "Hue Bridge":
                                        await hue_bridge_device_api.Hue_Bridge_Remove_Device(username, post_device_json_data.device_ID);
                                        break;
                                }
                            }
                            break;
                    }
                }
            }
        }
        catch(e)
        {
            debug('[Devices_WebSocket] Process_Devices_WebSocket_GET_Message() Error ' + e);
        }
    }

    self.Process_Devices_Topic_WebSocket_GET_Message = async function(username, get_device_json_data)
    {
        try{
            var rsp_json = null;
            var mapped_device_type = null
            if(get_device_json_data.device_type!=null){
                
                if(get_device_json_data.command!=null){
                    switch(get_device_json_data.command){
                        case "Get All Device List":
                            rsp_json = await device_mgr.Get_Device_List_Specific_User(get_device_json_data.device_type, username);
                            break;
                        case "Get Device Info":
                            if(get_device_json_data.device_ID!=null){
                                rsp_json = await device_mgr.Read_Device_Inf(mapped_device_type, username, get_device_json_data.device_ID);
                            }
                            break;
                        case "Get Device Num Of Node":
                            if(get_device_json_data.device_ID!=null){
                                rsp_json = await device_mgmt_api.Device_MGMT_Get_Device_Num_Of_Node(mapped_device_type, get_device_json_data.device_ID);
                            }
                            break;
                        case "Get Device Support Attributes":
                            if(get_device_json_data.device_ID!=null){
                                rsp_json = await device_mgmt_api.Get_Device_Support_Attributes(mapped_device_type, get_device_json_data.device_ID);
                            }
                            break;
                    }
                }
            }
            return rsp_json;
        }
        catch(e)
        {
            debug('[Devices_WebSocket] Process_Devices_WebSocket_GET_Message() Error ' + e);
        }
    }
}
module.exports = Devices_WebSocket;
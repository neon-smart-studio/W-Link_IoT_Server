
var debug = require('debug')(require('path').basename(__filename));

var Device_MGMT_API = require('../../Device_MGMT/Device_MGMT_API.js');
var device_mgmt_api = new Device_MGMT_API();

var Device_MGR = require('../../Util/Device_MGR.js');
var device_mgr = new Device_MGR();

var Address_MGR = require('../../Util/Address_MGR.js');
var address_mgr = new Address_MGR();

var Device_API_Integrate = require('../../Integrate/Device_API_Integrate.js');
var device_api_integrate = new Device_API_Integrate();

var Devices_WebSocket = function (){
    var self = this;
    
    self.Process_Devices_Topic_WebSocket_POST_Message = async function(username, post_device_json_data)
    {
        try{
            if(post_device_json_data.device_type!=null){
                if(post_device_json_data.command!=null){
                    switch(post_device_json_data.command){
                        case "Device Change Name":
                            if(post_device_json_data.device_ID!=null && post_device_json_data.device_Name!=null){
                                var address_info = await address_mgr.Read_Address_Info(post_device_json_data.device_ID);
                                if(address_info.target_type!="Device")
                                {
                                    return;
                                }
                    
                                let integrate_device = false;
                                if(address_info.target_network=="TCP/IP")
                                {
                                    if(address_info.target_protocol!="MQTT")
                                    {
                                        integrate_device = true;
                                    }
                                }
                                
                                if(integrate_device)
                                {
                                    await device_api_integrate.Rename_Integrate_Device(address_info.target_network, address_info.target_protocol, username, post_device_json_data.device_ID, post_device_json_data.device_Name);
                                }
                                else
                                {
                                    await device_mgr.Device_Change_Name(post_device_json_data.device_type, username, post_device_json_data.device_ID, post_device_json_data.device_Name);
                                }
                            }
                            break;
                        case "Remove One Device":
                            if(post_device_json_data.device_ID!=null){
                                var address_info = await address_mgr.Read_Address_Info(post_device_json_data.device_ID);
                                if(address_info.target_type!="Device")
                                {
                                    return;
                                }
                                
                                let integrate_device = false;
                                if(address_info.target_network=="TCP/IP")
                                {
                                    if(address_info.target_protocol!="MQTT")
                                    {
                                        integrate_device = true;
                                    }
                                }
                                
                                if(integrate_device)
                                {
                                    await device_api_integrate.Remove_Integrate_Device(address_info.target_network, address_info.target_protocol, username, post_device_json_data.device_ID);
                                }
                                else
                                {
                                    await device_mgr.Remove_Device(post_device_json_data.device_type, username, post_device_json_data.device_ID);
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
            if(get_device_json_data.device_type!=null){
                
                if(get_device_json_data.command!=null){
                    switch(get_device_json_data.command){
                        case "Get All Device List":
                            switch(get_device_json_data.device_type)
                            {
                                case "Colored Light":
                                    let colored_light_dev_lst = await device_mgr.Get_Device_List_Specific_User("Colored Light", username);
                                    let ext_color_light_dev_lst = await device_mgr.Get_Device_List_Specific_User("Extended Color Light", username);
                                    let colored_light_dev_lst_array = [];
                                    if(colored_light_dev_lst!=null)
                                    {
                                        colored_light_dev_lst_array = colored_light_dev_lst.device_list;
                                    }
                                    let ext_color_light_dev_lst_array = [];
                                    if(ext_color_light_dev_lst!=null)
                                    {
                                        ext_color_light_dev_lst_array = ext_color_light_dev_lst.device_list;
                                    }
                                    rsp_json = {
                                        device_list: colored_light_dev_lst_array.concat(ext_color_light_dev_lst_array)
                                    }
                                    break;
                                case "Lighting":
                                    let all_onoff_light_dev_lst = await device_mgr.Get_Device_List_Specific_User("OnOff Light", username);
                                    let all_dimmable_light_dev_lst = await device_mgr.Get_Device_List_Specific_User("Dimmable Light", username);
                                    let all_colored_light_dev_lst = await device_mgr.Get_Device_List_Specific_User("Colored Light", username);
                                    let all_ext_color_light_dev_lst = await device_mgr.Get_Device_List_Specific_User("Extended Color Light", username);
                                    let all_color_temp_light_dev_lst = await device_mgr.Get_Device_List_Specific_User("Color Temperature Light", username);
                                    let all_onoff_light_dev_lst_array = [];
                                    if(all_onoff_light_dev_lst!=null)
                                    {
                                        all_onoff_light_dev_lst_array = all_onoff_light_dev_lst.device_list;
                                    }
                                    let all_dimmable_light_dev_lst_array = [];
                                    if(all_dimmable_light_dev_lst!=null)
                                    {
                                        all_dimmable_light_dev_lst_array = all_dimmable_light_dev_lst.device_list;
                                    }
                                    let all_colored_light_dev_lst_array = [];
                                    if(all_colored_light_dev_lst!=null)
                                    {
                                        all_colored_light_dev_lst_array = all_colored_light_dev_lst.device_list;
                                    }
                                    let all_ext_color_light_dev_lst_array = [];
                                    if(all_ext_color_light_dev_lst!=null)
                                    {
                                        all_ext_color_light_dev_lst_array = all_ext_color_light_dev_lst.device_list;
                                    }
                                    let all_color_temp_light_dev_lst_array = [];
                                    if(all_color_temp_light_dev_lst!=null)
                                    {
                                        all_color_temp_light_dev_lst_array = all_color_temp_light_dev_lst.device_list;
                                    }
                                    rsp_json = {
                                        device_list: all_onoff_light_dev_lst_array.concat(all_dimmable_light_dev_lst_array, all_colored_light_dev_lst_array, all_ext_color_light_dev_lst_array, all_color_temp_light_dev_lst_array)
                                    }
                                    break;
                                default:
                                    rsp_json = await device_mgr.Get_Device_List_Specific_User(get_device_json_data.device_type, username);
                                    break;
                            }
                            break;
                        case "Get Device Info":
                            if(get_device_json_data.device_ID!=null){
                                rsp_json = await device_mgr.Read_Device_Inf(get_device_json_data.device_type, username, get_device_json_data.device_ID);
                            }
                            break;
                        case "Get Device Num Of Node":
                            if(get_device_json_data.device_ID!=null){
                                rsp_json = await device_mgmt_api.Device_MGMT_Get_Device_Num_Of_Node(get_device_json_data.device_type, get_device_json_data.device_ID);
                            }
                            break;
                        case "Get Device Support Attributes":
                            if(get_device_json_data.device_ID!=null){
                                rsp_json = await device_mgmt_api.Get_Device_Support_Attributes(get_device_json_data.device_type, get_device_json_data.device_ID);
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
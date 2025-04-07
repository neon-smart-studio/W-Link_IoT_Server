
var debug = require('debug')(require('path').basename(__filename));

var Group_MGR = require('../../Util/Group_MGR.js');
var group_mgr = new Group_MGR();

var Groups_WebSocket = function (){
    var self = this;
    
    self.Process_Groups_Topic_WebSocket_POST_Message = async function(username, post_group_json_data)
    {
        try{
            if(post_group_json_data.device_type!=null){
                switch(post_group_json_data.device_type)
                {
                    //Lighting
                    case "On Off Light":
                    case "Dimmable Light":
                    case "Color Temperature Light":
                    case "Colored Light":
                    case "Extended Color Light":
                        post_group_json_data.device_type = "Lighting";
                        break;
                }
                
                if(post_group_json_data.command!=null){
                    switch(post_group_json_data.command){
                        case "Create New Group":
                            var device_ID_list = [];
                            if(post_group_json_data.device_ID_list!=null){
                                device_ID_list = post_group_json_data.device_ID_list;
                            }
                            if(post_group_json_data.group_Name!=null){
                                await group_mgr.Create_New_Group(post_group_json_data.device_type, username, 
                                                                post_group_json_data.group_Name, device_ID_list);
                            }
                            break;
                        case "Group Change Name":
                            if(post_group_json_data.group_ID!=null && post_group_json_data.new_group_Name!=null){
                                await group_mgr.Group_Change_Name(post_group_json_data.device_type, username, 
                                                                    post_group_json_data.group_ID, 
                                                                    post_group_json_data.new_group_Name);
                            }
                            break;
                        case "Remove One Group":
                            if(post_group_json_data.group_ID!=null){
                                await group_mgr.Remove_Group(post_group_json_data.device_type, username, 
                                                                post_group_json_data.group_ID);
                            }
                            break;
                        case "Add One Device to Group":
                            if(post_group_json_data.group_ID!=null && post_group_json_data.device_ID!=null){
                                await group_mgr.Add_Device_To_Group(post_group_json_data.device_type, username, 
                                                                    post_group_json_data.group_ID, 
                                                                    post_group_json_data.device_ID);
                            }
                            break;
                        case "Add Multiple Device to Group":
                            if(post_group_json_data.group_ID!=null && post_group_json_data.device_ID_list!=null){
                                await group_mgr.Add_Multiple_Device_To_Group(post_group_json_data.device_type, username, 
                                                                                post_group_json_data.group_ID, 
                                                                                post_group_json_data.device_ID_list);
                            }
                            break;
                        case "Remove One Device from Group":
                            if(post_group_json_data.group_ID!=null && post_group_json_data.device_ID!=null){
                                await group_mgr.Remove_Device_From_Group(post_group_json_data.device_type, username, 
                                                                            post_group_json_data.group_ID, 
                                                                            post_group_json_data.device_ID);
                            }
                            break;
                        case "Remove Multiple Device from Group":
                            if(post_group_json_data.group_ID!=null && post_group_json_data.device_ID_list!=null){
                                await group_mgr.Remove_Multiple_Device_From_Group(post_group_json_data.device_type, username, 
                                                                                    post_group_json_data.group_ID, 
                                                                                    post_group_json_data.device_ID_list);
                            }
                            break;
                        case "Edit Group Device List":
                            if(post_group_json_data.group_ID!=null && post_group_json_data.device_ID_list!=null){
                                await group_mgr.Edit_Group_Device_List(post_group_json_data.device_type, username, 
                                                                        post_group_json_data.group_ID, 
                                                                        post_group_json_data.device_ID_list);
                            }
                    }
                }
            }
        }
        catch(e)
        {
            debug('[Groups_WebSocket] Process_Groups_WebSocket_GET_Message() Error ' + e);
        }
    }

    self.Process_Groups_Topic_WebSocket_GET_Message = async function(username, get_group_json_data)
    {
        try{
            var rsp_json = null;
            if(get_group_json_data.device_type!=null){
                switch(get_group_json_data.device_type)
                {
                    //Lighting
                    case "On Off Light":
                    case "Dimmable Light":
                    case "Color Temperature Light":
                    case "Colored Light":
                    case "Extended Color Light":
                        get_group_json_data.device_type = "Lighting";
                        break;
                }
                
                if(get_group_json_data.command!=null){
                    switch(get_group_json_data.command){
                        case "Get All Group List":
                            rsp_json = await group_mgr.Get_Group_List(get_group_json_data.device_type, username);
                            break;
                        case "Get Group Info":
                            if(get_group_json_data.group_ID!=null){
                                rsp_json = await group_mgr.Get_Group_Info(get_group_json_data.device_type, username, 
                                                                            get_group_json_data.group_ID);
                            }
                            break;
                        case "Get Group Device List":
                            if(get_group_json_data.group_ID!=null){
                                rsp_json = await group_mgr.Get_Group_Device_List(get_group_json_data.device_type, username, 
                                                                                    get_group_json_data.group_ID);
                            }
                            break;
                    }
                }
            }
            return rsp_json;
        }
        catch(e)
        {
            debug('[Groups_WebSocket] Process_Groups_WebSocket_GET_Message() Error ' + e);
        }
    }
}
module.exports = Groups_WebSocket;

var debug = require('debug')(require('path').basename(__filename));

var Bind_MGR = require('../../Util/Bind_MGR.js');
var bind_mgr = new Bind_MGR();

var Bind_Unbind_WebSocket = function (){
    var self = this;
    
    self.Process_Bind_Unbind_Topic_WebSocket_POST_Message = async function(username, post_bind_unbind_json_data)
    {
        try{
            if(post_bind_unbind_json_data.command!=null){
                switch(post_bind_unbind_json_data.command){
                    case "Config Bind Action":
                        if(post_bind_unbind_json_data.source_device_type!=null &&
                            post_bind_unbind_json_data.source_device_ID!=null &&
                            post_bind_unbind_json_data.source_node_index!=null &&
                            post_bind_unbind_json_data.source_node_action!=null &&
                            post_bind_unbind_json_data.target_address_type!=null &&
                            post_bind_unbind_json_data.target_address_ID!=null &&
                            post_bind_unbind_json_data.target_action!=null)
                        {
                            var target_action = post_bind_unbind_json_data.target_action;
                            if(target_action.conditions!=null &&
                                target_action.command_topic!=null &&
                                target_action.command_type!=null &&
                                target_action.command!=null )
                            {
                                var endpoint = bind_mgr.Bind_Unbind_Resolve_Endpoint_Name(post_bind_unbind_json_data.source_node_index, post_bind_unbind_json_data.source_node_action);

                                await bind_mgr.Config_Bind_Action(post_bind_unbind_json_data.source_device_type, username, 
                                                                        post_bind_unbind_json_data.source_device_ID, endpoint, 
                                                                        post_bind_unbind_json_data.target_address_type, 
                                                                        post_bind_unbind_json_data.target_address_ID, target_action);
                            }
                        }
                        break;
                    case "Enable/Disable Bind Action":
                        if(post_bind_unbind_json_data.source_device_type!=null &&
                            post_bind_unbind_json_data.source_device_ID!=null &&
                            post_bind_unbind_json_data.source_node_index!=null &&
                            post_bind_unbind_json_data.source_node_action!=null &&
                            post_bind_unbind_json_data.enable!=null)
                        {
                            var endpoint = bind_mgr.Bind_Unbind_Resolve_Endpoint_Name(post_bind_unbind_json_data.source_node_index, post_bind_unbind_json_data.source_node_action);
                            
                            await bind_mgr.Enable_Disable_Bind_Action(post_bind_unbind_json_data.source_device_type, username, 
                                                                            post_bind_unbind_json_data.source_device_ID, endpoint, 
                                                                            post_bind_unbind_json_data.enable);
                        }
                        break;
                }
            }
        }
        catch(e)
        {
            debug('[Bind_Unbind_WebSocket] Process_Bind_Unbind_Topic_WebSocket_POST_Message() Error ' + e);
        }
    }

    self.Process_Bind_Unbind_Topic_WebSocket_GET_Message = async function(username, get_bind_unbind_json_data)
    {
        try{
            var rsp_json = null;
            if(get_bind_unbind_json_data.command!=null){
                switch(get_bind_unbind_json_data.command){
                    case "Get Bind Action Info":
                        if(get_bind_unbind_json_data.source_device_type!=null &&
                            get_bind_unbind_json_data.source_device_ID!=null && 
                            get_bind_unbind_json_data.source_node_index!=null &&
                            get_bind_unbind_json_data.source_node_action!=null){
                            var endpoint = bind_mgr.Bind_Unbind_Resolve_Endpoint_Name(get_bind_unbind_json_data.source_node_index, get_bind_unbind_json_data.source_node_action);

                            rsp_json = await bind_mgr.Get_Bind_Action_Info(get_bind_unbind_json_data.source_device_type, username, get_bind_unbind_json_data.source_device_ID, endpoint);
                        }
                        break;
                }
            }
            return rsp_json;
        }
        catch(e)
        {
            debug('[Bind_Unbind_WebSocket] Process_Bind_Unbind_Topic_WebSocket_GET_Message() Error ' + e);
        }
    }
}
module.exports = Bind_Unbind_WebSocket;
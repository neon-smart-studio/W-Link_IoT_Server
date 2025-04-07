
var debug = require('debug')(require('path').basename(__filename));

var Schedule_MGR = require('../../Util/Schedule_MGR.js');
var schedule_mgr = new Schedule_MGR();

var Schedule_WebSocket = function (){
    var self = this;
    
    self.Process_Schedule_Topic_WebSocket_POST_Message = async function(username, post_schedule_json_data)
    {
        try{
            if(post_schedule_json_data.device_type!=null){
                switch(post_schedule_json_data.device_type)
                {
                    //Lighting
                    case "On Off Light":
                    case "Dimmable Light":
                    case "Color Temperature Light":
                    case "Colored Light":
                    case "Extended Color Light":
                        post_schedule_json_data.device_type = "Lighting";
                        break;
                }
                
                if(post_schedule_json_data.command!=null){
                    switch(post_schedule_json_data.command){
                        case "Create New Schedule":
                            if(post_schedule_json_data.schedule_Name!=null &&
                                post_schedule_json_data.target_address_type!=null &&
                                post_schedule_json_data.target_address_ID!=null &&
                                post_schedule_json_data.execute_time!=null &&
                                post_schedule_json_data.repeat_mode!=null &&
                                post_schedule_json_data.schedule_action!=null){

                                    var execute_time = post_schedule_json_data.execute_time;
                                    var repeat_info = post_schedule_json_data.repeat_mode;
                                    var action_info = post_schedule_json_data.schedule_action;

                                    if(execute_time.hour!=null &&
                                        execute_time.min!=null &&
                                        execute_time.sec!=null &&
                                        repeat_info.mode!=null &&
                                        repeat_info.days!=null &&
                                        action_info.command_topic!=null &&
                                        action_info.command_type!=null &&
                                        action_info.command!=null &&
                                        action_info.schedule_action!=null){
                                            await schedule_mgr.Create_New_Schedule(post_schedule_json_data.device_type, username, 
                                                                                    post_schedule_json_data.schedule_Name, 
                                                                                    post_schedule_json_data.target_address_type, 
                                                                                    post_schedule_json_data.target_address_ID, 
                                                                                    post_schedule_json_data.execute_time, 
                                                                                    post_schedule_json_data.repeat_mode, 
                                                                                    post_schedule_json_data.schedule_action);
                                        }
                            }
                            break;
                        case "Edit Schedule":
                            if(post_schedule_json_data.schedule_ID!=null &&
                                post_schedule_json_data.new_schedule_Name!=null &&
                                post_schedule_json_data.target_address_type!=null &&
                                post_schedule_json_data.target_address_ID!=null &&
                                post_schedule_json_data.execute_time!=null &&
                                post_schedule_json_data.repeat_mode!=null &&
                                post_schedule_json_data.schedule_action!=null){

                                    var execute_time = post_schedule_json_data.execute_time;
                                    var repeat_info = post_schedule_json_data.repeat_mode;
                                    var action_info = post_schedule_json_data.schedule_action;

                                    if(execute_time.hour!=null &&
                                        execute_time.min!=null &&
                                        execute_time.sec!=null &&
                                        repeat_info.mode!=null &&
                                        repeat_info.days!=null &&
                                        action_info.command_topic!=null &&
                                        action_info.command_type!=null &&
                                        action_info.command!=null &&
                                        action_info.schedule_action!=null){
                                            await schedule_mgr.Edit_Schedule(post_schedule_json_data.device_type, username, 
                                                                                post_schedule_json_data.schedule_ID, 
                                                                                post_schedule_json_data.new_schedule_Name, 
                                                                                post_schedule_json_data.target_address_type, 
                                                                                post_schedule_json_data.target_address_ID, 
                                                                                post_schedule_json_data.execute_time, 
                                                                                post_schedule_json_data.repeat_mode, 
                                                                                post_schedule_json_data.schedule_action);
                                    }
                            }
                            break;
                        case "Schedule Change Name":
                            if(post_schedule_json_data.schedule_ID!=null &&
                                post_schedule_json_data.new_schedule_Name!=null)
                            {
                                await schedule_mgr.Schedule_Change_Name(post_schedule_json_data.device_type, username, 
                                                                        post_schedule_json_data.schedule_ID, 
                                                                        post_schedule_json_data.new_schedule_Name);
                            }
                            break;
                        case "Update Schedule Execute Time":
                            if(post_schedule_json_data.schedule_ID!=null &&
                                post_schedule_json_data.execute_time!=null)
                            {
                                var execute_time = post_schedule_json_data.execute_time;
                                if(execute_time.hour!=null &&
                                    execute_time.min!=null &&
                                    execute_time.sec!=null){
                                        await schedule_mgr.Update_Schedule_Execute_Time(post_schedule_json_data.device_type, username, 
                                                                                            post_schedule_json_data.schedule_ID,
                                                                                            post_schedule_json_data.execute_time);
                                }
                            }
                            break;
                        case "Update Schedule Repeat Info":
                            if(post_schedule_json_data.schedule_ID!=null &&
                                post_schedule_json_data.repeat_mode!=null)
                            {
                                await schedule_mgr.Update_Schedule_Repeat_Info(post_schedule_json_data.device_type, username, 
                                                                                post_schedule_json_data.schedule_ID,
                                                                                post_schedule_json_data.repeat_mode);
                            }
                            break;
                        case "Update Schedule Action":
                            if(post_schedule_json_data.schedule_ID!=null &&
                                post_schedule_json_data.schedule_action!=null)
                            {
                                await schedule_mgr.Update_Schedule_Action(post_schedule_json_data.device_type, username,
                                                                            post_schedule_json_data.schedule_ID,
                                                                            post_schedule_json_data.schedule_action);
                            }
                            break;
                        case "Enable/Disable Schedule":
                            if(post_schedule_json_data.schedule_ID!=null &&
                                post_schedule_json_data.enabled!=null)
                            {
                                await schedule_mgr.Enable_Disable_Schedule(post_schedule_json_data.device_type, username, 
                                                                            post_schedule_json_data.schedule_ID, 
                                                                            post_schedule_json_data.enabled);
                            }
                            break;
                        case "Delete Schedule":
                            if(post_schedule_json_data.schedule_ID!=null)
                            {
                                await schedule_mgr.Delete_Schedule(post_schedule_json_data.device_type, username, 
                                                                    post_schedule_json_data.schedule_ID);
                            }
                            break;
                    }
                }
            }
        }
        catch(e)
        {
            debug('[Schedule_WebSocket] Process_Schedule_WebSocket_GET_Message() Error ' + e);
        }
    }

    self.Process_Schedule_Topic_WebSocket_GET_Message = async function(username, get_schedule_json_data)
    {
        try{
            var rsp_json = null;

            if(get_schedule_json_data.device_type!=null){
                switch(get_schedule_json_data.device_type)
                {
                    //Lighting
                    case "On Off Light":
                    case "Dimmable Light":
                    case "Color Temperature Light":
                    case "Colored Light":
                    case "Extended Color Light":
                        get_schedule_json_data.device_type = "Lighting";
                        break;
                }
                
                if(get_schedule_json_data.command!=null){
                    switch(get_schedule_json_data.command){
                        case "Get Schedule List":
                            rsp_json = await schedule_mgr.Get_Schedule_List(get_schedule_json_data.device_type, username);
                            break;
                        case "Get Enabled Schedule List":
                            rsp_json = await schedule_mgr.Get_Enabled_Schedule_List(get_schedule_json_data.device_type, username);
                            break;
                        case "Get Schedule Info":
                            if(get_schedule_json_data.schedule_ID!=null){
                                rsp_json = await schedule_mgr.Get_Schedule_Info(get_schedule_json_data.device_type, username, get_schedule_json_data.schedule_ID);
                            }
                            break;
                        case "Get Schedule Execute Time":
                            if(get_schedule_json_data.schedule_ID!=null){
                                rsp_json = await schedule_mgr.Get_Schedule_Execute_Time(get_schedule_json_data.device_type, username, get_schedule_json_data.schedule_ID);
                            }
                            break;
                        case "Get Schedule Repeat Info":
                            if(get_schedule_json_data.schedule_ID!=null){
                                rsp_json = await schedule_mgr.Get_Schedule_Repeat_Info(get_schedule_json_data.device_type, username, get_schedule_json_data.schedule_ID);
                            }
                            break;
                        case "Get Schedule Action":
                            if(get_schedule_json_data.schedule_ID!=null){
                                rsp_json = await schedule_mgr.Get_Schedule_Action(get_schedule_json_data.device_type, username, get_schedule_json_data.schedule_ID);
                            }
                            break;
                    }
                }
            }

            return rsp_json;
        }
        catch(e)
        {
            debug('[Schedule_WebSocket] Process_Schedule_WebSocket_GET_Message() Error ' + e);
        }
    }
}
module.exports = Schedule_WebSocket;
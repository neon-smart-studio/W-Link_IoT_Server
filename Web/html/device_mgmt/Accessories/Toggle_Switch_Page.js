$('head').append('<link rel="stylesheet" type="text/css" href="../../css/circle-meter.css">');

var toggle_switch_individual_switch_info_list = null;

function Handle_Device_WebSocket_POST_Message(in_json)
{
    if(in_json.topic!=null){
        if(in_json.topic=='Accessories'){
            if(in_json.command_type!=null){
                switch(in_json.command_type){
                    case "Toggle Switch":
                        if(in_json.command!=null){
                            switch(in_json.command){
                                case "Report Toggle Switch Status Change":
                                    Update_Toggle_Switch_Status(in_json.device_ID, in_json);
                                    break;
                            }
                        }
                        break;
                }
            }
        }
    }
}

function Handle_Device_WebSocket_GET_Message(in_json)
{
    return null;
}

function Get_Device_Type_Chinese_Name(index)
{
    return "按鍵式開關";
}

function Print_Device_Management_Toolbar(print_info_dst_id)
{

}

function Print_Device_Operation_Toolbar(index, print_info_dst_id)
{

}

function Show_Device_Operation_Settings(index, print_info_dst_id, update_online_status_cb)
{
    GET_Toggle_Switch_All_Switch_Info(map_device_info_list[Number(index)].device_ID, function(rsp_json){
        var show_device_op_settings = [];
        
        if(rsp_json.timeout)
        {
            update_online_status_cb(false);
            return;
        }
        update_online_status_cb(true);

        toggle_switch_individual_switch_info_list = rsp_json.switch_info_list;

        show_device_op_settings.push("<div class=\"row\">");
        show_device_op_settings.push("<h2 class=\"fg-grayBlue\">按鍵狀態:</h2>");
        show_device_op_settings.push("</div>");

        for(var i = 0; i<rsp_json.num_of_toggle_switch; i++){
            show_device_op_settings.push("<div class=\"row\">");
            show_device_op_settings.push("<h3 class=\"fg-grayBlue\">按鍵"+(i+1)+"狀態</h3>");
            show_device_op_settings.push("</div>");
            
            show_device_op_settings.push("<div class=\"row\" style=\"display: block;\">");
            show_device_op_settings.push("<div class=\"h-100 p-6\">");
            show_device_op_settings.push("<div class=\"tiles-grid z-1\">");
            
            for(var j = 0; j<rsp_json.switch_info_list[i].support_actions.length; j++){
                var tile_id_str = "device_"+map_device_info_list[Number(index)].device_ID+"_toggle_switch_"+i+"_action_"+rsp_json.switch_info_list[i].support_actions[j]+"_tile";
                
                var mark_tile = false;
                var tile_color;
                if(rsp_json.switch_info_list[i].last_action!=null)
                {
                    if(rsp_json.switch_info_list[i].last_action==rsp_json.switch_info_list[i].support_actions[j])
                    {
                        mark_tile = true;
                    }
                }

                tile_color = "bg-grayBlue";
                if(mark_tile)
                {
                    tile_color = "bg-darkGrayBlue";
                }

                show_device_op_settings.push("<div data-role=\"tile\" data-size=\"medium\" class=\""+tile_color+" fg-white\" id=\""+tile_id_str+"\">");
                show_device_op_settings.push(Resolv_Toggle_Switch_Action_Icon(rsp_json.switch_info_list[i].support_actions[j]));
                show_device_op_settings.push("<span class=\"branding-bar\" style=\"font-size: 20px\">"+Resolv_Toggle_Switch_Action_Description(rsp_json.switch_info_list[i].support_actions[j])+"</span>");
                show_device_op_settings.push("</div>");
            }

            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
        }

        $('#'+print_info_dst_id).html('');
        $('#'+print_info_dst_id).html(show_device_op_settings.join(''));
    });

}

function Update_Toggle_Switch_Status(device_ID, json_rsp_dat)
{
    var dev_index = Find_Device_Index_By_ID(device_ID);
    if(dev_index<0)
    {
        return;
    }

    for(var i = 0; i<json_rsp_dat.num_of_toggle_switch; i++){
        var tile_id_str = "";
        if(toggle_switch_individual_switch_info_list!=null)
        {
            var switch_support_actions = toggle_switch_individual_switch_info_list[i].support_actions;
            for(var j = 0; j<switch_support_actions.length; j++){
                tile_id_str = "device_"+device_ID+"_toggle_switch_"+i+"_action_"+switch_support_actions[j]+"_tile";
                do_UnMark_Action_Tile(tile_id_str, "bg-darkGrayBlue", "bg-grayBlue");
            }
        }
        tile_id_str = "device_"+device_ID+"_toggle_switch_"+i+"_action_"+json_rsp_dat.switch_status_list[i].action+"_tile";
        do_Mark_Action_Tile(tile_id_str, "bg-darkGrayBlue", "bg-grayBlue");
    }
}

function do_Mark_Action_Tile(tile_ID, mark_color, unmark_color)
{
    if($("#"+tile_ID).hasClass(unmark_color))
    {
        $("#"+tile_ID).removeClass(unmark_color);
    }
    if(!$("#"+tile_ID).hasClass(mark_color))
    {
        $("#"+tile_ID).addClass(mark_color);
    }
}

function do_UnMark_Action_Tile(tile_ID, mark_color, unmark_color)
{
    if($("#"+tile_ID).hasClass(mark_color))
    {
        $("#"+tile_ID).removeClass(mark_color);
    }
    if(!$("#"+tile_ID).hasClass(unmark_color))
    {
        $("#"+tile_ID).addClass(unmark_color);
    }
}

$('head').append('<link rel="stylesheet" type="text/css" href="../../css/circle-meter.css">');

function Handle_Device_WebSocket_POST_Message(in_json)
{
    if(in_json.topic!=null){
        if(in_json.topic=='Accessories'){
            if(in_json.command_type!=null){
                switch(in_json.command_type){
                    case "OnOff Switch":
                        if(in_json.command!=null){
                            switch(in_json.command){
                                case "Report On Off Switch Status Change":
                                    Update_OnOff_Switch_Status(in_json.device_ID, in_json);
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
    return "普通開關";
}

function Print_Device_Management_Toolbar(print_info_dst_id)
{

}

function Print_Device_Operation_Toolbar(index, print_info_dst_id)
{

}

function Show_Device_Operation_Settings(index, print_info_dst_id, update_online_status_cb)
{
    GET_OnOff_Switch_All_Switch_Status(map_device_info_list[Number(index)].device_ID, function(rsp_json){
        var show_device_op_settings = [];
        
        if(rsp_json.timeout)
        {
            update_online_status_cb(false);
            return;
        }
        update_online_status_cb(true);

        show_device_op_settings.push("<div class=\"row\">");
        show_device_op_settings.push("<h2 class=\"fg-red\">開關狀態:</h2>");
        show_device_op_settings.push("</div>");

        for(var i = 0; i<rsp_json.num_of_onoff_switch; i++){
            show_device_op_settings.push("<div class=\"row\">");
            show_device_op_settings.push("<h3 class=\"fg-red\">開關"+(i+1)+"</h3>");
            show_device_op_settings.push("</div>");
            
            show_device_op_settings.push("<div class=\"row\">");
            show_device_op_settings.push("<div class=\"cell-12\">");
            show_device_op_settings.push("<div class=\"tiles-grid\">");

            show_device_op_settings.push("<div data-role=\"tile\" data-size=\"large\" class=\"bg-red fg-white\">");
            show_device_op_settings.push("<h2 style=\"margin-top: 10px; text-align: center;\">開啟/關閉狀態</h2>");
            show_device_op_settings.push("<div style=\"font-size: 25px;margin-top: 45px;\" id=\"current_onoff_switch_onoff_status_"+i+"\"/>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
        }

        $('#'+print_info_dst_id).html('');
        $('#'+print_info_dst_id).html(show_device_op_settings.join(''));

        Update_OnOff_Switch_Status(map_device_info_list[Number(index)].device_ID, rsp_json);
    });

}

function Update_OnOff_Switch_Status(device_ID, json_rsp_dat)
{
    var dev_index = Find_Device_Index_By_ID(device_ID);
    if(dev_index<0)
    {
        return;
    }

    for(var i = 0; i<json_rsp_dat.num_of_onoff_switch; i++){
        if(json_rsp_dat.switch_status_list[i].on_off)
        {
            $("#current_onoff_switch_onoff_status_"+i).html("<i class=\"mif-power mif-4x\" aria-hidden=\"true\"></i>");
        }
        else{
            $("#current_onoff_switch_onoff_status_"+i).html("<i class=\"mif-flash-off mif-4x\" aria-hidden=\"true\"></i>");
        }
    }
}

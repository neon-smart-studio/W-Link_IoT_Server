$('head').append('<link rel="stylesheet" type="text/css" href="../../css/circle-meter.css">');
$('head').append('<link rel="stylesheet" type="text/css" href="../../css/metro-toggle_sw.css">');
$('head').append('<link rel="stylesheet" type="text/css" href="../../css/range-slider.css">');
$('head').append('<link rel="stylesheet" type="text/css" href="../../css/device_mgmt/Environment/Blind_Curtain.css">');

var UI_is_updating = false;

function Handle_Device_WebSocket_POST_Message(in_json)
{
    if(in_json.topic!=null){
        if(in_json.topic=='Environment'){
            if(in_json.command_type!=null){
                switch(in_json.command_type){
                    case "Blind Curtain":
                        if(in_json.command!=null){
                            switch(in_json.command){
                                case "Report Blind Curtain Status Change":
                                    Update_Blind_Curtain_Status(in_json.device_ID, in_json);
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
    return "窗簾/捲簾";
}

function Print_Device_Management_Toolbar(print_info_dst_id)
{

}

function Print_Device_Operation_Toolbar(index, print_info_dst_id)
{

}

function Show_Device_Operation_Settings(index, print_info_dst_id, update_online_status_cb)
{
    GET_Blind_Curtain_All_Status(map_device_info_list[Number(index)].device_ID, function(rsp_json){
        var show_device_op_settings = [];
        
        show_device_op_settings.push("<div class=\"row\">");
        show_device_op_settings.push("<h2 class=\"fg-green\">窗簾狀態:</h2>");
        show_device_op_settings.push("</div>");

        show_device_op_settings.push("<div class=\"row\" style=\"margin-top: 20px\">");
        show_device_op_settings.push("<h3 class=\"fg-green\">指令</h3>");
        show_device_op_settings.push("</div>");

        show_device_op_settings.push("<div class=\"row\" style=\"margin-top: 20px\">");
        show_device_op_settings.push("<button data-role=\"hint\" data-hint-text=\"開啟\" class=\"button square large outline fg-green bd-green\" onclick=\"Blind_Curtain_Open_Close('"+map_device_info_list[Number(index)].device_ID+"', 'Open')\">");
        show_device_op_settings.push("<span class=\"mif-chevron-thin-up\"></span>");
        show_device_op_settings.push("</button>");
        show_device_op_settings.push("<button data-role=\"hint\" data-hint-text=\"關閉\" class=\"button square large outline fg-green bd-green\" onclick=\"Blind_Curtain_Open_Close('"+map_device_info_list[Number(index)].device_ID+"', 'Close')\">");
        show_device_op_settings.push("<span class=\"mif-chevron-thin-down\"></span>");
        show_device_op_settings.push("</button>");
        show_device_op_settings.push("<button data-role=\"hint\" data-hint-text=\"停止\" class=\"button square large outline fg-green bd-green\" onclick=\"Blind_Curtain_Stop_Moving('"+map_device_info_list[Number(index)].device_ID+"')\">");
        show_device_op_settings.push("<span class=\"mif-stop\"></span>");
        show_device_op_settings.push("</button>");
        show_device_op_settings.push("</div>");

        show_device_op_settings.push("<div class=\"row\" style=\"margin-top: 20px\">");
        show_device_op_settings.push("<h3 class=\"fg-green\">開闔調整</h3>");
        show_device_op_settings.push("</div>");

        show_device_op_settings.push("<div class=\"row\">");
        show_device_op_settings.push("<div class=\"range range-success\" style=\"width: 85%\">");
        show_device_op_settings.push("<input type=\"range\" name=\"range\" id=\"dev_"+index+"_sw_range_slider\" min=\"1\" max=\"100\" value=\"0\" onchange=\"$('#dev_"+index+"_sw_show_level').val(this.value); onClick_Blind_Curtain_Position_Slider('"+map_device_info_list[Number(index)].device_ID+"', this.id)\">");
        show_device_op_settings.push("<output id=\"dev_"+index+"_sw_show_level\">0</output>");
        show_device_op_settings.push("</div>");
        show_device_op_settings.push("</div>");
            
        $('#'+print_info_dst_id).html('');
        $('#'+print_info_dst_id).html(show_device_op_settings.join(''));

        if(rsp_json.timeout)
        {
            update_online_status_cb(false);
        }
        else
        {
            update_online_status_cb(true);
            Update_Blind_Curtain_Status(map_device_info_list[Number(index)].device_ID, rsp_json);
        }

    });

}

function Update_Blind_Curtain_Status(device_ID, json_rsp_dat)
{
    var dev_index = Find_Device_Index_By_ID(device_ID);
    if(dev_index<0)
    {
        return;
    }

    UI_is_updating = true;

    $("#dev_"+dev_index+"_sw_range_slider").val(json_rsp_dat.lift_percentage);
    $("#dev_"+dev_index+"_sw_show_level").val(json_rsp_dat.lift_percentage);

    UI_is_updating = false;
}

function onClick_Blind_Curtain_Position_Slider(device_ID, range_slider_id_str)
{
    if(UI_is_updating){return;}
    
    Blind_Curtain_Move_To_Position(device_ID, $('#'+range_slider_id_str).val());
}

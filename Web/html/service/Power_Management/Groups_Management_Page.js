$('head').append('<script type="text/javascript" src="../../js/iro.min.js"></script>');
$('head').append('<script type="text/javascript" src="../../js/cie_rgb_converter.js"></script>');

$('head').append('<link rel="stylesheet" type="text/css" href="../../css/metro-toggle_sw.css">');
$('head').append('<link rel="stylesheet" type="text/css" href="../../css/range-slider.css">');
$('head').append('<link rel="stylesheet" type="text/css" href="../../css/service/Power_Management/Power_Management.css">');

$('head').append('<script type="text/javascript" src="../../device_mgmt/ElectricPower/OnOff_Socket.js"></script>');
$('head').append('<script type="text/javascript" src="../../device_mgmt/ElectricPower/Dimmable_Socket.js"></script>');

function Handle_Get_Group_Operation_Toolbar_Info()
{
    var toolbar_list = [];
    //toolbar_list.push("<a href=\"#\"><span class=\"mif-plus icon\"></span></a>");
    return toolbar_list;
}

function Handle_Group_Device_Tile_Selected_Event(socket_ID)
{
}

function Handle_Group_Device_Tile_UnSelected_Event(socket_ID)
{
}

function Handle_Group_WebSocket_POST_Message(in_json)
{
    if(in_json.topic!=null){
        if(in_json.topic=='Power Management'){
            if(in_json.command_type!=null){
                switch(in_json.command_type){
                    case "Groups Management":
                        if(in_json.command!=null){
                        }
                        break;
                }
            }
        }
    }
}

function Handle_Group_WebSocket_GET_Message(in_json)
{
    return null;
}

function onClick_Socket_Group_OnOff_Switch(group_ID, toggle_switch_id_str)
{
    var on_off_flag = $("#"+toggle_switch_id_str).prop("checked");

    Turn_On_Off_All_OnOff_Socket(group_ID, on_off_flag);
    Turn_On_Off_All_Dimmable_Socket(group_ID, on_off_flag);
}

function onClick_Socket_Group_PWM_Slider(group_ID, range_slider_id_str)
{
    Set_All_Dimmable_Socket_PWM_Level(group_ID, $('#'+range_slider_id_str).val());
}

function Print_Group_Operation_Settings(index, print_dst_id)
{
    var show_group_op_settings = [];

    show_group_op_settings.push("<div class=\"row\">");
    show_group_op_settings.push("<h3 class=\"fg-grayBlue\">開啟/關閉</h3>");
    show_group_op_settings.push("</div>");

    show_group_op_settings.push("<div class=\"row\">");
    show_group_op_settings.push("<div class=\"onoffswitch socket_on_off_sw\" style=\"margin-left: 0px;\">");
    show_group_op_settings.push("<input type=\"checkbox\" name=\"onoffswitch\" class=\"onoffswitch-checkbox\" id=\"group_"+index+"_sw_on_off\" onclick=\"onClick_Socket_Group_OnOff_Switch('"+map_group_info_list[Number(index)].group_ID+"', this.id)\">");
    show_group_op_settings.push("<label class=\"onoffswitch-label\" for=\"group_"+index+"_sw_on_off\">");
    show_group_op_settings.push("<span class=\"onoffswitch-inner socket_on_off_sw_inner\"></span>");
    show_group_op_settings.push("<span class=\"onoffswitch-switch socket_on_off_sw-sw\"></span>");
    show_group_op_settings.push("</label>");
    show_group_op_settings.push("</div>");
    show_group_op_settings.push("</div>");
    show_group_op_settings.push("<br>");

    show_group_op_settings.push("<div class=\"row\">");
    show_group_op_settings.push("<h3 class=\"fg-grayBlue\">功率調整</h3>");
    show_group_op_settings.push("</div>");
    
    show_group_op_settings.push("<div class=\"row\">");
    show_group_op_settings.push("<div class=\"range range-primary\" style=\"width: 85%;margin-left: 0px;\">");
    show_group_op_settings.push("<input type=\"range\" name=\"range\" id=\"group_"+index+"_sw_range_slider\" min=\"1\" max=\"100\" value=\"0\" onchange=\"$('#dev_"+index+"_sw_show_level').val(this.value); onClick_Socket_Group_PWM_Slider('"+map_group_info_list[Number(index)].group_ID+"', this.id)\">");
    show_group_op_settings.push("<output id=\"group_"+index+"_sw_show_level\">0</output>");
    show_group_op_settings.push("</div>");
    show_group_op_settings.push("</div>");
    show_group_op_settings.push("<br>");
        
    $('#'+print_dst_id).html('');
    $('#'+print_dst_id).html(show_group_op_settings.join(''));
}
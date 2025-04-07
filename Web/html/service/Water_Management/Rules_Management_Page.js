
$('head').append('<link rel="stylesheet" type="text/css" href="../../css/metro-toggle_sw.css">');
$('head').append('<link rel="stylesheet" type="text/css" href="../../css/range-slider.css">');

$('head').append('<script type="text/javascript" src="../../device_mgmt/Water/Electromagnetic_Valve.js"></script>');
$('head').append('<script type="text/javascript" src="../../device_mgmt/Water/Pump_Motor.js"></script>');

function Handle_Get_Rule_Operation_Toolbar_Info()
{
    var toolbar_list = [];
    //toolbar_list.push("<a href=\"#\"><span class=\"mif-plus icon\"></span></a>");
    return toolbar_list;
}

function Handle_Rule_Source_Tile_Selected_Event(light_ID)
{
}

function Handle_Rule_Source_Tile_UnSelected_Event(light_ID)
{
}

function Handle_Rule_Target_Tile_Selected_Event(light_ID)
{
}

function Handle_Rule_Target_Tile_UnSelected_Event(light_ID)
{
}

function Handle_Rule_WebSocket_POST_Message(in_json)
{
    if(in_json.topic!=null){
        if(in_json.topic=='Water Management'){
            if(in_json.command_type!=null){
                switch(in_json.command_type){
                    case "Rules":
                        if(in_json.command!=null){
                        }
                        break;
                }
            }
        }
    }
}

function Handle_Rule_WebSocket_GET_Message(in_json)
{
    return null;
}

function Handle_Source_Address_ID_Changed(source_topic_type, index_str, address_ID)
{
    
}

function Handle_Target_Address_ID_Changed(target_address_type, target_topic_type, index_str, address_ID)
{
    
}

function Do_Check_Target_Topic_Match(target_topic_type)
{
    switch(target_topic_type)
    {
        case "Electromagnetic Valve":
        case "Pump Motor":
            return true;
    }
    return false;
}

function Get_Action_Settings_Info(compare_mode, target_address_type, target_topic_type, target_address_ID, index_str)
{
    var command = $('#rule_'+index_str+'_'+compare_mode+'_select_action').val();
    var param = null;

    switch(target_topic_type)
    {
        case "Electromagnetic Valve":
            switch(command)
            {
                case "Turn On Individual Electromagnetic Valve":
                    command = "Set Individual Switch On/Off State";
                    param = {
                        on_off: true,
                        socket_index: Get_Select_Target_Node_Btn_Index(index_str)
                    };
                    break;
                case "Turn Off Individual Electromagnetic Valve":
                    command = "Set Individual Switch On/Off State";
                    param = {
                        on_off: false,
                        socket_index: Get_Select_Target_Node_Btn_Index(index_str)
                    };
                    break;
                case "Turn On Main Electromagnetic Valve":
                    command = "Set Main Switch On/Off State";
                    param = {
                        on_off: true,
                        socket_index: Get_Select_Target_Node_Btn_Index(index_str)
                    };
                    break;
                case "Turn Off Main Electromagnetic Valve":
                    command = "Set Main Switch On/Off State";
                    param = {
                        on_off: false,
                        socket_index: Get_Select_Target_Node_Btn_Index(index_str)
                    };
                    break;
            }
            break;
        case "Pump Motor":
            switch(command)
            {
                case "Pump Motor Set PWM Level":
                    param = {
                        pwm_lvl: Math.round(($("#target_"+index_str+"_sw_range_slider").val())/100*255)
                    }
                    break;
            }
            break;
    }
    
    return {
        conditions: [],
        command_topic: "Water",
        command_type: target_topic_type,
        command: command,
        param: param
    };
}

function Print_Action_Settings_Info(add_rule, compare_mode, index_str, target_topic_type)
{
    var print_settings_info = [];

    var command = $('#rule_'+index_str+'_'+compare_mode+'_select_action').val();

    $('#rule_'+index_str+'_'+compare_mode+'_target_action_settings').html('');

    switch(target_topic_type)
    {
        case "Electromagnetic Valve":
            switch(command)
            {
                case "Set Individual Switch On/Off State":
                    if(current_target_address_ID!=null)
                    {
                        GET_Electromagnetic_Valve_Num_Of_Switch(current_target_address_ID, function(rsp_json){
                            Print_Select_Target_Node_Index_Btn_List(index_str, rsp_json.num_of_electromagnetic_valve,
                                "選取電磁閥編號");
                        });
                    }
                    break;
            }
            break;
        case "Pump Motor":
            switch(command)
            {
                case "Pump Motor Set PWM Level":
                    print_settings_info.push("<h2 class=\"fg-emerald\">轉速調整</h2>");
                    print_settings_info.push("<div class=\"range range-primary\" style=\"width: 85%;margin-left: 0px;margin-bottom: 50px;\">");
                    print_settings_info.push("<input type=\"range\" name=\"range\" id=\"target_"+index_str+"_sw_range_slider\" min=\"1\" max=\"100\" value=\"0\" onchange=\"$('#target_"+index_str+"_sw_show_pwm_level').val(this.value);Print_Save_Settings_Btn('"+index_str+"')\">");
                    print_settings_info.push("<output id=\"target_"+index_str+"_sw_show_pwm_level\">0</output>");
                    print_settings_info.push("</div>");
                    $('#rule_'+index_str+'_'+compare_mode+'_target_action_settings').html(print_settings_info.join(''));
                    break;
            }
            break;
    }
}

function Show_Rule_Action_Settings(add_rule, compare_mode, target_address_type, target_topic_type, index_str, print_dst_id)
{
    var show_target_action_settings = [];

    show_target_action_settings.push("<div class=\"row\" style=\"width:100%;\">");
    show_target_action_settings.push("<div class=\"cell-8\">");
    show_target_action_settings.push("<h2 class=\"fg-darkCyan\">動作設定</h2>");
    show_target_action_settings.push("<select data-role=\"select\" data-filter=\"false\" data-drop-height=\"100px\" \
                                    id=\"rule_"+index_str+"_"+compare_mode+"_select_action\" \
                                    data-on-item-select=\"Print_Save_Settings_Btn('"+add_rule+"','"+index_str+"')\" \
                                    data-on-change=\"Print_Action_Settings_Info('"+add_rule+"','"+compare_mode+"','"+index_str+"','"+target_topic_type+"')\">");
    switch(target_topic_type)
    {
        case "Electromagnetic Valve":
            show_target_action_settings.push("<option value=\"Turn On Main Electromagnetic Valve\" data-template=\"<span class='mif-power icon'></span> $1\">電磁閥總開關開起</option>");
            show_target_action_settings.push("<option value=\"Turn Off Main Electromagnetic Valve\" data-template=\"<span class='mif-flash-off icon'></span> $1\">電磁閥總開關關閉</option>");
            show_target_action_settings.push("<option value=\"Turn On Individual Electromagnetic Valve\" data-template=\"<span class='mif-power icon'></span> $1\">開起單一電磁閥</option>");
            show_target_action_settings.push("<option value=\"Turn Off Individual Electromagnetic Valve\" data-template=\"<span class='mif-flash-off icon'></span> $1\">關閉單一電磁閥</option>");
            break;
        case "Pump Motor":
            show_target_action_settings.push("<option value=\"Turn On Pump Motor\" data-template=\"<span class='mif-power icon'></span> $1\">啟動</option>");
            show_target_action_settings.push("<option value=\"Turn Off Pump Motor\" data-template=\"<span class='mif-flash-off icon'></span> $1\">停止</option>");
            show_target_action_settings.push("<option value=\"Toggle Pump Motor On Off\" data-template=\"<span class='mif-contrast icon'></span> $1\">切換</option>");
            show_target_action_settings.push("<option value=\"Pump Motor Set PWM Level\" data-template=\"<span class='mif-flash-off icon'></span> $1\">調整轉速</option>");
            break;
    }
    show_target_action_settings.push("</select>");
    show_target_action_settings.push("</div>");
    show_target_action_settings.push("<div class=\"cell-4\"></div>");
    show_target_action_settings.push("</div>");

    show_target_action_settings.push("<div class=\"row\" style=\"width:100%;\">");
    show_target_action_settings.push("<div class=\"cell-12\" id=\"rule_"+index_str+"_"+compare_mode+"_target_action_settings\">");
    show_target_action_settings.push("</div>");
    show_target_action_settings.push("</div>");
    
    $('#'+print_dst_id).html('');
    $('#'+print_dst_id).html(show_target_action_settings.join(''));
}

function Handle_Update_Rule_Action_Settings_Info(compare_mode, target_address_type, target_topic_type, target_address_ID, index_str, info_json)
{
    $('#rule_'+index_str+'_'+compare_mode+'_select_action').val(info_json.command);

    var cmd_param = info_json.param;

    switch(target_topic_type)
    {
        case "Electromagnetic Valve":
            switch(info_json.command)
            {
                case "Set Individual Switch On/Off State":
                    Mark_Select_Target_Node_Btn(index_str, info_json.socket_index);
                    break;
            }
            break;
        case "Pump Motor":
            switch(info_json.command)
            {
                case "Pump Motor Set PWM Level":
                    $("#target_"+index_str+"_sw_range_slider").val(Math.round(cmd_param.pwm_lvl/255*100));
                    break;
            }
            break;
    }
}

function onClick_Select_Target_Node_Btn(index_str)
{
    Print_Save_Settings_Btn(index_str);
    Update_Bind_Action_Settings(index_str);
}

function Print_Select_Target_Node_Index_Btn_List(index_str, num_of_socket, title)
{
    var show_sockets_select_btns = [];
    show_sockets_select_btns.push("<h2 class=\"fg-darkMagenta\">"+title+"</h2>");
    show_sockets_select_btns.push("<div data-role=\"buttongroup\" id=\"target_"+index_str+"_node_list\" data-cls-active=\"bg-darkMagenta fg-white\">");
    for(var i = 0; i<num_of_socket; i++)
    {
        show_sockets_select_btns.push("<button class=\"button\" style=\"width: 50px;margin-bottom: 5px;text-align:center;margin-right: 10px\"\
                                        id=\"target_"+index_str+"_select_node_index_"+i+"\" onclick=\"Print_Save_Settings_Btn('"+index_str+"')\">"+i+"</button>");
    }
    show_sockets_select_btns.push("</div>");
    
    $('#target_'+index_str+"_select_node_index_btns_display_area").html('');
    $('#target_'+index_str+"_select_node_index_btns_display_area").html(show_sockets_select_btns.join(''));
}

function Disable_Select_Target_Node_Btn_Group(index_str)
{
    $("#target_"+index_str+"_node_list").addClass("disabled");
}

function Enable_Select_Target_Node_Btn_Group(index_str)
{
    $("#target_"+index_str+"_node_list").removeClass("disabled");
}

function Mark_Select_Target_Node_Btn(index_str, node_index)
{
    $("#target_"+index_str+"_select_node_index_"+node_index).addClass(".js-active");
}

function Get_Select_Target_Node_Btn_Index(index_str)
{
    var target_dev_node_index = null;
    var selected_btn_id = $('#target_'+index_str+'_node_list .js-active').attr("id");
    if(selected_btn_id==null){
        return null;
    }
    var btn_header_str = "target_"+index_str+"_select_node_index_";
    var btn_header_length = btn_header_str.length;
    var btn_header_start_idx = selected_btn_id.indexOf(btn_header_str);
    if(btn_header_start_idx>=0)
    {
        target_dev_node_index = Number(selected_btn_id.substring(btn_header_length));
    }
    if(target_dev_node_index==null)
    {
        return null;
    }
    return target_dev_node_index;
}
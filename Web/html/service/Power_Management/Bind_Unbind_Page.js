$('head').append('<script type="text/javascript" src="../../js/iro.min.js"></script>');
$('head').append('<script type="text/javascript" src="../../js/cie_rgb_converter.js"></script>');

$('head').append('<link rel="stylesheet" type="text/css" href="../../css/metro-toggle_sw.css">');
$('head').append('<link rel="stylesheet" type="text/css" href="../../css/range-slider.css">');

$('head').append('<script type="text/javascript" src="../../device_mgmt/ElectricPower/OnOff_Socket.js"></script>');
$('head').append('<script type="text/javascript" src="../../device_mgmt/ElectricPower/Dimmable_Socket.js"></script>');
$('head').append('<script type="text/javascript" src="../../device_mgmt/ElectricPower/Power_Meter.js"></script>');

var current_target_address_ID = null;

function Handle_Get_Bind_Unbind_Operation_Toolbar_Info()
{
    var toolbar_list = [];
    //toolbar_list.push("<a href=\"#\"><span class=\"mif-plus icon\"></span></a>");
    return toolbar_list;
}

function Handle_Bind_Unbind_Target_Tile_Selected_Event(address_ID)
{
}

function Handle_Bind_Unbind_Target_Tile_UnSelected_Event(address_ID)
{
}

function Handle_Bind_Unbind_WebSocket_POST_Message(in_json)
{
    if(in_json.topic!=null){
        if(in_json.topic=='Power Management'){
            if(in_json.command_type!=null){
                switch(in_json.command_type){
                    case "Bind Unbind":
                        if(in_json.command!=null){
                        }
                        break;
                }
            }
        }
    }
}

function Handle_Bind_Unbind_WebSocket_GET_Message(in_json)
{
    return null;
}

function Handle_Target_Address_ID_Changed(target_address_type, target_topic_type, index_str, address_ID)
{
    current_target_address_ID = address_ID;

    Print_Action_Settings_Info(target_address_type, target_topic_type, index_str);
}

function Do_Check_Target_Topic_Match(target_topic_type)
{
    switch(target_topic_type)
    {
        case "OnOff Socket":
        case "Dimmable Socket":
        case "Power Meter":
            return true;
    }
    return false;
}
/*
function Get_All_Device_List(target_topic_type, callback)
{
    switch(target_topic_type)
    {
        case "OnOff Socket":
            GET_OnOff_Socket_Device_List(callback);
            break;
        case "Dimmable Socket":
            GET_Dimmable_Socket_Device_List(callback);
            break;
        case "Power Meter":
            GET_Power_Meter_Device_List(callback);
            break;
    }
}

function Get_All_Group_List(target_topic_type, callback)
{
    switch(target_topic_type)
    {
        case "OnOff Socket":
            break;
        case "Dimmable Socket":
            break;
        case "Power Meter":
            break;
    }
}
*/
function Get_Action_Command_Topic(target_topic_type)
{
    return "Electrical";
}

function Get_Action_Settings_Info(target_address_type, target_topic_type, target_address_ID, index_str)
{
    var command = $('#select_bind_target_action_'+index_str).val();
    var param = null;

    switch(target_topic_type)
    {
        case "OnOff Socket":
            switch(command)
            {
                case "Turn On Individual OnOff Socket":
                case "Turn Off Individual OnOff Socket":
                case "Toggle Individual OnOff Socket":
                    param = {
                        socket_index: Get_Select_Target_Node_Btn_Index(index_str)
                    };
                    break;
            }
            break;
        case "Dimmable Socket":
            switch(command)
            {
                case "Individual Dimmable Socket Set Pwm Level":
                    param = {
                        socket_index: Get_Select_Target_Node_Btn_Index(index_str),
                        level: Math.round(($("#target_"+index_str+"_sw_range_slider").val())/100*255)
                    };
                    break;
                case "Turn On Individual Dimmable Socket":
                case "Turn Off Individual Dimmable Socket":
                case "Toggle Individual Dimmable Socket":
                    param = {
                        socket_index: Get_Select_Target_Node_Btn_Index(index_str)
                    };
                    break;
            }
            break;
        case "Power Meter":
            switch(command)
            {
                case "Turn On Individual Power Meter":
                case "Turn Off Individual Power Meter":
                case "Toggle Individual Power Meter":
                    param = {
                        meter_index: Get_Select_Target_Node_Btn_Index(index_str)
                    };
                    break;
            }
            break;
    }
    
    return {
        conditions: [],
        command_topic: "Electrical",
        command_type: target_topic_type,
        command: command,
        param: param
    };
}

function Print_Action_Settings_Info(target_address_type, target_topic_type, index_str)
{
    var print_settings_info = [];

    var command = $('#select_bind_target_action_'+index_str).val();

    $('#bind_target_action_settings_'+index_str).html('');
    $('#target_'+index_str+"_select_node_index_btns_display_area").html('');

    switch(target_topic_type)
    {
        case "OnOff Socket":
            switch(command)
            {
                case "Turn On Individual OnOff Socket":
                case "Turn Off Individual OnOff Socket":
                case "Toggle Individual OnOff Socket":
                    if(current_target_address_ID!=null)
                    {
                        GET_OnOff_Socket_Num_Of_Socket(current_target_address_ID, function(rsp_json){
                            Print_Select_Target_Node_Index_Btn_List(index_str, rsp_json.num_of_onoff_socket,
                                "選取插座編號");
                        });
                    }
                    break;
            }
            break;

        case "Dimmable Socket":
            switch(command)
            {
                case "Turn On Individual Dimmable Socket":
                case "Turn Off Individual Dimmable Socket":
                case "Toggle Individual Dimmable Socket":
                    if(current_target_address_ID!=null)
                    {
                        GET_Dimmable_Socket_Num_Of_Socket(current_target_address_ID, function(rsp_json){
                            Print_Select_Target_Node_Index_Btn_List(index_str, rsp_json.num_of_dimmable_socket,
                                "選取插座編號");
                        });
                    }
                    break;
                case "Individual Dimmable Socket Set Pwm Level":
                    if(current_target_address_ID!=null)
                    {
                        GET_Dimmable_Socket_Num_Of_Socket(current_target_address_ID, function(rsp_json){
                            Print_Select_Target_Node_Index_Btn_List(index_str, rsp_json.num_of_dimmable_socket,
                                "選取插座編號");
                        });
                    }
                case "All Dimmable Socket Set Pwm Level":
                    print_settings_info.push("<h2 class=\"fg-darkMagenta\">插座功率調整</h2>");
                    print_settings_info.push("<div class=\"range range-primary\" style=\"width: 85%;margin-left: 0px;margin-bottom: 50px;\">");
                    print_settings_info.push("<input type=\"range\" name=\"range\" id=\"target_"+index_str+"_sw_range_slider\" min=\"1\" max=\"100\" value=\"0\" onchange=\"$('#target_"+index_str+"_sw_show_level').val(this.value);Print_Save_Settings_Btn('"+index_str+"')\">");
                    print_settings_info.push("<output id=\"target_"+index_str+"_sw_show_level\">0</output>");
                    print_settings_info.push("</div>");
                    $('#bind_target_action_settings_'+index_str).html(print_settings_info.join(''));
                    break;
            }
            break;
        case "Power Meter":
            switch(command)
            {
                case "Turn On Individual Power Meter":
                case "Turn Off Individual Power Meter":
                case "Toggle Individual Power Meter":
                    if(current_target_address_ID!=null)
                    {
                        GET_Power_Meter_Num_Of_Meter(current_target_address_ID, function(rsp_json){
                            Print_Select_Target_Node_Index_Btn_List(index_str, rsp_json.num_of_power_meter,
                                "選取電力計編號");
                        });
                    }
                    break;
            }
            break;
    }
}

function Show_Bind_Unbind_Target_Action_Settings(target_address_type, target_topic_type, index_str, print_dst_id)
{
    var show_target_action_settings = [];

    show_target_action_settings.push("<div class=\"row\" style=\"width:100%;\">");
    show_target_action_settings.push("<div class=\"cell-6\">");
    show_target_action_settings.push("<h2 class=\"fg-darkMagenta\">動作設定</h2>");
    show_target_action_settings.push("<select data-role=\"select\" data-filter=\"false\" data-drop-height=\"100px\" id=\"select_bind_target_action_"+index_str+"\" data-on-item-select=\"Print_Save_Settings_Btn('"+index_str+"')\" data-on-change=\"Print_Action_Settings_Info('"+target_address_type+"', '"+target_topic_type+"', '"+index_str+"')\">");
    
    switch(target_topic_type)
    {
        case "OnOff Socket":
            show_target_action_settings.push("<option value=\"Turn On All OnOff Socket\" data-template=\"<span class='mif-power icon'></span> $1\">開啟全部插座</option>");
            show_target_action_settings.push("<option value=\"Turn Off All OnOff Socket\" data-template=\"<span class='mif-flash-off icon'></span> $1\">關閉全部插座</option>");
            show_target_action_settings.push("<option value=\"Toggle All OnOff Socket\" data-template=\"<span class='mif-contrast icon'></span> $1\">切換全部插座</option>");
            if(target_address_type=="Device")
            {
                show_target_action_settings.push("<option value=\"Turn On Individual OnOff Socket\" data-template=\"<span class='mif-power icon'></span> $1\">開啟一個插座</option>");
                show_target_action_settings.push("<option value=\"Turn Off Individual OnOff Socket\" data-template=\"<span class='mif-flash-off icon'></span> $1\">關閉一個插座</option>");
                show_target_action_settings.push("<option value=\"Toggle Individual OnOff Socket\" data-template=\"<span class='mif-contrast icon'></span> $1\">切換一個插座</option>");
            }
            break;
        case "Dimmable Socket":
            show_target_action_settings.push("<option value=\"Turn On All Dimmable Socket\" data-template=\"<span class='mif-power icon'></span> $1\">開啟全部插座</option>");
            show_target_action_settings.push("<option value=\"Turn Off All Dimmable Socket\" data-template=\"<span class='mif-flash-off icon'></span> $1\">關閉全部插座</option>");
            show_target_action_settings.push("<option value=\"Toggle All Dimmable Socket\" data-template=\"<span class='mif-contrast icon'></span> $1\">切換全部插座</option>");
            show_target_action_settings.push("<option value=\"All Dimmable Socket Set Pwm Level\" data-template=\"<span class='mif-equalizer-v icon'></span> $1\">全部插座調整功率</option>");
            if(target_address_type=="Device")
            {
                show_target_action_settings.push("<option value=\"Turn On Individual Dimmable Socket\" data-template=\"<span class='mif-power icon'></span> $1\">開啟一個插座</option>");
                show_target_action_settings.push("<option value=\"Turn Off Individual Dimmable Socket\" data-template=\"<span class='mif-flash-off icon'></span> $1\">關閉一個插座</option>");
                show_target_action_settings.push("<option value=\"Toggle Individual Dimmable Socket\" data-template=\"<span class='mif-contrast icon'></span> $1\">切換一個插座</option>");
                show_target_action_settings.push("<option value=\"Individual Dimmable Socket Set Pwm Level\" data-template=\"<span class='mif-equalizer-v icon'></span> $1\">一個插座調整功率</option>");
            }
            break;
        case "Power Meter":
            show_target_action_settings.push("<option value=\"Turn On All Power Meter\" data-template=\"<span class='mif-power icon'></span> $1\">開啟全部電力計</option>");
            show_target_action_settings.push("<option value=\"Turn Off All Power Meter\" data-template=\"<span class='mif-flash-off icon'></span> $1\">關閉全部電力計</option>");
            show_target_action_settings.push("<option value=\"Toggle All Power Meter\" data-template=\"<span class='mif-contrast icon'></span> $1\">切換全部電力計</option>");
            if(target_address_type=="Device")
            {
                show_target_action_settings.push("<option value=\"Turn On Individual Power Meter\" data-template=\"<span class='mif-power icon'></span> $1\">開啟一個電力計</option>");
                show_target_action_settings.push("<option value=\"Turn Off Individual Power Metert\" data-template=\"<span class='mif-flash-off icon'></span> $1\">關閉一個電力計</option>");
                show_target_action_settings.push("<option value=\"Toggle Individual Power Metert\" data-template=\"<span class='mif-contrast icon'></span> $1\">切換一個電力計</option>");
            }
            break;
    }

    show_target_action_settings.push("</select>");
    show_target_action_settings.push("</div>");
    show_target_action_settings.push("<div class=\"cell-5 offset-1\">");
    show_target_action_settings.push("<div id=\"target_"+index_str+"_select_node_index_btns_display_area\"></div>");
    show_target_action_settings.push("</div>");
    show_target_action_settings.push("</div>");

    show_target_action_settings.push("<div class=\"row\" style=\"width:100%;\">");
    show_target_action_settings.push("<div class=\"cell-12\" id=\"bind_target_action_settings_"+index_str+"\">");
    show_target_action_settings.push("</div>");
    show_target_action_settings.push("</div>");
    
    $('#'+print_dst_id).html('');
    $('#'+print_dst_id).html(show_target_action_settings.join(''));
}

function Handle_Update_Bind_Action_Settings_Info(target_address_type, target_topic_type, target_address_ID, index_str, info_json)
{
    $('#select_bind_target_action_'+index_str).val(info_json.command);

    var cmd_param = info_json.param;

    $('#target_'+index_str+"_select_node_index_btns_display_area").html('');

    switch(target_topic_type)
    {
        case "OnOff Socket":
            switch(info_json.command)
            {
                case "Turn On Individual OnOff Socket":
                case "Turn Off Individual OnOff Socket":
                case "Toggle Individual OnOff Socket":
                    Mark_Select_Target_Node_Btn(index_str, info_json.socket_index);
                    break;
            }
            break;
        case "Dimmable Socket":
            switch(info_json.command)
            {
                case "All Dimmable Socket Set Pwm Level":
                    $("#target_"+index_str+"_sw_range_slider").val(Math.round(cmd_param.level/255*100));
                    break;

                case "Individual Dimmable Socket Set Pwm Level":
                    $("#target_"+index_str+"_sw_range_slider").val(Math.round(cmd_param.level/255*100));
                    Mark_Select_Target_Node_Btn(index_str, info_json.socket_index);
                    break;

                case "Turn On Individual Dimmable Socket":
                case "Turn Off Individual Dimmable Socket":
                case "Toggle Individual Dimmable Socket":
                    Mark_Select_Target_Node_Btn(index_str, info_json.socket_index);
                    break;
            }
            break;
        case "Power Meter":
            switch(info_json.command)
            {
                case "Turn On Individual Power Meter":
                case "Turn Off Individual Power Meter":
                case "Toggle Individual Power Meter":
                    Mark_Select_Target_Node_Btn(index_str, info_json.meter_index);
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
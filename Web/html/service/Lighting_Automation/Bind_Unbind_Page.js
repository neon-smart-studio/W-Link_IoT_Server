$('head').append('<script type="text/javascript" src="../../js/iro.min.js"></script>');
$('head').append('<script type="text/javascript" src="../../js/cie_rgb_converter.js"></script>');

$('head').append('<link rel="stylesheet" type="text/css" href="../../css/metro-toggle_sw.css">');
$('head').append('<link rel="stylesheet" type="text/css" href="../../css/range-slider.css">');
$('head').append('<link rel="stylesheet" type="text/css" href="../../css/device_mgmt/Lighting/Lighting.css">');

$('head').append('<script type="text/javascript" src="../../device_mgmt/Lighting/Lighting.js"></script>');

var tempSlider_current_color = null;
var colorPicker_current_color = null;

function Handle_Get_Bind_Unbind_Operation_Toolbar_Info()
{
    var toolbar_list = [];
    //toolbar_list.push("<a href=\"#\"><span class=\"mif-plus icon\"></span></a>");
    return toolbar_list;
}

function Handle_Bind_Unbind_Target_Tile_Selected_Event(light_ID)
{
    Lighting_Identify_With_Effect(light_ID, "OK");
}

function Handle_Bind_Unbind_Target_Tile_UnSelected_Event(light_ID)
{
    Lighting_Identify_With_Effect(light_ID, "Blink");
}

function Handle_Bind_Unbind_WebSocket_POST_Message(in_json)
{
    if(in_json.topic!=null){
        if(in_json.topic=='Lighting Automation'){
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
    
}

function Do_Check_Target_Topic_Match(target_topic_type)
{
    return true;
}
/*
function Get_All_Device_List(target_topic_type, callback)
{
    GET_All_Light_Device_List(callback);
}

function Get_All_Group_List(target_topic_type, callback)
{
    GET_Lighting_Group_List(function(rsp_json){
        map_group_info_list = [];
        
        for (var i = 0; i < rsp_json.group_list.length; i++) {
            map_group_info_list.push({
                "group_ID":rsp_json.group_list[i].group_ID,
                "group_Name":rsp_json.group_list[i].group_Name
            });
        }
        callback(rsp_json);
    });
}
*/
function Get_Action_Command_Topic(target_topic_type)
{
    return "Lighting";
}

function Get_Action_Settings_Info(target_address_type, target_topic_type, target_address_ID, index_str)
{
    var command = $('#select_bind_target_action_'+index_str).val();
    var command_type = "";
    var param = null;

    switch(command)
    {
        case "Turn On":
        case "Turn Off":
        case "Toggle":
            command_type = "On Off";
            break;
        case "Move To Level":
            command_type = "Level";
            param = {
                target_level: Math.round(($("#target_"+index_str+"_sw_range_slider").val())/100*255),
                trans_time: 1,
                with_on_off: false
            }
            break;
        case "Move To Color Temperature":
            command_type = "Color Temperature";
            param = {
                target_color_temperature: tempSlider_current_color.kelvin,
                trans_time: 1
            }
            break;
        case "Move To Color XY":
            command_type = "Colored";
            var selected_color = colorPicker_current_color;
            var cie = rgb_to_cie(selected_color.rgb.r, selected_color.rgb.g, selected_color.rgb.b);
            cie.color_x = cie[0];
            cie.color_y = cie[1];

            param = {
                target_X: cie.color_x,
                target_Y: cie.color_y,
                trans_time: 1
            }
            break;
    }
    
    return {
        conditions: [],
        command_topic: "Lighting",
        command_type: command_type,
        command: command,
        param: param
    };
}

function Print_Action_Settings_Info(index_str)
{
    var print_settings_info = [];

    var command = $('#select_bind_target_action_'+index_str).val();

    $('#bind_target_action_settings_'+index_str).html('');

    switch(command)
    {
        case "Move To Level":
            print_settings_info.push("<h2 class=\"fg-amber\">亮度調整</h2>");
            print_settings_info.push("<div class=\"range range-primary\" style=\"width: 85%;margin-left: 0px;margin-bottom: 50px;\">");
            print_settings_info.push("<input type=\"range\" name=\"range\" id=\"target_"+index_str+"_sw_range_slider\" min=\"1\" max=\"100\" value=\"0\" onchange=\"$('#target_"+index_str+"_sw_show_level').val(this.value);Print_Save_Settings_Btn('"+index_str+"')\">");
            print_settings_info.push("<output id=\"target_"+index_str+"_sw_show_level\">0</output>");
            print_settings_info.push("</div>");
            $('#bind_target_action_settings_'+index_str).html(print_settings_info.join(''));
            break;
        case "Move To Color Temperature":
            print_settings_info.push("<h2 class=\"fg-amber\">色溫調整</h2>");
            print_settings_info.push("<div style=\"width: 85%;margin-left: 0px;\">");
            print_settings_info.push("<div id=\"target_"+index_str+"_temp_slider\"></div>");
            print_settings_info.push("</div>");
            $('#bind_target_action_settings_'+index_str).html(print_settings_info.join(''));

            var cct_rgb = iro.Color.kelvinToRgb(2700);
            var show_cct_rgb = {r:0, g: 0, b:0};
            
            show_cct_rgb.r = cct_rgb.r;
            show_cct_rgb.g = cct_rgb.g;
            show_cct_rgb.b = cct_rgb.b;
        
            var tempSlider = new iro.ColorPicker("#target_"+index_str+"_temp_slider", {
                width: 600,
                color: "rgb("+show_cct_rgb.r+", "+show_cct_rgb.g+", "+show_cct_rgb.b+")",
                borderWidth: 1,
                borderColor: "#fff",
                layout: [
                    {
                    component: iro.ui.Slider,
                    options: {
                        sliderType: 'kelvin'
                    }
                    }
                ]
            });

            tempSlider.on("color:init", function(color){
                tempSlider_current_color = color;
            });
            tempSlider.on("input:end", function(color){
                tempSlider_current_color = color;
                Print_Save_Settings_Btn(index_str);
            });
            break;
        case "Move To Color XY":
            print_settings_info.push("<h2 class=\"fg-amber\">顏色調整</h2>");
            print_settings_info.push("<div style=\"width: 85%;margin-left: 7.5%;\">");
            print_settings_info.push("<div id=\"target_"+index_str+"_color_picker\"></div>");
            print_settings_info.push("</div>");
            $('#bind_target_action_settings_'+index_str).html(print_settings_info.join(''));
        
            var colorPicker = new iro.ColorPicker("#target_"+index_str+"_color_picker", {
                width: 400,
                color: "rgb(255,255,255)",
                borderWidth: 1,
                borderColor: "#fff",
                layout: [
                    {
                    component: iro.ui.Wheel,
                    options: {
                    }
                    }
                ]
            });

            colorPicker.on("color:init", function(color){
                colorPicker_current_color = color;
            });
            colorPicker.on("input:end", function(color){
                colorPicker_current_color = color;
                Print_Save_Settings_Btn(index_str);
            });
            break;
    }
}

function Show_Bind_Unbind_Target_Action_Settings(target_address_type, target_topic_type, index_str, print_dst_id)
{
    var show_target_action_settings = [];

    show_target_action_settings.push("<div class=\"row\" style=\"width:100%;\">");
    show_target_action_settings.push("<div class=\"cell-8\">");
    show_target_action_settings.push("<h2 class=\"fg-amber\">動作設定</h2>");
    show_target_action_settings.push("<select data-role=\"select\" data-filter=\"false\" data-drop-height=\"100px\" id=\"select_bind_target_action_"+index_str+"\" data-on-item-select=\"Print_Save_Settings_Btn('"+index_str+"')\" data-on-change=\"Print_Action_Settings_Info('"+index_str+"')\">");
    show_target_action_settings.push("<option value=\"Turn On\" data-template=\"<span class='mif-power icon'></span> $1\">開燈</option>");
    show_target_action_settings.push("<option value=\"Turn Off\" data-template=\"<span class='mif-flash-off icon'></span> $1\">關燈</option>");
    show_target_action_settings.push("<option value=\"Toggle\" data-template=\"<span class='mif-contrast icon'></span> $1\">切換</option>");
    show_target_action_settings.push("<option value=\"Move To Level\" data-template=\"<span class='mif-brightness icon'></span> $1\">改變亮度</option>");
    show_target_action_settings.push("<option value=\"Move To Color Temperature\" data-template=\"<span class='mif-lab icon'></span> $1\">改變色溫</option>");
    show_target_action_settings.push("<option value=\"Move To Color XY\" data-template=\"<span class='mif-lab icon'></span> $1\">改變顏色</option>");
    show_target_action_settings.push("</select>");
    show_target_action_settings.push("</div>");
    show_target_action_settings.push("<div class=\"cell-4\"></div>");
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

    switch(info_json.command)
    {
        case "Turn On":
        case "Turn Off":
        case "Toggle":
            break;
        case "Move To Level":
            $("#target_"+index_str+"_sw_range_slider").val(Math.round(cmd_param.target_level/255*100));
            break;
        case "Move To Color Temperature":
            break;
        case "Move To Color XY":
            break;
    }
    
}

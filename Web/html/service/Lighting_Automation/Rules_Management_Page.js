$('head').append('<script type="text/javascript" src="../../js/iro.min.js"></script>');
$('head').append('<script type="text/javascript" src="../../js/cie_rgb_converter.js"></script>');

$('head').append('<link rel="stylesheet" type="text/css" href="../../css/metro-toggle_sw.css">');
$('head').append('<link rel="stylesheet" type="text/css" href="../../css/range-slider.css">');
$('head').append('<link rel="stylesheet" type="text/css" href="../../css/device_mgmt/Lighting/Lighting.css">');

$('head').append('<script type="text/javascript" src="../../device_mgmt/Lighting/Lighting.js"></script>');

var tempSlider_current_color = null;
var colorPicker_current_color = null;

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
    Lighting_Identify_With_Effect(light_ID, "OK");
}

function Handle_Rule_Target_Tile_UnSelected_Event(light_ID)
{
    Lighting_Identify_With_Effect(light_ID, "Blink");
}

function Handle_Rule_WebSocket_POST_Message(in_json)
{
    if(in_json.topic!=null){
        if(in_json.topic=='Lighting Automation'){
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
    if(target_topic_type=="Lighting")
    {
        return true;
    }
    return false;
}

function Get_Action_Settings_Info(compare_mode, target_address_type, target_topic_type, target_address_ID, index_str)
{
    var command = $('#rule_'+index_str+'_'+compare_mode+'_select_action').val();
    var command_type = "";
    var param = null;

    switch(command)
    {
        case "Turn On":
        case "Turn Off":
            command_type = "On Off";
            break;
        case "Move To Level":
            command_type = "Level";
            param = {
                target_level: Math.round(($("#rule_"+index_str+"_"+compare_mode+"_target_level_slider").val())/100*255),
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

function Print_Action_Settings_Info(add_rule, compare_mode, index_str, target_topic_type)
{
    var print_settings_info = [];

    var command = $('#rule_'+index_str+'_'+compare_mode+'_select_action').val();

    $('#rule_'+index_str+'_'+compare_mode+'_target_action_settings').html('');

    switch(command)
    {
        case "Move To Level":
            print_settings_info.push("<h3 class=\"fg-amber\">亮度調整</h3>");
            print_settings_info.push("<div class=\"range range-primary\" style=\"width: 85%;margin-left: 0px;margin-bottom: 50px;\">");
            print_settings_info.push("<input type=\"range\" name=\"range\" \
                                        id=\"rule_"+index_str+"_"+compare_mode+"_target_level_slider\" min=\"1\" max=\"100\" value=\"0\" \
                                        onchange=\"$('#rule_"+index_str+"_"+compare_mode+"_target_slider_show_level').val(this.value); \
                                            Print_Save_Settings_Btn('"+add_rule+"','"+index_str+"')\">");
            print_settings_info.push("<output id=\"rule_"+index_str+"_"+compare_mode+"_target_slider_show_level\">0</output>");
            print_settings_info.push("</div>");
            $('#rule_'+index_str+'_'+compare_mode+'_target_action_settings').html(print_settings_info.join(''));
            break;
        case "Move To Color Temperature":
            print_settings_info.push("<h3 class=\"fg-amber\">色溫調整</h3>");
            print_settings_info.push("<div style=\"width: 85%;margin-left: 0px;\">");
            print_settings_info.push("<div id=\"rule_"+index_str+"_"+compare_mode+"_target_temp_slider\"></div>");
            print_settings_info.push("</div>");
            $('#rule_'+index_str+'_'+compare_mode+'_target_action_settings').html(print_settings_info.join(''));

            var cct_rgb = iro.Color.kelvinToRgb(2700);
            var show_cct_rgb = {r:0, g: 0, b:0};
            
            show_cct_rgb.r = cct_rgb.r;
            show_cct_rgb.g = cct_rgb.g;
            show_cct_rgb.b = cct_rgb.b;
        
            var tempSlider = new iro.ColorPicker("#rule_"+index_str+"_"+compare_mode+"_target_temp_slider", {
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
                Print_Save_Settings_Btn(add_rule, index_str);
            });
            break;
        case "Move To Color XY":
            print_settings_info.push("<h3 class=\"fg-amber\">顏色調整</h3>");
            print_settings_info.push("<div style=\"width: 85%;margin-left: 7.5%;\">");
            print_settings_info.push("<div id=\"rule_"+index_str+"_"+compare_mode+"_target_color_picker\"></div>");
            print_settings_info.push("</div>");
            $('#rule_'+index_str+'_'+compare_mode+'_target_action_settings').html(print_settings_info.join(''));
        
            var colorPicker = new iro.ColorPicker("#rule_"+index_str+"_"+compare_mode+"_target_color_picker", {
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
                Print_Save_Settings_Btn(add_rule, index_str);
            });
            break;
    }
}

function Show_Rule_Action_Settings(add_rule, compare_mode, target_address_type, target_topic_type, index_str, print_dst_id)
{
    var show_target_action_settings = [];

    show_target_action_settings.push("<div class=\"row\" style=\"width:100%;\">");
    show_target_action_settings.push("<div class=\"cell-8\">");
    show_target_action_settings.push("<select data-role=\"select\" data-filter=\"false\" data-drop-height=\"100px\" \
                                    id=\"rule_"+index_str+"_"+compare_mode+"_select_action\" \
                                    data-on-item-select=\"Print_Save_Settings_Btn('"+add_rule+"','"+index_str+"')\" \
                                    data-on-change=\"Print_Action_Settings_Info('"+add_rule+"','"+compare_mode+"','"+index_str+"', '"+target_topic_type+"')\">");
    show_target_action_settings.push("<option value=\"None\" data-template=\"<span class='mif-cancel icon'></span> $1\">不動作</option>");
    show_target_action_settings.push("<option value=\"Turn On\" data-template=\"<span class='mif-power icon'></span> $1\">開燈</option>");
    show_target_action_settings.push("<option value=\"Turn Off\" data-template=\"<span class='mif-flash-off icon'></span> $1\">關燈</option>");
    show_target_action_settings.push("<option value=\"Move To Level\" data-template=\"<span class='mif-brightness icon'></span> $1\">改變亮度</option>");
    show_target_action_settings.push("<option value=\"Move To Color Temperature\" data-template=\"<span class='mif-lab icon'></span> $1\">改變色溫</option>");
    show_target_action_settings.push("<option value=\"Move To Color XY\" data-template=\"<span class='mif-lab icon'></span> $1\">改變顏色</option>");
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

    switch(info_json.command)
    {
        case "Turn On":
        case "Turn Off":
            break;
        case "Move To Level":
            $("#rule_"+index_str+"_"+compare_mode+"_target_level_slider").val(Math.round(cmd_param.target_level/255*100));
            break;
        case "Move To Color Temperature":
            break;
        case "Move To Color XY":
            break;
    }
    
}

$('head').append('<script type="text/javascript" src="../../js/iro.min.js"></script>');
$('head').append('<script type="text/javascript" src="../../js/cie_rgb_converter.js"></script>');

$('head').append('<link rel="stylesheet" type="text/css" href="../../css/metro-toggle_sw.css">');
$('head').append('<link rel="stylesheet" type="text/css" href="../../css/range-slider.css">');
$('head').append('<link rel="stylesheet" type="text/css" href="../../css/service/Lighting_Automation/Lighting_Automation.css">');

$('head').append('<script type="text/javascript" src="../../device_mgmt/Lighting/Lighting.js"></script>');

function Handle_Get_Group_Operation_Toolbar_Info()
{
    var toolbar_list = [];
    //toolbar_list.push("<a href=\"#\"><span class=\"mif-plus icon\"></span></a>");
    return toolbar_list;
}

function Handle_Group_Device_Tile_Selected_Event(light_ID)
{
    Lighting_Identify_With_Effect(light_ID, "OK");
}

function Handle_Group_Device_Tile_UnSelected_Event(light_ID)
{
    Lighting_Identify_With_Effect(light_ID, "Blink");
}

function Handle_Group_WebSocket_POST_Message(in_json)
{
    if(in_json.topic!=null){
        if(in_json.topic=='Lighting Automation'){
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

function onClick_Light_Group_OnOff_Switch(group_ID, toggle_switch_id_str)
{
    var on_off_flag = $("#"+toggle_switch_id_str).prop("checked");
    if(on_off_flag){
        Lighting_On_Off_Tog(group_ID, 'Turn On');
    }
    else{
        Lighting_On_Off_Tog(group_ID, 'Turn Off');
    }
}

function onClick_Light_Group_PWM_Slider(group_ID, range_slider_id_str)
{
    Lighting_Move_To_Level(group_ID, $('#'+range_slider_id_str).val(), 1, false);
}

function Print_Group_Operation_Settings(index, print_dst_id)
{
    var show_group_op_settings = [];

    show_group_op_settings.push("<div class=\"row\">");
    show_group_op_settings.push("<h3 class=\"fg-orange\">開啟/關閉</h3>");
    show_group_op_settings.push("</div>");

    show_group_op_settings.push("<div class=\"row\">");
    show_group_op_settings.push("<div class=\"onoffswitch light_on_off_sw\" style=\"margin-left: 0px;\">");
    show_group_op_settings.push("<input type=\"checkbox\" name=\"onoffswitch\" class=\"onoffswitch-checkbox\" id=\"group_"+index+"_sw_on_off\" onclick=\"onClick_Light_Group_OnOff_Switch('"+map_group_info_list[Number(index)].group_ID+"', this.id)\">");
    show_group_op_settings.push("<label class=\"onoffswitch-label\" for=\"group_"+index+"_sw_on_off\">");
    show_group_op_settings.push("<span class=\"onoffswitch-inner light_on_off_sw_inner\"></span>");
    show_group_op_settings.push("<span class=\"onoffswitch-switch light_on_off_sw-sw\"></span>");
    show_group_op_settings.push("</label>");
    show_group_op_settings.push("</div>");
    show_group_op_settings.push("</div>");
    show_group_op_settings.push("<br>");

    show_group_op_settings.push("<div class=\"row\">");
    show_group_op_settings.push("<h3 class=\"fg-orange\">亮度調整</h3>");
    show_group_op_settings.push("</div>");
    
    show_group_op_settings.push("<div class=\"row\">");
    show_group_op_settings.push("<div class=\"range range-primary\" style=\"width: 85%;margin-left: 0px;\">");
    show_group_op_settings.push("<input type=\"range\" name=\"range\" id=\"group_"+index+"_sw_range_slider\" min=\"1\" max=\"100\" value=\"0\" onchange=\"$('#target_"+index+"_sw_show_level').val(this.value); onClick_Light_Group_PWM_Slider('"+map_group_info_list[Number(index)].group_ID+"', this.id)\">");
    show_group_op_settings.push("<output id=\"group_"+index+"_sw_show_level\">0</output>");
    show_group_op_settings.push("</div>");
    show_group_op_settings.push("</div>");
    show_group_op_settings.push("<br>");
        
    show_group_op_settings.push("<div class=\"row\">");
    show_group_op_settings.push("<h3 class=\"fg-orange\">色溫調整</h3>");
    show_group_op_settings.push("</div>");
    
    show_group_op_settings.push("<div class=\"row\">");
    show_group_op_settings.push("<div style=\"width: 85%;margin-left: 0px;\">");
    show_group_op_settings.push("<div id=\"group_"+index+"_temp_slider\"></div>");
    show_group_op_settings.push("</div>");
    show_group_op_settings.push("</div>");
    show_group_op_settings.push("<br>");
        
    show_group_op_settings.push("<div class=\"row\">");
    show_group_op_settings.push("<h3 class=\"fg-orange\">顏色調整</h3>");
    show_group_op_settings.push("<div style=\"width: 85%;margin-left: 7.5%;\">");
    show_group_op_settings.push("<div id=\"group_"+index+"_color_picker\"></div>");
    show_group_op_settings.push("</div>");
    show_group_op_settings.push("</div>");
    show_group_op_settings.push("<br>");
        
    $('#'+print_dst_id).html('');
    $('#'+print_dst_id).html(show_group_op_settings.join(''));
    
    var cct_rgb = iro.Color.kelvinToRgb(2700);
    var show_cct_rgb = {r:0, g: 0, b:0};
    
    show_cct_rgb.r = cct_rgb.r;
    show_cct_rgb.g = cct_rgb.g;
    show_cct_rgb.b = cct_rgb.b;

    var tempSlider = new iro.ColorPicker("#group_"+index+"_temp_slider", {
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
    tempSlider.on("input:end", function(color){
        Lighting_Move_To_Color_Temperature(map_group_info_list[Number(index)].group_ID, color.kelvin, 1);
    });

    var colorPicker = new iro.ColorPicker("#group_"+index+"_color_picker", {
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
    colorPicker.on("input:end", function(color){
        Lighting_Move_To_Hue_And_Saturation(map_group_info_list[Number(index)].group_ID, color.hsv.h, color.hsv.s, 1);
    });

}
$('head').append('<script type="text/javascript" src="../../js/iro.min.js"></script>');

$('head').append('<link rel="stylesheet" type="text/css" href="../../css/metro-toggle_sw.css">');
$('head').append('<link rel="stylesheet" type="text/css" href="../../css/range-slider.css">');
$('head').append('<link rel="stylesheet" type="text/css" href="../../css/device_mgmt/Lighting/Lighting.css">');

function Handle_Device_WebSocket_POST_Message(in_json)
{
    if(in_json.topic!=null){
        if(in_json.topic=='Lighting'){
            if(in_json.command_type!=null){
                switch(in_json.command_type){
                    case "On Off":
                        if(in_json.command!=null){
                            switch(in_json.command){
                                case "Report Light On Off Status Change":
                                    Update_Color_Temperature_Light_OnOff_Status(in_json.device_ID, in_json);
                                    break;
                            }
                        }
                        break;
                    case "Level":
                        if(in_json.command!=null){
                            switch(in_json.command){
                                case "Report Light Level Status Change":
                                    Update_Color_Temperature_Light_Level_Status(in_json.device_ID, in_json);
                                    break;
                            }
                        }
                        break;
                    case "Color Temperature":
                        if(in_json.command!=null){
                            switch(in_json.command){
                                case "Report Light Color Temperature Status Change":
                                    Update_Color_Temperature_Light_CCT_Status(in_json.device_ID, in_json);
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
    return "可調色溫燈泡";
}

function Print_Device_Management_Toolbar(print_info_dst_id)
{

}

function Print_Device_Operation_Toolbar(index, print_info_dst_id)
{

}

function Show_Device_Operation_Settings(index, print_info_dst_id, update_online_status_cb)
{
    GET_Light_All_Status(map_device_info_list[Number(index)].device_ID, function(status_json){
        if(status_json.timeout){ update_online_status_cb(false);  return; }

        update_online_status_cb(true);

        var show_device_op_settings = [];
        show_device_op_settings.push("<div class=\"row\">");
        show_device_op_settings.push("<h2 class=\"fg-orange\">燈泡狀態:</h2>");
        show_device_op_settings.push("</div>");

        show_device_op_settings.push("<div class=\"row\">");
        show_device_op_settings.push("<h3 class=\"fg-orange\">開啟/關閉</h3>");
        show_device_op_settings.push("</div>");

        show_device_op_settings.push("<div class=\"row\">");
        show_device_op_settings.push("<div class=\"onoffswitch light_on_off_sw\" style=\"margin-left: 0px;\">");
        show_device_op_settings.push("<input type=\"checkbox\" name=\"onoffswitch\" class=\"onoffswitch-checkbox\" id=\"dev_"+index+"_sw_on_off\" onclick=\"onClick_Color_Temperature_Light_OnOff_Switch('"+map_device_info_list[Number(index)].device_ID+"', this.id)\">");
        show_device_op_settings.push("<label class=\"onoffswitch-label\" for=\"dev_"+index+"_sw_on_off\">");
        show_device_op_settings.push("<span class=\"onoffswitch-inner light_on_off_sw_inner\"></span>");
        show_device_op_settings.push("<span class=\"onoffswitch-switch light_on_off_sw-sw\"></span>");
        show_device_op_settings.push("</label>");
        show_device_op_settings.push("</div>");
        show_device_op_settings.push("</div>");
        show_device_op_settings.push("<br>");

        show_device_op_settings.push("<div class=\"row\">");
        show_device_op_settings.push("<h3 class=\"fg-orange\">亮度調整</h3>");
        show_device_op_settings.push("</div>");
        
        show_device_op_settings.push("<div class=\"row\">");
        show_device_op_settings.push("<div class=\"range range-primary\" style=\"width: 85%;margin-left: 0px;\">");
        show_device_op_settings.push("<input type=\"range\" name=\"range\" id=\"dev_"+index+"_sw_range_slider\" min=\"1\" max=\"100\" value=\"0\" onchange=\"$('#dev_"+index+"_sw_show_level').val(this.value); onClick_Color_Temperature_Light_PWM_Slider('"+map_device_info_list[Number(index)].device_ID+"', this.id)\">");
        show_device_op_settings.push("<output id=\"dev_"+index+"_sw_show_level\">0</output>");
        show_device_op_settings.push("</div>");
        show_device_op_settings.push("</div>");
        show_device_op_settings.push("<br>");
            
        show_device_op_settings.push("<div class=\"row\">");
        show_device_op_settings.push("<h3 class=\"fg-orange\">色溫調整</h3>");
        show_device_op_settings.push("</div>");
        
        show_device_op_settings.push("<div class=\"row\">");
        show_device_op_settings.push("<div style=\"width: 85%;margin-left: 0px;\">");
        show_device_op_settings.push("<div id=\"dev_"+index+"_temp_slider\"></div>");
        show_device_op_settings.push("</div>");
        show_device_op_settings.push("</div>");
        show_device_op_settings.push("<br>");
        
        $('#'+print_info_dst_id).html('');
        $('#'+print_info_dst_id).html(show_device_op_settings.join(''));

        var cct_rgb = iro.Color.kelvinToRgb(status_json.color_temperature);
        var tempSlider = new iro.ColorPicker("#dev_"+index+"_temp_slider", {
            width: 600,
            color: "rgb("+cct_rgb.r+", "+cct_rgb.g+", "+cct_rgb.b+")",
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
            Lighting_Move_To_Color_Temperature(map_device_info_list[Number(index)].device_ID, color.kelvin, 1);
        });

        Update_Color_Temperature_Light_OnOff_Status(map_device_info_list[Number(index)].device_ID, status_json);
        Update_Color_Temperature_Light_Level_Status(map_device_info_list[Number(index)].device_ID, status_json);
    });
}

function Update_Color_Temperature_Light_OnOff_Status(device_ID, onoff_status_json)
{
    var dev_index = Find_Device_Index_By_ID(device_ID);
    if(dev_index<0)
    {
        return;
    }

    $("#dev_"+dev_index+"_sw_on_off").prop("checked", onoff_status_json.on_off);
}

function Update_Color_Temperature_Light_Level_Status(device_ID, level_status_json)
{
    var dev_index = Find_Device_Index_By_ID(device_ID);
    if(dev_index<0)
    {
        return;
    }

    var show_pwm_lvl = level_status_json.level;

    $("#dev_"+dev_index+"_sw_range_slider").val(show_pwm_lvl);
    $("#dev_"+dev_index+"_sw_show_level").val(show_pwm_lvl);
}

function Update_Color_Temperature_Light_CCT_Status(device_ID, cct_status_json)
{
    var dev_index = Find_Device_Index_By_ID(device_ID);
    if(dev_index<0)
    {
        return;
    }
    
    var cct_rgb = iro.Color.kelvinToRgb(cct_status_json.color_temperature);
    $("#dev_"+index+"_temp_slider").color.rgb = { r: cct_rgb.r, g: cct_rgb.g, b: cct_rgb.b };
}

function onClick_Color_Temperature_Light_OnOff_Switch(device_ID, toggle_switch_id_str)
{
    var on_off_flag = $("#"+toggle_switch_id_str).prop("checked");
    if(on_off_flag){
        Lighting_On_Off_Tog(device_ID, 'Turn On');
    }
    else{
        Lighting_On_Off_Tog(device_ID, 'Turn Off');
    }
}

function onClick_Color_Temperature_Light_PWM_Slider(device_ID, range_slider_id_str)
{
    Lighting_Move_To_Level(device_ID, $('#'+range_slider_id_str).val(), 1, false);
}

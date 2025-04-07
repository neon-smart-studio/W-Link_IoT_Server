$('head').append('<link rel="stylesheet" type="text/css" href="../../css/circle-meter.css">');
$('head').append('<link rel="stylesheet" type="text/css" href="../../css/metro-toggle_sw.css">');
$('head').append('<link rel="stylesheet" type="text/css" href="../../css/range-slider.css">');
$('head').append('<link rel="stylesheet" type="text/css" href="../../css/device_mgmt/ElectricPower/Dimmable_Socket.css">');

var UI_is_updating = false;

function Handle_Device_WebSocket_POST_Message(in_json)
{
    if(in_json.topic!=null){
        if(in_json.topic=='Electrical'){
            if(in_json.command_type!=null){
                switch(in_json.command_type){
                    case "Dimmable Socket":
                        if(in_json.command!=null){
                            switch(in_json.command){
                                case "Report Dimmable Socket Status Change":
                                    Update_Dimmable_Socket_Status(in_json.device_ID, in_json);
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
    return "調節式插座";
}

function Print_Device_Management_Toolbar(print_info_dst_id)
{

}

function Print_Device_Operation_Toolbar(index, print_info_dst_id)
{

}

function Show_Device_Operation_Settings(index, print_info_dst_id, update_online_status_cb)
{
    GET_Dimmable_Socket_All_Socket_Status(map_device_info_list[Number(index)].device_ID, function(rsp_json){
        var show_device_op_settings = [];
        
        if(rsp_json.timeout)
        {
            update_online_status_cb(false);
            return;
        }
        update_online_status_cb(true);

        if(rsp_json.environment_temperature!=null || rsp_json.environment_humidity!=null)
        {
            show_device_op_settings.push("<div class=\"row\">");
            show_device_op_settings.push("<h2 class=\"fg-red\">插座目前溫溼度:</h2>");
            show_device_op_settings.push("</div>");

            show_device_op_settings.push("<div class=\"row\">");
            show_device_op_settings.push("<div class=\"cell-12\">");
            show_device_op_settings.push("<div class=\"tiles-grid\">");

            if(rsp_json.environment_temperature!=null)
            {
                show_device_op_settings.push("<div data-role=\"tile\" data-size=\"large\" class=\"bg-red fg-white\">");
                show_device_op_settings.push("<h2 style=\"margin-top: 5px; text-align: center;\">目前溫度</h2>");
                show_device_op_settings.push("<div class=\"deneme_font_height\" style=\"margin-top: 15px;margin-left: 12%;\">");
                show_device_op_settings.push("<div class=\"de\">");
                show_device_op_settings.push("<div class=\"den\" id=\"dev_"+index+"_current_environment_temp_show_color\" style=\"background:gray;\">");
                show_device_op_settings.push("<div class=\"dene\">");
                show_device_op_settings.push("<div class=\"denem\">");
                show_device_op_settings.push("<div class=\"deneme deneme_font_align\">");
                show_device_op_settings.push("<div id=\"dev_"+index+"_current_environment_temp\"/>");
                show_device_op_settings.push("</div>");
                show_device_op_settings.push("</div>");
                show_device_op_settings.push("</div>");
                show_device_op_settings.push("</div>");
                show_device_op_settings.push("</div>");
                show_device_op_settings.push("</div>");
                show_device_op_settings.push("</div>");
            }
            
            if(rsp_json.environment_humidity!=null)
            {
                show_device_op_settings.push("<div data-role=\"tile\" data-size=\"large\" class=\"bg-red fg-white\">");
                show_device_op_settings.push("<h2 style=\"margin-top: 5px; text-align: center;\">目前濕度</h2>");
                show_device_op_settings.push("<div class=\"deneme_font_height\" style=\"margin-top: 15px;margin-left: 12%;\">");
                show_device_op_settings.push("<div class=\"de\">");
                show_device_op_settings.push("<div class=\"den\" id=\"dev_"+index+"_current_environment_humidity_show_color\" style=\"background:gray;\">");
                show_device_op_settings.push("<div class=\"dene\">");
                show_device_op_settings.push("<div class=\"denem\">");
                show_device_op_settings.push("<div class=\"deneme deneme_font_align\">");
                show_device_op_settings.push("<div id=\"dev_"+index+"_current_environment_humidity\"/>");
                show_device_op_settings.push("</div>");
                show_device_op_settings.push("</div>");
                show_device_op_settings.push("</div>");
                show_device_op_settings.push("</div>");
                show_device_op_settings.push("</div>");
                show_device_op_settings.push("</div>");
                show_device_op_settings.push("</div>");
            }
            
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
        }

        show_device_op_settings.push("<div class=\"row\">");
        show_device_op_settings.push("<h2 class=\"fg-red\">插座狀態:</h2>");
        show_device_op_settings.push("</div>");

        for(var i = 0; i<rsp_json.num_of_dimmable_socket; i++){
            show_device_op_settings.push("<div class=\"row\">");
            show_device_op_settings.push("<h3 class=\"fg-red\">插座"+(i+1)+"</h3>");
            show_device_op_settings.push("</div>");
            
            show_device_op_settings.push("<div class=\"row\">");
            show_device_op_settings.push("<div class=\"cell-12\">");
            show_device_op_settings.push("<div class=\"tiles-grid\">");

            show_device_op_settings.push("<div data-role=\"tile\" data-size=\"large\" class=\"bg-red fg-white\">");
            show_device_op_settings.push("<h2 style=\"margin-top: 10px; text-align: center;\">開啟/關閉</h2>");
            show_device_op_settings.push("<div class=\"onoffswitch socket_on_off_sw\" style=\"top: 10px; margin: 0px auto\">");
            show_device_op_settings.push("<input type=\"checkbox\" name=\"onoffswitch\" class=\"onoffswitch-checkbox\" id=\"dev_"+index+"_sw_"+i+"_on_off\" onclick=\"onClick_Dimmable_Socket_OnOff_Switch('"+map_device_info_list[Number(index)].device_ID+"', '"+i+"', this.id)\">");
            show_device_op_settings.push("<label class=\"onoffswitch-label\" for=\"dev_"+index+"_sw_"+i+"_on_off\">");
            show_device_op_settings.push("<span class=\"onoffswitch-inner socket_on_off_sw_inner\"></span>");
            show_device_op_settings.push("<span class=\"onoffswitch-switch socket_on_off_sw-sw\"></span>");
            show_device_op_settings.push("</label>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("<h2 style=\"margin-top: 40px; text-align: center;\">功率調整</h2>");
            show_device_op_settings.push("<div class=\"range range-warning\" style=\"width: 85%;margin-left: 7.5%;\">");
            show_device_op_settings.push("<input type=\"range\" name=\"range\" id=\"dev_"+index+"_sw_"+i+"_range_slider\" min=\"1\" max=\"100\" value=\"0\" onchange=\"$('#dev_"+index+"_sw_"+i+"_show_level').val(this.value); onClick_Dimmable_Socket_PWM_Slider('"+map_device_info_list[Number(index)].device_ID+"', '"+i+"', this.id)\">");
            show_device_op_settings.push("<output id=\"dev_"+index+"_sw_"+i+"_show_level\">0</output>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
        }

        $('#'+print_info_dst_id).html('');
        $('#'+print_info_dst_id).html(show_device_op_settings.join(''));

        Update_Dimmable_Socket_Status(map_device_info_list[Number(index)].device_ID, rsp_json);
    });

}

function Update_Dimmable_Socket_Status(device_ID, json_rsp_dat)
{
    var dev_index = Find_Device_Index_By_ID(device_ID);
    if(dev_index<0)
    {
        return;
    }

    var color;

    UI_is_updating = true;

    if(json_rsp_dat.environment_temperature!=null)
    {
        var current_temp = json_rsp_dat.environment_temperature;
        var current_temp_whole_part = Math.floor(current_temp);
        var current_temp_comma_part = Math.round((current_temp-current_temp_whole_part)*100);
        
        if($("dev_"+dev_index+"_current_environment_temp")!=null){
            show_current_temp = [];
            show_current_temp.push(current_temp_whole_part+"<span>."+current_temp_comma_part+"</span><strong>°</strong>");
            
            $("#dev_"+dev_index+"_current_environment_temp").html("");
            $("#dev_"+dev_index+"_current_environment_temp").html(show_current_temp.join(''));

            if(current_temp<0){
                color = "lightBlue";
            }
            else if(current_temp<=5){
                color = "blue";
            }
            else if(current_temp<=10){
                color = "cyan";
            }
            else if(current_temp<=15){
                color = "teal";
            }
            else if(current_temp<20){
                color = "lime";
            }
            else if(current_temp<26){
                color = "red";
            }
            else if(current_temp<30){
                color = "emerald";
            }
            else if(current_temp<35){
                color = "yellow";
            }
            else if(current_temp<=40){
                color = "orange";
            }
            else{
                color = "red";
            }

            if($("dev_"+dev_index+"_current_environment_temp_show_color")!=null){
                $("#dev_"+dev_index+"_current_environment_temp_show_color").removeAttr("class");
                $("#dev_"+dev_index+"_current_environment_temp_show_color").addClass('den bg-' + color);
            }
        }
    }
    if(json_rsp_dat.environment_humidity!=null)
    {
        var current_humidity = json_rsp_dat.environment_humidity;
        var current_humidity_whole_part = Math.floor(current_humidity);
        var current_humidity_comma_part = Math.round((current_humidity-current_humidity_whole_part)*100);

        if($("dev_"+dev_index+"_current_environment_humidity")!=null){
            show_current_humidity = [];
            show_current_humidity.push(current_humidity_whole_part+"<span>."+current_humidity_comma_part+"</span><strong style=\"left: 100px\">%</strong>");
            
            $("#dev_"+dev_index+"_current_environment_humidity").html("");
            $("#dev_"+dev_index+"_current_environment_humidity").html(show_current_humidity.join(''));
            
            if(current_humidity<21){
                color = "red";
            }
            else if(current_humidity<41){
                color = "orange";
            }
            else if(current_humidity<71){
                color = "lime";
            }
            else if(current_humidity<81){
                color = "teal";
            }
            else{
                color = "blue";
            }

            if($("dev_"+dev_index+"_current_environment_humidity_show_color")!=null){
                $("#dev_"+dev_index+"_current_environment_humidity_show_color").removeAttr("class");
                $("#dev_"+dev_index+"_current_environment_humidity_show_color").addClass('den bg-' + color);
            }
        }
    }
    
    for(var i = 0; i<json_rsp_dat.num_of_dimmable_socket; i++){
        socket_index = json_rsp_dat.socket_status_list[i].socket_index;
        
        $("#dev_"+dev_index+"_sw_"+socket_index+"_on_off").prop("checked", json_rsp_dat.socket_status_list[i].on_off);
        
        var show_pwm_lvl = Math.round(json_rsp_dat.socket_status_list[i].pwm_level/255*100);

        $("#dev_"+dev_index+"_sw_"+socket_index+"_range_slider").val(show_pwm_lvl);
        $("#dev_"+dev_index+"_sw_"+socket_index+"_show_level").val(show_pwm_lvl);
    }

    UI_is_updating = false;
}

function onClick_Dimmable_Socket_OnOff_Switch(device_ID, socket_index, toggle_switch_id_str)
{
    if(UI_is_updating){return;}
    
    var on_off_flag = $("#"+toggle_switch_id_str).prop("checked");
    if(on_off_flag){
        Turn_On_Off_Individual_Dimmable_Socket(device_ID, socket_index, 'On');
    }
    else{
        Turn_On_Off_Individual_Dimmable_Socket(device_ID, socket_index, 'Off');
    }
}

function onClick_Dimmable_Socket_PWM_Slider(device_ID, socket_index, range_slider_id_str)
{
    if(UI_is_updating){return;}
    
    Set_Individual_Dimmable_Socket_PWM_Level(device_ID, socket_index, Math.round($('#'+range_slider_id_str).val()/100*255));
}

$('head').append('<link rel="stylesheet" type="text/css" href="../../css/circle-meter.css">');
$('head').append('<link rel="stylesheet" type="text/css" href="../../css/metro-toggle_sw.css">');
$('head').append('<link rel="stylesheet" type="text/css" href="../../css/range-slider.css">');
$('head').append('<link rel="stylesheet" type="text/css" href="../../css/device_mgmt/Water/Pump_Motor.css">');

var UI_is_updating = false;

function Handle_Device_WebSocket_POST_Message(in_json)
{
    if(in_json.topic!=null){
        if(in_json.topic=='Water'){
            if(in_json.command_type!=null){
                switch(in_json.command_type){
                    case "Pump Motor":
                        if(in_json.command!=null){
                            switch(in_json.command){
                                case "Report Pump Motor Status Change":
                                    Update_Pump_Motor_Status(in_json.device_ID, in_json);
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
    return "抽水馬達";
}

function Print_Device_Management_Toolbar(print_info_dst_id)
{

}

function Print_Device_Operation_Toolbar(index, print_info_dst_id)
{

}

function Show_Device_Operation_Settings(index, print_info_dst_id, update_online_status_cb)
{
    GET_Pump_Motor_All_Status(map_device_info_list[Number(index)].device_ID, function(rsp_json){
        var show_device_op_settings = [];
        
        if(rsp_json.timeout)
        {
            update_online_status_cb(false);
            return;
        }
        update_online_status_cb(true);

        show_device_op_settings.push("<div class=\"row\">");
        show_device_op_settings.push("<h2 class=\"fg-blue\">馬達狀態:</h2>");
        show_device_op_settings.push("</div>");

        show_device_op_settings.push("<div class=\"row\" style=\"margin-top: 20px\">");
        show_device_op_settings.push("<h3 class=\"fg-blue\">開啟/關閉</h3>");
        show_device_op_settings.push("</div>");
        
        show_device_op_settings.push("<div class=\"row\">");
        show_device_op_settings.push("<div class=\"onoffswitch motor_on_off_sw\">");
        show_device_op_settings.push("<input type=\"checkbox\" name=\"onoffswitch\" class=\"onoffswitch-checkbox\" id=\"dev_"+index+"_sw_on_off\" onclick=\"onClick_Pump_Motor_OnOff_Switch('"+map_device_info_list[Number(index)].device_ID+"', this.id)\">");
        show_device_op_settings.push("<label class=\"onoffswitch-label\" for=\"dev_"+index+"_sw_on_off\">");
        show_device_op_settings.push("<span class=\"onoffswitch-inner motor_on_off_sw_inner\"></span>");
        show_device_op_settings.push("<span class=\"onoffswitch-switch motor_on_off_sw-sw\"></span>");
        show_device_op_settings.push("</label>");
        show_device_op_settings.push("</div>");
        show_device_op_settings.push("</div>");

        show_device_op_settings.push("<div class=\"row\" style=\"margin-top: 20px\">");
        show_device_op_settings.push("<h3 class=\"fg-blue\">抽水速度調整</h3>");
        show_device_op_settings.push("</div>");
        
        show_device_op_settings.push("<div class=\"row\">");
        show_device_op_settings.push("<div class=\"range range-primary\" style=\"width: 85%\">");
        show_device_op_settings.push("<input type=\"range\" name=\"range\" id=\"dev_"+index+"_sw_range_slider\" min=\"1\" max=\"100\" value=\"0\" onchange=\"$('#dev_"+index+"_sw_show_level').val(this.value); onClick_Pump_Motor_PWM_Slider('"+map_device_info_list[Number(index)].device_ID+"', this.id)\">");
        show_device_op_settings.push("<output id=\"dev_"+index+"_sw_show_level\">0</output>");
        show_device_op_settings.push("</div>");
        show_device_op_settings.push("</div>");
            
        $('#'+print_info_dst_id).html('');
        $('#'+print_info_dst_id).html(show_device_op_settings.join(''));

        Update_Pump_Motor_Status(map_device_info_list[Number(index)].device_ID, rsp_json);
    });

}

function Update_Pump_Motor_Status(device_ID, json_rsp_dat)
{
    var dev_index = Find_Device_Index_By_ID(device_ID);
    if(dev_index<0)
    {
        return;
    }

    UI_is_updating = true;

    $("#dev_"+dev_index+"_sw_on_off").prop("checked", json_rsp_dat.on_off);
    
    var show_pwm_lvl = Math.round(json_rsp_dat.pwm_level/255*100);

    $("#dev_"+dev_index+"_sw_range_slider").val(show_pwm_lvl);
    $("#dev_"+dev_index+"_sw_show_level").val(show_pwm_lvl);

    UI_is_updating = false;
}

function onClick_Pump_Motor_OnOff_Switch(device_ID, toggle_switch_id_str)
{
    if(UI_is_updating){return;}

    var on_off_flag = $("#"+toggle_switch_id_str).prop("checked");
    if(on_off_flag){
        Turn_On_Off_Pump_Motor(device_ID, 'On');
    }
    else{
        Turn_On_Off_Pump_Motor(device_ID, 'Off');
    }
}

function onClick_Pump_Motor_PWM_Slider(device_ID, range_slider_id_str)
{
    if(UI_is_updating){return;}

    Set_Pump_Motor_PWM_Level(device_ID, Math.round($('#'+range_slider_id_str).val()/100*255));
}

$('head').append('<link rel="stylesheet" type="text/css" href="../../css/circle-meter.css">');

$('style').append(".triangle{\
    width: 0;\
    height: 0;\
    border-style: solid;\
    border-width: 0 200px 346.4px 200px;\
    border-color: transparent transparent #e74c3c transparent;\
}");

var ui_is_updating = false;

function Handle_Device_WebSocket_POST_Message(in_json)
{
    if(in_json.topic!=null){
        if(in_json.topic=='Traffic'){
            if(in_json.command_type!=null){
                switch(in_json.command_type){
                    case "Road Sign":
                        if(in_json.command!=null){
                            switch(in_json.command){
                                case "Report Road Sign Status Change":
                                  Update_Road_Sign_Status(in_json.device_ID, in_json);
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
    return "路標";
}

function Print_Device_Management_Toolbar(print_info_dst_id)
{

}

function Print_Device_Operation_Toolbar(index, print_info_dst_id)
{

}

function onKeying_Speed_Limit_Config_Textfield(speed_limit_textfield_id, btn_id)
{
    var error = false;
    
    if($('#'+speed_limit_textfield_id).val()==""){
        error = true;
    }
    
    if(!error){
        $('#'+btn_id).prop('class', "button success");
        $('#'+btn_id).prop('disabled', false);
    }
    else{
        $('#'+btn_id).prop('class', "button alert");
        $('#'+btn_id).prop('disabled', true);
    }
    
    return error;
}

function onClick_Set_Speed_Limit_Btn(index, speed_limit_textfield_id)
{
    if(ui_is_updating){return;}
    
    var cfg_speed_limit = $('#'+speed_limit_textfield_id).val();
    if(cfg_speed_limit==null || cfg_speed_limit==""){
        return;
    }
    
    if(cfg_speed_limit>100){cfg_speed_limit = 100;}
    if(cfg_speed_limit<0){cfg_speed_limit = 0;}

    Road_Sign_Set_Max_Speed_Limit(map_device_info_list[Number(index)].device_ID, cfg_speed_limit);
}

function Print_Device_List_Toolbar(print_info_dst_id)
{

}

function Print_Device_Operation_Toolbar(index, print_info_dst_id)
{

}

function Show_Device_Operation_Settings(index, print_info_dst_id, update_online_status_cb)
{
    GET_Road_Sign_All_Status(map_device_info_list[Number(index)].device_ID, function(rsp_json){
        var show_device_op_settings = [];
            
        if(rsp_json.timeout)
        {
            update_online_status_cb(false);
            return;
        }
        update_online_status_cb(true);

        show_device_op_settings.push("<div class=\"row\">");
        show_device_op_settings.push("<h2 class=\"fg-darkOlive\">路標狀態:</h2>");
        show_device_op_settings.push("</div>");

        show_device_op_settings.push("<div class=\"row\">");

        show_device_op_settings.push("<div class=\"cell-6\">");
        show_device_op_settings.push("<h2 class=\"fg-darkOlive\">目前速度限制</h2>");
        show_device_op_settings.push("<div class=\"triangle\" style=\"margin-top: 40px\">");
        show_device_op_settings.push("<div class=\"de\" style=\"top: 115px;left: -120px;\">");
        show_device_op_settings.push("<div class=\"den bg-green\" id=\"current_alerting_light_state_"+index+"\">");
        show_device_op_settings.push("<div class=\"dene\">");
        show_device_op_settings.push("<div class=\"denem\">");
        show_device_op_settings.push("<div class=\"deneme\">");
        show_device_op_settings.push("<div style=\"margin-top: 28px;font-size: 60px;\" id=\"current_max_limit_speed_percentage_"+index+"\">");
        show_device_op_settings.push("</div>");
        show_device_op_settings.push("</div>");
        show_device_op_settings.push("</div>");
        show_device_op_settings.push("</div>");
        show_device_op_settings.push("</div>");
        show_device_op_settings.push("</div>");
        show_device_op_settings.push("</div>");
        show_device_op_settings.push("</div>");

        show_device_op_settings.push("<div class=\"cell-6\">");
        show_device_op_settings.push("<h2 class=\"fg-darkOlive\">速限設定</h2>");
        show_device_op_settings.push("<input type=\"text\" id=\"speed_limit_cfg_text_field_"+index+"\" class=\"form-control\" style=\"width: 250px;\" placeholder=\"%\" oninput=\"onKeying_Speed_Limit_Config_Textfield(this.id, 'speed_limit_cfg_btn_"+index+"')\"><br>");
        show_device_op_settings.push("<button class=\"button alert\" disabled=\"true\" id=\"speed_limit_cfg_btn_"+index+"\" onclick=\"onClick_Set_Speed_Limit_Btn("+index+", 'speed_limit_cfg_text_field_"+index+"')\">設定速限</button>");
        show_device_op_settings.push("</div>");

        show_device_op_settings.push("</div>");

        $('#'+print_info_dst_id).html('');
        $('#'+print_info_dst_id).html(show_device_op_settings.join(''));

        Update_Road_Sign_Status(map_device_info_list[Number(index)].device_ID, rsp_json);
    });
}

function Update_Road_Sign_Status(device_ID, json_rsp_dat)
{
    var dev_index = Find_Device_Index_By_ID(device_ID);
    if(dev_index<0)
    {
        return;
    }

    UI_is_updating = true;

    $('#current_max_limit_speed_percentage_'+dev_index).html("");
    $('#current_max_limit_speed_percentage_'+dev_index).html(json_rsp_dat.road_sign_max_speed_limit_percentage+"<strong style=\"left: 90px\">%</strong>");
    
    switch(json_rsp_dat.current_road_sign_alerting_state)
    {
      case "Emergency":
        $('#current_alerting_light_state_'+dev_index).attr('class', "den bg-red");
        break;
      case "Regular":
        $('#current_alerting_light_state_'+dev_index).attr('class', "den bg-green");
        break;
      case "Unknown":
        $('#current_alerting_light_state_'+dev_index).attr('class', "den bg-gray");
        break;
    }

    UI_is_updating = false;
}

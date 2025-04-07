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
                                    Update_OnOff_Light_OnOff_Status(in_json.device_ID, in_json);
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
    return "可開關燈泡";
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
        show_device_op_settings.push("<input type=\"checkbox\" name=\"onoffswitch\" class=\"onoffswitch-checkbox\" id=\"dev_"+index+"_sw_on_off\" onclick=\"onClick_OnOff_Light_OnOff_Switch('"+map_device_info_list[Number(index)].device_ID+"', this.id)\">");
        show_device_op_settings.push("<label class=\"onoffswitch-label\" for=\"dev_"+index+"_sw_on_off\">");
        show_device_op_settings.push("<span class=\"onoffswitch-inner light_on_off_sw_inner\"></span>");
        show_device_op_settings.push("<span class=\"onoffswitch-switch light_on_off_sw-sw\"></span>");
        show_device_op_settings.push("</label>");
        show_device_op_settings.push("</div>");
        show_device_op_settings.push("</div>");
        show_device_op_settings.push("<br>");

        $('#'+print_info_dst_id).html('');
        $('#'+print_info_dst_id).html(show_device_op_settings.join(''));

        Update_OnOff_Light_OnOff_Status(map_device_info_list[Number(index)].device_ID, status_json);
    });
}

function Update_OnOff_Light_OnOff_Status(device_ID, onoff_status_json)
{
    var dev_index = Find_Device_Index_By_ID(device_ID);
    if(dev_index<0)
    {
        return;
    }

    $("#dev_"+dev_index+"_sw_on_off").prop("checked", onoff_status_json.on_off);
}

function onClick_OnOff_Light_OnOff_Switch(device_ID, toggle_switch_id_str)
{
    var on_off_flag = $("#"+toggle_switch_id_str).prop("checked");
    if(on_off_flag){
        Lighting_On_Off_Tog(device_ID, 'Turn On');
    }
    else{
        Lighting_On_Off_Tog(device_ID, 'Turn Off');
    }
}

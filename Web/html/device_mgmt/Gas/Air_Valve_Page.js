$('head').append('<link rel="stylesheet" type="text/css" href="../../css/circle-meter.css">');
$('head').append('<link rel="stylesheet" type="text/css" href="../../css/metro-toggle_sw.css">');
$('head').append('<link rel="stylesheet" type="text/css" href="../../css/range-slider.css">');
$('head').append('<link rel="stylesheet" type="text/css" href="../../css/device_mgmt/Gas/Air_Valve.css">');

var UI_is_updating = false;

function Handle_Device_WebSocket_POST_Message(in_json)
{
    if(in_json.topic!=null){
        if(in_json.topic=='Gas'){
            if(in_json.command_type!=null){
                switch(in_json.command_type){
                    case "Air Valve":
                        if(in_json.command!=null){
                            switch(in_json.command){
                                case "Report Air Valve Status Change":
                                    Update_Air_Valve_Status(in_json.device_ID, in_json);
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
    return "氣閥門";
}

function Print_Device_Management_Toolbar(print_info_dst_id)
{

}

function Print_Device_Operation_Toolbar(index, print_info_dst_id)
{

}

function Show_Device_Operation_Settings(index, print_info_dst_id, update_online_status_cb)
{
    GET_Air_Valve_All_Switch_Status(map_device_info_list[Number(index)].device_ID, function(rsp_json){
        var show_device_op_settings = [];
        
        if(rsp_json.timeout)
        {
            update_online_status_cb(false);
            return;
        }
        update_online_status_cb(true);

        show_device_op_settings.push("<div class=\"row\">");
        show_device_op_settings.push("<h2 class=\"fg-indigo\">氣閥門狀態:</h2>");
        show_device_op_settings.push("</div>");

        show_device_op_settings.push("<div class=\"row\">");
        show_device_op_settings.push("<h3 class=\"fg-indigo\">氣閥門總開關:</h2>");
        show_device_op_settings.push("</div>");

        show_device_op_settings.push("<div class=\"row\">");
        show_device_op_settings.push("<div class=\"cell-5\">");
        show_device_op_settings.push("<h4 class=\"fg-indigo\" style=\"text-align: left;\">啟用/停用</h4>");
        show_device_op_settings.push("</div>");
        show_device_op_settings.push("<div class=\"cell-7\">");
        show_device_op_settings.push("<h4 class=\"fg-indigo\" style=\"text-align: left;\">開啟/關閉</h4>");
        show_device_op_settings.push("</div>");
        show_device_op_settings.push("</div>");

        show_device_op_settings.push("<div class=\"row\">");
        show_device_op_settings.push("<div class=\"cell-5\">");
        show_device_op_settings.push("<div class=\"onoffswitch air_valve_en_dis_main_sw\">");
        show_device_op_settings.push("<input type=\"checkbox\" name=\"onoffswitch\" class=\"onoffswitch-checkbox\" id=\"dev_"+index+"_main_sw_en_dis\" onclick=\"onClick_Air_Valve_Main_Switch_EnDis_Switch('"+map_device_info_list[Number(index)].device_ID+"', this.id)\">");
        show_device_op_settings.push("<label class=\"onoffswitch-label\" for=\"dev_"+index+"_main_sw_en_dis\">");
        show_device_op_settings.push("<span class=\"onoffswitch-inner air_valve_en_dis_main_sw_inner\"></span>");
        show_device_op_settings.push("<span class=\"onoffswitch-switch air_valve_en_dis_main_sw-sw\"></span>");
        show_device_op_settings.push("</label>");
        show_device_op_settings.push("</div>");
        show_device_op_settings.push("</div>");
        show_device_op_settings.push("<div class=\"cell-7\">");
        show_device_op_settings.push("<div class=\"onoffswitch air_valve_on_off_main_sw\">");
        show_device_op_settings.push("<input type=\"checkbox\" name=\"onoffswitch\" class=\"onoffswitch-checkbox\" id=\"dev_"+index+"_main_sw_on_off\" onclick=\"onClick_Air_Valve_Main_Switch_OnOff_Switch('"+map_device_info_list[Number(index)].device_ID+"', this.id)\">");
        show_device_op_settings.push("<label class=\"onoffswitch-label\" for=\"dev_"+index+"_main_sw_on_off\">");
        show_device_op_settings.push("<span class=\"onoffswitch-inner air_valve_on_off_main_sw_inner\"></span>");
        show_device_op_settings.push("<span class=\"onoffswitch-switch air_valve_on_off_main_sw-sw\"></span>");
        show_device_op_settings.push("</label>");
        show_device_op_settings.push("</div>");
        show_device_op_settings.push("</div>");
        show_device_op_settings.push("</div>");

        show_device_op_settings.push("<div class=\"row\">");
        show_device_op_settings.push("<h3 class=\"fg-indigo\" style=\"margin-top: 20px;\">個別控制:</h2>");
        show_device_op_settings.push("</div>");

        show_device_op_settings.push("<div class=\"row\">");
        show_device_op_settings.push("<div class=\"cell-12\">");
        show_device_op_settings.push("<div class=\"tiles-grid\">");

        for(var i = 0; i<rsp_json.individual_switch_status.length; i++){
            show_device_op_settings.push("<div data-role=\"tile\" data-size=\"large\" class=\"bg-indigo fg-white\">");
            show_device_op_settings.push("<h2 style=\"text-align: center;top: 10px\">氣閥門"+(i+1)+"</h2>");
            show_device_op_settings.push("<h3 style=\"margin-top: 10px; text-align: center;\">啟用/停用</h3>");
            show_device_op_settings.push("<div class=\"onoffswitch air_valve_en_dis_sw\" style=\"margin: 0px auto;\">");
            show_device_op_settings.push("<input type=\"checkbox\" name=\"onoffswitch\" class=\"onoffswitch-checkbox\" id=\"dev_"+index+"_sw_"+i+"_en_dis\" onclick=\"onClick_Air_Valve_Individual_Switch_EnDis_Switch('"+map_device_info_list[Number(index)].device_ID+"', '"+i+"', this.id)\">");
            show_device_op_settings.push("<label class=\"onoffswitch-label\" for=\"dev_"+index+"_sw_"+i+"_en_dis\">");
            show_device_op_settings.push("<span class=\"onoffswitch-inner air_valve_en_dis_sw_inner\"></span>");
            show_device_op_settings.push("<span class=\"onoffswitch-switch air_valve_en_dis_sw-sw\"></span>");
            show_device_op_settings.push("</label>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("<h3 style=\"margin-top: 10px; text-align: center;\">開啟/關閉</h3>");
            show_device_op_settings.push("<div class=\"onoffswitch air_valve_on_off_sw\" style=\"margin: 0px auto;\">");
            show_device_op_settings.push("<input type=\"checkbox\" name=\"onoffswitch\" class=\"onoffswitch-checkbox\" id=\"dev_"+index+"_sw_"+i+"_on_off\" onclick=\"onClick_Air_Valve_Individual_Switch_OnOff_Switch('"+map_device_info_list[Number(index)].device_ID+"', '"+i+"', this.id)\">");
            show_device_op_settings.push("<label class=\"onoffswitch-label\" for=\"dev_"+index+"_sw_"+i+"_on_off\">");
            show_device_op_settings.push("<span class=\"onoffswitch-inner air_valve_on_off_sw_inner\"></span>");
            show_device_op_settings.push("<span class=\"onoffswitch-switch air_valve_on_off_sw-sw\"></span>");
            show_device_op_settings.push("</label>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            
        }

        show_device_op_settings.push("</div>");
        show_device_op_settings.push("</div>");
        show_device_op_settings.push("</div>");
        
        $('#'+print_info_dst_id).html('');
        $('#'+print_info_dst_id).html(show_device_op_settings.join(''));

        Update_Air_Valve_Status(map_device_info_list[Number(index)].device_ID, rsp_json);
    });

}

function Update_Air_Valve_Status(device_ID, json_rsp_dat)
{
    var dev_index = Find_Device_Index_By_ID(device_ID);
    if(dev_index<0)
    {
        return;
    }

    UI_is_updating = true;

    $("#dev_"+dev_index+"_main_sw_en_dis").prop("checked", json_rsp_dat.main_switch_status.enabled);
    $("#dev_"+dev_index+"_main_sw_on_off").prop("checked", json_rsp_dat.main_switch_status.on_off);

    for(var i = 0; i<json_rsp_dat.individual_switch_status.length; i++){
        sw_index = json_rsp_dat.individual_switch_status[i].switch_index;
        
        $("#dev_"+dev_index+"_sw_"+sw_index+"_en_dis").prop("checked", json_rsp_dat.individual_switch_status[i].enabled);
        $("#dev_"+dev_index+"_sw_"+sw_index+"_on_off").prop("checked", json_rsp_dat.individual_switch_status[i].on_off);
    }

    UI_is_updating = false;
}

function onClick_Air_Valve_Main_Switch_EnDis_Switch(device_ID, toggle_switch_id_str)
{
    if(UI_is_updating){return;}

    var en_dis_flag = $("#"+toggle_switch_id_str).prop("checked");
    if(en_dis_flag){
        Enable_Disable_Air_Valve_Main_Switch(device_ID, 'Enable');
    }
    else{
        Enable_Disable_Air_Valve_Main_Switch(device_ID, 'Disable');
    }
}

function onClick_Air_Valve_Main_Switch_OnOff_Switch(device_ID, toggle_switch_id_str)
{
    if(UI_is_updating){return;}

    var on_off_flag = $("#"+toggle_switch_id_str).prop("checked");
    if(on_off_flag){
        Turn_On_Off_Air_Valve_Main_Switch(device_ID, 'On');
    }
    else{
        Turn_On_Off_Air_Valve_Main_Switch(device_ID, 'Off');
    }
}

function onClick_Air_Valve_Individual_Switch_EnDis_Switch(device_ID, sw_index, toggle_switch_id_str)
{
    if(UI_is_updating){return;}

    var en_dis_flag = $("#"+toggle_switch_id_str).prop("checked");
    if(en_dis_flag){
        Enable_Disable_Air_Valve_Individual_Switch(device_ID, sw_index, 'Enable');
    }
    else{
        Enable_Disable_Air_Valve_Individual_Switch(device_ID, sw_index, 'Disable');
    }
}

function onClick_Air_Valve_Individual_Switch_OnOff_Switch(device_ID, sw_index, toggle_switch_id_str)
{
    if(UI_is_updating){return;}

    var on_off_flag = $("#"+toggle_switch_id_str).prop("checked");
    if(on_off_flag){
        Turn_On_Off_Air_Valve_Individual_Switch(device_ID, sw_index, 'On');
    }
    else{
        Turn_On_Off_Air_Valve_Individual_Switch(device_ID, sw_index, 'Off');
    }
}

$('head').append('<link rel="stylesheet" type="text/css" href="../../css/circle-meter.css">');
$('head').append('<link rel="stylesheet" type="text/css" href="../../css/metro-toggle_sw.css">');
$('head').append('<link rel="stylesheet" type="text/css" href="../../css/range-slider.css">');
$('head').append('<link rel="stylesheet" type="text/css" href="../../css/device_mgmt/Water/Flow_Meter.css">');

var UI_is_updating = false;

function Handle_Device_WebSocket_POST_Message(in_json)
{
    if(in_json.topic!=null){
        if(in_json.topic=='Water'){
            if(in_json.command_type!=null){
                switch(in_json.command_type){
                    case "Flow Meter":
                        if(in_json.command!=null){
                            switch(in_json.command){
                                case "Report Flow Meter Current Measure":
                                    Update_Flow_Meter_Measure(in_json.device_ID, in_json);
                                    break;
                                case "Report Flow Meter Status Change":
                                    Update_Flow_Meter_Status(in_json.device_ID, in_json);
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
    return "流量計";
}

function Print_Device_Management_Toolbar(print_info_dst_id)
{

}

function Print_Device_Operation_Toolbar(index, print_info_dst_id)
{

}

function Show_Device_Operation_Settings(index, print_info_dst_id, update_online_status_cb)
{
    GET_Flow_Meter_All_Sensor_Status(map_device_info_list[Number(index)].device_ID, function(rsp_json){
        var show_device_op_settings = [];
        
        if(rsp_json.timeout)
        {
            update_online_status_cb(false);
            return;
        }
        update_online_status_cb(true);

        show_device_op_settings.push("<div class=\"row\">");
        show_device_op_settings.push("<h2 class=\"fg-blue\">流量計狀態:</h2>");
        show_device_op_settings.push("</div>");

        for(var i = 0; i<rsp_json.num_of_flow_meter; i++){
            show_device_op_settings.push("<div class=\"row\">");
            show_device_op_settings.push("<h3 class=\"fg-blue\">流量計"+(i+1)+"</h3>");
            show_device_op_settings.push("</div>");
            
            show_device_op_settings.push("<div class=\"row\">");
            show_device_op_settings.push("<div class=\"cell-12\">");
            show_device_op_settings.push("<div class=\"tiles-grid\">");

            show_device_op_settings.push("<div data-role=\"tile\" data-size=\"large\" class=\"bg-blue fg-white\">");
            show_device_op_settings.push("<h2 style=\"margin-top: 10px; text-align: center;\">啟用/停用</h2>");
            show_device_op_settings.push("<div class=\"onoffswitch meter_en_dis_sw\" style=\"margin: 0px auto\">");
            show_device_op_settings.push("<input type=\"checkbox\" name=\"onoffswitch\" class=\"onoffswitch-checkbox\" id=\"dev_"+index+"_meter_"+i+"_en_dis\" onclick=\"onClick_Flow_Meter_Individual_Sensor_EnDis_Switch('"+map_device_info_list[Number(index)].device_ID+"', '"+i+"', this.id)\">");
            show_device_op_settings.push("<label class=\"onoffswitch-label\" for=\"dev_"+index+"_meter_"+i+"_en_dis\">");
            show_device_op_settings.push("<span class=\"onoffswitch-inner meter_en_dis_sw_inner\"></span>");
            show_device_op_settings.push("<span class=\"onoffswitch-switch meter_en_dis_sw-sw\"></span>");
            show_device_op_settings.push("</label>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("<h2 style=\"margin-top: 10px; text-align: center;\">目前流量(L/min)</h2>");
            show_device_op_settings.push("<h3 style=\"text-align: center;\"id=\"dev_"+index+"_meter_"+i+"_L_min\"></h3>");
            show_device_op_settings.push("<h2 style=\"margin-top: 5px; text-align: center;\">目前流量(L/hour)</h2>");
            show_device_op_settings.push("<h3 style=\"text-align: center;\"id=\"dev_"+index+"_meter_"+i+"_L_hour\"></h3>");
            show_device_op_settings.push("</div>");
            
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
        }

        $('#'+print_info_dst_id).html('');
        $('#'+print_info_dst_id).html(show_device_op_settings.join(''));

        Update_Flow_Meter_Measure(map_device_info_list[Number(index)].device_ID, rsp_json);
        Update_Flow_Meter_Status(map_device_info_list[Number(index)].device_ID, rsp_json);
    });

}

function Update_Flow_Meter_Measure(device_ID, json_rsp_dat)
{
    var dev_index = Find_Device_Index_By_ID(device_ID);
    if(dev_index<0)
    {
        return;
    }

    UI_is_updating = true;

    for(var i = 0; i<json_rsp_dat.num_of_flow_meter; i++){
        sensor_index = json_rsp_dat.sensor_status_list[i].sensor_index;
        
        $("#dev_"+dev_index+"_meter_"+sensor_index+"_L_min").html(json_rsp_dat.sensor_status_list[i].measure_L_min + " L/min");
        $("#dev_"+dev_index+"_meter_"+sensor_index+"_L_hour").html(json_rsp_dat.sensor_status_list[i].measure_L_hour + " L/hour");
    }
    
    UI_is_updating = false;
}

function Update_Flow_Meter_Status(device_ID, json_rsp_dat)
{
    var dev_index = Find_Device_Index_By_ID(device_ID);
    if(dev_index<0)
    {
        return;
    }

    UI_is_updating = true;

    for(var i = 0; i<json_rsp_dat.num_of_flow_meter; i++){
        sensor_index = json_rsp_dat.sensor_status_list[i].sensor_index;
        
        $("#dev_"+dev_index+"_meter_"+sensor_index+"_en_dis").prop("checked", json_rsp_dat.sensor_status_list[i].enabled);
    }
    
    UI_is_updating = false;
}

function onClick_Flow_Meter_Individual_Sensor_EnDis_Switch(device_ID, sensor_index, toggle_switch_id_str)
{
    if(UI_is_updating){return;}

    var en_dis_flag = $("#"+toggle_switch_id_str).prop("checked");
    if(en_dis_flag){
        Enable_Disable_Individual_Flow_Meter(device_ID, sensor_index, 'Enable');
    }
    else{
        Enable_Disable_Individual_Flow_Meter(device_ID, sensor_index, 'Disable');
    }
}

$('head').append('<link rel="stylesheet" type="text/css" href="../../css/circle-meter.css">');

function Handle_Device_WebSocket_POST_Message(in_json)
{
    if(in_json.topic!=null){
        if(in_json.topic=='Environment'){
            if(in_json.command_type!=null){
                switch(in_json.command_type){
                    case "Soil EC Sensor":
                        if(in_json.command!=null){
                            switch(in_json.command){
                                case "Report Soil EC Sensor Current Measure":
                                    Update_Soil_EC_Sensor_Measure(in_json.device_ID, in_json);
                                    break;
                                case "Report Soil EC Sensor Status Change":
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
    return "土壤導電度計";
}

function Print_Device_Management_Toolbar(print_info_dst_id)
{

}

function Print_Device_Operation_Toolbar(index, print_info_dst_id)
{

}

function Show_Device_Operation_Settings(index, print_info_dst_id, update_online_status_cb)
{
    GET_Soil_EC_Sensor_All_Sensor_Status(map_device_info_list[Number(index)].device_ID, function(rsp_json){
        var show_device_op_settings = [];
        
        if(rsp_json.timeout)
        {
            update_online_status_cb(false);
            return;
        }
        update_online_status_cb(true);

        show_device_op_settings.push("<div class=\"row\">");
        show_device_op_settings.push("<h2 class=\"fg-green\">土壤導電度計狀態:</h2>");
        show_device_op_settings.push("</div>");

        for(var i = 0; i<rsp_json.num_of_soil_ec_sensor; i++){
            show_device_op_settings.push("<div class=\"row\">");
            show_device_op_settings.push("<h3 class=\"fg-green\">土壤導電度計"+(i+1)+"</h3>");
            show_device_op_settings.push("</div>");
            
            show_device_op_settings.push("<div class=\"row\">");
            show_device_op_settings.push("<div class=\"cell-12\">");
            show_device_op_settings.push("<div class=\"tiles-grid\">");

            show_device_op_settings.push("<div data-role=\"tile\" data-size=\"large\" class=\"bg-lime fg-white\">");
            show_device_op_settings.push("<h2 style=\"margin-top: 5px; text-align: center;\">導電度(S/m)</h2>");
            show_device_op_settings.push("<div class=\"deneme_font_height\" style=\"margin-top: 15px;margin-left: 12%;\">");
            show_device_op_settings.push("<div class=\"de\">");
            show_device_op_settings.push("<div class=\"den bg-green\" style=\"background:gray;\">");
            show_device_op_settings.push("<div class=\"dene\">");
            show_device_op_settings.push("<div class=\"denem\">");
            show_device_op_settings.push("<div class=\"deneme deneme_font_align\">");
            show_device_op_settings.push("<div id=\"dev_"+index+"_current_soil_ec_S_m_"+i+"\"/>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            
            if(rsp_json.sensor_status_list[i].measure_soil_ec_mS_cm!=null)
            {
                show_device_op_settings.push("<div data-role=\"tile\" data-size=\"large\" class=\"bg-lime fg-white\">");
                show_device_op_settings.push("<h2 style=\"margin-top: 5px; text-align: center;\">導電度(mS/cm)</h2>");
                show_device_op_settings.push("<div class=\"deneme_font_height\" style=\"margin-top: 15px;margin-left: 12%;\">");
                show_device_op_settings.push("<div class=\"de\">");
                show_device_op_settings.push("<div class=\"den bg-green\" style=\"background:gray;\">");
                show_device_op_settings.push("<div class=\"dene\">");
                show_device_op_settings.push("<div class=\"denem\">");
                show_device_op_settings.push("<div class=\"deneme deneme_font_align\">");
                show_device_op_settings.push("<div id=\"dev_"+index+"_current_soil_ec_mS_cm_"+i+"\"/>");
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

        $('#'+print_info_dst_id).html('');
        $('#'+print_info_dst_id).html(show_device_op_settings.join(''));

        Update_Soil_EC_Sensor_Status(map_device_info_list[Number(index)].device_ID, rsp_json);
        Update_Soil_EC_Sensor_Measure(map_device_info_list[Number(index)].device_ID, rsp_json);
    });

}

function Update_Soil_EC_Sensor_Status(device_ID, json_rsp_dat)
{

}

function Update_Soil_EC_Sensor_Measure(device_ID, json_rsp_dat)
{
    var dev_index = Find_Device_Index_By_ID(device_ID);
    if(dev_index<0)
    {
        return;
    }

    for(var i = 0; i<json_rsp_dat.num_of_soil_ec_sensor; i++){
        var current_soil_ec_S_m = json_rsp_dat.sensor_status_list[i].measure_soil_ec_S_m;
        var current_soil_ec_S_m_whole_part = Math.floor(current_soil_ec_S_m);
        var current_soil_ec_S_m_comma_part = Math.round((current_soil_ec_S_m-current_soil_ec_S_m_whole_part)*100);

        if($("dev_"+dev_index+"_current_soil_ec_S_m_" + i)!=null){
            show_current_soil_ec = [];
            show_current_soil_ec.push(current_soil_ec_S_m_whole_part+"<span>."+current_soil_ec_S_m_comma_part+"</span><strong style=\"left: 100px\">%</strong>");
            
            $("#dev_"+dev_index+"_current_soil_ec_S_m_"+i).html("");
            $("#dev_"+dev_index+"_current_soil_ec_S_m_"+i).html(show_current_soil_ec.join(''));
        }

        if(rsp_json.sensor_status_list[i].measure_soil_ec_mS_cm!=null)
        {
            var current_soil_ec_mS_cm = json_rsp_dat.sensor_status_list[i].measure_soil_ec_mS_cm;
            var current_soil_ec_mS_cm_whole_part = Math.floor(current_soil_ec_mS_cm);
            var current_soil_ec_mS_cm_comma_part = Math.round((current_soil_ec_mS_cm-current_soil_ec_mS_cm_whole_part)*100);

            if($("dev_"+dev_index+"_current_soil_ec_mS_cm_" + i)!=null){
                show_current_soil_ec = [];
                show_current_soil_ec.push(current_soil_ec_mS_cm_whole_part+"<span>."+current_soil_ec_mS_cm_comma_part+"</span><strong style=\"left: 100px\">%</strong>");
                
                $("#dev_"+dev_index+"_current_soil_ec_mS_cm_"+i).html("");
                $("#dev_"+dev_index+"_current_soil_ec_mS_cm_"+i).html(show_current_soil_ec.join(''));
            }
        }
    }
}

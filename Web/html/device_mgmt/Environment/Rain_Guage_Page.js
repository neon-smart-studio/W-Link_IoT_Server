$('head').append('<link rel="stylesheet" type="text/css" href="../../css/circle-meter.css">');

function Handle_Device_WebSocket_POST_Message(in_json)
{
    if(in_json.topic!=null){
        if(in_json.topic=='Environment'){
            if(in_json.command_type!=null){
                switch(in_json.command_type){
                    case "Rain Guage":
                        if(in_json.command!=null){
                            switch(in_json.command){
                                case "Report Rain Guage Current Measure":
                                case "Report Rain Guage Status Change":
                                    Update_Rain_Guage_Measure(in_json.device_ID, in_json);
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
    return "雨量計";
}

function Print_Device_Management_Toolbar(print_info_dst_id)
{

}

function Print_Device_Operation_Toolbar(index, print_info_dst_id)
{

}

function Show_Device_Operation_Settings(index, print_info_dst_id, update_online_status_cb)
{
    GET_Rain_Guage_All_Sensor_Status(map_device_info_list[Number(index)].device_ID, function(rsp_json){
        var show_device_op_settings = [];
        
        if(rsp_json.timeout)
        {
            update_online_status_cb(false);
            return;
        }
        update_online_status_cb(true);

        show_device_op_settings.push("<div class=\"row\">");
        show_device_op_settings.push("<h2 class=\"fg-green\">雨量計狀態:</h2>");
        show_device_op_settings.push("</div>");

        for(var i = 0; i<rsp_json.num_of_rain_guage; i++){
            show_device_op_settings.push("<div class=\"row\">");
            show_device_op_settings.push("<h3 class=\"fg-green\">雨量計"+(i+1)+"</h3>");
            show_device_op_settings.push("</div>");
            
            show_device_op_settings.push("<div class=\"row\">");
            show_device_op_settings.push("<div class=\"cell-12\">");
            show_device_op_settings.push("<div class=\"tiles-grid\">");

            show_device_op_settings.push("<div data-role=\"tile\" data-size=\"large\" class=\"bg-lime fg-white\">");
            show_device_op_settings.push("<h2 style=\"margin-top: 5px; text-align: center;\">目前降雨量(mm/Hr)</h2>");
            show_device_op_settings.push("<div class=\"de\" style=\"margin: 0px auto;margin-top: 5px;\">");
            show_device_op_settings.push("<div class=\"de\">");
            show_device_op_settings.push("<div class=\"den\" id=\"dev_"+index+"_current_rain_rate_show_color_"+i+"\" style=\"background:gray;\">");
            show_device_op_settings.push("<div class=\"dene\">");
            show_device_op_settings.push("<div class=\"denem\">");
            show_device_op_settings.push("<div class=\"deneme deneme_font_align\">");
            show_device_op_settings.push("<div style=\"margin-top: 20px;font-size: 60px;\" id=\"dev_"+index+"_current_rain_rate_"+i+"\"/>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
        }

        $('#'+print_info_dst_id).html('');
        $('#'+print_info_dst_id).html(show_device_op_settings.join(''));

        Update_Rain_Guage_Status(map_device_info_list[Number(index)].device_ID, rsp_json);
        Update_Rain_Guage_Measure(map_device_info_list[Number(index)].device_ID, rsp_json);
    });

}

function Update_Rain_Guage_Status(device_ID, json_rsp_dat)
{
}

function Update_Rain_Guage_Measure(device_ID, json_rsp_dat)
{
    var dev_index = Find_Device_Index_By_ID(device_ID);
    if(dev_index<0)
    {
        return;
    }

    var color;
    var current_rain_rate_whole_part;
    var current_rain_rate_comma_part;
    var show_current_rain_rate = [];
    var current_rain_rate;
    
    for(var i = 0; i<json_rsp_dat.num_of_rain_guage; i++){
        current_rain_rate = json_rsp_dat.guage_status_list[i].measure_rain_rate_mm_hr;
        current_rain_rate_whole_part = Math.floor(current_rain_rate);
        current_rain_rate_comma_part = Math.round((current_rain_rate-current_rain_rate_whole_part)*100);

        if($("dev_"+dev_index+"_current_rain_rate_" + i)!=null){
            show_current_rain_rate = [];
            show_current_rain_rate.push(current_rain_rate_whole_part+"<span>."+current_rain_rate_comma_part+"</span><div style=\"margin-top: -10px;font-size: 30px;\">mm/Hr</div>");
            
            $("#dev_"+dev_index+"_current_rain_rate_"+i).html("");
            $("#dev_"+dev_index+"_current_rain_rate_"+i).html(show_current_rain_rate.join(''));
            
            if(current_rain_rate<50){
                color = "green";
            }
            else if(current_rain_rate<100){
                color = "orange";
            }
            else if(current_rain_rate<300){
                color = "red";
            }
            else{
                color = "purple";
            }
            
            if($("dev_"+dev_index+"_current_rain_rate_show_color_"+i)!=null){
                $("#dev_"+dev_index+"_current_rain_rate_show_color_"+i).removeAttr("class");
                $("#dev_"+dev_index+"_current_rain_rate_show_color_"+i).addClass('den bg-' + color);
            }
        }
    }
}

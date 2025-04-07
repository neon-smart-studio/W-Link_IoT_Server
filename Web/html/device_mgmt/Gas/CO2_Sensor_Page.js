$('head').append('<link rel="stylesheet" type="text/css" href="../../css/circle-meter.css">');

function Handle_Device_WebSocket_POST_Message(in_json)
{
    if(in_json.topic!=null){
        if(in_json.topic=='Gas'){
            if(in_json.command_type!=null){
                switch(in_json.command_type){
                    case "CO2 Sensor":
                        if(in_json.command!=null){
                            switch(in_json.command){
                                case "Report CO2 Sensor Current Measure":
                                    Update_CO2_Sensor_Measure(in_json.device_ID, in_json);
                                    break;
                                case "Report CO2 Sensor Status Change":
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
    return "CO2二氧化碳感測器";
}

function Print_Device_Management_Toolbar(print_info_dst_id)
{

}

function Print_Device_Operation_Toolbar(index, print_info_dst_id)
{

}

function Show_Device_Operation_Settings(index, print_info_dst_id, update_online_status_cb)
{
    GET_CO2_Sensor_All_Sensor_Status(map_device_info_list[Number(index)].device_ID, function(rsp_json){
        var show_device_op_settings = [];
        
        if(rsp_json.timeout)
        {
            update_online_status_cb(false);
            return;
        }
        update_online_status_cb(true);

        show_device_op_settings.push("<div class=\"row\">");
        show_device_op_settings.push("<h2 class=\"fg-indigo\">CO2二氧化碳感測器狀態:</h2>");
        show_device_op_settings.push("</div>");

        for(var i = 0; i<rsp_json.num_of_co2_sensor; i++){
            show_device_op_settings.push("<div class=\"row\">");
            show_device_op_settings.push("<h3 class=\"fg-indigo\">感測器"+(i+1)+"</h3>");
            show_device_op_settings.push("</div>");
            
            show_device_op_settings.push("<div class=\"row\">");
            show_device_op_settings.push("<div class=\"cell-12\">");
            show_device_op_settings.push("<div class=\"tiles-grid\">");

            show_device_op_settings.push("<div data-role=\"tile\" data-size=\"large\" class=\"bg-indigo fg-white\">");
            show_device_op_settings.push("<h2 style=\"margin-top: 5px; text-align: center;\">CO2濃度(ppm)</h2>");
            show_device_op_settings.push("<div class=\"deneme_font_height\" style=\"margin-top: 15px;margin-left: 12%;\">");
            show_device_op_settings.push("<div class=\"de\">");
            show_device_op_settings.push("<div class=\"den\" id=\"dev_"+index+"_current_co2_ppm_show_color_"+i+"\" style=\"background:gray;\">");
            show_device_op_settings.push("<div class=\"dene\">");
            show_device_op_settings.push("<div class=\"denem\">");
            show_device_op_settings.push("<div class=\"deneme deneme_font_align\">");
            show_device_op_settings.push("<div id=\"dev_"+index+"_current_co2_ppm_"+i+"\"/>");
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

        Update_CO2_Sensor_Status(map_device_info_list[Number(index)].device_ID, rsp_json);
        Update_CO2_Sensor_Measure(map_device_info_list[Number(index)].device_ID, rsp_json);
    });

}

function Update_CO2_Sensor_Status(device_ID, json_rsp_dat)
{

}

function Update_CO2_Sensor_Measure(device_ID, json_rsp_dat)
{
    var dev_index = Find_Device_Index_By_ID(device_ID);
    if(dev_index<0)
    {
        return;
    }

    var color;
    var current_co2_whole_part;
    var current_co2_comma_part;
    var show_current_co2 = [];
    var current_co2;
    
    for(var i = 0; i<json_rsp_dat.num_of_co2_sensor; i++){
        current_co2 = json_rsp_dat.sensor_status_list[i].measure_co2_ppm;
        current_co2_whole_part = Math.floor(current_co2);
        current_co2_comma_part = Math.round((current_co2-current_co2_whole_part)*100);

        if($("dev_"+dev_index+"_current_co2_ppm_" + i)!=null){
            show_current_co2 = [];
            show_current_co2.push(current_co2_whole_part+"<span>."+current_co2_comma_part+"</span><strong style=\"left: 100px\">ppm</strong>");
            
            $("#dev_"+dev_index+"_current_co2_ppm_"+i).html("");
            $("#dev_"+dev_index+"_current_co2_ppm_"+i).html(show_current_co2.join(''));
                
            if(current_co2<350){
                color = "emerald";
            }
            else if(current_co2<400){
                color = "lime";
            }
            else if(current_co2<700){
                color = "green";
            }
            else if(current_co2<1000){
                color = "teal";
            }
            else if(current_co2<3000){
                color = "orange";
            }
            else if(current_co2<5000){
                color = "magenta";
            }
            else if(current_co2<10000){
                color = "red";
            }
            else if(current_co2<70000){
                color = "purple";
            }
            else if(current_co2<=100000){
                color = "gray";
            }
            else{
                color = "grayBlue";
            }
            
            if($("dev_"+dev_index+"_current_co2_ppm_show_color_"+i)!=null){
                $("#dev_"+dev_index+"_current_co2_ppm_show_color_"+i).removeAttr("class");
                $("#dev_"+dev_index+"_current_co2_ppm_show_color_"+i).addClass('den bg-' + color);
            }
        }
    }
}

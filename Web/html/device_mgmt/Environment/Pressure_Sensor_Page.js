$('head').append('<link rel="stylesheet" type="text/css" href="../../css/circle-meter.css">');

function Handle_Device_WebSocket_POST_Message(in_json)
{
    if(in_json.topic!=null){
        if(in_json.topic=='Environment'){
            if(in_json.command_type!=null){
                switch(in_json.command_type){
                    case "Pressure Sensor":
                        if(in_json.command!=null){
                            switch(in_json.command){
                                case "Report Pressure Sensor Current Measure":
                                    Update_Pressure_Sensor_Measure(in_json.device_ID, in_json);
                                    break;
                                case "Report Pressure Sensor Status Change":
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
    return "氣壓計";
}

function Show_Device_Operation_Settings(index, print_info_dst_id, update_online_status_cb)
{
    GET_Pressure_Sensor_All_Sensor_Status(map_device_info_list[Number(index)].device_ID, function(rsp_json){
        var show_device_op_settings = [];
        var show_device_display_charts = [];
        
        if(rsp_json.timeout)
        {
            update_online_status_cb(false);
            return;
        }
        update_online_status_cb(true);

        var display_temperature_history_chart = false;

        show_device_op_settings.push("<div id=\"dev_"+index+"_chart_display_area\"/>");

        show_device_op_settings.push("<div class=\"row\">");
        show_device_op_settings.push("<div class=\"cell-12\">");
        show_device_op_settings.push("<div class=\"tiles-grid\">");

        for(var i = 0; i<rsp_json.num_of_pressure_sensor; i++)
        {
            if(rsp_json.sensor_status_list[i].measure_temperature!=null)
            {
                display_temperature_history_chart = true;

                show_device_op_settings.push("<div data-role=\"tile\" data-size=\"large\" class=\"bg-lime fg-white\">");
                show_device_op_settings.push("<h2 style=\"margin-top: 5px; text-align: center;\">氣壓計"+(i+1)+"</h2>");
                show_device_op_settings.push("<div class=\"deneme_font_height\" style=\"margin-top: 15px;margin-left: 12%;\">");
                show_device_op_settings.push("<div class=\"de\">");
                show_device_op_settings.push("<div class=\"den\" id=\"dev_"+index+"_current_environment_temp_show_color_"+i+"\" style=\"background:gray;\">");
                show_device_op_settings.push("<div class=\"dene\">");
                show_device_op_settings.push("<div class=\"denem\">");
                show_device_op_settings.push("<div class=\"deneme deneme_font_align\">");
                show_device_op_settings.push("<div id=\"dev_"+index+"_current_environment_temp_"+i+"\"/>");
                show_device_op_settings.push("</div>");
                show_device_op_settings.push("</div>");
                show_device_op_settings.push("</div>");
                show_device_op_settings.push("</div>");
                show_device_op_settings.push("</div>");
                show_device_op_settings.push("</div>");
                show_device_op_settings.push("</div>");
            }
            
            show_device_op_settings.push("<div class=\"deneme_font_height\" style=\"margin-top: 15px;margin-left: 12%;\">");
            show_device_op_settings.push("<div class=\"de\">");
            show_device_op_settings.push("<div class=\"den bg-green\">");
            show_device_op_settings.push("<div class=\"dene\">");
            show_device_op_settings.push("<div class=\"denem\">");
            show_device_op_settings.push("<div class=\"deneme deneme_font_align\">");
            show_device_op_settings.push("<div style=\"font-size: 50px;margin-top: 35px;\" id=\"dev_"+index+"_current_pressure_"+i+"\"/>");
            show_device_op_settings.push("<div style=\"font-size: 30px\">Pa</div>");
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

        if(display_temperature_history_chart)
        {
            show_device_display_charts.push("<div class=\"row\">");
            show_device_display_charts.push("<div class=\"cell-12\">");
            show_device_display_charts.push("<div data-role=\"panel\">");
            show_device_display_charts.push("<div id=\"dev_"+index+"_temp_history_chart\"/>");
            show_device_display_charts.push("</div>");
            show_device_display_charts.push("</div>");
            show_device_display_charts.push("</div>");
        }

        show_device_display_charts.push("<div class=\"row\">");
        show_device_display_charts.push("<div class=\"cell-12\">");
        show_device_display_charts.push("<div data-role=\"panel\">");
        show_device_display_charts.push("<div id=\"dev_"+index+"_pressure_history_chart\"/>");
        show_device_display_charts.push("</div>");
        show_device_display_charts.push("</div>");
        show_device_display_charts.push("</div>");

        $('#'+print_info_dst_id).html('');
        $('#'+print_info_dst_id).html(show_device_op_settings.join(''));

        $("#dev_"+index+"_chart_display_area").html('');
        $("#dev_"+index+"_chart_display_area").html(show_device_display_charts.join(''));

        Update_Pressure_Sensor_Status(map_device_info_list[Number(index)].device_ID, rsp_json);
        Update_Pressure_Sensor_Measure(map_device_info_list[Number(index)].device_ID, rsp_json);
    });

}

function Update_Pressure_Sensor_Status(device_ID, json_rsp_dat)
{

}

function Update_Pressure_Sensor_Measure(device_ID, json_rsp_dat)
{
    var dev_index = Find_Device_Index_By_ID(device_ID);
    if(dev_index<0)
    {
        return;
    }

    var color;
    var comma_index;

    var current_temp, current_temp_str;
    var show_current_temp = [];
    var current_pressure, current_pressure_str;
    var show_current_pressure = [];
    
    for(var i = 0; i<json_rsp_dat.num_of_pressure_sensor; i++){

        if(json_rsp_dat.sensor_status_list[i].measure_temperature!=null)
        {
            if(json_rsp_dat.sensor_status_list[i].measure_temperature!=null)
            {
                current_temp = json_rsp_dat.sensor_status_list[i].measure_temperature;
                current_temp_str = String(Math.round(current_temp*100)/100);
            }
    
            current_pressure = json_rsp_dat.sensor_status_list[i].measure_pressure;
            current_pressure_str = String(Math.round(current_pressure*100)/100);

            if($("dev_"+dev_index+"_current_environment_temp_" + i)!=null){
                show_current_temp = [];
                
                comma_index = current_temp_str.indexOf('.');
                if(comma_index<0)
                {
                    show_current_temp.push(current_temp_str+"<span>.0</span><strong>°</strong>");
                }
                else{
                    show_current_temp.push(current_temp_str.substring(0,comma_index)+"<span>."+current_temp_str.substring(comma_index+1)+"</span><strong>°</strong>");
                }
            
                $("#dev_"+dev_index+"_current_environment_temp_"+i).html("");
                $("#dev_"+dev_index+"_current_environment_temp_"+i).html(show_current_temp.join(''));

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
                    color = "green";
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

                if($("dev_"+dev_index+"_current_environment_temp_show_color_"+i)!=null){
                    $("#dev_"+dev_index+"_current_environment_temp_show_color_"+i).removeAttr("class");
                    $("#dev_"+dev_index+"_current_environment_temp_show_color_"+i).addClass('den bg-' + color);
                }
            }
        }
        
        if($("dev_"+dev_index+"_current_pressure_" + i)!=null){
            show_current_pressure = [];
            
            comma_index = current_pressure_str.indexOf('.');
            if(comma_index<0)
            {
                show_current_pressure.push(current_pressure_str+"<span>.0</span>");
            }
            else{
                show_current_pressure.push(current_pressure_str.substring(0,comma_index)+"<span>."+current_pressure_str.substring(comma_index+1)+"</span>");
            }
        
            $("#dev_"+dev_index+"_current_pressure_"+i).html("");
            $("#dev_"+dev_index+"_current_pressure_"+i).html(show_current_pressure.join(''));
        }
    }
}

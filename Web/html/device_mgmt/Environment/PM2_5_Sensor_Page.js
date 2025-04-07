$('head').append('<link rel="stylesheet" type="text/css" href="../../css/circle-meter.css">');

function Handle_Device_WebSocket_POST_Message(in_json)
{
    if(in_json.topic!=null){
        if(in_json.topic=='Environment'){
            if(in_json.command_type!=null){
                switch(in_json.command_type){
                    case "PM2.5 Sensor":
                        if(in_json.command!=null){
                            switch(in_json.command){
                                case "Report PM2.5 Sensor Current Measure":
                                    Update_PM2_5_Sensor_Measure(in_json.device_ID, in_json);
                                    break;
                                case "Report PM2.5 Sensor Status Change":
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
    return "PM2.5 感測器";
}

function Print_Device_Management_Toolbar(print_info_dst_id)
{

}

function Print_Device_Operation_Toolbar(index, print_info_dst_id)
{

}

function Show_Device_Operation_Settings(index, print_info_dst_id, update_online_status_cb)
{
    GET_PM2_5_Sensor_All_Sensor_Status(map_device_info_list[Number(index)].device_ID, function(rsp_json){
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
            show_device_op_settings.push("<h2 class=\"fg-green\">目前環境溫溼度:</h2>");
            show_device_op_settings.push("</div>");

            show_device_op_settings.push("<div class=\"row\">");
            show_device_op_settings.push("<div class=\"cell-12\">");
            show_device_op_settings.push("<div class=\"tiles-grid\">");

            if(rsp_json.environment_temperature!=null)
            {
                show_device_op_settings.push("<div data-role=\"tile\" data-size=\"large\" class=\"bg-lime fg-white\">");
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
                show_device_op_settings.push("<div data-role=\"tile\" data-size=\"large\" class=\"bg-lime fg-white\">");
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
        show_device_op_settings.push("<h2 class=\"fg-green\">PM2.5 感測器狀態:</h2>");
        show_device_op_settings.push("</div>");

        for(var i = 0; i<rsp_json.num_of_pm_2_5_sensor; i++){
            show_device_op_settings.push("<div class=\"row\">");
            show_device_op_settings.push("<h3 class=\"fg-green\">感測器"+(i+1)+"</h3>");
            show_device_op_settings.push("</div>");
            
            show_device_op_settings.push("<div class=\"row\">");
            show_device_op_settings.push("<div class=\"cell-12\">");
            show_device_op_settings.push("<div class=\"tiles-grid\">");

            show_device_op_settings.push("<div data-role=\"tile\" data-size=\"large\" class=\"bg-lime fg-white\">");
            show_device_op_settings.push("<h2 style=\"margin-top: 5px; text-align: center;\">PM2.5</h2>");
            show_device_op_settings.push("<div class=\"deneme_font_height\" style=\"margin-top: 15px;margin-left: 12%;\">");
            show_device_op_settings.push("<div class=\"de\">");
            show_device_op_settings.push("<div class=\"den\" id=\"dev_"+index+"_current_pm_2_5_show_color_"+i+"\" style=\"background:gray;\">");
            show_device_op_settings.push("<div class=\"dene\">");
            show_device_op_settings.push("<div class=\"denem\">");
            show_device_op_settings.push("<div class=\"deneme deneme_font_align\">");
            show_device_op_settings.push("<div id=\"dev_"+index+"_current_pm_2_5_"+i+"\"/>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            
            if(rsp_json.sensor_status_list[i].measure_pm_10!=null)
            {
                show_device_op_settings.push("<div data-role=\"tile\" data-size=\"large\" class=\"bg-lime fg-white\">");
                show_device_op_settings.push("<h2 style=\"margin-top: 5px; text-align: center;\">PM10</h2>");
                show_device_op_settings.push("<div class=\"deneme_font_height\" style=\"margin-top: 15px;margin-left: 12%;\">");
                show_device_op_settings.push("<div class=\"de\">");
                show_device_op_settings.push("<div class=\"den\" id=\"dev_"+index+"_current_pm_10_show_color_"+i+"\" style=\"background:gray;\">");
                show_device_op_settings.push("<div class=\"dene\">");
                show_device_op_settings.push("<div class=\"denem\">");
                show_device_op_settings.push("<div class=\"deneme deneme_font_align\">");
                show_device_op_settings.push("<div id=\"dev_"+index+"_current_pm_10_"+i+"\"/>");
                show_device_op_settings.push("</div>");
                show_device_op_settings.push("</div>");
                show_device_op_settings.push("</div>");
                show_device_op_settings.push("</div>");
                show_device_op_settings.push("</div>");
                show_device_op_settings.push("</div>");
                show_device_op_settings.push("</div>");
            }
            
            if(rsp_json.sensor_status_list[i].measure_temperature!=null)
            {
                show_device_op_settings.push("<div data-role=\"tile\" data-size=\"large\" class=\"bg-lime fg-white\">");
                show_device_op_settings.push("<h2 style=\"margin-top: 5px; text-align: center;\">目前溫度</h2>");
                show_device_op_settings.push("<div class=\"deneme_font_height\" style=\"margin-top: 15px;margin-left: 12%;\">");
                show_device_op_settings.push("<div class=\"de\">");
                show_device_op_settings.push("<div class=\"den\" id=\"dev_"+index+"_current_temp_show_color_"+i+"\" style=\"background:gray;\">");
                show_device_op_settings.push("<div class=\"dene\">");
                show_device_op_settings.push("<div class=\"denem\">");
                show_device_op_settings.push("<div class=\"deneme deneme_font_align\">");
                show_device_op_settings.push("<div id=\"dev_"+index+"_current_temp_"+i+"\"/>");
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

        Update_PM2_5_Sensor_Status(map_device_info_list[Number(index)].device_ID, rsp_json);
        Update_PM2_5_Sensor_Measure(map_device_info_list[Number(index)].device_ID, rsp_json);
    });

}

function Update_PM2_5_Sensor_Status(device_ID, json_rsp_dat)
{

}

function Update_PM2_5_Sensor_Measure(device_ID, json_rsp_dat)
{
    var dev_index = Find_Device_Index_By_ID(device_ID);
    if(dev_index<0)
    {
        return;
    }

    var color;

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
    
    for(var i = 0; i<rsp_json.num_of_pm_2_5_sensor; i++){
        var current_pm_2_5 = json_rsp_dat.sensor_status_list[i].measure_pm_2_5;
        var current_pm_2_5_whole_part = Math.floor(current_pm_2_5);
        var current_pm_2_5_comma_part = Math.round((current_pm_2_5-current_pm_2_5_whole_part)*100);
        
        if($("dev_"+dev_index+"_current_pm_2_5_"+i)!=null){
            show_current_pm_2_5 = [];
            show_current_pm_2_5.push(current_pm_2_5_whole_part+"<span>."+current_pm_2_5_comma_part+"</span><strong style=\"left: 100px\">ug/m3</strong>");
            
            $("#dev_"+dev_index+"_current_pm_2_5_"+i).html("");
            $("#dev_"+dev_index+"_current_pm_2_5_"+i).html(show_current_pm_2_5.join(''));

            if(current_pm_2_5<12){
                color = "emerald";
            }
            else if(current_pm_2_5<24){
                color = "lime";
            }
            else if(current_pm_2_5<36){
                color = "green";
            }
            else if(current_pm_2_5<42){
                color = "yellow";
            }
            else if(current_pm_2_5<48){
                color = "orange";
            }
            else if(current_pm_2_5<54){
                color = "pumpkin";
            }
            else if(current_pm_2_5<59){
                color = "magenta";
            }
            else if(current_pm_2_5<65){
                color = "red";
            }
            else if(current_pm_2_5<=71){
                color = "pomegranate";
            }
            else{
                color = "purple";
            }
            
            if($("dev_"+dev_index+"_current_pm_2_5_show_color_"+i)!=null){
                $("#dev_"+dev_index+"_current_pm_2_5_show_color_"+i).removeAttr("class");
                $("#dev_"+dev_index+"_current_pm_2_5_show_color_"+i).addClass('den bg-' + color);
            }
        }

        if(json_rsp_dat.sensor_status_list[i].measure_temperature!=null)
        {
            var current_temp = json_rsp_dat.sensor_status_list[i].measure_temperature;
            var current_temp_whole_part = Math.floor(current_temp);
            var current_temp_comma_part = Math.round((current_temp-current_temp_whole_part)*100);
            
            if($("dev_"+dev_index+"_current_temp_"+i)!=null){
                show_current_temp = [];
                show_current_temp.push(current_temp_whole_part+"<span>."+current_temp_comma_part+"</span><strong>°</strong>");
                
                $("#dev_"+dev_index+"_current_temp_"+i).html("");
                $("#dev_"+dev_index+"_current_temp_"+i).html(show_current_temp.join(''));
    
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
    
                if($("dev_"+dev_index+"_current_temp_show_color_"+i)!=null){
                    $("#dev_"+dev_index+"_current_temp_show_color_"+i).removeAttr("class");
                    $("#dev_"+dev_index+"_current_temp_show_color_"+i).addClass('den bg-' + color);
                }
            }
            if(json_rsp_dat.sensor_status_list[i].measure_pm_10!=null)
            {
                var current_pm_10 = json_rsp_dat.sensor_status_list[i].measure_pm_10;
                var current_pm_10_whole_part = Math.floor(current_pm_10);
                var current_pm_10_comma_part = Math.round((current_pm_10-current_pm_10_whole_part)*100);
                
                if($("dev_"+dev_index+"_current_pm_10_"+i)!=null){
                    show_current_pm_10 = [];
                    show_current_pm_10.push(current_pm_10_whole_part+"<span>."+current_pm_10_comma_part+"</span><strong style=\"left: 100px\">ug/m3</strong>");
                    
                    $("#dev_"+dev_index+"_current_pm_10_"+i).html("");
                    $("#dev_"+dev_index+"_current_pm_10_"+i).html(show_current_pm_10.join(''));
        
                    if(current_pm_10<12){
                        color = "emerald";
                    }
                    else if(current_pm_10<24){
                        color = "lime";
                    }
                    else if(current_pm_10<36){
                        color = "green";
                    }
                    else if(current_pm_10<42){
                        color = "yellow";
                    }
                    else if(current_pm_10<48){
                        color = "orange";
                    }
                    else if(current_pm_10<54){
                        color = "pumpkin";
                    }
                    else if(current_pm_10<59){
                        color = "magenta";
                    }
                    else if(current_pm_10<65){
                        color = "red";
                    }
                    else if(current_pm_10<=71){
                        color = "pomegranate";
                    }
                    else{
                        color = "purple";
                    }

                    if($("dev_"+dev_index+"_current_pm_10_show_color_"+i)!=null){
                        $("#dev_"+dev_index+"_current_pm_10_show_color_"+i).removeAttr("class");
                        $("#dev_"+dev_index+"_current_pm_10_show_color_"+i).addClass('den bg-' + color);
                    }
                }
            }
        }
    }
}

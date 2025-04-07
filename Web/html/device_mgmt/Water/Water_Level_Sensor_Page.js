$('head').append('<link rel="stylesheet" type="text/css" href="../../css/circle-meter.css">');

function Handle_Device_WebSocket_POST_Message(in_json)
{
    if(in_json.topic!=null){
        if(in_json.topic=='Water'){
            if(in_json.command_type!=null){
                switch(in_json.command_type){
                    case "Water Level Sensor":
                        if(in_json.command!=null){
                            switch(in_json.command){
                                case "Report Water Level Sensor Current Measure":
                                    Update_Water_Level_Sensor_Measure(in_json.device_ID, in_json);
                                    break;
                                case "Report Water Level Sensor Status Change":
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
    return "水位計";
}

function Print_Device_Management_Toolbar(print_info_dst_id)
{

}

function Print_Device_Operation_Toolbar(index, print_info_dst_id)
{

}

function Show_Device_Operation_Settings(index, print_info_dst_id, update_online_status_cb)
{
    GET_Water_Level_Sensor_All_Sensor_Status(map_device_info_list[Number(index)].device_ID, function(rsp_json){
        var show_device_op_settings = [];
        
        if(rsp_json.timeout)
        {
            update_online_status_cb(false);
            return;
        }
        update_online_status_cb(true);

        show_device_op_settings.push("<div class=\"row\">");
        show_device_op_settings.push("<h2 class=\"fg-blue\">水位計狀態:</h2>");
        show_device_op_settings.push("</div>");

        for(var i = 0; i<rsp_json.num_of_water_level_sensor; i++){
            show_device_op_settings.push("<div class=\"row\">");
            show_device_op_settings.push("<h3 class=\"fg-blue\">水位計"+(i+1)+"</h3>");
            show_device_op_settings.push("</div>");
            
            show_device_op_settings.push("<div class=\"row\">");
            show_device_op_settings.push("<div class=\"cell-12\">");
            show_device_op_settings.push("<div class=\"tiles-grid\">");

            show_device_op_settings.push("<div data-role=\"tile\" data-size=\"large\" class=\"bg-blue fg-white\">");
            show_device_op_settings.push("<h2 style=\"margin-top: 5px; text-align: center;\">目前深度(m)</h2>");
            show_device_op_settings.push("<div class=\"deneme_font_height\" style=\"margin-top: 15px;margin-left: 12%;\">");
            show_device_op_settings.push("<div class=\"de\">");
            show_device_op_settings.push("<div class=\"den bg-blue\" style=\"background:gray;\">");
            show_device_op_settings.push("<div class=\"dene\">");
            show_device_op_settings.push("<div class=\"denem\">");
            show_device_op_settings.push("<div class=\"deneme deneme_font_align\">");
            show_device_op_settings.push("<div id=\"dev_"+index+"_current_water_level_"+i+"\"/>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            
            if(rsp_json.sensor_status_list[i].measure_temperature!=null)
            {
                show_device_op_settings.push("<div data-role=\"tile\" data-size=\"large\" class=\"bg-blue fg-white\">");
                show_device_op_settings.push("<h2 style=\"margin-top: 5px; text-align: center;\">環境溫度</h2>");
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

        Update_Water_Level_Sensor_Status(map_device_info_list[Number(index)].device_ID, rsp_json);
        Update_Water_Level_Sensor_Measure(map_device_info_list[Number(index)].device_ID, rsp_json);
    });

}

function Update_Water_Level_Sensor_Status(device_ID, json_rsp_dat)
{

}

function Update_Water_Level_Sensor_Measure(device_ID, json_rsp_dat)
{
    var dev_index = Find_Device_Index_By_ID(device_ID);
    if(dev_index<0)
    {
        return;
    }

    var color;
    var current_temp_whole_part;
    var current_temp_comma_part;
    var current_water_level_whole_part;
    var current_water_level_comma_part;
    var show_current_temp = [];
    var show_current_water_level = [];
    var current_temp;
    var current_water_level;
    
    for(var i = 0; i<json_rsp_dat.num_of_water_level_sensor; i++){
        
        current_water_level = json_rsp_dat.sensor_status_list[i].measure_water_level;
        current_water_level_whole_part = Math.floor(current_water_level);
        current_water_level_comma_part = Math.round((current_water_level-current_water_level_whole_part)*100);

        if($("dev_"+dev_index+"_current_water_level_" + i)!=null){
            show_current_water_level = [];
            show_current_water_level.push(current_water_level_whole_part+"<span>."+current_water_level_comma_part+"</span><strong style=\"left: 100px\">%</strong>");
            
            $("#dev_"+dev_index+"_current_water_level_"+i).html("");
            $("#dev_"+dev_index+"_current_water_level_"+i).html(show_current_water_level.join(''));
        }

        if(rsp_json.sensor_status_list[i].measure_temperature!=null)
        {
            current_temp = json_rsp_dat.sensor_status_list[i].measure_temperature;
            current_temp_whole_part = Math.floor(current_temp);
            current_temp_comma_part = Math.round((current_temp-current_temp_whole_part)*100);
            if($("dev_"+dev_index+"_current_temp_" + i)!=null){
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

                if($("dev_"+dev_index+"_current_temp_show_color_"+i)!=null){
                    $("#dev_"+dev_index+"_current_temp_show_color_"+i).removeAttr("class");
                    $("#dev_"+dev_index+"_current_temp_show_color_"+i).addClass('den bg-' + color);
                }
            }
        }
    }
}

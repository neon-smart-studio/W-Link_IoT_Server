$('head').append('<link rel="stylesheet" type="text/css" href="../../css/circle-meter.css">');

function Handle_Device_WebSocket_POST_Message(in_json)
{
    if(in_json.topic!=null){
        if(in_json.topic=='Environment'){
            if(in_json.command_type!=null){
                switch(in_json.command_type){
                    case "Wind Guage":
                        if(in_json.command!=null){
                            switch(in_json.command){
                                case "Report Wind Guage Current Measure":
                                case "Report Wind Guage Status Change":
                                    Update_Wind_Guage_Measure(in_json.device_ID, in_json);
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
    return "風速風向儀";
}

function Print_Device_Management_Toolbar(print_info_dst_id)
{

}

function Print_Device_Operation_Toolbar(index, print_info_dst_id)
{

}

function Show_Device_Operation_Settings(index, print_info_dst_id, update_online_status_cb)
{
    GET_Wind_Guage_All_Sensor_Status(map_device_info_list[Number(index)].device_ID, function(rsp_json){
        var show_device_op_settings = [];
        
        if(rsp_json.timeout)
        {
            update_online_status_cb(false);
            return;
        }
        update_online_status_cb(true);

        show_device_op_settings.push("<div class=\"row\">");
        show_device_op_settings.push("<h2 class=\"fg-green\">風速風向儀狀態:</h2>");
        show_device_op_settings.push("</div>");

        for(var i = 0; i<rsp_json.num_of_wind_guage; i++){
            show_device_op_settings.push("<div class=\"row\">");
            show_device_op_settings.push("<h3 class=\"fg-green\">風速風向儀"+(i+1)+"</h3>");
            show_device_op_settings.push("</div>");
            
            show_device_op_settings.push("<div class=\"row\">");
            show_device_op_settings.push("<div class=\"cell-12\">");
            show_device_op_settings.push("<div class=\"tiles-grid\">");

            show_device_op_settings.push("<div data-role=\"tile\" data-size=\"large\" class=\"bg-lime fg-white\">");
            show_device_op_settings.push("<h2 style=\"margin: 0px auto\">目前風速(級數) "+(i+1)+"</h2>");
            show_device_op_settings.push("<div class=\"deneme_font_height\" style=\"margin-top: 15px;margin-left: 12%;\">");
            show_device_op_settings.push("<div class=\"de\" style=\"margin: 0px auto;margin-top: 5px;\">");
            show_device_op_settings.push("<div class=\"den bg-green\" id=\"dev_"+index+"_current_wind_speed_index_show_color"+i+"\">");
            show_device_op_settings.push("<div class=\"dene\">");
            show_device_op_settings.push("<div class=\"denem\">");
            show_device_op_settings.push("<div class=\"deneme deneme_font_align\">");
            show_device_op_settings.push("<div style=\"margin-top: 30px;font-size: 50px;\" id=\"dev_"+index+"_current_wind_speed_index"+i+"\"/>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            
            show_device_op_settings.push("<div data-role=\"tile\" data-size=\"large\" class=\"bg-lime fg-white\">");
            show_device_op_settings.push("<h2 style=\"margin: 0px auto\">目前風速(m/s) "+(i+1)+"</h2>");
            show_device_op_settings.push("<div class=\"deneme_font_height\" style=\"margin-top: 15px;margin-left: 12%;\">");
            show_device_op_settings.push("<div class=\"de\" style=\"margin: 0px auto;margin-top: 5px;\">");
            show_device_op_settings.push("<div class=\"den bg-green\" id=\"dev_"+index+"_current_wind_speed_velocity_show_color"+i+"\">");
            show_device_op_settings.push("<div class=\"dene\">");
            show_device_op_settings.push("<div class=\"denem\">");
            show_device_op_settings.push("<div class=\"deneme\" style=\"\">");
            show_device_op_settings.push("<div style=\"margin-top: 20px;margin-left: 15px;font-size: 60px;\" id=\"dev_"+index+"_current_wind_speed_velocity"+i+"\"/>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            
            show_device_op_settings.push("<div data-role=\"tile\" data-size=\"large\" class=\"bg-lime fg-white\">");
            show_device_op_settings.push("<h2 style=\"margin: 0px auto\">目前風向(方向) "+(i+1)+"</h2>");
            show_device_op_settings.push("<div class=\"deneme_font_height\" style=\"margin-top: 15px;margin-left: 12%;\">");
            show_device_op_settings.push("<div class=\"de\" style=\"margin: 0px auto;margin-top: 5px;\">");
            show_device_op_settings.push("<div class=\"den bg-green\">");
            show_device_op_settings.push("<div class=\"dene\">");
            show_device_op_settings.push("<div class=\"denem\">");
            show_device_op_settings.push("<div class=\"deneme\" style=\"\">");
            show_device_op_settings.push("<div style=\"margin-top: 40px;margin-left: 15px;font-size: 40px;\" id=\"dev_"+index+"_current_wind_direction_str"+i+"\"/>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            
            show_device_op_settings.push("<div data-role=\"tile\" data-size=\"large\" class=\"bg-lime fg-white\">");
            show_device_op_settings.push("<h2 style=\"margin: 0px auto\">目前風向(角度) "+(i+1)+"</h2>");
            show_device_op_settings.push("<div class=\"deneme_font_height\" style=\"margin-top: 15px;margin-left: 12%;\">");
            show_device_op_settings.push("<div class=\"de\" style=\"margin: 0px auto;margin-top: 5px;\">");
            show_device_op_settings.push("<div class=\"den bg-green\">");
            show_device_op_settings.push("<div class=\"dene\">");
            show_device_op_settings.push("<div class=\"denem\">");
            show_device_op_settings.push("<div class=\"deneme\" style=\"\">");
            show_device_op_settings.push("<div style=\"margin-top: 30px;margin-left: 15px;font-size: 60px;\" id=\"dev_"+index+"_current_wind_direction_degree"+i+"\"/>");
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

        Update_Wind_Guage_Status(map_device_info_list[Number(index)].device_ID, rsp_json);
        Update_Wind_Guage_Measure(map_device_info_list[Number(index)].device_ID, rsp_json);
    });

}

function Update_Wind_Guage_Status(device_ID, json_rsp_dat)
{
    Update_Wind_Guage_Measure(device_ID, json_rsp_dat)
}

function Update_Wind_Guage_Measure(device_ID, json_rsp_dat)
{
    var dev_index = Find_Device_Index_By_ID(device_ID);
    if(dev_index<0)
    {
        return;
    }

    var wind_speed_index_color_str;
    var wind_speed_velocity_color_str;
    var current_wind_speed_whole_part, current_wind_direction_whole_part;
    var current_wind_speed_comma_part, current_wind_direction_comma_part;
    var show_current_wind_speed = [];
    var show_current_wind_direction = [];
    var current_wind_speed;
    var current_wind_direction;
    var wind_direction_str;
    
    for(var i = 0; i<json_rsp_dat.num_of_wind_guage; i++){
        current_wind_speed = json_rsp_dat.guage_status_list[i].measure_wind_speed;
        current_wind_speed_whole_part = Math.floor(current_wind_speed);
        current_wind_speed_comma_part = Math.round((current_wind_speed-current_wind_speed_whole_part)*100);
        current_wind_direction = json_rsp_dat.guage_status_list[i].measure_wind_direction;
        current_wind_direction_whole_part = Math.floor(current_wind_direction);
        current_wind_direction_comma_part = Math.round((current_wind_direction-current_wind_direction_whole_part)*100);

        if(current_wind_speed<=1.5)
        {
            wind_speed_index_str = "1級";
            wind_speed_index_color_str = "green";
            wind_speed_velocity_color_str = "green";
        }
        else if(current_wind_speed<=3.3)
        {
            wind_speed_index_str = "2級";
            wind_speed_index_color_str = "green";
            wind_speed_velocity_color_str = "green";
        }
        else if(current_wind_speed<=5.4)
        {
            wind_speed_index_str = "3級";
            wind_speed_index_color_str = "green";
            wind_speed_velocity_color_str = "green";
        }
        else if(current_wind_speed<=7.9)
        {
            wind_speed_index_str = "4級";
            wind_speed_index_color_str = "green";
            wind_speed_velocity_color_str = "green";
        }
        else if(current_wind_speed<=10.7)
        {
            wind_speed_index_str = "5級";
            wind_speed_index_color_str = "green";
            wind_speed_velocity_color_str = "green";
        }
        else if(current_wind_speed<=13.8)
        {
            wind_speed_index_str = "6級";
            wind_speed_index_color_str = "green";
            wind_speed_velocity_color_str = "green";
        }
        else if(current_wind_speed<=17.1)
        {
            wind_speed_index_str = "7級";
            wind_speed_index_color_str = "orange";
            wind_speed_velocity_color_str = "orange";
        }
        else if(current_wind_speed<=20.7)
        {
            wind_speed_index_str = "8級";
            wind_speed_index_color_str = "orange";
            wind_speed_velocity_color_str = "orange";
        }
        else if(current_wind_speed<=24.4)
        {
            wind_speed_index_str = "9級";
            wind_speed_index_color_str = "orange";
            wind_speed_velocity_color_str = "orange";
        }
        else if(current_wind_speed<=28.4)
        {
            wind_speed_index_str = "10級";
            wind_speed_index_color_str = "orange";
            wind_speed_velocity_color_str = "orange";
        }
        else if(current_wind_speed<=32.6)
        {
            wind_speed_index_str = "11級";
            wind_speed_index_color_str = "orange";
            wind_speed_velocity_color_str = "orange";
        }
        else if(current_wind_speed<=36.9)
        {
            wind_speed_index_str = "12級";
            wind_speed_index_color_str = "red";
            wind_speed_velocity_color_str = "red";
        }
        else if(current_wind_speed<=41.4)
        {
            wind_speed_index_str = "13級";
            wind_speed_index_color_str = "red";
            wind_speed_velocity_color_str = "red";
        }
        else if(current_wind_speed<=46.1)
        {
            wind_speed_index_str = "14級";
            wind_speed_index_color_str = "red";
            wind_speed_velocity_color_str = "red";
        }
        else if(current_wind_speed<=50.9)
        {
            wind_speed_index_str = "15級";
            wind_speed_index_color_str = "red";
            wind_speed_velocity_color_str = "red";
        }
        else if(current_wind_speed<=56)
        {
            wind_speed_index_str = "16級";
            wind_speed_index_color_str = "purple";
            wind_speed_velocity_color_str = "purple";
        }
        else if(current_wind_speed<=61.2)
        {
            wind_speed_index_str = "17級";
            wind_speed_index_color_str = "purple";
            wind_speed_velocity_color_str = "purple";
        }
        else
        {
            wind_speed_index_str = ">17級";
            wind_speed_index_color_str = "purple";
            wind_speed_velocity_color_str = "purple";
        }

        if(current_wind_speed>0.2)
        {
            if(current_wind_direction<11.25 || current_wind_direction>=384.76)
            {
                wind_direction_str = "北";
            }
            else if(current_wind_direction<33.75)
            {
                wind_direction_str = "北東北";
            }
            else if(current_wind_direction<56.25)
            {
                wind_direction_str = "東北";
            }
            else if(current_wind_direction<78.75)
            {
                wind_direction_str = "東東北";
            }
            else if(current_wind_direction<101.25)
            {
                wind_direction_str = "東";
            }
            else if(current_wind_direction<123.75)
            {
                wind_direction_str = "東東南";
            }
            else if(current_wind_direction<146.25)
            {
                wind_direction_str = "東南";
            }
            else if(current_wind_direction<168.75)
            {
                wind_direction_str = "南東南";
            }
            else if(current_wind_direction<191.25)
            {
                wind_direction_str = "南";
            }
            else if(current_wind_direction<213.75)
            {
                wind_direction_str = "南西南";
            }
            else if(current_wind_direction<236.25)
            {
                wind_direction_str = "西南";
            }
            else if(current_wind_direction<258.75)
            {
                wind_direction_str = "西西南";
            }
            else if(current_wind_direction<281.25)
            {
                wind_direction_str = "西";
            }
            else if(current_wind_direction<303.75)
            {
                wind_direction_str = "西西北";
            }
            else if(current_wind_direction<326.25)
            {
                wind_direction_str = "西北";
            }
            else if(current_wind_direction<348.75)
            {
                wind_direction_str = "北西北";
            }
        }
        else{
            wind_direction_str = "靜風";
        }
        
        if($("#dev_"+dev_index+"_current_wind_speed_velocity" + i)!=null){
            show_current_wind_speed = [];
            show_current_wind_speed.push(current_wind_speed_whole_part+"<span>."+current_wind_speed_comma_part+"</span><div style=\"margin-top: -10px;font-size: 30px;\">m/sec</div>");
        
            
            $("#dev_"+dev_index+"_current_wind_speed_velocity"+i).html("");
            $("#dev_"+dev_index+"_current_wind_speed_velocity"+i).html(show_current_wind_speed.join(''));
            
            if($("#dev_"+dev_index+"_current_wind_speed_velocity_show_color"+i)!=null){
                $("#dev_"+dev_index+"_current_wind_speed_velocity_show_color"+i).removeAttr("class");
                $("#dev_"+dev_index+"_current_wind_speed_velocity_show_color"+i).addClass('den bg-' + wind_speed_velocity_color_str);
            }
        }

        if($("#dev_"+dev_index+"_current_wind_speed_index" + i)!=null){
            $("#dev_"+dev_index+"_current_wind_speed_index"+i).html("");
            $("#dev_"+dev_index+"_current_wind_speed_index"+i).html(wind_speed_index_str);
            
            if($("#dev_"+dev_index+"_current_wind_speed_index_show_color"+i)!=null){
                $("#dev_"+dev_index+"_current_wind_speed_index_show_color"+i).removeAttr("class");
                $("#dev_"+dev_index+"_current_wind_speed_index_show_color"+i).addClass('den bg-' + wind_speed_index_color_str);
            }
        }
        
        if($("#dev_"+dev_index+"_current_wind_direction_str" + i)!=null){
            $("#dev_"+dev_index+"_current_wind_direction_str"+i).html("");
            $("#dev_"+dev_index+"_current_wind_direction_str"+i).html(wind_direction_str);
        }

        if($("#dev_"+dev_index+"_current_wind_direction_degree" + i)!=null){
            show_current_wind_direction = [];
            show_current_wind_direction.push(current_wind_direction_whole_part+"<span>."+current_wind_direction_comma_part+"</span><strong style=\"right: 0px;top: 0px\">°</strong>");
            
            $("#dev_"+dev_index+"_current_wind_direction_degree"+i).html("");
            $("#dev_"+dev_index+"_current_wind_direction_degree"+i).html(show_current_wind_direction.join(''));
        }
    }
}

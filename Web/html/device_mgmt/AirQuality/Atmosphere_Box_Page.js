$('head').append('<link rel="stylesheet" type="text/css" href="../../css/circle-meter.css">');

function Handle_Device_WebSocket_POST_Message(in_json)
{
    if(in_json.topic!=null){
        if(in_json.topic=='AirQuality'){
            if(in_json.command_type!=null){
                switch(in_json.command_type){
                    case "Atmosphere Box":
                        if(in_json.command!=null){
                            switch(in_json.command){
                                case "Report Atmosphere Box Current Measure":
                                    Update_Atmosphere_Box_Measure(in_json.device_ID, in_json);
                                    break;
                                case "Report Atmosphere Box Status Change":
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
    return "空氣盒子";
}

function Print_Device_Management_Toolbar(print_info_dst_id)
{

}

function Print_Device_Operation_Toolbar(index, print_info_dst_id)
{

}

function Show_Device_Operation_Settings(index, print_info_dst_id, update_online_status_cb)
{
    GET_Atmosphere_Box_Seneor_Status(map_device_info_list[Number(index)].device_ID, function(rsp_json){
        var show_device_op_settings = [];
        
        if(rsp_json.timeout)
        {
            update_online_status_cb(false);
            return;
        }
        update_online_status_cb(true);

        show_device_op_settings.push("<div class=\"row\">");
        show_device_op_settings.push("<h2 class=\"fg-teal\">空氣盒子狀態:</h2>");
        show_device_op_settings.push("</div>");

        show_device_op_settings.push("<div class=\"row\">");
        show_device_op_settings.push("<div class=\"cell-12\">");
        show_device_op_settings.push("<div class=\"tiles-grid\">");

        if(rsp_json.measure_temperature!=null)
        {
            show_device_op_settings.push("<div data-role=\"tile\" data-size=\"large\" class=\"bg-teal fg-white\">");
            show_device_op_settings.push("<h2 style=\"margin-top: 5px; text-align: center;\">溫度(°C)</h2>");
            show_device_op_settings.push("<div class=\"deneme_font_height\" style=\"margin-top: 15px;margin-left: 12%;\">");
            show_device_op_settings.push("<div class=\"de\">");
            show_device_op_settings.push("<div class=\"den\" id=\"dev_"+index+"_current_temp_show_color\" style=\"background:gray;\">");
            show_device_op_settings.push("<div class=\"dene\">");
            show_device_op_settings.push("<div class=\"denem\">");
            show_device_op_settings.push("<div class=\"deneme deneme_font_align\">");
            show_device_op_settings.push("<div id=\"dev_"+index+"_current_temp\"/>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
        }
        
        if(rsp_json.measure_humidity!=null)
        {
            show_device_op_settings.push("<div data-role=\"tile\" data-size=\"large\" class=\"bg-teal fg-white\">");
            show_device_op_settings.push("<h2 style=\"margin-top: 5px; text-align: center;\">濕度(%)</h2>");
            show_device_op_settings.push("<div class=\"deneme_font_height\" style=\"margin-top: 15px;margin-left: 12%;\">");
            show_device_op_settings.push("<div class=\"de\">");
            show_device_op_settings.push("<div class=\"den\" id=\"dev_"+index+"_current_humidity_show_color\" style=\"background:gray;\">");
            show_device_op_settings.push("<div class=\"dene\">");
            show_device_op_settings.push("<div class=\"denem\">");
            show_device_op_settings.push("<div class=\"deneme deneme_font_align\">");
            show_device_op_settings.push("<div id=\"dev_"+index+"_current_humidity\"/>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
        }
        
        if(rsp_json.measure_pm_2_5!=null)
        {
            show_device_op_settings.push("<div data-role=\"tile\" data-size=\"large\" class=\"bg-teal fg-white\">");
            show_device_op_settings.push("<h2 style=\"margin-top: 5px; text-align: center;\">PM2.5(ug/m3)</h2>");
            show_device_op_settings.push("<div class=\"deneme_font_height\" style=\"margin-top: 15px;margin-left: 12%;\">");
            show_device_op_settings.push("<div class=\"de\">");
            show_device_op_settings.push("<div class=\"den\" id=\"dev_"+index+"_current_pm_2_5_show_color\" style=\"background:gray;\">");
            show_device_op_settings.push("<div class=\"dene\">");
            show_device_op_settings.push("<div class=\"denem\">");
            show_device_op_settings.push("<div class=\"deneme deneme_font_align\">");
            show_device_op_settings.push("<div style=\"margin-top: 24px;font-size: 55px;\" id=\"dev_"+index+"_current_pm_2_5\"/>");
            show_device_op_settings.push("<div style=\"margin-top: -8px;font-size: 30px;\">ug/m3</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
        }
        
        if(rsp_json.measure_tvoc!=null)
        {
            show_device_op_settings.push("<div data-role=\"tile\" data-size=\"large\" class=\"bg-teal fg-white\">");
            show_device_op_settings.push("<h2 style=\"margin-top: 5px; text-align: center;\">TVOC(ppb)</h2>");
            show_device_op_settings.push("<div class=\"deneme_font_height\" style=\"margin-top: 15px;margin-left: 12%;\">");
            show_device_op_settings.push("<div class=\"de\">");
            show_device_op_settings.push("<div class=\"den\" id=\"dev_"+index+"_current_tvoc_show_color\" style=\"background:gray;\">");
            show_device_op_settings.push("<div class=\"dene\">");
            show_device_op_settings.push("<div class=\"denem\">");
            show_device_op_settings.push("<div class=\"deneme deneme_font_align\">");
            show_device_op_settings.push("<div style=\"margin-top: 24px;font-size: 55px;\" id=\"dev_"+index+"_current_tvoc\"/>");
            show_device_op_settings.push("<div style=\"margin-top: -8px;font-size: 30px;\">PPB</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
        }
        
        if(rsp_json.measure_co_ppm!=null)
        {
            show_device_op_settings.push("<div data-role=\"tile\" data-size=\"large\" class=\"bg-teal fg-white\">");
            show_device_op_settings.push("<h2 style=\"margin-top: 5px; text-align: center;\">CO(ppm)</h2>");
            show_device_op_settings.push("<div class=\"deneme_font_height\" style=\"margin-top: 15px;margin-left: 12%;\">");
            show_device_op_settings.push("<div class=\"de\">");
            show_device_op_settings.push("<div class=\"den\" id=\"dev_"+index+"_current_co_show_color\" style=\"background:gray;\">");
            show_device_op_settings.push("<div class=\"dene\">");
            show_device_op_settings.push("<div class=\"denem\">");
            show_device_op_settings.push("<div class=\"deneme deneme_font_align\">");
            show_device_op_settings.push("<div style=\"margin-top: 24px;font-size: 55px;\" id=\"dev_"+index+"_current_co\"/>");
            show_device_op_settings.push("<div style=\"margin-top: -8px;font-size: 30px;\">PPM</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
        }
        
        if(rsp_json.measure_co2_ppm!=null)
        {
            show_device_op_settings.push("<div data-role=\"tile\" data-size=\"large\" class=\"bg-teal fg-white\">");
            show_device_op_settings.push("<h2 style=\"margin-top: 5px; text-align: center;\">CO2(ppm)</h2>");
            show_device_op_settings.push("<div class=\"deneme_font_height\" style=\"margin-top: 15px;margin-left: 12%;\">");
            show_device_op_settings.push("<div class=\"de\">");
            show_device_op_settings.push("<div class=\"den\" id=\"dev_"+index+"_current_co2_show_color\" style=\"background:gray;\">");
            show_device_op_settings.push("<div class=\"dene\">");
            show_device_op_settings.push("<div class=\"denem\">");
            show_device_op_settings.push("<div class=\"deneme deneme_font_align\">");
            show_device_op_settings.push("<div style=\"margin-top: 24px;font-size: 55px;\" id=\"dev_"+index+"_current_co2\"/>");
            show_device_op_settings.push("<div style=\"margin-top: -8px;font-size: 30px;\">PPM</div>");
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

        $('#'+print_info_dst_id).html('');
        $('#'+print_info_dst_id).html(show_device_op_settings.join(''));

        Update_Atmosphere_Box_Status(map_device_info_list[Number(index)].device_ID, rsp_json);
        Update_Atmosphere_Box_Measure(map_device_info_list[Number(index)].device_ID, rsp_json);
    });

}

function Update_Atmosphere_Box_Status(device_ID, json_rsp_dat)
{

}

function Update_Atmosphere_Box_Measure(device_ID, json_rsp_dat)
{
    var dev_index = Find_Device_Index_By_ID(device_ID);
    if(dev_index<0)
    {
        return;
    }

    var color;
    
    if($("dev_"+dev_index+"_current_temp")!=null){
        var current_temp = json_rsp_dat.measure_temperature;
        var current_temp_whole_part = Math.floor(current_temp);
        var current_temp_comma_part = Math.round((current_temp-current_temp_whole_part)*100);
        var show_current_temp = [];
        
        show_current_temp.push(current_temp_whole_part+"<span>."+current_temp_comma_part+"</span><strong>°</strong>");
        
        $("#dev_"+dev_index+"_current_temp").html("");
        $("#dev_"+dev_index+"_current_temp").html(show_current_temp.join(''));

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

        if($("dev_"+dev_index+"_current_temp_show_color")!=null){
            $("#dev_"+dev_index+"_current_temp_show_color").removeAttr("class");
            $("#dev_"+dev_index+"_current_temp_show_color").addClass('den bg-' + color);
        }
    }
    
    if($("dev_"+dev_index+"_current_humidity")!=null){
        var current_humidity = json_rsp_dat.measure_humidity;
        var current_humidity_whole_part = Math.floor(current_humidity);
        var current_humidity_comma_part = Math.round((current_humidity-current_humidity_whole_part)*100);
        var show_current_humidity = [];

        show_current_humidity.push(current_humidity_whole_part+"<span>."+current_humidity_comma_part+"</span><strong style=\"left: 100px\">%</strong>");
        
        $("#dev_"+dev_index+"_current_humidity").html("");
        $("#dev_"+dev_index+"_current_humidity").html(show_current_humidity.join(''));
        
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

        if($("dev_"+dev_index+"_current_humidity_show_color")!=null){
            $("#dev_"+dev_index+"_current_humidity_show_color").removeAttr("class");
            $("#dev_"+dev_index+"_current_humidity_show_color").addClass('den bg-' + color);
        }
    }

    if($("dev_"+dev_index+"_current_pm_2_5")!=null){
        var current_pm_2_5 = json_rsp_dat.measure_pm_2_5;
        var current_pm_2_5_whole_part = Math.floor(current_pm_2_5);
        var current_pm_2_5_comma_part = Math.round((current_pm_2_5-current_pm_2_5_whole_part)*100);
        var show_current_pm_2_5 = [];
        
        show_current_pm_2_5.push(current_pm_2_5_whole_part+"<span>."+current_pm_2_5_comma_part+"</span>");
        
        $("#dev_"+dev_index+"_current_pm_2_5").html("");
        $("#dev_"+dev_index+"_current_pm_2_5").html(show_current_pm_2_5.join(''));
        
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

        if($("dev_"+dev_index+"_current_pm_2_5_show_color")!=null){
            $("#dev_"+dev_index+"_current_pm_2_5_show_color").removeAttr("class");
            $("#dev_"+dev_index+"_current_pm_2_5_show_color").addClass('den bg-' + color);
        }
    }

    if($("dev_"+dev_index+"_current_tvoc")!=null){
        var current_tvoc = json_rsp_dat.measure_tvoc;
        var current_tvoc_whole_part = Math.floor(current_tvoc);
        var current_tvoc_comma_part = Math.round((current_tvoc-current_tvoc_whole_part)*100);
        var show_current_tvoc = [];
        
        show_current_tvoc.push(current_tvoc_whole_part+"<span>."+current_tvoc_comma_part+"</span>");
        
        $("#dev_"+dev_index+"_current_tvoc").html("");
        $("#dev_"+dev_index+"_current_tvoc").html(show_current_tvoc.join(''));
        
        if($("dev_"+dev_index+"_current_tvoc_show_color")!=null){
            $("#dev_"+dev_index+"_current_tvoc_show_color").removeAttr("class");
            $("#dev_"+dev_index+"_current_tvoc_show_color").addClass('den bg-green');
        }
    }

    if($("dev_"+dev_index+"_current_co")!=null){
        var current_co = json_rsp_dat.measure_co_ppm;
        var current_co_whole_part = Math.floor(current_co);
        var current_co_comma_part = Math.round((current_co-current_co_whole_part)*100);
        var show_current_co = [];
        
        show_current_co.push(current_co_whole_part+"<span>."+current_co_comma_part+"</span>");
        
        $("#dev_"+dev_index+"_current_co").html("");
        $("#dev_"+dev_index+"_current_co").html(show_current_co.join(''));
        
        if(current_co<200){
            color = "lime";
        }
        else if(current_co<400){
            color = "teal";
        }
        else if(current_co<800){
            color = "orange";
        }
        else if(current_co<1600){
            color = "pumpkin";
        }
        else if(current_co<3200){
            color = "red";
        }
        else if(current_co<6400){
            color = "purple";
        }
        else if(current_co<12800){
            color = "wisteria";
        }
        else{
            color = "grayBlue";
        }
        
        if($("dev_"+dev_index+"_current_co_show_color")!=null){
            $("#dev_"+dev_index+"_current_co_show_color").removeAttr("class");
            $("#dev_"+dev_index+"_current_co_show_color").addClass('den bg-' + color);
        }
    }

    if($("dev_"+dev_index+"_current_co2")!=null){
        var current_co2 = json_rsp_dat.measure_co2_ppm;
        var current_co2_whole_part = Math.floor(current_co2);
        var current_co2_comma_part = Math.round((current_co2-current_co2_whole_part)*100);
        var show_current_co2 = [];
        
        show_current_co2.push(current_co2_whole_part+"<span>."+current_co2_comma_part+"</span>");
        
        $("#dev_"+dev_index+"_current_co2").html("");
        $("#dev_"+dev_index+"_current_co2").html(show_current_co2.join(''));
        
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
        
        if($("dev_"+dev_index+"_current_co2_show_color")!=null){
            $("#dev_"+dev_index+"_current_co2_show_color").removeAttr("class");
            $("#dev_"+dev_index+"_current_co2_show_color").addClass('den bg-' + color);
        }
    }
}

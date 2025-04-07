$('head').append('<link rel="stylesheet" type="text/css" href="../../css/circle-meter.css">');

function Handle_Device_WebSocket_POST_Message(in_json)
{
    if(in_json.topic!=null){
        if(in_json.topic=='Weather'){
            if(in_json.command_type!=null){
                switch(in_json.command_type){
                    case "Weather Station":
                        if(in_json.command!=null){
                            switch(in_json.command){
                                case "Report Weather Station Current Measure":
                                    Update_Weather_Station_Measure(in_json.device_ID, in_json);
                                    break;
                                case "Report Weather Station Status Change":
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
    return "微型氣象站";
}

function Print_Device_Management_Toolbar(print_info_dst_id)
{

}

function Print_Device_Operation_Toolbar(index, print_info_dst_id)
{

}

function Show_Device_Operation_Settings(index, print_info_dst_id, update_online_status_cb)
{
    GET_Weather_Station_Current_Measure(map_device_info_list[Number(index)].device_ID, function(rsp_json){
        var show_device_op_settings = [];
        
        if(rsp_json.timeout)
        {
            update_online_status_cb(false);
            return;
        }
        update_online_status_cb(true);

        show_device_op_settings.push("<div class=\"row\">");
        show_device_op_settings.push("<h2 class=\"fg-teal\">氣象站狀態:</h2>");
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
            show_device_op_settings.push("<div style=\"margin-top: 28px;font-size: 60px;\" id=\"dev_"+index+"_current_temp\"></div>");
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
            show_device_op_settings.push("<div style=\"margin-top: 28px;font-size: 60px;\" id=\"dev_"+index+"_current_humidity\"></div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
        }
        
        if(rsp_json.measure_rain_rate_mm_hr!=null)
        {
            show_device_op_settings.push("<div data-role=\"tile\" data-size=\"large\" class=\"bg-teal fg-white\">");
            show_device_op_settings.push("<h2 style=\"margin-top: 5px; text-align: center;\">降雨量(mm/Hr)</h2>");
            show_device_op_settings.push("<div class=\"deneme_font_height\" style=\"margin-top: 15px;margin-left: 12%;\">");
            show_device_op_settings.push("<div class=\"de\">");
            show_device_op_settings.push("<div class=\"den\" id=\"dev_"+index+"_current_rain_rate_show_color\" style=\"background:gray;\">");
            show_device_op_settings.push("<div class=\"dene\">");
            show_device_op_settings.push("<div class=\"denem\">");
            show_device_op_settings.push("<div class=\"deneme deneme_font_align\">");
            show_device_op_settings.push("<div style=\"margin-top: 24px;font-size: 55px;\" id=\"dev_"+index+"_current_rain_rate\"></div>");
            show_device_op_settings.push("<div style=\"margin-top: -8px;font-size: 30px;\">mm/Hr</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
        }
        
        if(rsp_json.measure_wind_speed!=null)
        {
            show_device_op_settings.push("<div data-role=\"tile\" data-size=\"large\" class=\"bg-teal fg-white\">");
            show_device_op_settings.push("<h2 style=\"margin-top: 5px; text-align: center;\">風速(m/s)</h2>");
            show_device_op_settings.push("<div class=\"deneme_font_height\" style=\"margin-top: 15px;margin-left: 12%;\">");
            show_device_op_settings.push("<div class=\"de\">");
            show_device_op_settings.push("<div class=\"den\" id=\"dev_"+index+"_current_wind_speed_show_color\" style=\"background:gray;\">");
            show_device_op_settings.push("<div class=\"dene\">");
            show_device_op_settings.push("<div class=\"denem\">");
            show_device_op_settings.push("<div class=\"deneme deneme_font_align\">");
            show_device_op_settings.push("<div style=\"margin-top: 24px;font-size: 55px;\" id=\"dev_"+index+"_current_wind_speed\"></div>");
            show_device_op_settings.push("<div style=\"margin-top: -8px;font-size: 30px;\">m/s</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
        }
        
        if(rsp_json.measure_wind_direction!=null)
        {
            show_device_op_settings.push("<div data-role=\"tile\" data-size=\"large\" class=\"bg-teal fg-white\">");
            show_device_op_settings.push("<h2 style=\"margin-top: 5px; text-align: center;\">風向(角度)</h2>");
            show_device_op_settings.push("<div class=\"deneme_font_height\" style=\"margin-top: 15px;margin-left: 12%;\">");
            show_device_op_settings.push("<div class=\"de\">");
            show_device_op_settings.push("<div class=\"den\" id=\"dev_"+index+"_current_wind_direction_show_color\" style=\"background:gray;\">");
            show_device_op_settings.push("<div class=\"dene\">");
            show_device_op_settings.push("<div class=\"denem\">");
            show_device_op_settings.push("<div class=\"deneme deneme_font_align\">");
            show_device_op_settings.push("<div style=\"margin-top: 28px;font-size: 60px;\" id=\"dev_"+index+"_current_wind_direction\"></div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
        }
        
        if(rsp_json.measure_solar_radiation!=null)
        {
            show_device_op_settings.push("<div data-role=\"tile\" data-size=\"large\" class=\"bg-teal fg-white\">");
            show_device_op_settings.push("<h2 style=\"margin-top: 5px; text-align: center;\">太陽照度(W/m2)</h2>");
            show_device_op_settings.push("<div class=\"deneme_font_height\" style=\"margin-top: 15px;margin-left: 12%;\">");
            show_device_op_settings.push("<div class=\"de\">");
            show_device_op_settings.push("<div class=\"den\" id=\"dev_"+index+"_current_solar_radiation_show_color\" style=\"background:gray;\">");
            show_device_op_settings.push("<div class=\"dene\">");
            show_device_op_settings.push("<div class=\"denem\">");
            show_device_op_settings.push("<div class=\"deneme deneme_font_align\">");
            show_device_op_settings.push("<div style=\"margin-top: 24px;font-size: 55px;\" id=\"dev_"+index+"_current_solar_radiation\"></div>");
            show_device_op_settings.push("<div style=\"margin-top: -8px;font-size: 30px;\">W/m2</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
        }
        
        if(rsp_json.measure_UV_index!=null)
        {
            show_device_op_settings.push("<div data-role=\"tile\" data-size=\"large\" class=\"bg-teal fg-white\">");
            show_device_op_settings.push("<h2 style=\"margin-top: 5px; text-align: center;\">紫外線指數</h2>");
            show_device_op_settings.push("<div class=\"deneme_font_height\" style=\"margin-top: 15px;margin-left: 12%;\">");
            show_device_op_settings.push("<div class=\"de\">");
            show_device_op_settings.push("<div class=\"den\" id=\"dev_"+index+"_current_UV_index_show_color\" style=\"background:gray;\">");
            show_device_op_settings.push("<div class=\"dene\">");
            show_device_op_settings.push("<div class=\"denem\">");
            show_device_op_settings.push("<div class=\"deneme deneme_font_align\">");
            show_device_op_settings.push("<div style=\"margin-top: 28px;font-size: 60px;\" id=\"dev_"+index+"_current_UV_index\"></div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
        }
        
        if(rsp_json.measure_UV_MED_hr!=null)
        {
            show_device_op_settings.push("<div data-role=\"tile\" data-size=\"large\" class=\"bg-teal fg-white\">");
            show_device_op_settings.push("<h2 style=\"margin-top: 5px; text-align: center;\">紫外線強度(med/Hr)</h2>");
            show_device_op_settings.push("<div class=\"deneme_font_height\" style=\"margin-top: 15px;margin-left: 12%;\">");
            show_device_op_settings.push("<div class=\"de\">");
            show_device_op_settings.push("<div class=\"den\" id=\"dev_"+index+"_current_UV_MED_hr_show_color\" style=\"background:gray;\">");
            show_device_op_settings.push("<div class=\"dene\">");
            show_device_op_settings.push("<div class=\"denem\">");
            show_device_op_settings.push("<div class=\"deneme deneme_font_align\">");
            show_device_op_settings.push("<div style=\"margin-top: 24px;font-size: 55px;\" id=\"dev_"+index+"_current_UV_MED_hr\"></div>");
            show_device_op_settings.push("<div style=\"margin-top: -8px;font-size: 30px;\">MED/Hr</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
        }
        
        if(rsp_json.measure_soil_temperature!=null)
        {
            show_device_op_settings.push("<div data-role=\"tile\" data-size=\"large\" class=\"bg-teal fg-white\">");
            show_device_op_settings.push("<h2 style=\"margin-top: 5px; text-align: center;\">土壤溫度(°C)</h2>");
            show_device_op_settings.push("<div class=\"deneme_font_height\" style=\"margin-top: 15px;margin-left: 12%;\">");
            show_device_op_settings.push("<div class=\"de\">");
            show_device_op_settings.push("<div class=\"den\" id=\"dev_"+index+"_current_soil_temp_show_color\" style=\"background:gray;\">");
            show_device_op_settings.push("<div class=\"dene\">");
            show_device_op_settings.push("<div class=\"denem\">");
            show_device_op_settings.push("<div class=\"deneme deneme_font_align\">");
            show_device_op_settings.push("<div style=\"margin-top: 28px;font-size: 60px;\" id=\"dev_"+index+"_current_soil_temp\"></div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
        }
        
        if(rsp_json.measure_soil_moisture!=null)
        {
            show_device_op_settings.push("<div data-role=\"tile\" data-size=\"large\" class=\"bg-teal fg-white\">");
            show_device_op_settings.push("<h2 style=\"margin-top: 5px; text-align: center;\">土壤濕度(CB)</h2>");
            show_device_op_settings.push("<div class=\"deneme_font_height\" style=\"margin-top: 15px;margin-left: 12%;\">");
            show_device_op_settings.push("<div class=\"de\">");
            show_device_op_settings.push("<div class=\"den\" id=\"dev_"+index+"_current_soil_moisture_show_color\" style=\"background:gray;\">");
            show_device_op_settings.push("<div class=\"dene\">");
            show_device_op_settings.push("<div class=\"denem\">");
            show_device_op_settings.push("<div class=\"deneme deneme_font_align\">");
            show_device_op_settings.push("<div style=\"margin-top: 24px;font-size: 55px;\" id=\"dev_"+index+"_current_soil_moisture\"></div>");
            show_device_op_settings.push("<div style=\"margin-top: -8px;font-size: 30px;\">CB</div>");
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

        Update_Weather_Station_Status(map_device_info_list[Number(index)].device_ID, rsp_json);
        Update_Weather_Station_Measure(map_device_info_list[Number(index)].device_ID, rsp_json);
    });

}

function Update_Weather_Station_Status(device_ID, json_rsp_dat)
{

}

function Update_Weather_Station_Measure(device_ID, json_rsp_dat)
{
    var dev_index = Find_Device_Index_By_ID(device_ID);
    if(dev_index<0)
    {
        return;
    }

    var color;
    
    if($("#dev_"+dev_index+"_current_temp")!=null){
        var current_temp = json_rsp_dat.measure_temperature;
        var current_temp_str = String(Math.round(current_temp*100)/100);
        var comma_index = current_temp_str.indexOf(".");
        var current_temp_whole_part_str = (comma_index>=0)?current_temp_str.substring(0,comma_index):current_temp_str;
        var current_temp_comma_part_str = (comma_index>=0)?current_temp_str.substring(comma_index+1):"0";
        var show_current_temp = [];
        
        show_current_temp.push(current_temp_whole_part_str+"<span>."+current_temp_comma_part_str+"</span><strong style=\"top: 5px\">°</strong>");
        
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

        if($("#dev_"+dev_index+"_current_temp_show_color")!=null){
            $("#dev_"+dev_index+"_current_temp_show_color").removeAttr("class");
            $("#dev_"+dev_index+"_current_temp_show_color").addClass('den bg-' + color);
        }
    }
    
    if($("#dev_"+dev_index+"_current_humidity")!=null){
        var current_humidity = json_rsp_dat.measure_humidity;
        var current_humidity_str = String(Math.round(current_humidity*100)/100);
        var comma_index = current_humidity_str.indexOf(".");
        var current_humidity_whole_part_str = (comma_index>=0)?current_humidity_str.substring(0,comma_index):current_humidity_str;
        var current_humidity_comma_part_str = (comma_index>=0)?current_humidity_str.substring(comma_index+1):"0";
        var show_current_humidity = [];

        show_current_humidity.push(current_humidity_whole_part_str+"<span>."+current_humidity_comma_part_str+"</span><strong style=\"left: 100px; top: 0px\">%</strong>");
        
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

        if($("#dev_"+dev_index+"_current_humidity_show_color")!=null){
            $("#dev_"+dev_index+"_current_humidity_show_color").removeAttr("class");
            $("#dev_"+dev_index+"_current_humidity_show_color").addClass('den bg-' + color);
        }
    }
    
    if($("#dev_"+dev_index+"_current_rain_rate")!=null){
        var current_rain_rate = json_rsp_dat.measure_rain_rate_mm_hr;
        var current_rain_rate_str = String(Math.round(current_rain_rate*100)/100);
        var comma_index = current_rain_rate_str.indexOf(".");
        var current_rain_rate_whole_part_str = (comma_index>=0)?current_rain_rate_str.substring(0,comma_index):current_rain_rate_str;
        var current_rain_rate_comma_part_str = (comma_index>=0)?current_rain_rate_str.substring(comma_index+1):"0";
        var show_current_rain_rate = [];

        show_current_rain_rate.push(current_rain_rate_whole_part_str+"<span>."+current_rain_rate_comma_part_str+"</span>");
        
        $("#dev_"+dev_index+"_current_rain_rate").html("");
        $("#dev_"+dev_index+"_current_rain_rate").html(show_current_rain_rate.join(''));
        
        if($("#dev_"+dev_index+"_current_rain_rate_show_color")!=null){
            $("#dev_"+dev_index+"_current_rain_rate_show_color").removeAttr("class");
            $("#dev_"+dev_index+"_current_rain_rate_show_color").addClass('den bg-blue');
        }
    }

    if($("#dev_"+dev_index+"_current_wind_speed")!=null){
        var current_wind_speed = json_rsp_dat.measure_wind_speed;
        var current_wind_speed_str = String(Math.round(current_wind_speed*100)/100);
        var comma_index = current_wind_speed_str.indexOf(".");
        var current_wind_speed_whole_part_str = (comma_index>=0)?current_wind_speed_str.substring(0,comma_index):current_wind_speed_str;
        var current_wind_speed_comma_part_str = (comma_index>=0)?current_wind_speed_str.substring(comma_index+1):"0";
        var show_current_wind_speed = [];

        show_current_wind_speed.push(current_wind_speed_whole_part_str+"<span>."+current_wind_speed_comma_part_str+"</span>");
        
        $("#dev_"+dev_index+"_current_wind_speed").html("");
        $("#dev_"+dev_index+"_current_wind_speed").html(show_current_wind_speed.join(''));
        
        if($("#dev_"+dev_index+"_current_wind_speed_show_color")!=null){
            $("#dev_"+dev_index+"_current_wind_speed_show_color").removeAttr("class");
            $("#dev_"+dev_index+"_current_wind_speed_show_color").addClass('den bg-green');
        }
    }
    
    if($("#dev_"+dev_index+"_current_wind_direction")!=null){
        var current_wind_direction = json_rsp_dat.measure_wind_direction;
        var current_wind_direction_str = String(Math.round(current_wind_direction*100)/100);
        var comma_index = current_wind_direction_str.indexOf(".");
        var current_wind_direction_whole_part_str = (comma_index>=0)?current_wind_direction_str.substring(0,comma_index):current_wind_direction_str;
        var current_wind_direction_comma_part_str = (comma_index>=0)?current_wind_direction_str.substring(comma_index+1):"0";
        var show_current_wind_direction = [];

        show_current_wind_direction.push(current_wind_direction_whole_part_str+"<span>."+current_wind_direction_comma_part_str+"</span><strong>°</strong>");
        
        $("#dev_"+dev_index+"_current_wind_direction").html("");
        $("#dev_"+dev_index+"_current_wind_direction").html(show_current_wind_direction.join(''));
        
        if($("#dev_"+dev_index+"_current_wind_direction_show_color")!=null){
            $("#dev_"+dev_index+"_current_wind_direction_show_color").removeAttr("class");
            $("#dev_"+dev_index+"_current_wind_direction_show_color").addClass('den bg-green');
        }
    }
    
    if($("#dev_"+dev_index+"_current_solar_radiation")!=null){
        var current_solar_radiation = json_rsp_dat.measure_solar_radiation;
        var current_solar_radiation_str = String(Math.round(current_solar_radiation*100)/100);
        var comma_index = current_solar_radiation_str.indexOf(".");
        var current_solar_radiation_whole_part_str = (comma_index>=0)?current_solar_radiation_str.substring(0,comma_index):current_solar_radiation_str;
        var current_solar_radiation_comma_part_str = (comma_index>=0)?current_solar_radiation_str.substring(comma_index+1):"0";
        var show_current_solar_radiation = [];

        show_current_solar_radiation.push(current_solar_radiation_whole_part_str+"<span>."+current_solar_radiation_comma_part_str+"</span>");
        
        $("#dev_"+dev_index+"_current_solar_radiation").html("");
        $("#dev_"+dev_index+"_current_solar_radiation").html(show_current_solar_radiation.join(''));
        
        if($("#dev_"+dev_index+"_current_solar_radiation_show_color")!=null){
            $("#dev_"+dev_index+"_current_solar_radiation_show_color").removeAttr("class");
            $("#dev_"+dev_index+"_current_solar_radiation_show_color").addClass('den bg-orange');
        }
    }

    if($("#dev_"+dev_index+"_current_UV_index")!=null){
        var current_UV_index = json_rsp_dat.measure_UV_index;
        var current_UV_index_str = String(Math.round(current_UV_index*100)/100);
        var comma_index = current_UV_index_str.indexOf(".");
        var current_UV_index_whole_part_str = (comma_index>=0)?current_UV_index_str.substring(0,comma_index):current_UV_index_str;
        var current_UV_index_comma_part_str = (comma_index>=0)?current_UV_index_str.substring(comma_index+1):"0";
        var show_current_UV_index = [];

        show_current_UV_index.push(current_UV_index_whole_part_str+"<span>."+current_UV_index_comma_part_str+"</span>");
        
        $("#dev_"+dev_index+"_current_UV_index").html("");
        $("#dev_"+dev_index+"_current_UV_index").html(show_current_UV_index.join(''));
        
        if($("#dev_"+dev_index+"_current_UV_index_show_color")!=null){
            $("#dev_"+dev_index+"_current_UV_index_show_color").removeAttr("class");
            $("#dev_"+dev_index+"_current_UV_index_show_color").addClass('den bg-purple');
        }
    }
    
    if($("#dev_"+dev_index+"_current_UV_MED_hr")!=null){
        var current_UV_MED_hr = json_rsp_dat.measure_UV_MED_hr;
        var current_UV_MED_hr_str = String(Math.round(current_UV_MED_hr*100)/100);
        var comma_index = current_UV_MED_hr_str.indexOf(".");
        var current_UV_MED_hr_whole_part_str = (comma_index>=0)?current_UV_MED_hr_str.substring(0,comma_index):current_UV_MED_hr_str;
        var current_UV_MED_hr_comma_part_str = (comma_index>=0)?current_UV_MED_hr_str.substring(comma_index+1):"0";
        var show_current_UV_MED_hr = [];

        show_current_UV_MED_hr.push(current_UV_MED_hr_whole_part_str+"<span>."+current_UV_MED_hr_comma_part_str+"</span>");
        
        $("#dev_"+dev_index+"_current_UV_MED_hr").html("");
        $("#dev_"+dev_index+"_current_UV_MED_hr").html(show_current_UV_MED_hr.join(''));
        
        if($("#dev_"+dev_index+"_current_UV_MED_hr_show_color")!=null){
            $("#dev_"+dev_index+"_current_UV_MED_hr_show_color").removeAttr("class");
            $("#dev_"+dev_index+"_current_UV_MED_hr_show_color").addClass('den bg-purple');
        }
    }
    
    if($("#dev_"+dev_index+"_current_soil_temp")!=null){
        var current_soil_temp = json_rsp_dat.measure_soil_temperature;
        var current_soil_temp_str = String(Math.round(current_soil_temp*100)/100);
        var comma_index = current_soil_temp_str.indexOf(".");
        var current_soil_temp_whole_part_str = (comma_index>=0)?current_soil_temp_str.substring(0,comma_index):current_soil_temp_str;
        var current_soil_temp_comma_part_str = (comma_index>=0)?current_soil_temp_str.substring(comma_index+1):"0";
        var show_current_soil_temp = [];
        
        show_current_soil_temp.push(current_soil_temp_whole_part_str+"<span>."+current_soil_temp_comma_part_str+"</span><strong style=\"top: 5px\">°</strong>");
        
        $("#dev_"+dev_index+"_current_soil_temp").html("");
        $("#dev_"+dev_index+"_current_soil_temp").html(show_current_soil_temp.join(''));

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

        if($("#dev_"+dev_index+"_current_soil_temp_show_color")!=null){
            $("#dev_"+dev_index+"_current_soil_temp_show_color").removeAttr("class");
            $("#dev_"+dev_index+"_current_soil_temp_show_color").addClass('den bg-' + color);
        }
    }
    
    if($("#dev_"+dev_index+"_current_soil_moisture")!=null){
        var current_soil_moisture = json_rsp_dat.measure_soil_moisture;
        var current_soil_moisture_str = String(Math.round(current_soil_moisture*100)/100);
        var comma_index = current_soil_moisture_str.indexOf(".");
        var current_soil_moisture_whole_part_str = (comma_index>=0)?current_soil_moisture_str.substring(0,comma_index):current_soil_moisture_str;
        var current_soil_moisture_comma_part_str = (comma_index>=0)?current_soil_moisture_str.substring(comma_index+1):"0";
        var show_current_soil_moisture = [];

        show_current_soil_moisture.push(current_soil_moisture_whole_part_str+"<span>."+current_soil_moisture_comma_part_str+"</span>");
        
        $("#dev_"+dev_index+"_current_soil_moisture").html("");
        $("#dev_"+dev_index+"_current_soil_moisture").html(show_current_soil_moisture.join(''));
        
        if(current_soil_moisture<21){
            color = "red";
        }
        else if(current_soil_moisture<41){
            color = "orange";
        }
        else if(current_soil_moisture<71){
            color = "lime";
        }
        else if(current_soil_moisture<81){
            color = "teal";
        }
        else{
            color = "blue";
        }

        if($("#dev_"+dev_index+"_current_soil_moisture_show_color")!=null){
            $("#dev_"+dev_index+"_current_soil_moisture_show_color").removeAttr("class");
            $("#dev_"+dev_index+"_current_soil_moisture_show_color").addClass('den bg-' + color);
        }
    }
    
}

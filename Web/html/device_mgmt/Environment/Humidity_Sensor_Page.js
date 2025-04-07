$('head').append('<link rel="stylesheet" type="text/css" href="../../css/circle-meter.css">');

var temperature_chart = null;
var humidity_chart = null;
var pressure_chart = null;

function Handle_Device_WebSocket_POST_Message(in_json)
{
    if(in_json.topic!=null){
        if(in_json.topic=='Environment'){
            if(in_json.command_type!=null){
                switch(in_json.command_type){
                    case "Humidity Sensor":
                        if(in_json.command!=null){
                            switch(in_json.command){
                                case "Report Humidity Sensor Current Measure":
                                    Update_Humidity_Sensor_Measure(in_json.device_ID, in_json);
                                    break;
                                case "Report Humidity Sensor Status Change":
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
    return "溼度計";
}

function Print_Device_Management_Toolbar(print_info_dst_id)
{

}

function Print_Device_Operation_Toolbar(index, print_info_dst_id)
{

}

function Show_Device_Operation_Settings(index, print_info_dst_id, update_online_status_cb)
{
    GET_Humidity_Sensor_All_Sensor_Status(map_device_info_list[Number(index)].device_ID, function(rsp_json){
        var show_device_op_settings = [];
        var show_device_display_charts = [];
        
        if(rsp_json.timeout)
        {
            update_online_status_cb(false);
            return;
        }
        update_online_status_cb(true);

        var display_temperature_history_chart = false;
        var display_pressure_history_chart = false;

        show_device_op_settings.push("<div id=\"dev_"+index+"_chart_display_area\"/>");

        show_device_op_settings.push("<div class=\"row\">");
        show_device_op_settings.push("<div class=\"cell-12\">");
        show_device_op_settings.push("<div class=\"tiles-grid\">");

        for(var i = 0; i<rsp_json.num_of_humidity_sensor; i++)
        {
            if(rsp_json.sensor_status_list[i].measure_temperature!=null)
            {
                display_temperature_history_chart = true;

                show_device_op_settings.push("<div data-role=\"tile\" data-size=\"large\" class=\"bg-lime fg-white\">");
                show_device_op_settings.push("<h2 style=\"margin-top: 5px; text-align: center;\">濕度計"+(i+1)+"</h2>");
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
            
            show_device_op_settings.push("<div data-role=\"tile\" data-size=\"large\" class=\"bg-lime fg-white\">");
            show_device_op_settings.push("<h3 style=\"margin-top: 5px; text-align: center;\">濕度計"+(i+1)+"</h3>");
            show_device_op_settings.push("<div class=\"deneme_font_height\" style=\"margin-top: 15px;margin-left: 12%;\">");
            show_device_op_settings.push("<div class=\"de\">");
            show_device_op_settings.push("<div class=\"den\" id=\"dev_"+index+"_current_humidity_show_color_"+i+"\" style=\"background:gray;\">");
            show_device_op_settings.push("<div class=\"dene\">");
            show_device_op_settings.push("<div class=\"denem\">");
            show_device_op_settings.push("<div class=\"deneme deneme_font_align\">");
            show_device_op_settings.push("<div id=\"dev_"+index+"_current_humidity_"+i+"\"/>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");

            if(rsp_json.sensor_status_list[i].measure_pressure!=null)
            {
                display_pressure_history_chart = true;
                
                show_device_op_settings.push("<div data-role=\"tile\" data-size=\"large\" class=\"bg-lime fg-white\">");
                show_device_op_settings.push("<h2 style=\"margin-top: 5px; text-align: center;\">濕度計"+(i+1)+"</h2>");
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
        show_device_display_charts.push("<div id=\"dev_"+index+"_humidity_history_chart\"/>");
        show_device_display_charts.push("</div>");
        show_device_display_charts.push("</div>");
        show_device_display_charts.push("</div>");

        if(display_pressure_history_chart)
        {
            show_device_display_charts.push("<div class=\"row\">");
            show_device_display_charts.push("<div class=\"cell-12\">");
            show_device_display_charts.push("<div data-role=\"panel\">");
            show_device_display_charts.push("<div id=\"dev_"+index+"_pressure_history_chart\"/>");
            show_device_display_charts.push("</div>");
            show_device_display_charts.push("</div>");
            show_device_display_charts.push("</div>");
        }

        $('#'+print_info_dst_id).html('');
        $('#'+print_info_dst_id).html(show_device_op_settings.join(''));

        $("#dev_"+index+"_chart_display_area").html('');
        $("#dev_"+index+"_chart_display_area").html(show_device_display_charts.join(''));

        Update_Humidity_Sensor_Status(map_device_info_list[Number(index)].device_ID, rsp_json);
        Update_Humidity_Sensor_Measure(map_device_info_list[Number(index)].device_ID, rsp_json);
    });

}

function Update_Humidity_Sensor_Status(device_ID, json_rsp_dat)
{

}

function Update_Humidity_Sensor_Measure(device_ID, json_rsp_dat)
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
    var current_humidity, current_humidity_str;
    var show_current_humidity = [];
    
    for(var i = 0; i<json_rsp_dat.num_of_humidity_sensor; i++)
    {
        if(json_rsp_dat.sensor_status_list[i].measure_temperature!=null)
        {
            current_temp = json_rsp_dat.sensor_status_list[i].measure_temperature;
            current_temp_str = String(Math.round(current_temp*100)/100);
            
            show_current_temp = [];

            comma_index = current_temp_str.indexOf('.');
            if(comma_index<0)
            {
                show_current_temp.push(current_temp_str+"<span>.0</span><strong>°</strong>");
            }
            else{
                show_current_temp.push(current_temp_str.substring(0,comma_index)+"<span>."+current_temp_str.substring(comma_index+1)+"</span><strong>°</strong>");
            }
            
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

            if($("#dev_"+dev_index+"_current_temp_show_color_"+i)!=null){
                $("#dev_"+dev_index+"_current_temp_show_color_"+i).removeAttr("class");
                $("#dev_"+dev_index+"_current_temp_show_color_"+i).addClass('den bg-' + color);
            }
        }

        if(json_rsp_dat.sensor_status_list[i].measure_pressure!=null)
        {
            current_pressure = json_rsp_dat.sensor_status_list[i].measure_pressure;
            current_pressure_str = String(Math.round(current_pressure*100)/100);
            
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

        current_humidity = json_rsp_dat.sensor_status_list[i].measure_humidity;
        current_humidity_str = String(Math.round(current_humidity*100)/100);

        show_current_humidity = [];
        
        comma_index = current_humidity_str.indexOf('.');
        if(comma_index<0)
        {
            show_current_humidity.push(current_humidity_str+"<span>.0</span><strong style=\"left: 100px\">%</strong>");
        }
        else{
            show_current_humidity.push(current_humidity_str.substring(0,comma_index)+"<span>."+current_humidity_str.substring(comma_index+1)+"</span><strong style=\"left: 100px\">%</strong>");
        }
        
        $("#dev_"+dev_index+"_current_humidity_"+i).html("");
        $("#dev_"+dev_index+"_current_humidity_"+i).html(show_current_humidity.join(''));
        
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

        if($("#dev_"+dev_index+"_current_humidity_show_color_"+i)!=null){
            $("#dev_"+dev_index+"_current_humidity_show_color_"+i).removeAttr("class");
            $("#dev_"+dev_index+"_current_humidity_show_color_"+i).addClass('den bg-' + color);
        }
        
    }
    
    var end_date = Date.now();
    var start_date = end_date-(24 * 60 * 60 * 1000);

    GET_Humidity_Sensor_Record_History(map_device_info_list[Number(dev_index)].device_ID, start_date, end_date, 15, function(record_json){
        
        var display_data = false;

        var display_humidity_chart_rows_array = [];
        var display_temperature_chart_rows_array = [];
        var display_pressure_chart_rows_array = [];

        var display_array_humidity_row = [];
        var display_array_temperature_row = [];
        var display_array_pressure_row = [];

        var display_name_obj = [];
        var display_label_array = [];

        display_label_array.push('x');
        for(var i = 0; i<json_rsp_dat.num_of_humidity_sensor; i++){
            display_name_obj['data'+(i+1)] = '子感測器'+(i+1);
            display_label_array.push('data'+(i+1));
        }

        display_humidity_chart_rows_array.push(display_label_array);
        display_temperature_chart_rows_array.push(display_label_array);
        display_pressure_chart_rows_array.push(display_label_array);

        if(record_json.record_history!=null)
        {
            if(record_json.record_history.length>0)
            {
                display_data = true;
            }
        }
        if(display_data)
        {
            for(var i = 0; i<record_json.record_history.length; i++){
                var record_item = record_json.record_history[i];
                var current_date_obj = new Date(record_item.date);
                var date_year_str = current_date_obj.getFullYear();
                var date_month_str = current_date_obj.getMonth();
                var date_day_str = current_date_obj.getDay();
                var time_hour_str = current_date_obj.getHours();
                var time_min_str = current_date_obj.getMinutes();
                if(time_min_str.length==1){time_min_str = "0"+time_min_str;}

                display_array_humidity_row = [];
                display_array_temperature_row = [];
                display_array_pressure_row = [];

                var time_label_str = date_year_str+"-"+date_month_str+"-"+date_day_str+" "+time_hour_str+":"+time_min_str;
                display_array_humidity_row.push(time_label_str);
                display_array_temperature_row.push(time_label_str);
                display_array_pressure_row.push(time_label_str);
    
                for(var j = 0; j<json_rsp_dat.num_of_humidity_sensor; j++){
                    if(record_item.individual_sensor_status[j].measure_temperature!=null)
                    {
                        display_array_temperature_row.push(record_item.individual_sensor_status[j].measure_temperature);
                    }
            
                    if(record_item.individual_sensor_status[j].measure_pressure!=null)
                    {
                        display_array_pressure_row.push(record_item.individual_sensor_status[j].measure_pressure);
                    }
                    
                    display_array_humidity_row.push(record_item.individual_sensor_status[j].measure_humidity);
                }
                
                display_humidity_chart_rows_array.push(display_array_humidity_row);
                display_temperature_chart_rows_array.push(display_array_temperature_row);
                display_pressure_chart_rows_array.push(display_array_pressure_row);
            }
        }
        else{
            var current_date_obj = new Date(Date.now());
            var date_year_str = current_date_obj.getFullYear();
            var date_month_str = current_date_obj.getMonth();
            var date_day_str = current_date_obj.getDay();
            var time_hour_str = current_date_obj.getHours();
            var time_min_str = current_date_obj.getMinutes();
            if(time_min_str.length==1){time_min_str = "0"+time_min_str;}

            var time_label_str = date_year_str+"-"+date_month_str+"-"+date_day_str+" "+time_hour_str+":"+time_min_str;
            display_array_humidity_row.push(time_label_str);
            display_array_temperature_row.push(time_label_str);
            display_array_pressure_row.push(time_label_str);

            for(var j = 0; j<json_rsp_dat.num_of_humidity_sensor; j++){
                display_array_temperature_row.push(0);
                display_array_humidity_row.push(0);
                display_array_pressure_row.push(0);
            }

            display_humidity_chart_rows_array.push(display_array_humidity_row);
            display_temperature_chart_rows_array.push(display_array_temperature_row);
            display_pressure_chart_rows_array.push(display_array_pressure_row);
            
        }

        var humidity_chart = c3.generate({
            bindto: '#dev_'+dev_index+'_humidity_history_chart',
            data: {
                x: 'x',
                xFormat: '%Y-%m-%d %H:%M',
                rows: display_humidity_chart_rows_array,
                names: display_name_obj
            },
            axis: {
                x: {
                    label: {
                        text: '時間',
                        position: 'outer-center'
                    },
                    type: 'timeseries',
                    tick: {
                        format: '%H:%M'
                    }
                },
                y: {
                    label: {
                        text: '濕度',
                        position: 'outer-middle'
                    }
                }
            }
        });
        if($('#dev_'+dev_index+'_temp_history_chart')!=null)
        {
            var temperature_chart = c3.generate({
                bindto: '#dev_'+dev_index+'_temp_history_chart',
                data: {
                    x: 'x',
                    xFormat: '%Y-%m-%d %H:%M',
                    rows: display_temperature_chart_rows_array,
                    names: display_name_obj
                },
                axis: {
                    x: {
                        label: {
                            text: '時間',
                            position: 'outer-center'
                        },
                        type: 'timeseries',
                        tick: {
                            format: '%H:%M'
                        }
                    },
                    y: {
                        label: {
                            text: '溫度',
                            position: 'outer-middle'
                        }
                    }
                }
            });
        }
        if($('#dev_'+dev_index+'_pressure_history_chart')!=null)
        {
            var pressure_chart = c3.generate({
                bindto: '#dev_'+dev_index+'_pressure_history_chart',
                data: {
                    x: 'x',
                    xFormat: '%Y-%m-%d %H:%M',
                    rows: display_pressure_chart_rows_array,
                    names: display_name_obj
                },
                axis: {
                    x: {
                        label: {
                            text: '時間',
                            position: 'outer-center'
                        },
                        type: 'timeseries',
                        tick: {
                            format: '%H:%M'
                        }
                    },
                    y: {
                        label: {
                            text: '氣壓',
                            position: 'outer-middle'
                        }
                    }
                }
            });
        }
    });
}

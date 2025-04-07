$('head').append('<link rel="stylesheet" type="text/css" href="../../css/circle-meter.css">');

function Handle_Device_WebSocket_POST_Message(in_json)
{
    if(in_json.topic!=null){
        if(in_json.topic=='Lighting'){
            if(in_json.command_type!=null){
                switch(in_json.command_type){
                    case "Light Sensor":
                        if(in_json.command!=null){
                            switch(in_json.command){
                                case "Report Light Sensor Current Measure":
                                    Update_Light_Sensor_Measure(in_json.device_ID, in_json);
                                    break;
                                case "Report Light Sensor Status Change":
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
    return "照度計";
}

function Print_Device_Management_Toolbar(print_info_dst_id)
{

}

function Print_Device_Operation_Toolbar(index, print_info_dst_id)
{

}

function Show_Device_Operation_Settings(index, print_info_dst_id, update_online_status_cb)
{
    GET_Light_Sensor_All_Sensor_Status(map_device_info_list[Number(index)].device_ID, function(rsp_json){
        var show_device_op_settings = [];
        var show_device_display_charts = [];
        
        if(rsp_json.timeout)
        {
            update_online_status_cb(false);
            return;
        }
        update_online_status_cb(true);
        
        show_device_op_settings.push("<div id=\"dev_"+index+"_chart_display_area\"/>");

        show_device_op_settings.push("<div class=\"row\">");
        show_device_op_settings.push("<div class=\"cell-12\">");
        show_device_op_settings.push("<div class=\"tiles-grid\">");

        for(var i = 0; i<rsp_json.num_of_light_sensor; i++){
            show_device_op_settings.push("<div data-role=\"tile\" data-size=\"large\" class=\"bg-orange fg-white\">");
            show_device_op_settings.push("<h3 style=\"margin-top: 5px; text-align: center;\">照度計"+(i+1)+"</h3>");
            show_device_op_settings.push("<div class=\"deneme_font_height\" style=\"margin-top: 15px;margin-left: 12%;\">");
            show_device_op_settings.push("<div class=\"de\">");
            show_device_op_settings.push("<div class=\"den bg-orange\">");
            show_device_op_settings.push("<div class=\"dene\">");
            show_device_op_settings.push("<div class=\"denem\">");
            show_device_op_settings.push("<div class=\"deneme deneme_font_align\">");
            show_device_op_settings.push("<div style=\"font-size: 50px;margin-top: 35px;\" id=\"dev_"+index+"_current_lux_"+i+"\"/>");
            show_device_op_settings.push("<div style=\"font-size: 30px\">lux</div>");
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

        show_device_display_charts.push("<div class=\"row\">");
        show_device_display_charts.push("<div class=\"cell-12\">");
        show_device_display_charts.push("<div data-role=\"panel\">");
        show_device_display_charts.push("<div id=\"dev_"+index+"_lux_history_chart\"/>");
        show_device_display_charts.push("</div>");
        show_device_display_charts.push("</div>");
        show_device_display_charts.push("</div>");

        $('#'+print_info_dst_id).html('');
        $('#'+print_info_dst_id).html(show_device_op_settings.join(''));

        $("#dev_"+index+"_chart_display_area").html('');
        $("#dev_"+index+"_chart_display_area").html(show_device_display_charts.join(''));

        Update_Light_Sensor_Measure(map_device_info_list[Number(index)].device_ID, rsp_json);
    });

}

function Update_Light_Sensor_Measure(device_ID, json_rsp_dat)
{
    var dev_index = Find_Device_Index_By_ID(device_ID);
    if(dev_index<0)
    {
        return;
    }

    var show_current_lux = [];
    var current_lux, current_lux_str;
    
    for(var i = 0; i<json_rsp_dat.num_of_light_sensor; i++){
        current_lux = Math.round((json_rsp_dat.sensor_status_list[i].measure_lux)*100)/100;
        current_lux_str = String(current_lux);

        if($("dev_"+dev_index+"_current_lux_" + i)!=null){
            show_current_lux = [];
            show_current_lux.push(current_lux_str);
            
            $("#dev_"+dev_index+"_current_lux_"+i).html("");
            $("#dev_"+dev_index+"_current_lux_"+i).html(show_current_lux.join(''));
        }
    }
    
    var end_date = Date.now();
    var start_date = end_date-(24 * 60 * 60 * 1000);

    GET_Light_Sensor_Record_History(map_device_info_list[Number(dev_index)].device_ID, start_date, end_date, 15, function(record_json){
        
        var display_data = false;

        var display_lux_chart_rows_array = [];
        var display_array_lux_row = [];

        var display_name_obj = [];
        var display_label_array = [];

        display_label_array.push('x');
        for(var i = 0; i<json_rsp_dat.num_of_light_sensor; i++){
            display_name_obj['data'+(i+1)] = '子感測器'+(i+1);
            display_label_array.push('data'+(i+1));
        }

        display_lux_chart_rows_array.push(display_label_array);

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

                display_array_lux_row = [];

                var time_label_str = date_year_str+"-"+date_month_str+"-"+date_day_str+" "+time_hour_str+":"+time_min_str;
                display_array_lux_row.push(time_label_str);
    
                for(var j = 0; j<json_rsp_dat.num_of_light_sensor; j++){
                    display_array_lux_row.push(record_item.individual_sensor_status[j].measure_lux);
                }
                
                display_lux_chart_rows_array.push(display_array_lux_row);
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
            display_array_lux_row.push(time_label_str);

            for(var j = 0; j<json_rsp_dat.num_of_light_sensor; j++){
                display_array_lux_row.push(0);
            }

            display_lux_chart_rows_array.push(display_array_lux_row);
            
        }

        var lux_chart = c3.generate({
            bindto: '#dev_'+dev_index+'_lux_history_chart',
            data: {
                x: 'x',
                xFormat: '%Y-%m-%d %H:%M',
                rows: display_lux_chart_rows_array,
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
                        text: '照度',
                        position: 'outer-middle'
                    }
                }
            }
        });
    });
}

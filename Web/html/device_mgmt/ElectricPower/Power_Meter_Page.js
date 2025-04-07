$('head').append('<link rel="stylesheet" type="text/css" href="../../css/circle-meter.css">');
$('head').append('<link rel="stylesheet" type="text/css" href="../../css/metro-toggle_sw.css">');
$('head').append('<link rel="stylesheet" type="text/css" href="../../css/range-slider.css">');
$('head').append('<link rel="stylesheet" type="text/css" href="../../css/device_mgmt/ElectricPower/Power_Meter.css">');

var UI_is_updating = false;

function Handle_Device_WebSocket_POST_Message(in_json)
{
    if(in_json.topic!=null){
        if(in_json.topic=='Electrical'){
            if(in_json.command_type!=null){
                switch(in_json.command_type){
                    case "Power Meter":
                        if(in_json.command!=null){
                            switch(in_json.command){
                                case "Report Power Meter Current Measure":
                                    Update_Power_Meter_Measure(in_json.device_ID, in_json);
                                    break;
                                case "Report Power Meter Status Change":
                                    Update_Power_Meter_Status(in_json.device_ID, in_json);
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
    return "電力計";
}

function Print_Device_Management_Toolbar(print_info_dst_id)
{

}

function Print_Device_Operation_Toolbar(index, print_info_dst_id)
{

}

function Show_Device_Operation_Settings(index, print_info_dst_id, update_online_status_cb)
{
    GET_Power_Meter_All_Meter_Status(map_device_info_list[Number(index)].device_ID, function(rsp_json){
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
        show_device_op_settings.push("<h2 class=\"fg-red\">電力計狀態:</h2>");
        show_device_op_settings.push("</div>");

        for(var i = 0; i<rsp_json.num_of_power_meter; i++){
            show_device_op_settings.push("<div class=\"row\">");
            show_device_op_settings.push("<h3 class=\"fg-red\">電力計"+(i+1)+"</h3>");
            show_device_op_settings.push("</div>");
            
            show_device_op_settings.push("<div class=\"row\">");
            show_device_op_settings.push("<div class=\"cell-12\">");
            show_device_op_settings.push("<div class=\"tiles-grid\">");

            show_device_op_settings.push("<div data-role=\"tile\" data-size=\"large\" class=\"bg-red fg-white\">");
            show_device_op_settings.push("<h2 style=\"margin-top: 10px; text-align: center;\">開啟/關閉</h2>");
            show_device_op_settings.push("<div class=\"onoffswitch meter_on_off_sw\" style=\"margin-left: 10%\">");
            show_device_op_settings.push("<input type=\"checkbox\" name=\"onoffswitch\" class=\"onoffswitch-checkbox\" id=\"dev_"+index+"_meter_"+i+"_on_off\" onclick=\"onClick_Power_Meter_Power_Switch('"+map_device_info_list[Number(index)].device_ID+"', '"+i+"', this.id)\">");
            show_device_op_settings.push("<label class=\"onoffswitch-label\" for=\"dev_"+index+"_meter_"+i+"_on_off\">");
            show_device_op_settings.push("<span class=\"onoffswitch-inner meter_on_off_sw_inner\"></span>");
            show_device_op_settings.push("<span class=\"onoffswitch-switch meter_on_off_sw-sw\"></span>");
            show_device_op_settings.push("</label>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("<div class=\"row\" style=\"margin-left: 5px\">");
            show_device_op_settings.push("<div class=\"cell-6\">");
            show_device_op_settings.push("<h5 style=\"margin-top: 1%;margin-bottom: 0px;\">電壓: <span id=\"dev_"+index+"_meter_"+i+"_current_voltage\"></span> V</h5>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("<div class=\"cell-6\">");
            show_device_op_settings.push("<h5 style=\"margin-top: 1%;margin-bottom: 0px;\">電流: <span id=\"dev_"+index+"_meter_"+i+"_current_amperage\"></span> A</h5>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("<div class=\"row\" style=\"margin-left: 5px\">");
            show_device_op_settings.push("<div class=\"cell-6\">");
            show_device_op_settings.push("<h5 style=\"margin-top: 1%;margin-bottom: 0px;\">頻率: <span id=\"dev_"+index+"_meter_"+i+"_current_frequency\"></span> Hz ("+rsp_json.meter_type+")</h5>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("<div class=\"cell-6\">");
            show_device_op_settings.push("<h5 style=\"margin-top: 1%;margin-bottom: 0px;\">功率: <span id=\"dev_"+index+"_meter_"+i+"_current_active_power\"></span> W</h5>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            if(rsp_json.meter_status_list[i].measure_power_factor!=null || rsp_json.meter_status_list[i].measure_apparent_power!=null)
            {
                show_device_op_settings.push("<div class=\"row\" style=\"margin-left: 5px\">");
                show_device_op_settings.push("<div class=\"cell-6\">");
                if(rsp_json.meter_status_list[i].measure_power_factor!=null)
                {
                    show_device_op_settings.push("<h5 style=\"margin-top: 1%;margin-bottom: 0px;\">功率因數: <span id=\"dev_"+index+"_meter_"+i+"_current_power_dactor\"></span>°</h5>");
                }
                show_device_op_settings.push("</div>");
                show_device_op_settings.push("<div class=\"cell-6\">");
                if(rsp_json.meter_status_list[i].measure_apparent_power!=null)
                {
                    show_device_op_settings.push("<h5 style=\"margin-top: 1%;margin-bottom: 0px;\">實功率: <span id=\"dev_"+index+"_meter_"+i+"_current_apparent_power\"></span> W</h5>");
                }
                show_device_op_settings.push("</div>");
                show_device_op_settings.push("</div>");
            }
            if(rsp_json.meter_status_list[i].measure_main_energy!=null || rsp_json.meter_status_list[i].measure_negative_energy!=null)
            {
                show_device_op_settings.push("<div class=\"row\" style=\"margin-left: 5px\">");
                show_device_op_settings.push("<div class=\"cell-6\">");
                if(rsp_json.meter_status_list[i].measure_main_energy!=null)
                {
                    show_device_op_settings.push("<h5 style=\"margin-top: 1%;margin-bottom: 0px;\">實際作功: <span id=\"dev_"+index+"_meter_"+i+"_current_main_energy\"></span> W</h5>");
                }
                show_device_op_settings.push("</div>");
                show_device_op_settings.push("<div class=\"cell-6\">");
                if(rsp_json.meter_status_list[i].measure_negative_energy!=null)
                {
                    show_device_op_settings.push("<h5 style=\"margin-top: 1%;margin-bottom: 0px;\">負作功: <span id=\"dev_"+index+"_meter_"+i+"_current_negative_energy\"></span> W</h5>");
                }
                show_device_op_settings.push("</div>");
                show_device_op_settings.push("</div>");
            }
            show_device_op_settings.push("<div class=\"row\" style=\"margin-left: 5px\">");
            show_device_op_settings.push("<div class=\"cell-12\">");
            show_device_op_settings.push("<h5 style=\"margin-top: 1%;margin-bottom: 0px;\">最大電流: <span id=\"dev_"+index+"_meter_"+i+"_max_amperage\"></span> A</h5>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("<div class=\"row\" style=\"margin-left: 5px\">");
            show_device_op_settings.push("<div class=\"cell-12\" style=\"margin-top: 1%\">");
            show_device_op_settings.push("<h5 style=\"display: inline\">額定電流: </h5>");
            show_device_op_settings.push("<textarea data-role=\"textarea\" id=\"dev_"+index+"_meter_"+i+"_rated_amperage\" data-append=\"<span>A</span>\"></textarea>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
            show_device_op_settings.push("</div>");
        }
        
        show_device_display_charts.push("<div class=\"row\">");
        show_device_display_charts.push("<div class=\"cell-12\">");
        show_device_display_charts.push("<div data-role=\"panel\">");
        show_device_display_charts.push("<div id=\"dev_"+index+"_power_history_chart\"/>");
        show_device_display_charts.push("</div>");
        show_device_display_charts.push("</div>");
        show_device_display_charts.push("</div>");

        $('#'+print_info_dst_id).html('');
        $('#'+print_info_dst_id).html(show_device_op_settings.join(''));

        $("#dev_"+index+"_chart_display_area").html('');
        $("#dev_"+index+"_chart_display_area").html(show_device_display_charts.join(''));

        Update_Power_Meter_Status(map_device_info_list[Number(index)].device_ID, rsp_json);
        Update_Power_Meter_Measure(map_device_info_list[Number(index)].device_ID, rsp_json);
    });

}

function Update_Power_Meter_Status(device_ID, json_rsp_dat)
{
    var dev_index = Find_Device_Index_By_ID(device_ID);
    if(dev_index<0)
    {
        return;
    }
    
    UI_is_updating = true;

    for(var i = 0; i<json_rsp_dat.num_of_power_meter; i++){
        meter_index = json_rsp_dat.meter_status_list[i].meter_index;
        
        $("#dev_"+dev_index+"_meter_"+meter_index+"_on_off").prop("checked", json_rsp_dat.meter_status_list[i].on_off);
    }

    UI_is_updating = false;
}

function Update_Power_Meter_Measure(device_ID, json_rsp_dat)
{
    var dev_index = Find_Device_Index_By_ID(device_ID);
    if(dev_index<0)
    {
        return;
    }

    var current_voltage, current_voltage_str;
    var current_amperage, current_amperage_str;
    var current_frequency, current_frequency_str;
    var current_pf, current_pf_str;
    var current_active_pwr, current_active_pwr_str;
    var current_apparent_pwr, current_apparent_pwr_str;
    var current_main_energy, current_main_energy_str;
    var current_negative_energy, current_negative_energy_str;

    UI_is_updating = true;

    for(var i = 0; i<json_rsp_dat.num_of_power_meter; i++){
        meter_index = json_rsp_dat.meter_status_list[i].meter_index;
        
        current_voltage = json_rsp_dat.meter_status_list[i].measure_voltage;
        current_voltage_str = String(Math.round(current_voltage*100)/100);
        current_amperage = json_rsp_dat.meter_status_list[i].measure_amperage;
        current_amperage_str = String(Math.round(current_amperage*100)/100);
        current_frequency = json_rsp_dat.meter_status_list[i].measure_frequency;
        current_frequency_str = String(Math.round(current_frequency*100)/100);
        current_active_pwr = json_rsp_dat.meter_status_list[i].measure_active_power;
        current_active_pwr_str = String(Math.round(current_active_pwr*100)/100);

        $("#dev_"+dev_index+"_meter_"+meter_index+"_current_voltage").html(current_voltage_str);
        $("#dev_"+dev_index+"_meter_"+meter_index+"_current_amperage").html(current_amperage_str);
        $("#dev_"+dev_index+"_meter_"+meter_index+"_current_frequency").html(current_frequency_str);
        $("#dev_"+dev_index+"_meter_"+meter_index+"_current_active_power").html(current_active_pwr_str);
        $("#dev_"+dev_index+"_meter_"+meter_index+"_max_amperage").html(json_rsp_dat.meter_status_list[i].max_amperage);

        if(json_rsp_dat.meter_status_list[i].measure_power_factor!=null)
        {
            current_pf = json_rsp_dat.meter_status_list[i].measure_power_factor;
            current_pf_str = String(Math.round(current_pf*100)/100);
            $("#dev_"+dev_index+"_meter_"+meter_index+"_current_power_factor").html(current_pf_str);
        }
        if(json_rsp_dat.meter_status_list[i].measure_apparent_power!=null)
        {
            current_apparent_pwr = json_rsp_dat.meter_status_list[i].measure_apparent_powwr;
            current_apparent_pwr_str = String(Math.round(current_apparent_pwr*100)/100);
            $("#dev_"+dev_index+"_meter_"+meter_index+"_current_apparent_power").html(current_apparent_pwr_str);
        }
        if(json_rsp_dat.meter_status_list[i].measure_main_energy!=null)
        {
            current_main_energy = json_rsp_dat.meter_status_list[i].measure_main_energy;
            current_main_energy_str = String(Math.round(current_main_energy*100)/100);
            $("#dev_"+dev_index+"_meter_"+meter_index+"_current_main_energy").html(current_main_energy_str);
        }
        if(json_rsp_dat.meter_status_list[i].measure_negative_energy!=null)
        {
            current_negative_energy = json_rsp_dat.meter_status_list[i].measure_negative_energy;
            current_negative_energy_str = String(Math.round(current_negative_energy*100)/100);
            $("#dev_"+dev_index+"_meter_"+meter_index+"_current_negative_energy").html(current_negative_energy_str);
        }
    }

    UI_is_updating = false;

    var end_date = Date.now();
    var start_date = end_date-(24 * 60 * 60 * 1000);

    GET_Power_Meter_Overall_State_Record_History(map_device_info_list[Number(dev_index)].device_ID, start_date, end_date, null, function(record_json){
            
        var display_data = false;

        var display_power_chart_rows_array = [];
        var display_array_power_row = [];

        var display_name_obj = [];
        var display_label_array = [];

        display_label_array.push('x');
        for(var i = 0; i<json_rsp_dat.num_of_power_meter; i++){
            display_name_obj['data'+(i+1)] = '子電力計'+(i+1);
            display_label_array.push('data'+(i+1));
        }

        display_power_chart_rows_array.push(display_label_array);

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

                display_array_power_row = [];

                var time_label_str = date_year_str+"-"+date_month_str+"-"+date_day_str+" "+time_hour_str+":"+time_min_str;
                display_array_power_row.push(time_label_str);

                for(var j = 0; j<json_rsp_dat.num_of_power_meter; j++){
                    display_array_power_row.push(record_item.individual_socket_status[j].power);
                }
                
                display_power_chart_rows_array.push(display_array_power_row);
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
            display_array_power_row.push(time_label_str);

            for(var j = 0; j<json_rsp_dat.num_of_power_meter; j++){
                display_array_power_row.push(0);
            }

            display_power_chart_rows_array.push(display_array_power_row);
            
        }

        var power_chart = c3.generate({
            bindto: '#dev_'+dev_index+'_power_history_chart',
            data: {
                x: 'x',
                xFormat: '%Y-%m-%d %H:%M',
                rows: display_power_chart_rows_array,
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
                        text: '功率',
                        position: 'outer-middle'
                    }
                }
            }
        });
    });
}

function onClick_Power_Meter_Power_Switch(device_ID, meter_index, toggle_switch_id_str)
{
    if(UI_is_updating){return;}

    var on_off_flag = $("#"+toggle_switch_id_str).prop("checked");
    if(on_off_flag){
        Turn_On_Off_Individual_Power_Meter(device_ID, meter_index, 'On');
    }
    else{
        Turn_On_Off_Individual_Power_Meter(device_ID, meter_index, 'Off');
    }
}

function onClick_Power_Meter_PWM_Slider(device_ID, meter_index, range_slider_id_str)
{
    if(UI_is_updating){return;}

    Set_Individual_Power_Meter_PWM_Level(device_ID, meter_index, Math.round($('#'+range_slider_id_str).val()/100*255));
}

$('head').append('<link rel="stylesheet" type="text/css" href="../../css/circle-meter.css">');

function Handle_Device_WebSocket_POST_Message(in_json)
{
    if(in_json.topic!=null){
        if(in_json.topic=='Environment'){
            if(in_json.command_type!=null){
                switch(in_json.command_type){
                    case "O3 Sensor":
                        if(in_json.command!=null){
                            switch(in_json.command){
                                case "Report O3 Sensor Current Measure":
                                    Update_O3_Sensor_Measure(in_json.device_ID, in_json);
                                    break;
                                case "Report O3 Sensor Status Change":
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
    return "O3臭氧感測器";
}

function Print_Device_Management_Toolbar(print_info_dst_id)
{

}

function Print_Device_Operation_Toolbar(index, print_info_dst_id)
{

}

function Show_Device_Operation_Settings(index, print_info_dst_id, update_online_status_cb)
{
    GET_O3_Sensor_All_Sensor_Status(map_device_info_list[Number(index)].device_ID, function(rsp_json){
        var show_device_op_settings = [];
        
        if(rsp_json.timeout)
        {
            update_online_status_cb(false);
            return;
        }
        update_online_status_cb(true);

        show_device_op_settings.push("<div class=\"row\">");
        show_device_op_settings.push("<h2 class=\"fg-indigo\">O3臭氧感測器狀態:</h2>");
        show_device_op_settings.push("</div>");

        for(var i = 0; i<rsp_json.num_of_o3_sensor; i++){
            show_device_op_settings.push("<div class=\"row\">");
            show_device_op_settings.push("<h3 class=\"fg-indigo\">感測器"+(i+1)+"</h3>");
            show_device_op_settings.push("</div>");
            
            show_device_op_settings.push("<div class=\"row\">");
            show_device_op_settings.push("<div class=\"cell-12\">");
            show_device_op_settings.push("<div class=\"tiles-grid\">");

            show_device_op_settings.push("<div data-role=\"tile\" data-size=\"large\" class=\"bg-indigo fg-white\">");
            show_device_op_settings.push("<h2 style=\"margin-top: 5px; text-align: center;\">O3濃度(ppm)</h2>");
            show_device_op_settings.push("<div class=\"deneme_font_height\" style=\"margin-top: 15px;margin-left: 12%;\">");
            show_device_op_settings.push("<div class=\"de\">");
            show_device_op_settings.push("<div class=\"den\" id=\"dev_"+index+"_current_o3_ppm_show_color_"+i+"\" style=\"background:gray;\">");
            show_device_op_settings.push("<div class=\"dene\">");
            show_device_op_settings.push("<div class=\"denem\">");
            show_device_op_settings.push("<div class=\"deneme deneme_font_align\">");
            show_device_op_settings.push("<div id=\"dev_"+index+"_current_o3_ppm_"+i+"\"/>");
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

        Update_O3_Sensor_Status(map_device_info_list[Number(index)].device_ID, rsp_json);
        Update_O3_Sensor_Measure(map_device_info_list[Number(index)].device_ID, rsp_json);
    });

}

function Update_O3_Sensor_Status(device_ID, json_rsp_dat)
{

}

function Update_O3_Sensor_Measure(device_ID, json_rsp_dat)
{
    var dev_index = Find_Device_Index_By_ID(device_ID);
    if(dev_index<0)
    {
        return;
    }

    var color;
    var current_o3_whole_part;
    var current_o3_comma_part;
    var show_current_o3 = [];
    var current_o3;
    
    for(var i = 0; i<json_rsp_dat.num_of_o3_sensor; i++){
        current_o3 = json_rsp_dat.sensor_status_list[i].measure_o3_ppm;
        current_o3_whole_part = Math.floor(current_o3);
        current_o3_comma_part = Math.round((current_o3-current_o3_whole_part)*100);

        if($("dev_"+dev_index+"_current_o3_ppm_" + i)!=null){
            show_current_o3 = [];
            show_current_o3.push(current_o3_whole_part+"<span>."+current_o3_comma_part+"</span><strong style=\"left: 100px\">ppm</strong>");
            
            $("#dev_"+dev_index+"_current_o3_ppm_"+i).html("");
            $("#dev_"+dev_index+"_current_o3_ppm_"+i).html(show_current_o3.join(''));
            
            if(current_o3<21){
                color = "red";
            }
            else if(current_o3<41){
                color = "orange";
            }
            else if(current_o3<71){
                color = "lime";
            }
            else if(current_o3<81){
                color = "teal";
            }
            else{
                color = "blue";
            }

            if($("dev_"+dev_index+"_current_o3_ppm_show_color_"+i)!=null){
                $("#dev_"+dev_index+"_current_o3_ppm_show_color_"+i).removeAttr("class");
                $("#dev_"+dev_index+"_current_o3_ppm_show_color_"+i).addClass('den bg-' + color);
            }
        }
    }
}

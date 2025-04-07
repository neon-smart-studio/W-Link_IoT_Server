$('head').append('<link rel="stylesheet" type="text/css" href="../../css/circle-meter.css">');

$('style').append(".triangle{\
    width: 0;\
    height: 0;\
    border-style: solid;\
    border-width: 0 200px 346.4px 200px;\
    border-color: transparent transparent #e74c3c transparent;\
}");

var ui_is_updating = false;

function Handle_Device_WebSocket_POST_Message(in_json)
{
    if(in_json.topic!=null){
        if(in_json.topic=='Traffic'){
            if(in_json.command_type!=null){
                switch(in_json.command_type){
                    case "Electric Car":
                        if(in_json.command!=null){
                            switch(in_json.command){
                                case "Report Electric Car Status Change":
                                    Update_Electric_Car_Status(in_json.device_ID, in_json);
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
    return "電動車";
}

function Print_Device_Management_Toolbar(print_info_dst_id)
{

}

function Print_Device_Operation_Toolbar(index, print_info_dst_id)
{

}

function Show_Device_Operation_Settings(index, print_info_dst_id, update_online_status_cb)
{
    GET_Electric_Car_All_Status(map_device_info_list[Number(index)].device_ID, function(rsp_json){
        var show_device_op_settings = [];
        
        if(rsp_json.timeout)
        {
            update_online_status_cb(false);
            return;
        }
        update_online_status_cb(true);

        show_device_op_settings.push("<div class=\"row\">");
        show_device_op_settings.push("<h2 class=\"fg-darkOlive\">電動車狀態:</h2>");
        show_device_op_settings.push("</div>");

        show_device_op_settings.push("<div class=\"row\">");

        show_device_op_settings.push("<div class=\"cell-6\">");
        show_device_op_settings.push("<h2 class=\"fg-darkOlive\">目前速度</h2>");
        show_device_op_settings.push("<div class=\"triangle\" style=\"margin-top: 40px\">");
        show_device_op_settings.push("<div class=\"de\" style=\"top: 115px;left: -120px;\">");
        show_device_op_settings.push("<div class=\"den bg-green\" id=\"current_traffic_light_state_"+index+"\">");
        show_device_op_settings.push("<div class=\"dene\">");
        show_device_op_settings.push("<div class=\"denem\">");
        show_device_op_settings.push("<div class=\"deneme\">");
        show_device_op_settings.push("<div style=\"margin-top: 28px;font-size: 60px;\" id=\"current_speed_percentage_"+index+"\">");
        show_device_op_settings.push("</div>");
        show_device_op_settings.push("</div>");
        show_device_op_settings.push("</div>");
        show_device_op_settings.push("</div>");
        show_device_op_settings.push("</div>");
        show_device_op_settings.push("</div>");
        show_device_op_settings.push("</div>");
        show_device_op_settings.push("</div>");

        show_device_op_settings.push("<div class=\"cell-6\">");
        show_device_op_settings.push("<h2 class=\"fg-darkOlive\">方向控制</h2>");
        show_device_op_settings.push("<div id=\"zone_joystick_"+index+"\"></div>");
        show_device_op_settings.push("</div>");

        show_device_op_settings.push("</div>");

        $('#'+print_info_dst_id).html('');
        $('#'+print_info_dst_id).html(show_device_op_settings.join(''));

        Update_Electric_Car_Status(map_device_info_list[Number(index)].device_ID, rsp_json);
        Print_Joystick(index, "zone_joystick_"+index, 150, "215px", "200px");
    });

}

function Update_Electric_Car_Status(device_ID, json_rsp_dat)
{
    var dev_index = Find_Device_Index_By_ID(device_ID);
    if(dev_index<0)
    {
        return;
    }

    UI_is_updating = true;

    $('#current_speed_percentage_'+dev_index).html("");
    $('#current_speed_percentage_'+dev_index).html(json_rsp_dat.current_speed_percentage+"<strong style=\"left: 90px\">%</strong>");

    switch(json_rsp_dat.current_traffic_light_state)
    {
      case "Red":
        $('#current_traffic_light_state_'+dev_index).attr('class', "den bg-red");
        break;
      case "Yellow":
        $('#current_traffic_light_state_'+dev_index).attr('class', "den bg-yellow");
        break;
      case "Green":
        $('#current_traffic_light_state_'+dev_index).attr('class', "den bg-green");
        break;
      case "Unknown":
        $('#current_traffic_light_state_'+dev_index).attr('class', "den bg-gray");
        break;
    }

    UI_is_updating = false;
}

function Print_Joystick(index, id, radius, position_left, position_top)
{
        var options = {
            zone: document.getElementById(id),
            mode: 'static',
            position: {
                left: position_left,
                top: position_top
            },
            size: radius*2,
            color: 'black',
        };

        var joystick;
        var position;
        joystick = nipplejs.create(options);
        joystick.on('start', function(evt, data) {
            position = data;
        });
        joystick.on('end', function(evt, data) {
            Electric_Car_Turn_Straight(map_device_info_list[Number(index)].device_ID);
            Electric_Car_Stop(map_device_info_list[Number(index)].device_ID);
        });
        joystick.on('move', function(evt, data) {
          try{

            var move_speed = 0;
            var turn_degree = 0;
            var current_degree = 0;

            current_degree = Math.round((data.angle.degree)*100)/100;

            if(data.angle.degree==0)
            {
              current_degree = 0;
              move_speed = Math.round((data.distance*100)/radius);
              turn_degree = current_degree;
            }
            else if(data.angle.degree>0 && data.angle.degree<=90)
            {
              move_speed = Math.round((data.distance*100)/radius);
              turn_degree = 90-current_degree;
            }
            else if(data.angle.degree>90 && data.angle.degree<=180)
            {
              move_speed = Math.round((data.distance*100)/radius);
              turn_degree = (current_degree-90)*(-1);
            }
            else if(data.angle.degree>180 && data.angle.degree<=270)
            {
              move_speed = Math.round((data.distance*100)/radius) * (-1);
              turn_degree = (270-current_degree)*(-1);
            }
            else if(data.angle.degree>270 && data.angle.degree<=360)
            {
              move_speed = Math.round((data.distance*100)/radius) * (-1);
              turn_degree = current_degree-270;
            }

            if(move_speed>0)
            {
                Electric_Car_Move_Forward(map_device_info_list[Number(index)].device_ID, move_speed);
            }
            else if(move_speed<0)
            {
                Electric_Car_Move_Back(map_device_info_list[Number(index)].device_ID, Math.abs(move_speed));
            }
            else
            {
                Electric_Car_Stop(map_device_info_list[Number(index)].device_ID);
            }
            
            if(turn_degree>0)
            {
              Electric_Car_Turn_Right(map_device_info_list[Number(index)].device_ID, turn_degree);
            }
            else if(turn_degree<0)
            {
              Electric_Car_Turn_Left(map_device_info_list[Number(index)].device_ID, Math.abs(turn_degree));
            }
            else
            {
              Electric_Car_Turn_Straight(map_device_info_list[Number(index)].device_ID);
            }
          }
          catch(e)
          {
            Electric_Car_Stop(map_device_info_list[Number(index)].device_ID);
          }
        });
        joystick.on('pressure', function(evt, data) {
            position = data;
        });
        joystick.on('dir:up plain:up dir:left plain:left dir:down' +
              'plain:down dir:right plain:right', function(evt, data) {
            position = data;
        });
}
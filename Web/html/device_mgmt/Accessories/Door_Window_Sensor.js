
function GET_Door_Window_Sensor_Support_Actions(device_ID, callback)
{
    var cmd = {
        command_type: "Door/Window Sensor",
        command: "Get Door/Window Sensor Support Actions",
        device_ID: device_ID
    }
    Websocket_Send_GET_Command("Accessories", cmd, callback);
}

function GET_Door_Window_Sensor_Num_Of_Sensor(device_ID, callback)
{
    var cmd = {
        command_type: "Door/Window Sensor",
        command: "Get Num Of Door/Window Sensor",
        device_ID: device_ID,
    }
    Websocket_Send_GET_Command("Accessories", cmd, callback);
}

function GET_Door_Window_Sensor_Individual_Sensor_Status(device_ID, socket_index, callback)
{
    var cmd = {
        command_type: "Door/Window Sensor",
        command: "Get Individual Door/Window Sensor Status",
        device_ID: device_ID,
        socket_index: Number(socket_index),
    }
    Websocket_Send_GET_Command("Accessories", cmd, callback);
}

function GET_Door_Window_Sensor_All_Sensor_Status(device_ID, callback)
{
    var cmd = {
        command_type: "Door/Window Sensor",
        command: "Get All Door/Window Sensor Status",
        device_ID: device_ID
    }
    Websocket_Send_GET_Command("Accessories", cmd, callback);
}

function Resolv_Door_Window_Sensor_Action_Description(action)
{
    var desc = "";
    switch(action)
    {
        case "open":
            desc = "開啟";
            break;
        case "close":
            desc = "關閉";
            break;
    }
    return desc;
}

function Resolv_Door_Window_Sensor_Action_Icon(action)
{
    var tile_icon_url = "/icons/device_mgmt_icons/Accessories/Door_Window_Sensor/door_window_sensor_action_"+action+".png";
                
    return "<img class=\"icon\" style=\"display: inline;\" src=\""+tile_icon_url+"\"/>";
}
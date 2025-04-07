
function Config_Motion_Sensor_Reaction_Time(device_ID, sensor_index, reaction_time)
{
    var cmd = {
        command_type: "Motion Sensor",
        command: "Config Motion Sensor Reaction Time",
        device_ID: device_ID,
        sensor_index: Number(sensor_index),
        reaction_time: Number(reaction_time)
    }
    Websocket_Send_POST_Command("Accessories", cmd);
}

function Get_Motion_Sensor_Reaction_Time(device_ID, sensor_index, callback)
{
    var cmd = {
        command_type: "Motion Sensor",
        command: "Get Motion Sensor Reaction Time",
        device_ID: device_ID,
        sensor_index: Number(sensor_index)
    }
    Websocket_Send_GET_Command("Accessories", cmd, callback);
}

function GET_Motion_Sensor_Support_Actions(device_ID, callback)
{
    var cmd = {
        command_type: "Motion Sensor",
        command: "Get Motion Sensor Support Actions",
        device_ID: device_ID
    }
    Websocket_Send_GET_Command("Accessories", cmd, callback);
}

function GET_Motion_Sensor_Num_Of_Sensor(device_ID, callback)
{
    var cmd = {
        command_type: "Motion Sensor",
        command: "Get Num Of Motion Sensor",
        device_ID: device_ID,
    }
    Websocket_Send_GET_Command("Accessories", cmd, callback);
}

function GET_Motion_Sensor_Individual_Sensor_Info(device_ID, sensor_index, callback)
{
    var cmd = {
        command_type: "Motion Sensor",
        command: "Get Motion Sensor Individual Sensor Info",
        device_ID: device_ID,
        sensor_index: Number(sensor_index),
    }
    Websocket_Send_GET_Command("Accessories", cmd, callback);
}

function GET_Motion_Sensor_All_Sensor_Info(device_ID, callback)
{
    var cmd = {
        command_type: "Motion Sensor",
        command: "Get Motion Sensor All Sensor Info",
        device_ID: device_ID
    }
    Websocket_Send_GET_Command("Accessories", cmd, callback);
}

function GET_Motion_Sensor_Bind_Action_Info(device_ID, sensor_index, action, callback)
{
    var cmd = {
        command_type: "Motion Sensor",
        command: "Get Motion Sensor Bind Action Info",
        device_ID: device_ID,
        sensor_index: Number(sensor_index),
        action: action
    }
    Websocket_Send_GET_Command("Accessories", cmd, callback);
}

function Resolv_Motion_Sensor_Action_Description(action)
{
    var desc = "";
    switch(action)
    {
        case "none":
            desc = "無動靜";
            break;
        case "detected":
            desc = "有動靜";
            break;
    }
    return desc;
}

function Resolv_Motion_Sensor_Action_Icon(action)
{
    var tile_icon_url = "/icons/device_mgmt_icons/Accessories/Motion_Sensor/motion_sensor_action_"+action+".png";
                
    return "<img class=\"icon\" style=\"display: inline;\" src=\""+tile_icon_url+"\"/>";
}
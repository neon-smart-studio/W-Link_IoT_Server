
function Enable_Disable_Individual_Flow_Meter(device_ID, sensor_index, en_dis_str)
{
    var cmd = {};
    var en_dis = false;
    switch(en_dis_str)
    {
        case "Enable":
            en_dis = true;
            break;
        case "Disable":
            en_dis = false;
            break;
    }
    cmd = {
        command_type: "Flow Meter",
        command: "Set Individual Sensor En/Dis State",
        device_ID: device_ID,
        sensor_index: Number(sensor_index),
        enabled: en_dis
    }
    Websocket_Send_POST_Command("Water", cmd);
}

function GET_Flow_Meter_Num_Of_Switch(device_ID, callback)
{
    var cmd = {
        command_type: "Flow Meter",
        command: "Get Num Of Flow Meter",
        device_ID: device_ID,
    }
    Websocket_Send_GET_Command("Water", cmd, callback);
}

function GET_Flow_Meter_Individual_Sensor_Status(device_ID, socket_index, callback)
{
    var cmd = {
        command_type: "Flow Meter",
        command: "Get Individual Flow Meter Status",
        device_ID: device_ID,
        socket_index: Number(socket_index),
    }
    Websocket_Send_GET_Command("Water", cmd, callback);
}

function GET_Flow_Meter_All_Sensor_Status(device_ID, callback)
{
    var cmd = {
        command_type: "Flow Meter",
        command: "Get All Flow Meter Status",
        device_ID: device_ID
    }
    Websocket_Send_GET_Command("Water", cmd, callback);
}
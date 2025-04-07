
function Set_Individual_O2_Sensor_Resolution(device_ID, sensor_index, resolution)
{
    var cmd = {
        command_type: "O2 Sensor",
        command: "Set Individual O2 Sensor Resolution",
        device_ID: device_ID,
        sensor_index: Number(sensor_index),
        resolution: resolution
    }
    Websocket_Send_POST_Command("Gas", cmd);
}

function Set_All_O2_Sensor_Resolution(device_ID, resolution)
{
    var cmd = {
        command_type: "O2 Sensor",
        command: "Set All O2 Sensor Resolution",
        device_ID: device_ID,
        resolution: resolution
    }
    Websocket_Send_POST_Command("Gas", cmd);
}

function GET_O2_Sensor_Num_Of_Sensor(device_ID, callback)
{
    var cmd = {
        command_type: "O2 Sensor",
        command: "Get Num Of O2 Sensor",
        device_ID: device_ID,
    }
    Websocket_Send_GET_Command("Gas", cmd, callback);
}

function GET_O2_Sensor_Individual_Sensor_Status(device_ID, sensor_index, callback)
{
    var cmd = {
        command_type: "O2 Sensor",
        command: "Get Individual O2 Sensor Status",
        device_ID: device_ID,
        sensor_index: Number(sensor_index),
    }
    Websocket_Send_GET_Command("Gas", cmd, callback);
}

function GET_O2_Sensor_All_Sensor_Status(device_ID, callback)
{
    var cmd = {
        command_type: "O2 Sensor",
        command: "Get All O2 Sensor Status",
        device_ID: device_ID
    }
    Websocket_Send_GET_Command("Gas", cmd, callback);
}

function Set_Individual_TVOC_Sensor_Resolution(device_ID, sensor_index, resolution)
{
    var cmd = {
        command_type: "TVOC Sensor",
        command: "Set Individual TVOC Sensor Resolution",
        device_ID: device_ID,
        sensor_index: Number(sensor_index),
        resolution: resolution
    }
    Websocket_Send_POST_Command("Gas", cmd);
}

function Set_All_TVOC_Sensor_Resolution(device_ID, resolution)
{
    var cmd = {
        command_type: "TVOC Sensor",
        command: "Set All TVOC Sensor Resolution",
        device_ID: device_ID,
        resolution: resolution
    }
    Websocket_Send_POST_Command("Gas", cmd);
}

function GET_TVOC_Sensor_Num_Of_Sensor(device_ID, callback)
{
    var cmd = {
        command_type: "TVOC Sensor",
        command: "Get Num Of TVOC Sensor",
        device_ID: device_ID,
    }
    Websocket_Send_GET_Command("Gas", cmd, callback);
}

function GET_TVOC_Sensor_Individual_Sensor_Status(device_ID, sensor_index, callback)
{
    var cmd = {
        command_type: "TVOC Sensor",
        command: "Get Individual TVOC Sensor Status",
        device_ID: device_ID,
        sensor_index: Number(sensor_index),
    }
    Websocket_Send_GET_Command("Gas", cmd, callback);
}

function GET_TVOC_Sensor_All_Sensor_Status(device_ID, callback)
{
    var cmd = {
        command_type: "TVOC Sensor",
        command: "Get All TVOC Sensor Status",
        device_ID: device_ID
    }
    Websocket_Send_GET_Command("Gas", cmd, callback);
}
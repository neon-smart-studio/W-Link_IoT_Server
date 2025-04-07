
function Set_Individual_NO2_Sensor_Resolution(device_ID, sensor_index, resolution)
{
    var cmd = {
        command_type: "NO2 Sensor",
        command: "Set Individual NO2 Sensor Resolution",
        device_ID: device_ID,
        sensor_index: Number(sensor_index),
        resolution: resolution
    }
    Websocket_Send_POST_Command("Gas", cmd);
}

function Set_All_NO2_Sensor_Resolution(device_ID, resolution)
{
    var cmd = {
        command_type: "NO2 Sensor",
        command: "Set All NO2 Sensor Resolution",
        device_ID: device_ID,
        resolution: resolution
    }
    Websocket_Send_POST_Command("Gas", cmd);
}

function GET_NO2_Sensor_Num_Of_Sensor(device_ID, callback)
{
    var cmd = {
        command_type: "NO2 Sensor",
        command: "Get Num Of NO2 Sensor",
        device_ID: device_ID,
    }
    Websocket_Send_GET_Command("Gas", cmd, callback);
}

function GET_NO2_Sensor_Individual_Sensor_Status(device_ID, sensor_index, callback)
{
    var cmd = {
        command_type: "NO2 Sensor",
        command: "Get Individual NO2 Sensor Status",
        device_ID: device_ID,
        sensor_index: Number(sensor_index),
    }
    Websocket_Send_GET_Command("Gas", cmd, callback);
}

function GET_NO2_Sensor_All_Sensor_Status(device_ID, callback)
{
    var cmd = {
        command_type: "NO2 Sensor",
        command: "Get All NO2 Sensor Status",
        device_ID: device_ID
    }
    Websocket_Send_GET_Command("Gas", cmd, callback);
}
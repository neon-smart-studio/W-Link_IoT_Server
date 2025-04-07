
function Set_Individual_Light_Sensor_Resolution(device_ID, sensor_index, resolution)
{
    var cmd = {
        command_type: "Light Sensor",
        command: "Set Individual Light Sensor Resolution",
        device_ID: device_ID,
        sensor_index: Number(sensor_index),
        resolution: resolution
    }
    Websocket_Send_POST_Command("Lighting", cmd);
}

function Set_All_Light_Sensor_Resolution(device_ID, resolution)
{
    var cmd = {
        command_type: "Light Sensor",
        command: "Set All Light Sensor Resolution",
        device_ID: device_ID,
        resolution: resolution
    }
    Websocket_Send_POST_Command("Lighting", cmd);
}

function GET_Light_Sensor_Num_Of_Sensor(device_ID, callback)
{
    var cmd = {
        command_type: "Light Sensor",
        command: "Get Num Of Light Sensor",
        device_ID: device_ID,
    }
    Websocket_Send_GET_Command("Lighting", cmd, callback);
}

function GET_Light_Sensor_Individual_Sensor_Status(device_ID, sensor_index, callback)
{
    var cmd = {
        command_type: "Light Sensor",
        command: "Get Individual Light Sensor Status",
        device_ID: device_ID,
        sensor_index: Number(sensor_index),
    }
    Websocket_Send_GET_Command("Lighting", cmd, callback);
}

function GET_Light_Sensor_All_Sensor_Status(device_ID, callback)
{
    var cmd = {
        command_type: "Light Sensor",
        command: "Get All Light Sensor Status",
        device_ID: device_ID
    }
    Websocket_Send_GET_Command("Lighting", cmd, callback);
}
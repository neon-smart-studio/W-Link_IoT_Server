
function Set_Individual_Water_EC_Sensor_Resolution(device_ID, sensor_index, resolution)
{
    var cmd = {
        command_type: "Water EC Sensor",
        command: "Set Individual Water EC Sensor Resolution",
        device_ID: device_ID,
        sensor_index: Number(sensor_index),
        resolution: resolution
    }
    Websocket_Send_POST_Command("Water", cmd);
}

function Set_All_Water_EC_Sensor_Resolution(device_ID, resolution)
{
    var cmd = {
        command_type: "Water EC Sensor",
        command: "Set All Water EC Sensor Resolution",
        device_ID: device_ID,
        resolution: resolution
    }
    Websocket_Send_POST_Command("Water", cmd);
}

function GET_Water_EC_Sensor_Num_Of_Sensor(device_ID, callback)
{
    var cmd = {
        command_type: "Water EC Sensor",
        command: "Get Num Of Water EC Sensor",
        device_ID: device_ID,
    }
    Websocket_Send_GET_Command("Water", cmd, callback);
}

function GET_Water_EC_Sensor_Individual_Sensor_Status(device_ID, sensor_index, callback)
{
    var cmd = {
        command_type: "Water EC Sensor",
        command: "Get Individual Water EC Sensor Status",
        device_ID: device_ID,
        sensor_index: Number(sensor_index),
    }
    Websocket_Send_GET_Command("Water", cmd, callback);
}

function GET_Water_EC_Sensor_All_Sensor_Status(device_ID, callback)
{
    var cmd = {
        command_type: "Water EC Sensor",
        command: "Get All Water EC Sensor Status",
        device_ID: device_ID
    }
    Websocket_Send_GET_Command("Water", cmd, callback);
}
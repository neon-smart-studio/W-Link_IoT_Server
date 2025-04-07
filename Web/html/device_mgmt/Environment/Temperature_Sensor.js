
function Set_Individual_Temperature_Sensor_Resolution(device_ID, sensor_index, resolution)
{
    var cmd = {
        command_type: "Temperature Sensor",
        command: "Set Individual Temperature Sensor Resolution",
        device_ID: device_ID,
        sensor_index: Number(sensor_index),
        resolution: resolution
    }
    Websocket_Send_POST_Command("Environment", cmd);
}

function Set_All_Temperature_Sensor_Resolution(device_ID, resolution)
{
    var cmd = {
        command_type: "Temperature Sensor",
        command: "Set All Temperature Sensor Resolution",
        device_ID: device_ID,
        resolution: resolution
    }
    Websocket_Send_POST_Command("Environment", cmd);
}

function GET_Temperature_Sensor_Num_Of_Sensor(device_ID, callback)
{
    var cmd = {
        command_type: "Temperature Sensor",
        command: "Get Num Of Temperature Sensor",
        device_ID: device_ID,
    }
    Websocket_Send_GET_Command("Environment", cmd, callback);
}

function GET_Temperature_Sensor_Individual_Sensor_Status(device_ID, sensor_index, callback)
{
    var cmd = {
        command_type: "Temperature Sensor",
        command: "Get Individual Temperature Sensor Status",
        device_ID: device_ID,
        sensor_index: Number(sensor_index),
    }
    Websocket_Send_GET_Command("Environment", cmd, callback);
}

function GET_Temperature_Sensor_All_Sensor_Status(device_ID, callback)
{
    var cmd = {
        command_type: "Temperature Sensor",
        command: "Get All Temperature Sensor Status",
        device_ID: device_ID
    }
    Websocket_Send_GET_Command("Environment", cmd, callback);
}
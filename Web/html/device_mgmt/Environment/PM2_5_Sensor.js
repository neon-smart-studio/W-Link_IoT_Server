
function Set_Individual_PM2_5_Sensor_Resolution(device_ID, sensor_index, resolution)
{
    var cmd = {
        command_type: "PM2.5 Sensor",
        command: "Set Individual PM2.5 Sensor Resolution",
        device_ID: device_ID,
        sensor_index: Number(sensor_index),
        resolution: resolution
    }
    Websocket_Send_POST_Command("Environment", cmd);
}

function Set_All_PM2_5_Sensor_Resolution(device_ID, resolution)
{
    var cmd = {
        command_type: "PM2.5 Sensor",
        command: "Set All PM2.5 Sensor Resolution",
        device_ID: device_ID,
        resolution: resolution
    }
    Websocket_Send_POST_Command("Environment", cmd);
}

function GET_PM2_5_Sensor_Num_Of_Sensor(device_ID, callback)
{
    var cmd = {
        command_type: "PM2.5 Sensor",
        command: "Get Num Of PM2.5 Sensor",
        device_ID: device_ID,
    }
    Websocket_Send_GET_Command("Environment", cmd, callback);
}

function GET_PM2_5_Sensor_Individual_Sensor_Status(device_ID, sensor_index, callback)
{
    var cmd = {
        command_type: "PM2.5 Sensor",
        command: "Get Individual PM2.5 Sensor Status",
        device_ID: device_ID,
        sensor_index: Number(sensor_index),
    }
    Websocket_Send_GET_Command("Environment", cmd, callback);
}

function GET_PM2_5_Sensor_All_Sensor_Status(device_ID, callback)
{
    var cmd = {
        command_type: "PM2.5 Sensor",
        command: "Get All PM2.5 Sensor Status",
        device_ID: device_ID
    }
    Websocket_Send_GET_Command("Environment", cmd, callback);
}
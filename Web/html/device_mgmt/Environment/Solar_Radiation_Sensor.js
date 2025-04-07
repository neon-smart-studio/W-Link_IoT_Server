
function Set_Individual_Solar_Radiation_Sensor_Resolution(device_ID, sensor_index, resolution)
{
    var cmd = {
        command_type: "Solar Radiation Sensor",
        command: "Set Individual Solar Radiation Sensor Resolution",
        device_ID: device_ID,
        sensor_index: Number(sensor_index),
        resolution: resolution
    }
    Websocket_Send_POST_Command("Environment", cmd);
}

function Set_All_Solar_Radiation_Sensor_Resolution(device_ID, resolution)
{
    var cmd = {
        command_type: "Solar Radiation Sensor",
        command: "Set All Solar Radiation Sensor Resolution",
        device_ID: device_ID,
        resolution: resolution
    }
    Websocket_Send_POST_Command("Environment", cmd);
}

function GET_Solar_Radiation_Sensor_Num_Of_Sensor(device_ID, callback)
{
    var cmd = {
        command_type: "Solar Radiation Sensor",
        command: "Get Num Of Solar Radiation Sensor",
        device_ID: device_ID,
    }
    Websocket_Send_GET_Command("Environment", cmd, callback);
}

function GET_Solar_Radiation_Sensor_Individual_Sensor_Status(device_ID, sensor_index, callback)
{
    var cmd = {
        command_type: "Solar Radiation Sensor",
        command: "Get Individual Solar Radiation Sensor Status",
        device_ID: device_ID,
        sensor_index: Number(sensor_index),
    }
    Websocket_Send_GET_Command("Environment", cmd, callback);
}

function GET_Solar_Radiation_Sensor_All_Sensor_Status(device_ID, callback)
{
    var cmd = {
        command_type: "Solar Radiation Sensor",
        command: "Get All Solar Radiation Sensor Status",
        device_ID: device_ID
    }
    Websocket_Send_GET_Command("Environment", cmd, callback);
}
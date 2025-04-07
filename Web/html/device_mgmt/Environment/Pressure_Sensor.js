
function Set_Individual_Pressure_Sensor_Resolution(device_ID, sensor_index, resolution)
{
    var cmd = {
        command_type: "Pressure Sensor",
        command: "Set Individual Pressure Sensor Resolution",
        device_ID: device_ID,
        sensor_index: Number(sensor_index),
        resolution: resolution
    }
    Websocket_Send_POST_Command("Environment", cmd);
}

function Set_All_Pressure_Sensor_Resolution(device_ID, resolution)
{
    var cmd = {
        command_type: "Pressure Sensor",
        command: "Set All Pressure Sensor Resolution",
        device_ID: device_ID,
        resolution: resolution
    }
    Websocket_Send_POST_Command("Environment", cmd);
}

function GET_Pressure_Sensor_Num_Of_Sensor(device_ID, callback)
{
    var cmd = {
        command_type: "Pressure Sensor",
        command: "Get Num Of Pressure Sensor",
        device_ID: device_ID,
    }
    Websocket_Send_GET_Command("Environment", cmd, callback);
}

function GET_Pressure_Sensor_Individual_Sensor_Status(device_ID, sensor_index, callback)
{
    var cmd = {
        command_type: "Pressure Sensor",
        command: "Get Individual Pressure Sensor Status",
        device_ID: device_ID,
        sensor_index: Number(sensor_index),
    }
    Websocket_Send_GET_Command("Environment", cmd, callback);
}

function GET_Pressure_Sensor_All_Sensor_Status(device_ID, callback)
{
    var cmd = {
        command_type: "Pressure Sensor",
        command: "Get All Pressure Sensor Status",
        device_ID: device_ID
    }
    Websocket_Send_GET_Command("Environment", cmd, callback);
}
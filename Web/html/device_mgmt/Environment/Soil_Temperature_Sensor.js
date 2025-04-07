
function Set_Individual_Soil_Temperature_Sensor_Resolution(device_ID, sensor_index, resolution)
{
    var cmd = {
        command_type: "Soil Temperature Sensor",
        command: "Set Individual Soil Temperature Sensor Resolution",
        device_ID: device_ID,
        sensor_index: Number(sensor_index),
        resolution: resolution
    }
    Websocket_Send_POST_Command("Environment", cmd);
}

function Set_All_Soil_Temperature_Sensor_Resolution(device_ID, resolution)
{
    var cmd = {
        command_type: "Soil Temperature Sensor",
        command: "Set All Soil Temperature Sensor Resolution",
        device_ID: device_ID,
        resolution: resolution
    }
    Websocket_Send_POST_Command("Environment", cmd);
}

function GET_Soil_Temperature_Sensor_Num_Of_Sensor(device_ID, callback)
{
    var cmd = {
        command_type: "Soil Temperature Sensor",
        command: "Get Num Of Soil Temperature Sensor",
        device_ID: device_ID,
    }
    Websocket_Send_GET_Command("Environment", cmd, callback);
}

function GET_Soil_Temperature_Sensor_Individual_Sensor_Status(device_ID, sensor_index, callback)
{
    var cmd = {
        command_type: "Soil Temperature Sensor",
        command: "Get Individual Soil Temperature Sensor Status",
        device_ID: device_ID,
        sensor_index: Number(sensor_index),
    }
    Websocket_Send_GET_Command("Environment", cmd, callback);
}

function GET_Soil_Temperature_Sensor_All_Sensor_Status(device_ID, callback)
{
    var cmd = {
        command_type: "Soil Temperature Sensor",
        command: "Get All Soil Temperature Sensor Status",
        device_ID: device_ID
    }
    Websocket_Send_GET_Command("Environment", cmd, callback);
}
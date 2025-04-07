
function Set_Individual_Water_PH_Sensor_Resolution(device_ID, sensor_index, resolution)
{
    var cmd = {
        command_type: "Water PH Sensor",
        command: "Set Individual Water PH Sensor Resolution",
        device_ID: device_ID,
        sensor_index: Number(sensor_index),
        resolution: resolution
    }
    Websocket_Send_POST_Command("Water", cmd);
}

function Set_All_Water_PH_Sensor_Resolution(device_ID, resolution)
{
    var cmd = {
        command_type: "Water PH Sensor",
        command: "Set All Water PH Sensor Resolution",
        device_ID: device_ID,
        resolution: resolution
    }
    Websocket_Send_POST_Command("Water", cmd);
}

function GET_Water_PH_Sensor_Num_Of_Sensor(device_ID, callback)
{
    var cmd = {
        command_type: "Water PH Sensor",
        command: "Get Num Of Water PH Sensor",
        device_ID: device_ID,
    }
    Websocket_Send_GET_Command("Water", cmd, callback);
}

function GET_Water_PH_Sensor_Individual_Sensor_Status(device_ID, sensor_index, callback)
{
    var cmd = {
        command_type: "Water PH Sensor",
        command: "Get Individual Water PH Sensor Status",
        device_ID: device_ID,
        sensor_index: Number(sensor_index),
    }
    Websocket_Send_GET_Command("Water", cmd, callback);
}

function GET_Water_PH_Sensor_All_Sensor_Status(device_ID, callback)
{
    var cmd = {
        command_type: "Water PH Sensor",
        command: "Get All Water PH Sensor Status",
        device_ID: device_ID
    }
    Websocket_Send_GET_Command("Water", cmd, callback);
}

function Set_Individual_CO_Sensor_Resolution(device_ID, sensor_index, resolution)
{
    var cmd = {
        command_type: "CO Sensor",
        command: "Set Individual CO Sensor Resolution",
        device_ID: device_ID,
        sensor_index: Number(sensor_index),
        resolution: resolution
    }
    Websocket_Send_POST_Command("Gas", cmd);
}

function Set_All_CO_Sensor_Resolution(device_ID, resolution)
{
    var cmd = {
        command_type: "CO Sensor",
        command: "Set All CO Sensor Resolution",
        device_ID: device_ID,
        resolution: resolution
    }
    Websocket_Send_POST_Command("Gas", cmd);
}

function GET_CO_Sensor_Num_Of_Sensor(device_ID, callback)
{
    var cmd = {
        command_type: "CO Sensor",
        command: "Get Num Of CO Sensor",
        device_ID: device_ID,
    }
    Websocket_Send_GET_Command("Gas", cmd, callback);
}

function GET_CO_Sensor_Individual_Sensor_Status(device_ID, sensor_index, callback)
{
    var cmd = {
        command_type: "CO Sensor",
        command: "Get Individual CO Sensor Status",
        device_ID: device_ID,
        sensor_index: Number(sensor_index),
    }
    Websocket_Send_GET_Command("Gas", cmd, callback);
}

function GET_CO_Sensor_All_Sensor_Status(device_ID, callback)
{
    var cmd = {
        command_type: "CO Sensor",
        command: "Get All CO Sensor Status",
        device_ID: device_ID
    }
    Websocket_Send_GET_Command("Gas", cmd, callback);
}
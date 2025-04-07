
function GET_Wind_Guage_Num_Of_Sensor(device_ID, callback)
{
    var cmd = {
        command_type: "Wind Guage",
        command: "Get Num Of Wind Guage",
        device_ID: device_ID,
    }
    Websocket_Send_GET_Command("Environment", cmd, callback);
}

function GET_Wind_Guage_Individual_Sensor_Status(device_ID, sensor_index, callback)
{
    var cmd = {
        command_type: "Wind Guage",
        command: "Get Individual Wind Guage Status",
        device_ID: device_ID,
        sensor_index: Number(sensor_index),
    }
    Websocket_Send_GET_Command("Environment", cmd, callback);
}

function GET_Wind_Guage_All_Sensor_Status(device_ID, callback)
{
    var cmd = {
        command_type: "Wind Guage",
        command: "Get All Wind Guage Status",
        device_ID: device_ID
    }
    Websocket_Send_GET_Command("Environment", cmd, callback);
}
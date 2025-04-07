
function GET_Rain_Guage_Num_Of_Sensor(device_ID, callback)
{
    var cmd = {
        command_type: "Rain Guage",
        command: "Get Num Of Rain Guage",
        device_ID: device_ID,
    }
    Websocket_Send_GET_Command("Environment", cmd, callback);
}

function GET_Rain_Guage_Individual_Sensor_Status(device_ID, sensor_index, callback)
{
    var cmd = {
        command_type: "Rain Guage",
        command: "Get Individual Rain Guage Status",
        device_ID: device_ID,
        sensor_index: Number(sensor_index),
    }
    Websocket_Send_GET_Command("Environment", cmd, callback);
}

function GET_Rain_Guage_All_Sensor_Status(device_ID, callback)
{
    var cmd = {
        command_type: "Rain Guage",
        command: "Get All Rain Guage Status",
        device_ID: device_ID
    }
    Websocket_Send_GET_Command("Environment", cmd, callback);
}
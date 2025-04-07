
function GET_Water_Tank_Num_Of_Tank(device_ID, callback)
{
    var cmd = {
        command_type: "Water Tank",
        command: "Get Num Of Water Tank",
        device_ID: device_ID,
    }
    Websocket_Send_GET_Command("Water", cmd, callback);
}

function GET_Water_Tank_Individual_Tank_Status(device_ID, tank_index, callback)
{
    var cmd = {
        command_type: "Water Tank",
        command: "Get Individual Water Tank Status",
        device_ID: device_ID,
        tank_index: Number(tank_index),
    }
    Websocket_Send_GET_Command("Water", cmd, callback);
}

function GET_Water_Tank_All_Tank_Status(device_ID, callback)
{
    var cmd = {
        command_type: "Water Tank",
        command: "Get All Water Tank Status",
        device_ID: device_ID
    }
    Websocket_Send_GET_Command("Water", cmd, callback);
}
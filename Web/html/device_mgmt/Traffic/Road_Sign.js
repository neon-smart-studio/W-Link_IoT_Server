
function Road_Sign_Set_Max_Speed_Limit(device_ID, max_speed_percentage)
{
    var cmd = {
        command_type: "Road Sign",
        command: "Road Sign Set Max Speed Limit Percentage",
        max_speed_percentage: Number(max_speed_percentage),
        device_ID: device_ID
    };
    Websocket_Send_POST_Command("Traffic", cmd);
}

function GET_Road_Sign_Current_Alerting_State(device_ID, callback)
{
    var cmd = {
        command_type: "Road Sign",
        command: "Get Road Sign Current Alerting State",
        device_ID: device_ID
    };
    Websocket_Send_GET_Command("Traffic", cmd, callback);
}

function GET_Road_Sign_Max_Speed_Limit_Percentage(device_ID, callback)
{
    var cmd = {
        command_type: "Road Sign",
        command: "Get Road Sign Max Speed Limit Percentage",
        device_ID: device_ID
    };
    Websocket_Send_GET_Command("Traffic", cmd, callback);
}

function GET_Road_Sign_All_Status(device_ID, callback)
{
    var cmd = {
        command_type: "Road Sign",
        command: "Get Road Sign All Status",
        device_ID: device_ID
    };
    Websocket_Send_GET_Command("Traffic", cmd, callback);
}

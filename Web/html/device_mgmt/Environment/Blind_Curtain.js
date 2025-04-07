
function Blind_Curtain_Open_Close(device_ID, open_close)
{
    var cmd = {};
    switch(open_close)
    {
        case "Open":
            cmd = {
                command_type: "Blind Curtain",
                command: "Blind Curtain Open",
                device_ID: device_ID
            }
            break;
        case "Close":
            cmd = {
                command_type: "Blind Curtain",
                command: "Blind Curtain Close",
                device_ID: device_ID
            }
            break;
    }
    Websocket_Send_POST_Command("Environment", cmd);
}

function Blind_Curtain_Move_To_Position(device_ID, lift_percent)
{
    var cmd = {
        command_type: "Blind Curtain",
        command: "Blind Curtain Move To Position",
        device_ID: device_ID,
        lift_percentage: Number(lift_percent)
    }
    Websocket_Send_POST_Command("Environment", cmd);
}

function Blind_Curtain_Stop_Moving(device_ID)
{
    var cmd = {
        command_type: "Blind Curtain",
        command: "Blind Curtain Stop Moving",
        device_ID: device_ID
    }
    Websocket_Send_POST_Command("Environment", cmd);
}

function GET_Blind_Curtain_Current_Position(device_ID, callback)
{
    var cmd = {
        command_type: "Blind Curtain",
        command: "Get Blind Curtain Current Position",
        device_ID: device_ID
    }
    Websocket_Send_GET_Command("Environment", cmd, callback);
}

function GET_Blind_Curtain_All_Status(device_ID, callback)
{
    var cmd = {
        command_type: "Blind Curtain",
        command: "Get Blind Curtain All Status",
        device_ID: device_ID
    }
    Websocket_Send_GET_Command("Environment", cmd, callback);
}
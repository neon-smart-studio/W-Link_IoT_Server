
function Turn_On_Off_Individual_OnOff_Socket(device_ID, socket_index, on_off)
{
    var cmd = {};
    switch(on_off)
    {
        case "On":
            cmd = {
                command_type: "OnOff Socket",
                command: "Turn On Individual OnOff Socket",
                device_ID: device_ID,
                socket_index: Number(socket_index)
            }
            break;
        case "Off":
            cmd = {
                command_type: "OnOff Socket",
                command: "Turn Off Individual OnOff Socket",
                device_ID: device_ID,
                socket_index: Number(socket_index)
            }
            break;
    }
    Websocket_Send_POST_Command("Electrical", cmd);
}

function Turn_On_Off_All_OnOff_Socket(device_ID, on_off)
{
    var cmd = {};
    switch(on_off)
    {
        case "On":
            cmd = {
                command_type: "OnOff Socket",
                command: "Turn On All OnOff Socket",
                device_ID: device_ID
            }
            break;
        case "Off":
            cmd = {
                command_type: "OnOff Socket",
                command: "Turn Off All OnOff Socket",
                device_ID: device_ID
            }
            break;
    }
    Websocket_Send_POST_Command("Electrical", cmd);
}

function GET_OnOff_Socket_Num_Of_Socket(device_ID, callback)
{
    var cmd = {
        command_type: "OnOff Socket",
        command: "Get Num Of OnOff Socket",
        device_ID: device_ID,
    }
    Websocket_Send_GET_Command("Electrical", cmd, callback);
}

function GET_OnOff_Socket_OnOff_State_Record_History(device_ID, start_date, end_date, max_data_count, callback)
{
    var cmd = {
        command_type: "OnOff Socket",
        command: "Get OnOff Socket OnOff State Record History",
        device_ID: device_ID,
        start_date: start_date,
        end_date: end_date,
        max_data_count: max_data_count
    }
    Websocket_Send_GET_Command("Electrical", cmd, callback);
}

function GET_OnOff_Socket_Power_State_Record_History(device_ID, start_date, end_date, max_data_count, callback)
{
    var cmd = {
        command_type: "OnOff Socket",
        command: "Get OnOff Socket Power State Record History",
        device_ID: device_ID,
        start_date: start_date,
        end_date: end_date,
        max_data_count: max_data_count
    }
    Websocket_Send_GET_Command("Electrical", cmd, callback);
}

function GET_OnOff_Socket_Overall_State_Record_History(device_ID, start_date, end_date, max_data_count, callback)
{
    var cmd = {
        command_type: "OnOff Socket",
        command: "Get OnOff Socket Overall State Record History",
        device_ID: device_ID,
        start_date: start_date,
        end_date: end_date,
        max_data_count: max_data_count
    }
    Websocket_Send_GET_Command("Electrical", cmd, callback);
}

function GET_OnOff_Socket_Individual_Socket_Status(device_ID, socket_index, callback)
{
    var cmd = {
        command_type: "OnOff Socket",
        command: "Get Individual OnOff Socket Status",
        device_ID: device_ID,
        socket_index: Number(socket_index),
    }
    Websocket_Send_GET_Command("Electrical", cmd, callback);
}

function GET_OnOff_Socket_All_Socket_Status(device_ID, callback)
{
    var cmd = {
        command_type: "OnOff Socket",
        command: "Get All OnOff Socket Status",
        device_ID: device_ID
    }
    Websocket_Send_GET_Command("Electrical", cmd, callback);
}
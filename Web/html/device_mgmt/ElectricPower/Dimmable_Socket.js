
function Turn_On_Off_Individual_Dimmable_Socket(device_ID, socket_index, on_off)
{
    var cmd = {};
    switch(on_off)
    {
        case "On":
            cmd = {
                command_type: "Dimmable Socket",
                command: "Turn On Individual Dimmable Socket",
                device_ID: device_ID,
                socket_index: Number(socket_index)
            }
            break;
        case "Off":
            cmd = {
                command_type: "Dimmable Socket",
                command: "Turn Off Individual Dimmable Socket",
                device_ID: device_ID,
                socket_index: Number(socket_index)
            }
            break;
    }
    Websocket_Send_POST_Command("Electrical", cmd);
}

function Turn_On_Off_All_Dimmable_Socket(device_ID, on_off)
{
    var cmd = {};
    switch(on_off)
    {
        case "On":
            cmd = {
                command_type: "Dimmable Socket",
                command: "Turn On All Dimmable Socket",
                device_ID: device_ID
            }
            break;
        case "Off":
            cmd = {
                command_type: "Dimmable Socket",
                command: "Turn Off All Dimmable Socket",
                device_ID: device_ID
            }
            break;
    }
    Websocket_Send_POST_Command("Electrical", cmd);
}

function Set_Individual_Dimmable_Socket_PWM_Level(device_ID, socket_index, pwm_lvl)
{
    var cmd = {
        command_type: "Dimmable Socket",
        command: "Individual Dimmable Socket Set Pwm Level",
        device_ID: device_ID,
        socket_index: Number(socket_index),
        level: pwm_lvl
    }
    Websocket_Send_POST_Command("Electrical", cmd);
}

function Set_All_Dimmable_Socket_PWM_Level(device_ID, pwm_lvl)
{
    var cmd = {
        command_type: "Dimmable Socket",
        command: "All Dimmable Socket Set Pwm Level",
        device_ID: device_ID,
        level: pwm_lvl
    }
    Websocket_Send_POST_Command("Electrical", cmd);
}

function GET_Dimmable_Socket_Num_Of_Socket(device_ID, callback)
{
    var cmd = {
        command_type: "Dimmable Socket",
        command: "Get Num Of Dimmable Socket",
        device_ID: device_ID,
    }
    Websocket_Send_GET_Command("Electrical", cmd, callback);
}

function GET_Dimmable_Socket_Individual_Socket_Status(device_ID, socket_index, callback)
{
    var cmd = {
        command_type: "Dimmable Socket",
        command: "Get Individual Dimmable Socket Status",
        device_ID: device_ID,
        socket_index: Number(socket_index),
    }
    Websocket_Send_GET_Command("Electrical", cmd, callback);
}

function GET_Dimmable_Socket_All_Socket_Status(device_ID, callback)
{
    var cmd = {
        command_type: "Dimmable Socket",
        command: "Get All Dimmable Socket Status",
        device_ID: device_ID
    }
    Websocket_Send_GET_Command("Electrical", cmd, callback);
}
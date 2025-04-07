
function Turn_On_Off_Circulating_Fan(device_ID, on_off)
{
    var cmd = {};
    switch(on_off)
    {
        case "On":
            cmd = {
                command_type: "Circulating Fan",
                command: "Turn On Circulating Fan",
                device_ID: device_ID
            }
            break;
        case "Off":
            cmd = {
                command_type: "Circulating Fan",
                command: "Turn Off Circulating Fan",
                device_ID: device_ID
            }
            break;
    }
    Websocket_Send_POST_Command("Environment", cmd);
}

function Set_Circulating_Fan_PWM_Level(device_ID, pwm_lvl)
{
    var cmd = {
        command_type: "Circulating Fan",
        command: "Circulating Fan Set PWM Level",
        device_ID: device_ID,
        pwm_lvl: pwm_lvl
    }
    Websocket_Send_POST_Command("Environment", cmd);
}

function GET_Circulating_Fan_OnOff_Status(device_ID, callback)
{
    var cmd = {
        command_type: "Circulating Fan",
        command: "Get Circulating Fan On Off Status",
        device_ID: device_ID
    }
    Websocket_Send_GET_Command("Environment", cmd, callback);
}

function GET_Circulating_Fan_PWM_Level(device_ID, callback)
{
    var cmd = {
        command_type: "Circulating Fan",
        command: "Get Circulating Fan PWM Level",
        device_ID: device_ID
    }
    Websocket_Send_GET_Command("Environment", cmd, callback);
}

function GET_Circulating_Fan_All_Status(device_ID, callback)
{
    var cmd = {
        command_type: "Circulating Fan",
        command: "Get Circulating Fan All Status",
        device_ID: device_ID
    }
    Websocket_Send_GET_Command("Environment", cmd, callback);
}

function Turn_On_Off_Pump_Motor(device_ID, on_off)
{
    var cmd = {};
    switch(on_off)
    {
        case "On":
            cmd = {
                command_type: "Pump Motor",
                command: "Turn On Pump Motor",
                device_ID: device_ID
            }
            break;
        case "Off":
            cmd = {
                command_type: "Pump Motor",
                command: "Turn Off Pump Motor",
                device_ID: device_ID
            }
            break;
    }
    Websocket_Send_POST_Command("Water", cmd);
}

function Set_Pump_Motor_PWM_Level(device_ID, pwm_lvl)
{
    var cmd = {
        command_type: "Pump Motor",
        command: "Pump Motor Set PWM Level",
        device_ID: device_ID,
        pwm_lvl: pwm_lvl
    }
    Websocket_Send_POST_Command("Water", cmd);
}

function GET_Pump_Motor_OnOff_Status(device_ID, callback)
{
    var cmd = {
        command_type: "Pump Motor",
        command: "Get Pump Motor On Off Status",
        device_ID: device_ID
    }
    Websocket_Send_GET_Command("Water", cmd, callback);
}

function GET_Pump_Motor_PWM_Level(device_ID, callback)
{
    var cmd = {
        command_type: "Pump Motor",
        command: "Get Pump Motor PWM Level",
        device_ID: device_ID
    }
    Websocket_Send_GET_Command("Water", cmd, callback);
}

function GET_Pump_Motor_All_Status(device_ID, callback)
{
    var cmd = {
        command_type: "Pump Motor",
        command: "Get Pump Motor All Status",
        device_ID: device_ID
    }
    Websocket_Send_GET_Command("Water", cmd, callback);
}
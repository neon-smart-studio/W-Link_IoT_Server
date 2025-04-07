
function Enable_Disable_Electromagnetic_Valve_Individual_Switch(device_ID, switch_index, en_dis_str)
{
    var cmd = {};
    var en_dis = false;
    switch(en_dis_str)
    {
        case "Enable":
            en_dis = true;
            break;
        case "Disable":
            en_dis = false;
            break;
    }
    cmd = {
        command_type: "Electromagnetic Valve",
        command: "Set Individual Switch En/Dis State",
        device_ID: device_ID,
        switch_index: Number(switch_index),
        enabled: en_dis
    }
    Websocket_Send_POST_Command("Water", cmd);
}

function Enable_Disable_Electromagnetic_Valve_Main_Switch(device_ID, en_dis_str)
{
    var cmd = {};
    var en_dis = false;
    switch(en_dis_str)
    {
        case "Enable":
            en_dis = true;
            break;
        case "Disable":
            en_dis = false;
            break;
    }
    cmd = {
        command_type: "Electromagnetic Valve",
        command: "Set Main Switch En/Dis State",
        device_ID: device_ID,
        enabled: en_dis
    }
    Websocket_Send_POST_Command("Water", cmd);
}

function Turn_On_Off_Electromagnetic_Valve_Individual_Switch(device_ID, switch_index, on_off_str)
{
    var cmd = {};
    var on_off = false;
    switch(on_off_str)
    {
        case "On":
            on_off = true;
            break;
        case "Off":
            on_off = false;
            break;
    }
    cmd = {
        command_type: "Electromagnetic Valve",
        command: "Set Individual Switch On/Off State",
        device_ID: device_ID,
        switch_index: Number(switch_index),
        on_off: on_off
    }
    Websocket_Send_POST_Command("Water", cmd);
}

function Turn_On_Off_Electromagnetic_Valve_Main_Switch(device_ID, on_off_str)
{
    var cmd = {};
    var on_off = false;
    switch(on_off_str)
    {
        case "On":
            on_off = true;
            break;
        case "Off":
            on_off = false;
            break;
    }
    cmd = {
        command_type: "Electromagnetic Valve",
        command: "Set Main Switch On/Off State",
        device_ID: device_ID,
        on_off: on_off
    }
    Websocket_Send_POST_Command("Water", cmd);
}

function GET_Electromagnetic_Valve_Num_Of_Switch(device_ID, callback)
{
    var cmd = {
        command_type: "Electromagnetic Valve",
        command: "Get Num Of Electromagnetic Valve Switch",
        device_ID: device_ID,
    }
    Websocket_Send_GET_Command("Water", cmd, callback);
}

function GET_Electromagnetic_Valve_Main_Switch_Status(device_ID, callback)
{
    var cmd = {
        command_type: "Electromagnetic Valve",
        command: "Get Electromagnetic Valve Main Switch Status",
        device_ID: device_ID,
    }
    Websocket_Send_GET_Command("Water", cmd, callback);
}

function GET_Electromagnetic_Valve_Individual_Switch_Status(device_ID, sw_index, callback)
{
    var cmd = {
        command_type: "Electromagnetic Valve",
        command: "Get Electromagnetic Valve Individual Switch Status",
        device_ID: device_ID,
        sw_index: Number(sw_index),
    }
    Websocket_Send_GET_Command("Water", cmd, callback);
}

function GET_Electromagnetic_Valve_All_Switch_Status(device_ID, callback)
{
    var cmd = {
        command_type: "Electromagnetic Valve",
        command: "Get Electromagnetic Valve All Switch Status",
        device_ID: device_ID
    }
    Websocket_Send_GET_Command("Water", cmd, callback);
}
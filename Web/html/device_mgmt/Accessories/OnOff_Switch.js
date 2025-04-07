
function GET_OnOff_Switch_Support_Actions(device_ID, callback)
{
    var cmd = {
        command_type: "OnOff Switch",
        command: "Get On Off Switch Support Actions",
        device_ID: device_ID
    }
    Websocket_Send_GET_Command("Accessories", cmd, callback);
}

function GET_OnOff_Switch_Num_Of_Switch(device_ID, callback)
{
    var cmd = {
        command_type: "OnOff Switch",
        command: "Get Num Of On Off Switch",
        device_ID: device_ID,
    }
    Websocket_Send_GET_Command("Accessories", cmd, callback);
}

function GET_OnOff_Switch_Individual_Switch_Status(device_ID, switch_index, callback)
{
    var cmd = {
        command_type: "OnOff Switch",
        command: "Get On Off Switch Individual Switch Status",
        device_ID: device_ID,
        switch_index: Number(switch_index),
    }
    Websocket_Send_GET_Command("Accessories", cmd, callback);
}

function GET_OnOff_Switch_All_Switch_Status(device_ID, callback)
{
    var cmd = {
        command_type: "OnOff Switch",
        command: "Get All On Off Switch Status",
        device_ID: device_ID
    }
    Websocket_Send_GET_Command("Accessories", cmd, callback);
}
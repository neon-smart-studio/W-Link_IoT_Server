
function Turn_On_Off_Individual_Power_Meter(device_ID, meter_index, on_off)
{
    var cmd = {};
    switch(on_off)
    {
        case "On":
            cmd = {
                command_type: "Power Meter",
                command: "Turn On Individual Power Meter",
                device_ID: device_ID,
                meter_index: Number(meter_index)
            }
            break;
        case "Off":
            cmd = {
                command_type: "Power Meter",
                command: "Turn Off Individual Power Meter",
                device_ID: device_ID,
                meter_index: Number(meter_index)
            }
            break;
    }
    Websocket_Send_POST_Command("Electrical", cmd);
}

function Turn_On_Off_All_Power_Meter(device_ID, on_off)
{
    var cmd = {};
    switch(on_off)
    {
        case "On":
            cmd = {
                command_type: "Power Meter",
                command: "Turn On All Power Meter",
                device_ID: device_ID
            }
            break;
        case "Off":
            cmd = {
                command_type: "Power Meter",
                command: "Turn Off All Power Meter",
                device_ID: device_ID
            }
            break;
    }
    Websocket_Send_POST_Command("Electrical", cmd);
}

function GET_Power_Meter_Num_Of_Meter(device_ID, callback)
{
    var cmd = {
        command_type: "Power Meter",
        command: "Get Num Of Power Meter",
        device_ID: device_ID,
    }
    Websocket_Send_GET_Command("Electrical", cmd, callback);
}

function GET_Power_Meter_OnOff_State_Record_History(device_ID, start_date, end_date, max_data_count, callback)
{
    var cmd = {
        command_type: "Power Meter",
        command: "Get Power Meter OnOff State Record History",
        device_ID: device_ID,
        start_date: start_date,
        end_date: end_date,
        max_data_count: max_data_count
    }
    Websocket_Send_GET_Command("Electrical", cmd, callback);
}

function GET_Power_Meter_Overall_State_Record_History(device_ID, start_date, end_date, max_data_count, callback)
{
    var cmd = {
        command_type: "Power Meter",
        command: "Get Power Meter Overall State Record History",
        device_ID: device_ID,
        start_date: start_date,
        end_date: end_date,
        max_data_count: max_data_count
    }
    Websocket_Send_GET_Command("Electrical", cmd, callback);
}

function GET_Power_Meter_Individual_Meter_Status(device_ID, meter_index, callback)
{
    var cmd = {
        command_type: "Power Meter",
        command: "Get Individual Power Meter Status",
        device_ID: device_ID,
        meter_index: Number(meter_index),
    }
    Websocket_Send_GET_Command("Electrical", cmd, callback);
}

function GET_Power_Meter_All_Meter_Status(device_ID, callback)
{
    var cmd = {
        command_type: "Power Meter",
        command: "Get All Power Meter Status",
        device_ID: device_ID
    }
    Websocket_Send_GET_Command("Electrical", cmd, callback);
}
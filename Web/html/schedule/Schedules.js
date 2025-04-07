
function Create_New_Schedule(device_type, schedule_Name, target_address_type, target_address_ID, execute_time, repeat_mode, schedule_action)
{
    var cmd = {
        device_type: device_type,
        command: "Create New Schedule",
        schedule_Name: schedule_Name,
        target_address_type: target_address_type,
        target_address_ID: target_address_ID,
        execute_time: execute_time,
        repeat_mode: repeat_mode,
        schedule_action: schedule_action
    }
    Websocket_Send_POST_Command("Schedules", cmd);
}

function Edit_Schedule(device_type, schedule_ID, new_schedule_Name, target_address_type, target_address_ID, execute_time, repeat_mode, schedule_action)
{
    var cmd = {
        device_type: device_type,
        command: "Edit Schedule",
        schedule_ID: schedule_ID,
        new_schedule_Name: new_schedule_Name,
        target_address_type: target_address_type,
        target_address_ID: target_address_ID,
        execute_time: execute_time,
        repeat_mode: repeat_mode,
        schedule_action: schedule_action
    }
    Websocket_Send_POST_Command("Schedules", cmd);
}

function Schedule_Change_Name(device_type, schedule_ID, new_schedule_Name)
{
    var cmd = {
        device_type: device_type,
        command: "Schedule Change Name",
        schedule_ID: schedule_ID,
        new_schedule_Name: new_schedule_Name
    }
    Websocket_Send_POST_Command("Schedules", cmd);
}

function Schedule_Update_Execute_Time(device_type, schedule_ID, new_execute_time)
{
    var cmd = {
        device_type: device_type,
        command: "Update Schedule Execute Time",
        schedule_ID: schedule_ID,
        execute_time: new_execute_time
    }
    Websocket_Send_POST_Command("Schedules", cmd);
}

function Schedule_Update_Repeat_Mode(device_type, schedule_ID, new_repeat_mode)
{
    var cmd = {
        device_type: device_type,
        command: "Update Schedule Repeat Info",
        schedule_ID: schedule_ID,
        repeat_mode: new_repeat_mode
    }
    Websocket_Send_POST_Command("Schedules", cmd);
}

function Schedule_Update_Execute_Action(device_type, schedule_ID, new_schedule_action)
{
    var cmd = {
        device_type: device_type,
        command: "Update Schedule Action",
        schedule_ID: schedule_ID,
        schedule_action: new_schedule_action
    }
    Websocket_Send_POST_Command("Schedules", cmd);
}

function Enable_Disable_Schedule(device_type, schedule_ID, enable)
{
    var cmd = {
        device_type: device_type,
        command: "Enable/Disable Schedule",
        schedule_ID: schedule_ID,
        enable: enable
    }
    Websocket_Send_POST_Command("Schedules", cmd);
}

function Delete_Schedule(device_type, schedule_ID)
{
    var cmd = {
        device_type: device_type,
        command: "Delete Schedule",
        schedule_ID: schedule_ID
    }
    Websocket_Send_POST_Command("Schedules", cmd);
}

function GET_Schedule_List(device_type, callback)
{
    var cmd = {
        device_type: device_type,
        command: "Get Schedule List"
    }
    Websocket_Send_GET_Command("Schedules", cmd, callback);
}

function GET_Enabled_Schedule_List(device_type, callback)
{
    var cmd = {
        device_type: device_type,
        command: "Get Enabled Schedule List"
    }
    Websocket_Send_GET_Command("Schedules", cmd, callback);
}

function GET_Schedule_Info(device_type, schedule_ID, callback)
{
    var cmd = {
        device_type: device_type,
        command: "Get Schedule Info",
        schedule_ID: schedule_ID
    }
    Websocket_Send_GET_Command("Schedules", cmd, callback);
}

function Get_Schedule_Execute_Time(device_type, schedule_ID, callback)
{
    var cmd = {
        device_type: device_type,
        command: "Get Schedule Execute Time",
        schedule_ID: schedule_ID
    }
    Websocket_Send_GET_Command("Schedules", cmd, callback);
}

function GET_Schedule_Repeat_Mode(device_type, schedule_ID, callback)
{
    var cmd = {
        device_type: device_type,
        command: "Get Schedule Repeat Info",
        schedule_ID: schedule_ID
    }
    Websocket_Send_GET_Command("Schedules", cmd, callback);
}

function GET_Schedule_Action(device_type, schedule_ID, callback)
{
    var cmd = {
        device_type: device_type,
        command: "Get Schedule Action",
        schedule_ID: schedule_ID
    }
    Websocket_Send_GET_Command("Schedules", cmd, callback);
}

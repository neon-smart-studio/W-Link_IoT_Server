
function GET_Device_Record_History(device_ID, start_date, end_date, max_data_count, callback)
{
    var cmd = {
        command: "Get Device Record History",
        device_ID: device_ID,
        start_date: start_date,
        end_date: end_date,
        max_data_count: max_data_count
    }
    Websocket_Send_GET_Command("Records", cmd, callback);
}

function GET_Device_Today_Records(device_ID, callback)
{
    var cmd = {
        command: "Get Device Today Records",
        device_ID: device_ID
    }
    Websocket_Send_GET_Command("Records", cmd, callback);
}

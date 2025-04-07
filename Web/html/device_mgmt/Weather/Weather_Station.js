
function GET_Weather_Station_Current_Measure(device_ID, callback)
{
    var cmd = {
        command_type: "Weather Station",
        command: "Get Weather Station Current Measure",
        device_ID: device_ID,
    }
    Websocket_Send_GET_Command("Weather", cmd, callback);
}

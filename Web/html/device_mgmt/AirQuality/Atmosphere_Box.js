
function GET_Atmosphere_Box_Seneor_Status(device_ID, callback)
{
    var cmd = {
        command_type: "Atmosphere Box",
        command: "Get Atmosphere Box Sensor Status",
        device_ID: device_ID,
    }
    Websocket_Send_GET_Command("AirQuality", cmd, callback);
}

function GET_Atmosphere_Box_Seneor_Info(device_ID, callback)
{
    var cmd = {
        command_type: "Atmosphere Box",
        command: "Get Atmosphere Box Sensor Info",
        device_ID: device_ID,
    }
    Websocket_Send_GET_Command("AirQuality", cmd, callback);
}

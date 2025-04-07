
function Bluetooth_Discover_Nearby_Device(discover_time)
{
    var cmd = {
        command: "Discover Nearby Device",
        discover_time: discover_time
    }
    Websocket_Send_POST_Command("Bluetooth", cmd);
}

function Bluetooth_Connect_To_Device(device_ID)
{
    var cmd = {
        command: "Connect To Device",
        device_ID: device_ID
    }
    Websocket_Send_POST_Command("Bluetooth", cmd);
}

function Bluetooth_Disconnect_From_Device(device_ID)
{
    var cmd = {
        command: "Disconnect From Device",
        device_ID: device_ID
    }
    Websocket_Send_POST_Command("Bluetooth", cmd);
}

function GET_Discover_Result(callback)
{
    var cmd = {
        command: "Get Discover Result"
    }
    Websocket_Send_GET_Command("Bluetooth", cmd, callback);
}

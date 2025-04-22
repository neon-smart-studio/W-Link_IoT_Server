
function Link_To_LIFX(ip, mac)
{
    var cmd = {
        command_type: "LIFX",
        command: "Link To LIFX",
        ip: ip,
        mac: mac
    }
    Websocket_Send_POST_Command("Integrate", cmd);
}

function Discover_Nearby_LIFX(callback)
{
    var cmd = {
        command_type: "LIFX",
        command: "Discover Nearby LIFX"
    }
    Websocket_Send_GET_Command("Integrate", cmd, callback);
}

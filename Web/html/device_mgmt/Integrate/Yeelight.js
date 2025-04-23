
function Link_To_Yeelight(ip)
{
    var cmd = {
        command_type: "Yeelight",
        command: "Link To Yeelight",
        ip: ip
    }
    Websocket_Send_POST_Command("Integrate", cmd);
}

function Discover_Nearby_Yeelight(callback)
{
    var cmd = {
        command_type: "Yeelight",
        command: "Discover Nearby Yeelight"
    }
    Websocket_Send_GET_Command("Integrate", cmd, callback);
}

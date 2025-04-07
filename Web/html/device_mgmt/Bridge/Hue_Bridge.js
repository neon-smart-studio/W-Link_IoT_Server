
function Link_To_Hue_Bridge(bridge_IP)
{
    var cmd = {
        command_type: "Hue Bridge",
        command: "Link To Hue Bridge",
        bridge_IP: bridge_IP
    }
    Websocket_Send_POST_Command("Bridge", cmd);
}

function Hue_Bridge_Synchronize_All_Light_Info(bridge_ID)
{
    var cmd = {
        command_type: "Hue Bridge",
        command: "Hue Bridge Synchronize All Light Info",
        device_ID: bridge_ID
    }
    Websocket_Send_POST_Command("Bridge", cmd);
}

function Hue_Bridge_Synchronize_All_Group_Info(bridge_ID)
{
    var cmd = {
        command_type: "Hue Bridge",
        command: "Hue Bridge Synchronize All Group Info",
        device_ID: bridge_ID
    }
    Websocket_Send_POST_Command("Bridge", cmd);
}

function Discover_Nearby_Hue_Bridge(callback)
{
    var cmd = {
        command_type: "Hue Bridge",
        command: "Discover Nearby Hue Bridge"
    }
    Websocket_Send_GET_Command("Bridge", cmd, callback);
}

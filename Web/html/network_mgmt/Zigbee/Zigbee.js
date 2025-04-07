
function Zigbee_Permit_New_Device_Join()
{
    var cmd = {
        command: "Permit New Device Join"
    }
    Websocket_Send_POST_Command("Zigbee", cmd);
}

function Zigbee_Prohibit_New_Device_Join()
{
    var cmd = {
        command: "Prohibit New Device Join"
    }
    Websocket_Send_POST_Command("Zigbee", cmd);
}

function GET_Zigbee_Join_State(callback)
{
    var cmd = {
        command: "Get Zigbee Join State"
    }
    Websocket_Send_GET_Command("Zigbee", cmd, callback);
}

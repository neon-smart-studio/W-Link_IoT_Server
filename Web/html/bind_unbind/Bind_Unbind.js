
function Config_Bind_Action(source_device_type, source_device_ID, source_node_index, source_node_action, target_address_type, target_address_ID, target_action)
{
    var cmd = {
        source_device_type: source_device_type,
        command: "Config Bind Action",
        source_device_ID: source_device_ID,
        source_node_index: Number(source_node_index),
        source_node_action: source_node_action,
        target_address_type: target_address_type,
        target_address_ID: target_address_ID,
        target_action: target_action
    }
    Websocket_Send_POST_Command("BindUnbind", cmd);
}

function Enable_Disable_Bind_Action(source_device_type, source_device_ID, source_node_index, source_node_action, enable)
{
    var cmd = {
        source_device_type: source_device_type,
        command: "Enable/Disable Bind Action",
        source_device_ID: source_device_ID,
        source_node_index: Number(source_node_index),
        source_node_action: source_node_action,
        enable: enable
    }
    Websocket_Send_POST_Command("BindUnbind", cmd);
}

function GET_Bind_Action_Info(source_device_type, source_device_ID, source_node_index, source_node_action, callback)
{
    var cmd = {
        source_device_type: source_device_type,
        command: "Get Bind Action Info",
        source_device_ID: source_device_ID,
        source_node_index: Number(source_node_index),
        source_node_action: source_node_action
    }
    Websocket_Send_GET_Command("BindUnbind", cmd, callback);
}

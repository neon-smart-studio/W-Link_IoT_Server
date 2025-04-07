
function GET_Scene_Switch_Support_Actions(device_ID, callback)
{
    var cmd = {
        command_type: "Scene Switch",
        command: "Get Scene Switch Support Actions",
        device_ID: device_ID
    }
    Websocket_Send_GET_Command("Accessories", cmd, callback);
}

function GET_Scene_Switch_Num_Of_Switch(device_ID, callback)
{
    var cmd = {
        command_type: "Scene Switch",
        command: "Get Num Of Scene Switch",
        device_ID: device_ID,
    }
    Websocket_Send_GET_Command("Accessories", cmd, callback);
}

function GET_Scene_Switch_Individual_Switch_Info(device_ID, switch_index, callback)
{
    var cmd = {
        command_type: "Scene Switch",
        command: "Get Scene Switch Individual Switch Info",
        device_ID: device_ID,
        switch_index: switch_index
    }
    Websocket_Send_GET_Command("Accessories", cmd, callback);
}

function GET_Scene_Switch_All_Switch_Info(device_ID, callback)
{
    var cmd = {
        command_type: "Scene Switch",
        command: "Get Scene Switch All Switch Info",
        device_ID: device_ID
    }
    Websocket_Send_GET_Command("Accessories", cmd, callback);
}

function GET_Scene_Switch_Bind_Action_Info(device_ID, switch_index, action, callback)
{
    var cmd = {
        command_type: "Scene Switch",
        command: "Get Scene Switch Bind Action Info",
        device_ID: device_ID,
        switch_index: Number(switch_index),
        action: action
    }
    Websocket_Send_GET_Command("Accessories", cmd, callback);
}

function Resolv_Scene_Switch_Action_Description(action)
{
    var desc = "";
    switch(action)
    {
        case "default":
            desc = "預設";
            break;
        case "single":
            desc = "按一下";
            break;
        case "double":
            desc = "按兩下";
            break;
        case "triple":
            desc = "按三下";
            break;
        case "hold":
            desc = "按住";
            break;
        case "release":
            desc = "鬆開";
            break;
        case "arrow_left":
            desc = "切換情境左";
            break;
        case "arrow_right":
            desc = "切換情境右";
            break;
    }
    return desc;
}

function Resolv_Scene_Switch_Action_Icon(action)
{
    var tile_icon_url = "/icons/device_mgmt_icons/Accessories/Scene_Switch/scene_switch_action_"+action+".png";
                
    return "<img class=\"icon\" style=\"display: inline;\" src=\""+tile_icon_url+"\"/>";
}

$('head').append('<script type="text/javascript" src="../../device_mgmt/Accessories/Dimmable_Switch.js"></script>');
$('head').append('<script type="text/javascript" src="../../device_mgmt/Accessories/Door_Window_Sensor.js"></script>');
$('head').append('<script type="text/javascript" src="../../device_mgmt/Accessories/Motion_Sensor.js"></script>');
$('head').append('<script type="text/javascript" src="../../device_mgmt/Accessories/OnOff_Switch.js"></script>');
$('head').append('<script type="text/javascript" src="../../device_mgmt/Accessories/Scene_Switch.js"></script>');
$('head').append('<script type="text/javascript" src="../../device_mgmt/Accessories/Toggle_Switch.js"></script>');

function GET_All_Accessories_Device_List(callback)
{
    var cmd = {
        command: "Get All Accessories Device List"
    }
    Websocket_Send_GET_Command("Accessories", cmd, callback);
}

function GET_Specific_Type_Accessories_Device_List(device_type, callback)
{
    switch(device_type)
    {
        case "OnOff Switch":
            GET_OnOff_Switch_Device_List(callback);
            break;
        case "Dimmable Switch":
            GET_Dimmable_Switch_Device_List(callback);
            break;
        case "Toggle Switch":
            GET_Toggle_Switch_Device_List(callback);
            break;
        case "Scene Switch":
            GET_Scene_Switch_Device_List(callback);
            break;
        case "Motion Sensor":
            GET_Motion_Sensor_Device_List(callback);
            break;
        case "Door/Window Sensor":
            GET_Door_Window_Sensor_Device_List(callback);
            break;
    }
}

function GET_Accessories_Device_Num_Of_Node(device_type, device_ID, callback)
{
    var specific_device_cb_function = function(rsp_json)
    {
        var num_of_node = 0;
        switch(device_type)
        {
            case "OnOff Switch":
                num_of_node = rsp_json.num_of_onoff_switch;
                delete rsp_json["num_of_onoff_switch"];
                break;
            case "Dimmable Switch":
                num_of_node = rsp_json.num_of_dimmable_switch;
                delete rsp_json["num_of_dimmable_switch"];
                break;
            case "Toggle Switch":
                num_of_node = rsp_json.num_of_toggle_switch;
                delete rsp_json["num_of_toggle_switch"];
                break;
            case "Scene Switch":
                num_of_node = rsp_json.num_of_scene_switch;
                delete rsp_json["num_of_scene_switch"];
                break;
            case "Motion Sensor":
                num_of_node = rsp_json.num_of_motion_sensor;
                delete rsp_json["num_of_motion_sensor"];
                break;
            case "Door/Window Sensor":
                num_of_node = rsp_json.num_of_door_window_sensor;
                delete rsp_json["num_of_door_window_sensor"];
                break;
        }
        rsp_json["num_of_node"] = num_of_node;

        callback(rsp_json);
    }

    switch(device_type)
    {
        case "OnOff Switch":
            GET_OnOff_Switch_Num_Of_Switch(device_ID, specific_device_cb_function);
            break;
        case "Dimmable Switch":
            GET_Dimmable_Switch_Num_Of_Switch(device_ID, specific_device_cb_function);
            break;
        case "Toggle Switch":
            GET_Toggle_Switch_Num_Of_Switch(device_ID, specific_device_cb_function);
            break;
        case "Scene Switch":
            GET_Scene_Switch_Num_Of_Switch(device_ID, specific_device_cb_function);
            break;
        case "Motion Sensor":
            GET_Motion_Sensor_Num_Of_Sensor(device_ID, specific_device_cb_function);
            break;
        case "Door/Window Sensor":
            GET_Door_Window_Sensor_Num_Of_Sensor(device_ID, specific_device_cb_function);
            break;
    }
}

function GET_Accessories_Device_Support_Actions(device_type, device_ID, callback)
{
    switch(device_type)
    {
        case "OnOff Switch":
            GET_OnOff_Switch_Support_Actions(device_ID, callback);
            break;
        case "Dimmable Switch":
            GET_Dimmable_Switch_Support_Actions(device_ID, callback);
            break;
        case "Toggle Switch":
            GET_Toggle_Switch_Support_Actions(device_ID, callback);
            break;
        case "Scene Switch":
            GET_Scene_Switch_Support_Actions(device_ID, callback);
            break;
        case "Motion Sensor":
            GET_Motion_Sensor_Support_Actions(device_ID, callback);
            break;
        case "Door/Window Sensor":
            GET_Door_Window_Sensor_Support_Actions(device_ID, callback);
            break;
    }
}

function Config_Accessories_Device_Bind_Action(device_type, device_ID, node_index, action, target_address_type, target_address_ID, target_action)
{
    switch(device_type)
    {
        case "Toggle Switch":
            desc = Config_Toggle_Switch_Bind_Action(device_ID, node_index, action, target_address_type, target_address_ID, target_action);
            break;
        case "Scene Switch":
            desc = Config_Scene_Switch_Bind_Action(device_ID, node_index, action, target_address_type, target_address_ID, target_action);
            break;
        case "Motion Sensor":
            desc = Config_Motion_Sensor_Bind_Action(device_ID, node_index, action, target_address_type, target_address_ID, target_action);
            break;
        case "Door/Window Sensor":
            //desc = Config_Door_Window_Sensor_Bind_Action(device_ID, node_index, action, target_address_type, target_address_ID, target_action);
            break;
    }
}

function GET_Accessories_Device_Bind_Action_Info(device_type, device_ID, node_index, action, callback)
{
    switch(device_type)
    {
        case "Toggle Switch":
            GET_Toggle_Switch_Bind_Action_Info(device_ID, node_index, action, callback);
            break;
        case "Scene Switch":
            GET_Scene_Switch_Bind_Action_Info(device_ID, node_index, action, callback);
            break;
        case "Motion Sensor":
            GET_Motion_Sensor_Bind_Action_Info(device_ID, node_index, action, callback);
            break;
        case "Door/Window Sensor":
            //GET_Door_Window_Sensor_Bind_Action_Info(device_ID, node_index, action, callback);
            break;
    }
}

function Resolv_Accessories_Device_Action_Description(device_type, action)
{
    if(action=="default")
    {    
        return "預設";
    }

    var desc = "";
    switch(device_type)
    {
        case "Toggle Switch":
            desc = Resolv_Toggle_Switch_Action_Description(action);
            break;
        case "Scene Switch":
            desc = Resolv_Scene_Switch_Action_Description(action);
            break;
        case "Motion Sensor":
            desc = Resolv_Motion_Sensor_Action_Description(action);
            break;
        case "Door/Window Sensor":
            desc = Resolv_Door_Window_Sensor_Action_Description(action);
            break;
    }
    return desc;
}

function Resolv_Accessories_Device_Action_Icon(device_type, action)
{
    if(action=="default")
    {
        var tile_icon_url = "/icons/device_mgmt_icons/Accessories/default_action_icon.png";
                    
        return "<img class=\"icon\" style=\"display: inline;\" src=\""+tile_icon_url+"\"/>";
    }

    var icon = "";
    switch(device_type)
    {
        case "Toggle Switch":
            icon = Resolv_Toggle_Switch_Action_Icon(action);
            break;
        case "Scene Switch":
            icon = Resolv_Scene_Switch_Action_Icon(action);
            break;
        case "Motion Sensor":
            icon = Resolv_Motion_Sensor_Action_Icon(action);
            break;
        case "Door/Window Sensor":
            icon = Resolv_Door_Window_Sensor_Action_Icon(action);
            break;
    }
    return icon;
}

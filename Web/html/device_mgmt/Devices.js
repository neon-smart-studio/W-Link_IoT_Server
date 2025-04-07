
function Device_Change_Name(device_type, device_ID, new_Name)
{
    var cmd = {
        device_type: device_type,
        command: "Device Change Name",
        device_ID: device_ID,
        device_Name: new_Name
    }
    Websocket_Send_POST_Command("Devices", cmd);
}

function Remove_One_Device(device_type, device_ID)
{
    var cmd = {
        device_type: device_type,
        command: "Remove One Device",
        device_ID: device_ID
    }
    Websocket_Send_POST_Command("Devices", cmd);
}

function Remove_All_Device(device_type)
{
    var cmd = {
        device_type: device_type,
        command: "Remove All Device"
    }
    Websocket_Send_POST_Command("Devices", cmd);
}

function GET_All_Device_List(device_type, callback)
{
    var cmd = {
        device_type: device_type,
        command: "Get All Device List"
    }
    Websocket_Send_GET_Command("Devices", cmd, callback);
}

function GET_Device_Support_Attributes(device_type, device_ID, callback)
{
    var cmd = {
        device_type: device_type,
        device_ID: device_ID,
        command: "Get Device Support Attributes"
    }
    Websocket_Send_GET_Command("Devices", cmd, callback);
}

function GET_Device_Num_Of_Node(device_type, device_ID, callback)
{
    var cmd = {
        device_type: device_type,
        device_ID: device_ID,
        command: "Get Device Num Of Node"
    }
    Websocket_Send_GET_Command("Devices", cmd, callback);
}

function Resolve_Attribute_Chinese_Name(attribute_name)
{
    var attribute_cn_name = "";
    switch(attribute_name)
    {
        case "measure_temperature":
            attribute_cn_name = "溫度"
            break;
        case "measure_humidity":
            attribute_cn_name = "濕度"
            break;
        case "measure_pressure":
            attribute_cn_name = "氣壓"
            break;
        case "measure_lux":
            attribute_cn_name = "照度(lux)"
            break;
    }
    return attribute_cn_name;
}

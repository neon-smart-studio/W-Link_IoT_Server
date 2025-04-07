
function Create_New_Group(device_type, group_Name, device_ID_list)
{
    var cmd = {
        device_type: device_type,
        command:"Create New Group",
        group_Name: group_Name,
        device_ID_list: device_ID_list
    };
    
    Websocket_Send_POST_Command("Groups", cmd);
}

function Group_Change_Name(device_type, group_ID, new_group_Name)
{
    var cmd = {
        device_type: device_type,
        command:"Group Change Name",
        group_ID: group_ID,
        new_group_Name: new_group_Name
    };
    
    Websocket_Send_POST_Command("Groups", cmd);
}

function Remove_One_Group(device_type, group_ID)
{
    var cmd = {
        device_type: device_type,
        command:"Remove One Group",
        group_ID: group_ID
    };
    
    Websocket_Send_POST_Command("Groups", cmd);
}

function Add_One_Device_To_Group(device_type, group_ID, device_ID)
{
    var cmd = {
        device_type: device_type,
        command:"Add One Device to Group",
        group_ID: group_ID,
        device_ID: device_ID
    };
    
    Websocket_Send_POST_Command("Groups", cmd);
}

function Add_Multiple_Device_To_Group(device_type, group_ID, device_ID_list)
{
    var cmd = {
        device_type: device_type,
        command:"Add Multiple Device to Group",
        group_ID: group_ID,
        device_ID_list: device_ID_list
    };
    
    Websocket_Send_POST_Command("Groups", cmd);
}

function Remove_One_Device_From_Group(device_type, group_ID, device_ID)
{
    var cmd = {
        device_type: device_type,
        command:"Remove One Device from Group",
        group_ID: group_ID,
        device_ID: device_ID
    };
    
    Websocket_Send_POST_Command("Groups", cmd);
}

function Remove_Multiple_Device_From_Group(device_type, group_ID, device_ID_list)
{
    var cmd = {
        device_type: device_type,
        command:"Remove Multiple Device from Group",
        group_ID: group_ID,
        device_ID_list: device_ID_list
    };
    
    Websocket_Send_POST_Command("Groups", cmd);
}

function Edit_Group_Device_List(device_type, group_ID, device_ID_list)
{
    var cmd = {
        device_type: device_type,
        command:"Edit Group Device List",
        group_ID: group_ID,
        device_ID_list: device_ID_list
    };
    
    Websocket_Send_POST_Command("Groups", cmd);
}

function GET_All_Group_List(device_type, callback)
{
    var cmd = {
        device_type: device_type,
        command:"Get All Group List"
    };
    
    Websocket_Send_GET_Command("Groups", cmd, callback);
}

function GET_Group_Info(device_type, group_ID, callback)
{
    var cmd = {
        device_type: device_type,
        command:"Get Group List",
        group_ID: group_ID
    };
    
    Websocket_Send_GET_Command("Groups", cmd, callback);
}

function GET_Group_Device_List(device_type, group_ID, callback)
{
    var cmd = {
        device_type: device_type,
        command:"Get Group Device List",
        group_ID: group_ID
    };
    
    Websocket_Send_GET_Command("Groups", cmd, callback);
}

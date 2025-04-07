
function Config_Rule_Action(source_device_type, source_device_ID, rule_name, target_address_type, target_address_ID, rule_conditions, rule_match_action, rule_mismatch_action)
{
    var cmd = {
        source_device_type: source_device_type,
        command: "Config Rule Action",
        source_device_ID: source_device_ID,
        rule_Name: rule_name,
        target_address_type: target_address_type,
        target_address_ID: target_address_ID,
        rule_conditions: rule_conditions,
        rule_match_action: rule_match_action,
        rule_mismatch_action: rule_mismatch_action
    }
    Websocket_Send_POST_Command("Rules", cmd);
}

function Rule_Change_Name(source_device_type, source_device_ID, new_rule_Name)
{
    var cmd = {
        source_device_type: source_device_type,
        command: "Rule Change Name",
        source_device_ID: source_device_ID,
        new_rule_Name: new_rule_Name
    }
    Websocket_Send_POST_Command("Rules", cmd);
}

function Rule_Update_Condition(source_device_type, source_device_ID, new_condition_info)
{
    var cmd = {
        source_device_type: source_device_type,
        command: "Rule Update Conditions",
        source_device_ID: source_device_ID,
        new_condition_info: new_condition_info
    }
    Websocket_Send_POST_Command("Rules", cmd);
}

function Rule_Update_Match_Action(source_device_type, source_device_ID, new_match_action_info)
{
    var cmd = {
        source_device_type: source_device_type,
        command: "Rule Update Match Action",
        source_device_ID: source_device_ID,
        new_match_action_info: new_match_action_info
    }
    Websocket_Send_POST_Command("Rules", cmd);
}

function Rule_Update_MisMatch_Action(source_device_type, source_device_ID, new_mismatch_action_info)
{
    var cmd = {
        source_device_type: source_device_type,
        command: "Rule Update Mismatch Action",
        source_device_ID: source_device_ID,
        new_mismatch_action_info: new_mismatch_action_info
    }
    Websocket_Send_POST_Command("Rules", cmd);
}

function Enable_Disable_Rule(source_device_type, source_device_ID, enable)
{
    var cmd = {
        source_device_type: source_device_type,
        command: "Enable/Disable Rule",
        source_device_ID: source_device_ID,
        enable: enable
    }
    Websocket_Send_POST_Command("Rules", cmd);
}

function Delete_Rule(source_device_type, source_device_ID)
{
    var cmd = {
        source_device_type: source_device_type,
        command: "Delete Rule",
        source_device_ID: source_device_ID
    }
    Websocket_Send_POST_Command("Rules", cmd);
}

function GET_Rule_List(source_device_type, callback)
{
    var cmd = {
        source_device_type: source_device_type,
        command: "Get Rule List"
    }
    Websocket_Send_GET_Command("Rules", cmd, callback);
}

function GET_Rule_Info(source_device_type, source_device_ID, callback)
{
    var cmd = {
        source_device_type: source_device_type,
        command: "Get Rule Info",
        source_device_ID: source_device_ID
    }
    Websocket_Send_GET_Command("Rules", cmd, callback);
}

function GET_Rule_Conditions(source_device_type, source_device_ID, callback)
{
    var cmd = {
        source_device_type: source_device_type,
        command: "Get Rule Conditions",
        source_device_ID: source_device_ID
    }
    Websocket_Send_GET_Command("Rules", cmd, callback);
}

function GET_Rule_Actions(source_device_type, source_device_ID, callback)
{
    var cmd = {
        source_device_type: source_device_type,
        command: "Get Rule Actions",
        source_device_ID: source_device_ID
    }
    Websocket_Send_GET_Command("Rules", cmd, callback);
}

function GET_Rule_Match_Action(source_device_type, source_device_ID, callback)
{
    var cmd = {
        source_device_type: source_device_type,
        command: "Get Rule Match Action",
        source_device_ID: source_device_ID
    }
    Websocket_Send_GET_Command("Rules", cmd, callback);
}

function GET_Rule_MisMatch_Action(source_device_type, source_device_ID, callback)
{
    var cmd = {
        source_device_type: source_device_type,
        command: "Get Rule Mismatch Action",
        source_device_ID: source_device_ID
    }
    Websocket_Send_GET_Command("Rules", cmd, callback);
}

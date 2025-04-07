
function Lighting_Identify_Command(device_ID, id_cmd)
{
    var cmd = id_cmd;
    cmd.device_ID = device_ID;
    cmd.command_type = "Identify";
    Websocket_Send_POST_Command("Lighting", cmd);
}

function Lighting_On_Off_Command(device_ID, on_off_tog_cmd)
{
    var cmd = on_off_tog_cmd;
    cmd.device_ID = device_ID;
    cmd.command_type = "On Off";
    Websocket_Send_POST_Command("Lighting", cmd);
}

function Lighting_Level_Command(device_ID, level_cmd)
{
    var cmd = level_cmd;
    cmd.device_ID = device_ID;
    cmd.command_type = "Level";
    Websocket_Send_POST_Command("Lighting", cmd);
}

function Lighting_Colored_Command(device_ID, color_cmd)
{
    var cmd = color_cmd;
    cmd.device_ID = device_ID;
    cmd.command_type = "Colored";
    Websocket_Send_POST_Command("Lighting", cmd);
}

function Lighting_Color_Temperature_Command(device_ID, color_cmd)
{
    var cmd = color_cmd;
    cmd.device_ID = device_ID;
    cmd.command_type = "Color Temperature";
    Websocket_Send_POST_Command("Lighting", cmd);
}

function Lighting_Identify_Normal(device_ID, duration)
{
    var cmd = {
        command:"Identify Normal",
        duration:Number(duration)
    };
    Lighting_Identify_Command(device_ID, cmd);
}

function Lighting_Identify_With_Effect(device_ID, effect)
{
    var cmd = {};
    
    switch(effect){
        case "Blink":
        case "Breathe":
        case "OK":
        case "Channel Change":
        case "Finish":
        case "Stop":
            cmd.command = "Identify " + effect;
            Lighting_Identify_Command(device_ID, cmd);
            break;
        default:
            break;
    }
}

function Lighting_On_Off_Tog(device_ID, on_off_tog)
{
    var cmd = {};
    switch(on_off_tog){
        case "Turn On":
        case "Turn Off":
        case "Toggle":
            cmd.command = on_off_tog;
            Lighting_On_Off_Command(device_ID, cmd);
            break;
        default:
            break;
    }
}

function Lighting_Move_To_Level(device_ID, level, trans_time, with_on_off)
{
    var cmd = {
        command:"Move To Level",
        target_level:Number(level),
        trans_time:Number(trans_time)
    };
    if(with_on_off==1){
        cmd.with_on_off = true;
    }
    else{
        cmd.with_on_off = false;
    }
    Lighting_Level_Command(device_ID, cmd);
}

function Lighting_Move_Level_Up_Down(device_ID, move_rate, direction, with_on_off)
{
    var cmd = {};
    switch(direction){
        case "Up":
        case "Down":
            cmd.command = "Move Level";
            cmd.direction = direction;
            cmd.rate = Number(move_rate);
            if(with_on_off==1){
                cmd.with_on_off = true;
            }
            else{
                cmd.with_on_off = false;
            }
            Lighting_Level_Command(device_ID, cmd);
            break;
        default:
            break;
    }
}

function Lighting_Step_Level_Up_Down(device_ID, step_level, direction, trans_time, with_on_off)
{
    var cmd = {};
    switch(direction){
        case "Up":
        case "Down":
            cmd.command = "Step Level";
            cmd.direction = direction;
            cmd.step_level = Number(step_level);
            cmd.trans_time = Number(trans_time);
            if(with_on_off==1){
                cmd.with_on_off = true;
            }
            else{
                cmd.with_on_off = false;
            }
            Lighting_Level_Command(device_ID, cmd);
            break;
        default:
            break;
    }
}

function Lighting_Stop_Level_Command(device_ID)
{
    var cmd = {
        command:"Stop Command"
    };
    Lighting_Level_Command(device_ID, cmd);
}

function Lighting_Move_To_Hue(device_ID, hue, trans_time)
{
    var cmd = {
        command:"Move To Hue",
        target_hue:Number(hue),
        trans_time:Number(trans_time)
    };
    Lighting_Colored_Command(device_ID, cmd);
}

function Lighting_Move_To_Enhanced_Hue(device_ID, enhanced_hue, trans_time)
{
    var cmd = {
        command:"Move To Enhanced Hue",
        target_enhanced_hue:Number(enhanced_hue),
        trans_time:Number(trans_time)
    };
    Lighting_Colored_Command(device_ID, cmd);
}

function Lighting_Move_To_Saturation(device_ID, saturation, trans_time)
{
    var cmd = {
        command:"Move To Saturation",
        target_sat:Number(saturation),
        trans_time:Number(trans_time)
    };
    Lighting_Colored_Command(device_ID, cmd);
}

function Lighting_Move_To_Hue_And_Saturation(device_ID, hue, saturation, trans_time)
{
    var cmd = {
        command:"Move To Hue and Saturation",
        target_hue:Number(hue),
        target_sat:Number(saturation),
        trans_time:Number(trans_time)
    };
    Lighting_Colored_Command(device_ID, cmd);
}

function Lighting_Move_To_Color_XY(device_ID, x, y, trans_time)
{
    var cmd = {
        command:"Move To Color XY",
        target_X:Number(x),
        target_Y:Number(y),
        trans_time:Number(trans_time)
    };
    Lighting_Colored_Command(device_ID, cmd);
}

function Lighting_Move_Hue_Up_Down(device_ID, move_rate, direction)
{
    var cmd = {};
    switch(direction){
        case "Up":
        case "Down":
            cmd.command = "Move Hue";
            cmd.direction = Number(direction);
            cmd.rate = Number(move_rate);
            Lighting_Colored_Command(device_ID, cmd);
            break;
        default:
            break;
    }
}

function Lighting_Move_Enhanced_Hue_Up_Down(device_ID, move_rate, direction)
{
    var cmd = {};
    switch(direction){
        case "Up":
        case "Down":
            cmd.command = "Move Enhanced Hue";
            cmd.direction = Number(direction);
            cmd.rate = Number(move_rate);
            Lighting_Colored_Command(device_ID, cmd);
            break;
        default:
            break;
    }
}

function Lighting_Move_Saturation_Up_Down(device_ID, move_rate, direction)
{
    var cmd = {};
    switch(direction){
        case "Up":
        case "Down":
            cmd.command = "Move Saturation";
            cmd.direction = direction;
            cmd.rate = Number(move_rate);
            Lighting_Colored_Command(device_ID, cmd);
            break;
        default:
            break;
    }
}

function Lighting_Move_Color_XY_Up_Down(device_ID, move_rate_x, move_rate_y, direction)
{
    var cmd = {};
    switch(direction){
        case "Up":
        case "Down":
            cmd.command = "Move Color XY";
            cmd.direction = direction;
            cmd.rate_X = Number(move_rate_x);
            cmd.rate_Y = Number(move_rate_y);
            Lighting_Colored_Command(device_ID, cmd);
            break;
        default:
            break;
    }
}

function Lighting_Step_Hue_Up_Down(device_ID, step_hue, direction, trans_time)
{
    var cmd = {};
    switch(direction){
        case "Up":
        case "Down":
            cmd.command = "Step Hue";
            cmd.direction = direction;
            cmd.step_hue = Number(step_hue);
            cmd.trans_time = Number(trans_time);
            Lighting_Colored_Command(device_ID, cmd);
            break;
        default:
            break;
    }
}

function Lighting_Step_Enhanced_Hue_Up_Down(device_ID, step_enhanced_hue, direction, trans_time)
{
    var cmd = {};
    switch(direction){
        case "Up":
        case "Down":
            cmd.command = "Step Enhanced Hue";
            cmd.direction = direction;
            cmd.step_enhanced_hue = Number(step_enhanced_hue);
            cmd.trans_time = Number(trans_time);
            Lighting_Colored_Command(device_ID, cmd);
            break;
        default:
            break;
    }
}

function Lighting_Step_Saturation_Up_Down(device_ID, step_saturation, direction, trans_time)
{
    var cmd = {};
    switch(direction){
        case "Up":
        case "Down":
            cmd.command = "Step Saturation";
            cmd.direction = direction;
            cmd.step_sat = Number(step_saturation);
            cmd.trans_time = Number(trans_time);
            Lighting_Colored_Command(device_ID, cmd);
            break;
        default:
            break;
    }
}

function Lighting_Step_Color_XY_Up_Down(device_ID, step_x, step_y, direction, trans_time)
{
    var cmd = {};
    switch(direction){
        case "Up":
        case "Down":
            cmd.command = "Step Color XY";
            cmd.direction = direction;
            cmd.step_x = Number(step_x);
            cmd.step_y = Number(step_y);
            cmd.trans_time = Number(trans_time);
            Lighting_Colored_Command(device_ID, cmd);
            break;
        default:
            break;
    }
}

function Lighting_Stop_Hue_Command(device_ID)
{
    var cmd = {
        command:"Stop Hue Command"
    };
    Lighting_Colored_Command(device_ID, cmd);
}

function Lighting_Stop_Enhanced_Hue_Command(device_ID)
{
    var cmd = {
        command:"Stop Enhanced Hue Command"
    };
    Lighting_Colored_Command(device_ID, cmd);
}

function Lighting_Stop_Saturation_Command(device_ID)
{
    var cmd = {
        command:"Stop Saturation Command"
    };
    Lighting_Colored_Command(device_ID, cmd);
}

function Lighting_Move_To_Color_Temperature(device_ID, color_temp, trans_time)
{
    var cmd = {
        command:"Move To Color Temperature",
        target_color_temperature:Number(color_temp),
        trans_time:Number(trans_time)
    };
    Lighting_Color_Temperature_Command(device_ID, cmd);
}

function GET_Light_OnOff_Status(device_ID, callback)
{
    var cmd = {
        device_ID: device_ID,
        command_type:"On Off",
        command:"Get Light On Off Status"
    };
    
    Websocket_Send_GET_Command("Lighting", cmd, callback);
}

function GET_Light_Current_Level(device_ID, callback)
{
    var cmd = {
        device_ID: device_ID,
        command_type:"Level",
        command:"Get Light Current Level"
    };
    
    Websocket_Send_GET_Command("Lighting", cmd, callback);
}

function GET_Light_Current_Color(device_ID, callback)
{
    var cmd = {
        device_ID: device_ID,
        command_type:"Colored",
        command:"Get Light Current Color"
    };
    
    Websocket_Send_GET_Command("Lighting", cmd, callback);
}

function GET_Light_Current_Color_Temperature(device_ID, callback)
{
    var cmd = {
        device_ID: device_ID,
        command_type:"Color Temperature",
        command:"Get Light Current Color Temperature"
    };
    
    Websocket_Send_GET_Command("Lighting", cmd, callback);
}

function GET_Light_All_Status(device_ID, callback)
{
    var cmd = {
        device_ID: device_ID,
        command:"Get Light All Status"
    };
    
    Websocket_Send_GET_Command("Lighting", cmd, callback);
}

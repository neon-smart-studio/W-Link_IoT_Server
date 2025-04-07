
var debug = require('debug')(require('path').basename(__filename));

var Lighting_API = require('../../../Device_MGMT/Lighting/Lighting_API.js');
var lighting_api = new Lighting_API();
var Light_Sensor_WebSocket = require('./Light_Sensor_WebSocket.js');
var light_sensor_websocket = new Light_Sensor_WebSocket();

async function Process_Lighting_WebSocket_POST_Identify_Message(username, post_id_json_data)
{
    try{
        if(post_id_json_data.command!=null && post_id_json_data.device_ID!=null){
            switch(post_id_json_data.command){
                case "Identify Normal":
                    if(post_id_json_data.duration!=null){
                        await lighting_api.Light_Identify_Normal(post_id_json_data.device_ID, post_id_json_data.duration);
                    }
                    break;
                case "Identify Blink":
                    await lighting_api.Light_Identify_With_Effect(post_id_json_data.device_ID, "Blink");
                    break;
                case "Identify Breathe":
                    await lighting_api.Light_Identify_With_Effect(post_id_json_data.device_ID, "Breathe");
                    break;
                case "Identify OK":
                    await lighting_api.Light_Identify_With_Effect(post_id_json_data.device_ID, "OK");
                    break;
                case "Identify Channel Change":
                    await lighting_api.Light_Identify_With_Effect(post_id_json_data.device_ID, "Channel Change");
                    break;
                case "Identify Finish":
                    await lighting_api.Light_Identify_With_Effect(post_id_json_data.device_ID, "Finish");
                    break;
                case "Identify Stop":
                    await lighting_api.Light_Identify_With_Effect(post_id_json_data.device_ID, "Stop");
                    break; 
        }
        }
    }
    catch(e)
    {
        debug('[Lighting_WebSocket] Process_Lighting_WebSocket_POST_Identify_Message() Error ' + e);
    }
}

async function Process_Lighting_WebSocket_POST_On_Off_Message(username, post_on_off_json_data)
{
    try{
        if(post_on_off_json_data.command!=null && post_on_off_json_data.device_ID!=null){
            switch(post_on_off_json_data.command){
                case "Turn On":
                    await lighting_api.Light_Turn_On_Off(post_on_off_json_data.device_ID, true);
                    break;
                case "Turn Off":
                    await lighting_api.Light_Turn_On_Off(post_on_off_json_data.device_ID, false);
                    break;
                case "Toggle":
                    await lighting_api.Light_Toggle_OnOff(post_on_off_json_data.device_ID);
                    break;
                case "Turn On With Timed Off":
                    if(post_on_off_json_data.keep_on_time!=null){
                        await lighting_api.Light_Turn_On_With_Timed_Off(post_on_off_json_data.device_ID, post_on_off_json_data.keep_on_time);
                    }
                    break;
            }
        }
    }
    catch(e)
    {
        debug('[Lighting_WebSocket] Process_Lighting_WebSocket_POST_On_Off_Message() Error ' + e);
    }
}

async function Process_Lighting_WebSocket_POST_Level_Message(username, post_lvl_json_data)
{
    try{
        if(post_lvl_json_data.command!=null && post_lvl_json_data.device_ID!=null){
            switch(post_lvl_json_data.command){
                case "Move To Level":
                    if(post_lvl_json_data.target_level!=null && post_lvl_json_data.trans_time!=null && post_lvl_json_data.with_on_off!=null){
                        await lighting_api.Light_Move_To_Level(post_lvl_json_data.device_ID, post_lvl_json_data.target_level, post_lvl_json_data.trans_time, post_lvl_json_data.with_on_off);
                    }
                    break;
                case "Move Level":
                    if(post_lvl_json_data.direction!=null && post_lvl_json_data.rate!=null && post_lvl_json_data.with_on_off!=null){
                        await lighting_api.Light_Move_Level_Up_Down(post_lvl_json_data.device_ID, post_lvl_json_data.rate, post_lvl_json_data.direction, post_lvl_json_data.with_on_off);
                    }
                    break;
                case "Step Level":
                    if(post_lvl_json_data.direction!=null && post_lvl_json_data.step_level!=null && post_lvl_json_data.trans_time!=null && post_lvl_json_data.with_on_off!=null){
                        await lighting_api.Light_Move_Level_Up_Down(post_lvl_json_data.device_ID, post_lvl_json_data.step_level, post_lvl_json_data.direction, post_lvl_json_data.trans_time, post_lvl_json_data.with_on_off);
                    }
                    break;
                case "Stop Command":
                    await lighting_api.Light_Stop_Level_Command(post_lvl_json_data.device_ID);
                    break;
            }
        }
    }
    catch(e)
    {
        debug('[Lighting_WebSocket] Process_Lighting_WebSocket_POST_Level_Message() Error ' + e);
    }
}

async function Process_Lighting_WebSocket_POST_Colored_Message(username, post_colored_json_data)
{
    try{
        if(post_colored_json_data.command!=null && post_colored_json_data.device_ID!=null){
            switch(post_colored_json_data.command){
                case "Move To Hue":
                    if(post_colored_json_data.target_hue!=null && post_colored_json_data.trans_time!=null){
                        await lighting_api.Light_Move_To_Hue(post_colored_json_data.device_ID, post_colored_json_data.target_hue, post_colored_json_data.trans_time);
                    }
                    break;
                case "Move To Enhanced Hue":
                    if(post_colored_json_data.target_enhanced_hue!=null && post_colored_json_data.trans_time!=null){
                        await lighting_api.Light_Move_To_Enhanced_Hue(post_colored_json_data.device_ID, post_colored_json_data.target_enhanced_hue, post_colored_json_data.trans_time);
                    }
                    break;
                case "Move To Saturation":
                    if(post_colored_json_data.target_sat!=null && post_colored_json_data.trans_time!=null){
                        await lighting_api.Light_Move_To_Saturation(post_colored_json_data.device_ID, post_colored_json_data.target_sat, post_colored_json_data.trans_time);
                    }
                    break;
                case "Move To Hue and Saturation":
                    if(post_colored_json_data.target_hue!=null && post_colored_json_data.target_sat!=null && post_colored_json_data.trans_time!=null){
                        await lighting_api.Light_Move_To_Hue_And_Saturation(post_colored_json_data.device_ID, post_colored_json_data.target_hue, post_colored_json_data.target_sat, post_colored_json_data.trans_time);
                    }
                    break;
                case "Move To Color XY":
                    if(post_colored_json_data.target_X!=null && post_colored_json_data.target_Y!=null && post_colored_json_data.trans_time!=null){
                        await lighting_api.Light_Move_To_Color_XY(post_colored_json_data.device_ID, post_colored_json_data.target_X, post_colored_json_data.target_Y, post_colored_json_data.trans_time);
                    }
                    break;
                case "Move Hue":
                    if(post_colored_json_data.direction!=null && post_colored_json_data.rate!=null){
                        await lighting_api.Light_Move_Hue_Up_Down(post_colored_json_data.device_ID, post_colored_json_data.rate, post_colored_json_data.direction);
                    }
                    break;
                case "Move Enhanced Hue":
                    if(post_colored_json_data.direction!=null && post_colored_json_data.rate!=null){
                        await lighting_api.Light_Move_Enhanced_Hue_Up_Down(post_colored_json_data.device_ID, post_colored_json_data.rate, post_colored_json_data.direction);
                    }
                    break;
                case "Move Saturation":
                    if(post_colored_json_data.direction!=null && post_colored_json_data.rate!=null){
                        await lighting_api.Light_Move_Saturation_Up_Down(post_colored_json_data.device_ID, post_colored_json_data.rate, post_colored_json_data.direction);
                    }
                    break;
                case "Move Color XY":
                    if(post_colored_json_data.direction!=null && post_colored_json_data.rate_X!=null && post_colored_json_data.rate_Y!=null){
                        await lighting_api.Light_Move_Color_XY_Up_Down(post_colored_json_data.device_ID, post_colored_json_data.rate_X, post_colored_json_data.rate_Y, post_colored_json_data.direction);
                    }
                    break;
                case "Step Hue":
                    if(post_colored_json_data.direction!=null && post_colored_json_data.step_hue!=null && post_colored_json_data.trans_time!=null){
                        await lighting_api.Light_Step_Hue_Up_Down(post_colored_json_data.device_ID, post_colored_json_data.step_hue, post_colored_json_data.direction, post_colored_json_data.trans_time);
                    }
                    break;
                case "Step Enhanced Hue":
                    if(post_colored_json_data.direction!=null && post_colored_json_data.step_enhanced_hue!=null && post_colored_json_data.trans_time!=null){
                        await lighting_api.Light_Step_Hue_Up_Down(post_colored_json_data.device_ID, post_colored_json_data.step_enhanced_hue, post_colored_json_data.direction, post_colored_json_data.trans_time);
                    }
                    break;
                case "Step Saturation":
                    if(post_colored_json_data.direction!=null && post_colored_json_data.step_sat!=null && post_colored_json_data.trans_time!=null){
                        await lighting_api.Light_Step_Hue_Up_Down(post_colored_json_data.device_ID, post_colored_json_data.step_sat, post_colored_json_data.direction, post_colored_json_data.trans_time);
                    }
                    break;
                case "Step Color XY":
                    if(post_colored_json_data.direction!=null && post_colored_json_data.step_x!=null && post_colored_json_data.step_y!=null && post_colored_json_data.trans_time!=null){
                        await lighting_api.Light_Step_Color_XY_Up_Down(post_colored_json_data.device_ID, post_colored_json_data.step_x, post_colored_json_data.step_y, post_colored_json_data.direction, post_colored_json_data.trans_time);
                        }
                    break;
                case "Stop Hue Command":
                    await lighting_api.Light_Stop_Hue_Command(post_colored_json_data.device_ID);
                    break;
                case "Stop Enhanced Hue Command":
                    await lighting_api.Light_Stop_Enhanced_Hue_Command(post_colored_json_data.device_ID);
                    break;
                case "Stop Saturation Command":
                    await lighting_api.Light_Stop_Saturation_Command(post_colored_json_data.device_ID);
                    break;
            }
        }
    }
    catch(e)
    {
        debug('[Lighting_WebSocket] Process_Lighting_WebSocket_POST_Colored_Message() Error ' + e);
    }
}

async function Process_Lighting_WebSocket_POST_Color_Temperature_Message(username, post_color_temp_json_data)
{
    try{
        if(post_color_temp_json_data.command!=null && post_color_temp_json_data.device_ID!=null){
            switch(post_color_temp_json_data.command){
                case "Move To Color Temperature":
                    if(post_color_temp_json_data.target_color_temperature!=null && post_color_temp_json_data.trans_time!=null){
                        await lighting_api.Light_Move_To_Color_Temperature(post_color_temp_json_data.device_ID, post_color_temp_json_data.target_color_temperature, post_color_temp_json_data.trans_time);
                    }
                    break;
            }
        }
    }
    catch(e)
    {
        debug('[Lighting_WebSocket] Process_Lighting_WebSocket_POST_Color_Temperature_Message() Error ' + e);
    }
}

async function Process_Lighting_WebSocket_GET_On_Off_Message(username, get_on_off_json_data)
{
    try{
        var rsp_json = null;
        if(get_on_off_json_data.command!=null){
            switch(get_on_off_json_data.command){
                case "Get Light On Off Status":
                    if(get_on_off_json_data.device_ID!=null){
                        var on_off_rsp_json = await lighting_api.Get_Light_On_Off_Status(get_on_off_json_data.device_ID);
                        if(on_off_rsp_json.timeout==true){
                            rsp_json = {
                                "timeout": true,
                                "device_ID": get_on_off_json_data.device_ID,
                                "command_type": "On Off"
                            };
                        }
                        else{
                            rsp_json = {
                                "timeout": false,
                                "device_ID": get_on_off_json_data.device_ID,
                                "command_type": "On Off",
                                "on_off": on_off_rsp_json.on_off
                            };
                        }
                    }
            }
        }
        return rsp_json;
    }
    catch(e)
    {
        debug('[Lighting_WebSocket] Process_Lighting_WebSocket_GET_On_Off_Message() Error ' + e);
    }
}

async function Process_Lighting_WebSocket_GET_Level_Message(username, get_level_json_data)
{
    try{
        var rsp_json = null;
        if(get_level_json_data.command!=null){
            switch(get_level_json_data.command){
                case "Get Light Current Level":
                    if(get_level_json_data.device_ID!=null){
                        var level_rsp_json = await lighting_api.Get_Light_Current_Level(get_level_json_data.device_ID);
                        if(level_rsp_json.timeout==true){
                            rsp_json = {
                                "timeout": true,
                                "device_ID": get_level_json_data.device_ID,
                                "command_type": "Level"
                            };
                        }
                        else{
                            rsp_json = {
                                "timeout": false,
                                "device_ID": get_level_json_data.device_ID,
                                "command_type": "Level",
                                "level": level_rsp_json.level
                            };
                        }
                    }
            }
        }
        return rsp_json;
    }
    catch(e)
    {
        debug('[Lighting_WebSocket] Process_Lighting_WebSocket_GET_Level_Message() Error ' + e);
    }
}

async function Process_Lighting_WebSocket_GET_Colored_Message(username, get_colored_json_data)
{
    try{
        var rsp_json = null;
        if(get_colored_json_data.command!=null){
            switch(get_colored_json_data.command){
                case "Get Light Current Color":
                    if(get_colored_json_data.device_ID!=null){
                        var colored_rsp_json = await lighting_api.Get_Light_Current_Color(get_colored_json_data.device_ID);
                        if(colored_rsp_json.timeout==true){
                            rsp_json = {
                                "timeout": true,
                                "device_ID": get_colored_json_data.device_ID,
                                "command_type": "Colored"
                            };
                        }
                        else{
                            rsp_json = {
                                "timeout": false,
                                "device_ID": get_colored_json_data.device_ID,
                                "command_type": "Colored",
                                "hue": colored_rsp_json.hue,
                                "saturation": colored_rsp_json.saturation,
                                "enhanced_hue": colored_rsp_json.enhanced_hue,
                                "color_x": colored_rsp_json.color_x,
                                "color_y": colored_rsp_json.color_y
                            };
                        }
                    }
            }
        }
        return rsp_json;
    }
    catch(e)
    {
        debug('[Lighting_WebSocket] Process_Lighting_WebSocket_GET_Colored_Message() Error ' + e);
    }
}

async function Process_Lighting_WebSocket_GET_Color_Temperature_Message(username, get_color_temp_json_data)
{
    try{
        var rsp_json = null;
        if(get_color_temp_json_data.command!=null){
            switch(get_color_temp_json_data.command){
                case "Get Light Current Color Temperature":
                    if(get_color_temp_json_data.device_ID!=null){
                        var color_temp_rsp_json = await lighting_api.Get_Light_Current_Color_Temperature(get_color_temp_json_data.device_ID);
                        if(color_temp_rsp_json.timeout==true){
                            rsp_json = {
                                "timeout": true,
                                "device_ID": get_color_temp_json_data.device_ID,
                                "command_type": "Color Temperature"
                            };
                        }
                        else{
                            rsp_json = {
                                "timeout": false,
                                "device_ID": get_color_temp_json_data.device_ID,
                                "command_type": "Color Temperature",
                                "color_temperature": color_temp_rsp_json.color_temperature
                            };
                        }
                    }
                    break;
            }
        }
        return rsp_json;
    }
    catch(e)
    {
        debug('[Lighting_WebSocket] Process_Lighting_WebSocket_GET_Color_Temperature_Message() Error ' + e);
    }
}

async function Process_Lighting_WebSocket_POST_Message(username, post_json_data)
{
    try{
        if(post_json_data.command!=null && post_json_data.device_ID!=null){
            switch(get_json_data.command){
            }
        }
    }
    catch(e)
    {
        debug('[Lighting_WebSocket] Process_Lighting_WebSocket_POST_Message() Error ' + e);
    }
}

async function Process_Lighting_WebSocket_GET_Message(username, get_json_data)
{
    try{
        var rsp_json = null;
        if(get_json_data.command!=null){
            switch(get_json_data.command){
                case "Get Light All Status":
                    if(get_json_data.device_ID!=null){
                        rsp_json = await lighting_api.Get_Light_All_Status(get_json_data.device_ID);
                    }
                    break;
            }
        }
        return rsp_json;
    }
    catch(e)
    {
        debug('[Lighting_WebSocket] Process_Lighting_WebSocket_GET_Message() Error ' + e);
    }
}

var Lighting_WebSocket = function (){
    var self = this;
    
    self.Process_Lighting_Topic_WebSocket_POST_Message = async function(username, post_json_data)
    {
        try{
            if(post_json_data.command_type==null){
                await Process_Lighting_WebSocket_POST_Message(username, post_json_data);
            }
            else{
                switch(post_json_data.command_type){
                    case "Light Sensor":
                        await light_sensor_websocket.Process_Light_Sensor_WebSocket_POST_Message(username, post_json_data);
                        break;
                    case "Identify":
                        await Process_Lighting_WebSocket_POST_Identify_Message(username, post_json_data);
                        break;
                    case "On Off":
                        await Process_Lighting_WebSocket_POST_On_Off_Message(username, post_json_data);
                        break;
                    case "Level":
                        await Process_Lighting_WebSocket_POST_Level_Message(username, post_json_data);
                        break;
                    case "Colored":
                        await Process_Lighting_WebSocket_POST_Colored_Message(username, post_json_data);
                        break;
                    case "Color Temperature":
                        await Process_Lighting_WebSocket_POST_Color_Temperature_Message(username, post_json_data);
                        break;
                }
            }
        }
        catch(e)
        {
            debug('[Lighting_WebSocket] Process_Lighting_Topic_WebSocket_POST_Message() Error ' + e);
        }
    }

    self.Process_Lighting_Topic_WebSocket_GET_Message = async function(username, get_json_data)
    {
        try{
            var rsp_json = null;
            if(get_json_data.command_type==null){
                rsp_json = await Process_Lighting_WebSocket_GET_Message(username, get_json_data);
            }
            else{
                switch(get_json_data.command_type){
                    case "Light Sensor":
                        rsp_json = await light_sensor_websocket.Process_Light_Sensor_WebSocket_GET_Message(username, get_json_data);
                        break;
                    case "On Off":
                        rsp_json = await Process_Lighting_WebSocket_GET_On_Off_Message(username, get_json_data);
                        break;
                    case "Level":
                        rsp_json = await Process_Lighting_WebSocket_GET_Level_Message(username, get_json_data);
                        break;
                    case "Colored":
                        rsp_json = await Process_Lighting_WebSocket_GET_Colored_Message(username, get_json_data);
                        break;
                    case "Color Temperature":
                        rsp_json = await Process_Lighting_WebSocket_GET_Color_Temperature_Message(username, get_json_data);
                        break;
                }
            }
            return rsp_json;
        }
        catch(e)
        {
           debug('[Lighting_WebSocket] Process_Lighting_Topic_WebSocket_GET_Message() Error ' + e);
        }
    }
}
module.exports = Lighting_WebSocket;
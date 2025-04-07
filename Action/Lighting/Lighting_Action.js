
var debug = require('debug')(require('path').basename(__filename));

var Lighting_API = require('../../Device_MGMT/Lighting/Lighting_API.js');
var lighting_api = new Lighting_API();

async function Execute_Lighting_Identify_Action(target_address_ID, command, param_json_data)
{
    try{
        switch(command){
            case "Identify Normal":
                if(param_json_data.duration!=null){
                    await lighting_api.Light_Identify_Normal(target_address_ID, param_json_data.duration);
                }
                break;
            case "Identify Blink":
                await lighting_api.Light_Identify_With_Effect(target_address_ID, "Blink");
                break;
            case "Identify Breathe":
                await lighting_api.Light_Identify_With_Effect(target_address_ID, "Breathe");
                break;
            case "Identify OK":
                await lighting_api.Light_Identify_With_Effect(target_address_ID, "OK");
                break;
            case "Identify Channel Change":
                await lighting_api.Light_Identify_With_Effect(target_address_ID, "Channel Change");
                break;
            case "Identify Finish":
                await lighting_api.Light_Identify_With_Effect(target_address_ID, "Finish");
                break;
            case "Identify Stop":
                await lighting_api.Light_Identify_With_Effect(target_address_ID, "Stop");
                break; 
        }
    }
    catch(e)
    {
        debug('[Lighting_Action] Execute_Lighting_Identify_Action() Error ' + e);
    }
}

async function Execute_Lighting_OnOff_Action(target_address_ID, command, param_json_data)
{
    try{
        switch(command){
            case "Turn On":
                await lighting_api.Light_Turn_On_Off(target_address_ID, true);
                break;
            case "Turn Off":
                await lighting_api.Light_Turn_On_Off(target_address_ID, false);
                break;
            case "Toggle":
                await lighting_api.Light_Toggle_OnOff(target_address_ID);
                break;
            case "Turn On With Timed Off":
                if(param_json_data.keep_on_time!=null){
                    await lighting_api.Light_Turn_On_With_Timed_Off(target_address_ID, param_json_data.keep_on_time);
                }
                break;
        }
    }
    catch(e)
    {
        debug('[Lighting_Action] Execute_Lighting_OnOff_Action() Error ' + e);
    }
}

async function Execute_Lighting_Level_Action(target_address_ID, command, param_json_data)
{
    try{
        switch(command){
            case "Move To Level":
                if(param_json_data.target_level!=null && param_json_data.trans_time!=null && param_json_data.with_on_off!=null){
                    await lighting_api.Light_Move_To_Level(target_address_ID, param_json_data.target_level, param_json_data.trans_time, param_json_data.with_on_off);
                }
                break;
            case "Move Level":
                if(param_json_data.direction!=null && param_json_data.rate!=null && param_json_data.with_on_off!=null){
                    await lighting_api.Light_Move_Level_Up_Down(target_address_ID, param_json_data.rate, param_json_data.direction, param_json_data.with_on_off);
                }
                break;
            case "Step Level":
                if(param_json_data.direction!=null && param_json_data.step_level!=null && param_json_data.trans_time!=null && param_json_data.with_on_off!=null){
                    await lighting_api.Light_Step_Level_Up_Down(target_address_ID, param_json_data.step_level, param_json_data.direction, param_json_data.trans_time, param_json_data.with_on_off);
                }
                break;
            case "Stop Command":
                await lighting_api.Light_Stop_Level_Command(target_address_ID);
                break;
        }
    }
    catch(e)
    {
        debug('[Lighting_Action] Execute_Lighting_Level_Action() Error ' + e);
    }
}

async function Execute_Lighting_Colored_Action(target_address_ID, command, param_json_data)
{
    try{
        switch(command){
            case "Move To Hue":
                if(param_json_data.target_hue!=null && param_json_data.trans_time!=null){
                    await lighting_api.Light_Move_To_Hue(target_address_ID, param_json_data.target_hue, param_json_data.trans_time);
                }
                break;
            case "Move To Enhanced Hue":
                if(param_json_data.target_enhanced_hue!=null && param_json_data.trans_time!=null){
                    await lighting_api.Light_Move_To_Enhanced_Hue(target_address_ID, param_json_data.target_enhanced_hue, param_json_data.trans_time);
                }
                break;
            case "Move To Saturation":
                if(param_json_data.target_sat!=null && param_json_data.trans_time!=null){
                    await lighting_api.Light_Move_To_Saturation(target_address_ID, param_json_data.target_sat, param_json_data.trans_time);
                }
                break;
            case "Move To Hue and Saturation":
                if(param_json_data.target_hue!=null && param_json_data.target_sat!=null && param_json_data.trans_time!=null){
                    await lighting_api.Light_Move_To_Hue_And_Saturation(target_address_ID, param_json_data.target_hue, param_json_data.target_sat, param_json_data.trans_time);
                }
                break;
            case "Move To Color XY":
                if(param_json_data.target_X!=null && param_json_data.target_Y!=null && param_json_data.trans_time!=null){
                    await lighting_api.Light_Move_To_Color_XY(target_address_ID, param_json_data.target_X, param_json_data.target_Y, param_json_data.trans_time);
                }
                break;
            case "Move Hue":
                if(param_json_data.direction!=null && param_json_data.rate!=null){
                    await lighting_api.Light_Move_Hue_Up_Down(target_address_ID, param_json_data.rate, param_json_data.direction);
                }
                break;
            case "Move Enhanced Hue":
                if(param_json_data.direction!=null && param_json_data.rate!=null){
                    await lighting_api.Light_Move_Enhanced_Hue_Up_Down(target_address_ID, param_json_data.rate, param_json_data.direction);
                }
                break;
            case "Move Saturation":
                if(param_json_data.direction!=null && param_json_data.rate!=null){
                    await lighting_api.Light_Move_Saturation_Up_Down(target_address_ID, param_json_data.rate, param_json_data.direction);
                }
                break;
            case "Move Color XY":
                if(param_json_data.direction!=null && param_json_data.rate_X!=null && param_json_data.rate_Y!=null){
                    await lighting_api.Light_Move_Color_XY_Up_Down(target_address_ID, param_json_data.rate_X, param_json_data.rate_Y, param_json_data.direction);
                }
                break;
            case "Step Hue":
                if(param_json_data.direction!=null && param_json_data.step_hue!=null && param_json_data.trans_time!=null){
                    await lighting_api.Light_Step_Hue_Up_Down(target_address_ID, param_json_data.step_hue, param_json_data.direction, param_json_data.trans_time);
                }
                break;
            case "Step Enhanced Hue":
                if(param_json_data.direction!=null && param_json_data.step_enhanced_hue!=null && param_json_data.trans_time!=null){
                    await lighting_api.Light_Step_Hue_Up_Down(target_address_ID, param_json_data.step_enhanced_hue, param_json_data.direction, param_json_data.trans_time);
                }
                break;
            case "Step Saturation":
                if(param_json_data.direction!=null && param_json_data.step_sat!=null && param_json_data.trans_time!=null){
                    await lighting_api.Light_Step_Hue_Up_Down(target_address_ID, param_json_data.step_sat, param_json_data.direction, param_json_data.trans_time);
                }
                break;
            case "Step Color XY":
                if(param_json_data.direction!=null && param_json_data.step_x!=null && param_json_data.step_y!=null && param_json_data.trans_time!=null){
                    await lighting_api.Light_Step_Color_XY_Up_Down(target_address_ID, param_json_data.step_x, param_json_data.step_y, param_json_data.direction, param_json_data.trans_time);
                }
                break;
            case "Stop Hue Command":
                await lighting_api.Light_Stop_Hue_Command(target_address_ID);
                break;
            case "Stop Enhanced Hue Command":
                await lighting_api.Light_Stop_Enhanced_Hue_Command(target_address_ID);
                break;
            case "Stop Saturation Command":
                await lighting_api.Light_Stop_Saturation_Command(target_address_ID);
                break;
        }
    }
    catch(e)
    {
        debug('[Lighting_Action] Execute_Lighting_Colored_Action() Error ' + e);
    }
}

async function Execute_Lighting_Color_Temperature_Action(target_address_ID, command, param_json_data)
{
    try{
        switch(command){
            case "Move To Color Temperature":
                if(param_json_data.target_color_temperature!=null && param_json_data.trans_time!=null){
                    await lighting_api.Light_Move_To_Color_Temperature(target_address_ID, param_json_data.target_color_temperature, param_json_data.trans_time);
                }
                break;
        }
    }
    catch(e)
    {
        debug('[Lighting_Action] Execute_Lighting_Color_Temperature_Action() Error ' + e);
    }
}

var Lighting_Action = function (){
    var self = this;
    
    self.Execute_Lighting_Topic_Action = async function(target_address_ID, command_type, command, param_json_data)
    {
        try{
            switch(command_type){
                case "Identify":
                    await Execute_Lighting_Identify_Action(target_address_ID, command, param_json_data);
                    break;
                case "On Off":
                    await Execute_Lighting_OnOff_Action(target_address_ID, command, param_json_data);
                    break;
                case "Level":
                    await Execute_Lighting_Level_Action(target_address_ID, command, param_json_data);
                    break;
                case "Colored":
                    await Execute_Lighting_Colored_Action(target_address_ID, command, param_json_data);
                    break;
                case "Color Temperature":
                    await Execute_Lighting_Color_Temperature_Action(target_address_ID, command, param_json_data);
                    break;
            }
        }
        catch(e)
        {
            debug('[Lighting_Action] Execute_Lighting_Topic_Action() Error ' + e);
        }
    }
}
module.exports = Lighting_Action;
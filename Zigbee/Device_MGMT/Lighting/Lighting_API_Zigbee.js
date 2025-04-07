
var debug = require('debug')(require('path').basename(__filename));

var Zigbee = require('../../Zigbee.js');
var zigbee = new Zigbee();

var Color_Converter = require('../../../Util/Color_Converter.js');
var color_converter = new Color_Converter();

var Device_MGR = require('../../../Util/Device_MGR.js');
var device_mgr = new Device_MGR();

const Lighting_Device_Type = "Lighting";

const ZB_CCT_Max = 6500;
const ZB_CCT_Min = 2000;
const ZB_CCT_2000_Mapped_Mired_Val = 500;
const ZB_CCT_6500_Mapped_Mired_Val = 156;
const ZB_Mired_CCT_Val_Step = (ZB_CCT_Max-ZB_CCT_Min)/(ZB_CCT_2000_Mapped_Mired_Val-ZB_CCT_6500_Mapped_Mired_Val);

const lighting_api_precisionRound = (number, precision) => {
    const factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
};

var light_turn_on_timed_off_timer = [];

var Lighting_Zigbee_API = function () {
    var self = this;

    self.Zigbee_Light_Identify_Normal = async function (address_ID, duration) {
        try {
            var params = {
                identifytime: Number(duration)*10
            };

            await zigbee.Zigbee_SendCommand(address_ID, "genIdentify", "identify", params);
        }
        catch (e) {
            debug("[Lighting_Zigbee_API] Zigbee_Light_Identify_Normal() Error " + e);
        }
    };

    self.Zigbee_Light_Identify_With_Effect = async function (address_ID, effect) {
        try {
            var params = {
                effectvariant: 0,
                effectid: 0,
            };

            switch (effect) {
                case "Blink":
                    params.effectid = 0;
                    break;
                case "Breathe":
                    params.effectid = 1;
                    break;
                case "OK":
                    params.effectid = 2;
                    break;
                case "Channel Change":
                    params.effectid = 11;
                    break;
                case "Finish":
                    params.effectid = 254;
                    break;
                case "Stop":
                    params.effectid = 255;
                    break;
                default:
                    return;
            }
            
            await zigbee.Zigbee_SendCommand(address_ID, "genIdentify", "triggerEffect", params);
        }
        catch (e) {
            debug("[Lighting_Zigbee_API] Zigbee_Light_Identify_With_Effect() Error " + e);
        }
    };

    self.Zigbee_Light_Turn_On_Off = async function (address_ID, on_off) {
        try {
            if(on_off==true)
            {
                await zigbee.Zigbee_SendCommand(address_ID, "genOnOff", "on", {});
            }
            else
            {
                if(light_turn_on_timed_off_timer[address_ID]!=null)
                {
                    clearTimeout(light_turn_on_timed_off_timer[address_ID]);
                    light_turn_on_timed_off_timer[address_ID] = null;
                }
    
                await zigbee.Zigbee_SendCommand(address_ID, "genOnOff", "off", {});
            }
        }
        catch (e) {
            debug("[Lighting_API_Zigbee] Zigbee_Light_Turn_On_Off() Error " + e);
        }
    };

    self.Zigbee_Light_Toggle_OnOff = async function (address_ID) {
        try {
            if(light_turn_on_timed_off_timer[address_ID]!=null)
            {
                clearTimeout(light_turn_on_timed_off_timer[address_ID]);
                light_turn_on_timed_off_timer[address_ID] = null;
            }

            await zigbee.Zigbee_SendCommand(address_ID, "genOnOff", "toggle", {});
        }
        catch (e) {
            debug("[Lighting_API_Zigbee] Zigbee_Light_Toggle_OnOff() Error " + e);
        }
    };

    self.Zigbee_Light_Turn_On_With_Timed_Off = async function (address_ID, keep_on_time) {
        try {
            //await zigbee.Zigbee_SendCommand(address_ID, "genOnOff", "commandOnWithTimedOff", {ontime: keep_on_time*10});

            if(light_turn_on_timed_off_timer[address_ID]!=null)
            {
                clearTimeout(light_turn_on_timed_off_timer[address_ID]);
                light_turn_on_timed_off_timer[address_ID] = null;
            }

            await zigbee.Zigbee_SendCommand(address_ID, "genOnOff", "on", {});

            light_turn_on_timed_off_timer[address_ID] = setTimeout(()=>{
                light_turn_on_timed_off_timer[address_ID] = null;
                zigbee.Zigbee_SendCommand(address_ID, "genOnOff", "off", {});
            }, keep_on_time*1000);
        }
        catch (e) {
            debug("[Lighting_API_Zigbee] Zigbee_Light_Toggle_OnOff() Error " + e);
        }
    };

    self.Zigbee_Light_Move_To_Level = async function (address_ID, level, trans_time, with_on_off) {
        try {
            if(level< 0 || level>100){
                return;
            }

            var level_256 = Math.round(level/100*255);

            var params = {
                level: Number(level_256),
                transtime: Number(trans_time)*10
            };

            if(with_on_off==1)
            {
                await zigbee.Zigbee_SendCommand(address_ID, "genLevelCtrl", "moveToLevelWithOnOff", params);
            }
            else{
                await zigbee.Zigbee_SendCommand(address_ID, "genLevelCtrl", "moveToLevel", params);
            }
        }
        catch (e) {
            debug("[Lighting_Zigbee_API] Zigbee_Light_Move_To_Level() Error " + e);
        }
    };

    self.Zigbee_Light_Move_Level_Up_Down = async function (address_ID, move_rate, direction, with_on_off) {
        try {
            if(move_rate< 0 || move_rate>100){
                return;
            }

            var mov_level_256 = Math.round(move_rate/100*255);

            var direction_uint8 = 0;
            switch (direction) {
                case "Up":
                    direction_uint8 = 0;
                    break;
                case "Down":
                    direction_uint8 = 1;
                    break;
                default:
                    return;
            }

            var params = {
                movemode: direction_uint8,
                rate: Number(mov_level_256)
            };

            if(with_on_off==1)
            {
                await zigbee.Zigbee_SendCommand(address_ID, "genLevelCtrl", "moveWithOnOff", params);
            }
            else{
                await zigbee.Zigbee_SendCommand(address_ID, "genLevelCtrl", "move", params);
            }
        }
        catch (e) {
            debug("[Lighting_Zigbee_API] Zigbee_Light_Move_Level_Up_Down() Error " + e);
        }
    };

    self.Zigbee_Light_Step_Level_Up_Down = async function (address_ID, step_level, direction, trans_time, with_on_off) {
        try {
            if(step_level< 0 || step_level>100){
                return;
            }

            var step_level_256 = Math.round(step_level/100*255);

            var direction_uint8 = 0;
            switch (direction) {
                case "Up":
                    direction_uint8 = 0;
                    break;
                case "Down":
                    direction_uint8 = 1;
                    break;
                default:
                    return;
            }

            var params = {
                stepmode: direction_uint8,
                stepsize: Number(step_level_256),
                transtime: Number(trans_time)*10
            };


            if(with_on_off==1)
            {
                await zigbee.Zigbee_SendCommand(address_ID, "genLevelCtrl", "stepWithOnOff", params);
            }
            else{
                await zigbee.Zigbee_SendCommand(address_ID, "genLevelCtrl", "step", params);
            }
        }
        catch (e) {
            debug("[Lighting_Zigbee_API] Zigbee_Light_Step_Level_Up_Down() Error " + e);
        }
    };

    self.Zigbee_Light_Stop_Level_Command = async function (address_ID) {
        try {
            await zigbee.Zigbee_SendCommand(address_ID, "genLevelCtrl", "stop", {});
        }
        catch (e) {
            debug("[Lighting_Zigbee_API] Zigbee_Light_Stop_Level_Command() Error " + e);
        }
    };

    self.Zigbee_Light_Move_To_Hue = async function (address_ID, hue, trans_time) {
        try {
            if(hue< 0 || hue>360){
                return;
            }

            var hue_256 = Math.round(hue/360*255);

            var params = {
                hue: Number(hue_256),
                direction: 0,
                transtime: Number(trans_time)*10
            };

            await zigbee.Zigbee_SendCommand(address_ID, "lightingColorCtrl", "moveToHue", params);
        }
        catch (e) {
            debug("[Lighting_Zigbee_API] Zigbee_Light_Move_To_Hue() Error " + e);
        }
    };

    self.Zigbee_Light_Move_To_Enhanced_Hue = async function (address_ID, hue, trans_time) {
        try {
            if(hue< 0 || hue>360){
                return;
            }

            var enhanced_hue_65536 = Math.round(hue/360*65535);

            var params = {
                enhancehue: Number(enhanced_hue_65536),
                direction: 0,
                transtime: Number(trans_time)*10
            };

            await zigbee.Zigbee_SendCommand(address_ID, "lightingColorCtrl", "enhancedMoveToHue", params);
        }
        catch (e) {
            debug("[Lighting_Zigbee_API] Zigbee_Light_Move_To_Enhanced_Hue() Error " + e);
        }
    };

    self.Zigbee_Light_Move_To_Saturation = async function (address_ID, saturation, trans_time) {
        try {
            if(saturation< 0 || saturation>100){
                return;
            }

            var sat_255 = Math.round(saturation/100*255);

            var params = {
                saturation: Number(sat_255),
                transtime: Number(trans_time)*10
            };

            await zigbee.Zigbee_SendCommand(address_ID, "lightingColorCtrl", "moveToSaturation", params);
        }
        catch (e) {
            debug("[Lighting_Zigbee_API] Zigbee_Light_Move_To_Saturation() Error " + e);
        }
    };

    self.Zigbee_Light_Move_To_Hue_And_Saturation = async function (address_ID, hue, saturation, trans_time) {
        try {
            if(hue< 0 || hue>360){
                return;
            }

            if(saturation< 0 || saturation>100){
                return;
            }

            var hue_255 = Math.round(hue/360*255);
            var sat_255 = Math.round(saturation/100*255);

            var params = {
                hue: Number(hue_255),
                saturation: Number(sat_255),
                transtime: Number(trans_time)*10
            };

            await zigbee.Zigbee_SendCommand(address_ID, "lightingColorCtrl", "moveToHueAndSaturation", params);
        }
        catch (e) {
            debug("[Lighting_Zigbee_API] Zigbee_Light_Move_To_Hue_And_Saturation() Error " + e);
        }
    };

    self.Zigbee_Light_Move_To_Enhanced_Hue_And_Saturation = async function (address_ID, hue, saturation, trans_time) {
        try {
            if(hue< 0 || hue>360){
                return;
            }

            if(saturation< 0 || saturation>100){
                return;
            }

            var enhanced_hue_65536 = Math.round(hue/360*65535);
            var sat_255 = Math.round(saturation/100*255);

            var params = {
                enhancehue: Number(enhanced_hue_65536),
                saturation: Number(sat_255),
                transtime: Number(trans_time)*10
            };

            await zigbee.Zigbee_SendCommand(address_ID, "lightingColorCtrl", "enhancedMoveToHueAndSaturation", params);
        }
        catch (e) {
            debug("[Lighting_Zigbee_API] Zigbee_Light_Move_To_Enhanced_Hue_And_Saturation() Error " + e);
        }
    };

    self.Zigbee_Light_Move_To_Color_XY = async function (address_ID, x, y, trans_time) {
        try {
            if(x< 0 || x>1){
                return;
            }

            if(y< 0 || y>1){
                return;
            }

            var color_x_65536 = Math.round(x*65535);
            var color_y_65536 = Math.round(y*65535);

            var params = {
                colorx: Number(color_x_65536),
                colory: Number(color_y_65536),
                transtime: Number(trans_time)*10
            };

            await zigbee.Zigbee_SendCommand(address_ID, "lightingColorCtrl", "moveToColor", params);
        }
        catch (e) {
            debug("[Lighting_Zigbee_API] Zigbee_Light_Move_To_Color_XY() Error " + e);
        }
    };

    self.Zigbee_Light_Move_Hue_Up_Down = async function (address_ID, move_rate, direction) {
        try {
            if(move_rate< 0 || move_rate>360){
                return;
            }

            var mov_hue_256 = Math.round(move_rate/360*255);

            var direction_uint8 = 0;
            switch (direction) {
                case "Up":
                    direction_uint8 = 1;
                    break;
                case "Down":
                    direction_uint8 = 0;
                    break;
                default:
                    return;
            }

            var params = {
                movemode: direction_uint8,
                rate: Number(mov_hue_256)
            };

            await zigbee.Zigbee_SendCommand(address_ID, "lightingColorCtrl", "moveHue", params);
        }
        catch (e) {
            debug("[Lighting_Zigbee_API] Zigbee_Light_Move_Hue_Up_Down() Error " + e);
        }
    };

    self.Zigbee_Light_Move_Enhanced_Hue_Up_Down = async function (address_ID, move_rate, direction) {
        try {
            if(move_rate< 0 || move_rate>360){
                return;
            }

            var mov_enhanced_hue_65536 = Math.round(move_rate/360*65535);

            var direction_uint8 = 0;
            switch (direction) {
                case "Up":
                    direction_uint8 = 1;
                    break;
                case "Down":
                    direction_uint8 = 0;
                    break;
                default:
                    return;
            }

            var params = {
                movemode: direction_uint8,
                rate: Number(mov_enhanced_hue_65536)
            };

            await zigbee.Zigbee_SendCommand(address_ID, "lightingColorCtrl", "enhancedMoveHue", params);
        }
        catch (e) {
            debug("[Lighting_Zigbee_API] Zigbee_Light_Move_Enhanced_Hue_Up_Down() Error " + e);
        }
    };

    self.Zigbee_Light_Move_Saturation_Up_Down = async function (address_ID, move_rate, direction) {
        try {
            if(move_rate< 0 || move_rate>100){
                return;
            }

            var mov_sat_256 = Math.round(move_rate/100*255);

            var direction_uint8 = 0;
            switch (direction) {
                case "Up":
                    direction_uint8 = 1;
                    break;
                case "Down":
                    direction_uint8 = 0;
                    break;
                default:
                    return;
            }

            var params = {
                movemode: direction_uint8,
                rate: Number(mov_sat_256)
            };

            await zigbee.Zigbee_SendCommand(address_ID, "lightingColorCtrl", "moveSaturation", params);
        }
        catch (e) {
            debug("[Lighting_Zigbee_API] Zigbee_Light_Move_Saturation_Up_Down() Error " + e);
        }
    };

    self.Zigbee_Light_Move_Color_XY_Up_Down = async function (address_ID, move_rate_x, move_rate_y, direction) {
        try {
            if(move_rate_x< 0 || move_rate_x>1){
                return;
            }

            if(move_rate_y< 0 || move_rate_y>1){
                return;
            }

            var mov_color_x_65536 = Math.round(move_rate_x*65535);
            var mov_color_y_65536 = Math.round(move_rate_y*65535);

            var direction_uint8 = 0;
            switch (direction) {
                case "Up":
                    direction_uint8 = 1;
                    break;
                case "Down":
                    direction_uint8 = 0;
                    break;
                default:
                    return;
            }

            var params = {
                movemode: direction_uint8,
                ratex: Number(mov_color_x_65536),
                ratey: Number(mov_color_y_65536)
            };

            await zigbee.Zigbee_SendCommand(address_ID, "lightingColorCtrl", "moveColor", params);
        }
        catch (e) {
            debug("[Lighting_Zigbee_API] Zigbee_Light_Move_Color_XY_Up_Down() Error " + e);
        }
    };

    self.Zigbee_Light_Step_Hue_Up_Down = async function (address_ID, step_hue, direction, trans_time) {
        try {
            if(step_hue< 0 || step_hue>360){
                return;
            }

            var step_hue_256 = Math.round(step_hue/360*255);

            var direction_uint8 = 0;
            switch (direction) {
                case "Up":
                    direction_uint8 = 1;
                    break;
                case "Down":
                    direction_uint8 = 0;
                    break;
                default:
                    return;
            }

            var params = {
                stepmode: direction_uint8,
                stepsize: Number(step_hue_256),
                transtime: Number(trans_time)*10
            };

            await zigbee.Zigbee_SendCommand(address_ID, "lightingColorCtrl", "stepHue", params);
        }
        catch (e) {
            debug("[Lighting_Zigbee_API] Zigbee_Light_Step_Hue_Up_Down() Error " + e);
        }
    };

    self.Zigbee_Light_Step_Enhanced_Hue_Up_Down = async function (address_ID, step_enhanced_hue, direction, trans_time) {
        try {
            if(step_enhanced_hue< 0 || step_enhanced_hue>360){
                return;
            }

            var step_enhanced_hue_65536 = Math.round(step_enhanced_hue/360*65535);

            var direction_uint8 = 0;
            switch (direction) {
                case "Up":
                    direction_uint8 = 1;
                    break;
                case "Down":
                    direction_uint8 = 0;
                    break;
                default:
                    return;
            }

            var params = {
                stepmode: direction_uint8,
                stepsize: Number(step_enhanced_hue_65536),
                transtime: Number(trans_time)*10
            };

            await zigbee.Zigbee_SendCommand(address_ID, "lightingColorCtrl", "enhancedStepHue", params);
        }
        catch (e) {
            debug("[Lighting_Zigbee_API] Zigbee_Light_Step_Enhanced_Hue_Up_Down() Error " + e);
        }
    };

    self.Zigbee_Light_Step_Saturation_Up_Down = async function (address_ID, step_saturation, direction, trans_time) {
        try {
            if(step_saturation< 0 || step_saturation>100){
                return;
            }

            var step_sat_256 = Math.round(step_saturation/100*255);

            var direction_uint8 = 0;
            switch (direction) {
                case "Up":
                    direction_uint8 = 1;
                    break;
                case "Down":
                    direction_uint8 = 0;
                    break;
                default:
                    return;
            }

            var params = {
                stepmode: direction_uint8,
                stepsize: Number(step_sat_256),
                transtime: Number(trans_time)*10
            };

            await zigbee.Zigbee_SendCommand(address_ID, "lightingColorCtrl", "stepSaturation", params);
        }
        catch (e) {
            debug("[Lighting_Zigbee_API] Zigbee_Light_Step_Saturation_Up_Down() Error " + e);
        }
    };

    self.Zigbee_Light_Step_Color_XY_Up_Down = async function (address_ID, step_x, step_y, direction, trans_time) {
        try {
            if(step_x< 0 || step_x>1){
                return;
            }

            if(step_y< 0 || step_y>1){
                return;
            }

            var step_color_x_65536 = Math.round(step_x*65535);
            var step_color_y_65536 = Math.round(step_y*65535);

            var direction_uint8 = 0;
            switch (direction) {
                case "Up":
                    direction_uint8 = 1;
                    break;
                case "Down":
                    direction_uint8 = 0;
                    break;
                default:
                    return;
            }

            var params = {
                stepmode: direction_uint8,
                stepx: Number(step_color_x_65536),
                stepy: Number(step_color_y_65536),
                transtime: Number(trans_time)*10
            };

            await zigbee.Zigbee_SendCommand(address_ID, "lightingColorCtrl", "stepColor", params);
        }
        catch (e) {
            debug("[Lighting_Zigbee_API] Zigbee_Light_Step_Color_XY_Up_Down() Error " + e);
        }
    };

    self.Zigbee_Light_Stop_Hue_Command = async function (address_ID) {
        try {
            await zigbee.Zigbee_SendCommand(address_ID, "lightingColorCtrl", "stopMoveStep", {});
        }
        catch (e) {
            debug("[Lighting_Zigbee_API] Zigbee_Light_Stop_Hue_Command() Error " + e);
        }
    };

    self.Zigbee_Light_Stop_Enhanced_Hue_Command = async function (address_ID) {
        try {
            await zigbee.Zigbee_SendCommand(address_ID, "lightingColorCtrl", "stopMoveStep", {});
        }
        catch (e) {
            debug("[Lighting_Zigbee_API] Zigbee_Light_Stop_Enhanced_Hue_Command() Error " + e);
        }
    };

    self.Zigbee_Light_Stop_Saturation_Command = async function (address_ID) {
        try {
            await zigbee.Zigbee_SendCommand(address_ID, "lightingColorCtrl", "stopMoveStep", {});
        }
        catch (e) {
            debug("[Lighting_Zigbee_API] Zigbee_Light_Stop_Saturation_Command() Error " + e);
        }
    };

    self.Zigbee_Light_Move_To_Color_Temperature = async function (address_ID, color_temp, trans_time) {
        try {
            /*
            var cct_mired_step_float = Math.round((color_temp - ZB_CCT_Min)/ZB_Mired_CCT_Val_Step);
            var hue_cct_mired_val = ZB_CCT_2000_Mapped_Mired_Val - cct_mired_step_float;
            if(hue_cct_mired_val>ZB_CCT_2000_Mapped_Mired_Val){hue_cct_mired_val = ZB_CCT_2000_Mapped_Mired_Val;}
            if(hue_cct_mired_val<ZB_CCT_6500_Mapped_Mired_Val){hue_cct_mired_val = ZB_CCT_6500_Mapped_Mired_Val;}
            */
            var cct_mired = color_converter.Transform_CCT(color_temp, ZB_CCT_Min, ZB_CCT_Max, ZB_CCT_2000_Mapped_Mired_Val, ZB_CCT_6500_Mapped_Mired_Val, 'dev_to_hk');

            var params = {
                colortemp: Number(cct_mired), 
                transtime: Number(trans_time)*10
            };

            await zigbee.Zigbee_SendCommand(address_ID, "lightingColorCtrl", "moveToColorTemp", params);
        }
        catch (e) {
            debug("[Lighting_Zigbee_API] Zigbee_Light_Move_To_Color_Temperature() Error " + e);
        }
    };

    self.Zigbee_Light_Move_To_Mired_Color_Temperature = async function (address_ID, mired_color_temp, trans_time) {
        try {
            var params = {
                colortemp: Number(mired_color_temp), 
                transtime: Number(trans_time)*10
            };

            await zigbee.Zigbee_SendCommand(address_ID, "lightingColorCtrl", "moveToColorTemp", params);
        }
        catch (e) {
            debug("[Lighting_Zigbee_API] Zigbee_Light_Move_To_Mired_Color_Temperature() Error " + e);
        }
    };

    self.Zigbee_Light_Step_Color_Temperature_Up_Down = async function (address_ID, step_color_temp, direction, trans_time) {
        try {
            var direction_uint8 = 0;
            switch (direction) {
                case "Up":
                    direction_uint8 = 1;
                    break;
                case "Down":
                    direction_uint8 = 0;
                    break;
                default:
                    return;
            }

            var cct_mired_step_float = Math.round((step_color_temp)/ZB_Mired_CCT_Val_Step);

            var params = {
                stepmode: direction_uint8,
                stepsize: Number(cct_mired_step_float),
                transtime: Number(trans_time)*10
            };

            await zigbee.Zigbee_SendCommand(address_ID, "lightingColorCtrl", "stepColorTemp", params);
        }
        catch (e) {
            debug("[Lighting_Zigbee_API] Zigbee_Light_Step_Saturation_Up_Down() Error " + e);
        }
    };

    self.Zigbee_Light_Step_Mired_Color_Temperature_Up_Down = async function (address_ID, step_mired_color_temp, direction, trans_time) {
        try {
            var direction_uint8 = 0;
            switch (direction) {
                case "Up":
                    direction_uint8 = 1;
                    break;
                case "Down":
                    direction_uint8 = 0;
                    break;
                default:
                    return;
            }

            var params = {
                stepmode: direction_uint8,
                stepsize: Number(step_mired_color_temp),
                transtime: Number(trans_time)*10
            };

            await zigbee.Zigbee_SendCommand(address_ID, "lightingColorCtrl", "stepColorTemp", params);
        }
        catch (e) {
            debug("[Lighting_Zigbee_API] Zigbee_Light_Step_Saturation_Up_Down() Error " + e);
        }
    };

    self.Get_Zigbee_Light_On_Off_Status = async function (address_ID) {
        try {
            var onoff_state = await zigbee.Zigbee_ReadAttribute(address_ID, "genOnOff", ["onOff"]);
            if(onoff_state==null)
            {
                return null;
            }

            return {
                on_off: onoff_state.onOff
            }
        }
        catch (e) {
            debug("[Lighting_Zigbee_API] Get_Zigbee_Light_On_Off_Status() Error " + e);
        }
    };

    self.Get_Zigbee_Light_Current_Level = async function (address_ID) {
        try {
            var level_state = await zigbee.Zigbee_ReadAttribute(address_ID, "genLevelCtrl", ["currentLevel"]);
            if(level_state==null)
            {
                return null;
            }

            return {
                level: Math.round(level_state.currentLevel/255*100)
            };
        }
        catch (e) {
            debug("[Lighting_Zigbee_API] Get_Zigbee_Light_Current_Level() Error " + e);
        }
    };

    self.Get_Zigbee_Light_Current_Color = async function (address_ID) {
        try {
            var color_state = await zigbee.Zigbee_ReadAttribute(address_ID, "lightingColorCtrl", ["currentX", "currentY", "currentHue", "currentSaturation", "enhancedCurrentHue"]);
            if(color_state==null)
            {
                return null;
            }

            var result = null;
            
            if (color_state['currentX']!=null) {
                if(result==null){result = {};}
                result.color_x = lighting_api_precisionRound(color_state['currentX'] / 65535, 4);
            }

            if (color_state['currentY']!=null) {
                if(result==null){result = {};}
                result.color_y = lighting_api_precisionRound(color_state['currentY'] / 65535, 4);
            }

            if (color_state['currentSaturation']!=null) {
                if(result==null){result = {};}
                result.saturation = lighting_api_precisionRound(color_state['currentSaturation'] / 2.54, 0);
            }

            if (color_state['currentHue']!=null) {
                if(result==null){result = {};}
                result.hue = lighting_api_precisionRound((color_state['currentHue'] * 360) / 254, 0);
            }

            if (color_state['enhancedCurrentHue']!=null) {
                if(result==null){result = {};}
                result.enhanced_hue = lighting_api_precisionRound(color_state['enhancedCurrentHue'] / (65535 / 360), 1);
            }

            return result;
        }
        catch (e) {
            debug("[Lighting_Zigbee_API] Get_Zigbee_Light_Current_Color() Error " + e);
        }
    };

    self.Get_Zigbee_Light_Current_Color_Temperature = async function (address_ID) {
        try {
            var cct_state = await zigbee.Zigbee_ReadAttribute(address_ID, "lightingColorCtrl", ["colorTemperature"]);
            if(cct_state==null)
            {
                return null;
            }

            var currentColorTemperature = color_converter.Transform_CCT(cct_state.colorTemperature, ZB_CCT_Min, ZB_CCT_Max, ZB_CCT_2000_Mapped_Mired_Val, ZB_CCT_6500_Mapped_Mired_Val, 'hk_to_dev');

            return {
                color_temperature: currentColorTemperature
            };
        }
        catch (e) {
            debug("[Lighting_Zigbee_API] Get_Zigbee_Light_Current_Color_Temperature() Error " + e);
        }
    };

    self.Get_Zigbee_Light_All_Status = async function (address_ID) {
        try {
            var username = await device_mgr.Get_Device_Owner(Lighting_Device_Type, address_ID);
            if(username==null)
            {
                return null;
            }
            var device_inf = await device_mgr.Read_Device_Inf(Lighting_Device_Type, username, address_ID);
            if(device_inf==null)
            {
                return null;
            }
            
            var result = null;

            switch(device_inf.device_Type)
            {
                case "OnOff Light":
                    result = await this.Get_Zigbee_Light_On_Off_Status(address_ID);
                    break;
                case "Dimmable Light":
                    var current_onoff = await this.Get_Zigbee_Light_On_Off_Status(address_ID);
                    if(current_onoff==null){return null;}
                    var current_level = await this.Get_Zigbee_Light_Current_Level(address_ID);
                    if(current_onoff==null){return null;}
                    result = Object.assign({},current_onoff,current_level);
                    break;
                case "Colored Light":
                    var current_onoff = await this.Get_Zigbee_Light_On_Off_Status(address_ID);
                    if(current_onoff==null){return null;}
                    var current_level = await this.Get_Zigbee_Light_Current_Level(address_ID);
                    if(current_onoff==null){return null;}
                    var current_color = await this.Get_Zigbee_Light_Current_Color(address_ID);
                    if(current_onoff==null){return null;}
                    result = Object.assign({},current_onoff,current_level);
                    result = Object.assign({},result,current_color);
                    break;
                case "Extended Color Light":
                    var current_onoff = await this.Get_Zigbee_Light_On_Off_Status(address_ID);
                    if(current_onoff==null){return null;}
                    var current_level = await this.Get_Zigbee_Light_Current_Level(address_ID);
                    if(current_onoff==null){return null;}
                    var current_color = await this.Get_Zigbee_Light_Current_Color(address_ID);
                    if(current_onoff==null){return null;}
                    var current_cct = await this.Get_Zigbee_Light_Current_Color_Temperature(address_ID);
                    if(current_onoff==null){return null;}
                    result = Object.assign({},current_onoff,current_level);
                    result = Object.assign({},result,current_color);
                    result = Object.assign({},result,current_cct);
                    break;
                case "Color Temperature Light":
                    var current_onoff = await this.Get_Zigbee_Light_On_Off_Status(address_ID);
                    if(current_onoff==null){return null;}
                    var current_level = await this.Get_Zigbee_Light_Current_Level(address_ID);
                    if(current_onoff==null){return null;}
                    var current_cct = await this.Get_Zigbee_Light_Current_Color_Temperature(address_ID);
                    if(current_onoff==null){return null;}
                    result = Object.assign({},current_onoff,current_level);
                    result = Object.assign({},result,current_cct);
                    break;
            }

            return result;
        }
        catch (e) {
            debug("[Lighting_Zigbee_API] Get_Zigbee_Light_All_Status() Error " + e);
        }
    };

    self.Lighting_Get_Support_Attributes = async function (device_type, device_ID) {
        try {
            var num_of_support_attributes = 0;
            var support_attrs_name = [];
            var support_attrs_type = [];

            switch(device_type)
            {
                case "OnOff Light":
                    num_of_support_attributes = 1;
                    support_attrs_name = ["on_off"];
                    support_attrs_type = ["state"];
                    break;
                case "Dimmable Light":
                    num_of_support_attributes = 2;
                    support_attrs_name = ["on_off", "level"];
                    support_attrs_type = ["state", "state"];
                    break;
                case "Colored Light":
                    num_of_support_attributes = 4;
                    support_attrs_name = ["on_off", "level", "x", "y"];
                    support_attrs_type = ["state", "state", "state", "state"];
                    break;
                case "Extended Color Light":
                    num_of_support_attributes = 8;
                    support_attrs_name = ["on_off", "level", "x", "y", "hue", "saturation", "enhanced_hue", "color_temperature"];
                    support_attrs_type = ["state", "state", "state", "state", "state", "state", "state", "state"];
                    break;
                case "Color Temperature Light":
                    num_of_support_attributes = 3;
                    support_attrs_name = ["on_off", "level", "color_temperature"];
                    support_attrs_type = ["state", "state", "state"];
                    break;
            }

            var support_attributes_list = [];
            for(var i = 0; i<num_of_support_attributes; i++)
            {
                support_attributes_list.push({
                    name: support_attrs_name[i],
                    type: support_attrs_type[i]
                });
            }

            return {
                num_of_support_attributes: num_of_support_attributes,
                support_attributes_list: support_attributes_list
            };
        }
        catch (e) {
            debug("[Lighting_Zigbee_API] Get_Zigbee_Light_All_Status() Error " + e);
        }
    };
};

module.exports = Lighting_Zigbee_API;

var debug = require('debug')(require('path').basename(__filename));

var Twinkly_Device_API = require('./Twinkly_Device_API.js');
var twinkly_device_api = new Twinkly_Device_API();

var Twinkly_Light_API = require('./Twinkly_Light_API.js');
var twinkly_light_api = new Twinkly_Light_API();

var Light_Turn_On_Timed_Off_Timer = [];

var Twinkly_Lighting_API = function () {
    var self = this;

    self.Twinkly_Light_Identify_Normal = async function (address_ID, duration) {
        try {
            var led_profile = await twinkly_device_api.Get_Twinkly_Light_LED_Profile(address_ID);
            if(led_profile==null)
            {
                return false;
            }

            var identify_colors = [];
            switch(led_profile)
            {
                case"AWW":
                    identify_colors.push([0, 0, 0]);
                    identify_colors.push([0, 0, 255]);
                    break;
                case"RGB":
                    identify_colors.push([0, 0, 0]);
                    identify_colors.push([255, 255, 255]);
                    break;
                case"RGBW":
                    identify_colors.push([0, 0, 0, 0]);
                    identify_colors.push([0, 0, 0, 255]);
                    break;
            }

            await twinkly_light_api.Twinkly_Light_Set_Blinking(address_ID, identify_colors, 500);
        }
        catch (e) {
            debug("[Twinkly_Lighting_API] Twinkly_Light_Identify_Normal() Error " + e);
        }
    };

    self.Twinkly_Light_Identify_With_Effect = async function (address_ID, effect) {
        try {
            var led_profile = await twinkly_device_api.Get_Twinkly_Light_LED_Profile(address_ID);
            if(led_profile==null)
            {
                return false;
            }

            var identify_colors = [];
            var frame_delay = 0;

            switch(led_profile)
            {
                case"AWW":
                    switch (effect) {
                        case "Blink":
                            identify_colors.push([0, 0, 0]);
                            identify_colors.push([0, 0, 255]);
                            await twinkly_light_api.Twinkly_Light_Set_Blinking(address_ID, identify_colors, 250);
                            break;
                        case "Breathe":
                            var frame_cnt = 0;
                            for(var i = 0; i<15; i++)
                            {
                                for(var j = 255; j>=0; j--){ frame_cnt++;identify_colors.push([0, 0, j]); }
                                for(var j = 0; j<=255; j++){ frame_cnt++;identify_colors.push([0, 0, j]); }
                            }
                            frame_delay = Math.round(15000/frame_cnt);
                            break;
                        case "OK":
                            var frame_cnt = 0;
                            for(var i = 0; i<=16; i++)
                            {
                                frame_cnt++;
                                identify_colors.push([0, 0, j*16-1]);
                            }
                            frame_delay = Math.round(1000/frame_cnt);
                            break;
                        case "Channel Change":
                            var frame_cnt = 0;
                            for(var i = 255; i>=1; i--)
                            {
                                frame_cnt++;
                                identify_colors.push([0, 0, j]);
                            }
                            frame_delay = Math.round(1000/frame_cnt);
                            break;
                    }
                    break;
                case"RGB":
                    switch (effect) {
                        case "Blink":
                            identify_colors.push([0, 0, 0]);
                            identify_colors.push([255, 255, 255]);
                            await twinkly_light_api.Twinkly_Light_Set_Blinking(address_ID, identify_colors, 250);
                            break;
                        case "Breathe":
                            for(var j = 255; j>=5; j-=5){ identify_colors.push([j, j, j]); }
                            for(var j = 5; j<=255; j+=5){ identify_colors.push([j, j, j]); }
                            await twinkly_light_api.Twinkly_Light_Display_Colors(address_ID, identify_colors, 5);
                            break;
                        case "OK":
                            break;
                        case "Channel Change":
                            break;
                    }
                    break;
                case"RGBW":
                    switch (effect) {
                        case "Blink":
                            identify_colors.push([0, 0, 0, 0]);
                            identify_colors.push([0, 0, 0, 255]);
                            await twinkly_light_api.Twinkly_Light_Set_Blinking(address_ID, identify_colors, 250);
                            break;
                        case "Breathe":
                            var frame_cnt = 0;
                            for(var i = 0; i<15; i++)
                            {
                                for(var j = 255; j>=0; j--){ frame_cnt++;identify_colors.push([0, 0, 0, j]); }
                                for(var j = 0; j<=255; j++){ frame_cnt++;identify_colors.push([0, 0, 0, j]); }
                            }
                            frame_delay = Math.round(15000/frame_cnt);
                            break;
                        case "OK":
                            break;
                        case "Channel Change":
                            break;
                    }
                    break;
            }
        }
        catch (e) {
            debug("[Twinkly_Lighting_API] Twinkly_Light_Identify_With_Effect() Error " + e);
        }
    };

    self.Twinkly_Light_Turn_On_Off = async function (address_ID, on_off) {
        try {
            if(on_off==false)
            {
                if(Light_Turn_On_Timed_Off_Timer[address_ID]!=null)
                {
                    clearTimeout(Light_Turn_On_Timed_Off_Timer[address_ID]);
                    Light_Turn_On_Timed_Off_Timer[address_ID] = null;
                }
            }
                
            var mode = "off";
            if(on_off)
            {
                mode = "movie";
            }

            return await twinkly_light_api.Twinkly_Light_Set_Mode(address_ID, mode);
        }
        catch (e) {
            debug("[Lighting_API_Twinkly] Twinkly_Light_Turn_On_Off() Error " + e);
        }
    };

    self.Twinkly_Light_Toggle_OnOff = async function (address_ID) {
        try {
            if(Light_Turn_On_Timed_Off_Timer[address_ID]!=null)
            {
                clearTimeout(Light_Turn_On_Timed_Off_Timer[address_ID]);
                Light_Turn_On_Timed_Off_Timer[address_ID] = null;
            }
            
            //var modes = await twinkly_light_api.Twinkly_Light_Set_Mode(address_ID, mode);
        }
        catch (e) {
            debug("[Lighting_API_Twinkly] Twinkly_Light_Toggle_OnOff() Error " + e);
        }
    };

    self.Twinkly_Light_Turn_On_With_Timed_Off = async function (address_ID, keep_on_time) {
        try {
            var session = await Get_Light_Address_Info_And_Bridge_Session(username, address_ID);
            if(session==null)
            {
                return false;
            }

            if(session.type=="Device")
            {
                if(Light_Device_Turn_On_Timed_Off_Timer[address_ID]!=null)
                {
                    clearTimeout(Light_Device_Turn_On_Timed_Off_Timer[address_ID]);
                    Light_Device_Turn_On_Timed_Off_Timer[address_ID] = null;
                }
                
                Light_Device_Turn_On_Timed_Off_Timer[address_ID] = setTimeout(async function(){
                    Light_Device_Turn_On_Timed_Off_Timer[address_ID] = null;
                    await session.bridge_session_list[0].lights.setLightState(session.target_ID_list[0], {on: false});
                }, keep_on_time*1000);    

                return await session.bridge_session_list[0].lights.setLightState(session.target_ID_list[0], {on: true});
            }
            else if (session.type=="Group")
            {
                if(Light_Group_Turn_On_Timed_Off_Timer[address_ID]!=null)
                {
                    clearTimeout(Light_Group_Turn_On_Timed_Off_Timer[address_ID]);
                    Light_Group_Turn_On_Timed_Off_Timer[address_ID] = null;
                }
                
                Light_Group_Turn_On_Timed_Off_Timer[address_ID] = setTimeout(async function(){
                    Light_Group_Turn_On_Timed_Off_Timer[address_ID] = null;
                    for(var i = 0; i<session.bridge_session_list.length; i++)
                    {
                        await session.bridge_session_list[i].groups.setGroupState(session.target_ID_list[i], {on: false});
                    }
                }, keep_on_time*1000);    

                for(var i = 0; i<session.bridge_session_list.length; i++)
                {
                    await session.bridge_session_list[i].groups.setGroupState(session.target_ID_list[i], {on: true});
                }

                return true;
            }
            else
            {
                return false;
            }
        }
        catch (e) {
            debug("[Lighting_API_Twinkly] Twinkly_Light_Turn_On_With_Timed_Off() Error " + e);
        }
    };

    self.Twinkly_Light_Move_To_Level = async function (address_ID, level, trans_time, with_on_off) {
        try {
            var session = await Get_Light_Address_Info_And_Bridge_Session(username, address_ID);
            if(session==null)
            {
                return false;
            }

            var body = null;
            if(with_on_off)
            {
                var on_off = false;
                if(level>0){on_off = true;}
                body = {
                    bri: Math.round(level/100*253)+1,
                    transitiontime: trans_time*10,
                    on: on_off
                }
            }
            else{
                body = {
                    bri: Math.round(level/100*253)+1,
                    transitiontime: trans_time*10
                }
            }

            if(session.type=="Device")
            {
                return await session.bridge_session_list[0].lights.setLightState(session.target_ID_list[0], body);
            }
            else if (session.type=="Group")
            {
                for(var i = 0; i<session.bridge_session_list.length; i++)
                {
                    await session.bridge_session_list[i].groups.setGroupState(session.target_ID_list[i], body);
                }

                return true;
            }
            else
            {
                return false;
            }
        }
        catch (e) {
            debug("[Twinkly_Lighting_API] Twinkly_Light_Move_To_Level() Error " + e);
        }
    };

    self.Twinkly_Light_Move_Level_Up_Down = async function (address_ID, move_rate, direction, with_on_off) {
        try {
            var session = await Get_Light_Address_Info_And_Bridge_Session(username, address_ID);
            if(session==null)
            {
                return false;
            }

            var body = null;

            var op_session_list = [];
            var current_state_list = [];
            var current_state;

            if(session.type=="Device")
            {
                current_state = await session.bridge_session_list[0].lights.getLightState(session.target_ID_list[0]);
                if(current_state==null){return false;}
                op_session_list.push(session.bridge_session_list[0]);
                current_state_list.push(current_state);
            }
            else if(session.type=="Group")
            {
                for(var i = 0; i<session.bridge_session_list.length; i++)
                {
                    current_state = await session.bridge_session_list[i].groups.getGroupState(session.target_ID_list[i]);
                    if(current_state==null){continue;}
                    op_session_list.push(session.bridge_session_list[i]);
                    current_state_list.push(current_state);
                }
            }
            else{
                return false;
            }
            
            for(var i = 0; i<op_session_list.length; i++)
            {
                var brightness, diff_brightness;
                var on_off = false;
                switch(direction)
                {
                    case "Up":
                        brightness = 254;
                        diff_brightness = 254-current_state_list[i].bri;
                        on_off = true;
                        break;
                    case "Down":
                        brightness = 1;
                        diff_brightness = current_state_list[i].bri-1;
                        on_off = false;
                        break;
                    default:
                        return false;
                }

                var transitiontime_sec = (diff_brightness/Math.round(move_rate/100*254));

                if(with_on_off)
                {
                    body = {
                        bri: brightness,
                        transitiontime: transitiontime_sec*10,
                        on: on_off
                    }
                }
                else{
                    body = {
                        bri: brightness,
                        transitiontime: transitiontime_sec*10
                    }
                }

                if(session.type=="Device")
                {
                    return await op_session_list[i].lights.setLightState(op_session_list.target_ID_list[0], body);
                }

                if(session.type=="Group")
                {
                    await op_session_list[i].groups.setGroupState(op_session_list.target_ID_list[i], body);
                }
            }

            return true;
        }
        catch (e) {
            debug("[Twinkly_Lighting_API] Twinkly_Light_Move_Level_Up_Down() Error " + e);
        }
    };

    self.Twinkly_Light_Step_Level_Up_Down = async function (address_ID, step_level, direction, trans_time, with_on_off) {
        try {
            var session = await Get_Light_Address_Info_And_Bridge_Session(username, address_ID);
            if(session==null)
            {
                return false;
            }
            
            var op_session_list = [];
            var current_state_list = [];
            var current_state;

            if(session.type=="Device")
            {
                current_state = await session.bridge_session_list[0].lights.getLightState(session.target_ID_list[0]);
                if(current_state==null){return false;}
                op_session_list.push(session.bridge_session_list[0]);
                current_state_list.push(current_state);
            }
            else if(session.type=="Group")
            {
                for(var i = 0; i<session.bridge_session_list.length; i++)
                {
                    current_state = await session.bridge_session_list[i].groups.getGroupState(session.target_ID_list[i]);
                    if(current_state==null){continue;}
                    op_session_list.push(session.bridge_session_list[i]);
                    current_state_list.push(current_state);
                }
            }
            else{
                return false;
            }
            
            for(var i = 0; i<op_session_list.length; i++)
            {
                var brightness = current_state_list[i].bri;
                var on_off = false;
                switch(direction)
                {
                    case "Up":
                        brightness = brightness + Math.round(step_level/100*254);
                        if(brightness>254){brightness = 254;}
                        on_off = false;
                        if(brightness>=1){on_off = true;}
                        break;
                    case "Down":
                        brightness = brightness - Math.round(step_level/100*254);
                        on_off = true;
                        if(brightness<1)
                        {
                            brightness = 1;
                            on_off = false;
                        }
                        break;
                    default:
                        return false;
                }

                var body = null;
                if(with_on_off)
                {
                    body = {
                        bri: brightness,
                        transitiontime: trans_time*10,
                        on: on_off
                    }
                }
                else{
                    body = {
                        bri: brightness,
                        transitiontime: trans_time*10
                    }
                }
                
                if(session.type=="Device")
                {
                    return await op_session_list[i].lights.setLightState(op_session_list.target_ID_list[0], body);
                }

                if(session.type=="Group")
                {
                    await op_session_list[i].groups.setGroupState(op_session_list.target_ID_list[i], body);
                }
            }

            return true;
        }
        catch (e) {
            debug("[Twinkly_Lighting_API] Twinkly_Light_Step_Level_Up_Down() Error " + e);
        }
    };

    self.Twinkly_Light_Stop_Level_Command = async function (address_ID) {
        try {
            return false;
        }
        catch (e) {
            debug("[Twinkly_Lighting_API] Twinkly_Light_Stop_Level_Command() Error " + e);
        }
    };

    self.Twinkly_Light_Move_To_Hue = async function (address_ID, hue, trans_time) {
        try {
            return await this.Twinkly_Light_Move_To_Enhanced_Hue(address_ID, hue, trans_time);
        }
        catch (e) {
            debug("[Twinkly_Lighting_API] Twinkly_Light_Move_To_Hue() Error " + e);
        }
    };

    self.Twinkly_Light_Move_To_Enhanced_Hue = async function (address_ID, hue, trans_time) {
        try {
            var session = await Get_Light_Address_Info_And_Bridge_Session(username, address_ID);
            if(session==null)
            {
                return false;
            }

            var body = {
                hue: Math.round(hue/360*65535),
                transitiontime: trans_time*10
            }

            if(session.type=="Device")
            {
                return await session.bridge_session_list[0].lights.setLightState(session.target_ID_list[0], body);
            }
            else if(session.type=="Group")
            {
                for(var i = 0; i<session.bridge_session_list.length; i++)
                {
                    await session.bridge_session_list[i].groups.setGroupState(session.target_ID_list[i], body);
                }

                return true;
            }
            else{
                return false;
            }
        }
        catch (e) {
            debug("[Twinkly_Lighting_API] Twinkly_Light_Move_To_Enhanced_Hue() Error " + e);
        }
    };

    self.Twinkly_Light_Move_To_Saturation = async function (address_ID, saturation, trans_time) {
        try {
            var session = await Get_Light_Address_Info_And_Bridge_Session(username, address_ID);
            if(session==null)
            {
                return false;
            }
            var body = {
                sat: Math.round(saturation/100*254),
                transitiontime: trans_time*10
            }

            if(session.type=="Device")
            {
                return await session.bridge_session_list[0].lights.setLightState(session.target_ID_list[0], body);
            }
            else if(session.type=="Group")
            {
                for(var i = 0; i<session.bridge_session_list.length; i++)
                {
                    await session.bridge_session_list[i].groups.setGroupState(session.target_ID_list[i], body);
                }

                return true;
            }
            else{
                return false;
            }
        }
        catch (e) {
            debug("[Twinkly_Lighting_API] Twinkly_Light_Move_To_Saturation() Error " + e);
        }
    };

    self.Twinkly_Light_Move_To_Hue_And_Saturation = async function (address_ID, hue, saturation, trans_time) {
        try {
            return await this.Twinkly_Light_Move_To_Enhanced_Hue_And_Saturation(address_ID, hue, saturation, trans_time);
        }
        catch (e) {
            debug("[Twinkly_Lighting_API] Twinkly_Light_Move_To_Hue_And_Saturation() Error " + e);
        }
    };

    self.Twinkly_Light_Move_To_Enhanced_Hue_And_Saturation = async function (address_ID, hue, saturation, trans_time) {
        try {
            var session = await Get_Light_Address_Info_And_Bridge_Session(username, address_ID);
            if(session==null)
            {
                return false;
            }

            var body = {
                hue: Math.round(hue/360*65535),
                sat: Math.round(saturation/100*254),
                transitiontime: trans_time*10
            }

            if(session.type=="Device")
            {
                return await session.bridge_session_list[0].lights.setLightState(session.target_ID_list[0], body);
            }
            else if(session.type=="Group")
            {
                for(var i = 0; i<session.bridge_session_list.length; i++)
                {
                    await session.bridge_session_list[i].groups.setGroupState(session.target_ID_list[i], body);
                }

                return true;
            }
            else{
                return false;
            }
        }
        catch (e) {
            debug("[Twinkly_Lighting_API] Twinkly_Light_Move_To_Enhanced_Hue_And_Saturation() Error " + e);
        }
    };

    self.Twinkly_Light_Move_To_Color_XY = async function (address_ID, x, y, trans_time) {
        try {
            var session = await Get_Light_Address_Info_And_Bridge_Session(username, address_ID);
            if(session==null)
            {
                return false;
            }

            var xy = [x, y];

            var body = {
                xy: xy,
                transitiontime: trans_time*10
            }

            if(session.type=="Device")
            {
                return await session.bridge_session_list[0].lights.setLightState(session.target_ID_list[0], body);
            }
            else if(session.type=="Group")
            {
                for(var i = 0; i<session.bridge_session_list.length; i++)
                {
                    await session.bridge_session_list[i].groups.setGroupState(session.target_ID_list[i], body);
                }

                return true;
            }
            else{
                return false;
            }
        }
        catch (e) {
            debug("[Twinkly_Lighting_API] Twinkly_Light_Move_To_Color_XY() Error " + e);
        }
    };

    self.Twinkly_Light_Move_Hue_Up_Down = async function (address_ID, move_rate, direction) {
        try {
            return await this.Twinkly_Light_Move_Enhanced_Hue_Up_Down(address_ID, move_rate, direction);
        }
        catch (e) {
            debug("[Twinkly_Lighting_API] Twinkly_Light_Move_Hue_Up_Down() Error " + e);
        }
    };

    self.Twinkly_Light_Move_Enhanced_Hue_Up_Down = async function (address_ID, move_rate, direction) {
        try {
            var session = await Get_Light_Address_Info_And_Bridge_Session(username, address_ID);
            if(session==null)
            {
                return false;
            }
            
            var op_session_list = [];
            var current_state_list = [];
            var current_state;

            if(session.type=="Device")
            {
                current_state = await session.bridge_session_list[0].lights.getLightState(session.target_ID_list[0]);
                if(current_state==null){return false;}
                op_session_list.push(session.bridge_session_list[0]);
                current_state_list.push(current_state);
            }
            else if(session.type=="Group")
            {
                for(var i = 0; i<session.bridge_session_list.length; i++)
                {
                    current_state = await session.bridge_session_list[i].groups.getGroupState(session.target_ID_list[i]);
                    if(current_state==null){continue;}
                    op_session_list.push(session.bridge_session_list[i]);
                    current_state_list.push(current_state);
                }
            }
            else{
                return false;
            }
            
            for(var i = 0; i<op_session_list.length; i++)
            {
                var hue, diff_hue;
                switch(direction)
                {
                    case "Up":
                        hue = 65535;
                        diff_hue = hue-current_state_list[i].hue;
                        break;
                    case "Down":
                        hue = 0;
                        diff_hue = current_state_list[i].hue;
                        break;
                    default:
                        return false;
                }

                var trans_time = diff_hue/(Math.round(move_rate/360*65535));

                var body = {
                    hue: hue,
                    transitiontime: trans_time*10
                }

                if(session.type=="Device")
                {
                    return await op_session_list[i].lights.setLightState(op_session_list.target_ID_list[0], body);
                }

                if(session.type=="Group")
                {
                    await op_session_list[i].groups.setGroupState(op_session_list.target_ID_list[i], body);
                }
            }

            return true;
        }
        catch (e) {
            debug("[Twinkly_Lighting_API] Twinkly_Light_Move_Enhanced_Hue_Up_Down() Error " + e);
        }
    };

    self.Twinkly_Light_Move_Saturation_Up_Down = async function (address_ID, move_rate, direction) {
        try {
            var session = await Get_Light_Address_Info_And_Bridge_Session(username, address_ID);
            if(session==null)
            {
                return false;
            }
            
            var op_session_list = [];
            var current_state_list = [];
            var current_state;

            if(session.type=="Device")
            {
                current_state = await session.bridge_session_list[0].lights.getLightState(session.target_ID_list[0]);
                if(current_state==null){return false;}
                op_session_list.push(session.bridge_session_list[0]);
                current_state_list.push(current_state);
            }
            else if(session.type=="Group")
            {
                for(var i = 0; i<session.bridge_session_list.length; i++)
                {
                    current_state = await session.bridge_session_list[i].groups.getGroupState(session.target_ID_list[i]);
                    if(current_state==null){continue;}
                    op_session_list.push(session.bridge_session_list[i]);
                    current_state_list.push(current_state);
                }
            }
            else{
                return false;
            }
            
            for(var i = 0; i<op_session_list.length; i++)
            {
                var sat, diff_sat;
                switch(direction)
                {
                    case "Up":
                        sat = 254;
                        diff_sat = sat-current_state_list[i].sat;
                        break;
                    case "Down":
                        sat = 0;
                        diff_sat = current_state_list[i].sat;
                        break;
                    default:
                        return false;
                }

                var trans_time = diff_sat/(Math.round(move_rate/100*254));

                var body = {
                    sat: sat,
                    transitiontime: trans_time*10
                }

                if(session.type=="Device")
                {
                    return await op_session_list[i].lights.setLightState(op_session_list.target_ID_list[0], body);
                }

                if(session.type=="Group")
                {
                    await op_session_list[i].groups.setGroupState(op_session_list.target_ID_list[i], body);
                }
            }

            return true;
        }
        catch (e) {
            debug("[Twinkly_Lighting_API] Twinkly_Light_Move_Saturation_Up_Down() Error " + e);
        }
    };

    self.Twinkly_Light_Move_Color_XY_Up_Down = async function (address_ID, move_rate_x, move_rate_y, direction) {
        try {
            var session = await Get_Light_Address_Info_And_Bridge_Session(username, address_ID);
            if(session==null)
            {
                return false;
            }
            
            var op_session_list = [];
            var current_state_list = [];
            var current_state;

            if(session.type=="Device")
            {
                current_state = await session.bridge_session_list[0].lights.getLightState(session.target_ID_list[0]);
                if(current_state==null){return false;}
                op_session_list.push(session.bridge_session_list[0]);
                current_state_list.push(current_state);
            }
            else if(session.type=="Group")
            {
                for(var i = 0; i<session.bridge_session_list.length; i++)
                {
                    current_state = await session.bridge_session_list[i].groups.getGroupState(session.target_ID_list[i]);
                    if(current_state==null){continue;}
                    op_session_list.push(session.bridge_session_list[i]);
                    current_state_list.push(current_state);
                }
            }
            else{
                return false;
            }
            
            for(var i = 0; i<op_session_list.length; i++)
            {
                var x, diff_x;
                var y, diff_y;
                switch(direction)
                {
                    case "Up":
                        x = 1;
                        y = 1;
                        diff_x = x-current_state_list[i].xy[0];
                        diff_y = y-current_state_list[i].xy[1];
                        break;
                    case "Down":
                        x = 0;
                        y = 0;
                        diff_x = current_state_list[i].xy[0];
                        diff_y = current_state_list[i].xy[1];
                        break;
                    default:
                        return false;
                }

                var trans_time_x = diff_x/move_rate_x;
                var trans_time_y = diff_y/move_rate_y;
                var trans_time = Math.max(trans_time_x, trans_time_y);

                var body = {
                    xy: [x,y],
                    transitiontime: trans_time*10
                }

                if(session.type=="Device")
                {
                    return await op_session_list[i].lights.setLightState(op_session_list.target_ID_list[0], body);
                }

                if(session.type=="Group")
                {
                    await op_session_list[i].groups.setGroupState(op_session_list.target_ID_list[i], body);
                }
            }

            return true;
        }
        catch (e) {
            debug("[Twinkly_Lighting_API] Twinkly_Light_Move_Color_XY_Up_Down() Error " + e);
        }
    };

    self.Twinkly_Light_Step_Hue_Up_Down = async function (address_ID, step_hue, direction, trans_time) {
        try {
            return await this.Twinkly_Light_Step_Enhanced_Hue_Up_Down(address_ID, step_hue, direction, trans_time);
        }
        catch (e) {
            debug("[Twinkly_Lighting_API] Twinkly_Light_Step_Hue_Up_Down() Error " + e);
        }
    };

    self.Twinkly_Light_Step_Enhanced_Hue_Up_Down = async function (address_ID, step_enhanced_hue, direction, trans_time) {
        try {
            var session = await Get_Light_Address_Info_And_Bridge_Session(username, address_ID);
            if(session==null)
            {
                return false;
            }
            
            var op_session_list = [];
            var current_state_list = [];
            var current_state;

            if(session.type=="Device")
            {
                current_state = await session.bridge_session_list[0].lights.getLightState(session.target_ID_list[0]);
                if(current_state==null){return false;}
                op_session_list.push(session.bridge_session_list[0]);
                current_state_list.push(current_state);
            }
            else if(session.type=="Group")
            {
                for(var i = 0; i<session.bridge_session_list.length; i++)
                {
                    current_state = await session.bridge_session_list[i].groups.getGroupState(session.target_ID_list[i]);
                    if(current_state==null){continue;}
                    op_session_list.push(session.bridge_session_list[i]);
                    current_state_list.push(current_state);
                }
            }
            else{
                return false;
            }
            
            for(var i = 0; i<op_session_list.length; i++)
            {
                var hue;
                switch(direction)
                {
                    case "Up":
                        hue = current_state_list[i].hue + Math.round(step_enhanced_hue/360*65535);
                        if(hue>65535){hue = 65535;}
                        break;
                    case "Down":
                        hue = current_state_list[i].hue - Math.round(step_enhanced_hue/360*65535);
                        if(hue<0){hue = 0;}
                        break;
                    default:
                        return false;
                }

                var body = {
                    hue: hue,
                    transitiontime: trans_time*10
                }

                if(session.type=="Device")
                {
                    return await op_session_list[i].lights.setLightState(op_session_list.target_ID_list[0], body);
                }

                if(session.type=="Group")
                {
                    await op_session_list[i].groups.setGroupState(op_session_list.target_ID_list[i], body);
                }
            }
            
            return true;
        }
        catch (e) {
            debug("[Twinkly_Lighting_API] Twinkly_Light_Step_Enhanced_Hue_Up_Down() Error " + e);
        }
    };

    self.Twinkly_Light_Step_Saturation_Up_Down = async function (address_ID, step_saturation, direction, trans_time) {
        try {
            var session = await Get_Light_Address_Info_And_Bridge_Session(username, address_ID);
            if(session==null)
            {
                return false;
            }
            
            var op_session_list = [];
            var current_state_list = [];
            var current_state;

            if(session.type=="Device")
            {
                current_state = await session.bridge_session_list[0].lights.getLightState(session.target_ID_list[0]);
                if(current_state==null){return false;}
                op_session_list.push(session.bridge_session_list[0]);
                current_state_list.push(current_state);
            }
            else if(session.type=="Group")
            {
                for(var i = 0; i<session.bridge_session_list.length; i++)
                {
                    current_state = await session.bridge_session_list[i].groups.getGroupState(session.target_ID_list[i]);
                    if(current_state==null){continue;}
                    op_session_list.push(session.bridge_session_list[i]);
                    current_state_list.push(current_state);
                }
            }
            else{
                return false;
            }
            
            for(var i = 0; i<op_session_list.length; i++)
            {
                var sat;
                switch(direction)
                {
                    case "Up":
                        sat = current_state_list[i].sat + Math.round(step_saturation/100*254);
                        if(sat>65535){sat = 65535;}
                        break;
                    case "Down":
                        sat = current_state_list[i].sat - Math.round(step_saturation/100*254);
                        if(sat<0){sat = 0;}
                        break;
                    default:
                        return false;
                }

                var body = {
                    sat: sat,
                    transitiontime: trans_time*10
                }

                if(session.type=="Device")
                {
                    return await op_session_list[i].lights.setLightState(op_session_list.target_ID_list[0], body);
                }

                if(session.type=="Group")
                {
                    await op_session_list[i].groups.setGroupState(op_session_list.target_ID_list[i], body);
                }
            }

            return true;
        }
        catch (e) {
            debug("[Twinkly_Lighting_API] Twinkly_Light_Step_Saturation_Up_Down() Error " + e);
        }
    };

    self.Twinkly_Light_Step_Color_XY_Up_Down = async function (address_ID, step_x, step_y, direction, trans_time) {
        try {
            var session = await Get_Light_Address_Info_And_Bridge_Session(username, address_ID);
            if(session==null)
            {
                return false;
            }
            
            var op_session_list = [];
            var current_state_list = [];
            var current_state;

            if(session.type=="Device")
            {
                current_state = await session.bridge_session_list[0].lights.getLightState(session.target_ID_list[0]);
                if(current_state==null){return false;}
                op_session_list.push(session.bridge_session_list[0]);
                current_state_list.push(current_state);
            }
            else if(session.type=="Group")
            {
                for(var i = 0; i<session.bridge_session_list.length; i++)
                {
                    current_state = await session.bridge_session_list[i].groups.getGroupState(session.target_ID_list[i]);
                    if(current_state==null){continue;}
                    op_session_list.push(session.bridge_session_list[i]);
                    current_state_list.push(current_state);
                }
            }
            else{
                return false;
            }
            
            for(var i = 0; i<op_session_list.length; i++)
            {
                var x, y;
                switch(direction)
                {
                    case "Up":
                        x = current_state_list[i].xy[0] + step_x;
                        y = current_state_list[i].xy[1] + step_y;
                        if(x>1){x = 1;}
                        if(y>1){y = 1;}
                        break;
                    case "Down":
                        x = current_state_list[i].xy[0] - step_x;
                        y = current_state_list[i].xy[1] - step_y;
                        if(x<0){x = 0;}
                        if(y<0){y = 0;}
                        break;
                    default:
                        return false;
                }

                var body = {
                    xy: [x, y],
                    transitiontime: trans_time*10
                }

                if(session.type=="Device")
                {
                    return await op_session_list[i].lights.setLightState(op_session_list.target_ID_list[0], body);
                }

                if(session.type=="Group")
                {
                    await op_session_list[i].groups.setGroupState(op_session_list.target_ID_list[i], body);
                }
            }

            return true;
        }
        catch (e) {
            debug("[Twinkly_Lighting_API] Twinkly_Light_Step_Color_XY_Up_Down() Error " + e);
        }
    };

    self.Twinkly_Light_Stop_Hue_Command = async function (address_ID) {
        try {
            return false;
        }
        catch (e) {
            debug("[Twinkly_Lighting_API] Twinkly_Light_Stop_Hue_Command() Error " + e);
        }
    };

    self.Twinkly_Light_Stop_Enhanced_Hue_Command = async function (address_ID) {
        try {
            return false;
        }
        catch (e) {
            debug("[Twinkly_Lighting_API] Twinkly_Light_Stop_Enhanced_Hue_Command() Error " + e);
        }
    };

    self.Twinkly_Light_Stop_Saturation_Command = async function (address_ID) {
        try {
            return false;
        }
        catch (e) {
            debug("[Twinkly_Lighting_API] Twinkly_Light_Stop_Saturation_Command() Error " + e);
        }
    };

    self.Twinkly_Light_Move_To_Color_Temperature = async function (address_ID, color_temp, trans_time) {
        try {
            var cct_mired = color_converter.Transform_CCT(color_temp, HUE_CCT_Min, HUE_CCT_Max, HUE_CCT_2000_Mapped_Mired_Val, HUE_CCT_6500_Mapped_Mired_Val, 'dev_to_hk');

            return await this.Twinkly_Light_Move_To_Mired_Color_Temperature(address_ID, cct_mired, trans_time);
        }
        catch (e) {
            debug("[Twinkly_Lighting_API] Twinkly_Light_Move_To_Color_Temperature() Error " + e);
        }
    };

    self.Twinkly_Light_Move_To_Mired_Color_Temperature = async function (address_ID, mired_color_temp, trans_time) {
        try {
            var session = await Get_Light_Address_Info_And_Bridge_Session(username, address_ID);
            if(session==null)
            {
                return false;
            }
            
            var body = {
                ct: mired_color_temp,
                transitiontime: trans_time*10
            }

            if(session.type=="Device")
            {
                return await session.bridge_session_list[0].lights.setLightState(session.target_ID_list[0], body);
            }
            else if(session.type=="Group")
            {
                for(var i = 0; i<session.bridge_session_list.length; i++)
                {
                    await session.bridge_session_list[i].groups.setGroupState(session.target_ID_list[i], body);
                }
            }
            else{
                return false;
            }
        }
        catch (e) {
            debug("[Twinkly_Lighting_API] Twinkly_Light_Move_To_Mired_Color_Temperature() Error " + e);
        }
    };

    self.Twinkly_Light_Step_Color_Temperature_Up_Down = async function (address_ID, step_color_temp, direction, trans_time) {
        try {
            var cct_mired = color_converter.Transform_CCT(HUE_CCT_Min+step_color_temp, HUE_CCT_Min, HUE_CCT_Max, HUE_CCT_2000_Mapped_Mired_Val, HUE_CCT_6500_Mapped_Mired_Val, 'dev_to_hk');
            cct_mired = cct_mired - HUE_CCT_6500_Mapped_Mired_Val;
            return await this.Twinkly_Light_Step_Mired_Color_Temperature_Up_Down(address_ID, cct_mired, direction, trans_time);
        }
        catch (e) {
            debug("[Twinkly_Lighting_API] Twinkly_Light_Step_Saturation_Up_Down() Error " + e);
        }
    };

    self.Twinkly_Light_Step_Mired_Color_Temperature_Up_Down = async function (address_ID, step_mired_color_temp, direction, trans_time) {
        try {
            var session = await Get_Light_Address_Info_And_Bridge_Session(username, address_ID);
            if(session==null)
            {
                return false;
            }
            
            var op_session_list = [];
            var current_state_list = [];
            var current_state;

            if(session.type=="Device")
            {
                current_state = await session.bridge_session_list[0].lights.getLightState(session.target_ID_list[0]);
                if(current_state==null){return false;}
                op_session_list.push(session.bridge_session_list[0]);
                current_state_list.push(current_state);
            }
            else if(session.type=="Group")
            {
                for(var i = 0; i<session.bridge_session_list.length; i++)
                {
                    current_state = await session.bridge_session_list[i].groups.getGroupState(session.target_ID_list[i]);
                    if(current_state==null){continue;}
                    op_session_list.push(session.bridge_session_list[i]);
                    current_state_list.push(current_state);
                }
            }
            else{
                return false;
            }
            
            for(var i = 0; i<op_session_list.length; i++)
            {
                var mired_cct;
                switch(direction)
                {
                    case "Up":
                        mired_cct = current_state_list[i].ct - step_mired_color_temp;
                        if(mired_cct<HUE_CCT_6500_Mapped_Mired_Val){mired_cct = HUE_CCT_6500_Mapped_Mired_Val;}
                        break;
                    case "Down":
                        mired_cct = current_state_list[i].ct + step_mired_color_temp;
                        if(mired_cct>HUE_CCT_2000_Mapped_Mired_Val){mired_cct = HUE_CCT_2000_Mapped_Mired_Val;}
                        break;
                    default:
                        return false;
                }

                var body = {
                    ct: mired_cct,
                    transitiontime: trans_time*10
                }
                
                if(session.type=="Device")
                {
                    return await op_session_list[0].lights.setLightState(op_session_list[0].target_ID_list[0], body);
                }
                if(session.type=="Group")
                {
                    await op_session_list[i].groups.setGroupState(op_session_list[i].target_ID_list[i], body);
                }
            }

            return true;
        }
        catch (e) {
            debug("[Twinkly_Lighting_API] Twinkly_Light_Step_Saturation_Up_Down() Error " + e);
        }
    };

    self.Get_Twinkly_Light_On_Off_Status = async function (address_ID) {
        try {
            var session = await Get_Light_Address_Info_And_Bridge_Session(username, address_ID);
            if(session==null)
            {
                return null;
            }

            var current_state;

            if(session.type=="Device")
            {
                current_state = await session.bridge_session_list[0].lights.getLightState(session.target_ID_list[0]);
                if(current_state==null){return null;}
                return {on_off: current_state.on};
            }
            else if(session.type=="Group")
            {
                var onoff_current_state_list = [];
                for(var i = 0; i<session.bridge_session_list.length; i++)
                {
                    current_state = await session.bridge_session_list[i].groups.getGroupState(session.target_ID_list[i]);
                    if(current_state==null){
                        onoff_current_state_list.push(null);
                        continue;
                    }
                    onoff_current_state_list.push(current_state.on);
                }
                return {on_off_state_list: onoff_current_state_list};
            }
            else{
                return null;
            }
        }
        catch (e) {
            debug("[Twinkly_Lighting_API] Get_Twinkly_Light_On_Off_Status() Error " + e);
        }
    };

    self.Get_Twinkly_Light_Current_Level = async function (address_ID) {
        try {
            var session = await Get_Light_Address_Info_And_Bridge_Session(username, address_ID);
            if(session==null)
            {
                return null;
            }
            
            var bri_convert_func = function(bri){return Math.round((bri-1)/253*100);}

            var current_state;

            if(session.type=="Device")
            {
                current_state = await session.bridge_session_list[0].lights.getLightState(session.target_ID_list[0]);
                if(current_state==null){return null;}
                return {level: bri_convert_func(current_state.bri)};
            }
            else if(session.type=="Group")
            {
                var level_current_state_list = [];
                for(var i = 0; i<session.bridge_session_list.length; i++)
                {
                    current_state = await session.bridge_session_list[i].groups.getGroupState(session.target_ID_list[i]);
                    if(current_state==null){
                        level_current_state_list.push(null);
                        continue;
                    }
                    level_current_state_list.push(bri_convert_func(current_state.bri));
                }
                return {level_state_list: level_current_state_list};
            }
            else{
                return null;
            }
        }
        catch (e) {
            debug("[Twinkly_Lighting_API] Get_Twinkly_Light_Current_Level() Error " + e);
        }
    };

    self.Get_Twinkly_Light_Current_Color = async function (address_ID) {
        try {
            var session = await Get_Light_Address_Info_And_Bridge_Session(username, address_ID);
            if(session==null)
            {
                return null;
            }
            
            var hue_convert_func = function(hue){return Math.round(hue/65535*360);}
            var sat_convert_func = function(sat){return Math.round(sat/254*100);}
            var get_color_x_func = function(color_xy){return color_xy[0];}
            var get_color_y_func = function(color_xy){return color_xy[1];}

            var current_state;

            if(session.type=="Device")
            {
                current_state = await session.bridge_session_list[0].lights.getLightState(session.target_ID_list[0]);
                if(current_state==null){return null;}
                return {
                    hue: hue_convert_func(current_state.hue),
                    saturation: sat_convert_func(current_state.sat),
                    enhanced_hue: current_state.hue,
                    color_x: get_color_x_func(current_state.xy),
                    color_y: get_color_y_func(current_state.xy)
                };
            }
            else if(session.type=="Group")
            {
                var hue_current_state_list = [];
                var sat_current_state_list = [];
                var ehue_current_state_list = [];
                var color_x_current_state_list = [];
                var color_y_current_state_list = [];
                for(var i = 0; i<session.bridge_session_list.length; i++)
                {
                    current_state = await session.bridge_session_list[i].groups.getGroupState(session.target_ID_list[i]);
                    if(current_state==null){
                        hue_current_state_list.push(null);
                        sat_current_state_list.push(null);
                        ehue_current_state_list.push(null);
                        color_x_current_state_list.push(null);
                        color_y_current_state_list.push(null);
                        continue;
                    }
                    hue_current_state_list.push(hue_convert_func(current_state.hue));
                    sat_current_state_list.push(sat_convert_func(current_state.sat));
                    ehue_current_state_list.push(current_state.hue);
                    color_x_current_state_list.push(get_color_x_func(current_state.xy));
                    color_y_current_state_list.push(get_color_y_func(current_state.xy));
                }
                return {
                    hue_state_list: hue_current_state_list,
                    sat_state_list: sat_current_state_list,
                    enhanced_hue_state_list: ehue_current_state_list,
                    color_x_state_list: color_x_current_state_list,
                    color_y_state_list: color_y_current_state_list
                };
            }
            else{
                return null;
            }
        }
        catch (e) {
            debug("[Twinkly_Lighting_API] Get_Twinkly_Light_Current_Color() Error " + e);
        }
    };

    self.Get_Twinkly_Light_Current_Color_Temperature = async function (address_ID) {
        try {
            var session = await Get_Light_Address_Info_And_Bridge_Session(username, address_ID);
            if(session==null)
            {
                return null;
            }
            
            var cct_convert_func = function(cct){
                return color_converter.Transform_CCT(cct, HUE_CCT_Min, HUE_CCT_Max, HUE_CCT_2000_Mapped_Mired_Val, HUE_CCT_6500_Mapped_Mired_Val, 'hk_to_dev');
            }
            
            var current_state;

            if(session.type=="Device")
            {
                current_state = await session.bridge_session_list[0].lights.getLightState(session.target_ID_list[0]);
                if(current_state==null){return null;}
                return {color_temperature: cct_convert_func(current_state.ct)};
            }
            else if(session.type=="Group")
            {
                var color_temperature_current_state_list = [];
                for(var i = 0; i<session.bridge_session_list.length; i++)
                {
                    current_state = await session.bridge_session_list[i].groups.getGroupState(session.target_ID_list[i]);
                    if(current_state==null){
                        color_temperature_current_state_list.push(null);
                        continue;
                    }
                    color_temperature_current_state_list.push(cct_convert_func(current_state.ct));
                }
                return {color_temperature_state_list: color_temperature_current_state_list};
            }
            else{
                return null;
            }
        }
        catch (e) {
            debug("[Twinkly_Lighting_API] Get_Twinkly_Light_Current_Color_Temperature() Error " + e);
        }
    };

    self.Get_Twinkly_Light_All_Status = async function (address_ID) {
        try {
            var session = await Get_Light_Address_Info_And_Bridge_Session(username, address_ID);
            if(session==null)
            {
                return null;
            }
            
            var bri_convert_func = function(bri){return Math.round((bri-1)/253*100);}
            var hue_convert_func = function(hue){return Math.round(hue/65535*360);}
            var sat_convert_func = function(sat){return Math.round(sat/254*100);}
            var get_color_x_func = function(color_xy){return color_xy[0];}
            var get_color_y_func = function(color_xy){return color_xy[1];}
            var cct_convert_func = function(cct){
                return color_converter.Transform_CCT(cct, HUE_CCT_Min, HUE_CCT_Max, HUE_CCT_2000_Mapped_Mired_Val, HUE_CCT_6500_Mapped_Mired_Val, 'hk_to_dev');
            }
            
            var current_state;

            if(session.type=="Device")
            {
                current_state = await session.bridge_session_list[0].lights.getLightState(session.target_ID_list[0]);
                if(current_state==null){return null;}
                
                switch(session.light_info.device_Type)
                {
                    case "On Off Light":
                        result = {
                            on_off: current_state.on
                        };
                        break;
                    case "Dimmable Light":
                        result = {
                            on_off: current_state.on,
                            level: bri_convert_func(current_state.bri),
                        };
                        break;
                    case "Colored Light":
                        return {
                            on_off: current_state.on,
                            level: bri_convert_func(current_state.bri),
                            color_x: get_color_x_func(current_state.xy),
                            color_y: get_color_y_func(current_state.xy)
                        };
                        break;
                    case "Extended Color Light":
                        return {
                            on_off: current_state.on,
                            level: bri_convert_func(current_state.bri),
                            hue: hue_convert_func(current_state.hue),
                            saturation: sat_convert_func(current_state.sat),
                            enhanced_hue: current_state.hue,
                            color_x: get_color_x_func(current_state.xy),
                            color_y: get_color_y_func(current_state.xy),
                            color_temperature: cct_convert_func(current_state.ct)
                        };
                        break;
                    case "Color Temperature Light":
                        return {
                            color_temperature: cct_convert_func(current_state.ct)
                        };
                    default:
                        return null;
                }
            }
            else if(session.type=="Group")
            {
                var onoff_current_state_list = [];
                var level_current_state_list = [];
                var hue_current_state_list = [];
                var sat_current_state_list = [];
                var ehue_current_state_list = [];
                var color_x_current_state_list = [];
                var color_y_current_state_list = [];
                var color_temperature_current_state_list = [];
                for(var i = 0; i<session.bridge_session_list.length; i++)
                {
                    current_state = await session.bridge_session_list[i].groups.getGroupState(session.target_ID_list[i]);
                    if(current_state==null){
                        onoff_current_state_list.push(null);
                        level_current_state_list.push(null);
                        hue_current_state_list.push(null);
                        sat_current_state_list.push(null);
                        ehue_current_state_list.push(null);
                        color_x_current_state_list.push(null);
                        color_y_current_state_list.push(null);
                        color_temperature_current_state_list.push(null);
                        continue;
                    }
                    onoff_current_state_list.push(current_state.on);
                    level_current_state_list.push(bri_convert_func(current_state.bri));
                    hue_current_state_list.push(hue_convert_func(current_state.hue));
                    sat_current_state_list.push(sat_convert_func(current_state.sat));
                    ehue_current_state_list.push(current_state.hue);
                    color_x_current_state_list.push(get_color_x_func(current_state.xy));
                    color_y_current_state_list.push(get_color_y_func(current_state.xy));
                    color_temperature_current_state_list.push(cct_convert_func(current_state.ct));
                }
                return {
                    onoff_state_list: onoff_current_state_list,
                    level_state_list: level_current_state_list,
                    hue_state_list: hue_current_state_list,
                    sat_state_list: sat_current_state_list,
                    enhanced_hue_state_list: ehue_current_state_list,
                    color_x_state_list: color_x_current_state_list,
                    color_y_state_list: color_y_current_state_list,
                    color_temperature_state_list: color_temperature_current_state_list
                };
            }
            else{
                return null;
            }
        }
        catch (e) {
            debug("[Twinkly_Lighting_API] Get_Twinkly_Light_Current_Color_Temperature() Error " + e);
        }
    };
};

module.exports = Twinkly_Lighting_API;
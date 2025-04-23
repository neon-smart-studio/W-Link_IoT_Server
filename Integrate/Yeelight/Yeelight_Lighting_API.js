
var debug = require('debug')(require('path').basename(__filename));

var Yeelight_Device_API = require('./Yeelight_Device_API.js');
var yeelight_device_api = new Yeelight_Device_API();

var Yeelight_Lighting_API = function () {
    var self = this;

    self.Yeelight_Light_Turn_On_Off = async function (address_ID, on_off) {
        try {
            var session = await yeelight_device_api.Get_Yeelight_Device_Session(address_ID);
            if(session==null)
            {
                return false;
            }

            session.set_power((on_off)?"on":"off");
            
            session.exit();

            return true;
        }
        catch (e) {
            debug("[Yeelight_Lighting_API] Yeelight_Light_Turn_On_Off() Error " + e);
        }
    };

    self.Yeelight_Light_Toggle_OnOff = async function (address_ID) {
        try {
            var session = await yeelight_device_api.Get_Yeelight_Device_Session(address_ID);
            if(session==null)
            {
                return false;
            }

            session.toggle();
            
            session.exit();

            return true;
        }
        catch (e) {
            debug("[Yeelight_Lighting_API] Yeelight_Light_Toggle_OnOff() Error " + e);
        }
    };

    self.Yeelight_Light_Move_To_Level = async function (address_ID, level, trans_time, with_on_off) {
        try {
            const session = await yeelight_device_api.Get_Yeelight_Device_Session(address_ID);
            if (!session) return false;
            
            session.set_bright(level, 0, trans_time);
            
            session.exit();

            return true;
        } catch (e) {
            debug("[Yeelight_Lighting_API] Yeelight_Light_Move_To_Level() Error " + e);
            return false;
        }
    };

    self.Yeelight_Light_Step_Level_Up_Down = async function (address_ID, step_level, direction, trans_time, with_on_off) {
        try {
            var session = await yeelight_device_api.Get_Yeelight_Device_Session(address_ID);
            if(session==null)
            {
                return false;
            }

            let currentBrightness = parseInt(session.bright);

            let newBrightness = direction === "Up"
                ? currentBrightness.brightness + step_level / 100
                : currentBrightness.brightness - step_level / 100;
            newBrightness = Math.max(0, Math.min(newBrightness, 1));

            session.set_bright(newBrightness, 0, trans_time);
            
            session.exit();

            return true;
        }
        catch (e) {
            debug("[Yeelight_Lighting_API] Yeelight_Light_Step_Level_Up_Down() Error " + e);
        }
    };

    self.Yeelight_Light_Move_Level_Up_Down = async function (address_ID, move_rate, direction, with_on_off) {
        try {
            var session = await yeelight_device_api.Get_Yeelight_Device_Session(address_ID);
            if(session==null)
            {
                return false;
            }
            
            let currentBrightness = parseInt(session.bright);

            const target = direction === "Up" ? 1 : 0;
            const diff = Math.abs(currentBrightness - target);
            const trans_time = diff / (move_rate / 100);
            
            session.set_bright(100, 0, trans_time);
            
            session.exit();

            return true;
        }
        catch (e) {
            debug("[Yeelight_Lighting_API] Yeelight_Light_Move_Level_Up_Down() Error " + e);
        }
    };

    self.Yeelight_Light_Move_To_Hue = async function (address_ID, hue, trans_time) {
        try {
            var session = await yeelight_device_api.Get_Yeelight_Device_Session(address_ID);
            if(session==null)
            {
                return false;
            }
            
            let currentSat = parseInt(session.sat);

            session.set_hsv(hue, currentSat, 0, trans_time);
            
            session.exit();

            return true;
        }
        catch (e) {
            debug("[Yeelight_Lighting_API] Yeelight_Light_Move_To_Hue() Error " + e);
        }
    };

    self.Yeelight_Light_Move_To_Saturation = async function (address_ID, saturation, trans_time) {
        try {
            var session = await yeelight_device_api.Get_Yeelight_Device_Session(address_ID);
            if(session==null)
            {
                return false;
            }
            
            let currentHue = parseInt(session.hue);

            session.set_hsv(currentHue, saturation, 0, trans_time);
            
            session.exit();

            return true;
        }
        catch (e) {
            debug("[Yeelight_Lighting_API] Yeelight_Light_Move_To_Saturation() Error " + e);
        }
    };

    self.Yeelight_Light_Move_To_Hue_And_Saturation = async function (address_ID, hue, saturation, trans_time) {
        try {
            var session = await yeelight_device_api.Get_Yeelight_Device_Session(address_ID);
            if(session==null)
            {
                return false;
            }
            
            session.set_hsv(hue, saturation, 0, trans_time);
            
            session.exit();

            return true;
        }
        catch (e) {
            debug("[Yeelight_Lighting_API] Yeelight_Light_Move_To_Hue_And_Saturation() Error " + e);
        }
    };

    self.Yeelight_Light_Move_To_Color_Temperature = async function (address_ID, color_temp, trans_time) {
        try {
            var session = await yeelight_device_api.Get_Yeelight_Device_Session(address_ID);
            if(session==null)
            {
                return false;
            }
            
            session.set_ct_abx(color_temp, 0, trans_time);
            
            session.exit();

            return true;
        }
        catch (e) {
            debug("[Yeelight_Lighting_API] Yeelight_Light_Move_To_Color_Temperature() Error " + e);
        }
    };

    self.Get_Yeelight_Light_On_Off_Status = async function (address_ID) {
        try {
            var session = await yeelight_device_api.Get_Yeelight_Device_Session(address_ID);
            if(session==null)
            {
                return null;
            }

            session.exit();

            let onoff = (session.power=="on") ? true : false;

            return {on_off: onoff};
        }
        catch (e) {
            debug("[Yeelight_Lighting_API] Get_Yeelight_Light_On_Off_Status() Error " + e);
        }
    };

    self.Get_Yeelight_Light_Current_Level = async function (address_ID) {
        try {
            var session = await yeelight_device_api.Get_Yeelight_Device_Session(address_ID);
            if(session==null)
            {
                return null;
            }
            
            session.exit();

            return {level: parseInt(session.bright)};
        }
        catch (e) {
            debug("[Yeelight_Lighting_API] Get_Yeelight_Light_Current_Level() Error " + e);
        }
    };

    self.Get_Yeelight_Light_Current_Color = async function (address_ID) {
        try {
            var session = await yeelight_device_api.Get_Yeelight_Device_Session(address_ID);
            if(session==null)
            {
                return null;
            }
            
            session.exit();

            return {
                hue: parseInt(session.hue),
                saturation: parseInt(session.sat),
            };        
        }
        catch (e) {
            debug("[Yeelight_Lighting_API] Get_Yeelight_Light_Current_Color() Error " + e);
        }
    };

    self.Get_Yeelight_Light_Current_Color_Temperature = async function (address_ID) {
        try {
            var session = await yeelight_device_api.Get_Yeelight_Device_Session(address_ID);
            if(session==null)
            {
                return null;
            }
            
            session.exit();

            return {color_temperature: parseInt(session.ct)};
        }
        catch (e) {
            debug("[Yeelight_Lighting_API] Get_Yeelight_Light_Current_Color_Temperature() Error " + e);
        }
    };

    self.Get_Yeelight_Light_All_Status = async function (address_ID) {
        try {
            var session = await yeelight_device_api.Get_Yeelight_Device_Session(address_ID);
            if(session==null)
            {
                return null;
            }
            
            session.exit();

            let onoff = (session.power=="on") ? true : false;

            switch(session.device_Type)
            {
                case "On Off Light":
                    result = {
                        on_off: current_state.on
                    };
                    break;
                case "Dimmable Light":
                    result = {
                        on_off: current_state.on,
                        level: parseInt(current_state.bright),
                    };
                    break;
                case "Colored Light":
                case "Extended Color Light":
                    return {
                        on_off: onoff,
                        level: parseInt(session.bright),
                        hue: parseInt(session.hue),
                        saturation: parseInt(session.sat),
                        color_temperature: parseInt(session.ct)
                    };
                    break;
                case "Color Temperature Light":
                    return {
                        on_off: onoff,
                        level: parseInt(session.bright),
                        color_temperature: parseInt(current_state.ct)
                    };
                default:
                    return null;
            }
        }
        catch (e) {
            debug("[Yeelight_Lighting_API] Get_Yeelight_Light_Current_Color_Temperature() Error " + e);
        }
    };
};

module.exports = Yeelight_Lighting_API;
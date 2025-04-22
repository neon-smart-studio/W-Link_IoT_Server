
var debug = require('debug')(require('path').basename(__filename));

var Lifx_Device_API = require('./LIFX_Device_API.js');
var lifx_device_api = new Lifx_Device_API();

var Lifx_Lighting_API = function () {
    var self = this;

    self.Lifx_Light_Turn_On_Off = async function (address_ID, on_off) {
        try {
            const session = await lifx_device_api.Get_Lifx_Device_Session(null, address_ID);
            if (!session) return false;

            if(on_off)
            {
                await session.turnOn();
            }
            else
            {
                await session.turnOff();
            }

            return true;
        } catch (e) {
            debug("[Lighting_API_Lifx] Lifx_Light_Turn_On_Off() Error " + e);
            return false;
        }
    };

    self.Lifx_Light_Toggle_OnOff = async function (address_ID) {
        try {
            const session = await lifx_device_api.Get_Lifx_Device_Session(null, address_ID);
            if (!session) return false;
            
            const current_state = await session.getLightState();
            if(current_state==null){return null;}

            if(current_state.power)
            {
                await session.turnOff();
            }
            else
            {
                await session.turnOn();
            }
            
            return true;
        } catch (e) {
            debug("[Lighting_API_Lifx] Lifx_Light_Toggle_OnOff() Error " + e);
            return false;
        }
    };

    self.Lifx_Light_Move_To_Level = async function (address_ID, level, trans_time, with_on_off) {
        try {
            const session = await lifx_device_api.Get_Lifx_Device_Session(null, address_ID);
            if (!session) return false;
            
            const current_state = await session.getLightState();
            if(current_state==null){return null;}

            await session.setColor({
                color: {
                    hue: current_state.color.hue,
                    saturation: current_state.color.saturation,
                    brightness: level / 100,
                    kelvin: current_state.color.kelvin
                },
                duration: trans_time
            });

            return true;
        } catch (e) {
            debug("[Lifx_Lighting_API] Lifx_Light_Move_To_Level() Error " + e);
            return false;
        }
    };

    self.Lifx_Light_Step_Level_Up_Down = async function (address_ID, step_level, direction, trans_time, with_on_off) {
        try {
            const session = await lifx_device_api.Get_Lifx_Device_Session(null, address_ID);
            if (!session) return false;
            
            const current_state = await session.getLightState();
            if(current_state==null){return null;}

            let newBrightness = direction === "Up"
                ? current_state.color.brightness + step_level / 100
                : current_state.color.brightness - step_level / 100;
            newBrightness = Math.max(0, Math.min(newBrightness, 1));

            await session.setColor({
                color: {
                    ...current_state.color,
                    brightness: newBrightness
                },
                duration: trans_time
            });

            return true;
        } catch (e) {
            debug("[Lifx_Lighting_API] Lifx_Light_Step_Level_Up_Down() Error " + e);
            return false;
        }
    };

    self.Lifx_Light_Move_Level_Up_Down = async function (address_ID, move_rate, direction, with_on_off) {
        try {
            const session = await lifx_device_api.Get_Lifx_Device_Session(null, address_ID);
            if (!session) return false;
            
            const current_state = await session.getLightState();
            if(current_state==null){return null;}

            const target = direction === "Up" ? 1 : 0;
            const diff = Math.abs(current_state.color.brightness - target);
            const trans_time = diff / (move_rate / 100);
            
            await session.setColor({
                color: {
                    ...current_state.color,
                    brightness: target
                },
                duration: trans_time
            });
            return true;
        } catch (e) {
            debug("[Lifx_Lighting_API] Lifx_Light_Move_Level_Up_Down() Error " + e);
            return false;
        }
    };

    self.Lifx_Light_Move_To_Hue = async function (address_ID, hue, trans_time) {
        try {
            const session = await lifx_device_api.Get_Lifx_Device_Session(null, address_ID);
            if (!session) return false;
            
            const current_state = await session.getLightState();
            if(current_state==null){return null;}

            return await session.setColor({
                color: {
                    hue: hue/360,
                    saturation: current_state.color.saturation,
                    brightness:  current_state.color.brightness,
                    kelvin: current_state.color.kelvin
                },
                duration: trans_time
            });
        } catch (e) {
            debug("[Lifx_Lighting_API] Lifx_Light_Move_To_Hue() Error " + e);
            return false;
        }
    };

    self.Lifx_Light_Move_To_Saturation = async function (address_ID, saturation, trans_time) {
        try {
            const session = await lifx_device_api.Get_Lifx_Device_Session(null, address_ID);
            if (!session) return false;
            
            const current_state = await session.getLightState();
            if(current_state==null){return null;}

            return await session.setColor({
                color: {
                    hue: current_state.color.hue,
                    saturation: saturation/100,
                    brightness: current_state.color.brightness,
                    kelvin: current_state.color.kelvin
                },

                duration: trans_time
            });
        } catch (e) {
            debug("[Lifx_Lighting_API] Lifx_Light_Move_To_Saturation() Error " + e);
            return false;
        }
    };

    self.Lifx_Light_Move_To_Hue_And_Saturation = async function (address_ID, hue, saturation, trans_time) {
        try {
            const session = await lifx_device_api.Get_Lifx_Device_Session(null, address_ID);
            if (!session) return false;

            const current_state = await session.getLightState();
            if(current_state==null){return null;}

            return await session.setColor({
                color: {
                    hue: hue/360,
                    saturation: saturation/100,
                    brightness: current_state.color.brightness,
                    kelvin: current_state.color.kelvin
                },

                duration: trans_time
            });
        } catch (e) {
            debug("[Lifx_Lighting_API] Lifx_Light_Move_To_Hue_And_Saturation() Error " + e);
            return false;
        }
    };

    self.Lifx_Light_Move_To_Color_Temperature = async function (address_ID, color_temp, trans_time) {
        try {
            const session = await lifx_device_api.Get_Lifx_Device_Session(null, address_ID);
            if (!session) return false;

            const current_state = await session.getLightState();
            if(current_state==null){return null;}

            return await session.setColor({
                color: {
                    hue: current_state.color.hue,
                    saturation: current_state.color.saturation,
                    brightness: current_state.color.brightness,
                    kelvin: Math.round(color_temp)
                },
                duration: trans_time
            });
        }
        catch (e) {
            debug("[Lifx_Lighting_API] Lifx_Light_Move_To_Color_Temperature() Error " + e);
        }
    };

    self.Get_Lifx_Light_On_Off_Status = async function (address_ID) {
        try {
            var session = await Get_Lifx_Device_Session(null, address_ID);
            if (!session) return false;

            const current_state = await session.getLightState();
            if(current_state==null){return null;}
            
            return await current_state.power;
        }
        catch (e) {
            debug("[Lifx_Lighting_API] Get_Lifx_Light_On_Off_Status() Error " + e);
        }
    };

    self.Get_Lifx_Light_Current_Level = async function (address_ID) {
        try {
            var session = await Get_Lifx_Device_Session(null, address_ID);
            if (!session) return false;

            const current_state = await session.getLightState();
            if(current_state==null){return null;}

            return await current_state.color.brightness * 100;
        }
        catch (e) {
            debug("[Lifx_Lighting_API] Get_Lifx_Light_Current_Level() Error " + e);
        }
    };

    self.Get_Lifx_Light_Current_Color = async function (address_ID) {
        try {
            const session = await lifx_device_api.Get_Lifx_Device_Session(null, address_ID);
            if (!session) return false;
            
            var hue_convert_func = function(hue){return Math.round(hue*360);}
            var sat_convert_func = function(sat){return Math.round(sat*100);}

            const current_state = await session.getLightState();
            if(current_state==null){return null;}
            
            return {
                hue: hue_convert_func(current_state.color.hue),
                saturation: sat_convert_func(current_state.color.saturation)
            };
        }
        catch (e) {
            debug("[Lifx_Lighting_API] Get_Lifx_Light_Current_Color() Error " + e);
        }
    };

    self.Get_Lifx_Light_Current_Color_Temperature = async function (address_ID) {
        try {
            const session = await lifx_device_api.Get_Lifx_Device_Session(null, address_ID);
            if (!session) return false;
            
            const current_state = await session.getLightState();
            if(current_state==null){return null;}

            return {color_temperature: current_state.color.kelvin};
        }
        catch (e) {
            debug("[Lifx_Lighting_API] Get_Lifx_Light_Current_Color_Temperature() Error " + e);
        }
    };

    self.Get_Lifx_Light_All_Status = async function (address_ID) {
        try {
            const session = await lifx_device_api.Get_Lifx_Device_Session(null, address_ID);
            if (!session) return false;
            
            var bri_convert_func = function(bri){return Math.round(bri*100);}
            var hue_convert_func = function(hue){return Math.round(hue*360);}
            var sat_convert_func = function(sat){return Math.round(sat*100);}

            const current_state = await session.getLightState();
            if(current_state==null){return null;}

            switch(session.device_Type)
            {
                case "OnOff Light":
                    return {
                        on_off: current_state.power
                    };
                case "Dimmable Light":
                    return {
                        on_off: current_state.power,
                        level: bri_convert_func(current_state.color.brightness),
                    };
                case "Extended Color Light":
                case "Colored Light":
                    return {
                        on_off: current_state.power,
                        level: bri_convert_func(current_state.color.brightness),
                        hue: hue_convert_func(current_state.color.hue),
                        saturation: sat_convert_func(current_state.color.saturation),
                        color_temperature: current_state.color.kelvin
                    };
                    break;
                case "Color Temperature Light":
                    return {
                        on_off: current_state.power,
                        level: bri_convert_func(current_state.color.brightness),
                        color_temperature: current_state.color.kelvin
                    };
                default:
                    return null;
            }
        }
        catch (e) {
            debug("[Lifx_Lighting_API] Get_Lifx_Light_All_Status() Error " + e);
        }
    };
};

module.exports = Lifx_Lighting_API;
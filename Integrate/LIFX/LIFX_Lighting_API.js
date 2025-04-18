const debug = require('debug')(require('path').basename(__filename));
const Lifx_Device_API = require('./LIFX_Device_API.js');
const lifx_device_api = new Lifx_Device_API();

const Light_Turn_On_Timed_Off_Timer = {};

const Lifx_Lighting_API = function () {
    const self = this;

    self.Lifx_Light_Identify = async function (address_ID, duration) {
        try {
            const session = await lifx_device_api.Get_Lifx_Device_Session(null, address_ID);
            if (!session) return false;
            const blink_times = Math.floor(duration / 500);
            let count = 0;
            const interval = setInterval(async () => {
                await session.setPower(count % 2 === 0);
                count++;
                if (count >= blink_times) clearInterval(interval);
            }, 500);
            return true;
        } catch (e) {
            debug("[Lifx_Lighting_API] Lifx_Light_Identify() Error " + e);
            return false;
        }
    };

    self.Lifx_Light_Turn_On_Off = async function (address_ID, on_off) {
        try {
            const session = await lifx_device_api.Get_Lifx_Device_Session(null, address_ID);
            if (!session) return false;
            await session.setPower(on_off);
            return true;
        } catch (e) {
            debug("[Lifx_Lighting_API] Lifx_Light_Turn_On_Off() Error " + e);
            return false;
        }
    };

    self.Lifx_Light_Move_To_Level = async function (address_ID, level, trans_time = 1) {
        try {
            const session = await lifx_device_api.Get_Lifx_Device_Session(null, address_ID);
            if (!session) return false;

            const brightness = Math.round(level / 100 * 65535);
            const current = await session.getColor();

            await session.setColor({
                color: current.color,
                brightness: brightness,
                kelvin: current.kelvin,
                duration: trans_time
            });
            return true;
        } catch (e) {
            debug("[Lifx_Lighting_API] Lifx_Light_Move_To_Level() Error " + e);
            return false;
        }
    };

    self.Lifx_Light_Move_To_Color = async function (address_ID, hue, saturation, brightness, kelvin, trans_time = 1) {
        try {
            const session = await lifx_device_api.Get_Lifx_Device_Session(null, address_ID);
            if (!session) return false;

            await session.setColor({
                color: {
                    hue: hue,
                    saturation: saturation,
                    brightness: brightness,
                    kelvin: kelvin
                },
                duration: trans_time
            });
            return true;
        } catch (e) {
            debug("[Lifx_Lighting_API] Lifx_Light_Move_To_Color() Error " + e);
            return false;
        }
    };
    
    // 新增在 Lifx_Lighting_API 裡補完的函數們
    self.Lifx_Light_Move_To_Hue = async function (address_ID, hue, trans_time = 1) {
        try {
            const session = await lifx_device_api.Get_Lifx_Device_Session(null, address_ID);
            if (!session) return false;
            const current = await session.getColor();
            await session.setColor({
                color: {
                    ...current.color,
                    hue: hue
                },
                duration: trans_time
            });
            return true;
        } catch (e) {
            debug("[Lifx_Lighting_API] Lifx_Light_Move_To_Hue() Error " + e);
            return false;
        }
    };

    self.Lifx_Light_Move_To_Saturation = async function (address_ID, saturation, trans_time = 1) {
        try {
            const session = await lifx_device_api.Get_Lifx_Device_Session(null, address_ID);
            if (!session) return false;
            const current = await session.getColor();
            await session.setColor({
                color: {
                    ...current.color,
                    saturation: saturation
                },
                duration: trans_time
            });
            return true;
        } catch (e) {
            debug("[Lifx_Lighting_API] Lifx_Light_Move_To_Saturation() Error " + e);
            return false;
        }
    };

    self.Lifx_Light_Move_To_Hue_And_Saturation = async function (address_ID, hue, saturation, trans_time = 1) {
        try {
            const session = await lifx_device_api.Get_Lifx_Device_Session(null, address_ID);
            if (!session) return false;
            const current = await session.getColor();
            await session.setColor({
                color: {
                    ...current.color,
                    hue: hue,
                    saturation: saturation
                },
                duration: trans_time
            });
            return true;
        } catch (e) {
            debug("[Lifx_Lighting_API] Lifx_Light_Move_To_Hue_And_Saturation() Error " + e);
            return false;
        }
    };

    self.Lifx_Light_Stop_Level_Command = async function (address_ID) {
        try {
            if (Light_Turn_On_Timed_Off_Timer[address_ID]) {
                clearTimeout(Light_Turn_On_Timed_Off_Timer[address_ID]);
                delete Light_Turn_On_Timed_Off_Timer[address_ID];
            }
            return true;
        } catch (e) {
            debug("[Lifx_Lighting_API] Lifx_Light_Stop_Level_Command() Error " + e);
            return false;
        }
    };

    self.Lifx_Light_Stop_Hue_Command = async function () {
        return false; // No animation supported
    };

    self.Lifx_Light_Stop_Saturation_Command = async function () {
        return false;
    };

    self.Lifx_Light_Move_To_Color_Temperature_Mired = async function (address_ID, mired, trans_time = 1) {
        const kelvin = Math.round(1000000 / mired);
        return await self.Lifx_Light_Move_To_Color_Temperature(address_ID, kelvin, trans_time);
    };

    self.Lifx_Light_Move_Hue_Up_Down = async function (address_ID, move_rate, direction) {
        try {
            const current = await self.Get_Lifx_Light_Status(address_ID);
            const hue = direction === 'Up' ? 360 : 0;
            return await self.Lifx_Light_Move_To_Hue(address_ID, hue, Math.abs(current.hue - hue) / move_rate);
        } catch (e) {
            debug("[Lifx_Lighting_API] Lifx_Light_Move_Hue_Up_Down() Error " + e);
            return false;
        }
    };

    self.Lifx_Light_Step_Hue_Up_Down = async function (address_ID, step_hue, direction, trans_time = 1) {
        try {
            const current = await self.Get_Lifx_Light_Status(address_ID);
            const new_hue = direction === 'Up' ? current.hue + step_hue : current.hue - step_hue;
            return await self.Lifx_Light_Move_To_Hue(address_ID, Math.max(0, Math.min(360, new_hue)), trans_time);
        } catch (e) {
            debug("[Lifx_Lighting_API] Lifx_Light_Step_Hue_Up_Down() Error " + e);
            return false;
        }
    };

    self.Lifx_Light_Move_Saturation_Up_Down = async function (address_ID, move_rate, direction) {
        try {
            const current = await self.Get_Lifx_Light_Status(address_ID);
            const saturation = direction === 'Up' ? 1 : 0;
            return await self.Lifx_Light_Move_To_Saturation(address_ID, saturation, Math.abs(current.saturation - saturation) / move_rate);
        } catch (e) {
            debug("[Lifx_Lighting_API] Lifx_Light_Move_Saturation_Up_Down() Error " + e);
            return false;
        }
    };

    self.Lifx_Light_Step_Saturation_Up_Down = async function (address_ID, step_saturation, direction, trans_time = 1) {
        try {
            const current = await self.Get_Lifx_Light_Status(address_ID);
            const new_saturation = direction === 'Up' ? current.saturation + step_saturation : current.saturation - step_saturation;
            return await self.Lifx_Light_Move_To_Saturation(address_ID, Math.max(0, Math.min(1, new_saturation)), trans_time);
        } catch (e) {
            debug("[Lifx_Lighting_API] Lifx_Light_Step_Saturation_Up_Down() Error " + e);
            return false;
        }
    };
    self.Lifx_Light_Move_To_Color_Temperature = async function (address_ID, kelvin, trans_time = 1) {
        try {
            const session = await lifx_device_api.Get_Lifx_Device_Session(null, address_ID);
            if (!session) return false;
            const current = await session.getColor();

            await session.setColor({
                color: {
                    hue: current.color.hue,
                    saturation: current.color.saturation,
                    brightness: current.color.brightness,
                    kelvin: kelvin
                },
                duration: trans_time
            });
            return true;
        } catch (e) {
            debug("[Lifx_Lighting_API] Lifx_Light_Move_To_Color_Temperature() Error " + e);
            return false;
        }
    };

    self.Get_Lifx_Light_Status = async function (address_ID) {
        try {
            const session = await lifx_device_api.Get_Lifx_Device_Session(null, address_ID);
            if (!session) return null;
            const power = await session.getPower();
            const color = await session.getColor();
            return {
                on_off: power,
                hue: color.color.hue,
                saturation: color.color.saturation,
                brightness: color.color.brightness,
                kelvin: color.kelvin
            };
        } catch (e) {
            debug("[Lifx_Lighting_API] Get_Lifx_Light_Status() Error " + e);
            return null;
        }
    };

    self.Lifx_Light_Turn_On_With_Timed_Off = async function (address_ID, keep_on_time) {
        try {
            await self.Lifx_Light_Turn_On_Off(address_ID, true);
            if (Light_Turn_On_Timed_Off_Timer[address_ID]) {
                clearTimeout(Light_Turn_On_Timed_Off_Timer[address_ID]);
            }
            Light_Turn_On_Timed_Off_Timer[address_ID] = setTimeout(() => {
                self.Lifx_Light_Turn_On_Off(address_ID, false);
            }, keep_on_time);
            return true;
        } catch (e) {
            debug("[Lifx_Lighting_API] Lifx_Light_Turn_On_With_Timed_Off() Error " + e);
            return false;
        }
    };

    self.Lifx_Light_Move_Level_Up_Down = async function (address_ID, move_rate, direction) {
        try {
            const session = await lifx_device_api.Get_Lifx_Device_Session(null, address_ID);
            if (!session) return false;
            const color = await session.getColor();
            let newBrightness;
            if (direction === "Up") {
                newBrightness = 65535;
            } else if (direction === "Down") {
                newBrightness = 0;
            } else {
                return false;
            }
            await session.setColor({
                color: {
                    ...color.color,
                    brightness: newBrightness,
                    kelvin: color.kelvin
                },
                duration: 1
            });
            return true;
        } catch (e) {
            debug("[Lifx_Lighting_API] Lifx_Light_Move_Level_Up_Down() Error " + e);
            return false;
        }
    };

    self.Lifx_Light_Step_Level_Up_Down = async function (address_ID, step_level, direction) {
        try {
            const session = await lifx_device_api.Get_Lifx_Device_Session(null, address_ID);
            if (!session) return false;
            const color = await session.getColor();
            let current = color.color.brightness;
            let step = Math.round(step_level / 100 * 65535);
            let newBrightness = direction === "Up" ? current + step : current - step;
            newBrightness = Math.max(0, Math.min(newBrightness, 65535));
            await session.setColor({
                color: {
                    ...color.color,
                    brightness: newBrightness,
                    kelvin: color.kelvin
                },
                duration: 1
            });
            return true;
        } catch (e) {
            debug("[Lifx_Lighting_API] Lifx_Light_Step_Level_Up_Down() Error " + e);
            return false;
        }
    };
};

module.exports = Lifx_Lighting_API;


var debug = require('debug')(require('path').basename(__filename));

function gaussRandom() {
    // https://stackoverflow.com/a/36481059/168939
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

/** Limit scale so that it won't cause an overflow */
function limitBrightnessScale(value, scale) {
    if (value * scale > 255.0) {
        return 255.0 / value;
    }
    return scale;
}
    
var Twinkly_Frame_API = function () {
    var self = this;

    self.Twinkly_Create_Frame = function (ledCount, initColors) {
        try {
            if(initColors!=null)
            {
                if(initColors.length!=ledCount)
                {
                    return null;
                }
            }

            var frame = new Array(ledCount);

            for (let i = 0; i < ledCount; i++) {
                if(initColors!=null)
                {
                    frame[i] = initColors[i];
                }
                else
                {
                    frame[i] = null;
                }
            }

            return frame;
        }
        catch (e) {
            debug("[Twinkly_Frame_API] Twinkly_Generate_Frame() Error " + e);
        }
    };
    
    self.Twinkly_Create_Repeated_Colors_Frame = function (ledCount, repeatColors) {
        try {
            if(repeatColors==null)
            {
                return null;
            }

            var frame = new Array(ledCount);

            for (let i = 0; i < ledCount; i++) {
                frame[i] = repeatColors[i % repeatColors.length];
            }

            return frame;
        }
        catch (e) {
            debug("[Twinkly_Frame_API] Twinkly_Generate_Frame() Error " + e);
        }
    };
    
    self.Twinkly_Create_Single_Color_Frame = function (ledCount, singleColor) {
        try {
            return self.Twinkly_Create_Repeated_Colors_Frame(ledCount, [singleColor]);
        }
        catch (e) {
            debug("[Twinkly_Frame_API] Twinkly_Create_Single_Color_Frame() Error " + e);
        }
    };
    
    self.Twinkly_Frame_Set_Repeated_Colors= function (frame, ledCount, colors) {
        try {
            if(typeof frame != Array)
            {
                return frame;
            }
            if(frame.length!=ledCount)
            {
                return frame;
            }
            
            for (let i = 0; i < ledCount; i++) {
                frame[i] = colors[i % colors.length];
            }
            
            return frame;
        }
        catch (e) {
            debug("[Twinkly_Frame_API] Twinkly_Frame_Set_Repeated_Colors() Error " + e);
        }
    };
    
    self.Twinkly_Frame_Set_Single_Color = function (ledCount, color) {
        try {
            return self.Twinkly_Frame_Set_Repeated_Colors(ledCount, [color]);
        }
        catch (e) {
            debug("[Twinkly_Frame_API] Twinkly_Frame_Set_Single_Color() Error " + e);
        }
    };
    
    self.Twinkly_Frame_Add_Twinkle = function (frame) {
        try {
            if(typeof frame != Array)
            {
                return frame;
            }

            var ledCount = frame.length;
            const probabilityFlicker = 0.01;

            for (let i = 0; i < ledCount; i++) {
                let isFlicker = Math.random() < probabilityFlicker;
                let intensity = isFlicker ? 0.8 + gaussRandom() / 20 : 0.9 + gaussRandom() / 25;
                frame = self.Twinkly_Frame_Scale_LED_Brightness(frame, i, Math.min(1.0, Math.max(0, intensity)));
            }

            return frame;
        }
        catch (e) {
            debug("[Twinkly_Frame_API] Twinkly_Frame_Add_Twinkle() Error " + e);
        }
    };
    
    self.Twinkly_Frame_Scale_LED_Brightness = function (frame, led_index, scale) {
        try {
            if(typeof frame != Array)
            {
                return frame;
            }

            var ledCount = frame.length;
            if(led_index>=ledCount)
            {
                return frame;
            }

            scale = Math.max(scale, 0);
            let color = frame[led_index];
            if (color instanceof Array) {
                color.forEach(c => scale = limitBrightnessScale(c, scale));
                frame[led_index] = color.map(c => c * scale);
            }

            return frame;
        }
        catch (e) {
            debug("[Twinkly_Frame_API] Twinkly_Frame_Scale_LED_Brightness() Error " + e);
        }
    };
    
    self.Twinkly_Get_Frame_Array = function (frame, ledProfile) {
        try {
            if(frame == null)
            {
                return null;
            }
            if(!Array.isArray(frame))
            {
                return null;
            }

            if(ledProfile == null)
            {
                return null;
            }

            var colorCount = 0;
            if(Array.isArray(ledProfile))
            {
                colorCount = ledProfile.length;
            }
            else if(typeof ledProfile == "string")
            {
                switch(ledProfile)
                {
                    case "AWW":
                    case "RGB":
                        colorCount = 3;
                        break;
                    case "RGBW":
                        colorCount = 4;
                        break;
                    default:
                        return null;
                }
            }
            else{
                return null;
            }

            let array = new Uint8Array(frame.length * colorCount);
            for (let i = 0; i < frame.length; i++) {
                let color = frame[i];
                if (color instanceof Array && (color.length === 3 || color.length === 4)) {
                    let [cR, cG, cB, cW] = color;
                    if (colorCount === 4) {
                        array[colorCount * i] = color.length === 4 ? color[3] : 0; // W
                        array[colorCount * i + 1] = color[0]; // R
                        array[colorCount * i + 2] = color[1]; // G
                        array[colorCount * i + 3] = color[2]; // B
                    } else {
                        array[colorCount * i] = color[0];     // R
                        array[colorCount * i + 1] = color[1]; // G
                        array[colorCount * i + 2] = color[2]; // B
                    }
                } else {
                    throw `unknown color format ${color}`;
                }
            }
            return array;
        }
        catch (e) {
            debug("[Twinkly_Frame_API] Twinkly_Get_Frame_Array() Error " + e);
        }
    };
}

module.exports = Twinkly_Frame_API;
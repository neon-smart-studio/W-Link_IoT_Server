
var debug = require('debug')(require('path').basename(__filename));

var Color_Converter = function () {
    var self = this;

    self.HSV_To_RGB = function(h, s, v) {
        var r, g, b, i, f, p, q, t;
        if (arguments.length === 1) {
            s = h.s, v = h.v, h = h.h;
        }

        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }

    self.RGB_To_HSV = function(r, g, b) {
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, v = max;

        var d = max - min;
        s = max == 0 ? 0 : d / max;

        if (max == min) {
            h = 0; // achromatic
        } else {
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }

            h /= 6;
        }

        return {hue: Math.round(h * 360), sat: Math.round(s * 100) };
    }

    self.Line_Map = function(x1, y1, x2, y2, x) {
        var k = (y2 - y1) / (x2 -x1);
        var b = y1 - k * x1;

        return parseInt(k * x + b);
    }

    self.Transform_CCT = function(current_ct, min_ct, max_ct, min_hk_ct, max_hk_ct, mode) {
        if (mode == 'hk_to_dev') {
            //from [140, 500]
            var trans_ct = this.Line_Map(min_hk_ct, min_ct, max_hk_ct, max_ct, parseInt(current_ct, 10));
            return trans_ct;
        } else if (mode == 'dev_to_hk') {
            var trans_ct = this.Line_Map(min_ct, min_hk_ct, max_ct, max_hk_ct, parseInt(current_ct, 10));
            return trans_ct;
        } else {
            debug("ct transform error" + mode);
        }
    }
};

module.exports = Color_Converter;
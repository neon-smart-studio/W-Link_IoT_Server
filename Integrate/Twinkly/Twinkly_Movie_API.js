
var debug = require('debug')(require('path').basename(__filename));

var Twinkly_Frame_API = require('./Twinkly_Frame_API.js');
var twinkly_frame_api = new Twinkly_Frame_API();

var Twinkly_Movie_API = function () {
    var self = this;

    self.Twinkly_Create_New_Movie = function (ledProfile, ledCount, frameCount, frameDelay, initFrameColors) {
        try {
            if(initFrameColors!=null)
            {
                if(initFrameColors.length!=frameCount)
                {
                    return null;
                }
            }

            var mv_frames = new Array(frameCount);

            for (let i = 0; i < frameCount; i++) {
                var initColor = null;
                if(initFrameColors!=null)
                {
                    initColor = initFrameColors[i];
                }
                var initColors = [];
                for (let j = 0; j < ledCount; j++) {initColors.push(initColor);}
                mv_frames[i] = twinkly_frame_api.Twinkly_Create_Frame(ledCount, initColors);
            }

            return {
                ledProfile: ledProfile,
                ledCount: ledCount,
                frameDelay: frameDelay,
                frameCount: frameCount,
                frames: mv_frames
            };
        }
        catch (e) {
            debug("[Twinkly_Movie_API] Twinkly_Create_New_Movie() Error " + e);
        }
    };
    
    self.Twinkly_Create_Repeat_Colors_Movie = function (ledProfile, ledCount, repeatColors) {
        try {
            if(repeatColors==null)
            {
                return null;
            }

            var mv_frames = new Array(1);

            mv_frames[0] = twinkly_frame_api.Twinkly_Create_Repeated_Colors_Frame(ledCount, repeatColors);

            return {
                ledProfile: ledProfile,
                ledCount: ledCount,
                frameDelay: 1,
                frameCount: 1,
                frames: mv_frames
            };
        }
        catch (e) {
            debug("[Twinkly_Movie_API] Twinkly_Create_Repeat_Colors_Movie() Error " + e);
        }
    };

    self.Twinkly_Create_Blinking_Colors_Movie = function (ledProfile, ledCount, frameDelay, blinkingColors) {
        try {
            if(blinkingColors==null)
            {
                return null;
            }

            var mv_frames = new Array(blinkingColors.length);

            for (let i = 0; i < blinkingColors.length; i++) {
                mv_frames[i] = twinkly_frame_api.Twinkly_Create_Single_Color_Frame(ledCount, blinkingColors[i]);
    
                mv_frames[i] = twinkly_frame_api.Twinkly_Frame_Add_Twinkle(mv_frames[i]);
            }

            return {
                ledProfile: ledProfile,
                ledCount: ledCount,
                frameDelay: frameDelay,
                frameCount: blinkingColors.length,
                frames: mv_frames
            };
        }
        catch (e) {
            debug("[Twinkly_Movie_API] Twinkly_Create_Blinking_Colors_Movie() Error " + e);
        }
    };

    self.Twinkly_Create_Twinkling_Colors_Movie = function (ledProfile, ledCount, frameCount, frameDelay, twinklingColors) {
        try {
            if(twinklingColors==null)
            {
                return null;
            }

            var mv_frames = new Array(frameCount);

            for (let i = 0; i < frameCount; i++) {
                mv_frames[i] = twinkly_frame_api.Twinkly_Create_Repeated_Colors_Frame(ledCount, twinklingColors);
    
                mv_frames[i] = twinkly_frame_api.Twinkly_Frame_Add_Twinkle(mv_frames[i]);
            }

            return {
                ledProfile: ledProfile,
                ledCount: ledCount,
                frameDelay: frameDelay,
                frameCount: frameCount,
                frames: mv_frames
            };
        }
        catch (e) {
            debug("[Twinkly_Movie_API] Twinkly_Create_Twinkling_Colors_Movie() Error " + e);
        }
    };

    self.Twinkly_Create_Looping_Colors_Movie = function (ledProfile, ledCount, frameDelay, loopingColors) {
        try {
            if(loopingColors==null)
            {
                return null;
            }

            var mv_frames = new Array(loopingColors.length);

            for (let i = 0; i < loopingColors.length; i++) {
                loopingColors.push(loopingColors.shift());

                mv_frames[i] = twinkly_frame_api.Twinkly_Create_Repeated_Colors_Frame(ledCount, loopingColors);
            }

            return {
                ledProfile: ledProfile,
                ledCount: ledCount,
                frameDelay: frameDelay,
                frameCount: loopingColors.length,
                frames: mv_frames
            };
        }
        catch (e) {
            debug("[Twinkly_Movie_API] Twinkly_Create_Looping_Colors_Movie() Error " + e);
        }
    };
    
    self.Twinkly_Get_Movie_Array = function (movie) {
        try {
            if(movie==null)
            {
                return null;
            }
            if(movie.ledCount == null || movie.ledProfile == null || movie.frameCount == null)
            {
                return null;
            }

            var ledCount = movie.ledCount;
            var ledProfile = movie.ledProfile;
            var frameCount = movie.frameCount;

            let frameLength = ledCount * ledProfile.length;
            let movieArray = new Uint8Array(frameCount * frameLength);
            for (let i = 0; i < frameCount; i++) {
                let frameArray = twinkly_frame_api.Twinkly_Get_Frame_Array(movie.frames[i], ledProfile);
                //console.assert(frameArray.length === frameLength);
        
                for (let frameIndex = 0; frameIndex < frameLength; frameIndex++) {
                    movieArray[frameLength * i + frameIndex] = frameArray[frameIndex];
                }
            }
            return movieArray;
        }
        catch (e) {
            debug("[Twinkly_Movie_API] Twinkly_Get_Movie_Array() Error " + e);
        }
    };
}

module.exports = Twinkly_Movie_API;
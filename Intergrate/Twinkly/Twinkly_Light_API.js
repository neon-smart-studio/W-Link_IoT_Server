
var debug = require('debug')(require('path').basename(__filename));

var Address_MGR = require('../Util/Address_MGR.js');
var address_mgr = new Address_MGR();

var Device_MGR = require('../Util/Device_MGR.js');
var device_mgr = new Device_MGR();

var Twinkly_Request_API = require('./Twinkly_Request_API.js');
var twinkly_request_api = new Twinkly_Request_API();

var Twinkly_Frame_API = require('./Twinkly_Frame_API.js');
var twinkly_frame_api = new Twinkly_Frame_API();

var Twinkly_Movie_API = require('./Twinkly_Movie_API.js');
var twinkly_movie_api = new Twinkly_Movie_API();

const Twinkly_Device_Type = "Lighting";

async function Get_Twinkly_Light_Address_Info(address_ID)
{
    var address_info = await address_mgr.Read_Address_Info(address_ID);
    if(address_info==null)
    {
        return null;
    }

    var light_info = null;
    var group_info = null;
    var target_IP_list = [];
    var target_type = address_info.target_type;
    if(target_type=="Device")
    {
        if(address_info.ip_address==null)
        {
            return null;
        }
        light_info = await device_mgr.Read_Device_Inf(Twinkly_Device_Type, 'everyone', address_ID);
        if(light_info==null)
        {
            return null;
        }
        target_IP_list.push(address_info.ip_address);
    }
    else if(target_type=="Group")
    {
        group_info = await group_mgr.Get_Group_Info(Twinkly_Device_Type, 'everyone', address_ID);
        if(group_info.Twinkly_Device_List==null)
        {
            return null;
        }
        for(var i = 0; i<group_info.Twinkly_Device_List.length; i++)
        {
            target_IP_list.push(group_info.Twinkly_Device_List[i].Twinkly_IP_Address);
        }
    }
    else{
        return null;
    }
    
    return {
        target_type: target_type,
        light_info: light_info,
        group_info: group_info,
        target_IP_list: target_IP_list
    };
}

async function do_Set_Twinkly_Mode(ip_address, mode)
{
    req_result = await twinkly_request_api.Twinkly_POST_JSON_Request(ip_address, "/led/mode", {mode: mode});
    if(req_result==null){ return false; }
    if(req_result.statusCode!=200)
    {
        return false;
    }
    return true;
}
async function do_Send_Twinkly_RealTime_Movie(ip_address, movie_item)
{
    for(var i = 0; i<movie_item.frameCount; i++)
    {
        var frame_raw_array = twinkly_frame_api.Twinkly_Get_Frame_Array(movie_item.frames[i], movie_item.ledProfile);
        if(frame_raw_array==null)
        {
            continue;
        }

        var req_result = await twinkly_request_api.Twinkly_POST_Octet_Request(ip_address, "/led/rt/frame", frame_raw_array);
        if(req_result==null) { return false; }
        if(req_result.statusCode!=200)
        {
            return false;
        }
    }
    return true;
}
async function do_Set_Twinkly_Movie(ip_address, movie_item)
{
    var movie_raw_array = twinkly_movie_api.Twinkly_Get_Movie_Array(movie_item);
    if(movie_raw_array==null)
    {
        return false;
    }

    var req_result = await twinkly_request_api.Twinkly_POST_Octet_Request(ip_address, "/led/movie/full", movie_raw_array);
    if(req_result==null) { return false; }
    if(req_result.statusCode!=200)
    {
        return false;
    }
    req_result = await twinkly_request_api.Twinkly_POST_JSON_Request(ip_address, "/led/movie/config",  {
        frame_delay: movie_item.frameDelay,
        frames_number: movie_item.frameCount,
        leds_number: movie_item.ledCount
    });
    if(req_result==null) { return false; }
    if(req_result.statusCode!=200)
    {
        return false;
    }
    return true;
}

var Twinkly_Light_API = function () {
    var self = this;

    self.Twinkly_Light_Set_Mode = async function(address_ID, mode)
    {
        try {
            var light_addr_info = await Get_Twinkly_Light_Address_Info(address_ID);
            if(light_addr_info==null)
            {
                return false;
            }
        
            if(light_addr_info.target_type=="Device")
            {
                return await do_Set_Twinkly_Mode(light_addr_info.target_IP_list[0], mode);
            }
            else if(light_addr_info.target_type=="Group")
            {
                for(var i = 0; i<target_IP_list.length; i++)
                {
                    await do_Set_Twinkly_Mode(light_addr_info.target_IP_list[i], mode);
                }
                return true;
            }
            else{
                return false;
            }
        }
        catch (e) {
            debug("[Twinkly_Light_API] Twinkly_Get_Mode() Error " + e);
        }
    }
    
    self.Twinkly_Light_Get_Mode = async function(address_ID)
    {
        try {
            var light_addr_info = await Get_Twinkly_Light_Address_Info(address_ID);
            if(light_addr_info==null)
            {
                return null;
            }
        
            var req_result;
        
            if(light_addr_info.target_type=="Device")
            {
                req_result = await twinkly_request_api.Twinkly_GET_JSON_Request(light_addr_info.target_IP_list[0], "/led/mode");
                if(req_result==null){ return null; }
                if(req_result.statusCode!=200)
                {
                    return null;
                }
                return req_result.body.mode;
            }
            else if(light_addr_info.target_type=="Group")
            {
                var mode_list = [];
                for(var i = 0; i<target_IP_list.length; i++)
                {
                    req_result = await twinkly_request_api.Twinkly_GET_JSON_Request(light_addr_info.target_IP_list[i], "/led/mode");
                    if(req_result==null){ 
                        mode_list.push(null);
                        continue;
                    }
                    if(req_result.statusCode!=200)
                    {
                        mode_list.push(null);
                        continue;
                    }
                    mode_list.push(req_result.body.mode);
                }
                return mode_list;
            }
            else{
                return null;
            }
        }
        catch (e) {
            debug("[Twinkly_Light_API] Twinkly_Light_Get_Mode() Error " + e);
        }
    }
    
    self.Twinkly_Light_Set_Brightness = async function(address_ID, brightness)
    {
        try {
            var light_addr_info = await Get_Twinkly_Light_Address_Info(address_ID);
            if(light_addr_info==null)
            {
                return false;
            }
        
            var req_result;
        
            if(light_addr_info.target_type=="Device")
            {
                req_result = await twinkly_request_api.Twinkly_POST_JSON_Request(light_addr_info.target_IP_list[0], "/led/out/brightness", {type: "A", value: brightness});
                if(req_result==null){ return false; }
                if(req_result.statusCode!=200)
                {
                    return false;
                }
                return true;
            }
            else if(light_addr_info.target_type=="Group")
            {
                for(var i = 0; i<target_IP_list.length; i++)
                {
                    await twinkly_request_api.Twinkly_POST_JSON_Request(light_addr_info.target_IP_list[i], "/led/out/brightness", {type: "A", value: brightness});
                }
                return true;
            }
            else{
                return false;
            }
        }
        catch (e) {
            debug("[Twinkly_Light_API] Twinkly_Lighty_Set_Brightness() Error " + e);
        }
    }

    self.Twinkly_Light_Get_Brightness = async function(address_ID)
    {
        try {
            var light_addr_info = await Get_Twinkly_Light_Address_Info(address_ID);
            if(light_addr_info==null)
            {
                return null;
            }
        
            var req_result;
        
            if(light_addr_info.target_type=="Device")
            {
                req_result = await twinkly_request_api.Twinkly_GET_JSON_Request(light_addr_info.target_IP_list[0], "/led/out/brightness");
                if(req_result==null){ return null; }
                if(req_result.statusCode!=200)
                {
                    return null;
                }
                return req_result.body.value;
            }
            else if(light_addr_info.target_type=="Group")
            {
                var bri_list = [];
                for(var i = 0; i<target_IP_list.length; i++)
                {
                    req_result = await twinkly_request_api.Twinkly_GET_JSON_Request(light_addr_info.target_IP_list[i], "/led/out/brightness");
                    if(req_result==null)
                    { 
                        bri_list.push(null);
                        continue;
                    }
                    if(req_result.statusCode!=200)
                    {
                        bri_list.push(null);
                        continue;
                    }
                    bri_list.push(req_result.body.value);
                }
                return bri_list;
            }
            else{
                return null;
            }
        }
        catch (e) {
            debug("[Twinkly_Light_API] Twinkly_Light_Get_Brightness() Error " + e);
        }
    }
    
    self.Twinkly_Light_Set_Movie = async function(address_ID, movie_item)
    {
        try {
            var light_addr_info = await Get_Twinkly_Light_Address_Info(address_ID);
            if(light_addr_info==null)
            {
                return false;
            }
        
            if(light_addr_info.target_type=="Device")
            {
                var op_result = await do_Set_Twinkly_Movie(light_addr_info.target_IP_list[0], movie_item);
                if(op_result==false){return false;}
                return await do_Set_Twinkly_Mode(light_addr_info.target_IP_list[0], "movie");
            }
            else if(light_addr_info.target_type=="Group")
            {
                for(var i = 0; i<target_IP_list.length; i++)
                {
                    await do_Set_Twinkly_Movie(light_addr_info.target_IP_list[i], movie_item);
                    await do_Set_Twinkly_Mode(light_addr_info.target_IP_list[i], "movie");
                }
                return true;
            }
            else{
                return false;
            }
        }
        catch (e) {
            debug("[Twinkly_Light_API] Twinkly_Light_Set_Movie() Error " + e);
        }
    }

    self.Twinkly_Light_Set_Single_Color = async function(address_ID, color) {
        try {
            var light_addr_info = await Get_Twinkly_Light_Address_Info(address_ID);
            if(light_addr_info==null)
            {
                return false;
            }
        
            var createdMovie = twinkly_movie_api.Twinkly_Create_Repeat_Colors_Movie(light_addr_info.light_info.led_profile, light_addr_info.light_info.number_of_led, [color]);
            if(createdMovie==null)
            {
                return false;
            }

            if(light_addr_info.target_type=="Device")
            {
                var op_result = await do_Set_Twinkly_Movie(light_addr_info.target_IP_list[0], createdMovie);
                if(op_result==false){return false;}
                return await do_Set_Twinkly_Mode(light_addr_info.target_IP_list[0], "movie");
            }
            else if(light_addr_info.target_type=="Group")
            {
                for(var i = 0; i<target_IP_list.length; i++)
                {
                    await do_Set_Twinkly_Movie(light_addr_info.target_IP_list[i], createdMovie);
                    await do_Set_Twinkly_Mode(light_addr_info.target_IP_list[i], "movie");
                }
                return true;
            }
            else{
                return false;
            }
            
        }
        catch (e) {
            debug("[Twinkly_Light_API] Twinkly_Light_Set_Color() Error " + e);
        }
    }
    
    self.Twinkly_Light_Set_Multi_Colors = async function(address_ID, colors) {
        try {
            var light_addr_info = await Get_Twinkly_Light_Address_Info(address_ID);
            if(light_addr_info==null)
            {
                return false;
            }
        
            var createdMovie = twinkly_movie_api.Twinkly_Create_Repeat_Colors_Movie(light_addr_info.light_info.led_profile, light_addr_info.light_info.number_of_led, colors);
            if(createdMovie==null)
            {
                return false;
            }

            if(light_addr_info.target_type=="Device")
            {
                var op_result = await do_Set_Twinkly_Movie(light_addr_info.target_IP_list[0], createdMovie);
                if(op_result==false){return false;}
                return await do_Set_Twinkly_Mode(light_addr_info.target_IP_list[0], "movie");
            }
            else if(light_addr_info.target_type=="Group")
            {
                for(var i = 0; i<target_IP_list.length; i++)
                {
                    await do_Set_Twinkly_Movie(light_addr_info.target_IP_list[i], createdMovie);
                    await do_Set_Twinkly_Mode(light_addr_info.target_IP_list[i], "movie");
                }
                return true;
            }
            else{
                return false;
            }
            
        }
        catch (e) {
            debug("[Twinkly_Light_API] Twinkly_Light_Set_Color() Error " + e);
        }
    }
    
    self.Twinkly_Light_Display_Colors = async function(address_ID, displayColors, frameDelay) {
        try {
            var light_addr_info = await Get_Twinkly_Light_Address_Info(address_ID);
            if(light_addr_info==null)
            {
                return false;
            }
        
            var createdMovie = twinkly_movie_api.Twinkly_Create_New_Movie(light_addr_info.light_info.led_profile, light_addr_info.light_info.number_of_led, displayColors.length, frameDelay, displayColors);
            if(createdMovie==null)
            {
                return false;
            }

            if(light_addr_info.target_type=="Device")
            {
                /*
                var op_result = await do_Set_Twinkly_Movie(light_addr_info.target_IP_list[0], createdMovie);
                if(op_result==false){return false;}
                return await do_Set_Twinkly_Mode(light_addr_info.target_IP_list[0], "movie");
*/
                return await do_Send_Twinkly_RealTime_Movie(light_addr_info.target_IP_list[0], createdMovie);
                if(op_result==false){return false;}
                return await do_Set_Twinkly_Mode(light_addr_info.target_IP_list[0], "rt");
            }
            else if(light_addr_info.target_type=="Group")
            {
                for(var i = 0; i<target_IP_list.length; i++)
                {
                    await do_Set_Twinkly_Movie(light_addr_info.target_IP_list[i], createdMovie);
                    await do_Set_Twinkly_Mode(light_addr_info.target_IP_list[i], "movie");
                }
                return true;
            }
            else{
                return false;
            }
        }
        catch (e) {
            debug("[Twinkly_Light_API] Twinkly_Light_Display_Colors() Error " + e);
        }
    }
    self.Twinkly_Light_Set_Blinking = async function(address_ID, colors, frameDelay) {
        try {
            var light_addr_info = await Get_Twinkly_Light_Address_Info(address_ID);
            if(light_addr_info==null)
            {
                return false;
            }
        
            var createdMovie = twinkly_movie_api.Twinkly_Create_Blinking_Colors_Movie(light_addr_info.light_info.led_profile, light_addr_info.light_info.number_of_led, frameDelay, colors);
            if(createdMovie==null)
            {
                return false;
            }

            if(light_addr_info.target_type=="Device")
            {
                var op_result = await do_Set_Twinkly_Movie(light_addr_info.target_IP_list[0], createdMovie);
                if(op_result==false){return false;}
                return await do_Set_Twinkly_Mode(light_addr_info.target_IP_list[0], "movie");
            }
            else if(light_addr_info.target_type=="Group")
            {
                for(var i = 0; i<target_IP_list.length; i++)
                {
                    await do_Set_Twinkly_Movie(light_addr_info.target_IP_list[i], createdMovie);
                    await do_Set_Twinkly_Mode(light_addr_info.target_IP_list[i], "movie");
                }
                return true;
            }
            else{
                return false;
            }
            
        }
        catch (e) {
            debug("[Twinkly_Light_API] Twinkly_Light_Set_Blinking() Error " + e);
        }
    }
    
    self.Twinkly_Light_Set_Twinkling = async function(address_ID, colors, frameDelay) {
        try {
            var light_addr_info = await Get_Twinkly_Light_Address_Info(address_ID);
            if(light_addr_info==null)
            {
                return false;
            }
        
            var createdMovie = twinkly_movie_api.Twinkly_Create_Twinkling_Colors_Movie(light_addr_info.light_info.led_profile, light_addr_info.light_info.number_of_led, 100, frameDelay, colors);
            if(createdMovie==null)
            {
                return false;
            }

            if(light_addr_info.target_type=="Device")
            {
                var op_result = await do_Set_Twinkly_Movie(light_addr_info.target_IP_list[0], createdMovie);
                if(op_result==false){return false;}
                return await do_Set_Twinkly_Mode(light_addr_info.target_IP_list[0], "movie");
            }
            else if(light_addr_info.target_type=="Group")
            {
                for(var i = 0; i<target_IP_list.length; i++)
                {
                    await do_Set_Twinkly_Movie(light_addr_info.target_IP_list[i], createdMovie);
                    await do_Set_Twinkly_Mode(light_addr_info.target_IP_list[i], "movie");
                }
                return true;
            }
            else{
                return false;
            }
            
        }
        catch (e) {
            debug("[Twinkly_Light_API] Twinkly_Light_Set_Twinkling() Error " + e);
        }
    }
    
    self.Twinkly_Light_Set_Looping_Colors = async function(address_ID, colors, frameDelay) {
        try {
            var light_addr_info = await Get_Twinkly_Light_Address_Info(address_ID);
            if(light_addr_info==null)
            {
                return false;
            }
        
            var createdMovie = twinkly_movie_api.Twinkly_Create_Looping_Colors_Movie(light_addr_info.light_info.led_profile, light_addr_info.light_info.number_of_led, frameDelay, colors);
            if(createdMovie==null)
            {
                return false;
            }

            if(light_addr_info.target_type=="Device")
            {
                var op_result = await do_Set_Twinkly_Movie(light_addr_info.target_IP_list[0], createdMovie);
                if(op_result==false){return false;}
                return await do_Set_Twinkly_Mode(light_addr_info.target_IP_list[0], "movie");
            }
            else if(light_addr_info.target_type=="Group")
            {
                for(var i = 0; i<target_IP_list.length; i++)
                {
                    await do_Set_Twinkly_Movie(light_addr_info.target_IP_list[i], createdMovie);
                    await do_Set_Twinkly_Mode(light_addr_info.target_IP_list[i], "movie");
                }
                return true;
            }
            else{
                return false;
            }
            
        }
        catch (e) {
            debug("[Twinkly_Light_API] Twinkly_Light_Set_Twinkling() Error " + e);
        }
    }
};

module.exports = Twinkly_Light_API;

var debug = require('debug')(require('path').basename(__filename));

const crypto = require('crypto');
const axios = require("axios");

var twinkly_auth_token_list = [];
var twinkly_auth_token_timeout_timer = [];
var twinkly_udp_socket_list = [];

const twinkly_base_uri = "/xled/v1"

async function do_Generate_Challenge_String()
{
    var challenge_str = "";
    const do_gen_challenge_str = function(){
        return new Promise(function(resolve, reject) {
            crypto.randomBytes(32, (err, buffer) => {
                challenge_str = buffer.toString('base64');
                resolve();
            });
        });
    }
    await do_gen_challenge_str();
    return challenge_str;
}

async function do_Authenticate(ip_address) {
    try {
        twinkly_auth_token_list[ip_address] = null;
        if(twinkly_auth_token_timeout_timer[ip_address]!=null)
        {
            clearTimeout(twinkly_auth_token_timeout_timer[ip_address]);
            twinkly_auth_token_timeout_timer[ip_address] = null;
        }

        var challenge_str = await do_Generate_Challenge_String();

        let challenge_json = {
            challenge: challenge_str
        };

        var req_result = null;
        req_result = await do_POST_JSON(ip_address, twinkly_base_uri+"/login", challenge_json, false);
        if(req_result==null)
        {
            return null;
        }
        if(req_result.statusCode!=200)
        {
            return null;
        }

        var response_token = req_result.body.authentication_token;
        var response_challenge = req_result.body["challenge-response"];
        var token_exp_time_ms = req_result.body["authentication_token_expires_in"];

        twinkly_auth_token_list[ip_address] = response_token;

        let challenge_rsp_json = {
            "challenge-response": response_challenge
        };

        req_result = await do_POST_JSON(ip_address, twinkly_base_uri+"/verify", challenge_rsp_json, false);
        if(req_result==null)
        {
            twinkly_auth_token_list[ip_address] = null;
            return null;
        }
        if(req_result.statusCode!=200)
        {
            twinkly_auth_token_list[ip_address] = null;
            return null;
        }

        twinkly_auth_token_timeout_timer[ip_address] = setTimeout(()=>{
            twinkly_auth_token_list[ip_address] = null;
            twinkly_auth_token_timeout_timer[ip_address] = null;
        }, token_exp_time_ms);
        
        return response_token;
    }
    catch(e){
        debug("[Twinkly_Request_API] do_Authenticate() Error " + e);
    };
}

async function do_Request(ip_address, uri, method, headers, body, need_auth)
{
    try{
        const base_url = "http://"+ip_address;
        var req_url = base_url+uri;
        if(uri.charAt(0)!='/')
        {
            req_url = base_url+'/'+uri;
        }

        var result = null;
        var req_headers = headers;

        if(need_auth)
        {
            if (twinkly_auth_token_list[ip_address]==null) {
                var token = await do_Authenticate(ip_address);
                if(token==null)
                {
                    return null;
                }
            }
        }

        if(twinkly_auth_token_list[ip_address]!=null)
        {
            req_headers["X-Auth-Token"] = twinkly_auth_token_list[ip_address];
        }
        
        try{
            var response = await axios({
                method: method.toUpperCase(),
                url: req_url,
                headers: req_headers,
                data: body
            });
            if(response==null)
            {
                return null;
            }
            result = {
                statusCode: response.status,
                statusText: response.statusText,
                headers: response.headers,
                body: response.data
            }
        }
        catch(e){
            if(e.message=="Request failed with status code 401")
            {
                result = {
                    statusCode: 401,
                    statusText: "Unauthorized"
                }
            }
        }

        return result;
    }
    catch(e){
        debug("[Twinkly_Request_API] do_Request() Error " + e);
    };
}

async function do_POST(ip_address, uri, mime, body, length, need_auth)
{
    var headers = {
        "Content-Type": mime,
        "Content-Length": length, // Twinkly fails to parse JSON without Content-Length header
    }
    return await do_Request(ip_address, uri, "POST", headers, body, need_auth);
}

async function do_POST_JSON(ip_address, uri, post_json, need_auth)
{
    let post_json_str = JSON.stringify(post_json);
    var headers = {
        "Content-Type": "application/json",
        "Content-Length": post_json_str.length, // Twinkly fails to parse JSON without Content-Length header
    }
    return await do_Request(ip_address, uri, "POST", headers, post_json_str, need_auth);
}

async function do_GET(ip_address, uri, need_auth)
{
    return await do_Request(ip_address, uri, "POST", {}, null, need_auth);
}

var Twinkly_Request_API = function () {
    var self = this;

    self.Twinkly_POST_Request = async function (ip_address, uri, mime, body) {
        try {
            var twinkly_uri = twinkly_base_uri+uri;
            if(uri.charAt(0)!='/')
            {
                twinkly_uri = twinkly_base_uri+'/'+uri;
            }

            return await do_POST(ip_address, twinkly_uri, mime, body, body.length, true);
        }
        catch(e){
            debug("[Twinkly_Request_API] Twinkly_POST_Request() Error " + e);
        }
    }
    self.Twinkly_POST_JSON_Request = async function (ip_address, uri, post_json) {
        try {
            var twinkly_uri = twinkly_base_uri+uri;
            if(uri.charAt(0)!='/')
            {
                twinkly_uri = twinkly_base_uri+'/'+uri;
            }
            
            return await do_POST_JSON(ip_address, twinkly_uri, post_json, true);
        }
        catch(e){
            debug("[Twinkly_Request_API] Twinkly_POST_JSON_Request() Error " + e);
        }
    }
    self.Twinkly_POST_Octet_Request = async function (ip_address, uri, octet_data) {
        try {
            var twinkly_uri = twinkly_base_uri+uri;
            if(uri.charAt(0)!='/')
            {
                twinkly_uri = twinkly_base_uri+'/'+uri;
            }
            
            return await do_POST(ip_address, twinkly_uri, "application/octet-stream", octet_data, octet_data.byteLength, true);
        }
        catch(e){
            debug("[Twinkly_Request_API] Twinkly_POST_Octet_Request() Error " + e);
        }
    }
    self.Twinkly_GET_Request = async function (ip_address, uri) {
        try {
            var twinkly_uri = twinkly_base_uri+uri;
            if(uri.charAt(0)!='/')
            {
                twinkly_uri = twinkly_base_uri+'/'+uri;
            }
            
            return await do_GET(ip_address, twinkly_uri, true);
        }
        catch(e){
            debug("[Twinkly_Request_API] Twinkly_GET_Request() Error " + e);
        }
    }
    self.Twinkly_Authenticate_Light_Device = async function (ip_address) {
        try {
            return await do_Authenticate(ip_address);
        }
        catch (e) {
            debug("[Twinkly_Request_API] Twinkly_Authenticate_Light_Device() Error " + e);
        }
    };
    self.Twinkly_Get_Authentication_Token = function (ip_address) {
        try {
            return twinkly_auth_token_list[ip_address];
        }
        catch(e){
            debug("[Twinkly_Request_API] Twinkly_Get_Authentication_Token() Error " + e);
        }
    }
    self.Twinkly_Clear_Authentication_Token = function (ip_address) {
        try {
            twinkly_auth_token_list[ip_address] = null;
            if(twinkly_udp_socket_list[ip_address]!=null)
            {
                twinkly_udp_socket_list[ip_address].close();
                twinkly_udp_socket_list[ip_address] = null;
            }
            return true;
        }
        catch(e){
            debug("[Twinkly_Request_API] Twinkly_Clear_Authentication_Token() Error " + e);
        }
    }
    self.Twinkly_Send_Octet_Frame_UDP = function (ip_address, fw_version, num_of_led, frame_octet_data) {
        try {
            if(twinkly_auth_token_list[ip_address]==null)
            {
                return false;
            }
            if(twinkly_udp_socket_list[ip_address]==null)
            {
                twinkly_udp_socket_list[ip_address] = dgram.createSocket("udp4");
            }

            var header = null;
            var auth_token_uint8 = Buffer.alloc(8);
            for(var i = 0; i<8; i++)
            {
                auth_token_uint8[i] = parseInt(twinkly_auth_token_list[ip_address].substring(i*2, (i+1)*2), 16)
            }

            switch(Number(fw_version))
            {
                case 1:
                    header = Buffer.alloc(10);
                    header[0] = fw_version;
                    header.write(auth_token_uint8, 1, "utf-8");
                    header[9] = num_of_led;
                    twinkly_udp_socket_list[ip_address].send([header,frame_octet_data],7777,ip_address,function(error){
                        throw error;
                    });
                    break;
                case 2:
                    header = Buffer.alloc(9);
                    header[0] = fw_version;
                    header.write(auth_token_uint8, 1, "utf-8");
                    twinkly_udp_socket_list[ip_address].send([header,frame_octet_data],7777,ip_address,function(error){
                        throw error;
                    });
                    break;
                case 3:
                    header = Buffer.alloc(12);
                    header[0] = fw_version;
                    header.write("\x00\x00", 9, "utf-8")
                    var num_of_segment = Math.round((frame_octet_data.byteLength)/900) + 1;
                    for(var i = 0; i<num_of_segment; i++){
                        header[11] = i;
                        var divided_frame = null;
                        if(i==(num_of_segment-1))
                        {
                            var last_data = (frame_octet_data.byteLength)%900;
                            divided_frame = frame_octet_data.slice(i*900,i*900+last_data);
                        }
                        else{
                            divided_frame = frame_octet_data.slice(i*900,(i+1)*900);
                        }
                        twinkly_udp_socket_list[ip_address].send([header,divided_frame],7777,ip_address,function(error){
                            throw error;
                        });
                    }
                    break;
                default:
                    return false;
            }
            return true;
        }
        catch(e){
            debug("[Twinkly_Request_API] Twinkly_Send_Octet_Frame_UDP() Error " + e);
        }
    }
};

module.exports = Twinkly_Request_API;
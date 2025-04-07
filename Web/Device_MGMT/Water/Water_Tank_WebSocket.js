
var debug = require('debug')(require('path').basename(__filename));

var Water_Tank_API = require('../../../Device_MGMT/Water/Water_Tank_API.js');
var water_tank_api = new Water_Tank_API();

var Water_Tank_WebSocket = function (){
    var self = this;
    
    self.Process_Water_Tank_WebSocket_POST_Message = async function(username, post_water_tank_json_data)
    {
        try{
            if(post_water_tank_json_data.command!=null){
                switch(post_water_tank_json_data.command){
                }
            }
        }
        catch(e)
        {
            debug('[Water_Tank_WebSocket] Process_Water_Tank_WebSocket_POST_Message() Error ' + e);
        }
    }

    self.Process_Water_Tank_WebSocket_GET_Message = async function(username, get_water_tank_json_data)
    {
        try{
            var rsp_json = null;
            if(get_water_tank_json_data.command!=null){
                switch(get_water_tank_json_data.command){
                    case "Get Num Of Water Tank":
                        if(get_water_tank_json_data.device_ID!=null){
                            var get_rsp_json = await water_tank_api.Water_Tank_Get_Num_Of_Tank(get_water_tank_json_data.device_ID);
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_water_tank_json_data.device_ID
                                };
                            }
                            else{
                                rsp_json = {
                                    "timeout": false,
                                    "device_ID": get_water_tank_json_data.device_ID,
                                    "num_of_water_tank": get_rsp_json.num_of_water_tank
                                };
                            }
                        }
                        break;
                    case "Get Individual Water Tank Status":
                        if(get_water_tank_json_data.device_ID!=null && get_water_tank_json_data.tank_index!=null){
                            var get_rsp_json = await water_tank_api.Water_Tank_Get_Individual_Tank_Status(get_water_tank_json_data.device_ID, get_water_tank_json_data.tank_index);
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_water_tank_json_data.device_ID
                                };
                            }
                            else{
                                rsp_json = {
                                    "timeout": false,
                                    "device_ID": get_water_tank_json_data.device_ID,
                                    "tank_index": get_rsp_json.tank_index,
                                    "tank_water_level": get_rsp_json.tank_water_level
                                };
                            }
                        }
                        break;
                    case "Get All Water Tank Status":
                        if(get_water_tank_json_data.device_ID!=null){
                            var get_rsp_json = await water_tank_api.Water_Tank_Get_All_Tank_Status(get_water_tank_json_data.device_ID);
                            var tank_status_list = [];

                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_water_tank_json_data.device_ID
                                };
                            }
                            else{
                                for(var i = 0; i<get_rsp_json.num_of_water_tank; i++)
                                {
                                    tank_status_list.push({
                                        "tank_index": get_rsp_json.individual_tank_status[i].tank_index,
                                        "tank_water_level": get_rsp_json.individual_tank_status[i].tank_water_level
                                    });
                                }
                                rsp_json = {
                                    "timeout": false,
                                    "device_ID": get_water_tank_json_data.device_ID,
                                    "num_of_water_tank": get_rsp_json.num_of_water_tank,
                                    "tank_status_list": tank_status_list
                                };
                            }
                        }
                        break;
                }
            }
            return rsp_json;
        }
        catch(e)
        {
            debug('[Water_Tank_WebSocket] Process_Water_Tank_WebSocket_GET_Message() Error ' + e);
        }
    }
}
module.exports = Water_Tank_WebSocket;
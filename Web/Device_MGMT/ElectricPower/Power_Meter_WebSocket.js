
var debug = require('debug')(require('path').basename(__filename));

var Power_Meter_API = require('../../../Device_MGMT/ElectricPower/Power_Meter_API.js');
var power_meter_api = new Power_Meter_API();

var Power_Meter_WebSocket = function (){
    var self = this;
    
    self.Process_Power_Meter_WebSocket_POST_Message = async function(username, post_power_meter_json_data)
    {
        try{
            if(post_power_meter_json_data.command!=null){
                switch(post_power_meter_json_data.command){
                    case "Turn On Individual Power Meter":
                        if(post_power_meter_json_data.device_ID!=null && post_power_meter_json_data.meter_index!=null){
                            await power_meter_api.Power_Meter_Set_Individual_Meter_On_Off(post_power_meter_json_data.device_ID, post_power_meter_json_data.meter_index, true);
                        }
                        break;
                    case "Turn Off Individual Power Meter":
                        if(post_power_meter_json_data.device_ID!=null && post_power_meter_json_data.meter_index!=null){
                            await power_meter_api.Power_Meter_Set_Individual_Meter_On_Off(post_power_meter_json_data.device_ID, post_power_meter_json_data.meter_index, false);
                        }
                        break;
                    case "Turn On All Power Meter":
                        if(post_power_meter_json_data.device_ID!=null){
                            await power_meter_api.Power_Meter_Set_All_Meter_On_Off(post_power_meter_json_data.device_ID, true);
                        }
                        break;
                    case "Turn Off All Power Meter":
                        if(post_power_meter_json_data.device_ID!=null){
                            await power_meter_api.Power_Meter_Set_All_Meter_On_Off(post_power_meter_json_data.device_ID, false);
                        }
                        break;
                }
            }
        }
        catch(e)
        {
            debug('[Power_Meter_WebSocket] Process_Power_Meter_WebSocket_POST_Message() Error ' + e);
        }
    }

    self.Process_Power_Meter_WebSocket_GET_Message = async function(username, get_power_meter_json_data)
    {
        try{
            var rsp_json = null;
            if(get_power_meter_json_data.command!=null){
                switch(get_power_meter_json_data.command){
                    case "Get Num Of Power Meter":
                        if(get_power_meter_json_data.device_ID!=null){
                            var get_rsp_json = await power_meter_api.Get_Num_Of_Power_Meter(get_power_meter_json_data.device_ID);
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_power_meter_json_data.device_ID
                                };
                            }
                            else{
                                rsp_json = {
                                    "timeout": false,
                                    "device_ID": get_power_meter_json_data.device_ID,
                                    "num_of_power_meter": get_rsp_json.num_of_power_meter
                                };
                            }
                        }
                        break;
                    case "Get Individual Power Meter Status":
                        if(get_power_meter_json_data.device_ID!=null && get_power_meter_json_data.meter_index!=null){
                            var get_rsp_json = await power_meter_api.Get_Power_Meter_Individual_Meter_Status(get_power_meter_json_data.device_ID, get_power_meter_json_data.meter_index);
                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_power_meter_json_data.device_ID
                                };
                            }
                            else{
                                rsp_json = {
                                    "timeout": false,
                                    "device_ID": get_power_meter_json_data.device_ID,
                                    "meter_type": get_rsp_json.meter_type,
                                    "meter_index": get_rsp_json.meter_index,
                                    "on_off": get_rsp_json.on_off,
                                    "max_amperage": get_rsp_json.max_amperage,
                                    "rated_amperage": get_rsp_json.rated_amperage,
                                    "measure_voltage": get_rsp_json.measure_voltage,
                                    "measure_amperage": get_rsp_json.measure_amperage,
                                    "measure_frequency": get_rsp_json.measure_frequency,
                                    "measure_power_factor": get_rsp_json.measure_power_factor,
                                    "measure_active_power": get_rsp_json.measure_active_power,
                                    "measure_apparent_power": get_rsp_json.measure_apparent_power,
                                    "measure_main_energy": get_rsp_json.measure_main_energy,
                                    "measure_negative_energy": get_rsp_json.measure_negative_energy
                                };
                            }
                        }
                        break;
                    case "Get All Power Meter Status":
                        if(get_power_meter_json_data.device_ID!=null){
                            var get_rsp_json = await power_meter_api.Get_Power_Meter_All_Meter_Status(get_power_meter_json_data.device_ID);
                            var meter_status_list = [];

                            if(get_rsp_json.timeout==true){
                                rsp_json = {
                                    "timeout": true,
                                    "device_ID": get_power_meter_json_data.device_ID
                                };
                            }
                            else{
                                for(var i = 0; i<get_rsp_json.num_of_power_meter; i++)
                                {
                                    meter_status_list.push({
                                        "meter_index": get_rsp_json.individual_meter_status[i].meter_index,
                                        "on_off": get_rsp_json.individual_meter_status[i].on_off,
                                        "max_amperage": get_rsp_json.individual_meter_status[i].max_amperage,
                                        "rated_amperage": get_rsp_json.individual_meter_status[i].rated_amperage,
                                        "measure_voltage": get_rsp_json.individual_meter_status[i].measure_voltage,
                                        "measure_amperage": get_rsp_json.individual_meter_status[i].measure_amperage,
                                        "measure_frequency": get_rsp_json.individual_meter_status[i].measure_frequency,
                                        "measure_power_factor": get_rsp_json.individual_meter_status[i].measure_power_factor,
                                        "measure_active_power": get_rsp_json.individual_meter_status[i].measure_active_power,
                                        "measure_apparent_power": get_rsp_json.individual_meter_status[i].measure_apparent_power,
                                        "measure_main_energy": get_rsp_json.individual_meter_status[i].measure_main_energy,
                                        "measure_negative_energy": get_rsp_json.individual_meter_status[i].measure_negative_energy
                                    });
                                }
                                rsp_json = {
                                    "timeout": false,
                                    "device_ID": get_power_meter_json_data.device_ID,
                                    "meter_type": get_rsp_json.meter_type,
                                    "num_of_power_meter": get_rsp_json.num_of_power_meter,
                                    "meter_status_list": meter_status_list
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
            debug('[Power_Meter_WebSocket] Process_Power_Meter_WebSocket_GET_Message() Error ' + e);
        }
    }
}
module.exports = Power_Meter_WebSocket;
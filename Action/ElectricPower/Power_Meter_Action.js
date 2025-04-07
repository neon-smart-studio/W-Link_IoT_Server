
var debug = require('debug')(require('path').basename(__filename));

var Power_Meter_API = require('../../Device_MGMT/ElectricPower/Power_Meter_API.js');
var power_meter_api = new Power_Meter_API();

var Power_Meter_Action = function (){
    var self = this;
    
    self.Execute_Power_Meter_Action = async function(target_address_ID, command, param_json_data)
    {
        try{
            switch(command){
                case "Turn On Individual Power Meter":
                    if(param_json_data.meter_index!=null){
                        await power_meter_api.Power_Meter_Set_Individual_Socket_On_Off(target_address_ID, param_json_data.meter_index, true);
                    }
                    break;
                case "Turn Off Individual Power Meter":
                    if(param_json_data.meter_index!=null){
                        await power_meter_api.Power_Meter_Set_Individual_Socket_On_Off(target_address_ID, param_json_data.meter_index, false);
                    }
                    break;
                case "Toggle Individual Power Meter":
                    if(param_json_data.meter_index!=null){
                        await power_meter_api.Power_Meter_Toggle_Individual_Meter_On_Off(target_address_ID, param_json_data.meter_index);
                    }
                    break;
                case "Turn On All Power Meter":
                    await power_meter_api.Power_Meter_Set_All_Meter_On_Off(target_address_ID, true);
                    break;
                case "Turn Off All Power Meter":
                    await power_meter_api.Power_Meter_Set_All_Meter_On_Off(target_address_ID, false);
                    break;
                case "Toggle All Power Meter":
                    await power_meter_api.Power_Meter_Toggle_All_Meter_On_Off(target_address_ID);
                    break;
            }
        }
        catch(e)
        {
            debug('[Power_Meter_Action] Execute_Power_Meter_Action() Error ' + e);
        }
    }
}
module.exports = Power_Meter_Action;
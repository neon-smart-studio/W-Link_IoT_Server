
var debug = require('debug')(require('path').basename(__filename));

var Air_Valve_API = require('../../Device_MGMT/Gas/Air_Valve_API.js');
var air_valve_api = new Air_Valve_API();

var Air_Valve_Action = function (){
    var self = this;
    
    self.Execute_Air_Valve_Action = async function(target_address_ID, command, param_json_data)
    {
        try{
            switch(command){
                case "Set Main Switch En/Dis State":
                    if(param_json_data.enabled!=null){
                        await air_valve_api.Air_Valve_Set_Main_Switch_Enable_Disable(target_address_ID, param_json_data.enabled);
                    }
                    break;
                case "Set Main Switch On/Off State":
                    if(param_json_data.on_off!=null){
                        await air_valve_api.Air_Valve_Set_Main_Switch_On_Off(target_address_ID, param_json_data.on_off);
                    }
                    break;
                case "Toggle Main Switch En/Dis State":
                    await air_valve_api.Air_Valve_Toggle_Main_Switch_Enable_Disable(target_address_ID);
                    break;
                case "Toggle Main Switch On/Off State":
                    await air_valve_api.Air_Valve_Toggle_Main_Switch_On_Off(target_address_ID);
                    break;
                case "Set Individual Switch En/Dis State":
                    if(param_json_data.switch_index!=null && param_json_data.enabled!=null){
                        await air_valve_api.Air_Valve_Set_Individual_Switch_Enable_Disable(target_address_ID, param_json_data.switch_index, param_json_data.enabled);
                    }
                    break;
                case "Set Individual Switch On/Off State":
                    if(param_json_data.switch_index!=null && param_json_data.on_off!=null){
                        await air_valve_api.Air_Valve_Set_Individual_Switch_On_Off(target_address_ID, param_json_data.switch_index, param_json_data.on_off);
                    }
                    break;
                case "Toggle Individual Switch En/Dis State":
                    if(param_json_data.switch_index!=null){
                        await air_valve_api.Air_Valve_Toggle_Individual_Switch_Enable_Disable(target_address_ID, param_json_data.switch_index);
                    }
                    break;
                case "Toggle Individual Switch On/Off State":
                    if(param_json_data.switch_index!=null){
                        await air_valve_api.Air_Valve_Toggle_Individual_Switch_On_Off(target_address_ID, param_json_data.switch_index);
                    }
                    break;
            }
        }
        catch(e)
        {
            debug('[Air_Valve_Action] Execute_Air_Valve_Action() Error ' + e);
        }
    }
}
module.exports = Air_Valve_Action;
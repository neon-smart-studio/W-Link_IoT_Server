
var debug = require('debug')(require('path').basename(__filename));

var EM_Valve_API = require('../../Device_MGMT/Water/Electromagnetic_Valve_API.js');
var em_valve_api = new EM_Valve_API();

var EM_Valve_Action = function (){
    var self = this;
    
    self.Execute_EM_Valve_Action = async function(target_address_ID, command, param_json_data)
    {
        try{
            switch(command){
                case "Set Main Switch En/Dis State":
                    if(param_json_data.enabled!=null){
                        await em_valve_api.EM_Valve_Main_Switch_Enable_Disable(target_address_ID, param_json_data.enabled);
                    }
                    break;
                case "Set Main Switch On/Off State":
                    if(param_json_data.on_off!=null){
                        await em_valve_api.EM_Valve_Main_Switch_On_Off(target_address_ID, param_json_data.on_off);
                    }
                    break;
                case "Set Individual Switch En/Dis State":
                    if(param_json_data.switch_index!=null && param_json_data.enabled!=null){
                        await em_valve_api.EM_Valve_Individual_Switch_Enable_Disable(target_address_ID, param_json_data.switch_index, param_json_data.enabled);
                    }
                    break;
                case "Set Individual Switch On/Off State":
                    if(param_json_data.switch_index!=null && param_json_data.on_off!=null){
                        await em_valve_api.EM_Valve_Individual_Switch_On_Off(target_address_ID, param_json_data.switch_index, param_json_data.on_off);
                    }
                    break;
            }
        }
        catch(e)
        {
            debug('[EM_Valve_Action] Execute_EM_Valve_Action() Error ' + e);
        }
    }
}
module.exports = EM_Valve_Action;
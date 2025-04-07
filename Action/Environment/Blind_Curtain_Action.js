
var debug = require('debug')(require('path').basename(__filename));

var Blind_Curtain_API = require('../../Device_MGMT/Environment/Blind_Curtain_API.js');
var blind_curtain_api = new Blind_Curtain_API();

var Blind_Curtain_Action = function (){
    var self = this;

    self.Execute_Blind_Curtain_Action = async function(target_address_ID, command, param_json_data)
    {
        try{
            if(command!=null){
                switch(command){
                    case "Blind Curtain Open":
                        if(target_address_ID!=null){
                            await blind_curtain_api.Blind_Curtain_Open_Close(target_address_ID, true);
                        }
                        break;
                    case "Blind Curtain Close":
                        if(target_address_ID!=null){
                            await blind_curtain_api.Blind_Curtain_Open_Close(target_address_ID, false);
                        }
                        break;
                    case "Blind Curtain Toggle State":
                        if(target_address_ID!=null){
                            await blind_curtain_api.Blind_Curtain_Toggle_State(target_address_ID, false);
                        }
                        break;
                    case "Blind Curtain Move To Position":
                        if(target_address_ID!=null && param_json_data.lift_percentage!=null){
                            await blind_curtain_api.Blind_Curtain_Lift_To_Position(target_address_ID, param_json_data.lift_percentage);
                        }
                        else if(target_address_ID!=null && param_json_data.tilt_percentage!=null){
                            await blind_curtain_api.Blind_Curtain_Tilt_To_Position(target_address_ID, param_json_data.tilt_percentage);
                        }
                        break;
                    case "Blind Curtain Stop Moving":
                        if(target_address_ID!=null){
                            await blind_curtain_api.Blind_Curtain_Stop_Moveing(target_address_ID);
                        }
                        break;
                }
            }
        }
        catch(e)
        {
            debug('[Blind_Curtain_Action] Execute_Environment_Topic_Action() Error ' + e);
        }
    }
}
module.exports = Blind_Curtain_Action;
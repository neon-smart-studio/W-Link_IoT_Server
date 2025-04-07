
var debug = require('debug')(require('path').basename(__filename));

var Device_MGR = require('../../../Util/Device_MGR.js');
var device_mgr = new Device_MGR();

var Bind_MGR = require('../../../Util/Bind_MGR.js');
var bind_mgr = new Bind_MGR();

const Scene_Switch_Device_Type = "Scene Switch";

var Scene_Switch_Last_State = [];

function Scene_Switch_Resolve_Endpoint_Name(switch_index, action)
{
    return switch_index+":"+action;
}

async function Get_Scene_Switch_Support_Maxium_Keys(address_ID)
{
    var read_dev_info = await device_mgr.Read_Device_Inf(Scene_Switch_Device_Type, "everyone", address_ID);
    if(read_dev_info==null)
    {
        return 0;
    }
        
    var num_of_scene_switch = 0;

    switch(read_dev_info.model)
    {
        case "TRADFRI remote control":
            num_of_scene_switch = 1;
            break;
        case "lumi.sensor_cube":
        case "lumi.sensor_cube.aqgl01":
            num_of_scene_switch = 1;
            break;
        case "lumi.remote.b286opcn01":
            num_of_scene_switch = 2;
            break;
        case "lumi.remote.b486opcn01":
            num_of_scene_switch = 4;
            break;
        case "lumi.remote.b686opcn01":
            num_of_scene_switch = 6;
            break;
    }

    return num_of_scene_switch;
}

var Scene_Switch_API_Zigbee = function () {
    var self = this;
    
    self.Get_Scene_Switch_Support_Actions = async function(address_ID)
    {
        try {
            var read_dev_info = await device_mgr.Read_Device_Inf(Scene_Switch_Device_Type, "everyone", address_ID);
            if(read_dev_info==null)
            {
                return null;
            }
            
            if(read_dev_info.model==null)
            {
                return null;
            }
            
            var actions = null;
        
            switch(read_dev_info.model)
            {
                case "TRADFRI remote control":
                    actions = ["default", "arrow_left", "arrow_right"];
                    break;
                case "lumi.sensor_cube":
                case "lumi.sensor_cube.aqgl01":
                    actions = ["single", "double", "hold", "release"];
                    break;
                case "lumi.remote.b286opcn01":
                    actions = ["single", "double", "triple", "hold", "release"];
                    break;
                case "lumi.remote.b486opcn01":
                    actions = ["single", "double", "hold", "release"];
                    break;
                case "lumi.remote.b686opcn01":
                    actions = ["single", "double", "hold", "release"];
                    break;
                default:
                    actions = ["default"];
                    break;

            }
        
            return {
                support_actions: actions
            };
        }
        catch (e) {
            debug("[Scene_Switch_API_Zigbee] Get_Scene_Switch_Support_Actions() Error " + e);
        }
    };
    self.Get_Num_Of_Scene_Switch = async function (address_ID) {
        try {
            var num_of_sw = await Get_Scene_Switch_Support_Maxium_Keys(address_ID);

            return {
                num_of_scene_switch: num_of_sw
            };
        }
        catch (e) {
            debug("[Scene_Switch_API_Zigbee] Get_Num_Of_Scene_Switch() Error " + e);
        }
    };
    self.Get_Scene_Switch_Individual_Switch_Info = async function (address_ID, switch_index) {
        try {
            var support_actions_json = await this.Get_Scene_Switch_Support_Actions(address_ID);
            if(support_actions_json==null)
            {
                return null;
            }

            var last_action = null;

            if(Scene_Switch_Last_State[address_ID]!=null)
            {
                var switch_last_state = Scene_Switch_Last_State[address_ID].individual_switch_status[switch_index];
                last_action = switch_last_state.action;
            }

            return  {
                switch_index: switch_index,
                support_actions: support_actions_json.support_actions,
                last_action: last_action
            };;
        }
        catch (e) {
            debug("[Scene_Switch_API_Zigbee] Get_Scene_Switch_Individual_Switch_Info() Error " + e);
        }
    };
    
    self.Get_Scene_Switch_All_Switch_Info = async function (address_ID) {
        try {
            var support_actions_json = await this.Get_Scene_Switch_Support_Actions(address_ID);
            if(support_actions_json==null)
            {
                return null;
            }

            var num_of_scene_switch = await Get_Scene_Switch_Support_Maxium_Keys(address_ID);
            if(num_of_scene_switch==0)
            {
                return null;
            }

            var switch_info_list = [];

            var last_action = null;
            
            for(var i = 0; i<num_of_scene_switch; i++)
            {
                if(Scene_Switch_Last_State[address_ID]!=null)
                {
                    last_action = Scene_Switch_Last_State[address_ID].individual_switch_status[i].action;
                }

                switch_info_list.push({
                    socket_index: i,
                    support_actions: support_actions_json.support_actions,
                    last_action: last_action
                });
            }

            return {
                num_of_scene_switch: num_of_scene_switch,
                individual_switch_info: switch_info_list
            };
        }
        catch (e) {
            debug("[Scene_Switch_API_Zigbee] Get_Scene_Switch_All_Switch_Info() Error " + e);
        }
    };
};

module.exports = Scene_Switch_API_Zigbee;
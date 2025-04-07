
var debug = require('debug')(require('path').basename(__filename));

var Device_MGR = require('../../../Util/Device_MGR.js');
var device_mgr = new Device_MGR();

var Bind_MGR = require('../../../Util/Bind_MGR.js');
var bind_mgr = new Bind_MGR();

const Toggle_Switch_Device_Type = "Toggle Switch";

var Toggle_Switch_Last_State = [];

function Toggle_Switch_Resolve_Endpoint_Name(switch_index, action)
{
    return switch_index+":"+action;
}

var Toggle_Switch_API_Zigbee = function () {
    var self = this;
    
    self.Get_Toggle_Switch_Support_Actions = async function(address_ID)
    {
        try {
            var read_dev_info = await device_mgr.Read_Device_Inf(Toggle_Switch_Device_Type, "everyone", address_ID);
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
                case "lumi.sensor_switch":
                case "lumi.sensor_switch.aq2":
                case "lumi.remote.b1acn01":
                    actions = ["single", "double", "triple", "quadruple", "hold", "release"];
                    break;
                case "lumi.sensor_switch.aq3":
                case "lumi.sensor_swit":
                    actions = ["single", "double", "shake", "hold", "release"];
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
            debug("[Toggle_Switch_API_Zigbee] Get_Toggle_Switch_Support_Actions() Error " + e);
        }
    };
    self.Get_Num_Of_Toggle_Switch = async function (address_ID) {
        try {
            const num_of_toggle_switch = 1;
            return {
                num_of_toggle_switch: num_of_toggle_switch
            };
        }
        catch (e) {
            debug("[Toggle_Switch_API_Zigbee] Get_Num_Of_Toggle_Switch() Error " + e);
        }
    };
    self.Get_Toggle_Switch_Individual_Switch_Info = async function (address_ID, switch_index) {
        try {
            if(switch_index!=0)
            {
                return null;
            }

            var support_actions_json = await this.Get_Toggle_Switch_Support_Actions(address_ID);
            if(support_actions_json==null)
            {
                return null;
            }

            var last_action = null;

            if(Toggle_Switch_Last_State[address_ID]!=null)
            {
                var switch_last_state = Toggle_Switch_Last_State[address_ID].individual_switch_status[0];
                last_action = switch_last_state.action;
            }

            return  {
                switch_index: switch_index,
                support_actions: support_actions_json.support_actions,
                last_action: last_action
            };
        }
        catch (e) {
            debug("[Toggle_Switch_API_Zigbee] Get_Toggle_Switch_Individual_Switch_Info() Error " + e);
        }
    };
    
    self.Get_Toggle_Switch_All_Switch_Info = async function (address_ID) {
        try {
            var support_actions_json = await this.Get_Toggle_Switch_Support_Actions(address_ID);
            if(support_actions_json==null)
            {
                return null;
            }

            const num_of_toggle_switch = 1;
            var switch_info_list = [];

            var last_action = null;
            
            if(Toggle_Switch_Last_State[address_ID]!=null)
            {
                last_action = Toggle_Switch_Last_State[address_ID].individual_switch_status[0].action;
            }

            switch_info_list.push({
                socket_index: 0,
                support_actions: support_actions_json.support_actions,
                last_action: last_action
            });

            return {
                num_of_toggle_switch: num_of_toggle_switch,
                individual_switch_info: switch_info_list
            };
        }
        catch (e) {
            debug("[Toggle_Switch_API_Zigbee] Get_Toggle_Switch_All_Switch_Info() Error " + e);
        }
    };
};

module.exports = Toggle_Switch_API_Zigbee;
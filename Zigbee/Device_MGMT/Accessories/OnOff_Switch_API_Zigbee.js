
var debug = require('debug')(require('path').basename(__filename));

var Device_MGR = require('../../../Util/Device_MGR.js');
var device_mgr = new Device_MGR();

var Bind_MGR = require('../../../Util/Bind_MGR.js');
var bind_mgr = new Bind_MGR();

const OnOff_Switch_Device_Type = "OnOff Switch";

async function Get_OnOff_Switch_Support_Maxium_Keys(address_ID)
{
    var read_dev_info = await device_mgr.Read_Device_Inf(OnOff_Switch_Device_Type, "everyone", address_ID);
    if(read_dev_info==null)
    {
        return 0;
    }
        
    var num_of_onoff_switch = 0;

    switch(read_dev_info.model)
    {
        case "TRADFRI open/close remote":
            num_of_onoff_switch = 1;
            break;
    }

    return num_of_onoff_switch;
}

var OnOff_Switch_API_Zigbee = function () {
    var self = this;
    
    self.Get_OnOff_Switch_Support_Actions = async function(address_ID)
    {
        try {
            var read_dev_info = await device_mgr.Read_Device_Inf(OnOff_Switch_Device_Type, "everyone", address_ID);
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
                case "TRADFRI open/close remote":
                    actions = ["default"];
                default:
                    actions = ["default"];
                    break;
            }
        
            return {
                support_actions: actions
            };
        }
        catch (e) {
            debug("[OnOff_Switch_API_Zigbee] Get_OnOff_Switch_Support_Actions() Error " + e);
        }
    };
    self.Get_Num_Of_OnOff_Switch = async function (address_ID) {
        try {
            var num_of_sw = await Get_OnOff_Switch_Support_Maxium_Keys(address_ID);

            return {
                num_of_onoff_switch: num_of_sw
            };
        }
        catch (e) {
            debug("[OnOff_Switch_API_Zigbee] Get_Num_Of_OnOff_Switch() Error " + e);
        }
    };
    self.Get_OnOff_Switch_Individual_Switch_Info = async function (address_ID, switch_index) {
        try {
            var support_actions_json = await this.Get_OnOff_Switch_Support_Actions(address_ID);
            if(support_actions_json==null)
            {
                return null;
            }

            var last_action = null;

            if(OnOff_Switch_Last_State[address_ID]!=null)
            {
                var switch_last_state = OnOff_Switch_Last_State[address_ID].individual_switch_status[switch_index];
                last_action = switch_last_state.action;
            }

            return  {
                switch_index: switch_index,
                support_actions: support_actions_json.support_actions,
                last_action: last_action
            };;
        }
        catch (e) {
            debug("[OnOff_Switch_API_Zigbee] Get_OnOff_Switch_Individual_Switch_Info() Error " + e);
        }
    };
    
    self.Get_OnOff_Switch_All_Switch_Info = async function (address_ID) {
        try {
            var support_actions_json = await this.Get_OnOff_Switch_Support_Actions(address_ID);
            if(support_actions_json==null)
            {
                return null;
            }

            var num_of_onoff_switch = await Get_OnOff_Switch_Support_Maxium_Keys(address_ID);
            if(num_of_onoff_switch==0)
            {
                return null;
            }

            var switch_info_list = [];

            var last_action = null;
            
            for(var i = 0; i<num_of_onoff_switch; i++)
            {
                if(OnOff_Switch_Last_State[address_ID]!=null)
                {
                    last_action = OnOff_Switch_Last_State[address_ID].individual_switch_status[i].action;
                }

                switch_info_list.push({
                    socket_index: i,
                    support_actions: support_actions_json.support_actions,
                    last_action: last_action
                });
            }

            return {
                num_of_onoff_switch: num_of_onoff_switch,
                individual_switch_info: switch_info_list
            };
        }
        catch (e) {
            debug("[OnOff_Switch_API_Zigbee] Get_OnOff_Switch_All_Switch_Info() Error " + e);
        }
    };
};

module.exports = OnOff_Switch_API_Zigbee;
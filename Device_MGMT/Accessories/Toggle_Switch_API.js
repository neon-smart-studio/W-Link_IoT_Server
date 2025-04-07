
var debug = require('debug')(require('path').basename(__filename));

var Address_MGR = require('../../Util/Address_MGR.js');
var address_mgr = new Address_MGR();

var Toggle_Switch_API_MQTT = require('../../MQTT/Device_MGMT/Accessories/Toggle_Switch_API_MQTT.js');
var toggle_switch_api_mqtt = new Toggle_Switch_API_MQTT();

var Toggle_Switch_API_Zigbee = require('../../Zigbee/Device_MGMT/Accessories/Toggle_Switch_API_Zigbee.js');
var toggle_switch_api_zigbee = new Toggle_Switch_API_Zigbee();

var Toggle_Switch_API = function () {
    var self = this;
    
    self.Get_Toggle_Switch_Support_Actions = async function(username, address_ID)
    {
        try{
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }

            var result = null;

            if(address_info.target_network=="TCP/IP")
            {
                //result = await toggle_switch_api_mqtt.Get_Toggle_Switch_Support_Actions(username, address_ID);
            }
            else if(address_info.target_network=="Zigbee")
            {
                result = await toggle_switch_api_zigbee.Get_Toggle_Switch_Support_Actions(address_ID);
            }

            return result;
        }
        catch(e)
        {
          debug("[Toggle_Switch_API] Get_Toggle_Switch_Support_Actions() Error " + e);
        }
    };
    self.Get_Num_Of_Toggle_Switch = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }
            
            var result = null;

            if(address_info.target_network=="TCP/IP")
            {
                result = await toggle_switch_api_mqtt.Get_Num_Of_Toggle_Switch(address_ID);
            }
            else if(address_info.target_network=="Zigbee")
            {
                var switch_info_obj = await toggle_switch_api_zigbee.Get_Num_Of_Toggle_Switch(address_ID);
                if(switch_info_obj==null)
                {
                    result = {
                        timeout: true,
                        username: 'everyone',
                        device_ID: address_ID
                    };
                }
                else{
                    result = Object.assign({},{
                        timeout: false,
                        username: 'everyone',
                        device_ID: address_ID
                    },switch_info_obj);
                }
            }

            return result;
        }
        catch (e) {
            debug("[Toggle_Switch_API] Get_Num_Of_Toggle_Switch() Error " + e);
        }
    };
    self.Get_Toggle_Switch_Individual_Switch_Info = async function (address_ID, switch_index) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }

            var result = null;

            if(address_info.target_network=="TCP/IP")
            {
                //result = await toggle_switch_api_mqtt.Get_Toggle_Switch_Individual_Switch_Info(address_ID, switch_index);
            }
            else if(address_info.target_network=="Zigbee")
            {
                var switch_info_obj = await toggle_switch_api_zigbee.Get_Toggle_Switch_Individual_Switch_Info(address_ID, switch_index);
                if(switch_info_obj==null)
                {
                    result = {
                        timeout: true,
                        username: 'everyone',
                        device_ID: address_ID
                    };
                }
                else{
                    result = Object.assign({},{
                        timeout: false,
                        username: 'everyone',
                        device_ID: address_ID
                    },switch_info_obj);
                }
            }

            return result;
        }
        catch (e) {
            debug("[Toggle_Switch_API] Get_Toggle_Switch_Individual_Switch_Info() Error " + e);
        }
    };
    self.Get_Toggle_Switch_All_Switch_Info = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }

            var result = null;

            if(address_info.target_network=="TCP/IP")
            {
                //result = await toggle_switch_api_mqtt.Get_Toggle_Switch_All_Switch_Info(address_ID);
            }
            else if(address_info.target_network=="Zigbee")
            {
                var switch_info_obj = await toggle_switch_api_zigbee.Get_Toggle_Switch_All_Switch_Info(address_ID);
                if(switch_info_obj==null)
                {
                    result = {
                        timeout: true,
                        username: 'everyone',
                        device_ID: address_ID
                    };
                }
                else{
                    result = Object.assign({},{
                        timeout: false,
                        username: 'everyone',
                        device_ID: address_ID
                    },switch_info_obj);
                }
            }

            return result;
        }
        catch (e) {
            debug("[Toggle_Switch_API] Get_Toggle_Switch_All_Switch_Info() Error " + e);
        }
    };
};

module.exports = Toggle_Switch_API;
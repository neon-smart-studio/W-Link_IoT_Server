
var debug = require('debug')(require('path').basename(__filename));

var Address_MGR = require('../../Util/Address_MGR.js');
var address_mgr = new Address_MGR();

var Scene_Switch_API_MQTT = require('../../MQTT/Device_MGMT/Accessories/Scene_Switch_API_MQTT.js');
var scene_switch_api_mqtt = new Scene_Switch_API_MQTT();

var Scene_Switch_API_Zigbee = require('../../Zigbee/Device_MGMT/Accessories/Scene_Switch_API_Zigbee.js');
var scene_switch_api_zigbee = new Scene_Switch_API_Zigbee();

var Scene_Switch_API = function () {
    var self = this;
    
    self.Get_Scene_Switch_Support_Actions = async function(username, address_ID)
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
                //result = await scene_switch_api_mqtt.Get_Scene_Switch_Support_Actions(username, address_ID);
            }
            else if(address_info.target_network=="Zigbee")
            {
                result = await scene_switch_api_zigbee.Get_Scene_Switch_Support_Actions(address_ID);
            }

            return result;
        }
        catch(e)
        {
          debug("[Scene_Switch_API] Get_Scene_Switch_Support_Actions() Error " + e);
        }
    };
    self.Get_Num_Of_Scene_Switch = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }
            
            var result = null;

            if(address_info.target_network=="TCP/IP")
            {
                result = await scene_switch_api_mqtt.Get_Num_Of_Scene_Switch(address_ID);
            }
            else if(address_info.target_network=="Zigbee")
            {
                var switch_info_obj = await scene_switch_api_zigbee.Get_Num_Of_Scene_Switch(address_ID);
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
            debug("[Scene_Switch_API] Get_Num_Of_Scene_Switch() Error " + e);
        }
    };
    self.Get_Scene_Switch_Individual_Switch_Info = async function (address_ID, switch_index) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }

            var result = null;

            if(address_info.target_network=="TCP/IP")
            {
                //result = await scene_switch_api_mqtt.Get_Scene_Switch_Individual_Switch_Info(address_ID, switch_index);
            }
            else if(address_info.target_network=="Zigbee")
            {
                var switch_info_obj = await scene_switch_api_zigbee.Get_Scene_Switch_Individual_Switch_Info(address_ID, switch_index);
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
            debug("[Scene_Switch_API] Get_Scene_Switch_Individual_Switch_Info() Error " + e);
        }
    };
    self.Get_Scene_Switch_All_Switch_Info = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }

            var result = null;

            if(address_info.target_network=="TCP/IP")
            {
                //result = await scene_switch_api_mqtt.Get_Scene_Switch_All_Switch_Info(address_ID);
            }
            else if(address_info.target_network=="Zigbee")
            {
                var switch_info_obj = await scene_switch_api_zigbee.Get_Scene_Switch_All_Switch_Info(address_ID);
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
            debug("[Scene_Switch_API] Get_Scene_Switch_All_Switch_Info() Error " + e);
        }
    };
};

module.exports = Scene_Switch_API;
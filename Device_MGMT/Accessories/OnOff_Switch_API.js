
var debug = require('debug')(require('path').basename(__filename));

var Address_MGR = require('../../Util/Address_MGR.js');
var address_mgr = new Address_MGR();

var OnOff_Switch_API_MQTT = require('../../MQTT/Device_MGMT/Accessories/OnOff_Switch_API_MQTT.js');
var onoff_switch_api_mqtt = new OnOff_Switch_API_MQTT();

var OnOff_Switch_API_Zigbee = require('../../Zigbee/Device_MGMT/Accessories/OnOff_Switch_API_Zigbee.js');
var onoff_switch_api_zigbee = new OnOff_Switch_API_Zigbee();


var OnOff_Switch_API = function () {
    var self = this;
    
    self.Get_OnOff_Switch_Support_Actions = async function(username, address_ID)
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
                //result = await onoff_switch_api_mqtt.Get_OnOff_Switch_Support_Actions(username, address_ID);
            }
            else if(address_info.target_network=="Zigbee")
            {
                result = await onoff_switch_api_zigbee.Get_OnOff_Switch_Support_Actions(address_ID);
            }

            return result;
        }
        catch(e)
        {
          debug("[OnOff_Switch_API] Get_OnOff_Switch_Support_Actions() Error " + e);
        }
    };
    self.Get_Num_Of_OnOff_Switch = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }
            
            var result = null;

            if(address_info.target_network=="TCP/IP")
            {
                result = await onoff_switch_api_mqtt.Get_Num_Of_OnOff_Switch(address_ID);
            }
            else if(address_info.target_network=="Zigbee")
            {
                result = await onoff_switch_api_zigbee.Get_Num_Of_OnOff_Switch(address_ID);
            }

            return result;
        }
        catch (e) {
            debug("[OnOff_Switch_API] Get_Num_Of_OnOff_Switch() Error " + e);
        }
    };
    self.Get_OnOff_Switch_Individual_Switch_Status = async function (address_ID, switch_index) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }
            
            var result = null;

            if(address_info.target_network=="TCP/IP")
            {
                result = await onoff_switch_api_mqtt.Get_OnOff_Switch_Individual_Switch_Status(address_ID, switch_index);
            }
            else if(address_info.target_network=="Zigbee")
            {
                result = await onoff_switch_api_zigbee.Get_OnOff_Switch_Individual_Switch_Status(address_ID, switch_index);
            }

            return result;
        }
        catch (e) {
            debug("[OnOff_Switch_API] Get_OnOff_Switch_Individual_Switch_Status() Error " + e);
        }
    };
    self.Get_OnOff_Switch_All_Switch_Status = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }
            
            var result = null;

            if(address_info.target_network=="TCP/IP")
            {
                result =  await onoff_switch_api_mqtt.Get_OnOff_Switch_All_Switch_Status(address_ID);
            }
            else if(address_info.target_network=="Zigbee")
            {
                result =  await onoff_switch_api_zigbee.Get_OnOff_Switch_All_Switch_Status(address_ID);
            }

            return result;
        }
        catch (e) {
            debug("[OnOff_Switch_API] Get_OnOff_Switch_All_Switch_Status() Error " + e);
        }
    };
};

module.exports = OnOff_Switch_API;
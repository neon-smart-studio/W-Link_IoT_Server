
var debug = require('debug')(require('path').basename(__filename));

var Address_MGR = require('../../Util/Address_MGR.js');
var address_mgr = new Address_MGR();

var Dimmable_Switch_API_MQTT = require('../../MQTT/Device_MGMT/Accessories/Dimmable_Switch_API_MQTT.js');
var dimmable_switch_api_mqtt = new Dimmable_Switch_API_MQTT();

var Dimmable_Switch_API_Zigbee = require('../../Zigbee/Device_MGMT/Accessories/Dimmable_Switch_API_Zigbee.js');
var dimmable_switch_api_zigbee = new Dimmable_Switch_API_Zigbee();

var Dimmable_Switch_API = function (){
    var self = this;

    self.Get_Dimmable_Switch_Support_Actions = async function(username, address_ID)
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
                //result = await dimmable_switch_api_mqtt.Get_Dimmable_Switch_Support_Actions(username, address_ID);
            }
            else if(address_info.target_network=="Zigbee")
            {
                result = await dimmable_switch_api_zigbee.Get_Dimmable_Switch_Support_Actions(address_ID);
            }

            return result;
        }
        catch(e)
        {
          debug("[Dimmable_Switch_API] Get_Dimmable_Switch_Support_Actions() Error " + e);
        }
    };
    self.Get_Num_Of_Dimmable_Switch = async function(address_ID)
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
                result = await dimmable_switch_api_mqtt.Get_Num_Of_Dimmable_Switch(address_ID);
            }
            else if(address_info.target_network=="Zigbee")
            {
                result = await dimmable_switch_api_zigbee.Get_Num_Of_Dimmable_Switch(address_ID);
            }

            return result;
        }
        catch(e)
        {
            debug("[Dimmable_Switch_API] Get_Num_Of_Dimmable_Switch() Error " + e);
        }
    };
    self.Get_Dimmable_Switch_Individual_Switch_Status = async function(address_ID, switch_index)
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
                result = await dimmable_switch_api_mqtt.Get_Dimmable_Switch_Individual_Switch_Status(address_ID, switch_index);
            }
            else if(address_info.target_network=="Zigbee")
            {
            }

            return result;
        }
        catch(e)
        {
            debug("[Dimmable_Switch_API] Get_Dimmable_Switch_Individual_Switch_Status() Error " + e);
        }
    };
    self.Get_Dimmable_Switch_All_Switch_Status = async function(address_ID)
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
                result = await dimmable_switch_api_mqtt.Get_Dimmable_Switch_All_Switch_Status(address_ID);
            }
            else if(address_info.target_network=="Zigbee")
            {
            }

            return result;
        }
        catch(e)
        {
            debug("[Dimmable_Switch_API] Get_Dimmable_Switch_All_Switch_Status() Error " + e);
        }
    };
};

module.exports = Dimmable_Switch_API;

var debug = require('debug')(require('path').basename(__filename));

var Address_MGR = require('../../Util/Address_MGR.js');
var address_mgr = new Address_MGR();

var Motion_Sensor_API_MQTT = require('../../MQTT/Device_MGMT/Accessories/Motion_Sensor_API_MQTT.js');
var motion_sensor_api_mqtt = new Motion_Sensor_API_MQTT();

var Motion_Sensor_API_Zigbee = require('../../Zigbee/Device_MGMT/Accessories/Motion_Sensor_API_Zigbee.js');
var motion_sensor_api_zigbee = new Motion_Sensor_API_Zigbee();

var Motion_Sensor_API = function () {
    var self = this;
    
    self.Get_Motion_Sensor_Support_Actions = async function(username, address_ID)
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
                //result = await motion_sensor_api_mqtt.Get_Motion_Sensor_Support_Actions(username, address_ID);
            }
            else if(address_info.target_network=="Zigbee")
            {
                result = await motion_sensor_api_zigbee.Get_Motion_Sensor_Support_Actions(address_ID);
            }

            return result;
        }
        catch(e)
        {
          debug("[Motion_Sensor_API] Get_Motion_Sensor_Support_Actions() Error " + e);
        }
    };
    self.Config_Motion_Sensor_Reaction_Time = async function (address_ID, sensor_index, reaction_time) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }
            
            var result = null;

            if(address_info.target_network=="TCP/IP")
            {
                //result = await motion_sensor_api_mqtt.Config_Motion_Sensor_Reaction_Time(address_ID, sensor_index, reaction_time);
            }
            else if(address_info.target_network=="Zigbee")
            {
                var sensor_info_obj = await motion_sensor_api_zigbee.Config_Motion_Sensor_Reaction_Time(address_ID, sensor_index, reaction_time);
                if(sensor_info_obj==null)
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
                    },sensor_info_obj);
                }
            }

            return result;
        }
        catch (e) {
            debug("[Motion_Sensor_API] Config_Motion_Sensor_Reaction_Time() Error " + e);
        }
    };
    self.Get_Motion_Sensor_Reaction_Time = async function (address_ID, sensor_index) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }
            
            var result = null;

            if(address_info.target_network=="TCP/IP")
            {
                //result = await motion_sensor_api_mqtt.Get_Motion_Sensor_Reaction_Time(address_ID, sensor_index);
            }
            else if(address_info.target_network=="Zigbee")
            {
                var sensor_info_obj = await motion_sensor_api_zigbee.Get_Motion_Sensor_Reaction_Time(address_ID, sensor_index);
                if(sensor_info_obj==null)
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
                    },sensor_info_obj);
                }
            }

            return result;
        }
        catch (e) {
            debug("[Motion_Sensor_API] Get_Motion_Sensor_Reaction_Time() Error " + e);
        }
    };
    self.Get_Num_Of_Motion_Sensor = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }
            
            var result = null;

            if(address_info.target_network=="TCP/IP")
            {
                result = await motion_sensor_api_mqtt.Get_Num_Of_Motion_Sensor(address_ID);
            }
            else if(address_info.target_network=="Zigbee")
            {
                var sensor_info_obj = await motion_sensor_api_zigbee.Get_Num_Of_Motion_Sensor(address_ID);
                if(sensor_info_obj==null)
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
                    },sensor_info_obj);
                }
            }

            return result;
        }
        catch (e) {
            debug("[Motion_Sensor_API] Get_Num_Of_Motion_Sensor() Error " + e);
        }
    };
    self.Get_Motion_Sensor_Individual_Sensor_Info = async function (address_ID, sensor_index) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }

            var result = null;

            if(address_info.target_network=="TCP/IP")
            {
                //result = await motion_sensor_api_mqtt.Get_Motion_Sensor_Individual_Sensor_Info(address_ID, sensor_index);
            }
            else if(address_info.target_network=="Zigbee")
            {
                var sensor_info_obj = await motion_sensor_api_zigbee.Get_Motion_Sensor_Individual_Sensor_Info(address_ID, sensor_index);
                if(sensor_info_obj==null)
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
                    },sensor_info_obj);
                }
            }

            return result;
        }
        catch (e) {
            debug("[Motion_Sensor_API] Get_Motion_Sensor_Individual_Sensor_Info() Error " + e);
        }
    };
    self.Get_Motion_Sensor_All_Sensor_Info = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }

            var result = null;

            if(address_info.target_network=="TCP/IP")
            {
                //result = await motion_sensor_api_mqtt.Get_Motion_Sensor_All_Sensor_Info(address_ID);
            }
            else if(address_info.target_network=="Zigbee")
            {
                var sensor_info_obj = await motion_sensor_api_zigbee.Get_Motion_Sensor_All_Sensor_Info(address_ID);
                if(sensor_info_obj==null)
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
                    },sensor_info_obj);
                }
            }

            return result;
        }
        catch (e) {
            debug("[Motion_Sensor_API] Get_Motion_Sensor_All_Sensor_Info() Error " + e);
        }
    };
};

module.exports = Motion_Sensor_API;
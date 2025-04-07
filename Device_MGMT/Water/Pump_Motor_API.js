
var debug = require('debug')(require('path').basename(__filename));

var Address_MGR = require('../../Util/Address_MGR.js');
var address_mgr = new Address_MGR();

var Pump_Motor_API_MQTT = require('../../MQTT/Device_MGMT/Water/Pump_Motor_API_MQTT.js');
var pump_motor_api_mqtt = new Pump_Motor_API_MQTT();

var Pump_Motor_API = function () {
    var self = this;
    
    self.Pump_Motor_Get_All_Status = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }
            
            var result = null;
            
            if(address_info.target_network=="TCP/IP")
            {
                result = await pump_motor_api_mqtt.Pump_Motor_Get_All_Status(address_ID);
            }
            else if(address_info.target_network=="Zigbee")
            {
            }

            return result;
        }
        catch (e) {
            debug("[Pump_Motor_API] Pump_Motor_Get_All_Status() Error " + e);
        }
    };
    self.Pump_Motor_Get_On_Off_Status = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }
            
            var result = null;
            
            if(address_info.target_network=="TCP/IP")
            {
                result = await pump_motor_api_mqtt.Pump_Motor_Get_On_Off_Status(address_ID);
            }
            else if(address_info.target_network=="Zigbee")
            {
            }

            return result;
        }
        catch (e) {
            debug("[Pump_Motor_API] Pump_Motor_Get_On_Off_Status() Error " + e);
        }
    };
    self.Pump_Motor_Get_Current_PWM_Level = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }
            
            var result = null;
            
            if(address_info.target_network=="TCP/IP")
            {
                result = await pump_motor_api_mqtt.Pump_Motor_Get_Current_PWM_Level(address_ID);
            }
            else if(address_info.target_network=="Zigbee")
            {
            }

            return result;
        }
        catch (e) {
            debug("[Pump_Motor_API] Pump_Motor_Get_Current_PWM_Level() Error " + e);
        }
    };
    self.Pump_Motor_Turn_On_Off = async function (address_ID, on_off) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            
            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    pump_motor_api_mqtt.Pump_Motor_Turn_On_Off(address_ID, on_off);
                }
                else if(address_info.target_network=="Zigbee")
                {
                }
            }
            else{
                pump_motor_api_mqtt.Pump_Motor_Turn_On_Off(address_ID, on_off);
            }
        }
        catch (e) {
            debug("[Pump_Motor_API] Pump_Motor_Turn_On_Off() Error " + e);
        }
    };
    self.Pump_Motor_Toggle_On_Off = async function (address_ID) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            if(address_info.target_type!="Device")
            {
                return null;
            }

            var result = null;
            
            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    pump_motor_api_mqtt.Pump_Motor_Toggle_On_Off(address_ID);
                }
            }
            else{
                pump_motor_api_mqtt.Pump_Motor_Toggle_On_Off(address_ID);
            }

            return result;
        }
        catch (e) {
            debug("[Pump_Motor_API] Pump_Motor_Toggle_On_Off() Error " + e);
        }
    };
    self.Pump_Motor_Set_PWM_Level = async function (address_ID, level) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            
            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    pump_motor_api_mqtt.Pump_Motor_Set_PWM_Level(address_ID, level);
                }
                else if(address_info.target_network=="Zigbee")
                {
                }
            }
            else{
                pump_motor_api_mqtt.Pump_Motor_Set_PWM_Level(address_ID, level);
            }
        }
        catch (e) {
            debug("[Pump_Motor_API] Pump_Motor_Set_PWM_Level() Error " + e);
        }
    };
    self.Pump_Motor_Step_PWM_Level_Up = async function (address_ID, step_lvl) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            
            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    pump_motor_api_mqtt.Pump_Motor_Step_PWM_Level_Up(address_ID, step_lvl);
                }
                else if(address_info.target_network=="Zigbee")
                {
                }
            }
            else{
                pump_motor_api_mqtt.Pump_Motor_Step_PWM_Level_Up(address_ID, step_lvl);
            }
        }
        catch (e) {
            debug("[Pump_Motor_API] Pump_Motor_Step_PWM_Level_Up() Error " + e);
        }
    };
    self.Pump_Motor_Step_PWM_Level_Down = async function (address_ID, step_lvl) {
        try {
            var address_info = await address_mgr.Read_Address_Info(address_ID);
            
            if(address_info.target_type=="Device")
            {
                if(address_info.target_network=="TCP/IP")
                {
                    pump_motor_api_mqtt.Pump_Motor_Step_PWM_Level_Down(address_ID, step_lvl);
                }
                else if(address_info.target_network=="Zigbee")
                {
                }
            }
            else{
                pump_motor_api_mqtt.Pump_Motor_Step_PWM_Level_Down(address_ID, step_lvl);
            }
        }
        catch (e) {
            debug("[Pump_Motor_API] Pump_Motor_Step_PWM_Level_Down() Error " + e);
        }
    };
};

module.exports = Pump_Motor_API;
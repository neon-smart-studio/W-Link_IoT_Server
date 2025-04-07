
var debug = require('debug')(require('path').basename(__filename));

var Zigbee = require('../../../Zigbee/Zigbee.js');
var zigbee = new Zigbee();

const Zigbee_OnOff_Socket_Max_Num = 1;

var OnOff_Socket_API_Zigbee = function () {
    var self = this;

    self.Get_Num_Of_OnOff_Socket = function (address_ID) {
        try {
            return {num_of_onoff_socket: Zigbee_OnOff_Socket_Max_Num};
        }
        catch (e) {
            debug("[OnOff_Socket_API_Zigbee] Get_Num_Of_OnOff_Socket() Error " + e);
        }
    };
    self.Get_OnOff_Socket_Individual_Socket_Status = async function (address_ID, socket_index) {
        try {
            if(socket_index>=Zigbee_OnOff_Socket_Max_Num)
            {
                return null;
            }

            var onoff_state = await zigbee.Zigbee_ReadAttribute(address_ID, "genOnOff", ["onOff"]);
            if(onoff_state==null)
            {
                return null;
            }

            return {
                socket_index: socket_index,
                on_off: onoff_state.onOff
            };;
        }
        catch (e) {
            debug("[OnOff_Socket_API_Zigbee] Get_OnOff_Socket_Individual_Socket_Status() Error " + e);
        }
    };
    self.Get_OnOff_Socket_All_Socket_Status = async function (address_ID) {
        try {
            var socket_status_list = [];
                
            var onoff_state = await zigbee.Zigbee_ReadAttribute(address_ID, "genOnOff", ["onOff"]);
            if(onoff_state==null)
            {
                return null;
            }

            socket_status_list.push({
                socket_index: 0,
                on_off: onoff_state.onOff
            });

            return {
                num_of_onoff_socket: Zigbee_OnOff_Socket_Max_Num,
                individual_socket_status: socket_status_list
            };
        }
        catch (e) {
            debug("[OnOff_Socket_API_Zigbee] Get_OnOff_Socket_All_Socket_Status() Error " + e);
        }
    };
    self.OnOff_Socket_Set_Individual_Socket_On_Off = async function (address_ID, socket_index, on_off) {
        try {
            if(socket_index!=0)
            {
                return;
            }

            if (on_off) {
                await zigbee.Zigbee_SendCommand(address_ID, "genOnOff", "on", {});
            }else{
                await zigbee.Zigbee_SendCommand(address_ID, "genOnOff", "off", {});
            }
        }
        catch (e) {
            debug("[OnOff_Socket_API_Zigbee] OnOff_Socket_Individual_Socket_On_Off() Error " + e);
        }
    };
    self.OnOff_Socket_Toggle_Individual_Socket_On_Off = async function (address_ID, socket_index) {
        try {
            if(socket_index!=0)
            {
                return;
            }

            await zigbee.Zigbee_SendCommand(address_ID, "genOnOff", "toggle", {});
        }
        catch (e) {
            debug("[OnOff_Socket_API_Zigbee] OnOff_Socket_Toggle_Individual_Socket_On_Off() Error " + e);
        }
    };
    self.OnOff_Socket_Set_All_Socket_On_Off = async function (address_ID, on_off) {
        try {
            if (on_off) {
                await zigbee.Zigbee_SendCommand(address_ID, "genOnOff", "on", {});
            }else{
                await zigbee.Zigbee_SendCommand(address_ID, "genOnOff", "off", {});
            }
        }
        catch (e) {
            debug("[OnOff_Socket_API_Zigbee] OnOff_Socket_All_Socket_On_Off() Error " + e);
        }
    };
    self.OnOff_Socket_Toggle_All_Socket_On_Off = async function (address_ID) {
        try {
            await zigbee.Zigbee_SendCommand(address_ID, "genOnOff", "toggle", {});
        }
        catch (e) {
            debug("[OnOff_Socket_API_Zigbee] OnOff_Socket_Toggle_All_Socket_On_Off() Error " + e);
        }
    };
};

module.exports = OnOff_Socket_API_Zigbee;
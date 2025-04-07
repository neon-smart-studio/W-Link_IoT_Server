
var debug = console.log;//require('debug')(require('path').basename(__filename));

var BLE = require('../../BLE.js');
var ble = new BLE();

var Color_Converter = require('../../../Util/Color_Converter.js');
var color_converter = new Color_Converter();

var xiaomi_bedside_lamp_status_list = [];

function Handle_Xiaomi_Bedside_Lamp_Status_Report(device_ID, data, isNotify) 
{
    try{
        if (data[0] != 0x43 || data[1] != 0x45) {
            return;
        }

        if(xiaomi_bedside_lamp_status_list[device_ID]==null)
        {
            xiaomi_bedside_lamp_status_list[device_ID] = {
                on_off: false,
                level: 0,
                hue: 0,
                sat: 0,
                cct: 0
            };
        }

        var on_off;
        var level;
        var hue = 0, sat = 0;
        var cct = 0;

        if (data[2] == 1)
        {
            on_off = true;
        }
        else{
            on_off = false;
        }

        level = data[8];

        xiaomi_bedside_lamp_status_list[device_ID].on_off = on_off;
        xiaomi_bedside_lamp_status_list[device_ID].level = level;

        switch (data[3]) {
            case 2: // "sunshine" aka white mode
                cct = (data[9] << 8) + (data[10] & 255);
                xiaomi_bedside_lamp_status_list[device_ID].cct = cct;
                break;
            case 1: // "color" mode
                var hsv = color_converter.RGB_To_HSV(data[4], data[5], data[6]);
                xiaomi_bedside_lamp_status_list[device_ID].hue = hsv.hue;
                xiaomi_bedside_lamp_status_list[device_ID].sat = hsv.sat;
                break;
            case 3:
                console.log("lamp entered flow mode");
                break;
        }
    }
    catch(e)
    {
        debug("[Xiaomi_Bedside_Lamp] Handle_Xiaomi_Bedside_Lamp_Status_Report() Error " + e);
    }
}

var Xiaomi_Bedside_Lamp = function (){
    var self = this;

    self.XIAOMI_BEDSIDE_LAMP_LIGHT_SERVICE = '8e2f0cbd1a664b53ace6b494e25f87bd';
    self.XIAOMI_BEDSIDE_LAMP_RW_CHARACTERISTICS = 'aa7d3f342d4f41e0807f52fbf8cf7443';
    self.XIAOMI_BEDSIDE_LAMP_NOTIFY_CHARACTERISTICS = '8f65073d9f574aaaafea397d19d5bbeb';
    
    self.Is_Xiaomi_Bedside_Lamp_Local_Name = function(localName)
    {
        try{
            if(localName==null)
            {
                return false;
            }

            var is_xiaomi_device = false;
            
            if (localName.indexOf("XMCTD_") >= 0) {
                is_xiaomi_device = true;
            }

            return is_xiaomi_device;
        }
        catch(e)
        {
            debug("[Xiaomi_Bedside_Lamp] Is_Xiaomi_Bedside_Lamp_Local_Name() Error " + e);
        }
    }

    self.Is_Xiaomi_Bedside_Lamp_Device = function(device_ID)
    {
        try{
            var localName = ble.BLE_Get_Device_Local_Name(device_ID);
            if(localName==null)
            {
                return false;
            }

            var is_xiaomi_device = self.Is_Xiaomi_Bedside_Lamp_Local_Name(localName);

            return is_xiaomi_device;
        }
        catch(e)
        {
            debug("[Xiaomi_Bedside_Lamp] Is_Xiaomi_Bedside_Lamp_Device() Error " + e);
        }
    }

    self.Get_Xiaomi_Bedside_Lamp_Device_Type = function()
    {
        try{
            return "Extended Color Light";
        }
        catch(e)
        {
            debug("[Xiaomi_Bedside_Lamp] Get_Xiaomi_Bedside_Lamp_Device_Type() Error " + e);
        }
    }

    self.On_Xiaomi_Bedside_Lamp_Connected = async function(device_ID, basic_device_info)
    {
        try{
            var success = false;

            success = await ble.BLE_Subscribe_Device_Characteristic(device_ID, 
                self.XIAOMI_BEDSIDE_LAMP_LIGHT_SERVICE,
                self.XIAOMI_BEDSIDE_LAMP_NOTIFY_CHARACTERISTICS);

            if(success==true)
            {
                var bleCmd = [];
                // 43 67 for auth
                bleCmd[0] = 0x43;
                bleCmd[1] = 0x67;
                // deadbeef as magic for our Pi
                bleCmd[2] = 0xde;
                bleCmd[3] = 0xad;
                bleCmd[4] = 0xbe;
                bleCmd[5] = 0xbf;

                await ble.BLE_Write_Characteristic_Data(device_ID, 
                    self.XIAOMI_BEDSIDE_LAMP_LIGHT_SERVICE,
                    self.XIAOMI_BEDSIDE_LAMP_RW_CHARACTERISTICS,
                    bleCmd);


                await ble.BLE_Setup_Device_Characteristic_Notify(device_ID,
                    self.XIAOMI_BEDSIDE_LAMP_LIGHT_SERVICE,
                    self.XIAOMI_BEDSIDE_LAMP_NOTIFY_CHARACTERISTICS,
                    function(data, isNotify) {
                        Handle_Xiaomi_Bedside_Lamp_Status_Report(device_ID, data, isNotify);
                    });
            }

            return success;
        }
        catch(e)
        {
            debug("[Xiaomi_Bedside_Lamp] On_Xiaomi_Bedside_Lamp_Connected() Error " + e);
        }
    }

    self.Xiaomi_Lamp_Set_OnOff = async function(device_ID, on_off)
    {
        try{
            var bleCmd = [];
            bleCmd[0] = 0x43;
            bleCmd[1] = 0x40;
            bleCmd[2] = on_off ? 0x01 : 0x02;

            var result = await ble.BLE_Write_Characteristic_Data(device_ID, 
                self.XIAOMI_BEDSIDE_LAMP_LIGHT_SERVICE,
                self.XIAOMI_BEDSIDE_LAMP_RW_CHARACTERISTICS,
                bleCmd);

            return result;
        }
        catch(e)
        {
            debug("[Xiaomi_Bedside_Lamp] Xiaomi_Lamp_Set_OnOff() Error " + e);
        }
    }

    self.Xiaomi_Lamp_Set_Bright = async function(device_ID, val)
    {
        try{
            var bleCmd = [];
            bleCmd[0] = 0x43;
            bleCmd[1] = 0x42;
            bleCmd[2] = parseInt(val.toString(16), 16);

            var result = await ble.BLE_Write_Characteristic_Data(device_ID, 
                self.XIAOMI_BEDSIDE_LAMP_LIGHT_SERVICE,
                self.XIAOMI_BEDSIDE_LAMP_RW_CHARACTERISTICS,
                bleCmd);

            return result;
        }
        catch(e)
        {
            debug("[Xiaomi_Bedside_Lamp] Xiaomi_Lamp_Set_Bright() Error " + e);
        }
    }

    self.Xiaomi_Lamp_Set_Hue_Sat = async function (device_ID, hue, sat) 
    {
        try{
            var bleCmd = [];

            rgb = color_converter.HSV_To_RGB(parseFloat(hue/360), parseFloat(sat/100), 1);

            bleCmd[0] = 0x43;
            bleCmd[1] = 0x41;
            bleCmd[2] = parseInt(rgb.r.toString(16), 16);
            bleCmd[3] = parseInt(rgb.g.toString(16), 16);
            bleCmd[4] = parseInt(rgb.b.toString(16), 16);
            bleCmd[5] = 0xFF;
            bleCmd[6] = 0x65;

            var result = await ble.BLE_Write_Characteristic_Data(device_ID, 
                self.XIAOMI_BEDSIDE_LAMP_LIGHT_SERVICE,
                self.XIAOMI_BEDSIDE_LAMP_RW_CHARACTERISTICS,
                bleCmd);

            return result;
        }
        catch(e)
        {
            debug("[Xiaomi_Bedside_Lamp] Xiaomi_Lamp_Set_Hue_Sat() Error " + e);
        }
    }

    self.Xiaomi_Lamp_Set_ColorTemperature = async function(device_ID, cct)
    {
        try{
            var bleCmd = [];
            
            bleCmd[0] = 0x43;
            bleCmd[1] = 0x43;
            bleCmd[2] = cct >> 8;
            bleCmd[3] = cct & 255;
            bleCmd[4] = 0x00; // don't set a brightness

            var result = await ble.BLE_Write_Characteristic_Data(device_ID, 
                self.XIAOMI_BEDSIDE_LAMP_LIGHT_SERVICE,
                self.XIAOMI_BEDSIDE_LAMP_RW_CHARACTERISTICS,
                bleCmd);

            return result;
        }
        catch(e)
        {
            debug("[Xiaomi_Bedside_Lamp] Xiaomi_Lamp_Set_ColorTemperature() Error " + e);
        }
    }
};
module.exports = Xiaomi_Bedside_Lamp;

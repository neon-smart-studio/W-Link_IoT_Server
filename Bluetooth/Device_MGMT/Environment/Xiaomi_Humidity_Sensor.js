
var debug = console.log;//require('debug')(require('path').basename(__filename));

var BLE = require('../../BLE.js');
var ble = new BLE();

const xiaomi_humidity_sensor_local_name_list = ["LYWSDCGQ", "LYWSD02", "LYWSD02_0042"]

var Xiaomi_Humidity_Sensor = function (){
    var self = this;

    self.XIAOMI_HUMIDITY_SENSOR_SENSE_SERVICE = 'ebe0ccb07a0a4b0c8a1a6ff2997da3a6';
    self.XIAOMI_HUMIDITY_SENSOR_UNIT_CHARACTERISTICS = 'ebe0ccbe7a0a4b0c8a1a6ff2997da3a6';
    self.XIAOMI_HUMIDITY_SENSOR_HISTORY_CHARACTERISTICS = 'ebe0ccbc7a0a4b0c8a1a6ff2997da3a6';
    self.XIAOMI_HUMIDITY_SENSOR_TIME_CHARACTERISTICS = 'ebe0ccb77a0a4b0c8a1a6ff2997da3a6';
    self.XIAOMI_HUMIDITY_SENSOR_DATA_CHARACTERISTICS = 'ebe0ccc17a0a4b0c8a1a6ff2997da3a6';
    self.XIAOMI_HUMIDITY_SENSOR_BATTERY_CHARACTERISTICS = 'ebe0ccc47a0a4b0c8a1a6ff2997da3a6';
    
    self.Is_Xiaomi_Humidity_Sensor_Local_Name = function(localName)
    {
        try{
            if(localName==null)
            {
                return false;
            }

            var is_xiaomi_device = false;
            
            for(var i = 0; i<xiaomi_humidity_sensor_local_name_list.length; i++)
            {
                if (localName == xiaomi_humidity_sensor_local_name_list[i]) {
                    is_xiaomi_device = true;
                }
            }

            return is_xiaomi_device;
        }
        catch(e)
        {
            debug("[Xiaomi_Humidity_Sensor] Is_Xiaomi_Humidity_Sensor_Local_Name() Error " + e);
        }
    }

    self.Is_Xiaomi_Humidity_Sensor_Device = function(device_ID)
    {
        try{
            var localName = ble.BLE_Get_Device_Local_Name(device_ID);
            if(localName==null)
            {
                return false;
            }

            var is_xiaomi_device = self.Is_Xiaomi_Humidity_Sensor_Local_Name(localName);

            return is_xiaomi_device;
        }
        catch(e)
        {
            debug("[Xiaomi_Humidity_Sensor] Is_Xiaomi_Humidity_Sensor_Device() Error " + e);
        }
    }

    self.Get_Xiaomi_Humidity_Sensor_Device_Type = function()
    {
        try{
            return "Humidity Sensor";
        }
        catch(e)
        {
            debug("[Xiaomi_Humidity_Sensor] Get_Xiaomi_Humidity_Sensor_Device_Type() Error " + e);
        }
    }

    self.On_Xiaomi_Humidity_Sensor_Connected = async function(device_ID, basic_device_info)
    {
        try{
            var success = true;

            success = await ble.BLE_Subscribe_Device_Characteristic(device_ID, 
                self.XIAOMI_HUMIDITY_SENSOR_SENSE_SERVICE,
                self.XIAOMI_HUMIDITY_SENSOR_DATA_CHARACTERISTICS);

            await ble.BLE_Setup_Device_Characteristic_Notify(device_ID,
                self.XIAOMI_HUMIDITY_SENSOR_SENSE_SERVICE,
                self.XIAOMI_HUMIDITY_SENSOR_DATA_CHARACTERISTICS,
                function(data, isNotify) {
                    console.log("[Xiaomi_Humidity_Sensor] On_Xiaomi_Humidity_Sensor_Connected() data: " + JSON.stringify(data));
                });

            return success;
        }
        catch(e)
        {
            debug("[Xiaomi_Humidity_Sensor] On_Xiaomi_Humidity_Sensor_Connected() Error " + e);
        }
    }
};
module.exports = Xiaomi_Humidity_Sensor;

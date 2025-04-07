var debug = require('debug')(require('path').basename(__filename));

var BLE = require('../BLE.js');
var ble = new BLE();

var Battery_Service = function () {
  var self = this;

  self.BATTERY_SERVICE_UUID            = '180f';
  self.BATTERY_LEVEL_UUID              = '2a19';

  self.Read_Battery_Level = async function(device_ID) {
    try {
      var battery_lvl = await ble.BLE_Read_UInt8_Characteristic(device_ID, self.BATTERY_SERVICE_UUID, self.BATTERY_LEVEL_UUID);
      if(battery_lvl==null)
      {
        return null;
      }
      return battery_lvl;
    }
    catch (e) {
        debug("[Battery_Service] Read_Battery_Level() Error " + e);
    };
  };
  
  self.Setup_Notify_Battery_Level_Change = async function(device_ID, on_notify_battery_lvl_change_cb) {
    try {
      var result = await ble.BLE_Setup_Device_Characteristic_Notify(device_ID,
        self.BATTERY_SERVICE_UUID,
        self.BATTERY_LEVEL_UUID,
        on_notify_battery_lvl_change_cb);
      return result;
    }
    catch (e) {
        debug("[Battery_Service] Setup_Notify_Battery_Level_Change() Error " + e);
    };
  };
  
  self.Cancel_Notify_Battery_Level_Change = async function(device_ID) {
    try {
      var result = await ble.BLE_Cancel_Device_Characteristic_Notify(device_ID,
        self.BATTERY_SERVICE_UUID,
        self.BATTERY_LEVEL_UUID);
      return result;
    }
    catch (e) {
        debug("[Battery_Service] Cancel_Notify_Battery_Level_Change() Error " + e);
    };
  };
}

module.exports = Battery_Service;

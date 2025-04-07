var debug = require('debug')(require('path').basename(__filename));

var BLE = require('../BLE.js');
var ble = new BLE();

var Device_Information_Service = function () {
  var self = this;

  self.DEVICE_INFORMATION_SERVICE_UUID     = '180a';
  self.SYSTEM_ID_UUID                      = '2a23';
  self.MODEL_NUMBER_UUID                   = '2a24';
  self.SERIAL_NUMBER_UUID                  = '2a25';
  self.FIRMWARE_REVISION_UUID              = '2a26';
  self.HARDWARE_REVISION_UUID              = '2a27';
  self.SOFTWARE_REVISION_UUID              = '2a28';
  self.MANUFACTURER_NAME_UUID              = '2a29';

  self.Read_System_ID = async function(device_ID) {
    try {
      var read_sys_id_data = await ble.BLE_Read_Characteristic_Data(device_ID, self.DEVICE_INFORMATION_SERVICE_UUID, self.SYSTEM_ID_UUID);
      if(read_sys_id_data==null)
      {
        return null;
      }

      var systemId = read_sys_id_data.toString('hex').match(/.{1,2}/g).reverse().join(':');

      return systemId;
    }
    catch (e) {
        debug("[Device_Information_Service] Read_System_ID() Error " + e);
    };
  }

  self.Read_Model_Number = async function(device_ID) {
    try {
      var model_num_str = await ble.BLE_Read_String_Characteristic(device_ID, self.DEVICE_INFORMATION_SERVICE_UUID, self.MODEL_NUMBER_UUID);
      if(model_num_str==null)
      {
        return null;
      }
      return model_num_str;
    }
    catch (e) {
        debug("[Device_Information_Service] Read_Model_Number() Error " + e);
    };
  }

  self.Read_Serial_Number = async function(device_ID) {
    try {
      var serial_num_str = await ble.BLE_Read_String_Characteristic(device_ID, self.DEVICE_INFORMATION_SERVICE_UUID, self.SERIAL_NUMBER_UUID);
      if(serial_num_str==null)
      {
        return null;
      }
      return serial_num_str;
    }
    catch (e) {
        debug("[Device_Information_Service] Read_Serial_Number() Error " + e);
    };
  }

  self.Read_Firmware_Revision = async function(device_ID) {
    try {
      var fw_rev_str = await ble.BLE_Read_String_Characteristic(device_ID, self.DEVICE_INFORMATION_SERVICE_UUID, self.FIRMWARE_REVISION_UUID);
      if(fw_rev_str==null)
      {
        return null;
      }
      return fw_rev_str;
    }
    catch (e) {
        debug("[Device_Information_Service] Read_Firmware_Revision() Error " + e);
    };
  }
  
  self.Read_Hardware_Revision = async function(device_ID) {
    try {
      var hw_rev_str = await ble.BLE_Read_String_Characteristic(device_ID, self.DEVICE_INFORMATION_SERVICE_UUID, self.HARDWARE_REVISION_UUID);
      if(hw_rev_str==null)
      {
        return null;
      }
      return hw_rev_str;
    }
    catch (e) {
        debug("[Device_Information_Service] Read_Hardware_Revision() Error " + e);
    };
  }
  
  self.Read_Software_Revision = async function(device_ID) {
    try {
      var sw_rev_str = await ble.BLE_Read_String_Characteristic(device_ID, self.DEVICE_INFORMATION_SERVICE_UUID, self.SOFTWARE_REVISION_UUID);
      if(sw_rev_str==null)
      {
        return null;
      }
      return sw_rev_str;
    }
    catch (e) {
        debug("[Device_Information_Service] Read_Software_Revision() Error " + e);
    };
  }
  
  self.Read_Manufacturer_Name = async function(device_ID) {
    try {
      var manu_name_str = await ble.BLE_Read_String_Characteristic(device_ID, self.DEVICE_INFORMATION_SERVICE_UUID, self.MANUFACTURER_NAME_UUID);
      if(manu_name_str==null)
      {
        return null;
      }
      return manu_name_str;
    }
    catch (e) {
        debug("[Device_Information_Service] Read_Manufacturer_Name() Error " + e);
    };
  }
}

module.exports = Device_Information_Service;

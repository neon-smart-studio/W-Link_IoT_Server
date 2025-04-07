var debug = require('debug')(require('path').basename(__filename));

var BLE = require('../BLE.js');
var ble = new BLE();

function do_Convert_Measument(data)
{
  var flags = data.readUInt8(0);

  if (flags & 0x01) {
    // uint16
    return data.readUInt16LE(1);
  } else {
    // uint8
    return data.readUInt8(1);
  }
};

var Heart_Rate_Measument_Service = function () {
  var self = this;

  self.HEART_RATE_MEASUREMENT_SERVICE_UUID = '180d';
  self.MEASUREMENT_UUID                    = '2a37';
  self.BODY_SENSOR_LOCATION_UUID           = '2a38';
  self.CONTROL_POINT_UUID                  = '2a39';

  self.Read_Body_Sensor_Location = async function(device_ID) {
    try {
      var read_location = await ble.BLE_Read_UInt8_Characteristic(device_ID, self.HEART_RATE_MEASUREMENT_SERVICE_UUID, self.BODY_SENSOR_LOCATION_UUID);
      if(read_location==null)
      {
        return null;
      }
      return read_location;
    }
    catch (e) {
        debug("[Heart_Rate_Measument_Service] Read_Body_Sensor_Location() Error " + e);
    };
  };
  
  self.Write_Control_Point = async function(device_ID, ctrl_point_data) {
    try {
      var result = await ble.BLE_Write_UInt8_Characteristic(device_ID,
        self.HEART_RATE_MEASUREMENT_SERVICE_UUID,
        self.CONTROL_POINT_UUID,
        ctrl_point_data);
      return result;
    }
    catch (e) {
        debug("[Heart_Rate_Measument_Service] Write_Control_Point() Error " + e);
    };
  };
  
  self.Setup_Notify_Measument = async function(device_ID, on_notify_measurement_cb) {
    try {
      var result = await ble.BLE_Setup_Device_Characteristic_Notify(device_ID,
        self.HEART_RATE_MEASUREMENT_SERVICE_UUID,
        self.MEASUREMENT_UUID,
        on_notify_measurement_cb);
      return result;
    }
    catch (e) {
        debug("[Heart_Rate_Measument_Service] Setup_Notify_Measument() Error " + e);
    };
  };
  
  self.Cancel_Notify_Measument = async function(device_ID) {
    try {
      var result = await ble.BLE_Cancel_Device_Characteristic_Notify(device_ID,
        self.HEART_RATE_MEASUREMENT_SERVICE_UUID,
        self.MEASUREMENT_UUID);
      return result;
    }
    catch (e) {
        debug("[Heart_Rate_Measument_Service] Cancel_Notify_Measument() Error " + e);
    };
  };
  
  self.Read_Measurement = async function(device_ID) {
    try {
      var read_ms_dat = await ble.BLE_Read_Characteristic_Data(device_ID, self.HEART_RATE_MEASUREMENT_SERVICE_UUID, self.MEASUREMENT_UUID);
      if(read_ms_dat==null)
      {
        return null;
      }
      return do_Convert_Measument(read_ms_dat);
    }
    catch (e) {
        debug("[Heart_Rate_Measument_Service] Read_Measurement() Error " + e);
    };
  };
}

module.exports = Heart_Rate_Measument_Service;
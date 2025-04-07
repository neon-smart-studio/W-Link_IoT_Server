// Example express application adding the parse-server module to expose Parse
// compatible API routes.
var debug = console.log;//require('debug')(require('path').basename(__filename));

var BLE_Core = require('./BLE_Core.js');
var ble_core = new BLE_Core();

var ble_discover_duration_timer = null;
var ble_discover_result_keep_timer = null;

var on_Device_Discovered_Callback = null;
var on_Device_Connected_Callback = null;
var on_Device_Disconnected_Callback = null;

var ble_discovered_device_list = [];
var ble_connected_device_list = [];

const ble_discovered_result_buffer_keep_time = 30000;

async function Handle_Discovered_BLE_Device(peripheral_dev_info)
{
    try {
        var device_index = -1;
        for(var i = 0; i<ble_discovered_device_list.length; i++)
        {
            if(ble_discovered_device_list[i].id==peripheral_dev_info.id)
            {
                device_index = i;
                break;
            }
        }

        if(device_index<0)
        {
            device_index = ble_discovered_device_list.length;
            ble_discovered_device_list.push({
                id: peripheral_dev_info.id,
                peripheral_info: peripheral_dev_info,
                characteristics: []
            });
        }
        else{
            ble_discovered_device_list[device_index].peripheral_info = peripheral_dev_info;
        }
        
        if(on_Device_Discovered_Callback!=null)
        {
            on_Device_Discovered_Callback(peripheral_dev_info.id, peripheral_dev_info);
        }
    }
    catch (e) {
        debug("[BLE] Handle_Discovered_BLE_Device() Error " + e);
    };
}

var BLE = function () {
    var self = this;

    self.GENERIC_ACCESS_UUID    = '1800';
    self.DEVICE_NAME_UUID       = '2a00';
    
    self.BLE_Register_Callbacks = function(onDeviceDiscoveredCB, onDeviceConnectedCB, onDeviceDisconnectedCB)
    {
        on_Device_Discovered_Callback = onDeviceDiscoveredCB;
        on_Device_Connected_Callback = onDeviceConnectedCB;
        on_Device_Disconnected_Callback = onDeviceDisconnectedCB;
    }

    self.BLE_Start = async function () {
        try {
            if(ble_discover_duration_timer!=null)
            {
                return false;
            }
            
            var init_success = await ble_core.BLE_Core_Init();
            if(init_success==false)
            {
                return false;
            }

            return true;
        }
        catch (e) {
            debug("[BLE] BLE_Start() Error " + e);
        };
    };

    self.BLE_Discover_Device = async function (discover_time_ms) {
        try {
            if(ble_discover_duration_timer==null)
            {
                return false;
            }

            ble_discovered_device_list = [];
            
            ble_core.BLE_Start_Descovery_Device(Handle_Discovered_BLE_Device);

            clearTimeout(ble_discover_duration_timer);
            ble_discover_duration_timer = null;
            clearTimeout(ble_discover_result_keep_timer);
            ble_discover_result_keep_timer = null;

            ble_discover_duration_timer = setTimeout(function(){

                ble_discover_duration_timer = null;

                ble_core.BLE_Stop_Descovery_Device();

                ble_discover_result_keep_timer = setTimeout(function(){

                    ble_discover_result_keep_timer = null;

                    ble_discovered_device_list = [];
                    
                }, ble_discovered_result_buffer_keep_time);
                
            }, discover_time_ms);
            
            return true;
        }
        catch (e) {
            debug("[BLE] BLE_Discover_Device() Error " + e);
        };
    }

    self.BLE_Get_Discover_Result = function () {
        try {
            var ble_discovering_state;

            if(ble_discover_duration_timer==null && 
                ble_discover_result_keep_timer==null)
                {
                    ble_discovering_state = "Idle";
                }
            else if(ble_discover_duration_timer==null && 
                ble_discover_result_keep_timer!=null)
                {
                    ble_discovering_state = "Done";
                }
            else if(ble_discover_duration_timer!=null && 
                ble_discover_result_keep_timer==null)
                {
                    ble_discovering_state = "Discovering";
                }
            else{
                ble_discovering_state = "Unknown";
            }

            return {
                ststus: ble_discovering_state,
                discovered_device_list: ble_discovered_device_list
            }
        }
        catch (e) {
            debug("[BLE] BLE_Get_Discover_Result() Error " + e);
        };
    }

    self.BLE_Stop = function () {
        try {
            if(ble_discover_duration_timer==null)
            {
                return false;
            }
            
            clearTimeout(ble_discover_duration_timer);
            ble_discover_duration_timer = null;
            clearTimeout(ble_discover_result_keep_timer);
            ble_discover_result_keep_timer = null;
            
            ble_core.BLE_Stop_Descovery_Device();

            ble_core.BLE_Core_DeInit();
            
            return true;
        }
        catch (e) {
            debug("[BLE] BLE_Stop() Error " + e);
        };
    };

    self.BLE_Connect_To_Device = async function (device_ID) {
        try {
            var device_index = -1;

            for(var i = 0; i<ble_discovered_device_list.length; i++)
            {
                if(ble_discovered_device_list[i].id==device_ID)
                {
                    device_index = i;
                    break;
                }
            }
            
            if(device_index<0)
            {
                return false;
            }
            
            var peripheral_dev_info = ble_discovered_device_list[device_index];

            if(peripheral_dev_info.state!="connected")
            {
                var conn_dev_result = await ble_core.BLE_Connect_To_Device(peripheral_dev_info, function(){
                    if(on_Device_Disconnected_Callback!=null)
                    {
                        on_Device_Disconnected_Callback(device_ID, peripheral_dev_info);
                    }
                });
                if(conn_dev_result==false)
                {
                    return false;
                }
    
                device_index = -1;
                for(var i = 0; i<ble_connected_device_list.length; i++)
                {
                    if(ble_connected_device_list[i].id==device_ID)
                    {
                        device_index = i;
                        break;
                    }
                }
    
                if(device_index<0)
                {
                    device_index = ble_connected_device_list.length;
                    ble_connected_device_list.push({
                        id: device_ID,
                        peripheral_info: peripheral_dev_info,
                        characteristics: []
                    });
                }
                else{
                    ble_connected_device_list[device_index].peripheral_info = peripheral_dev_info;
                }
                
                var all_service_and_characteristics = await ble_core.BLE_Discover_Device_All_Services_And_Characteristics(peripheral_dev_info);
                if(all_service_and_characteristics!=null)
                {
                    var dev_characteristics_list = ble_connected_device_list[device_index].characteristics;
                    
                    var service_uuid;
                    var all_services = all_service_and_characteristics.services;
                    var all_characteristics = all_service_and_characteristics.characteristics;

                    for(var i = 0; i<all_services.length; i++)
                    {
                        service_uuid = all_services[i].uuid;
                        dev_characteristics_list[service_uuid] = all_services[i];
                    }
                    for(var i = 0; i<all_characteristics.length; i++)
                    {
                        service_uuid = all_characteristics[i].serviceUUID;
                        if(dev_characteristics_list[service_uuid]!=null)
                        {
                            var characteristic_uuid = all_characteristics[i].uuid;
                            dev_characteristics_list[service_uuid][characteristic_uuid] = all_characteristics[i];
                        }
                    }

                    ble_connected_device_list[device_index].characteristics = dev_characteristics_list;
                }
                
                if(on_Device_Connected_Callback!=null)
                {
                    on_Device_Connected_Callback(device_ID, peripheral_dev_info);
                }

                return true;
            }
            return false;
        }
        catch (e) {
            debug("[BLE] BLE_Connect_To_Device() Error " + e);
        };
    };

    self.BLE_Disconnect_From_Device = function (device_ID) {
        try {
            var device_index = -1;
            for(var i = 0; i<ble_connected_device_list.length; i++)
            {
                if(ble_connected_device_list[i].id==device_ID)
                {
                    device_index = i;
                    break;
                }
            }
            
            if(device_index<0)
            {
                return false;
            }
            
            var peripheral_dev_info = ble_connected_device_list[device_index];
            
            if(peripheral_dev_info.state=="connected")
            {
                ble_core.BLE_Disconnect_From_Device(peripheral_dev_info);
    
                delete ble_connected_device_list[device_index];
    
                if(on_Device_Disconnected_Callback!=null)
                {
                    on_Device_Disconnected_Callback(device_ID, peripheral_dev_info);
                }

                return true;
            }
            return false;
        }
        catch (e) {
            debug("[BLE] BLE_Disconnect_From_Device() Error " + e);
        };
    };

    self.BLE_Get_Device_Local_Name = function (device_ID) {
        try {
            var device_index = -1;
            for(var i = 0; i<ble_connected_device_list.length; i++)
            {
                if(ble_connected_device_list[i].id==device_ID)
                {
                    device_index = i;
                    break;
                }
            }

            if(device_index<0)
            {
                return null;
            }

            return ble_connected_device_list[device_index].peripheral_dev_info.advertisement.localName;
        }
        catch (e) {
            debug("[BLE] BLE_Get_Device_Local_Name() Error " + e);
        };
    };

    self.BLE_Device_Discover_Single_Service = async function (device_ID, service_Uuid) {
        try {
            var device_index = -1;
            for(var i = 0; i<ble_connected_device_list.length; i++)
            {
                if(ble_connected_device_list[i].id==device_ID)
                {
                    device_index = i;
                    break;
                }
            }

            if(device_index<0)
            {
                return null;
            }

            var peripheral_dev_info = ble_connected_device_list[device_index].peripheral_info;

            var changed = false;
            
            var dev_characteristics_list = ble_connected_device_list[device_index].characteristics;
            
            if(dev_characteristics_list[service_Uuid]==null)
            {
                var service_obj_array = await ble_core.BLE_Discover_Device_Specific_Services(peripheral_dev_info, [service_Uuid]);
                if(service_obj_array==null)
                {
                    return null;
                }

                changed = true;
                dev_characteristics_list[service_Uuid] = service_obj_array[0];
            }

            if(changed==true)
            {
                ble_connected_device_list[device_index].characteristics = dev_characteristics_list;
            }

            return dev_characteristics_list[service_Uuid];
        }
        catch (e) {
            debug("[BLE] BLE_Device_Discover_Single_Service() Error " + e);
        };
    }
    
    self.BLE_Device_Discover_Single_Characteristic = async function (device_ID, service_obj, characteristic_Uuid) {
        try {
            if(service_obj==null)
            {
                return null;
            }

            var device_index = -1;
            for(var i = 0; i<ble_connected_device_list.length; i++)
            {
                if(ble_connected_device_list[i].id==device_ID)
                {
                    device_index = i;
                    break;
                }
            }

            if(device_index<0)
            {
                return null;
            }
            
            var changed = false;
            var service_Uuid = service_obj.uuid;
            
            var dev_characteristics_list = ble_connected_device_list[device_index].characteristics;

            if(dev_characteristics_list[service_Uuid]==null)
            {
                return null;
            }
            
            if(dev_characteristics_list[service_Uuid][characteristic_Uuid]==null)
            {
                var characteristics_obj_array = await ble_core.BLE_Discover_Device_Specific_Service_Characteristics(service_obj, [characteristic_Uuid]);
                if(characteristics_obj_array==null)
                {
                    return null;
                }

                changed = true;
                dev_characteristics_list[service_Uuid][characteristic_Uuid] = characteristics_obj_array[0];
            }

            if(changed==true)
            {
                ble_connected_device_list[device_index].characteristics = dev_characteristics_list;
            }

            return dev_characteristics_list[service_Uuid][characteristic_Uuid];
        }
        catch (e) {
            debug("[BLE] BLE_Device_Discover_Single_Characteristic() Error " + e);
        };
    };

    self.BLE_Device_Discover_Multiple_Characteristics = async function (device_ID, service_obj, characteristic_Uuid_array) {
        try {
            if(service_obj==null)
            {
                return null;
            }

            if(characteristic_Uuid_array==null)
            {
                return null;
            }

            var device_index = -1;
            for(var i = 0; i<ble_connected_device_list.length; i++)
            {
                if(ble_connected_device_list[i].id==device_ID)
                {
                    device_index = i;
                    break;
                }
            }

            if(device_index<0)
            {
                return null;
            }

            var dev_characteristics_list = ble_connected_device_list[device_index].characteristics;
            
            if(dev_characteristics_list[service_Uuid]==null)
            {
                return null;
            }
            
            var characteristics_obj_array = await ble_core.BLE_Discover_Device_Specific_Service_Characteristics(service_obj, characteristic_Uuid_array);
            if(characteristics_obj_array==null)
            {
                return null;
            }

            var changed = false;

            for(var i = 0; i<characteristic_Uuid_array.length; i++)
            {
                if(dev_characteristics_list[service_Uuid][characteristic_Uuid_array[i]]==null)
                {
                    changed = true;
                    dev_characteristics_list[service_Uuid][characteristic_Uuid_array[i]] = characteristics_obj_array[i];
                }
            }

            if(changed==true)
            {
                ble_connected_device_list[device_index].characteristics = dev_characteristics_list;
            }

            return characteristics_obj_array[0];
        }
        catch (e) {
            debug("[BLE] BLE_Device_Discover_Multiple_Characteristics() Error " + e);
        };
    };

    self.BLE_Subscribe_Device_Characteristic = async function (device_ID, service_Uuid, characteristic_Uuid) {
        try {
            var service_obj = await self.BLE_Device_Discover_Single_Service(device_ID, service_Uuid)
            if(service_obj==null)
            {
                return false;
            }
            var characteristic_obj = await self.BLE_Device_Discover_Single_Characteristic(device_ID, service_obj, characteristic_Uuid)
            if(characteristic_obj==null)
            {
                return false;
            }

            var success = false;

            const do_ble_subscribe_device_service_characteristics = function(){
                return new Promise(resolve => {
                    ble_core.BLE_Subscribe_Device_Service_Characteristics(characteristic_obj, function(error) {
                            if(error){
                                success = false;
                                resolve();
                            }

                            success = true;

                            resolve();
                        }
                    );
                });
            }
            
            await do_ble_subscribe_device_service_characteristics();

            return success;
        }
        catch (e) {
            debug("[BLE] BLE_Subscribe_Device_Characteristic() Error " + e);
        };
    };

    self.BLE_Unsubscribe_Device_Characteristic = async function (device_ID, service_Uuid, characteristic_Uuid, on_unsubscribe_callback) {
        try {
            var service_obj = await self.BLE_Device_Discover_Single_Service(device_ID, service_Uuid)
            if(service_obj==null)
            {
                return false;
            }
            var characteristic_obj = await self.BLE_Device_Discover_Single_Characteristic(device_ID, service_obj, characteristic_Uuid)
            if(characteristic_obj==null)
            {
                return false;
            }

            ble_core.BLE_Unsubscribe_Device_Service_Characteristics(characteristic_obj, on_unsubscribe_callback);

            return true;
        }
        catch (e) {
            debug("[BLE] BLE_Unsubscribe_Device_Characteristic() Error " + e);
        };
    };

    self.BLE_Setup_Device_Characteristic_Notify = async function (device_ID, service_Uuid, characteristic_Uuid, on_notify_callback) {
        try {
            var service_obj = await self.BLE_Device_Discover_Single_Service(device_ID, service_Uuid)
            if(service_obj==null)
            {
                return false;
            }
            var characteristic_obj = await self.BLE_Device_Discover_Single_Characteristic(device_ID, service_obj, characteristic_Uuid)
            if(characteristic_obj==null)
            {
                return false;
            }

            ble_core.BLE_Setup_Device_Service_Characteristics_Notify(characteristic_obj, on_notify_callback);

            return true;
        }
        catch (e) {
            debug("[BLE] BLE_Setup_Device_Characteristic_Notify() Error " + e);
        };
    };

    self.BLE_Cancel_Device_Characteristic_Notify = async function (device_ID, service_Uuid, characteristic_Uuid) {
        try {
            var service_obj = await self.BLE_Device_Discover_Single_Service(device_ID, service_Uuid)
            if(service_obj==null)
            {
                return false;
            }
            var characteristic_obj = await self.BLE_Device_Discover_Single_Characteristic(device_ID, service_obj, characteristic_Uuid)
            if(characteristic_obj==null)
            {
                return false;
            }

            ble_core.BLE_Cancel_Device_Service_Characteristics_Notify(characteristic_obj);

            return true;
        }
        catch (e) {
            debug("[BLE] BLE_Cancel_Device_Characteristic_Notify() Error " + e);
        };
    };

    self.BLE_Read_Characteristic_Data = async function (device_ID, service_Uuid, characteristic_Uuid) {
        try {
            var service_obj = await self.BLE_Device_Discover_Single_Service(device_ID, service_Uuid)
            if(service_obj==null)
            {
                return null;
            }
            var characteristic_obj = await self.BLE_Device_Discover_Single_Characteristic(device_ID, service_obj, characteristic_Uuid)
            if(characteristic_obj==null)
            {
                return null;
            }

            var data = await ble_core.BLE_Read_Device_Service_Characteristics(characteristic_obj);

            return data;
        }
        catch (e) {
            debug("[BLE] BLE_Read_Characteristic_Data() Error " + e);
        };
    };

    self.BLE_Write_Characteristic_Data = async function (device_ID, service_Uuid, characteristic_Uuid, data) {
        try {
            var service_obj = await self.BLE_Device_Discover_Single_Service(device_ID, service_Uuid)
            if(service_obj==null)
            {
                return false;
            }
            var characteristic_obj = await self.BLE_Device_Discover_Single_Characteristic(device_ID, service_obj, characteristic_Uuid)
            if(characteristic_obj==null)
            {
                return false;
            }

            var result = await ble_core.BLE_Write_Device_Service_Characteristics(characteristic_obj, data);

            return result;
        }
        catch (e) {
            debug("[BLE] BLE_Write_Characteristic_Data() Error " + e);
        };
    };

    self.BLE_Read_String_Characteristic = async function (device_ID, serviceUuid, characteristicUuid) {
        try {
            var data = await self.BLE_Read_Characteristic_Data(device_ID, serviceUuid, characteristicUuid);
            if(data==null)
            {
                return null;
            }
            return data.toString();
        }
        catch (e) {
            debug("[BLE] BLE_Read_String_Characteristic() Error " + e);
        };
    };

    self.BLE_Read_UInt8_Characteristic = async function (device_ID, serviceUuid, characteristicUuid) {
        try {
            var data = await self.BLE_Read_Characteristic_Data(device_ID, serviceUuid, characteristicUuid);
            if(data==null)
            {
                return null;
            }
            return data.readUInt8(0);
        }
        catch (e) {
            debug("[BLE] BLE_Read_UInt8_Characteristic() Error " + e);
        };
    };

    self.BLE_Read_Int8_Characteristic = async function (device_ID, serviceUuid, characteristicUuid) {
        try {
            var data = await self.BLE_Read_Characteristic_Data(device_ID, serviceUuid, characteristicUuid);
            if(data==null)
            {
                return null;
            }
            return data.readInt8(0);
        }
        catch (e) {
            debug("[BLE] BLE_Read_Int8_Characteristic() Error " + e);
        };
    };

    self.BLE_Read_UInt16LE_Characteristic = async function (device_ID, serviceUuid, characteristicUuid) {
        try {
            var data = await self.BLE_Read_Characteristic_Data(device_ID, serviceUuid, characteristicUuid);
            if(data==null)
            {
                return null;
            }
            return data.readUInt16LE(0);
        }
        catch (e) {
            debug("[BLE] BLE_Read_UInt16LE_Characteristic() Error " + e);
        };
    };

    self.BLE_Read_Int16LE_Characteristic = async function (device_ID, serviceUuid, characteristicUuid) {
        try {
            var data = await self.BLE_Read_Characteristic_Data(device_ID, serviceUuid, characteristicUuid);
            if(data==null)
            {
                return null;
            }
            return data.readInt16LE(0);
        }
        catch (e) {
            debug("[BLE] BLE_Read_Int16LE_Characteristic() Error " + e);
        };
    };

    self.BLE_Read_UInt32LE_Characteristic = async function (device_ID, serviceUuid, characteristicUuid) {
        try {
            var data = await self.BLE_Read_Characteristic_Data(device_ID, serviceUuid, characteristicUuid);
            if(data==null)
            {
                return null;
            }
            return data.readUInt32LE(0);
        }
        catch (e) {
            debug("[BLE] BLE_Read_UInt32LE_Characteristic() Error " + e);
        };
    };

    self.BLE_Read_Int32LE_Characteristic = async function (device_ID, serviceUuid, characteristicUuid) {
        try {
            var data = await self.BLE_Read_Characteristic_Data(device_ID, serviceUuid, characteristicUuid);
            if(data==null)
            {
                return null;
            }
            return data.readInt32LE(0);
        }
        catch (e) {
            debug("[BLE] BLE_Read_Int32LE_Characteristic() Error " + e);
        };
    };

    self.BLE_Read_Float32LE_Characteristic = async function (device_ID, serviceUuid, characteristicUuid) {
        try {
            var data = await self.BLE_Read_Characteristic_Data(device_ID, serviceUuid, characteristicUuid);
            if(data==null)
            {
                return null;
            }
            return data.readFloatLE(0);
        }
        catch (e) {
            debug("[BLE] BLE_Read_Float32LE_Characteristic() Error " + e);
        };
    };
    
    self.BLE_Write_String_Characteristic = async function (device_ID, serviceUuid, characteristicUuid, string) {
        try {
            var result = await self.BLE_Write_Characteristic_Data(device_ID, serviceUuid, characteristicUuid, new Buffer(string));
            
            return result;
        }
        catch (e) {
            debug("[BLE] BLE_Write_String_Characteristic() Error " + e);
        };
    };
    
    self.BLE_Write_UInt8_Characteristic = async function (device_ID, serviceUuid, characteristicUuid, value) {
        try {
            var buffer = new Buffer(1);
            buffer.writeUInt8(value, 0);
            
            var result = await self.BLE_Write_Characteristic_Data(device_ID, serviceUuid, characteristicUuid, buffer);
            
            return result;
        }
        catch (e) {
            debug("[BLE] BLE_Write_UInt8_Characteristic() Error " + e);
        };
    };
    
    self.BLE_Write_Int8_Characteristic = async function (device_ID, serviceUuid, characteristicUuid, value) {
        try {
            var buffer = new Buffer(1);
            buffer.writeInt8(value, 0);
            
            var result = await self.BLE_Write_Characteristic_Data(device_ID, serviceUuid, characteristicUuid, buffer);
            
            return result;
        }
        catch (e) {
            debug("[BLE] BLE_Write_Int8_Characteristic() Error " + e);
        };
    };
    
    self.BLE_Write_UInt16LE_Characteristic = async function (device_ID, serviceUuid, characteristicUuid, value) {
        try {
            var buffer = new Buffer(2);
            buffer.writeUInt16LE(value, 0);
            
            var result = await self.BLE_Write_Characteristic_Data(device_ID, serviceUuid, characteristicUuid, buffer);
            
            return result;
        }
        catch (e) {
            debug("[BLE] BLE_Write_UInt16LE_Characteristic() Error " + e);
        };
    };
    
    self.BLE_Write_Int16LE_Characteristic = async function (device_ID, serviceUuid, characteristicUuid, value) {
        try {
            var buffer = new Buffer(2);
            buffer.writeInt16LE(value, 0);
            
            var result = await self.BLE_Write_Characteristic_Data(device_ID, serviceUuid, characteristicUuid, buffer);
            
            return result;
        }
        catch (e) {
            debug("[BLE] BLE_Write_Int16LE_Characteristic() Error " + e);
        };
    };
    
    self.BLE_Write_UInt32LE_Characteristic = async function (device_ID, serviceUuid, characteristicUuid, value) {
        try {
            var buffer = new Buffer(4);
            buffer.writeUInt32LE(value, 0);
            
            var result = await self.BLE_Write_Characteristic_Data(device_ID, serviceUuid, characteristicUuid, buffer);
            
            return result;
        }
        catch (e) {
            debug("[BLE] BLE_Write_UInt32LE_Characteristic() Error " + e);
        };
    };
    
    self.BLE_Write_Int32LE_Characteristic = async function (device_ID, serviceUuid, characteristicUuid, value) {
        try {
            var buffer = new Buffer(4);
            buffer.writeInt32LE(value, 0);
            
            var result = await self.BLE_Write_Characteristic_Data(device_ID, serviceUuid, characteristicUuid, buffer);
            
            return result;
        }
        catch (e) {
            debug("[BLE] BLE_Write_Int32LE_Characteristic() Error " + e);
        };
    };
    
    self.BLE_Write_FloatLE_Characteristic = async function (device_ID, serviceUuid, characteristicUuid, value) {
        try {
            var buffer = new Buffer(4);
            buffer.writeFloatLE(value, 0);
            
            var result = await self.BLE_Write_Characteristic_Data(device_ID, serviceUuid, characteristicUuid, buffer);
            
            return result;
        }
        catch (e) {
            debug("[BLE] BLE_Write_FloatLE_Characteristic() Error " + e);
        };
    };
      
    self.BLE_Read_Device_Name = async function (device_ID) {
        try {
            var name = await self.BLE_Read_String_Characteristic(device_ID, self.GENERIC_ACCESS_UUID, self.DEVICE_NAME_UUID);
            if(name==null)
            {
                return null;
            }
            
            return name;
        }
        catch (e) {
            debug("[BLE] BLE_Write_FloatLE_Characteristic() Error " + e);
        };
    };
};


module.exports = BLE;
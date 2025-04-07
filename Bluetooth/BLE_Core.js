
var debug = console.log;//require('debug')(require('path').basename(__filename));

//var noble = require('noble');
var noble = require('@abandonware/noble');

var ble_scan_interval_timer = null;

var ble_initialized = false;

var BLE_Core = function (){
    var self = this;
    
    self.BLE_Core_Init = async function()
    {
        try{
            if(ble_initialized==true){return;}

            process.env.BLUETOOTH_HCI_SOCKET_USB_VID = 0x8087;
            process.env.BLUETOOTH_HCI_SOCKET_USB_PID = 0x0a2a;

            var success = false;
            var ble_init_timeout_timer = null;

            const do_ble_core_init = function(){
                return new Promise(resolve => {
                    ble_init_timeout_timer = setTimeout(function() {
                        if(ble_initialized==false){
                            success = false;
                        }

                        ble_init_timeout_timer = null

                        resolve();
                    }, 5000);
                    noble.on('stateChange', function(state) {
                        if (state == 'poweredOn') {
                            if(ble_init_timeout_timer!=null)
                            {
                                clearTimeout(ble_init_timeout_timer);
                                ble_init_timeout_timer = null;
                            }

                            ble_initialized = true;
                            success = true;

                            resolve();
                        } else {
                            ble_initialized = false;
                        }
                    });
                });
            };

            await do_ble_core_init();

            return success;
        }
        catch(e)
        {
            debug("[BLE_Core] BLE_Core_Init() Error " + e);
        }
    }

    self.BLE_Core_DeInit = function()
    {
        try{
            if(ble_initialized==false){return;}

            noble.stopScanning();

            ble_initialized = false;
        }
        catch(e)
        {
            debug("[BLE_Core] BLE_Core_DeInit() Error " + e);
        }
    }

    self.BLE_Start_Descovery_Device = function(on_find_device_callback)
    {
        try{
            if(ble_initialized==false){return;}

            if(ble_scan_interval_timer!=null){return;}

            ble_scan_interval_timer = setTimeout(function(){
                ble_scan_interval_timer = null;
                noble.stopScanning();
            }, 8000);

            noble.startScanning();
            
            noble.on('discover', function(peripheral) {
                if(on_find_device_callback!=null)
                {
                    on_find_device_callback(peripheral);
                }
            });
        }
        catch(e)
        {
            debug("[BLE_Core] BLE_Start_Descovery_Device() Error " + e);
        }
    };

    self.BLE_Stop_Descovery_Device = function()
    {
        try{
            if(ble_initialized==false){return;}

            if(ble_scan_interval_timer!=null)
            {
                ble_scan_interval_timer.clearTimeout();

                ble_scan_interval_timer = null;
            }
            
            noble.stopScanning();
        }
        catch(e)
        {
            debug("[BLE_Core] BLE_Stop_Descovery_Device() Error " + e);
        }
    }
    
    self.BLE_Connect_To_Device = async function(peripheral, on_disconnect_callback)
    {
        try{
            if(ble_initialized==false){return false;}

            var result = false;

            const do_ble_connect_to_device = function(peripheral){
                return new Promise(resolve => {
                    peripheral.on('disconnect', function(){
                        if(on_disconnect_callback!=null)
                        {
                            on_disconnect_callback(peripheral);
                        }
                    });
                    peripheral.connect(function(ret) {
                        if (ret < 0) {
                            result = false;
                        }
                        else {
                            result = true;
                        }
                        resolve();
                    });
                });
            };

            await do_ble_connect_to_device(peripheral);

            return result;
        }
        catch(e)
        {
            debug("[BLE_Core] BLE_Connect_To_Device() Error " + e);
        }
    }

    self.BLE_Disconnect_From_Device = function(peripheral)
    {
        try{
            if(ble_initialized==false){return;}

            peripheral.disconnect();
        }
        catch(e)
        {
            debug("[BLE_Core] BLE_Disconnect_From_Device() Error " + e);
        }
    }

    self.BLE_Discover_Device_Specific_Services = async function(peripheral, uuid_array)
    {
        try{
            if(ble_initialized==false){return;}

            var result = null;

            var ble_discover_specific_service_timeout_timer = null;

            const do_ble_discover_device_specific_services = function(peripheral, uuid_array){
                return new Promise(resolve => {

                    ble_discover_specific_service_timeout_timer = setTimeout(function() {
                        ble_discover_specific_service_timeout_timer = null

                        resolve();
                    }, 5000);
                    peripheral.discoverServices(uuid_array, function(error, services)
                    {
                        clearTimeout(ble_discover_specific_service_timeout_timer);

                        ble_discover_specific_service_timeout_timer = null;

                        if(error)
                        {
                            resolve();
                            return;
                        }
                        
                        if(services.length==0)
                        {
                            resolve();
                            return;
                        }

                        result = services;

                        resolve();
                    });
                });
            };

            await do_ble_discover_device_specific_services(peripheral, uuid_array);

            return result;
        }
        catch(e)
        {
            debug("[BLE_Core] BLE_Discover_Device_Specific_Services() Error " + e);
        }
    }
    self.BLE_Discover_Device_Specific_Service_Characteristics = async function(service_obj, uuid_array)
    {
        try{
            if(ble_initialized==false){return;}

            var result = null;

            var ble_discover_char_timeout_timer = null;

            const do_ble_discover_device_specific_service_characteristics = function(service_obj, uuid_array){
                return new Promise(resolve => {
                    
                    ble_discover_char_timeout_timer = setTimeout(function() {
                        ble_discover_char_timeout_timer = null

                        resolve();
                    }, 5000);
                    service_obj.discoverCharacteristics(uuid_array, function(error, characteristics)
                    {
                        clearTimeout(ble_discover_char_timeout_timer);

                        ble_discover_char_timeout_timer = null;

                        if(error)
                        {
                            resolve();
                            return;
                        }
                        
                        if(characteristics.length==0)
                        {
                            resolve();
                            return;
                        }

                        result = characteristics;

                        resolve();
                   });
                });
            };

            await do_ble_discover_device_specific_service_characteristics(service_obj, uuid_array);

            return result;
        }
        catch(e)
        {
            debug("[BLE_Core] BLE_Discover_Device_Specific_Service_Characteristics() Error " + e);
        }
    }

    self.BLE_Discover_Device_Specific_Services_And_Characteristics = async function(peripheral, service_uuid_array, characteristics_uuid_array)
    {
        try{
            if(ble_initialized==false){return;}

            var result = null;

            var ble_discover_specific_service_and_characteristics_timeout_timer = null;

            const do_ble_discover_device_specific_services_and_characteristics = function(peripheral, service_uuid_array, characteristics_uuid_array){
                return new Promise(resolve => {

                    ble_discover_specific_service_and_characteristics_timeout_timer = setTimeout(function() {
                        ble_discover_specific_service_and_characteristics_timeout_timer = null

                        resolve();
                    }, 5000);
                    peripheral.discoverSomeServicesAndCharacteristics(service_uuid_array, characteristics_uuid_array, function(error, services, characteristics)
                    {
                        clearTimeout(ble_discover_specific_service_and_characteristics_timeout_timer);

                        ble_discover_specific_service_and_characteristics_timeout_timer = null;

                        if(error)
                        {
                            resolve();
                            return;
                        }
                        
                        if(services.length==0 && characteristics.length==0)
                        {
                            resolve();
                            return;
                        }

                        result = {
                            services: services,
                            characteristics: characteristics
                        };

                        resolve();
                    });
                });
            };

            await do_ble_discover_device_specific_services_and_characteristics(peripheral, service_uuid_array, characteristics_uuid_array);

            return result;
        }
        catch(e)
        {
            debug("[BLE_Core] BLE_Discover_Device_Specific_Services_And_Characteristics() Error " + e);
        }
    }

    self.BLE_Discover_Device_All_Services_And_Characteristics = async function(peripheral)
    {
        try{
            if(ble_initialized==false){return;}

            var result = null;

            var ble_discover_all_service_and_characteristics_timeout_timer = null;

            const do_ble_discover_device_all_services_and_characteristics = function(peripheral){
                return new Promise(resolve => {

                    ble_discover_all_service_and_characteristics_timeout_timer = setTimeout(function() {
                        ble_discover_all_service_and_characteristics_timeout_timer = null

                        resolve();
                    }, 5000);
                    peripheral.discoverAllServicesAndCharacteristics(function(error, services, characteristics)
                    {
                        clearTimeout(ble_discover_all_service_and_characteristics_timeout_timer);

                        ble_discover_all_service_and_characteristics_timeout_timer = null;

                        if(error)
                        {
                            resolve();
                            return;
                        }
                        
                        if(services.length==0 && characteristics.length==0)
                        {
                            resolve();
                            return;
                        }

                        result = {
                            services: services,
                            characteristics: characteristics
                        };

                        resolve();
                    });
                });
            };

            await do_ble_discover_device_all_services_and_characteristics(peripheral);

            return result;
        }
        catch(e)
        {
            debug("[BLE_Core] BLE_Discover_Device_All_Services_And_Characteristics() Error " + e);
        }
    }

    self.BLE_Subscribe_Device_Service_Characteristics = function(characteristic_obj, on_subscribe_callback)
    {
        try{
            if(ble_initialized==false){return;}

            var ble_subscribe_service_characteristics_timeout_timer = null;

            ble_subscribe_service_characteristics_timeout_timer = setTimeout(function() {
                ble_subscribe_service_characteristics_timeout_timer = null;

                if(on_subscribe_callback!=null)
                {
                    on_subscribe_callback({error: "Subscribe Characteristic Timeout"});
                }
            }, 5000);

            characteristic_obj.subscribe(function(error) {
                clearTimeout(ble_subscribe_service_characteristics_timeout_timer);

                if(on_subscribe_callback!=null)
                {
                    on_subscribe_callback(error);
                }
            });
        }
        catch(e)
        {
            debug("[BLE_Core] BLE_Subscribe_Device_Service_Characteristics() Error " + e);
        }
    }

    self.BLE_Unsubscribe_Device_Service_Characteristics = function(characteristic_obj, on_unsubscribe_callback)
    {
        try{
            if(ble_initialized==false){return;}

            var ble_unsubscribe_service_characteristics_timeout_timer = null;

            ble_unsubscribe_service_characteristics_timeout_timer = setTimeout(function() {
                ble_unsubscribe_service_characteristics_timeout_timer = null;

                if(on_unsubscribe_callback!=null)
                {
                    on_unsubscribe_callback({error: "Unsubscribe Characteristic Timeout"});
                }
            }, 5000);

            characteristic_obj.unsubscribe(function(error) {
                clearTimeout(ble_unsubscribe_service_characteristics_timeout_timer);

                if(on_unsubscribe_callback!=null)
                {
                    on_unsubscribe_callback(error);
                }
            });
        }
        catch(e)
        {
            debug("[BLE_Core] BLE_Unsubscribe_Device_Service_Characteristics() Error " + e);
        }
    }

    self.BLE_Setup_Device_Service_Characteristics_Notify = function(characteristic_obj, on_notify_callback)
    {
        try{
            if(ble_initialized==false){return;}

            characteristic_obj.on('data', function(data, isNotify) {
                if(on_notify_callback!=null)
                {
                    on_notify_callback(data, isNotify);
                }
            });
        }
        catch(e)
        {
            debug("[BLE_Core] BLE_Setup_Device_Service_Characteristics_Notify() Error " + e);
        }
    }

    self.BLE_Cancel_Device_Service_Characteristics_Notify = function(characteristic_obj)
    {
        try{
            if(ble_initialized==false){return;}

            characteristic_obj.on('data', null);
        }
        catch(e)
        {
            debug("[BLE_Core] BLE_Cancel_Device_Service_Characteristics_Notify() Error " + e);
        }
    }

    self.BLE_Read_Device_Service_Characteristics = async function(characteristic_obj)
    {
        try{
            if(ble_initialized==false){return;}

            var result = null;

            var ble_read_char_timeout_timer = null;

            const do_ble_read_device_service_characteristics = function(characteristic_obj){
                return new Promise(resolve => {

                    ble_read_char_timeout_timer = setTimeout(function() {
                        ble_read_char_timeout_timer = null

                        resolve();
                    }, 5000);
                    characteristic_obj.read(function(error, read_data)
                    {
                        clearTimeout(ble_read_char_timeout_timer);

                        ble_read_char_timeout_timer = null;

                        if(error)
                        {
                            resolve();

                            return;
                        }
                        
                        result = read_data;

                        resolve();
                   });
                });
            };

            await do_ble_read_device_service_characteristics(characteristic_obj);

            return result;
        }
        catch(e)
        {
            debug("[BLE_Core] BLE_Discover_Device_Service_Characteristics() Error " + e);
        }
    }
    self.BLE_Write_Device_Service_Characteristics = async function(characteristic_obj, write_data)
    {
        try{
            if(ble_initialized==false){return;}

            var result = false;

            var ble_write_char_timeout_timer = null;

            const do_ble_write_device_service_characteristics = function(characteristic_obj, write_data){
                return new Promise(resolve => {
                    ble_write_char_timeout_timer = setTimeout(function() {
                        ble_write_char_timeout_timer = null

                        resolve();
                    }, 5000);
                    characteristic_obj.write(new Buffer(write_data), false, function(error)
                    {
                        clearTimeout(ble_write_char_timeout_timer);

                        ble_write_char_timeout_timer = null;

                        if(error)
                        {
                            result = false;

                            resolve();

                            return;
                        }
                        
                        result = true;

                        resolve();
                   });
                });
            };

            await do_ble_write_device_service_characteristics(characteristic_obj, write_data);

            return result;
        }
        catch(e)
        {
            debug("[BLE_Core] BLE_Write_Device_Service_Characteristics() Error " + e);
        }
    }
};
module.exports = BLE_Core;

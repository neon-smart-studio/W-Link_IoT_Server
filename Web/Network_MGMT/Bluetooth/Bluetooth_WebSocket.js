
var debug = require('debug')(require('path').basename(__filename));

var BLE = require('../../../Bluetooth/BLE.js');
var ble = new BLE();

var Bluetooth_WebSocket = function (){
    var self = this;
    
    self.Process_Bluetooth_Topic_WebSocket_POST_Message = async function(username, post_json_data)
    {
        try{
            if(post_json_data.command!=null){
                switch(post_json_data.command){
                    case "Discover Nearby Device":
                        if(post_json_data.discover_time!=null){
                            await ble.BLE_Discover_Device(post_json_data.discover_time);
                        }
                        break;
                    case "Connect To Device":
                        if(post_json_data.device_ID!=null){
                            await ble.BLE_Connect_To_Device(post_json_data.device_ID);
                        }
                        break;
                    case "Disconnect From Device":
                        if(post_json_data.device_ID!=null){
                            await ble.BLE_Connect_To_Device(post_json_data.device_ID);
                        }
                        break;
                }
            }
        }
        catch(e)
        {
            debug('[Bluetooth_WebSocket] Process_Bluetooth_Topic_WebSocket_POST_Message() Error ' + e);
        }
    }

    self.Process_Bluetooth_Topic_WebSocket_GET_Message = async function(username, get_json_data)
    {
        try{
            var rsp_json = null;
            if(get_json_data.command!=null){
                switch(get_json_data.command){
                    case "Get Discover Result":
                        rsp_json = ble.BLE_Get_Discover_Result(post_json_data.discover_time);
                        break;
                }
            }
            return rsp_json;
        }
        catch(e)
        {
            debug('[Bluetooth_WebSocket] Process_Bluetooth_Topic_WebSocket_GET_Message() Error ' + e);
        }
    }
}
module.exports = Bluetooth_WebSocket;

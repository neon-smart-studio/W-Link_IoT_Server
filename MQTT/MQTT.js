
var debug = require('debug')(require('path').basename(__filename));

const config = require('config');

var MQTT_Broker = require('./MQTT_Broker.js');
var mqtt_broker = new MQTT_Broker();

var MQTT_Client = require('./MQTT_Client.js');
var mqtt_client = new MQTT_Client();

const MQTT_DB_Name = 'mqtt';
const MQTT_Client_Collection_Name = 'MQTT_Client_List';

var registered_mqtt_data_channel_list = [];
var registered_mqtt_data_channel_post_callback_list = [];
var registered_mqtt_data_channel_get_callback_list = [];
var registered_mqtt_data_channel_get_rsp_callback_list = [];
var registered_mqtt_data_channel_get_rsp_timeout_timer = [];

function MQTT_Build_Topic_Name(address_ID, dataChannelID)
{
    return "/" + address_ID + "/" + dataChannelID;
}

async function MQTT_Proccess_DataChannel_Message(device_ID, dataChannelID, json_data) {
    try {
        if (json_data.method == null) { return; }
        
        switch (json_data.method) {
            case "POST":
                for (i = 0; i < registered_mqtt_data_channel_list.length; i++) {
                    if (registered_mqtt_data_channel_list[i] == dataChannelID) {
                        if (registered_mqtt_data_channel_post_callback_list[i] != null) {
                            registered_mqtt_data_channel_post_callback_list[i](device_ID, json_data);
                            return;
                        }
                    }
                }
                break;
            case "GET":
                for (i = 0; i < registered_mqtt_data_channel_list.length; i++) {
                    if (registered_mqtt_data_channel_list[i] == dataChannelID) {
                        if (registered_mqtt_data_channel_get_callback_list[i] != null) {
                            registered_mqtt_data_channel_get_callback_list[i](device_ID, json_data, function (rsp_json) {
                                if (rsp_json != null) {
                                    rsp_json.method = "GET_RSP";
                                    rsp_json.sender = "Client";
                                    mqtt_client.MQTT_Client_Send_Message(MQTT_Build_Topic_Name(device_ID, dataChannelID), rsp_json);
                                }
                            });
                            return;
                        }
                    }
                }
                break;
            case "GET_RSP":
                for (i = 0; i < registered_mqtt_data_channel_list.length; i++) {
                    if (registered_mqtt_data_channel_list[i] == dataChannelID) {
                        if (registered_mqtt_data_channel_get_rsp_callback_list[i] != null) {
                            if(registered_mqtt_data_channel_get_rsp_timeout_timer[i] != null)
                            {
                                clearTimeout(registered_mqtt_data_channel_get_rsp_timeout_timer[i]);
                                registered_mqtt_data_channel_get_rsp_timeout_timer[i] = null;
                            }
                            registered_mqtt_data_channel_get_rsp_callback_list[i](false, device_ID, json_data);
                            registered_mqtt_data_channel_get_rsp_callback_list[i] = null;
                            return;
                        }
                    }
                }
                break;
            default:
                debug("[MQTT] MQTT Command Failed: Unknown Method");
                break;
        }
    }
    catch (e) {
        debug("[MQTT] MQTT_Proccess_DataChannel_Message() Error " + e);
    };
}

function doSend_MQTT_POST_Message(dataChannelID, deviceID, json_data)
{
    try {
        json_data.method = "POST";
        json_data.sender = "Server";
        mqtt_client.MQTT_Client_Send_Message(MQTT_Build_Topic_Name(deviceID, dataChannelID), json_data);
    }
    catch (e) {
        debug("[MQTT] doSend_MQTT_POST_Message() Error " + e);
    };
}
function doSend_MQTT_GET_Message(dataChannelID, deviceID, json_data, callback)
{
    try {
        json_data.method = "GET";
        json_data.sender = "Server";
        
        for (var i = 0; i < registered_mqtt_data_channel_list.length; i++) {
            if (registered_mqtt_data_channel_list[i] == dataChannelID) {
                registered_mqtt_data_channel_get_rsp_callback_list[i] = callback;
                if(registered_mqtt_data_channel_get_rsp_callback_list[i]!=null)
                {
                    registered_mqtt_data_channel_get_rsp_timeout_timer[i] = setTimeout(function (index) {
                        if(registered_mqtt_data_channel_get_rsp_callback_list[index]!=null)
                        {
                            registered_mqtt_data_channel_get_rsp_callback_list[index] = null;
                            debug("[MQTT] MQTT Get Command Timeout");
                            callback(true, '', deviceID, null);
                        }
                    }, 1000, i);
                }
            }
        }
        
        mqtt_client.MQTT_Client_Send_Message(MQTT_Build_Topic_Name(deviceID, dataChannelID), json_data);
    }
    catch (e) {
        debug("[MQTT] doSend_MQTT_GET_Message() Error " + e);
    }
};

var MQTT = function () {
    var self = this;

    self.MQTT_Init = function()
    {
        try{
            mqtt_broker.MQTT_Broker_Init();
        }
        catch (e) {
            debug("[MQTT] MQTT_Init() Error " + e);
        };
    };
    self.MQTT_Handle_DataChannel_Message = function (device_ID, dataChannelID, json_data) {
        try {
            MQTT_Proccess_DataChannel_Message(device_ID, dataChannelID, json_data);
        }
        catch (e) {
            debug("[MQTT] MQTT_Handle_DataChannel_Message() Error " + e);
        };
    };
    self.MQTT_Subscribe_All_DataChannel = function (device_ID) {
        try {
            for (var i = 0; i < registered_mqtt_data_channel_list.length; i++) {
                mqtt_client.MQTT_Client_Subscribe_Topic(MQTT_Build_Topic_Name("Broadcast", registered_mqtt_data_channel_list[i]));
                mqtt_client.MQTT_Client_Subscribe_Topic(MQTT_Build_Topic_Name(device_ID, registered_mqtt_data_channel_list[i]));
            }
        }
        catch (e) {
            debug("[MQTT] MQTT_Subscribe_All_DataChannel() Error " + e);
        };
    };
    self.MQTT_Data_Request = function (dataChannelID, deviceID, json_data) {
        try {
            mqtt_client.MQTT_Client_Send_Message(MQTT_Build_Topic_Name(deviceID, dataChannelID), json_data);
        }
        catch (e) {
            debug("[MQTT] MQTT_Data_Request() Error " + e);
        };
    };
    self.MQTT_POST_Request = function (dataChannelID, deviceID, json_data) {
        try {
            doSend_MQTT_POST_Message(dataChannelID, deviceID, json_data);
        }
        catch (e) {
            debug("[MQTT] MQTT_POST_Request() Error " + e);
        };
    };
    self.MQTT_GET_Request = async function (dataChannelID, deviceID, json_data) {
        try {
            var response_data = {};
            const do_mqtt_send_get_message = function(dataChannelID, deviceID, json_data){
                return new Promise(function(resolve, reject) {
                    doSend_MQTT_GET_Message(dataChannelID, deviceID, json_data, function(timeout, device_ID, json_data){
                        if(timeout==true)
                        {
                            response_data = {
                                timeout: true,
                                device_ID: device_ID
                            }
                        }
                        else{
                            response_data = Object.assign({},{
                                timeout: false,
                                device_ID: device_ID
                            },json_data);
                        }
                        resolve();
                    });
                });
            };

            await do_mqtt_send_get_message(dataChannelID, deviceID, json_data);

            return response_data;
        }
        catch (e) {
            debug("[MQTT] MQTT_GET_Request() Error " + e);
        };
    };
    self.Register_MQTT_Data_Channel_ID_And_Callbacks = function (dataChannelID, post_callback, get_callback) {
        try {
            debug("Register_MQTT_Data_Channel_ID_And_Callbacks dataChannelID = "+dataChannelID);
            registered_mqtt_data_channel_list.push(dataChannelID);
            registered_mqtt_data_channel_post_callback_list.push(post_callback);
            registered_mqtt_data_channel_get_callback_list.push(get_callback);
            debug("registered_mqtt_data_channel_list.length = "+registered_mqtt_data_channel_list.length);
        }
        catch (e) {
            debug("[MQTT] Register_MQTT_Data_Channel_ID_And_Callbacks() Error " + e);
        };
    };
};


module.exports = MQTT;
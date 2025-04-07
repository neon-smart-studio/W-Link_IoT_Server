
var debug = require('debug')(require('path').basename(__filename));

const config = require('config');

var MQTT = require('./MQTT.js');
var mqtt = new MQTT();

var MQTT_Broker = require('./MQTT_Broker.js');
var mqtt_broker = new MQTT_Broker();

var MQTT_Client = require('./MQTT_Client.js');
var mqtt_client = new MQTT_Client();

var Device_MGMT_MQTT = require('./Device_MGMT/Device_MGMT_MQTT.js');
var device_mgmt_mqtt = new Device_MGMT_MQTT();

var MQTT = require('./MQTT.js');
var mqtt = new MQTT();

const MQTT_DB_Name = 'mqtt';
const MQTT_Client_Collection_Name = 'MQTT_Client_List';

async function MQTT_Connect_To_All_User()
{
    mqtt_client.MQTT_Client_Connect(null);
}

function MQTT_Broker_Ready_Event_Handler()
{
    MQTT_Connect_To_All_User();
}

function MQTT_Broker_Client_Connected_Event_Handler(client, deviceID)
{
}

function MQTT_Broker_Client_Disconnected_Event_Handler(client, deviceID)
{
}

function MQTT_Broker_Client_Authenticate_Event_Handler(client)
{
    mqtt_client.MQTT_Client_Connect(null);
}

function MQTT_Broker_Client_Publish_Event_Handler(client, topic, payload)
{
}

function MQTT_Broker_Client_Subscribe_Event_Handler(client, topic)
{
    mqtt_client.MQTT_Client_Subscribe_Topic(topic);
}

async function MQTT_Handle_Client_Connect() {
    try {
        mqtt_client.MQTT_Client_Subscribe_Topic("/Registration");
    }
    catch (e) {
        debug("[MQTT_Event] MQTT_Handle_Client_Connect() Error " + e);
    };
}

async function MQTT_Handle_Client_Message(topic, message) {
    try {
        var json_data = JSON.parse(message.toString());

        if (json_data == null) { return; }
        if (json_data.sender == null) { return; }

        if (json_data.sender == "Client") {
            if (topic == "/Registration") {
                if (json_data.Device.device_ID == null) {
                    return;
                }

                mqtt.MQTT_Subscribe_All_DataChannel(json_data.Device.device_ID);

                device_mgmt_mqtt.Process_MQTT_Device_Registration_Event(json_data.Device.device_ID, json_data);
            }
            else{
                var ID_start_index = topic.indexOf("/");
                if (ID_start_index < 0) { return; }
                var temp_str = topic.substring(ID_start_index + 1);
                var ID_end_index = temp_str.indexOf("/");
                if (ID_end_index < 0) { return; }
                var adress_ID = topic.substring(ID_start_index + 1, ID_end_index + 1);
                var data_channel_ID = topic.substring(ID_end_index + 2);
        
                if (adress_ID == "Broadcast") { return; }
                
                mqtt.MQTT_Handle_DataChannel_Message(adress_ID, data_channel_ID, json_data)
            }
        }
    }
    catch (e) {
        debug("[MQTT_Event] MQTT_Handle_Client_Message() Error " + e);
    };
}

var MQTT_Event = function (){
    var self = this;
    
    self.MQTT_Event_Init = function()
    {
        try{
            device_mgmt_mqtt.Device_MGMT_MQTT_Init();
            
            mqtt_client.Register_MQTT_Client_OnConnect_Event_Callbacks(MQTT_Handle_Client_Connect);
            mqtt_client.Register_MQTT_Client_Message_Event_Callbacks(MQTT_Handle_Client_Message);
            
            mqtt_broker.Register_MQTT_Broker_Ready_Callback(MQTT_Broker_Ready_Event_Handler);
            mqtt_broker.Register_MQTT_Client_Connected_Callback(MQTT_Broker_Client_Connected_Event_Handler);
            mqtt_broker.Register_MQTT_Client_Disconnected_Callback(MQTT_Broker_Client_Disconnected_Event_Handler);
            mqtt_broker.Register_MQTT_Client_Authenticate_Callback(MQTT_Broker_Client_Authenticate_Event_Handler);
            mqtt_broker.Register_MQTT_Client_Publish_Callback(MQTT_Broker_Client_Publish_Event_Handler);
            mqtt_broker.Register_MQTT_Client_Subscribe_Callback(MQTT_Broker_Client_Subscribe_Event_Handler);
        }
        catch (e) {
            debug("[MQTT_Event] MQTT_Event_Init() Error " + e);
        };
    };
};
module.exports = MQTT_Event;

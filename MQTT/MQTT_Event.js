
var debug = require('debug')(require('path').basename(__filename));

const config = require('config');

var Account_MGR = require('../Util/Account_MGR.js');
var account_mgr = new Account_MGR();

var MQTT = require('./MQTT.js');
var mqtt = new MQTT();

if(config.get('config_MQTT.buildIn_broker')==true)
{
    var MQTT_Broker = require('./MQTT_Broker.js');
    var mqtt_broker = new MQTT_Broker();
}

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
    if(config.get('account_login')==true)
    {
        var user_list = await account_mgr.Get_User_List();
        if(user_list!=null){
            for (var i = 0; i < user_list.num_of_user; i++) {
                mqtt_client.MQTT_Client_Connect(user_list.user_list[i], null);
            }
        }
    }
    else{
        mqtt_client.MQTT_Client_Connect("everyone", null);
    }
}

if(config.get('config_MQTT.buildIn_broker')==true)
{
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

    function MQTT_Broker_Client_Authenticate_Event_Handler(client, username)
    {
        var client_session = mqtt_client.MQTT_Client_Get_Session(username);
        if(client_session==null)
        {
            mqtt_client.MQTT_Client_Connect(username, null);
        }
    }

    function MQTT_Broker_Client_Publish_Event_Handler(client, username, topic, payload)
    {
    }

    function MQTT_Broker_Client_Subscribe_Event_Handler(client, username, topic)
    {
        mqtt_client.MQTT_Client_Subscribe_Topic(username, topic);
    }
}

async function MQTT_Handle_Client_Connect(username) {
    try {
        mqtt_client.MQTT_Client_Subscribe_Topic(username, "/Registration");
    }
    catch (e) {
        debug("[MQTT_Event] MQTT_Handle_Client_Connect() Error " + e);
    };
}

async function MQTT_Handle_Client_Message(username, topic, message) {
    try {
        var json_data = JSON.parse(message.toString());

        if (json_data == null) { return; }
        if (json_data.sender == null) { return; }

        if (json_data.sender == "Client") {
            if (topic == "/Registration") {
                if (json_data.Device.device_ID == null) {
                    return;
                }

                var username = "everyone";
                if(config.get('account_login')==true)
                {
                    var success = await database.DataBase_Open(MQTT_DB_Name);
                    if(success==false)
                    {
                        return;
                    }
    
                    var client_doc = await database.Database_Find(MQTT_DB_Name, MQTT_Client_Collection_Name, { 'device_ID': json_data.Device.device_ID }, null);
                    if(client_doc==null || client_doc.length==0)
                    {
                        database.DataBase_Close(MQTT_DB_Name);
                        return;
                    }
                    
                    database.DataBase_Close(MQTT_DB_Name);
                    
                    if (client_doc[0].user == null) {
                        return;
                    }
                    username = client_doc[0].user;
                }

                if(config.get('config_MQTT.buildIn_broker')==false)
                {
                    mqtt.MQTT_Subscribe_All_DataChannel(username, json_data.Device.device_ID);
                }

                device_mgmt_mqtt.Process_MQTT_Device_Registration_Event(username, json_data.Device.device_ID, json_data);
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
            
            if(config.get('config_MQTT.buildIn_broker')==true)
            {
                mqtt_broker.Register_MQTT_Broker_Ready_Callback(MQTT_Broker_Ready_Event_Handler);
                mqtt_broker.Register_MQTT_Client_Connected_Callback(MQTT_Broker_Client_Connected_Event_Handler);
                mqtt_broker.Register_MQTT_Client_Disconnected_Callback(MQTT_Broker_Client_Disconnected_Event_Handler);
                mqtt_broker.Register_MQTT_Client_Authenticate_Callback(MQTT_Broker_Client_Authenticate_Event_Handler);
                mqtt_broker.Register_MQTT_Client_Publish_Callback(MQTT_Broker_Client_Publish_Event_Handler);
                mqtt_broker.Register_MQTT_Client_Subscribe_Callback(MQTT_Broker_Client_Subscribe_Event_Handler);
            }
        }
        catch (e) {
            debug("[MQTT_Event] MQTT_Event_Init() Error " + e);
        };
    };
};
module.exports = MQTT_Event;


var debug = require('debug')(require('path').basename(__filename));

const config = require('config');

var http = require('http');

var mosca = require('mosca');

var MQTT_Server_Settings = {
    http: {
        port: 8081,
        bundle: true,
        static: './'
    },
    port: 1883,
    schema: {}
};

var MQTT_Server = null;
var MQTT_HTTP_Server = null;

const MQTT_DB_Name = 'mqtt';

var DataBase = require('../DataBase/DataBase.js');
var database = new DataBase();

const MQTT_Client_Collection_Name = 'MQTT_Client_List';

var registered_mqtt_broker_ready_callback = null;
var registered_mqtt_client_authenticate_callback = null;
var registered_mqtt_client_connected_callback = null;
var registered_mqtt_client_disconnected_callback = null;
var registered_mqtt_client_publish_callback = null;
var registered_mqtt_client_subscribe_callback = null;

var mqttOnlineClientList = [];

var authenticate = async function (client, username, password, callback) {
    try {
        if (registered_mqtt_client_authenticate_callback != null) {
            registered_mqtt_client_authenticate_callback(client);
        }

        callback(null, true);
    }
    catch (e) {
        debug("[MQTT] authenticate() Error " + e);
    };
}

var authorizeSubscribe = function (client, topic, callback) {
    try {
        if (registered_mqtt_client_subscribe_callback != null) {
            registered_mqtt_client_subscribe_callback(client, topic);
        }

        callback(null, true);
    }
    catch (e) {
        debug("[MQTT] authorizeSubscribe() Error " + e);
    };
}

var authorizePublish = function (client, topic, payload, callback) {
    try {
        if (registered_mqtt_client_publish_callback != null) {
            registered_mqtt_client_publish_callback(client, topic, payload);
        }

        callback(null, true, payload);
    }
    catch (e) {
        debug("[MQTT] authorizePublish() Error " + e);
    };
}

async function MQTT_Broker_Handle_Client_Connect(client)
{
    try {
        debug('[Mosca MQTT] Client \"' + client.id + '\" Connected');

        if (client == undefined) { return; }

        mqttOnlineClientList.push(client);

        var deviceID_maker_index = client.id.indexOf("_");
        if (deviceID_maker_index < 0) { return; }

        var deviceType = client.id.substring(0, deviceID_maker_index);
        var deviceID = client.id.substring(deviceID_maker_index + 1);

        var MQTT_Client_Info = {};
        
        MQTT_Client_Info = {
            device_Type: deviceType,
            device_ID: deviceID,

            online: true
        }

        var success = await database.DataBase_Open(MQTT_DB_Name);
        if(success==false)
        {
            return;
        }

        var client_doc = await database.Database_Find(MQTT_DB_Name, MQTT_Client_Collection_Name, { 'device_ID': deviceID }, null);
        if(client_doc==null)
        {
            database.DataBase_Close(MQTT_DB_Name);
            return;
        }
        
        if (client_doc.length != 0) {
            success = await database.Database_Update(MQTT_DB_Name, MQTT_Client_Collection_Name, { 'device_ID':deviceID }, MQTT_Client_Info, false);
            if(success==false)
            {
                database.DataBase_Close(MQTT_DB_Name);
                return;
            }
        }
        else {
            success = await database.Database_Insert(MQTT_DB_Name, MQTT_Client_Collection_Name, MQTT_Client_Info);
            if(success==false)
            {
                database.DataBase_Close(MQTT_DB_Name);
                return;
            }
        }

        database.DataBase_Close(MQTT_DB_Name);
        
        if (registered_mqtt_client_connected_callback != null) {
            registered_mqtt_client_connected_callback(client, deviceID);
        }
    }
    catch (e) {
        debug("[Mosca MQTT] MQTT_Broker_Handle_Client_Connect() Error " + e);
    };
}

async function MQTT_Broker_Handle_Client_Disconnect(client)
{
    try {
        debug('[Mosca MQTT] Client \"' + client.id + '\" Disconnected');

        if (client == undefined) { return; }

        for (var i = 0; i < mqttOnlineClientList.length; i++) {
            if (mqttOnlineClientList[i].id === client.id) {
                var before_del_item_array = mqttOnlineClientList.slice(0, i);
                var after_del_item_array = mqttOnlineClientList.slice(i + 1, mqttOnlineClientList.length);
                mqttOnlineClientList = before_del_item_array.concat(after_del_item_array);
            }
        }

        var deviceID_maker_index = client.id.indexOf("_");
        if (deviceID_maker_index < 0) { return; }

        var deviceType = client.id.substring(0, deviceID_maker_index);
        var deviceID = client.id.substring(deviceID_maker_index + 1);

        var MQTT_Client_Info = {};
        
        MQTT_Client_Info = {
            device_Type: deviceType,
            device_ID: deviceID,

            online: false
        }

        var success = await database.DataBase_Open(MQTT_DB_Name);
        if(success==false)
        {
            return;
        }

        var client_doc = await database.Database_Find(MQTT_DB_Name, MQTT_Client_Collection_Name, { 'device_ID': deviceID }, null);
        if(client_doc==null)
        {
            database.DataBase_Close(MQTT_DB_Name);
            return;
        }
        
        if (client_doc.length != 0) {
            success = await database.Database_Update(MQTT_DB_Name, MQTT_Client_Collection_Name, { 'device_ID':deviceID }, MQTT_Client_Info, false);
            if(success==false)
            {
                database.DataBase_Close(MQTT_DB_Name);
                return;
            }
        }
        else {
            success = await database.Database_Insert(MQTT_DB_Name, MQTT_Client_Collection_Name, MQTT_Client_Info);
            if(success==false)
            {
                database.DataBase_Close(MQTT_DB_Name);
                return;
            }
        }

        database.DataBase_Close(MQTT_DB_Name);

        if (registered_mqtt_client_disconnected_callback != null) {
            registered_mqtt_client_disconnected_callback(client, deviceID);
        }
    }
    catch (e) {
        debug("[Mosca MQTT] MQTT_Broker_Handle_Client_Disconnect() Error " + e);
    };
}

var MQTT_Broker = function () {
    var self = this;

    self.MQTT_Broker_Init = function () {
        try {
            MQTT_Server = new mosca.Server(MQTT_Server_Settings);
            MQTT_HTTP_Server = http.createServer();
            MQTT_Server.attachHttpServer(MQTT_HTTP_Server);
            MQTT_HTTP_Server.listen(8001);
    
            MQTT_Server.on('clientConnected', function (client) {
                MQTT_Broker_Handle_Client_Connect(client);
            });
    
            MQTT_Server.on('clientDisconnected', function (client) {
                try {
                    MQTT_Broker_Handle_Client_Disconnect(client);
                }
                catch (e) {
                    debug("[Mosca MQTT] clientDisconnected() Error " + e);
                };
            });
    
            // fired when a message is received
            MQTT_Server.on('published', function (packet, client) {
                try {
                    debug('[Mosca MQTT] Published Data: ' + packet.payload.toString());
                }
                catch (e) {
                    debug("[Mosca MQTT] published() Error " + e);
                };
            });
    
            MQTT_Server.on('ready', function () {
                try {
                    MQTT_Server.authenticate = authenticate;
                    MQTT_Server.authorizePublish = authorizePublish;
                    MQTT_Server.authorizeSubscribe = authorizeSubscribe;
    
                    if (registered_mqtt_broker_ready_callback != null) {
                        registered_mqtt_broker_ready_callback();
                    }
    
                    debug('[Mosca MQTT] Mosca MQTT Server Is Up And Running');
                }
                catch (e) {
                    debug("[Mosca MQTT] ready() Error " + e);
                };
            });
        }
        catch (e) {
            debug("[MQTT] MQTT_Broker_Init() Error " + e);
        };
    };
    self.Register_MQTT_Broker_Ready_Callback = function (callback) {
        try {
            registered_mqtt_broker_ready_callback = callback;
        }
        catch (e) {
            debug("[MQTT] Register_MQTT_Broker_Ready_Callback() Error " + e);
        };
    };
    self.Register_MQTT_Client_Authenticate_Callback = function (callback) {
        try {
            registered_mqtt_client_authenticate_callback = callback;
        }
        catch (e) {
            debug("[MQTT] Register_MQTT_Client_Authenticate_Callback() Error " + e);
        };
    };
    self.Register_MQTT_Client_Publish_Callback = function (callback) {
        try {
            registered_mqtt_client_publish_callback = callback;
        }
        catch (e) {
            debug("[MQTT] Register_MQTT_Client_Publish_Callback() Error " + e);
        };
    };
    self.Register_MQTT_Client_Subscribe_Callback = function (callback) {
        try {
            registered_mqtt_client_subscribe_callback = callback;
        }
        catch (e) {
            debug("[MQTT] Register_MQTT_Client_Subscribe_Callback() Error " + e);
        };
    };
    self.Register_MQTT_Client_Connected_Callback = function (callback) {
        try {
            registered_mqtt_client_connected_callback = callback;
        }
        catch (e) {
            debug("[MQTT] Register_MQTT_Client_Connected_Callback() Error " + e);
        };
    };
    self.Register_MQTT_Client_Disconnected_Callback = function (callback) {
        try {
            registered_mqtt_client_disconnected_callback = callback;
        }
        catch (e) {
            debug("[MQTT] Register_MQTT_Client_Disconnected_Callback() Error " + e);
        };
    };
};


module.exports = MQTT_Broker;
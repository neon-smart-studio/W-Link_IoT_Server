
var debug = require('debug')(require('path').basename(__filename));

const config = require('config');

var mqtt = require('mqtt');

var mqttClientList = [];
var registered_mqtt_client_onconnect_callback = null;
var registered_mqtt_client_message_callback = null;

var MQTT_Client = function () {
    var self = this;

    self.MQTT_Client_Connect = function(username, password) {
        try {
            var broker_url = "127.0.0.1";
            
            if(config.get('config_MQTT.buildIn_broker')==false)
            {
                var config_broker_url = config.get('config_MQTT.broker_URL');
                if(config_broker_url!=null)
                {
                    broker_url = config_broker_url;
                }
            }

            var login_cfg = {
                username: username
            }

            if(password!=null)
            {
                login_cfg['password'] = password;
            }

            var mqtt_client = mqtt.connect('mqtt://'+broker_url, login_cfg);

            mqtt_client.user = username;

            mqtt_client.on('connect', function () {
                debug(mqtt_client.user + "'s MQTT Sender Receiver Started");

                mqtt_client.on('message', (topic, message)=>{
                    registered_mqtt_client_message_callback(username, topic, message)
                });
    
                var exist = false;
                for (var i = 0; i < mqttClientList.length; i++) {
                    if (mqttClientList[i].user == username) {
                        exist = true;
                        mqttClientList[i] = mqtt_client;
                    }
                }
                if (!exist) {
                    mqttClientList.push(mqtt_client);
                }

                if(registered_mqtt_client_onconnect_callback!=null)
                {
                    registered_mqtt_client_onconnect_callback(username);
                }
            });
        }
        catch (e) {
            debug("[MQTT_Client] MQTT_Sender_Receiver_Attach_User() Error " + e);
        };
    };
    
    self.MQTT_Client_Get_Session = function(username)
    {
        try {
            for (var i = 0; i < mqttClientList.length; i++) {
                if (mqttClientList[i].user == username) {
                    return mqttClientList[i];
                }
            }
            return null;
        }
        catch (e) {
            debug("[MQTT_Client] MQTT_Client_Get_Session() Error " + e);
        };
    }

    self.MQTT_Client_Subscribe_Topic = function(username, topic)
    {
        try {
            for (var i = 0; i < mqttClientList.length; i++) {
                if (mqttClientList[i] == undefined) { continue; }
                if (mqttClientList[i].user == undefined) { continue; }
    
                if (mqttClientList[i].user == username) {
                    mqttClientList[i].subscribe(topic);
                }
            }
        }
        catch (e) {
            debug("[MQTT_Client] MQTT_Client_Subscribe_Topic() Error " + e);
        };
    };
    
    self.MQTT_Client_Send_Message = function(username, topic, json_data)
    {
        try {
            for (var i = 0; i < mqttClientList.length; i++) {
                if (mqttClientList[i] == undefined) { continue; }
                if (mqttClientList[i].user == undefined) { continue; }
    
                if (mqttClientList[i].user == username) {
                    mqttClientList[i].publish(topic, JSON.stringify(json_data));
                }
            }
        }
        catch (e) {
            debug("[MQTT_Client] MQTT_Client_Send_Message() Error " + e);
        };
    };
    
    self.Register_MQTT_Client_OnConnect_Event_Callbacks = function (callback) {
        try {
            registered_mqtt_client_onconnect_callback = callback;
        }
        catch (e) {
            debug("[MQTT_Client] Register_MQTT_Client_OnConnect_Event_Callbacks() Error " + e);
        };
    };
    self.Register_MQTT_Client_Message_Event_Callbacks = function (callback) {
        try {
            registered_mqtt_client_message_callback = callback;
        }
        catch (e) {
            debug("[MQTT_Client] Register_MQTT_Client_Message_Event_Callbacks() Error " + e);
        };
    };
};


module.exports = MQTT_Client;

var debug = require('debug')(require('path').basename(__filename));

const config = require('config');

var mqtt = require('mqtt');

var mqttClientList = [];
var registered_mqtt_client_onconnect_callback = null;
var registered_mqtt_client_message_callback = null;

var MQTT_Client = function () {
    var self = this;

    self.MQTT_Client_Connect = function(password) {
        try {
            var mqtt_client = mqtt.connect('mqtt://"127.0.0.1"', login_cfg);

            mqtt_client.on('connect', function () {
                debug(mqtt_client.user + "'s MQTT Sender Receiver Started");

                mqtt_client.on('message', (topic, message)=>{
                    registered_mqtt_client_message_callback(topic, message)
                });
    
                mqttClientList.push(mqtt_client);

                if(registered_mqtt_client_onconnect_callback!=null)
                {
                    registered_mqtt_client_onconnect_callback();
                }
            });
        }
        catch (e) {
            debug("[MQTT_Client] MQTT_Sender_Receiver_Attach_User() Error " + e);
        };
    };
    
    self.MQTT_Client_Subscribe_Topic = function(topic)
    {
        try {
            for (var i = 0; i < mqttClientList.length; i++) {
                if (mqttClientList[i] == undefined) { continue; }
    
                mqttClientList[i].subscribe(topic);
            }
        }
        catch (e) {
            debug("[MQTT_Client] MQTT_Client_Subscribe_Topic() Error " + e);
        };
    };
    
    self.MQTT_Client_Send_Message = function(topic, json_data)
    {
        try {
            for (var i = 0; i < mqttClientList.length; i++) {
                if (mqttClientList[i] == undefined) { continue; }
    
                mqttClientList[i].publish(topic, JSON.stringify(json_data));
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
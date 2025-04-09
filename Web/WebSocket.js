
var debug = require('debug')(require('path').basename(__filename));

const config = require('config');

var express = require('express');
var WebSocketServer = require('websocket').server;
var fs = require('fs');

var websocket_port = process.env.PORT || 8000;

var websocket_ssl_options = {
    key: fs.readFileSync(__dirname + '/SSL/wlink_key.pem'),
    cert: fs.readFileSync(__dirname + '/SSL/wlink_cert.pem'),
  };

var registered_ws_topic_list = [];
var registered_ws_topic_post_callback_list = [];
var registered_ws_topic_get_callback_list = [];

var websocket_connection_list = [];

var WebsocketServerHTTPS;
var WsServer = null;

function WebSocket_Server_Init() {
    try {
        
        websocket_exp = express();
        
        WebsocketServerHTTPS = require('https').createServer(websocket_ssl_options, websocket_exp);
        WebsocketServerHTTPS.listen(websocket_port, function () {
          debug('websocket server running on port ' + websocket_port + '.');
          debug('Make sure port ' + websocket_port + ' is not used by another program. ex: VMWare Hostd(VMWare Workstation Remote Access).');
        });
        
        WsServer = new WebSocketServer({
            httpServer: WebsocketServerHTTPS,
            autoAcceptConnections: false
        });

        WsServer.on('request', async function (request) {
            try {
                if (request.requestedProtocols.length==0) {
                    debug("[WebSocket] Invalid Session");
                    return;
                }
                
                var sessionIdProtocol =  request.requestedProtocols[0];
                var sessionIdProtocolFullCase = request.protocolFullCaseMap[sessionIdProtocol];

                var connection = request.accept(sessionIdProtocol, request.origin);
                websocket_connection_list.push(connection);

                //debug((new Date()) + 'Websocket Connection accepted.');
                //debug("Client IP: "+request.url+".");

                connection.on('message', function (message) {
                    try {
                        if (message.type === 'utf8') {
                            //debug('Received Message: ' + message.utf8Data);
                            Process_WebSocket_Incomming_Message(connection, message.utf8Data);
                        }
                        else if (message.type === 'binary') {
                            //debug('Received Binary Message of ' + message.binaryData.length + ' bytes');
                            Process_WebSocket_Incomming_Binary_Data(connection, message.binaryData);
                        }
                    }
                    catch (e) {
                        debug("[WebSocket] message() Error " + e);
                    }
                });
                connection.on('close', function (reasonCode, description) {
                    try {
                        //debug((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
                        for (var i = 0; i < websocket_connection_list.length; i++) {
                            if (websocket_connection_list[i] == connection) {
                                websocket_connection_list.splice(i);
                                break;
                            }
                        }
                    }
                    catch (e) {
                        debug("[WebSocket] call Find_User_By_Session_Token() Error " + e);
                    }
                });
            }
            catch (e) {
                debug("[WebSocket] request() Error " + e);
            }
        });
    }
    catch (e) {
        debug("[WebSocket] WebSocket_Server_Init() Error " + e);
    }
}

// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

async function Process_WebSocket_Incomming_Message(src_connection, data) {
    try {
        var json_data = JSON.parse(data);
        if (json_data != null) {
            if (json_data.method != null && json_data.topic != null) {
                switch (json_data.method) {
                    case "POST":
                        for (i = 0; i < registered_ws_topic_list.length; i++) {
                            if (registered_ws_topic_list[i] == json_data.topic) {
                                if (registered_ws_topic_post_callback_list[i] != null) {
                                    await registered_ws_topic_post_callback_list[i](src_connection.username, json_data);
                                    break;
                                }
                            }
                        }
                        break;
                    case "GET":
                        for (i = 0; i < registered_ws_topic_list.length; i++) {
                            if (registered_ws_topic_list[i] == json_data.topic) {
                                if (registered_ws_topic_get_callback_list[i] != null) {
                                    var rsp_json = await registered_ws_topic_get_callback_list[i](src_connection.username, json_data);
                                    if (rsp_json != null) {
                                        rsp_json.method = "GET_RSP";
                                        do_WebSocket_Send_Message(src_connection, 'utf8', JSON.stringify(rsp_json));
                                    }
                                    break;
                                }
                            }
                        }
                        break;
                }
            }
            else {
                debug("Invalid Method");
            }
        }
        else {
            debug("Invalid JSON Data");
        }
    }
    catch (e) {
        debug("[WebSocket] Process_WebSocket_Incomming_Message() Error " + e);
    }
}

function Process_WebSocket_Incomming_Binary_Data(src_connection, data) {
    try {
    }
    catch (e) {
        debug("[WebSocket] Process_WebSocket_Incomming_Binary_Data() Error " + e);
    }
}

function do_WebSocket_Send_Message(dst_connection, data_type, data) {
    try {
        if (data_type === 'utf8') {
            dst_connection.sendUTF(data);
        }
        else if (data_type === 'binary') {
            dst_connection.sendBytes(data);
        }
    }
    catch (e) {
        debug("[WebSocket] do_WebSocket_Send_Message() Error " + e);
    }
}

function WebSocket_Send_Brocast_Message(data_type, data) {
    try {
        for (var i = 0; i < websocket_connection_list.length; i++) {
            if (websocket_connection_list[i] != null && websocket_connection_list[i] != 0) {
                do_WebSocket_Send_Message(websocket_connection_list[i], data_type, data);
            }
        }
    }
    catch (e) {
        debug("[WebSocket] WebSocket_Send_Brocast_Message() Error " + e);
    }
}

function WebSocket_Send_JSON_Message(dst_connection, json_data) {
    try {
        do_WebSocket_Send_Message(dst_connection, 'utf8', JSON.stringify(json_data));
    }
    catch (e) {
        debug("[WebSocket] WebSocket_Send_JSON_Message() Error " + e);
    }
}

function WebSocket_Send_Broadcast_JSON_Message(json_data) {
    try {
        WebSocket_Send_Brocast_Message('utf8', JSON.stringify(json_data));
    }
    catch (e) {
        debug("[WebSocket] WebSocket_Send_Broadcast_JSON_Message() Error " + e);
    }
}

function WebSocket_Send_Broadcast_JSON_Message_Specific_User(username, json_data) {
    try {
        if(username=="everyone")
        {
            WebSocket_Send_Broadcast_JSON_Message(json_data);
        }
        else{
            for (var i = 0; i < websocket_connection_list.length; i++) {
                if (websocket_connection_list[i] != null && websocket_connection_list[i] != 0) {
                    if (websocket_connection_list[i].username != null && websocket_connection_list[i].username == username) {
                        WebSocket_Send_JSON_Message(websocket_connection_list[i], json_data);
                    }
                }
            }
        }
    }
    catch (e) {
        debug("[WebSocket] WebSocket_Send_Broadcast_JSON_Message() Error " + e);
    }
}

var WebSocket = function () {
    var self = this;

    self.WebSocket_Init = function () {
        try {
            WebSocket_Server_Init();
        }
        catch (e) {
            debug("[WebSocket] WebSocket_Init() Error " + e);
        }
    };
    self.WebSocket_Send_Brocast_Message = function (data_type, data) {
        try {
            WebSocket_Send_Brocast_Message(data_type, data);
        }
        catch (e) {
            debug("[WebSocket] WebSocket_Send_Brocast_Message() Error " + e);
        }
    };
    self.WebSocket_Send_JSON_Message = function (dst_connection, json_data) {
        try {
            WebSocket_Send_JSON_Message(dst_connection, json_data);
        }
        catch (e) {
            debug("[WebSocket] WebSocket_Send_JSON_Message() Error " + e);
        }
    };
    self.WebSocket_Send_Broadcast_JSON_Message = function (json_data) {
        try {
            WebSocket_Send_Broadcast_JSON_Message(json_data);
        }
        catch (e) {
            debug("[WebSocket] WebSocket_Send_Broadcast_JSON_Message() Error " + e);
        }
    };
    self.WebSocket_Send_JSON_POST_Message = function (dst_connection, topic, json_data) {
        try {
            var json_cmd = {
                method: "POST",
                topic: topic
            }
            var json_body = Object.assign({}, json_cmd, json_data);
            
            WebSocket_Send_JSON_Message(dst_connection, json_body);
        }
        catch (e) {
            debug("[WebSocket] WebSocket_Send_JSON_POST_Message() Error " + e);
        }
    };
    self.WebSocket_Send_JSON_GET_Message = function (dst_connection, topic, json_data) {
        try {
            var json_cmd = {
                method: "GET",
                topic: topic
            }
            var json_body = Object.assign({}, json_cmd, json_data);
            
            WebSocket_Send_JSON_Message(dst_connection, json_body);
        }
        catch (e) {
            debug("[WebSocket] WebSocket_Send_JSON_GET_Message() Error " + e);
        }
    };
    self.WebSocket_Send_Broadcast_JSON_POST_Message = function (topic, json_data) {
        try {
            var json_cmd = {
                method: "POST",
                topic: topic
            }
            var json_body = Object.assign({}, json_cmd, json_data);
            
            WebSocket_Send_Broadcast_JSON_Message(json_body);
        }
        catch (e) {
            debug("[WebSocket] WebSocket_Send_Broadcast_JSON_POST_Message() Error " + e);
        }
    };
    self.WebSocket_Send_Broadcast_JSON_GET_Message = function (topic, json_data) {
        try {
            var json_cmd = {
                method: "GET",
                topic: topic
            }
            var json_body = Object.assign({}, json_cmd, json_data);
            
            WebSocket_Send_Broadcast_JSON_Message(json_body);
        }
        catch (e) {
            debug("[WebSocket] WebSocket_Send_Broadcast_JSON_GET_Message() Error " + e);
        }
    };
    self.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User = function (username, topic, json_data) {
        try {
            var json_cmd = {
                method: "POST",
                topic: topic
            }
            var json_body = Object.assign({}, json_cmd, json_data);
            
            WebSocket_Send_Broadcast_JSON_Message_Specific_User(username, json_body);
        }
        catch (e) {
            debug("[WebSocket] WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User() Error " + e);
        }
    };
    self.WebSocket_Send_Broadcast_JSON_GET_Message_Specific_User = function (username, topic, json_data) {
        try {
            var json_cmd = {
                method: "GET",
                topic: topic
            }
            var json_body = Object.assign({}, json_cmd, json_data);
            
            WebSocket_Send_Broadcast_JSON_Message_Specific_User(username, json_body);
        }
        catch (e) {
            debug("[WebSocket] WebSocket_Send_Broadcast_JSON_GET_Message_Specific_User() Error " + e);
        }
    };
    self.Register_WebSocket_Topic_And_Callbacks = function (topic, post_callback, get_callback) {
        try {
            registered_ws_topic_list.push(topic);
            registered_ws_topic_post_callback_list.push(post_callback);
            registered_ws_topic_get_callback_list.push(get_callback);
        }
        catch (e) {
            debug("[WebSocket] Register_WebSocket_Topic_And_Callbacks() Error " + e);
        }
    };
};

module.exports = WebSocket;
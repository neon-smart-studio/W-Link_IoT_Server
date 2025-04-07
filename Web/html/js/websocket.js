
var websocket = null;
var onPostMessageCB = null;
var onGetMessageCB = null;

function websocket_init(serverURI, protocol, onConnect, onPostMessage, onGetMessage, onDisconnect, onError)
{
    var wsUri = "wss://"+serverURI+":8000/";
    websocket = new WebSocket(wsUri, protocol);
    websocket.onopen = onConnect;
    websocket.onclose = onDisconnect;
    websocket.onmessage = function (evt) { onMessage(evt); };
    websocket.onerror = onError;
    onPostMessageCB = onPostMessage;
    onGetMessageCB = onGetMessage;
}

function doWebSocketSend(message) {
    websocket.send(message);
}

function onMessage(evt) {
    var in_json = JSON.parse(evt.data);

    if (in_json.method != null) {
        switch (in_json.method) {
            case "POST":
                if(onPostMessageCB!=null)
                {
                    onPostMessageCB(in_json);
                }
                break;
            case "GET":
                if(onGetMessageCB!=null)
                {
                    var get_rsp_json;
                    get_rsp_json = onGetMessageCB(in_json);
                    doWebSocketSend(JSON.stringify(get_rsp_json));
                }
                break;
            case "GET_RSP":
                if (ws_get_sb != null) {
                    ws_get_sb(in_json);
                }
                break;
        }
    }
}

function Websocket_Send_POST_Command(topic, command) {
    var cmd = command;
    cmd.method = "POST";
    cmd.topic = topic;
    doWebSocketSend(JSON.stringify(cmd));
}

function Websocket_Send_GET_Command(topic, command, call_back) {
    var cmd = command;
    cmd.method = "GET";
    cmd.topic = topic;
    ws_get_sb = call_back;
    doWebSocketSend(JSON.stringify(cmd));
}

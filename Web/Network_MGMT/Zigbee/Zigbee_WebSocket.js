
var debug = require('debug')(require('path').basename(__filename));

var Zigbee = require('../../../Zigbee/Zigbee.js');
var zigbee = new Zigbee();

var Zigbee_WebSocket = function (){
    var self = this;
    
    self.Process_Zigbee_Topic_WebSocket_POST_Message = async function(username, post_json_data)
    {
        try{
            if(post_json_data.command!=null){
                switch(post_json_data.command){
                    case "Permit New Device Join":
                        await zigbee.Zigbee_Permit_Join();
                        break;
                    case "Prohibit New Device Join":
                        await zigbee.Zigbee_Prohibit_Join();
                        break;
                }
            }
        }
        catch(e)
        {
            debug('[Zigbee_WebSocket] Process_Zigbee_Topic_WebSocket_POST_Message() Error ' + e);
        }
    }

    self.Process_Zigbee_Topic_WebSocket_GET_Message = async function(username, get_json_data)
    {
        try{
            var rsp_json = null;
            if(get_json_data.command!=null){
                switch(get_json_data.command){
                    case "Get Zigbee Join State":
                        var permit_state = await zigbee.Zigbee_Get_Join_Statue();
                        var remain_time = 0;
                        if(permit_state)
                        {
                            remain_time = await zigbee.Zigbee_Get_Join_Remain_Time();
                        }
                        rsp_json = {
                            permit_join: permit_state,
                            remain_time: remain_time
                        }
                        break;
                }
            }
            return rsp_json;
        }
        catch(e)
        {
            debug('[Zigbee_WebSocket] Process_Zigbee_Topic_WebSocket_GET_Message() Error ' + e);
        }
    }
}
module.exports = Zigbee_WebSocket;


var debug = require('debug')(require('path').basename(__filename));

var Record_MGR = require('../../Util/Record_MGR.js');
var record_mgr = new Record_MGR();

var Records_WebSocket = function (){
    var self = this;
    
    self.Process_Records_Topic_WebSocket_POST_Message = async function(username, post_record_json_data)
    {
        try{
            if(post_record_json_data.command!=null){
                switch(post_record_json_data.command){
                }
            }
        }
        catch(e)
        {
            debug('[Records_WebSocket] Process_Records_WebSocket_GET_Message() Error ' + e);
        }
    }

    self.Process_Records_Topic_WebSocket_GET_Message = async function(username, get_record_json_data)
    {
        try{
            var rsp_json = null;

            if(get_record_json_data.command!=null){
                switch(get_record_json_data.command){
                    case "Get Device Record History":
                        var max_data_count = null;
                        if(get_record_json_data.max_data_count!=null){
                            max_data_count = get_record_json_data.max_data_count;
                        }
                        if(get_record_json_data.device_ID!=null){
                            if(get_record_json_data.start_date!=null || get_record_json_data.end_date!=null){
                                rsp_json = await record_mgr.Read_Device_State_Records(get_record_json_data.device_ID, get_record_json_data.start_date, get_record_json_data.end_date, max_data_count);
                            }
                        }
                        break;
                    case "Get Device Today Records":
                        if(get_record_json_data.device_ID!=null){
                            rsp_json = await record_mgr.Read_Device_State_Records_Today(get_record_json_data.device_ID);
                        }
                        break;
                }
            }

            return rsp_json;
        }
        catch(e)
        {
            debug('[Records_WebSocket] Process_Records_WebSocket_GET_Message() Error ' + e);
        }
    }
}
module.exports = Records_WebSocket;
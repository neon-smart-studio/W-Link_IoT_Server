
var debug = require('debug')(require('path').basename(__filename));

var WebSocket = require('../../../Web/WebSocket.js');
var websocket = new WebSocket();

var Lighting_Zigbee = function () {
    var self = this;

    self.Process_Lighting_Zigbee_Attribute_Report_Message = async function (device_ID, resolv_dev_info, endpoint, cluster, attribute_report_raw_json_data, attribute_report_resolved_json_data) {
        try {
            return null
        }
        catch (e) {
            debug("[Lighting_Zigbee] Process_Lighting_Zigbee_Attribute_Report_Message() Error " + e);
        }
    }
}
module.exports = Lighting_Zigbee;

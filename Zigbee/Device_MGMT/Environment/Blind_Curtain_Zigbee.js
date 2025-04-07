
var debug = require('debug')(require('path').basename(__filename));

var WebSocket = require('../../../Web/WebSocket.js');
var websocket = new WebSocket();

var Blind_Curtain_API_Zigbee = require('./Blind_Curtain_API_Zigbee.js');
var blind_curtain_api_zigbee = new Blind_Curtain_API_Zigbee();

var Blind_Curtain_Zigbee = function () {
    var self = this;

    self.Process_Blind_Curtain_Zigbee_Attribute_Report_Message = async function (device_ID, resolv_dev_info, endpoint, cluster, attribute_report_raw_json_data, attribute_report_resolved_json_data) {
        try {
            var lift_percentage = 0;
            
            switch (cluster) {
                case "genBasic":
                    return null;
                case "closuresWindowCovering":
                    switch(resolv_dev_info.device.modelID)
                    {
                        //IKEA
                        case "FYRTUR block-out roller blind":
                        case "KADRILJ roller blind":
                            lift_percentage = Math.round(attribute_report_raw_json_data.currentPositionLiftPercentage);
                            break;
                        //Xiaomi
                        case "lumi.curtain":
                        case "lumi.curtain.aq2":
                        case "lumi.curtain.hagl04":
                            lift_percentage = Math.round(attribute_report_raw_json_data.currentPositionLiftPercentage/255*100);
                            break;

                        default:
                            lift_percentage = Math.round(attribute_report_raw_json_data.currentPositionLiftPercentage/255*100);
                            break;
                    }
                break;
                case "genAnalogOutput":
                    switch(resolv_dev_info.device.modelID)
                    {
                        //Xiaomi
                        case "lumi.curtain":
                        case "lumi.curtain.aq2":
                        case "lumi.curtain.hagl04":
                            lift_percentage = await blind_curtain_api_zigbee.Blind_Curtain_Get_Current_Position(device_ID);
                            break;
                    }
                break;
            }
            
            ws_report_cmd = {
                "command_type": "Blind Curtain",
                "command": "Report Blind Curtain Status Change",
                "device_ID": device_ID,
                "lift_percentage": lift_percentage,
                "tilt_percentage": 100-lift_percentage
            }
            
            websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User('everyone', 'Environment', ws_report_cmd);

            return null;
        }
        catch (e) {
            debug("[Blind_Curtain_Zigbee] Process_Blind_Curtain_Zigbee_Attribute_Report_Message() Error " + e);
        }
    }
}
module.exports = Blind_Curtain_Zigbee;

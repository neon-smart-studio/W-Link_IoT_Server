
var debug = require('debug')(require('path').basename(__filename));

var WebSocket = require('../../../Web/WebSocket.js');
var websocket = new WebSocket();

var Zigbee_APP = require('../../Zigbee_APP.js');
var zigbee_app = new Zigbee_APP();

var Light_Sensor_Zigbee = function () {
    var self = this;

    self.Process_Light_Sensor_Zigbee_Attribute_Report_Message = async function (device_ID, resolv_dev_info, endpoint, cluster, attribute_report_raw_json_data, attribute_report_resolved_json_data) {
        try {
            var record_status_list = [];
            var sensor_status_list = [];
            var ws_report_cmd = {};

            switch (cluster) {
                case "genBasic":
                    return null;
                case "msIlluminanceMeasurement":
                    var measure_lux = 0;
                    switch(resolv_dev_info.device.modelID)
                    {
                        case "lumi.sen_ill.mgl01":
                            if(attribute_report_resolved_json_data==null) { return null; }
                            measure_lux = attribute_report_resolved_json_data.illuminance_lux;
                            break;
                        default:
                            measure_lux = attribute_report_raw_json_data.measuredValue;
                            break;
                    }

                    record_status_list.push({
                        "name": "measure_lux",
                        "value": measure_lux
                    });

                    sensor_status_list.push({
                        "sensor_index": 0,
                        "measure_lux": measure_lux
                    });

                    await zigbee_app.Zigbee_APP_Record_Measure_State(device_ID, record_status_list);
                    
                    await zigbee_app.Zigbee_APP_Trigger_Rule_Action("Light Sensor", device_ID, sensor_status_list);
                    
                    ws_report_cmd = {
                        "command_type": "Light Sensor",
                        "command": "Report Light Sensor Current Measure",
                        "device_ID": device_ID,
                        "num_of_light_sensor": 1,
                        "sensor_status_list": sensor_status_list
                    }

                    websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User('everyone', "Lighting", ws_report_cmd);
                    
                    break;
            }

            return null;
        }
        catch (e) {
            debug("[Light_Sensor_Zigbee] Process_Light_Sensor_Zigbee_Attribute_Report_Message() Error " + e);
        }
    }
}
module.exports = Light_Sensor_Zigbee;

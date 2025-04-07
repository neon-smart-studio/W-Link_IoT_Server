
var debug = require('debug')(require('path').basename(__filename));

var WebSocket = require('../../../Web/WebSocket.js');
var websocket = new WebSocket();

var Zigbee_APP = require('../../Zigbee_APP.js');
var zigbee_app = new Zigbee_APP();

var Collected_Attr_Data_Temperature = [];
var Collected_Attr_Data_Humidity = [];
var Collected_Attr_Data_Pressure = [];

var Collected_Attr_Data_Timeout_Timer = [];

function Is_Collected_All_Data(device_ID, resolv_dev_info)
{
    collect_all_attr_data_done = false;

    switch(resolv_dev_info.device.modelID)
    {
        case "lumi.sens":
        case "lumi.sensor_ht":
            if(Collected_Attr_Data_Temperature[device_ID]!=null &&
                Collected_Attr_Data_Humidity[device_ID]!=null)
            {
                collect_all_attr_data_done = true;
            }
            break;
        case "lumi.weather":
            if(Collected_Attr_Data_Temperature[device_ID]!=null &&
                Collected_Attr_Data_Humidity[device_ID]!=null &&
                Collected_Attr_Data_Pressure[device_ID]!=null)
            {
                collect_all_attr_data_done = true;
            }
            break;
        default:
            if(Collected_Attr_Data_Temperature[device_ID]!=null &&
                Collected_Attr_Data_Humidity[device_ID]!=null)
            {
                collect_all_attr_data_done = true;
            }
            break;
    }

    return collect_all_attr_data_done;
}

async function Collected_Data_Done_Handler(device_ID, resolv_dev_info)
{
    var record_status_list = [];
    var sensor_status_list = [];

    switch(resolv_dev_info.device.modelID)
    {
        case "lumi.sens":
        case "lumi.sensor_ht":
            record_status_list = [{
                "name": "measure_temperature",
                "value": Collected_Attr_Data_Temperature[device_ID]
            },{
                "name": "measure_humidity",
                "value": Collected_Attr_Data_Humidity[device_ID]
            }];

            sensor_status_list.push({
                "sensor_index": 0,
                "measure_temperature": Collected_Attr_Data_Temperature[device_ID],
                "measure_humidity": Collected_Attr_Data_Humidity[device_ID]
            });
            break;
        case "lumi.weather":
            record_status_list = [{
                "name": "measure_temperature",
                "value": Collected_Attr_Data_Temperature[device_ID]
            },{
                "name": "measure_humidity",
                "value": Collected_Attr_Data_Humidity[device_ID]
            },{
                "name": "measure_pressure",
                "value": Collected_Attr_Data_Pressure[device_ID]
            }];

            sensor_status_list.push({
                "sensor_index": 0,
                "measure_temperature": Collected_Attr_Data_Temperature[device_ID],
                "measure_humidity": Collected_Attr_Data_Humidity[device_ID],
                "measure_pressure": Collected_Attr_Data_Pressure[device_ID]
            });
            break;
        default:
            record_status_list = [{
                "name": "measure_temperature",
                "value": Collected_Attr_Data_Temperature[device_ID]
            },{
                "name": "measure_humidity",
                "value": Collected_Attr_Data_Humidity[device_ID]
            }];

            sensor_status_list.push({
                "sensor_index": 0,
                "measure_temperature": Collected_Attr_Data_Temperature[device_ID],
                "measure_humidity": Collected_Attr_Data_Humidity[device_ID]
            });
            break;
    }

    await zigbee_app.Zigbee_APP_Record_Measure_State(device_ID, record_status_list);

    await zigbee_app.Zigbee_APP_Trigger_Rule_Action("Humidity Sensor", device_ID, sensor_status_list);
    
    ws_report_cmd = {
        "command_type": "Humidity Sensor",
        "command": "Report Humidity Sensor Current Measure",
        "device_ID": device_ID,
        "num_of_humidity_sensor": 1,
        "sensor_status_list": sensor_status_list
    }

    websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User('everyone', 'Environment', ws_report_cmd);
}

async function Collected_Attr_Data_Timeout_CB(device_ID, resolv_dev_info)
{
    Collected_Attr_Data_Timeout_Timer[device_ID] = null;

    collect_all_attr_data_done = Is_Collected_All_Data(device_ID, resolv_dev_info);

    if(collect_all_attr_data_done)
    {
        await Collected_Data_Done_Handler(device_ID, resolv_dev_info);
    }
}

var Humidity_Sensor_Zigbee = function () {
    var self = this;

    self.Process_Humidity_Sensor_Zigbee_Attribute_Report_Message = async function (device_ID, resolv_dev_info, endpoint, cluster, attribute_report_raw_json_data, attribute_report_resolved_json_data) {
        try {
            if(attribute_report_resolved_json_data==null)
            {
                return null
            }
            
            var match_cluster = false;
            var collected_temperature = null;
            var collected_humidity = null;
            var collected_pressure = null;

            switch (cluster) {
                case "genBasic":
                    return null;
                case "msTemperatureMeasurement":
                    match_cluster = true;
                    switch(resolv_dev_info.device.modelID)
                    {
                        case "lumi.sens":
                        case "lumi.sensor_ht":
                        case "lumi.weather":
                            if(attribute_report_resolved_json_data==null) { return null; }
                            collected_temperature = attribute_report_resolved_json_data.temperature;
                            break;
                        default:
                            collected_temperature = attribute_report_raw_json_data.measuredValue;
                            break;
                    }
                break;
                case "msRelativeHumidity":
                    match_cluster = true;
                    switch(resolv_dev_info.device.modelID)
                    {
                        case "lumi.sens":
                        case "lumi.sensor_ht":
                        case "lumi.weather":
                            if(attribute_report_resolved_json_data==null) { return null; }
                            collected_humidity = attribute_report_resolved_json_data.humidity;
                            break;
                        default:
                            collected_humidity = attribute_report_raw_json_data.measuredValue;
                            break;
                    }
                break;
                case "msPressureMeasurement":
                    match_cluster = true;
                    switch(resolv_dev_info.device.modelID)
                    {
                        case "lumi.weather":
                            if(attribute_report_resolved_json_data==null) { return null; }
                            collected_pressure = attribute_report_resolved_json_data.pressure;
                            break;
                    }
                break;
            }
            
            if(match_cluster)
            {
                if(Collected_Attr_Data_Timeout_Timer[device_ID]==null)
                {
                    Collected_Attr_Data_Temperature[device_ID] = null;
                    Collected_Attr_Data_Humidity[device_ID] = null;
                    Collected_Attr_Data_Pressure[device_ID] = null;
                    Collected_Attr_Data_Timeout_Timer[device_ID] = setTimeout(Collected_Attr_Data_Timeout_CB, 1000, device_ID, resolv_dev_info);
                }

                if(collected_temperature!=null)
                {
                    Collected_Attr_Data_Temperature[device_ID] = collected_temperature;
                }
                if(collected_humidity!=null)
                {
                    Collected_Attr_Data_Humidity[device_ID] = collected_humidity;
                }
                if(collected_pressure!=null)
                {
                    Collected_Attr_Data_Pressure[device_ID] = collected_pressure;
                }
                
                if(Is_Collected_All_Data(device_ID, resolv_dev_info))
                {
                    clearTimeout(Collected_Attr_Data_Timeout_Timer[device_ID]);

                    Collected_Attr_Data_Timeout_Timer[device_ID] = null;

                    await Collected_Data_Done_Handler(device_ID, resolv_dev_info);
                }
            }

            return null
        }
        catch (e) {
            debug("[Humidity_Sensor_Zigbee] Process_Humidity_Sensor_Zigbee_Attribute_Report_Message() Error " + e);
        }
    }
}
module.exports = Humidity_Sensor_Zigbee;

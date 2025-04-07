
var debug = require('debug')(require('path').basename(__filename));

var Action = require('../Action/Action.js');
var action = new Action();

var Bind_MGR = require('../Util/Bind_MGR.js');
var bind_mgr = new Bind_MGR();

var Rule_MGR = require('../Util/Rule_MGR.js');
var rule_mgr = new Rule_MGR();

var Record_MGR = require('../Util/Record_MGR.js');
var record_mgr = new Record_MGR();

var MQTT_APP = function (){
    var self = this;
    
    self.MQTT_APP_Trigger_Bind_Action = async function (device_type, device_ID, trigger_node_index, trigger_node_state) {
        try {
            var trigger_endpoint = bind_mgr.Bind_Unbind_Resolve_Endpoint_Name(trigger_node_index, trigger_node_state);
            await bind_mgr.Trigger_Bind_Action(device_type, 'everyone', device_ID, trigger_endpoint, action.Execute_Action);
        }
        catch (e) {
            debug("[MQTT_APP] MQTT_APP_Trigger_Bind_Action() Error " + e);
        }
    };
    self.MQTT_APP_Trigger_Rule_Action = async function (device_type, device_ID, source_measure_status) {
        try {
            var source_attribute_info_list = [];
            if(Array.isArray(source_measure_status))
            {
                for(var i = 0; i<source_measure_status.length; i++)
                {
                    for(var key in source_measure_status[i])
                    {
                        if(key=="sensor_index" || key=="meter_index" || key=="switch_index" || key=="socket_index")
                        {
                            continue;
                        }
                        source_attribute_info_list.push({
                            source_endpoint: i,
                            attribute_name: key,
                            value: source_measure_status[i][key]
                        });
                    }
                }
            }
            else{
                for(var key in source_measure_status)
                {
                    source_attribute_info_list.push({
                        source_endpoint: 0,
                        attribute_name: key,
                        value: source_measure_status[key]
                    });
                }
            }
            await rule_mgr.Trigger_Rule_Action(device_type, 'everyone', device_ID, source_attribute_info_list, action.Execute_Action);
        }
        catch (e) {
            debug("[MQTT_APP] MQTT_APP_Trigger_Rule_Action() Error " + e);
        }
    };
    
    self.MQTT_APP_Record_Measure_State = async function (device_ID, measure_status) {
        try {
            await record_mgr.Record_Device_Measure_State(device_ID, measure_status);
        }
        catch (e) {
            debug("[MQTT_APP] MQTT_APP_Record_Measure_State() Error " + e);
        }
    };

    self.MQTT_APP_Record_Event_State = async function (device_ID, event_type, event_status) {
        try {
            await record_mgr.Record_Device_Event_State(device_ID, event_type, event_status);
        }
        catch (e) {
            debug("[MQTT_APP] MQTT_APP_Record_Event_State() Error " + e);
        }
    };
};
module.exports = MQTT_APP;

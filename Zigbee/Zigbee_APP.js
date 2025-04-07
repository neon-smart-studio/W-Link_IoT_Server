// Example express application adding the parse-server module to expose Parse
// compatible API routes.
var debug = require('debug')(require('path').basename(__filename));

var Action = require('../Action/Action.js');
var action = new Action();

var Bind_MGR = require('../Util/Bind_MGR.js');
var bind_mgr = new Bind_MGR();

var Rule_MGR = require('../Util/Rule_MGR.js');
var rule_mgr = new Rule_MGR();

var Record_MGR = require('../Util/Record_MGR.js');
var record_mgr = new Record_MGR();

/*
// Extensions
const ExtensionEntityPublish = require('./extension/entityPublish');
const ExtensionDeviceReceive = require('./extension/deviceReceive');
const ExtensionNetworkMap = require('./extension/networkMap');
const ExtensionSoftReset = require('./extension/softReset');
const ExtensionHomeAssistant = require('./extension/homeassistant');
const ExtensionDeviceConfigure = require('./extension/deviceConfigure');
const ExtensionDeviceGroupMembership = require('./extension/deviceGroupMembership');
const ExtensionBridgeConfig = require('./extension/bridgeConfig');
const ExtensionGroups = require('./extension/groups');
const ExtensionDeviceAvailability = require('./extension/deviceAvailability');
const ExtensionDeviceBind = require('./extension/deviceBind');
const ExtensionDeviceReport = require('./extension/deviceReport');
const ExtensionDeviceEvent = require('./extension/deviceEvent');
*/

var Zigbee_Node_Current_Status = [];

function do_Resolve_Cluster_Command(cluster, cluster_cmd, cluster_param, exec_command_topic, exec_command_type)
{
    var command_type = "";
    var command = "";
    var command_param = null;
    
    switch (cluster) {
        case "genOnOff":
            if(exec_command_topic=="Lighting")
            {
                command_type = "On Off";
                switch(cluster_cmd)
                {
                    case "commandOn":
                        command = "Turn On";
                        break;
                    case "commandOff":
                        command = "Turn Off";
                        break;
                    case "commandToggle":
                        command = "Toggle";
                        break;
                    case "commandOffWithEffect":
                        command = "Turn Off";
                        break;
                    case "commandOnWithTimedOff":
                        command = "Turn On With Timed Off";
                        command_param = {
                            keep_on_time: cmd_param.ontime/10,
                        }
                        break;
                }
            }
            else{
                command_type = exec_command_type;
                switch(exec_command_type)
                {
                    case "Air Valve":
                    case "Electromagnetic Valve":
                        switch(cluster_cmd)
                        {
                            case "commandOn":
                                command = "Set Main Switch On/Off State";
                                command_param = {
                                    on_off: true
                                }
                                break;
                            case "commandOff":
                                command = "Set Main Switch On/Off State";
                                command_param = {
                                    on_off: false
                                }
                                break;
                            case "commandToggle":
                                command = "Toggle Main Switch On/Off State";
                                break;
                        }
                        break;
                    case "Blind Curtain":
                        switch(cluster_cmd)
                        {
                            case "commandOn":
                                command = "Blind Curtain Open";
                                break;
                            case "commandOff":
                                command = "Blind Curtain Close";
                                break;
                            case "commandToggle":
                                command = "Blind Curtain Toggle State";
                                break;
                        }
                        break;
                    case "Pump Motor":
                        switch(cluster_cmd)
                        {
                            case "commandOn":
                                command = "Turn On Pump Motor";
                                break;
                            case "commandOff":
                                command = "Turn Off Pump Motor";
                                break;
                            case "commandToggle":
                                command = "Toggle Pump Motor On Off";
                                break;
                        }
                        break;
                    case "Circulating Fan":
                        switch(cluster_cmd)
                        {
                            case "commandOn":
                                command = "Turn On Circulating Fan";
                                break;
                            case "commandOff":
                                command = "Turn Off Circulating Fan";
                                break;
                            case "commandToggle":
                                command = "Toggle Circulating Fan On Off";
                                break;
                        }
                        break;
                    case "OnOff Socket":
                    case "Dimmable Socket":
                    case "Power Meter":
                        switch(cluster_cmd)
                        {
                            case "commandOn":
                                command = "Turn On All "+exec_command_type;
                                break;
                            case "commandOff":
                                command = "Turn Off All "+exec_command_type;
                                break;
                            case "commandToggle":
                                command = "Toggle All "+exec_command_type;
                                break;
                        }
                        break;
                }
            }
            break;
        case "genLevelCtrl":
            var with_on_off = false;
            if(exec_command_topic=="Lighting")
            {
                command_type = "Level";
                switch(cluster_cmd)
                {
                    case "commandMoveToLevelWithOnOff":
                        with_on_off = true;
                    case "commandMoveToLevel":
                        command = "Move To Level";
                        command_param = {
                            target_level: Math.round(cluster_param.level/254*100),
                            trans_time: cluster_param.transtime/10,
                            with_on_off: with_on_off
                        }
                        break;
                    case "commandStepWithOnOff":
                        with_on_off = true;
                    case "commandStep":
                        command = "Step Level";
                        var direction = null;
                        switch(cluster_param.stepmode)
                        {
                            case 0:
                                direction = "Up";
                                break;
                            case 1:
                                direction = "Down";
                                break;
                        }
                        command_param = {
                            direction:　direction,
                            step_level: Math.round(cluster_param.stepsize/254*100),
                            trans_time: cluster_param.transtime/100,
                            with_on_off: with_on_off
                        }
                        break;
                    case "commandMoveWithOnOff":
                        with_on_off = true;
                    case "commandMove":
                        command = "Move Level";
                        switch(cluster_param.movemode)
                        {
                            case 0:
                                direction = "Up";
                                break;
                            case 1:
                                direction = "Down";
                                break;
                        }
                        command_param = {
                            direction:　direction,
                            rate: Math.round(cluster_param.rate/254*100),
                            with_on_off: with_on_off
                        }
                        break;
                    case "commandStopWithOnOff":
                        with_on_off = true;
                    case "commandStop":
                        command = "Stop Command";
                        command_param = {
                            with_on_off: with_on_off
                        }
                        break;
                }
            }
            else{
                command_type = exec_command_type;
                switch(exec_command_type)
                {
                    case "Blind Curtain":
                        switch(cluster_cmd)
                        {
                            case "commandMoveToLevel":
                                command = "Blind Curtain Move To Position";
                                break;
                            case "commandStop":
                                command = "Blind Curtain Stop Moving";
                                break;
                        }
                        break;
                    case "Circulating Fan":
                        switch(cluster_cmd)
                        {
                            case "commandMoveToLevel":
                                command = "Circulating Fan Set PWM Level";
                                break;
                            case "commandStepWithOnOff":
                            case "commandStep":
                                var direction = null;
                                switch(cluster_param.stepmode)
                                {
                                    case 0:
                                        command = "Circulating Fan Step PWM Level Up";
                                        command_param = {
                                            step_up_size: Math.round(cluster_param.stepsize/254*100)
                                        }
                                        break;
                                    case 1:
                                        command = "Circulating Fan Step PWM Level Down";
                                        command_param = {
                                            step_down_size: Math.round(cluster_param.stepsize/254*100)
                                        }
                                        break;
                                }
                                break;
                        }
                        break;
                    case "Dimmable Socket":
                        switch(cluster_cmd)
                        {
                            case "commandMoveToLevel":
                                command = "All Dimmable Socket Set Pwm Level";
                                break;
                        }
                        break;
                }
            }
            
            case "closuresWindowCovering":
                if(exec_command_topic=="Lighting")
                {
                    command_type = "Level";
                    switch(cluster_cmd)
                    {
                        case "commandUpOpen":
                            command = "Move Level";
                            command_param = {
                                direction: "Up",
                                rate: 64,
                                with_on_off: true
                            }
                            break;
                        case "commandDownClose":
                            command = "Move Level";
                            command_param = {
                                direction: "Down",
                                rate: 64,
                                with_on_off: true
                            }
                            break;
                        case "commandStop":
                            command = "Stop Command";
                            break;
                    }
                }
                else{
                    command_type = exec_command_type;
                    switch(exec_command_type)
                    {
                        case "Air Valve":
                        case "Electromagnetic Valve":
                            switch(cluster_cmd)
                            {
                                case "commandUpOpen":
                                    command = "Set Main Switch On/Off State";
                                    command_param = {
                                        on_off: true
                                    }
                                    break;
                                case "commandDownClose":
                                    command = "Set Main Switch On/Off State";
                                    command_param = {
                                        on_off: false
                                    }
                                    break;
                            }
                            break;
                        case "Blind Curtain":
                            switch(cluster_cmd)
                            {
                                case "commandUpOpen":
                                    command = "Blind Curtain Open";
                                    break;
                                case "commandDownClose":
                                    command = "Blind Curtain Close";
                                    break;
                                case "commandStop":
                                    command = "Blind Curtain Stop Moving";
                                    break;
                            }
                            break;
                        case "Pump Motor":
                            switch(cluster_cmd)
                            {
                                case "commandUpOpen":
                                    command = "Turn On Pump Motor";
                                    break;
                                case "commandDownClose":
                                    command = "Turn Off Pump Motor";
                                    break;
                            }
                            break;
                        case "Circulating Fan":
                            switch(cluster_cmd)
                            {
                                case "commandUpOpen":
                                    command = "Turn On Circulating Fan";
                                    break;
                                case "commandDownClose":
                                    command = "Turn Off Circulating Fan";
                                    break;
                            }
                            break;
                        case "OnOff Socket":
                        case "Dimmable Socket":
                        case "Power Meter":
                            switch(cluster_cmd)
                            {
                                case "commandUpOpen":
                                    command = "Turn On All "+exec_command_type;
                                    break;
                                case "commandDownClose":
                                    command = "Turn Off All "+exec_command_type;
                                    break;
                            }
                            break;
                    }
                }
            break;
    }

    return {
        command_topic: exec_command_topic,
        command_type: command_type,
        command: command,
        command_param: command_param
    }
}

var Zigbee_APP = function () {
    var self = this;

    self.Zigbee_APP_Trigger_Bind_Action = async function (device_type, device_ID, trigger_node_index, trigger_node_state) {
        try {
            var trigger_endpoint = bind_mgr.Bind_Unbind_Resolve_Endpoint_Name(trigger_node_index, trigger_node_state);
            await bind_mgr.Trigger_Bind_Action(device_type, 'everyone', device_ID, trigger_endpoint, action.Execute_Action);
        }
        catch (e) {
            debug("[Zigbee_APP] Zigbee_APP_Trigger_Bind_Action() Error " + e);
        }
    };
    self.Zigbee_APP_Trigger_Default_Cluster_Action = async function (device_type, device_ID, cluster_name, cluster_cmd, cmd_param, node_index) {
        try {
            var action_info = await bind_mgr.Get_Bind_Action_Info(device_type, "everyone", device_ID, node_index+":default");
            if(action_info==null){return;}
            if(action_info.enabled==false){return;}
    
            var resolved_exec_command = do_Resolve_Cluster_Command(cluster_name, cluster_cmd, cmd_param, action_info.command_topic, action_info.command_type);
    
            action.Execute_Action(action_info.target_address_ID, resolved_exec_command.command_topic, resolved_exec_command.command_type, resolved_exec_command.command, resolved_exec_command.command_param);
        }
        catch (e) {
            debug("[Zigbee_APP] Zigbee_APP_Trigger_Bind_Action() Error " + e);
        }
    };
    self.Zigbee_APP_Trigger_Rule_Action = async function (device_type, device_ID, source_measure_status) {
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
            debug("[Zigbee_APP] Zigbee_APP_Trigger_Rule_Action() Error " + e);
        }
    };
    
    self.Zigbee_APP_Record_Measure_State = async function (device_ID, measure_status) {
        try {
            if(Zigbee_Node_Current_Status[device_ID]==null)
            {
                Zigbee_Node_Current_Status[device_ID] = {
                    measure_status: measure_status
                };
            }
            else{
                Zigbee_Node_Current_Status[device_ID]["measure_status"] = measure_status;
            }
            await record_mgr.Record_Device_Measure_State(device_ID, measure_status);
        }
        catch (e) {
            debug("[Zigbee_APP] Zigbee_APP_Record_Measure_State() Error " + e);
        }
    };

    self.Zigbee_APP_Record_Event_State = async function (device_ID, event_type, event_status) {
        try {
            if(Zigbee_Node_Current_Status[device_ID]==null)
            {
                Zigbee_Node_Current_Status[device_ID] = {
                    event_type: event_type,
                    event_status: event_status
                };
            }
            else{
                Zigbee_Node_Current_Status[device_ID]["event_type"] = event_type;
                Zigbee_Node_Current_Status[device_ID]["event_status"] = event_status;
            }
            await record_mgr.Record_Device_Event_State(device_ID, event_type, event_status);
        }
        catch (e) {
            debug("[Zigbee_APP] Zigbee_APP_Record_Event_State() Error " + e);
        }
    };
    
    self.Zigbee_APP_Get_Measure_State = function (device_ID) {
        try {
            if(Zigbee_Node_Current_Status[device_ID]!=null)
            {
                return Zigbee_Node_Current_Status[device_ID]["measure_status"];
            }
            return null;
        }
        catch (e) {
            debug("[Zigbee_APP] Zigbee_APP_Get_Measure_State() Error " + e);
        }
    };

    self.Zigbee_APP_Get_Last_Event_State = function (device_ID) {
        try {
            if(Zigbee_Node_Current_Status[device_ID]!=null)
            {
                return {
                    event_type: Zigbee_Node_Current_Status[device_ID]["event_type"],
                    event_status: Zigbee_Node_Current_Status[device_ID]["event_status"]
                };
            }
            else{
                return null;
            }
        }
        catch (e) {
            debug("[Zigbee_APP] Zigbee_APP_Get_Last_Event_State() Error " + e);
        }
    };
};


module.exports = Zigbee_APP;
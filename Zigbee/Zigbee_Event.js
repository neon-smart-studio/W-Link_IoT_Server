// Example express application adding the parse-server module to expose Parse
// compatible API routes.
var debug = require('debug')(require('path').basename(__filename));

var Zigbee = require('./Zigbee');
var zigbee = new Zigbee();
var State = require('./state');
var state = new State();

var WebSocket = require('../Web/WebSocket.js');
var websocket = new WebSocket();

var Device_MGMT_Zigbee = require('./Device_MGMT/Device_MGMT_Zigbee');
var device_mgmt_zigbee = new Device_MGMT_Zigbee();

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

async function Report_Join_Status_Change(username)
{
    var permit_state = await zigbee.Zigbee_Get_Join_Statue();
    var remain_time = 0;
    if(permit_state)
    {
        remain_time = zigbee.Zigbee_Get_Join_Remain_Time();
    }

    ws_report_cmd = {
        command: "Report Zigbee Join Status Change",
        permit_join: permit_state,
        remain_time: remain_time
    }
    
    websocket.WebSocket_Send_Broadcast_JSON_POST_Message_Specific_User(username, 'Zigbee', ws_report_cmd);
}

function Zigbee_OnPermitJoin_Event()
{
    Report_Join_Status_Change("everyone");
}

function Zigbee_OnProhibitJoin_Event()
{
    Report_Join_Status_Change("everyone");
}

function Zigbee_OnDeviceInterview_Event(ieeeaddr, resolv_dev_info)
{
    if(resolv_dev_info.mapped==null)
    {
        return;
    }

    var indexOfHexTag = ieeeaddr.indexOf("x");
    var device_ID = (indexOfHexTag>=0) ? ieeeaddr.substring(indexOfHexTag+1) : ieeeaddr;

    device_mgmt_zigbee.Process_Zigbee_Device_Interview_Event(device_ID, resolv_dev_info);
}

function Zigbee_OnDeviceAnnce_Event(ieeeaddr, resolv_dev_info)
{
    if(resolv_dev_info.mapped==null)
    {
        return;
    }

    var indexOfHexTag = ieeeaddr.indexOf("x");
    var device_ID = (indexOfHexTag>=0) ? ieeeaddr.substring(indexOfHexTag+1) : ieeeaddr;

    device_mgmt_zigbee.Process_Zigbee_Device_Annce_Event(device_ID, resolv_dev_info);
}

function Zigbee_OnDeviceClusterCommand_Event(ieeeaddr, resolv_dev_info, endpoint, cluster, command, data, meta, resolved_data)
{
    if(resolv_dev_info.mapped==null)
    {
        return;
    }

    var indexOfHexTag = ieeeaddr.indexOf("x");
    var device_ID = (indexOfHexTag>=0) ? ieeeaddr.substring(indexOfHexTag+1) : ieeeaddr;

    device_mgmt_zigbee.Process_Zigbee_Device_Cluster_Command_Event(device_ID, resolv_dev_info, endpoint, cluster, command, data, meta, resolved_data);
}

function Zigbee_OnDeviceAttributeReport_Event(ieeeaddr, resolv_dev_info, endpoint, cluster, data, meta, resolved_data)
{
    if(resolv_dev_info.mapped==null)
    {
        return;
    }

    var indexOfHexTag = ieeeaddr.indexOf("x");
    var device_ID = (indexOfHexTag>=0) ? ieeeaddr.substring(indexOfHexTag+1) : ieeeaddr;

    device_mgmt_zigbee.Process_Zigbee_Device_Attribute_Report_Event(device_ID, resolv_dev_info, endpoint, cluster, data, meta, resolved_data);
}

var Zigbee_Event = function () {
    var self = this;

    self.Zigbee_Event_Init = function () {
        try {
            zigbee.Zigbee_Register_Callbacks(Zigbee_OnPermitJoin_Event, 
                                                Zigbee_OnProhibitJoin_Event, 
                                                Zigbee_OnDeviceInterview_Event, 
                                                Zigbee_OnDeviceAnnce_Event, 
                                                null, 
                                                Zigbee_OnDeviceClusterCommand_Event, 
                                                Zigbee_OnDeviceAttributeReport_Event);
        }
        catch (e) {
            debug("[Zigbee_Event] Zigbee_Event() Error " + e);
        };
    };
};


module.exports = Zigbee_Event;

var debug = require('debug')(require('path').basename(__filename));

var events=require('events');
var event_emitter=new events.EventEmitter();

var Action = require('../../Action/Action.js');
var action = new Action();

var Bind_MGR = require('../../Util/Bind_MGR.js');
var bind_mgr = new Bind_MGR();

var Device_MGMT_API = require('../../Device_MGMT/Device_MGMT_API.js');
var device_mgmt_api = new Device_MGMT_API();

var Zigbee_Device_Philips = require('./Zigbee_Device_Philips.js');
var zigbee_device_philips = new Zigbee_Device_Philips();

var Zigbee_Device_IKEA = require('./Zigbee_Device_IKEA.js');
var zigbee_device_ikea = new Zigbee_Device_IKEA();

var Zigbee_Device_GE = require('./Zigbee_Device_GE.js');
var zigbee_device_ge = new Zigbee_Device_GE();

var Zigbee_Device_Xiaomi = require('./Zigbee_Device_Xiaomi.js');
var zigbee_device_xiaomi = new Zigbee_Device_Xiaomi();

var OnOff_Switch_Zigbee = require('./Accessories/OnOff_Switch_Zigbee.js');
var onoff_switch_zigbee = new OnOff_Switch_Zigbee();

var Dimmable_Switch_Zigbee = require('./Accessories/Dimmable_Switch_Zigbee.js');
var dimmable_switch_zigbee = new Dimmable_Switch_Zigbee();

var Toggle_Switch_Zigbee = require('./Accessories/Toggle_Switch_Zigbee.js');
var toggle_switch_zigbee = new Toggle_Switch_Zigbee();

var Scene_Switch_Zigbee = require('./Accessories/Scene_Switch_Zigbee.js');
var scene_switch_zigbee = new Scene_Switch_Zigbee();

var Motion_Sensor_Zigbee = require('./Accessories/Motion_Sensor_Zigbee.js');
var motion_sensor_zigbee = new Motion_Sensor_Zigbee();

var OnOff_Socket_Zigbee = require('./ElectricPower/OnOff_Socket_Zigbee.js');
var onoff_socket_zigbee = new OnOff_Socket_Zigbee();

var Lighting_API_Zigbee = require('./Lighting/Lighting_API_Zigbee.js');
var lighting_api_zigbee = new Lighting_API_Zigbee();

var Lighting_Zigbee = require('./Lighting/Lighting_Zigbee.js');
var lighting_zigbee = new Lighting_Zigbee();

var Light_Sensor_Zigbee = require('./Lighting/Light_Sensor_Zigbee.js');
var light_sensor_zigbee = new Light_Sensor_Zigbee();

var Blind_Curtain_Zigbee = require('./Environment/Blind_Curtain_Zigbee.js');
var blind_curtain_zigbee = new Blind_Curtain_Zigbee();

var Humidity_Sensor_Zigbee = require('./Environment/Humidity_Sensor_Zigbee.js');
var humidity_sensor_zigbee = new Humidity_Sensor_Zigbee();

event_emitter.on('ZigbeeExecAction', function(target_address_ID, command_topic, command_type, command, param_json_data){
    try{
        action.Execute_Action(target_address_ID, command_topic, command_type, command, param_json_data)
    }
    catch(e)
    {
        debug("[Bind_MGR] Execute_Bind_Action() Error: " + e);
    }
});

function Do_Resolve_Zigbee_Device_Type(resolv_dev_info)
{
    var supports = null;
    var vendor = null;

    if(resolv_dev_info.mapped==null)
    {
        return null;
    }

    if(resolv_dev_info.mapped.extend!=null)
    {
        supports = resolv_dev_info.mapped.extend.supports;
    }

    else if(resolv_dev_info.mapped.supports!=null)
    {
        supports = resolv_dev_info.mapped.supports;
    }

    if(supports==null)
    {
        return null;
    }
    
    vendor = resolv_dev_info.mapped.vendor;

    var device_Type = null;

    switch(supports)
    {
        case 'on/off, power-on behavior':
            //OnOff Light
            device_Type = "OnOff Light";
            break;
        case 'on/off, brightness':
        case 'on/off, brightness, power-on behavior':
            //Dimmable Light
            device_Type = "Dimmable Light";
            break;
        case 'on/off, brightness, color temperature':
        case 'on/off, brightness, color temperature, power-on behavior':
            //Color Temperature Light
            device_Type = "Color Temperature Light";
            break;
        case 'on/off, brightness, color xy':
        case 'on/off, brightness, color xy, power-on behavior':
            //Colored Light
            device_Type = "Colored Light";
            break;
        case 'on/off, brightness, color temperature, color xy':
        case 'on/off, brightness, color temperature, color xy, power-on behavior':
            //Extended Colored Light
            device_Type = "Extended Color Light";
            break;
        default:
            {
                switch(vendor)
                {
                    case "Philips":
                        device_Type = zigbee_device_philips.Do_Resolve_Philips_Zigbee_Device_Type(resolv_dev_info);
                        break;
                    case "Quirky":
                    case "GE":
                        device_Type = zigbee_device_ge.Do_Resolve_GE_Zigbee_Device_Type(resolv_dev_info);
                        break;
                    case "IKEA":
                        device_Type = zigbee_device_ikea.Do_Resolve_IKEA_Zigbee_Device_Type(resolv_dev_info);
                        break;
                    case "Xiaomi":
                        device_Type = zigbee_device_xiaomi.Do_Resolve_Xiaomi_Zigbee_Device_Type(resolv_dev_info);
                        break;
                }
            }
            break;
    }
    return device_Type;
}

async function Device_MGMT_Zigbee_Device_Notify_Event(event_type, device_Type, device_ID, resolv_dev_info)
{
    switch(device_Type)
    {
        case "Dimmable Light":
        case "Color Temperature Light":
        case "Colored Light":
        case "Extended Color Light":
            switch(event_type)
            {
                case "Interview":
                    await lighting_api_zigbee.Zigbee_Light_Identify_With_Effect(device_ID, "OK");
                    break;
                case "Annce":
                    await lighting_api_zigbee.Zigbee_Light_Identify_With_Effect(device_ID, "Blink");
                    break;
            }
            break;
    }
}

function Device_MGMT_Zigbee_Handle_Device_Annce_Interview_Event(event_type, device_ID, resolv_dev_info)
{
    try{
        var device_Type = Do_Resolve_Zigbee_Device_Type(resolv_dev_info);

        if(device_Type!=null)
        {
            var devInf = {
                "device_ID":device_ID,
                "device_Name":resolv_dev_info.mapped.description,
                "network_Type":"Zigbee",
                "device_Type":device_Type,
                "zigbee_device_info":resolv_dev_info.device
            };

            device_mgmt_api.Device_MGMT_Save_Device_Info('everyone', device_Type, device_ID, devInf);

            Device_MGMT_Zigbee_Device_Notify_Event(event_type, devInf.device_Type, device_ID, resolv_dev_info);
        }
    }
    catch(e)
    {
        debug("[Device_MGMT_Zigbee] Device_MGMT_Handle_Device_Annce() Error " + e);
    }
}

async function Device_MGMT_Zigbee_Handle_Device_Cluster_Command_Event(device_ID, resolv_dev_info, endpoint, cluster, command, data, meta, resolved_data)
{
    try{
        var device_Type = Do_Resolve_Zigbee_Device_Type(resolv_dev_info);

        if(device_Type!=null)
        {
            switch(device_Type)
            {
                case "OnOff Switch":
                    await onoff_switch_zigbee.Process_OnOff_Switch_Zigbee_Cluster_Command_Message(device_ID, resolv_dev_info, endpoint, cluster, command, data, resolved_data);
                    break;
                case "Dimmable Switch":
                    await dimmable_switch_zigbee.Process_Dimmable_Switch_Zigbee_Cluster_Command_Message(device_ID, resolv_dev_info, endpoint, cluster, command, data, resolved_data);
                    break;
                case "Toggle Switch":
                    await toggle_switch_zigbee.Process_Toggle_Switch_Zigbee_Cluster_Command_Message(device_ID, resolv_dev_info, endpoint, cluster, command, data, resolved_data);
                    break;
                case "Scene Switch":
                    await scene_switch_zigbee.Process_Scene_Switch_Zigbee_Cluster_Command_Message(device_ID, resolv_dev_info, endpoint, cluster, command, data, resolved_data);
                    break;
                case "Motion Sensor":
                    await motion_sensor_zigbee.Process_Motion_Sensor_Zigbee_Cluster_Command_Message(device_ID, resolv_dev_info, endpoint, cluster, command, data, resolved_data);
                    break;
            }
        }
    }
    catch(e)
    {
        debug("[Device_MGMT_Zigbee] Device_MGMT_Handle_Device_Annce() Error " + e);
    }
}

async function Device_MGMT_Zigbee_Handle_Device_Attribute_Report_Event(device_ID, resolv_dev_info, endpoint, cluster, data, meta, resolved_data)
{
    try{
        var device_Type = Do_Resolve_Zigbee_Device_Type(resolv_dev_info);

        if(device_Type!=null)
        {
            switch(device_Type)
            {
                case "OnOff Switch":
                    await onoff_switch_zigbee.Process_OnOff_Switch_Zigbee_Attribute_Report_Message(device_ID, resolv_dev_info, endpoint, cluster, data, resolved_data);
                    break;
                case "Dimmable Switch":
                    await dimmable_switch_zigbee.Process_Dimmable_Switch_Zigbee_Attribute_Report_Message(device_ID, resolv_dev_info, endpoint, cluster, data, resolved_data);
                    break;
                case "Toggle Switch":
                    await toggle_switch_zigbee.Process_Toggle_Switch_Zigbee_Attribute_Report_Message(device_ID, resolv_dev_info, endpoint, cluster, data, resolved_data);
                    break;
                case "Scene Switch":
                    await scene_switch_zigbee.Process_Scene_Switch_Zigbee_Attribute_Report_Message(device_ID, resolv_dev_info, endpoint, cluster, data, resolved_data);
                    break;
                case "OnOff Socket":
                    await onoff_socket_zigbee.Process_OnOff_Socket_Zigbee_Attribute_Report_Message(device_ID, resolv_dev_info, endpoint, cluster, data, resolved_data);
                    break;
                case "Dimmable Light":
                case "Color Temperature Light":
                case "Colored Light":
                case "Extended Color Light":
                    break;
                case "Motion Sensor":
                    await motion_sensor_zigbee.Process_Motion_Sensor_Zigbee_Attribute_Report_Message(device_ID, resolv_dev_info, endpoint, cluster, data, resolved_data);
                    break;
                case "Light Sensor":
                    await light_sensor_zigbee.Process_Light_Sensor_Zigbee_Attribute_Report_Message(device_ID, resolv_dev_info, endpoint, cluster, data, resolved_data);
                    break;
                case "Blind Curtain":
                    await blind_curtain_zigbee.Process_Blind_Curtain_Zigbee_Attribute_Report_Message(device_ID, resolv_dev_info, endpoint, cluster, data, resolved_data);
                    break;
                case "Humidity Sensor":
                    await humidity_sensor_zigbee.Process_Humidity_Sensor_Zigbee_Attribute_Report_Message(device_ID, resolv_dev_info, endpoint, cluster, data, resolved_data);
                    break;
            }
        }
    }
    catch(e)
    {
        debug("[Device_MGMT_Zigbee] Device_MGMT_Handle_Device_Annce() Error " + e);
    }
}

var Device_MGMT_Zigbee = function (){
    var self = this;
    self.Process_Zigbee_Device_Interview_Event = function(device_ID, resolv_dev_info)
    {
        try{
            if (resolv_dev_info.mapped) {
                debug("Device '"+device_ID+"' is supported, identified as: "+resolv_dev_info.mapped.vendor+" "+resolv_dev_info.mapped.description+" ("+resolv_dev_info.mapped.model+")");
                Device_MGMT_Zigbee_Handle_Device_Annce_Interview_Event("Interview", device_ID, resolv_dev_info);
            } else {
                debug_warn("Device '"+device_ID+"' with Zigbee model '"+resolv_dev_info.device.modelID+"' is NOT supported");
            }
        }
        catch(e)
        {
            debug("[Device_MGMT_Zigbee] Process_Zigbee_Device_Join_Network_Event() Error " + e);
        }
    }

    self.Process_Zigbee_Device_Annce_Event = function(device_ID, resolv_dev_info)
    {
        try{
            if (resolv_dev_info.mapped) {
                debug("Device '"+device_ID+"' is supported, identified as: "+resolv_dev_info.mapped.vendor+" "+resolv_dev_info.mapped.description+" ("+resolv_dev_info.mapped.model+")");
                Device_MGMT_Zigbee_Handle_Device_Annce_Interview_Event("Annce", device_ID, resolv_dev_info);
            } else {
                debug_warn("Device '"+device_ID+"' with Zigbee model '"+resolv_dev_info.device.modelID+"' is NOT supported");
            }
        }
        catch(e)
        {
            debug("[Device_MGMT_Zigbee] Process_Zigbee_Device_Annce_Event() Error " + e);
        }
    }

    self.Process_Zigbee_Device_Leave_Network_Event = function(device_ID, resolv_dev_info)
    {
        try{
        }
        catch(e)
        {
            debug("[Device_MGMT_Zigbee] Process_Zigbee_Device_Join_Network_Event() Error " + e);
        }
    }

    self.Process_Zigbee_Device_Cluster_Command_Event = function(device_ID, resolv_dev_info, endpoint, cluster, command, data, meta, resolved_data)
    {
        try{
            debug("Device '"+device_ID+"' Cluster '"+cluster+"' Command '"+command+"', Data --> " + JSON.stringify(data));
            Device_MGMT_Zigbee_Handle_Device_Cluster_Command_Event(device_ID, resolv_dev_info, endpoint, cluster, command, data, meta, resolved_data);
        }
        catch(e)
        {
            debug("[Device_MGMT_Zigbee] Process_Zigbee_Device_Cluster_Command_Event() Error " + e);
        }
    }
    self.Process_Zigbee_Device_Attribute_Report_Event = function(device_ID, resolv_dev_info, endpoint, cluster, data, meta, resolved_data)
    {
        try{
            debug("Device '"+device_ID+"' Cluster '"+cluster+"' Attribute Report Data --> " + JSON.stringify(data));
            Device_MGMT_Zigbee_Handle_Device_Attribute_Report_Event(device_ID, resolv_dev_info, endpoint, cluster, data, meta, resolved_data);
        }
        catch(e)
        {
            debug("[Device_MGMT_Zigbee] Process_Zigbee_Device_Attribute_Report_Event() Error " + e);
        }
    }
    /*
    self.Device_MGMT_Zigbee_Init = function()
    {
        try{
        }
        catch(e)
        {
            debug("[Device_MGMT_Zigbee] Device_MGMT_Zigbee_Init() Error " + e);
        }
    };
    */
    self.Device_MGMT_Zigbee_Resolve_Device_Type = function(resolv_dev_info)
    {
        return Do_Resolve_Zigbee_Device_Type(resolv_dev_info);
    }
};
module.exports = Device_MGMT_Zigbee;


var debug = require('debug')(require('path').basename(__filename));
var debug_warn = require('debug')(require('path').basename(__filename) + ':warn');
var debug_err = require('debug')(require('path').basename(__filename) + ':error');

var Zigbee_Group = require('./Zigbee_Group.js');
var zigbee_group = new Zigbee_Group();

var Zigbee_Core = require('./Zigbee_Core.js');
var zigbee_core = new Zigbee_Core();

var on_Permit_Join_Callback = null;
var on_Refuse_Join_Callback = null;

var on_Device_Interview_Callback = null;
var on_Device_Annce_Callback = null;
var on_Device_Leave_Callback = null;
var on_Device_Cluster_Command_Callback = null;
var on_Device_Attribute_Report_Callback = null;

var on_Device_Read_Attr_Rsp_Callback = null;

const Zigbee_Network_OP_Timeout_Ms = 1500;
const Zigbee_Network_PermitJoin_Timeout_Sec = 120;

var Zigbee_Network_Permit_Join_Remain_Time = 0;
var Zigbee_Network_Permit_Join_Timer = null;

var Zigbee_Coordinator_Endpoint = null;

var Zigbee_Device_Configure_Status = [];

function Is_Broadcast_Addr(address_ID)
{
    if(address_ID=="Broadcast" || address_ID=="broadcast")
    {
        return true;
    }
    return false;
}

function Is_Device_Type_Entity(resolv_dev_info)
{
    if(resolv_dev_info.type=="Device" || resolv_dev_info.type=="device")
    {
        return true;
    }
    return false;
}

function Is_Group_Type_Entity(resolv_dev_info)
{
    if(resolv_dev_info.type=="Group" || resolv_dev_info.type=="group")
    {
        return true;
    }
    return false;
}

async function do_Resolve_Incomming_Raw_Data(zigbeeAddr, endpoint, cluster, type, raw_json_data, meta_data)
{
    try{
        var resolv_dev_info = await zigbee_core.Zigbee_Core_Resolve_Entity(zigbeeAddr);
        if(resolv_dev_info==null)
        {
            return null;
        }
        
        if(Is_Group_Type_Entity(resolv_dev_info))
        {
            return null;
        }

        var converted_data = null;
        const from_zigbee_converters = resolv_dev_info.mapped?.fromZigbee ?? [];
        for (const converter of from_zigbee_converters) {
            if (converter.type.includes(type) && converter.cluster === cluster) {
                const orig_data = {
                    device: resolv_dev_info.device,
                    endpoint,
                    data: raw_json_data,
                    meta: meta_data
                };
                return converter.convert(resolv_dev_info.mapped, orig_data, null, null, {device: resolv_dev_info.device});
            }
        }
        
        return converted_data;
    }
    catch(e)
    {
        debug("[Zigbee] do_Resolve_Incomming_Raw_Data() Error: " + e);
    }
}

async function HandleZigbeeReadAttrRspMsg(zigbeeAddr, rsp_data, meta_data)
{
    try{
        if(on_Device_Read_Attr_Rsp_Callback!=null)
        {
            on_Device_Read_Attr_Rsp_Callback(zigbeeAddr, rsp_data, meta_data);
        }
        on_Device_Read_Attr_Rsp_Callback = null;
    }
    catch(e)
    {
        debug("[Zigbee] HandleZigbeeReadAttrRspMsg() Error: " + e);
    }
}

async function HandleZigbeeDeviceIncomingMsg(data)
{
    try{
        if(data.device==null)
        {
            return;
        }
        
        var zigbeeAddr = data.device.ieeeAddr;

        if(zigbeeAddr==null || zigbeeAddr=="")
        {
            return;
        }
        
        debug(
            `Received Zigbee message from '${zigbeeAddr}', type '${data.type}', cluster '${data.cluster}'` +
            `, data '${JSON.stringify(data.data)}' from endpoint ${data.endpoint.ID}` +
            (data.hasOwnProperty('groupID') ? ` with groupID ${data.groupID}` : ``),
        );

        var resolv_dev_info = await zigbee_core.Zigbee_Core_Resolve_Entity(zigbeeAddr);
        if(resolv_dev_info==null)
        {
            return;
        }

        switch(data.type)
        {
        case "attributeReport":
            if(on_Device_Attribute_Report_Callback!=null)
            {
                var resolved_data = await do_Resolve_Incomming_Raw_Data(zigbeeAddr, data.endpoint, data.cluster, "attributeReport", data.data, data.meta);
            
                on_Device_Attribute_Report_Callback(zigbeeAddr, resolv_dev_info, data.endpoint, data.cluster, data.data, data.meta, resolved_data);
            }
            break;
        case "readResponse":
            HandleZigbeeReadAttrRspMsg(zigbeeAddr, data.data, data.meta);
            break;
        case "read":
            break;
        case "write":
            break;
        default:
            if(on_Device_Cluster_Command_Callback!=null)
            {
                var resolved_data = await do_Resolve_Incomming_Raw_Data(zigbeeAddr, data.endpoint, data.cluster, data.type, data.data, data.meta);
            
                on_Device_Cluster_Command_Callback(zigbeeAddr, resolv_dev_info, data.endpoint, data.cluster, data.type, data.data, data.meta, resolved_data);
            }
            break;
        }
    }
    catch(e)
    {
        debug("[Zigbee] HandleZigbeeDeviceIncomingMsg() Error: " + e);
    }
}

async function HandleZigbeeDeviceJoinedEvent(data)
{
    try{
        if(data.device==null)
        {
            return;
        }
        
        var zigbeeAddr = data.device.ieeeAddr;

        if(zigbeeAddr==null || zigbeeAddr=="")
        {
            return;
        }

        debug("Device '"+zigbeeAddr+"' joined");
    }
    catch(e)
    {
        debug("[Zigbee] HandleZigbeeDeviceJoinedEvent() Error: " + e);
    }
}

async function HandleZigbeeDeviceLeavedEvent(data)
{
    try{
        if(data.device==null)
        {
            return;
        }
        
        var zigbeeAddr = data.device.ieeeAddr;

        if(zigbeeAddr==null || zigbeeAddr=="")
        {
            return;
        }

        /* istanbul ignore else */
        if (type === 'deviceLeave') {
            debug_warn("Device '"+zigbeeAddr+"' left the network");

            if(on_Device_Leave_Callback!=null)
            {
                on_Device_Leave_Callback(zigbeeAddr);
            }
        
        }
    }
    catch(e)
    {
        debug("[Zigbee] HandleZigbeeDeviceLeavedEvent() Error: " + e);
    }
}

async function HandleZigbeeDeviceInterviewEvent(data)
{
    try{
        if(data.device==null)
        {
            return;
        }
        
        var zigbeeAddr = data.device.ieeeAddr;

        if(zigbeeAddr==null || zigbeeAddr=="")
        {
            return;
        }
        
        if (data.status === 'successful') {
            var resolv_dev_info = await zigbee_core.Zigbee_Core_Resolve_Entity(zigbeeAddr);
            if(resolv_dev_info==null)
            {
                return;
            }
            
            if(on_Device_Interview_Callback!=null)
            {
                on_Device_Interview_Callback(zigbeeAddr, resolv_dev_info);
            }

            if(resolv_dev_info.mapped!=null)
            {
                if(resolv_dev_info.mapped.configure!=null)
                {
                    //await resolv_dev_info.mapped.configure(resolv_dev_info.device, Zigbee_Coordinator_Endpoint);
                }
                Zigbee_Device_Configure_Status[zigbeeAddr] = true;
            }
        }
        else if (data.status === 'failed') {
            debug_err("Failed to interview device '"+zigbeeAddr+"' which has not successfully been paired");
        }
        else {
            /* istanbul ignore else */
            if (data.status === 'started') {
                debug("Starting interview device '"+zigbeeAddr+"'");
            }
        }
    }
    catch(e)
    {
        debug("[Zigbee] HandleZigbeeDeviceInterviewEvent() Error: " + e);
    }
}

async function HandleZigbeeDeviceAnnounceEvent(data)
{
    try{
        if(data.device==null)
        {
            return;
        }
        
        var zigbeeAddr = data.device.ieeeAddr;

        if(zigbeeAddr==null || zigbeeAddr=="")
        {
            return;
        }

        var resolv_dev_info = await zigbee_core.Zigbee_Core_Resolve_Entity(zigbeeAddr);
        if(resolv_dev_info==null)
        {
            return;
        }
        
        if(on_Device_Annce_Callback!=null)
        {
            on_Device_Annce_Callback(zigbeeAddr, resolv_dev_info);
        }

        if(resolv_dev_info.mapped!=null)
        {
            if(resolv_dev_info.mapped.configure!=null)
            {
                await resolv_dev_info.mapped.configure(resolv_dev_info.device, Zigbee_Coordinator_Endpoint);
            }
            Zigbee_Device_Configure_Status[zigbeeAddr] = true;
        }
    }
    catch(e)
    {
        debug("[Zigbee] HandleZigbeeDeviceAnnounceEvent() Error: " + e);
    }
}

async function HandleZigbeeAdapterDisconnected()
{
    try{
        await zigbee_core.Zigbee_Core_DeInit();
    }
    catch(e)
    {
        debug("[Zigbee] HandleZigbeeAdapterDisconnected() Error: " + e);
    }
}

async function Ensure_Zigbee_Device_Configured(zigbeeAddr, resolv_dev_info)
{
    try{
        if(zigbeeAddr.indexOf("x")<0)
        {
            zigbeeAddr = "0x"+zigbeeAddr
        }
        
        if(resolv_dev_info==null)
        {
            resolv_dev_info = await zigbee_core.Zigbee_Core_Resolve_Entity(zigbeeAddr);
            if(resolv_dev_info==null)
            {
                return;
            }
        }
        
        if(Is_Group_Type_Entity(resolv_dev_info))
        {
            return;
        }

        var need_configure = false;
        if(Zigbee_Device_Configure_Status[zigbeeAddr] != null)
        {
            if(Zigbee_Device_Configure_Status[zigbeeAddr] == false)
            {
                need_configure = true;
            }
        }
        else{
            need_configure = true;
        }

        if(need_configure)
        {
            if(resolv_dev_info.mapped!=null)
            {
                if(resolv_dev_info.mapped.configure!=null)
                {
                    await resolv_dev_info.mapped.configure(resolv_dev_info.device, Zigbee_Coordinator_Endpoint);
                }
                Zigbee_Device_Configure_Status[zigbeeAddr] = true;
            }
        }
    }
    catch(e)
    {
        debug("[Zigbee] Ensure_Zigbee_Device_Configured() Error: " + e);
    }
}

var Zigbee = function () {
    var self = this;

    self.attributeReportCommand = "attributeReport";
    
    self.Zigbee_Permit_Join = async function()
    {
        if(Zigbee_Network_Permit_Join_Timer!=null)
        {
            clearInterval(Zigbee_Network_Permit_Join_Timer);
            Zigbee_Network_Permit_Join_Timer = null;
        }

        Zigbee_Network_Permit_Join_Remain_Time = Zigbee_Network_PermitJoin_Timeout_Sec;

        await zigbee_core.Zigbee_Core_Permit_Join(Zigbee_Network_Permit_Join_Remain_Time);
        
        if(on_Permit_Join_Callback!=null)
        {
            on_Permit_Join_Callback();
        }

        Zigbee_Network_Permit_Join_Timer = setInterval(async function(){
            Zigbee_Network_Permit_Join_Remain_Time--;
            if(Zigbee_Network_Permit_Join_Remain_Time<=0)
            {
                clearInterval(Zigbee_Network_Permit_Join_Timer);
                Zigbee_Network_Permit_Join_Timer = null;
                
                await zigbee_core.Zigbee_Core_Permit_Join(0);

                if(on_Refuse_Join_Callback!=null)
                {
                    on_Refuse_Join_Callback();
                }
            }
        }, 1000);
    }

    self.Zigbee_Prohibit_Join = async function()
    {
        if(Zigbee_Network_Permit_Join_Timer!=null)
        {
            clearInterval(Zigbee_Network_Permit_Join_Timer);
            Zigbee_Network_Permit_Join_Timer = null;
        }
        
        Zigbee_Network_Permit_Join_Remain_Time = 0;

        await zigbee_core.Zigbee_Core_Permit_Join(0);
        
        if(on_Refuse_Join_Callback!=null)
        {
            on_Refuse_Join_Callback();
        }
    }
    
    self.Zigbee_Get_Join_Statue = async function()
    {
        return await zigbee_core.Zigbee_Core_Get_Permit_Join_State();
    }

    self.Zigbee_Get_Join_Remain_Time = function()
    {
        return Zigbee_Network_Permit_Join_Remain_Time;
    }

    self.Zigbee_Register_Callbacks = function(onPermitJoinCB, onRefuseJoinCB, onDeviceInterviewCB, onDeviceAnnceCB, onDeviceLeaveCB, onDeviceClusterCommandCB, onDeviceAttrReportCB)
    {
        on_Permit_Join_Callback = onPermitJoinCB;
        on_Refuse_Join_Callback = onRefuseJoinCB;
        
        on_Device_Interview_Callback = onDeviceInterviewCB;
        on_Device_Annce_Callback = onDeviceAnnceCB;
        on_Device_Leave_Callback = onDeviceLeaveCB;
        on_Device_Cluster_Command_Callback = onDeviceClusterCommandCB;
        on_Device_Attribute_Report_Callback = onDeviceAttrReportCB;
    }

    self.Zigbee_Start = async function()
    {
        try{
            zigbee_core.Zigbee_Core_Register_Event_Callbacks(()=>HandleZigbeeAdapterDisconnected(),
                (data)=>HandleZigbeeDeviceAnnounceEvent(data), (data)=>HandleZigbeeDeviceInterviewEvent(data),
                (data)=>HandleZigbeeDeviceJoinedEvent(data), (data)=>HandleZigbeeDeviceLeavedEvent(data),
                (data)=>HandleZigbeeDeviceIncomingMsg(data));

            await zigbee_core.Zigbee_Core_Init();

            Zigbee_Coordinator_Endpoint = zigbee_core.Zigbee_Core_Get_Device_By_Type('Coordinator')[0].getEndpoint(1);

            debug_warn('`permit_join` set to  `true` in configuration.yaml.');
            debug_warn('Allowing new devices to join.');
            debug_warn('Set `permit_join` to `false` once you joined all devices.');

            await zigbee_core.Zigbee_Core_Permit_Join(false);
        }
        catch(e)
        {
            debug("[Zigbee] Zigbee_Start() Error: " + e);
        }
    }

    self.Zigbee_Stop = async function()
    {
        try{
            await zigbee_core.Zigbee_Core_DeInit();
        }
        catch(e)
        {
            debug("[Zigbee] Zigbee_Stop() Error: " + e);
        }
    }

    self.Zigbee_Get_Coordinator_IEEE_Addr = function()
    {
        try{
            return zigbee_core.Zigbee_Core_Get_Device_By_Type('Coordinator')[0].ieeeAddr;
        }
        catch(e)
        {
            debug("[Zigbee] Zigbee_Get_Coordinator_IEEE_Addr() Error: " + e);
        }
    }

    self.Zigbee_ResolveZigbeeAddress = async function(address_ID)
    {
        try{
            if(address_ID==null)
            {
                return null;
            }

            if(Is_Broadcast_Addr(address_ID))
            {
                return "0xFFFF";
            }
            else{
                var zigbee_group_ID = await zigbee_group.Zigbee_Get_Zigbee_Group_ID_By_Global_Group_ID(address_ID);
                if(zigbee_group_ID!=null)
                {
                    return String(zigbee_group_ID);
                }
    
                var zigbeeAddr = String(address_ID);
                if(zigbeeAddr.indexOf("x")<0)
                {
                    zigbeeAddr = "0x"+zigbeeAddr
                }
                return zigbeeAddr;
            }
        }
        catch(e)
        {
            debug("[Zigbee] Zigbee_ResolveZigbeeAddress() Error: " + e);
        }
    }
    
    self.Zigbee_ResolveDeviceEntity = async function(address_ID)
    {
        try{
            if(Is_Broadcast_Addr(address_ID))
            {
                return null;
            }

            var zigbeeAddr = address_ID;
            if(zigbeeAddr.indexOf("x")<0)
            {
                zigbeeAddr = "0x"+zigbeeAddr
            }
            
            var resolv_dev_info = await zigbee_core.Zigbee_Core_Resolve_Entity(zigbeeAddr);
            if(resolv_dev_info==null)
            {
                return null;
            }

            return resolv_dev_info;
        }
        catch(e)
        {
            debug("[Zigbee] Zigbee_ResolveDeviceEntity() Error: " + e);
        }
    }
    
    self.Zigbee_ReadAttribute = async function(address_ID, cluster, attributes)
    {
        try{
            if(Is_Broadcast_Addr(address_ID))
            {
                return null;
            }

            var zigbeeAddr = address_ID;
            if(zigbeeAddr.indexOf("x")<0)
            {
                zigbeeAddr = "0x"+zigbeeAddr
            }
            
            var resolv_dev_info = await zigbee_core.Zigbee_Core_Resolve_Entity(zigbeeAddr);
            if(resolv_dev_info==null)
            {
                return null;
            }

            if(Is_Group_Type_Entity(resolv_dev_info))
            {
                return null;
            }
            
            await Ensure_Zigbee_Device_Configured(zigbeeAddr, resolv_dev_info);

            var attribute_value = null;
            const do_read_attribute = function(cluster, attributes){
                return new Promise(function(resolve){
                    var read_attr_timeout = setTimeout(function(){ 
                        resolve();
                    }, Zigbee_Network_OP_Timeout_Ms);
                
                    on_Device_Read_Attr_Rsp_Callback = function(zigbeeAddr, rsp_data, meta_data){
                        clearTimeout(read_attr_timeout);
                        attribute_value = rsp_data;
                        resolve();
                    };
                
                    resolv_dev_info.endpoint.read(cluster, attributes);
                });
            }

            await do_read_attribute(cluster, attributes);

            return attribute_value;
        }
        catch(e)
        {
            debug("[Zigbee] Zigbee_ReadAttribute_Async() Error: " + e);
        }
    }

    self.Zigbee_WriteAttribute = async function(address_ID, cluster, attributes)
    {
        try{
            if(Is_Broadcast_Addr(address_ID))
            {
                return;
            }

            var zigbeeAddr = address_ID;
            if(zigbeeAddr.indexOf("x")<0)
            {
                zigbeeAddr = "0x"+zigbeeAddr
            }
            
            var resolv_dev_info = await zigbee_core.Zigbee_Core_Resolve_Entity(zigbeeAddr);
            if(resolv_dev_info==null)
            {
                return;
            }

            if(Is_Group_Type_Entity(resolv_dev_info))
            {
                return;
            }
            
            await Ensure_Zigbee_Device_Configured(zigbeeAddr, resolv_dev_info);

            resolv_dev_info.endpoint.write(cluster, attributes, null);
        }
        catch(e)
        {
            debug("[Zigbee] Zigbee_WriteAttribute() Error: " + e);
        }
    }

    self.Zigbee_ResolveIncomingRawData = async function(address_ID, endpoint, cluster, type, raw_json_data, meta_data)
    {
        try{
            if(address_ID=="Broadcast" || address_ID=="broadcast")
            {
                return null;
            }

            var zigbeeAddr = address_ID;
            if(zigbeeAddr.indexOf("x")<0)
            {
                zigbeeAddr = "0x"+zigbeeAddr
            }
            
            return await do_Resolve_Incomming_Raw_Data(zigbeeAddr, endpoint, cluster, type, raw_json_data, meta_data);
        }
        catch(e)
        {
            debug("[Zigbee] Zigbee_ResolveIncomingRawData() Error: " + e);
        }
    }

    self.Zigbee_SendCommand = async function(address_ID, cluster, command, parameters)
    {
        try{
            var resolved_addr = await this.Zigbee_ResolveZigbeeAddress(address_ID);
            if(resolved_addr==null)
            {
                return;
            }

            var resolv_dev_info = await zigbee_core.Zigbee_Core_Resolve_Entity(resolved_addr);
            if(resolv_dev_info==null)
            {
                return;
            }
            
            await Ensure_Zigbee_Device_Configured(resolved_addr, resolv_dev_info);

            if(Is_Device_Type_Entity(resolv_dev_info))
            {
                await resolv_dev_info.endpoint.command(cluster, command, parameters, {disableDefaultResponse: true});
            }
            if(Is_Group_Type_Entity(resolv_dev_info))
            {
                await resolv_dev_info.group.command(cluster, command, parameters, {disableDefaultResponse: true});
            }
        }
        catch(e)
        {
            debug("[Zigbee] Zigbee_SendCommand() Error: " + e);
        }
    }
};
    
module.exports = Zigbee;
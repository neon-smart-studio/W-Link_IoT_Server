
var debug = require('debug')(require('path').basename(__filename));
var debug_warn = require('debug')(require('path').basename(__filename) + ':warn');
var debug_err = require('debug')(require('path').basename(__filename) + ':error');

const config = require('config');

var path = require('path');
var fs = require('fs');

var State = require('./state');
var state = new State();

var appDir = path.dirname(require.main.filename);

const ZigbeeHerdsman = require('zigbee-herdsman');
const zigbeeHerdsmanConverters = require('zigbee-herdsman-converters');
const objectAssignDeep = require('object-assign-deep');

const Zigbee_Data_Path = appDir+'/Zigbee_Data';
const Zigbee_Database_Path = Zigbee_Data_Path+'/database.db';
const Zigbee_Database_Backup_Path = Zigbee_Data_Path+'/database.db.backup';
const Zigbee_Backup_Path = Zigbee_Data_Path+'/Zigbee_coordinator_backup.json';

var network_Config = {
    panID: 0x8422,
    extendedPanID: [0xDD, 0xDD, 0xDD, 0xDD, 0xDD, 0xDD, 0xDD, 0xDD],
    channelList: [11],
    networkKey: [1, 3, 5, 7, 9, 11, 13, 15, 0, 2, 4, 6, 8, 10, 12, 13]
}

if (config.has('config_Zigbee.pan_ID')) {
    network_Config['panID'] = config.get('config_Zigbee.pan_ID');
}

if (config.has('config_Zigbee.ext_pan_ID')) {
    network_Config['extendedPanID'] = config.get('config_Zigbee.ext_pan_ID');
}

if (config.has('config_Zigbee.channel_List')) {
    network_Config['channelList'] = config.get('config_Zigbee.channel_List');
}

if (config.has('config_Zigbee.network_key')) {
    network_Config['networkKey'] = config.get('config_Zigbee.network_key');
}

const herdsmanSettings = {
    network: network_Config,
    databasePath: Zigbee_Database_Path,
    databaseBackupPath: Zigbee_Database_Backup_Path,
    backupPath: Zigbee_Backup_Path,
    serialPort: {
        baudRate: config.get('config_Zigbee.config_port.baudrate'),
        rtscts: config.get('config_Zigbee.config_port.rtscts'),
        path: config.get('config_Zigbee.config_port.port'),
        adapter: config.get('config_Zigbee.config_port.adapter'),
    },
};

global.zigbee_herdsman_controller = null;

var adapterDisconnected_callback = null;
var deviceAnnounce_event_callback = null;
var deviceInterview_event_callback = null;
var deviceJoined_event_callback = null;
var deviceLeave_event_callback = null;
var message_event_callback = null;

function Zigbee_AcceptJoiningDeviceHandler(ieeeAddr) {
    return true;
}

var Zigbee_Core = function (){
    var self = this;

    self.Zigbee_Core_Register_Event_Callbacks = async function(adapterDisconnected_cb,
        deviceAnnounce_event_cb, deviceInterview_event_cb, deviceJoined_event_cb,
        deviceLeave_event_cb, message_event_cb)
    {
        adapterDisconnected_callback = adapterDisconnected_cb;
        deviceAnnounce_event_callback = deviceAnnounce_event_cb;
        deviceInterview_event_callback = deviceInterview_event_cb;
        deviceJoined_event_callback = deviceJoined_event_cb;
        deviceLeave_event_callback = deviceLeave_event_cb;
        message_event_callback = message_event_cb;
    }

    self.Zigbee_Core_Init = async function()
    {
        try {
            state.start();

            if (!fs.existsSync(Zigbee_Data_Path)){
                fs.mkdirSync(Zigbee_Data_Path);
            }

            debug(`Starting zigbee-herdsman...`);
            const herdsmanSettingsLog = objectAssignDeep.noMutate(herdsmanSettings);
            herdsmanSettingsLog.network.networkKey = 'HIDDEN';
            debug(`Using zigbee-herdsman with settings: '${JSON.stringify(herdsmanSettingsLog)}'`);

            herdsmanSettings.acceptJoiningDeviceHandler = Zigbee_AcceptJoiningDeviceHandler;
            zigbee_herdsman_controller = new ZigbeeHerdsman.Controller(herdsmanSettings);
            await zigbee_herdsman_controller.start();

            zigbee_herdsman_controller.on('adapterDisconnected', () => {
                if(adapterDisconnected_callback!=null){
                    adapterDisconnected_callback();
                }
            });
            zigbee_herdsman_controller.on('deviceAnnounce', (data) => {
                if(deviceAnnounce_event_callback!=null){
                    deviceAnnounce_event_callback(data);
                }
            });
            zigbee_herdsman_controller.on('deviceInterview', (data) => {
                if(deviceInterview_event_callback!=null){
                    deviceInterview_event_callback(data);
                }
            });
            zigbee_herdsman_controller.on('deviceJoined', (data) => {
                if(deviceJoined_event_callback!=null){
                    deviceJoined_event_callback(data);
                }
            });
            zigbee_herdsman_controller.on('deviceLeave', (data) => {
                if(deviceLeave_event_callback!=null){
                    deviceLeave_event_callback(data);
                }
            });
            zigbee_herdsman_controller.on('message', (data) => {
                if(message_event_callback!=null){
                    message_event_callback(data);
                }
            });

            debug('zigbee-herdsman started');
            debug(`Coordinator firmware version: '${JSON.stringify(zigbee_herdsman_controller.getCoordinatorVersion())}'`);
            debug(`Zigbee network parameters: ${JSON.stringify(await zigbee_herdsman_controller.getNetworkParameters())}`);

            // Check if we have to turn off the led
            if (config.has('config_Zigbee.config_Zigbee_port.disable_led')) {
                if (config.get('config_Zigbee.config_Zigbee_port.disable_led')==false) {
                    await zigbee_herdsman_controller.setLED(false);
                }
            }

            if (config.has('config_Zigbee.transmit_Power')) {
                //set a transmit power (-22~19)
                const transmitPower = config.get('config_Zigbee.transmit_Power');
                await zigbee_herdsman_controller.transmitPower(transmitPower);
                debug(`Set transmit power to '${transmitPower}'`);
            }
        } catch (e) {
            debug_err("[Zigbee_Core] Zigbee_Core_Init() Error: "+e);
        }
    }
    
    self.Zigbee_Core_DeInit = async function()
    {
        try {
            state.stop();

            await zigbee_herdsman_controller.stop();
            zigbee_herdsman_controller = null;
            debug('zigbee-herdsman stopped');
        } catch (e) {
            debug_err("[Zigbee_Core] Zigbee_Core_DeInit() Error: "+e);
        }
    }

    self.Zigbee_Core_Get_Coordinator_Version = async function()
    {
        try {
            return zigbee_herdsman_controller.getCoordinatorVersion();
        } catch (e) {
            debug_err("[Zigbee_Core] Zigbee_Core_Get_Coordinator_Version() Error: "+e);
        }
    }

    self.Zigbee_Core_Reset = async function()
    {
        try {
            await zigbee_herdsman_controller.reset(type);
        } catch (e) {
            debug_err("[Zigbee_Core] Zigbee_Core_Reset() Error: "+e);
        }
    }

    self.Zigbee_Core_Permit_Join = async function(permit)
    {
        try {
            await zigbee_herdsman_controller.permitJoin(permit);
        } catch (e) {
            debug_err("[Zigbee_Core] Zigbee_Core_Permit_Join() Error: "+e);
        }
    }

    self.Zigbee_Core_Get_Permit_Join_State = function()
    {
        try {
            return zigbee_herdsman_controller.getPermitJoin();
        } catch (e) {
            debug_err("[Zigbee_Core] Zigbee_Core_Get_Permit_Join_State() Error: "+e);
        }
    }

    self.Zigbee_Core_Get_Clients = function()
    {
        try {
            return zigbee_herdsman_controller.getDevices().filter((device) => device.type !== 'Coordinator');
        } catch (e) {
            debug_err("[Zigbee_Core] Zigbee_Core_Get_Clients() Error: "+e);
        }
    }

    self.Zigbee_Core_Get_Devices = function()
    {
        try {
            return zigbee_herdsman_controller.getDevices();
        } catch (e) {
            debug_err("[Zigbee_Core] Zigbee_Core_Get_Devices() Error: "+e);
        }
    }

    self.Zigbee_Core_Get_Device_By_IeeeAddr = function(ieeeAddr)
    {
        try {
            return zigbee_herdsman_controller.getDeviceByIeeeAddr(ieeeAddr);
        } catch (e) {
            debug_err("[Zigbee_Core] Zigbee_Core_Get_Device_By_IeeeAddr() Error: "+e);
        }
    }

    self.Zigbee_Core_Get_Device_By_Type = function(type)
    {
        try {
            return zigbee_herdsman_controller.getDevicesByType(type);
        } catch (e) {
            debug_err("[Zigbee_Core] Zigbee_Core_Get_Device_By_Type() Error: "+e);
        }
    }

    self.Zigbee_Core_Create_Group = function(ID)
    {
        try {
            return zigbee_herdsman_controller.createGroup(ID);
        } catch (e) {
            debug_err("[Zigbee_Core] Zigbee_Core_Create_Group() Error: "+e);
        }
    }

    self.Zigbee_Core_Get_Groups = function()
    {
        try {
            return zigbee_herdsman_controller.getGroups();
        } catch (e) {
            debug_err("[Zigbee_Core] Zigbee_Core_Get_Groups() Error: "+e);
        }
    }

    self.Zigbee_Core_Get_Group_By_ID = function(ID)
    {
        try {
            return zigbee_herdsman_controller.getGroupByID(ID);
        } catch (e) {
            debug_err("[Zigbee_Core] Zigbee_Core_Get_Group_By_ID() Error: "+e);
        }
    }

    self.Zigbee_Core_Touchlink_Factory_Reset = async function()
    {
        try {
            return zigbee_herdsman_controller.touchlinkFactoryReset();
        } catch (e) {
            debug_err("[Zigbee_Core] Zigbee_Core_Touchlink_Factory_Reset() Error: "+e);
        }
    }

    //ID: ieeeAddr or groupID
    self.Zigbee_Core_Resolve_Entity = function(ID)
    {
        try {
            const group = this.Zigbee_Core_Get_Group_By_ID(ID);
            if (group!=null){
                return {type: 'group', group};
            }

            const device = this.Zigbee_Core_Get_Device_By_IeeeAddr(ID);
            if (device==null) {
                return null;
            }

            const mapped = zigbeeHerdsmanConverters.findByZigbeeModel(device.modelID);
            const endpoints = mapped && mapped.endpoint ? mapped.endpoint(device) : null;
            let isDefaultEndpoint = true;
            let endpoint;
            if (endpoints && endpoints['default']) {
                endpoint = device.getEndpoint(endpoints['default']);
            } else {
                endpoint = device.endpoints[0];
            }

            const endpointName = endpoints ? Object.entries(endpoints).find((e) => e[1] === endpoint.ID)[0] : null;
            return {
                type: 'device', device, mapped, endpoint, isDefaultEndpoint, endpointName,
            };
            
        } catch (e) {
            debug_err("[Zigbee_Core] Zigbee_Core_Resolve_Entity() Error: "+e);
        }
    }
}

module.exports = Zigbee_Core;

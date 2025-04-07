
var debug = require('debug')(require('path').basename(__filename));

var Zigbee = require('../../../Zigbee/Zigbee.js');
var zigbee = new Zigbee();

var Device_MGR = require('../../../Util/Device_MGR.js');
var device_mgr = new Device_MGR();

var Bind_MGR = require('../../../Util/Bind_MGR.js');
var bind_mgr = new Bind_MGR();

const Motion_Sensor_Device_Type = "Motion Sensor";

var Motion_Sensor_Last_State = [];

function Motion_Sensor_Resolve_Endpoint_Name(sensor_index, action)
{
    return sensor_index+":"+action;
}

async function Get_Motion_Sensor_Support_Maxium_Sensor(address_ID)
{
    var read_dev_info = await device_mgr.Read_Device_Inf(Motion_Sensor_Device_Type, "everyone", address_ID);
    if(read_dev_info==null)
    {
        return 0;
    }
        
    var num_of_motion_sensor = 0;

    switch(read_dev_info.model)
    {
        case "SML001":
        case "SML002":
            num_of_motion_sensor = 1;
            break;
        case "TRADFRI motion sensor":
            num_of_motion_sensor = 1;
            break;
        case "lumi.sensor_motion":
        case "lumi.sensor_motion.aq2":
        case "lumi.vibration.aq1":
            num_of_motion_sensor = 1;
            break;
    }

    return num_of_motion_sensor;
}

var Motion_Sensor_API_Zigbee = function () {
    var self = this;
    
    self.Get_Motion_Sensor_Support_Actions = async function(address_ID)
    {
        try {
            var read_dev_info = await device_mgr.Read_Device_Inf(Motion_Sensor_Device_Type, "everyone", address_ID);
            if(read_dev_info==null)
            {
                return null;
            }
            
            var actions = null;
        
            switch(read_dev_info.model)
            {
                case "SML001":
                case "SML002":
                case "TRADFRI motion sensor":
                    actions = ["default"];
                    break;
                case "lumi.sensor_motion":
                case "lumi.sensor_motion.aq2":
                case "lumi.vibration.aq1":
                    actions = ["none", "detected"];
                    break;
                default:
                    actions = ["default"];
                    break;

            }
        
            return {
                support_actions: actions
            };
        }
        catch (e) {
            debug("[Motion_Sensor_API_Zigbee] Get_Motion_Sensor_Support_Actions() Error " + e);
        }
    };
    self.Config_Motion_Sensor_Reaction_Time = async function (address_ID, sensor_index, reaction_time) {
        try {
            if(sensor_index!=0)
            {
                return;
            }

            await zigbee.Zigbee_WriteAttribute(address_ID, "genOnOff", ["onTime"], [reaction_time*10])
        }
        catch (e) {
            debug("[Motion_Sensor_API_Zigbee] Config_Motion_Sensor_Reaction_Time() Error " + e);
        }
    };
    self.Get_Motion_Sensor_Reaction_Time = async function (address_ID, sensor_index) {
        try {
            if(sensor_index!=0)
            {
                return null;
            }

            return await zigbee.Zigbee_ReadAttribute(address_ID, "genOnOff", ["onTime"])
        }
        catch (e) {
            debug("[Motion_Sensor_API_Zigbee] Get_Motion_Sensor_Reaction_Time() Error " + e);
        }
    };
    self.Get_Num_Of_Motion_Sensor = async function (address_ID) {
        try {
            var num_of_sw = await Get_Motion_Sensor_Support_Maxium_Sensor(address_ID);

            return {
                num_of_motion_sensor: num_of_sw
            };
        }
        catch (e) {
            debug("[Motion_Sensor_API_Zigbee] Get_Num_Of_Motion_Sensor() Error " + e);
        }
    };
    self.Get_Motion_Sensor_Individual_Sensor_Info = async function (address_ID, sensor_index) {
        try {
            if(sensor_index!=0)
            {
                return null;
            }

            var support_actions_json = await this.Get_Motion_Sensor_Support_Actions(address_ID);
            if(support_actions_json==null)
            {
                return null;
            }

            var last_action = null;

            if(Motion_Sensor_Last_State[address_ID]!=null)
            {
                var sensor_last_state = Motion_Sensor_Last_State[address_ID].individual_sensor_status[0];
                last_action = sensor_last_state.action;
            }

            return  {
                sensor_index: sensor_index,
                support_actions: support_actions_json.support_actions,
                last_action: last_action
            };;
        }
        catch (e) {
            debug("[Motion_Sensor_API_Zigbee] Get_Motion_Sensor_Individual_Sensor_Info() Error " + e);
        }
    };
    
    self.Get_Motion_Sensor_All_Sensor_Info = async function (address_ID) {
        try {
            var support_actions_json = await this.Get_Motion_Sensor_Support_Actions(address_ID);
            if(support_actions_json==null)
            {
                return null;
            }

            var num_of_motion_sensor = await Get_Motion_Sensor_Support_Maxium_Sensor(address_ID);
            if(num_of_motion_sensor==0)
            {
                return null;
            }

            var sensor_info_list = [];

            var last_action = null;
            
            if(Motion_Sensor_Last_State[address_ID]!=null)
            {
                last_action = Motion_Sensor_Last_State[address_ID].individual_sensor_status[0].action;
            }

            for(var i = 0; i<num_of_motion_sensor; i++)
            {
                sensor_info_list.push({
                    socket_index: i,
                    support_actions: support_actions_json.support_actions,
                    last_action: last_action
                });
            }

            return {
                num_of_motion_sensor: num_of_motion_sensor,
                individual_sensor_info: sensor_info_list
            };
        }
        catch (e) {
            debug("[Motion_Sensor_API_Zigbee] Get_Motion_Sensor_All_Sensor_Info() Error " + e);
        }
    };
};

module.exports = Motion_Sensor_API_Zigbee;

var debug = require('debug')(require('path').basename(__filename));

var MQTT = require('../MQTT.js');
var mqtt = new MQTT();

var MQTT_Schedule_API = function (){
    var self = this;

    self.Schedule_Add_New = async function(device_ID, schedule_name, start_time, end_time, one_time_schedule, weekday_repeat, schedule_action)
    {
        try{
            var mqtt_cmd = {
                command:"add new schedule",
                schedule_name: schedule_name,
                start_time: start_time,
                stop_time: end_time,
                one_time_schedule: Boolean(one_time_schedule),
                weekday_repeat: weekday_repeat,
                schedule_action: schedule_action
            }
            return (await mqtt.MQTT_POST_Request("Schedule", device_ID, mqtt_cmd));
        }
        catch(e)
        {
            debug("[MQTT_Schedule_API] Add_New_Schedule() Error " + e);
        }
    };
    self.Schedule_Edit = async function(device_ID, device_schedule_ID, new_name, start_time, end_time, one_time_schedule, weekday_repeat, schedule_action)
    {
        try{
            var mqtt_cmd = {
                command:"edit schedule",
                schedule_ID: Number(device_schedule_ID),
                new_schedule_name: new_name,
                start_time: start_time,
                stop_time: end_time,
                one_time_schedule: Boolean(one_time_schedule),
                weekday_repeat: weekday_repeat,
                schedule_action: schedule_action
            }
            return (await mqtt.MQTT_POST_Request("Schedule", device_ID, mqtt_cmd));
        }
        catch(e)
        {
            debug("[MQTT_Schedule_API] Schedule_Remove_Device_From_Group() Error " + e);
        }
    };
    self.Schedule_Delete = async function(device_ID, device_schedule_ID)
    {
        try{
            var mqtt_cmd = {
                command:"delete schedule",
                schedule_ID: Number(device_schedule_ID)
            }
            return (await mqtt.MQTT_POST_Request("Schedule", device_ID, mqtt_cmd));
        }
        catch(e)
        {
            debug("[MQTT_Schedule_API] Schedule_Delete() Error " + e);
        }
    };
    self.Schedule_Delete_All = async function(device_ID)
    {
        try{
            var mqtt_cmd = {
                command:"delete all schedules"
            }
            return (await mqtt.MQTT_POST_Request("Schedule", device_ID, mqtt_cmd));
        }
        catch(e)
        {
            debug("[MQTT_Schedule_API] Schedule_Delete() Error " + e);
        }
    };
    self.Schedule_Resume = async function(device_ID, device_schedule_ID)
    {
        try{
            var mqtt_cmd = {
                command:"resume schedule",
                schedule_ID: Number(device_schedule_ID)
            }
            return (await mqtt.MQTT_POST_Request("Schedule", device_ID, mqtt_cmd));
        }
        catch(e)
        {
            debug("[MQTT_Schedule_API] Schedule_Delete() Error " + e);
        }
    };
    self.Schedule_Pause = async function(device_ID, device_schedule_ID)
    {
        try{
            var mqtt_cmd = {
                command:"pause schedule",
                schedule_ID: Number(device_schedule_ID)
            }
            return (await mqtt.MQTT_POST_Request("Schedule", device_ID, mqtt_cmd));
        }
        catch(e)
        {
            debug("[MQTT_Schedule_API] Schedule_Delete() Error " + e);
        }
    };
    self.Schedule_Abort = async function(device_ID, device_schedule_ID)
    {
        try{
            var mqtt_cmd = {
                command:"abort schedule",
                schedule_ID: Number(device_schedule_ID)
            }
            return (await mqtt.MQTT_POST_Request("Schedule", device_ID, mqtt_cmd));
        }
        catch(e)
        {
            debug("[MQTT_Schedule_API] Schedule_Delete() Error " + e);
        }
    };
    self.Get_Schedule_List = async function (device_ID) {
        try {
            mqtt_cmd = {
                command:"get schedule list"
            }
            return (await mqtt.MQTT_GET_Request("Schedule", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[MQTT_Schedule_API] Get_Schedule_List() Error " + e);
        }
    };
    self.Get_Schedule_Info = async function (device_ID, device_schedule_ID) {
        try {
            mqtt_cmd = {
                command:"get schedule info",
                schedule_ID: Number(device_schedule_ID)
            }
            return (await mqtt.MQTT_GET_Request("Schedule", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[MQTT_Schedule_API] Get_Schedule_List() Error " + e);
        }
    };
    self.Get_Schedule_Enable_Disable_Status = async function (device_ID, device_schedule_ID) {
        try {
            mqtt_cmd = {
                command:"get schedule enable disable status",
                schedule_ID: Number(device_schedule_ID)
            }
            return (await mqtt.MQTT_GET_Request("Schedule", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[MQTT_Schedule_API] Get_Schedule_List() Error " + e);
        }
    };
    self.Get_Schedule_Running_Status = async function (device_ID, device_schedule_ID) {
        try {
            mqtt_cmd = {
                command:"get schedule running status",
                schedule_ID: Number(device_schedule_ID)
            }
            return (await mqtt.MQTT_GET_Request("Schedule", device_ID, mqtt_cmd));
        }
        catch (e) {
            debug("[MQTT_Schedule_API] Get_Schedule_List() Error " + e);
        }
    };
};

module.exports = MQTT_Schedule_API;
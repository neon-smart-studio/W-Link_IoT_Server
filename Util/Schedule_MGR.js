
var debug = require('debug')(require('path').basename(__filename));

const config = require('config');

var uuid = require('uuid');

var DataBase = require('../DataBase/DataBase.js');
var database = new DataBase();

const Schedule_MGR_DB_Name = 'schedule';

/*  schema
Schedule_Info = {
    user: <String>, //username 使用者名稱,
    schedule_ID: <String>, //排程唯一ID
    schedule_Name: <String>, //排程名稱
    enabled: <bool>, //是否啟用此排程
    target_address_type: <String>, //目標位址類型: Device/Group/Broadcast
    target_address_ID: <String>, //目標位址ID 當target_address_type為Broadcast時此欄位無效
    created_time: <UTC_Time>, //建立時間,
    execute_time: { //執行時間
        hour: <Number>, // 0~23
        min: <Number>, // 0~59
        sec: <Number>  // 0~59
    },
    repeat: {
        mode: <String>, // 重複模式
                        // 可以為"Once"/"Day"/"Week"
                        // "Once" 為只執行一次
                        // "Day" 為每天執行
                        // "Week" 為每週執行
        days: [<Number>] // 重複日期 在mode為 "Once"/"Day" 時無效
    },
    action: {
        command_topic: <String>, //目標topic: Water/Environment/Lighting
        command_type: <String>, //指令類型
        command: <String>, //操作指令
        param: <Object> //指令參數
    }
};
*/

function do_Check_Execute_Time_Params(time_param)
{
    if(time_param==null){
        return false;
    }
    if(time_param.hour==null || time_param.min==null || time_param.sec==null){
        return false;
    }

    if(time_param.hour<0 || time_param.hour>23){
        return false;
    }
    if(time_param.min<0 || time_param.min>59){
        return false;
    }
    if(time_param.sec<0 || time_param.sec>59){
        return false;
    }
    
    return true;
}

function do_Check_Repeat_Params(repeat_param)
{
    if(repeat_param==null){
        return false;
    }
    if(repeat_param.mode==null){
        return false;
    }

    if(repeat_param.days==null){
        return false;
    }
    if(!Array.isArray(repeat_param.days)){
        return false;
    }

    if(repeat_param.mode=="Week"){
        if(repeat_param.days.length==0){
            return false;
        }
    }

    return true;
}

function do_Check_Action_Params(action_param)
{
    if(action_param==null){
        return false;
    }
    if(repeat_param.command_topic==null){
        return false;
    }
    if(repeat_param.command_type==null){
        return false;
    }
    if(repeat_param.command==null){
        return false;
    }
    if(repeat_param.param==null){
        return false;
    }
    return true;
}

var Schedule_MGR = function (){
    var self = this;
    
    self.Create_New_Schedule = async function(device_Type, user, schedule_Name, target_address_type, target_address_ID, execute_time, repeat_mode, schedule_action)
    {
        try{
            if(target_address_type==null || target_address_ID==null){
                return null;
            }

            if(target_address_type!="Broadcast" && target_address_ID==null){
                return null;
            }
            if( target_address_type!="Device" &&
                target_address_type!="Group" &&
                target_address_type!="Broadcast"){
                return null;
            }

            if(target_address_type=="Broadcast" && target_address_ID!=null){
                target_address_ID = null;
            }
            
            if(do_Check_Time_Params(execute_time)==false){
                return null;
            }
            if(do_Check_Repeat_Params(repeat_mode)==false){
                return null;
            }
            if(do_Check_Action_Params(schedule_action)==false){
                return null;
            }
            
            if(schedule_Name==null || schedule_Name==''){
                schedule_Name = "New Schedule";
            }
            
            var schedule_UUID = uuid.v1();

            var schedule_ID = schedule_UUID.split('-').join('');

            var current_date =  Date.now();
            var current_date_obj = new Date(current_date);

            var new_schedule_doc = {
                user: user,
                schedule_ID: schedule_ID,
                schedule_Name: schedule_Name,
                enabled: true,
                target_address_type: target_address_type,
                target_address_ID: target_address_ID,
                created_time: current_date_obj.toISOString(),
                execute_time: execute_time,
                repeat: repeat_mode,
                action: schedule_action
            }

            var success = await database.DataBase_Open(Schedule_MGR_DB_Name);
            if(success==false)
            {
                return null;
            }

            success = await database.Database_EnsureIndex(Schedule_MGR_DB_Name, device_Type, "schedule_ID", true);
            if(success==false)
            {
                database.DataBase_Close(Schedule_MGR_DB_Name);
                return null;
            }

            var count = await database.Database_Count(Schedule_MGR_DB_Name, device_Type, {'schedule_ID': schedule_ID});
            if(count<0)
            {
                database.DataBase_Close(Schedule_MGR_DB_Name);
                return null;
            }

            var exist = false;
            if(count>0){
                exist = true;
            }

            if(exist==true)
            {
                database.DataBase_Close(Schedule_MGR_DB_Name);
                return null;
            }

            success = await database.Database_Insert(Schedule_MGR_DB_Name, device_Type, new_schedule_doc);
            if(success==false)
            {
                database.DataBase_Close(Schedule_MGR_DB_Name);
                return null;
            }

            database.DataBase_Close(Schedule_MGR_DB_Name);
            
            return schedule_ID;
        }
        catch(e)
        {
            debug("[Schedule_MGR] Create_New_Schedule() Error: " + e);
        }
    }

    self.Edit_Schedule = async function(device_Type, user, schedule_ID, schedule_Name, target_address_type, target_address_ID, execute_time, repeat_mode, schedule_action)
    {
        try{
            if(schedule_ID==null){
                return false;
            }

            if(schedule_Name==null || schedule_Name==''){
                return false;
            }
            
            if(target_address_type==null || target_address_ID==null){
                return false;
            }

            if(target_address_type!="Broadcast" && target_address_ID==null){
                return false;
            }
            if( target_address_type!="Device" &&
                target_address_type!="Group" &&
                target_address_type!="Broadcast"){
                return false;
            }

            if(target_address_type=="Broadcast" && target_address_ID!=null){
                target_address_ID = null;
            }
            
            if(do_Check_Time_Params(execute_time)==false){
                return false;
            }
            if(do_Check_Repeat_Params(repeat_mode)==false){
                return false;
            }
            if(do_Check_Action_Params(schedule_action)==false){
                return false;
            }
            
            var success = await database.DataBase_Open(Schedule_MGR_DB_Name);
            if(success==false)
            {
                return false;
            }

            const db_query = { $or: [ { 'user': user, 'schedule_ID':schedule_ID }, { 'user': 'everyone', 'schedule_ID':schedule_ID } ] };

            var schedule_docs = await database.Database_Find(Schedule_MGR_DB_Name, device_Type, db_query, null);
            if(schedule_docs==null || schedule_docs.length==0)
            {
                database.DataBase_Close(Schedule_MGR_DB_Name);
                return false;
            }

            var update_schedule_doc = schedule_docs[0];

            update_schedule_doc.target_address_type = target_address_type;
            update_schedule_doc.target_address_ID = target_address_ID;
            update_schedule_doc.execute_time = execute_time;
            update_schedule_doc.schedule_Name = schedule_Name;
            update_schedule_doc.repeat = repeat_mode;
            update_schedule_doc.action = schedule_action;
            
            success = await database.Database_Update(Schedule_MGR_DB_Name, device_Type, db_query, update_schedule_doc, false);
            if(success==false)
            {
                database.DataBase_Close(Schedule_MGR_DB_Name);
                return false;
            }

            database.DataBase_Close(Schedule_MGR_DB_Name);
            
            return true;
        }
        catch(e)
        {
            debug("[Schedule_MGR] Edit_Schedule() Error: " + e);
        }
    }

    self.Schedule_Change_Name = async function(device_Type, user, schedule_ID, new_Name)
    {
        try{
            if(new_Name==null || new_Name=="")
            {
                return false;
            }

            var success = await database.DataBase_Open(Schedule_MGR_DB_Name);
            if(success==false)
            {
                return false;
            }

            const db_query = { $or: [ { 'user': user, 'schedule_ID':schedule_ID }, { 'user': 'everyone', 'schedule_ID':schedule_ID } ] };

            var schedule_docs = await database.Database_Find(Schedule_MGR_DB_Name, device_Type, db_query, null);
            if(schedule_docs==null || schedule_docs.length==0)
            {
                database.DataBase_Close(Schedule_MGR_DB_Name);
                return false;
            }

            var update_schedule_doc = schedule_docs[0];
            update_schedule_doc.schedule_Name = new_Name;

            success = await database.Database_Update(Schedule_MGR_DB_Name, device_Type, db_query, update_schedule_doc, false);
            if(success==false)
            {
                database.DataBase_Close(Schedule_MGR_DB_Name);
                return false;
            }

            database.DataBase_Close(Schedule_MGR_DB_Name);
            
            return true;
        }
        catch(e)
        {
            debug("[Schedule_MGR] Schedule_Change_Name() Error: " + e);
        }
    }

    self.Get_Schedule_List = async function(device_Type, user)
    {
        try{
            var rsp_json = {};

            var success = await database.DataBase_Open(Schedule_MGR_DB_Name);
            if(success==false)
            {
                return null;
            }

            const db_query = { $or: [ { 'user': user }, { 'user': 'everyone' } ] };

            var schedule_docs = await database.Database_Find(Schedule_MGR_DB_Name, device_Type, db_query, null);
            if(schedule_docs==null || schedule_docs.length==0)
            {
                database.DataBase_Close(Schedule_MGR_DB_Name);
                return null;
            }

            database.DataBase_Close(Schedule_MGR_DB_Name);

            rsp_json.schedule_list = schedule_docs;

            return rsp_json;
        }
        catch(e)
        {
            debug("[Schedule_MGR] Get_Schedule_List() Error: " + e);
        }
    }

    self.Get_Enabled_Schedule_List = async function(user)
    {
        try{
            var success = await database.DataBase_Open(Schedule_MGR_DB_Name);
            if(success==false)
            {
                return null;
            }

            const db_query = { $or: [ { 'user': user, 'enabled': true }, 
                                { 'user': 'everyone', 'enabled': true } ] };

            var schedule_docs = await database.Database_Find(Schedule_MGR_DB_Name, device_Type, db_query, null);
            if(schedule_docs==null || schedule_docs.length==0)
            {
                database.DataBase_Close(Schedule_MGR_DB_Name);
                return null;
            }

            database.DataBase_Close(Schedule_MGR_DB_Name);

            return schedule_docs;
        }
        catch(e)
        {
            debug("[Schedule_MGR] Get_Executable_Schedule_List() Error: " + e);
        }
    }

    self.Get_Schedule_Info = async function(device_Type, user, schedule_ID)
    {
        try{
            var success = await database.DataBase_Open(Schedule_MGR_DB_Name);
            if(success==false)
            {
                return null;
            }

            const db_query = { $or: [ { 'user': user, 'schedule_ID': schedule_ID }, { 'user': 'everyone', 'schedule_ID': schedule_ID } ] };

            var schedule_docs = await database.Database_Find(Schedule_MGR_DB_Name, device_Type, db_query, null);
            if(schedule_docs==null || schedule_docs.length==0)
            {
                database.DataBase_Close(Schedule_MGR_DB_Name);
                return null;
            }

            database.DataBase_Close(Schedule_MGR_DB_Name);

            return schedule_docs[0];
        }
        catch(e)
        {
            debug("[Schedule_MGR] Get_Schedule_Info() Error: " + e);
        }
    }
    
    self.Get_Schedule_Execute_Time = async function(device_Type, user, schedule_ID)
    {
        try{
            var success = await database.DataBase_Open(Schedule_MGR_DB_Name);
            if(success==false)
            {
                return null;
            }

            const db_query = { $or: [ { 'user': user, 'schedule_ID': schedule_ID }, { 'user': 'everyone', 'schedule_ID': schedule_ID } ] };

            var schedule_docs = await database.Database_Find(Schedule_MGR_DB_Name, device_Type, db_query, null);
            if(schedule_docs==null || schedule_docs.length==0)
            {
                database.DataBase_Close(Schedule_MGR_DB_Name);
                return null;
            }

            database.DataBase_Close(Schedule_MGR_DB_Name);

            return schedule_docs[0].execute_time;
        }
        catch(e)
        {
            debug("[Schedule_MGR] Get_Schedule_Execute_Time() Error: " + e);
        }
    }

    self.Update_Schedule_Execute_Time = async function(device_Type, user, schedule_ID, execute_time)
    {
        try{
            if(start_date_time==null || stop_date_time==null){
                return false;
            }

            if(do_Check_Time_Params(execute_time)==false){
                return false;
            }

            var success = await database.DataBase_Open(Schedule_MGR_DB_Name);
            if(success==false)
            {
                return false;
            }

            const db_query = { $or: [ { 'user': user, 'schedule_ID': schedule_ID }, { 'user': 'everyone', 'schedule_ID': schedule_ID } ] };

            var schedule_docs = await database.Database_Find(Schedule_MGR_DB_Name, device_Type, db_query, null);
            if(schedule_docs==null || schedule_docs.length==0)
            {
                database.DataBase_Close(Schedule_MGR_DB_Name);
                return false;
            }

            var update_schedule_doc = schedule_docs[0];
            update_schedule_doc.execute_time = execute_time,

            success = await database.Database_Update(Schedule_MGR_DB_Name, device_Type, db_query, update_schedule_doc, false);
            if(success==false)
            {
                database.DataBase_Close(Schedule_MGR_DB_Name);
                return false;
            }

            database.DataBase_Close(Schedule_MGR_DB_Name);

            return true;
        }
        catch(e)
        {
            debug("[Schedule_MGR] Update_Schedule_Repeat_Info() Error: " + e);
        }
    }

    self.Get_Schedule_Repeat_Info = async function(device_Type, user, schedule_ID)
    {
        try{
            var success = await database.DataBase_Open(Schedule_MGR_DB_Name);
            if(success==false)
            {
                return null;
            }

            const db_query = { $or: [ { 'user': user, 'schedule_ID': schedule_ID }, { 'user': 'everyone', 'schedule_ID': schedule_ID } ] };

            var schedule_docs = await database.Database_Find(Schedule_MGR_DB_Name, device_Type, db_query, null);
            if(schedule_docs==null || schedule_docs.length==0)
            {
                database.DataBase_Close(Schedule_MGR_DB_Name);
                return null;
            }

            database.DataBase_Close(Schedule_MGR_DB_Name);

            return schedule_docs[0].repeat;
        }
        catch(e)
        {
            debug("[Schedule_MGR] Get_Schedule_Repeat_Info() Error: " + e);
        }
    }

    self.Update_Schedule_Repeat_Info = async function(device_Type, user, schedule_ID, new_repeat_info)
    {
        try{
            if(do_Check_Repeat_Params(new_repeat_info)==false){
                return false;
            }
            
            var success = await database.DataBase_Open(Schedule_MGR_DB_Name);
            if(success==false)
            {
                return false;
            }

            const db_query = { $or: [ { 'user': user, 'schedule_ID': schedule_ID }, { 'user': 'everyone', 'schedule_ID': schedule_ID } ] };

            var schedule_docs = await database.Database_Find(Schedule_MGR_DB_Name, device_Type, db_query, null);
            if(schedule_docs==null || schedule_docs.length==0)
            {
                database.DataBase_Close(Schedule_MGR_DB_Name);
                return false;
            }

            var update_schedule_doc = schedule_docs[0];
            update_schedule_doc.repeat = new_repeat_info;

            success = await database.Database_Update(Schedule_MGR_DB_Name, device_Type, db_query, update_schedule_doc, false);
            if(success==false)
            {
                database.DataBase_Close(Schedule_MGR_DB_Name);
                return false;
            }

            database.DataBase_Close(Schedule_MGR_DB_Name);

            return true;
        }
        catch(e)
        {
            debug("[Schedule_MGR] Update_Schedule_Repeat_Info() Error: " + e);
        }
    }

    self.Get_Schedule_Action = async function(device_Type, user, schedule_ID)
    {
        try{
            var success = await database.DataBase_Open(Schedule_MGR_DB_Name);
            if(success==false)
            {
                return null;
            }

            const db_query = { $or: [ { 'user': user, 'schedule_ID': schedule_ID }, { 'user': 'everyone', 'schedule_ID': schedule_ID } ] };

            var schedule_docs = await database.Database_Find(Schedule_MGR_DB_Name, device_Type, db_query, null);
            if(schedule_docs==null || schedule_docs.length==0)
            {
                database.DataBase_Close(Schedule_MGR_DB_Name);
                return null;
            }

            database.DataBase_Close(Schedule_MGR_DB_Name);

            return schedule_docs[0].action;
        }
        catch(e)
        {
            debug("[Schedule_MGR] Get_Schedule_Action() Error: " + e);
        }
    }

    self.Update_Schedule_Action = async function(device_Type, user, schedule_ID, new_schedule_action)
    {
        try{
            if(do_Check_Action_Params(new_schedule_action)==false){
                return false;
            }
            
            var success = await database.DataBase_Open(Schedule_MGR_DB_Name);
            if(success==false)
            {
                return false;
            }

            const db_query = { $or: [ { 'user': user, 'schedule_ID': schedule_ID }, { 'user': 'everyone', 'schedule_ID': schedule_ID } ] };

            var schedule_docs = await database.Database_Find(Schedule_MGR_DB_Name, device_Type, db_query, null);
            if(schedule_docs==null || schedule_docs.length==0)
            {
                database.DataBase_Close(Schedule_MGR_DB_Name);
                return false;
            }

            var update_schedule_doc = schedule_docs[0];
            update_schedule_doc.action = new_schedule_action;

            success = await database.Database_Update(Schedule_MGR_DB_Name, device_Type, db_query, update_schedule_doc, false);
            if(success==false)
            {
                database.DataBase_Close(Schedule_MGR_DB_Name);
                return false;
            }

            database.DataBase_Close(Schedule_MGR_DB_Name);

            return true;
        }
        catch(e)
        {
            debug("[Schedule_MGR] Update_Schedule_Action() Error: " + e);
        }
    }

    self.Enable_Disable_Schedule = async function(device_Type, user, schedule_ID, enabled)
    {
        try{
            var success = await database.DataBase_Open(Schedule_MGR_DB_Name);
            if(success==false)
            {
                return false;
            }

            const db_query = { $or: [ { 'user': user, 'schedule_ID': schedule_ID }, { 'user': 'everyone', 'schedule_ID': schedule_ID } ] };

            var schedule_docs = await database.Database_Find(Schedule_MGR_DB_Name, device_Type, db_query, null);
            if(schedule_docs==null || schedule_docs.length==0)
            {
                database.DataBase_Close(Schedule_MGR_DB_Name);
                return false;
            }

            var update_schedule_doc = schedule_docs[0];
            update_schedule_doc.enabled = enabled;

            success = await database.Database_Update(Schedule_MGR_DB_Name, device_Type, db_query, update_schedule_doc, false);
            if(success==false)
            {
                database.DataBase_Close(Schedule_MGR_DB_Name);
                return false;
            }

            database.DataBase_Close(Schedule_MGR_DB_Name);

            return true;
        }
        catch(e)
        {
            debug("[Schedule_MGR] Enable_Disable_Schedule() Error: " + e);
        }
    }

    self.Delete_Schedule = async function(device_Type, user, schedule_ID)
    {
        try{
            var success = await database.DataBase_Open(Schedule_MGR_DB_Name);
            if(success==false)
            {
                return false;
            }

            const db_query = { $or: [ { 'user': user, 'schedule_ID': schedule_ID }, { 'user': 'everyone', 'schedule_ID': schedule_ID } ] };

            success = await database.Database_Remove(Schedule_MGR_DB_Name, device_Type, db_query, true);
            if(success==false)
            {
                database.DataBase_Close(Schedule_MGR_DB_Name);
                return false;
            }

            database.DataBase_Close(Schedule_MGR_DB_Name);

            return success;
        }
        catch(e)
        {
            debug("[Schedule_MGR] Remove_Schedule() Error: " + e);
        }
    }
}
module.exports = Schedule_MGR;

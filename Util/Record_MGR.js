
var debug = require('debug')(require('path').basename(__filename));

const config = require('config');

var DataBase = require('../DataBase/DataBase.js');
var database = new DataBase();

const Record_MGR_DB_Name = 'record';

var Record_MGR = function (){
    var self = this;

    self.Get_Record_Device_List = function()
    {
        var device_ID_list = [];

        var collections = database.Database_ListCollections(Record_MGR_DB_Name);

        for(var i = 0; i<collections.length; i++)
        {
            device_ID_list.push(collections[i].name);
        }

        return device_ID_list;
    }

    self.Record_Device_Measure_State = async function(device_ID, measure_attribute_list)
    {
        try{
            if(device_ID==null || measure_attribute_list==null){
                return false;
            }

            if(Array.isArray(measure_attribute_list)==false){
                return false;
            }

            var success = false;

            var current_date =  Date.now();
            var current_date_obj = new Date(current_date);

            var store_state = {};
            store_state["device_ID"] = device_ID;
            store_state["date"] = current_date_obj.toISOString();

            for(var i = 0; i<measure_attribute_list.length; i++)
            {
                if(measure_attribute_list[i].name==null){
                    continue;
                }

                var key = measure_attribute_list[i].name;

                if(measure_attribute_list[i].value==null){
                    store_state[key] = 0;
                }
                else{
                    store_state[key] = measure_attribute_list[i].value;
                }
            }

            var success = await database.DataBase_Open(Record_MGR_DB_Name);
            if(success==false)
            {
                return false;
            }

            success = await database.Database_EnsureIndex(Record_MGR_DB_Name, device_ID, "date", true);
            if(success==false)
            {
                await database.DataBase_Close(Record_MGR_DB_Name);
                return false;
            }

            success = await database.Database_Insert(Record_MGR_DB_Name, device_ID, store_state);
            if(success==false)
            {
                await database.DataBase_Close(Record_MGR_DB_Name);
                return false;
            }

            await database.DataBase_Close(Record_MGR_DB_Name);
            
            return true;
        }
        catch(e)
        {
            debug("[Record_MGR] Record_Device_Current_State() Error: " + e);
        }
    };

    self.Record_Device_Event_State = async function(device_ID, event_type, event_attribute_list)
    {
        try{
            if(device_ID==null || event_type==null || event_attribute_list==null){
                return false;
            }

            if(Array.isArray(event_attribute_list)==false){
                return false;
            }

            var success = false;

            var current_date =  Date.now();
            var current_date_obj = new Date(current_date);
            
            var store_state = {};
            store_state["device_ID"] = device_ID;
            store_state["date"] = current_date_obj.toISOString();

            for(var i = 0; i<event_attribute_list.length; i++)
            {
                if(event_attribute_list[i].name==null){
                    continue;
                }

                var key = event_attribute_list[i].name;

                if(event_attribute_list[i].value==null){
                    store_state[key] = 0;
                }
                else{
                    store_state[key] = event_attribute_list[i].value;
                }
            }

            var db_collection_name = device_ID+":"+event_type;

            var success = await database.DataBase_Open(Record_MGR_DB_Name);
            if(success==false)
            {
                return false;
            }

            success = await database.Database_EnsureIndex(Record_MGR_DB_Name, db_collection_name, "date", true);
            if(success==false)
            {
                await database.DataBase_Close(Record_MGR_DB_Name);
                return false;
            }

            success = await database.Database_Insert(Record_MGR_DB_Name, db_collection_name, store_state);
            if(success==false)
            {
                await database.DataBase_Close(Record_MGR_DB_Name);
                return false;
            }

            await database.DataBase_Close(Record_MGR_DB_Name);

            return true;
        }
        catch(e)
        {
            debug("[Record_MGR] Record_Device_Current_State() Error: " + e);
        }
    };

    self.Read_Device_State_Records = async function(device_ID, start_date, end_date, max_data_count)
    {
        try{
            if(device_ID==null){
                return null;
            }

            if(max_data_count!=null && max_data_count<=0)
            {
                return null;
            }

            if(start_date==null && end_date==null)
            {
                return null;
            }

            var start_date_obj = null;
            var end_date_obj = null;

            if(start_date!=null)
            {
                if(typeof start_date == Object)
                {
                    start_date_obj = start_date;
                }
                else
                {
                    start_date_obj = new Date(start_date);
                }
            }
            if(end_date!=null)
            {
                if(typeof end_date == Object)
                {
                    end_date_obj = end_date;
                }
                else
                {
                    end_date_obj = new Date(end_date);
                }
            }
            
            if(start_date!=null && end_date!=null)
            {
                if((end_date_obj-start_date_obj)<0)
                {
                    return null;
                }
            }

            var db_query = {};

            if(start_date==null && end_date!=null)
            {
                db_query = {
                    $and: [
                        {
                            device_ID: device_ID
                        },
                        {
                            date: {
                                $lte: end_date_obj.toISOString()
                            }
                        }
                    ]
                };
            }

            if(start_date!=null && end_date==null)
            {
                db_query = {
                    $and: [
                        {
                            device_ID: device_ID
                        },
                        {
                            date: {
                                $gte: start_date_obj.toISOString()
                            }
                        }
                    ]
                };
            }

            if(start_date!=null && end_date!=null)
            {
                db_query = {
                    $and: [
                        {
                            device_ID: device_ID
                        },
                        {
                            date: {
                                $lte: end_date_obj.toISOString(),
                                $gte: start_date_obj.toISOString()
                            }
                        }
                    ]
                };
            }

            var success = await database.DataBase_Open(Record_MGR_DB_Name);
            if(success==false)
            {
                return null;
            }

            var record_docs;
            if(max_data_count!=null)
            {
                record_docs = await database.Database_FindLimit(Record_MGR_DB_Name, device_ID, db_query, max_data_count, null);
            }
            else{
                record_docs = await database.Database_Find(Record_MGR_DB_Name, device_ID, db_query, null);
            }
            if(record_docs==null)
            {
                await database.DataBase_Close(Record_MGR_DB_Name);
                return null;
            }

            await database.DataBase_Close(Record_MGR_DB_Name);
            
            var return_obj = {};

            return_obj.record_history = record_docs;

            return return_obj;
        }
        catch(e)
        {
            debug("[Record_MGR] Read_Device_State_Records() Error: " + e);
        }
    };

    self.Read_Device_Specific_Type_State_Records = async function(device_ID, type, start_date, end_date, max_data_count)
    {
        try{
            if(device_ID==null){
                return null;
            }
            
            if(max_data_count!=null && max_data_count<=0)
            {
                return null;
            }

            if(start_date==null && end_date==null)
            {
                return null;
            }

            var start_date_obj = null;
            var end_date_obj = null;

            if(start_date!=null)
            {
                start_date_obj = new Date(start_date);
            }
            if(end_date!=null)
            {
                end_date_obj = new Date(end_date);
            }
            
            if(start_date!=null && end_date!=null)
            {
                if((end_date_obj-start_date_obj)<0)
                {
                    return null;
                }
            }

            var db_collection_name = device_ID+":"+type;

            var db_query = {};

            if(start_date==null && end_date!=null)
            {
                db_query = {
                    $and: [
                        {
                            device_ID: device_ID
                        },
                        {
                            date: {
                                $lte: end_date_obj.toISOString()
                            }
                        }
                    ]
                };
            }

            if(start_date!=null && end_date==null)
            {
                db_query = {
                    $and: [
                        {
                            device_ID: device_ID
                        },
                        {
                            date: {
                                $gte: start_date_obj.toISOString()
                            }
                        }
                    ]
                };
            }

            if(start_date!=null && end_date!=null)
            {
                db_query = {
                    $and: [
                        {
                            device_ID: device_ID
                        },
                        {
                            date: {
                                $lte: end_date_obj.toISOString(),
                                $gte: start_date_obj.toISOString()
                            }
                        }
                    ]
                };
            }

            var success = await database.DataBase_Open(Record_MGR_DB_Name);
            if(success==false)
            {
                return null;
            }

            var record_docs;

            if(max_data_count!=null)
            {
                record_docs = await database.Database_FindLimit(Record_MGR_DB_Name, db_collection_name, db_query, max_data_count, null);
            }
            else{
                record_docs = await database.Database_Find(Record_MGR_DB_Name, db_collection_name, db_query, null);
            }
            
            if(record_docs==null)
            {
                await database.DataBase_Close(Record_MGR_DB_Name);
                return null;
            }

            await database.DataBase_Close(Record_MGR_DB_Name);
            
            var return_obj = {};

            return_obj.record_history = record_docs;

            return return_obj;
        }
        catch(e)
        {
            debug("[Record_MGR] Read_Device_State_Records() Error: " + e);
        }
    };

    self.Read_Device_State_Records_Today = async function(device_ID)
    {
        try{
            var current_date_time_start =  Date.now();
            var current_date_time_day_start_obj = new Date(current_date_time_start);
            current_date_time_day_start_obj.setHours(0);
            current_date_time_day_start_obj.setMinutes(0);
            current_date_time_day_start_obj.setSeconds(0);
            current_date_time_day_start_obj.setMilliseconds(0);

            return await Read_Device_State_Records(device_ID, current_date_time_day_start_obj.toISOString(), Date.now());
        }
        catch(e)
        {
            debug("[Record_MGR] Read_Device_State_Records_Today() Error: " + e);
        }
    }
}
module.exports = Record_MGR;
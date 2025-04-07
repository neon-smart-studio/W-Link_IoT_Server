
var debug = require('debug')(require('path').basename(__filename));

const config = require('config');

var DataBase = require('../DataBase/DataBase.js');
var database = new DataBase();

var Record_MGR = require('./Record_MGR.js');
var record_mgr = new Record_MGR();

var SpreadSheet_Analyze_MGR = require('../Google/SpreadSheet/SpreadSheet_Analyze_MGR.js');
var spreadsheet_analyze_mgr = new SpreadSheet_Analyze_MGR();

const Analyze_MGR_DB_Name = 'analyze';

/*  schema
Record_Info = {
    mode: <String>,     //"yearly","monthly","daily","hourly"
    year: <Number>,     //only valid for mode=="yearly","monthly","daily","hourly"
    month: <Number>,    //only valid for mode=="monthly","daily","hourly"
    day: <Number>,      //only valid for mode=="daily","hourly"
    hour: <Number>,     //only valid for mode=="hourly"
    analyze_attribute_list: [{
        name: <String>,
        average: <Number>,
        sum: <Number>,
        max: <Number>,
        min: <Number>
    }]
};
*/


/* 
mode: 'hourly' 'daily' 'monthly' 'yearly'
return: {
    year: <Number>,     //only valid for mode=="yearly","monthly","daily","hourly"
    month: <Number>,    //only valid for mode=="monthly","daily","hourly"
    day: <Number>,      //only valid for mode=="daily","hourly"
    hour: <Number>,     //only valid for mode=="hourly"
    records: []
}
*/
function do_Group_Device_Record(mode, record_data)
{
    if(Array.isArray(record_data)==false)
    {
        return [];
    }

    switch(mode)
    {
        case 'hourly':
        case 'daily':
        case 'monthly':
        case 'yearly':
            break;
        default:
            return [];
    }

    var group_record_list = [];

    for(var i = 0; i<record_data.length; i++)
    {
        var grouped_hour;
        var grouped_day;
        var grouped_month;
        var grouped_year;

        switch(mode)
        {
            case 'hourly':
                grouped_hour = record_data[i].date.getHours();
            case 'daily':
                grouped_day = record_data[i].date.getDate();
            case 'monthly':
                grouped_month = record_data[i].date.getMonth() + 1;
            case 'yearly':
                grouped_year = record_data[i].date.getYear() + 1900;
                break;
            default:
                return [];
        }

        var exist_index = -1;
        for(var j = 0; j<group_record_list.length; j++)
        {
            switch(mode)
            {
                case 'hourly':
                    if(grouped_hour != group_record_list[j].hour)
                    {
                        continue;
                    }
                case 'daily':
                    if(grouped_day != group_record_list[j].day)
                    {
                        continue;
                    }
                case 'monthly':
                    if(grouped_month != group_record_list[j].month)
                    {
                        continue;
                    }
                case 'yearly':
                    if(grouped_year != group_record_list[j].year)
                    {
                        continue;
                    }
            }

            exist_index = j;
            break;
        }

        if(exist_index<0)
        {
            switch(mode)
            {
                case 'hourly':
                    group_record_list.push({
                        year: grouped_year,
                        month: grouped_month,
                        day: grouped_day,
                        hour: grouped_hour,
                        records: [record_data[i]]
                    });
                    break;
                case 'daily':
                    group_record_list.push({
                        year: grouped_year,
                        month: grouped_month,
                        day: grouped_day,
                        records: [record_data[i]]
                    });
                    break;
                case 'monthly':
                    group_record_list.push({
                        year: grouped_year,
                        month: grouped_month,
                        records: [record_data[i]]
                    });
                    break;
                case 'yearly':
                    group_record_list.push({
                        year: grouped_year,
                        records: [record_data[i]]
                    });
                    break;
            }
        }
        else{
            group_record_list[exist_index].records.push(record_data[i]);
        }
    }

    return group_record_list;
}

/* 
return: [{
    name: <String>,
    average: <Number>,
    sum: <Number>,
    max: <Number>,
    min: <Number>
}]
*/
function do_Caculate_Device_Record(record_data, caculate_attribute_name_list)
{
    if(Array.isArray(record_data)==false)
    {
        return null;
    }

    if(record_data==[])
    {
        return null;
    }

    var caculate_result_list = [];
    for(var i = 0; i<caculate_attribute_name_list.length; i++)
    {
        var key = caculate_attribute_name_list[i];

        var map_record_data = record_data.map((x)=>{ return x[key]; });
        map_record_data = map_record_data.filter((x)=>{ return x!=null; });
        var sum = map_record_data.reduce((accum, current)=>{ return accum+current; }, 0);
        var avg = sum / (map_record_data.length);

        caculate_result_list.push({
            name: key,
            average: avg,
            sum: sum,
            max : Math.max(...map_record_data),
            min : Math.min(...map_record_data)
        });
    }

    return caculate_result_list;
}

/* mode
'hourly'
'daily'
'monthly'
'yearly'
*/
async function do_Analyze_Device_Record(mode, device_ID, analyze_attribute_name_list, start_date, end_date)
{
    if(device_ID==null || analyze_attribute_name_list==null){
        return false;
    }

    if(Array.isArray(analyze_attribute_name_list)==false){
        return false;
    }

    if(start_date==null || end_date==null)
    {
        return false;
    }

    var read_records = await record_mgr.Read_Device_State_Records(device_ID, start_date, end_date, null);
    if(read_records==null)
    {
        return false;
    }
    var records = read_records.record_history;

    for(var i = 0; i<records.length; i++)
    {
        records[i].date = new Date(records[i].date);
    }
    records.sort((a, b)=>{
        return ( a.date - b.date );
    })
    
    var record_analyze_list = [];

    var grouped_records = do_Group_Device_Record(mode, records);
    for(var i = 0; i<grouped_records.length; i++)
    {
        var analyze_result = do_Caculate_Device_Record(grouped_records[i].records, analyze_attribute_name_list);
        
        switch(mode)
        {
            case 'hourly':
                record_analyze_list.push({
                    mode: "hourly",
                    year: grouped_records[i].year,
                    month: grouped_records[i].month,
                    day: grouped_records[i].day,
                    hour: grouped_records[i].hour,
                    analyze_attribute_list: analyze_result
                });
                break;
            case 'daily':
                record_analyze_list.push({
                    mode: "daily",
                    year: grouped_records[i].year,
                    month: grouped_records[i].month,
                    day: grouped_records[i].day,
                    analyze_attribute_list: analyze_result
                });
                break;
            case 'monthly':
                record_analyze_list.push({
                    mode: "monthly",
                    year: grouped_records[i].year,
                    month: grouped_records[i].month,
                    analyze_attribute_list: analyze_result
                });
                break;
            case 'yearly':
                record_analyze_list.push({
                    mode: "yearly",
                    year: grouped_records[i].year,
                    analyze_attribute_list: analyze_result
                });
                break;
        }
    }

    for(var i = 0; i<record_analyze_list.length; i++)
    {
        var analyze_time_date = {}
        switch(mode)
        {
            case 'hourly':
                analyze_time_date = {
                    year: record_analyze_list[i].year,
                    month: record_analyze_list[i].month,
                    day: record_analyze_list[i].day,
                    hour: record_analyze_list[i].hour
                }
                break;
            case 'daily':
                analyze_time_date = {
                    year: record_analyze_list[i].year,
                    month: record_analyze_list[i].month,
                    day: record_analyze_list[i].day
                }
                break;
            case 'monthly':
                analyze_time_date = {
                    year: record_analyze_list[i].year,
                    month: record_analyze_list[i].month
                }
                break;
            case 'yearly':
                analyze_time_date = {
                    year: record_analyze_list[i].year
                }
                break;
        }
        var db_query =  Object.assign({
            mode: mode
        }, analyze_time_date);
        
        var success = await database.DataBase_Open(Analyze_MGR_DB_Name);
        if(success==false)
        {
            return false;
        }

        var analyze_record_count = await database.Database_Count(Analyze_MGR_DB_Name, device_ID, db_query);
        if(analyze_record_count<0)
        {
            database.DataBase_Close(Device_MGR_DB_Name);
            return false;
        }
        
        if(analyze_record_count>0)
        {
            if(analyze_record_count==1)
            {
                success = await database.Database_Update(Analyze_MGR_DB_Name, device_ID, db_query, record_analyze_list[i], false);
                if(success==false)
                {
                    database.DataBase_Close(Analyze_MGR_DB_Name);
                    return false;
                }
            }
            else{
                success = await database.Database_Remove(Analyze_MGR_DB_Name, device_ID, db_query, true);
                if(success==false)
                {
                    database.DataBase_Close(Device_MGR_DB_Name);
                    return false;
                }
                
                success = await database.Database_Insert(Analyze_MGR_DB_Name, device_ID, record_analyze_list[i]);
                if(success==false)
                {
                    database.DataBase_Close(Analyze_MGR_DB_Name);
                    return false;
                }
            }
        }
        else{
            success = await database.Database_Insert(Analyze_MGR_DB_Name, device_ID, record_analyze_list[i]);
            if(success==false)
            {
                database.DataBase_Close(Analyze_MGR_DB_Name);
                return false;
            }
        }

        await spreadsheet_analyze_mgr.Save_Device_Record_Analyze_Result(mode, device_ID, analyze_time_date, record_analyze_list[i].analyze_attribute_list);
    }

    database.DataBase_Close(Analyze_MGR_DB_Name);

    return true;
};

var Analyze_MGR = function (){
    var self = this;

    self.Analyze_Device_Record_This_Hour = async function(device_ID, analyze_attribute_name_list)
    {
        try{
            var current_date =  Date.now();

            var analyze_start_date = new Date(current_date);
            analyze_start_date.setMinutes(0);
            analyze_start_date.setSeconds(0);
            
            var analyze_end_date = new Date(current_date);
            analyze_end_date.setMinutes(59);
            analyze_end_date.setSeconds(59);

            return await do_Analyze_Device_Record("hourly", device_ID, analyze_attribute_name_list, analyze_start_date, analyze_end_date);
        }
        catch(e)
        {
            debug("[Analyze_MGR] Analyze_Device_Record_This_Hour() Error: " + e);
        }
    };

    self.Analyze_Device_Record_Today = async function(device_ID, analyze_attribute_name_list)
    {
        try{
            var current_date =  Date.now();

            var analyze_start_date = new Date(current_date);
            analyze_start_date.setHours(0);
            analyze_start_date.setMinutes(0);
            analyze_start_date.setSeconds(0);
            
            var analyze_end_date = new Date(current_date);
            analyze_end_date.setHours(23);
            analyze_end_date.setMinutes(59);
            analyze_end_date.setSeconds(59);

            return await do_Analyze_Device_Record("daily", device_ID, analyze_attribute_name_list, analyze_start_date, analyze_end_date);
        }
        catch(e)
        {
            debug("[Analyze_MGR] Analyze_Device_Record_Today() Error: " + e);
        }
    };

    self.Analyze_Device_Record_This_Month = async function(device_ID, analyze_attribute_name_list)
    {
        try{
            var current_date =  Date.now();
            var current_date_obj = new Date(current_date);

            var analyze_start_date = new Date(current_date_obj.getYear()+1900, current_date_obj.getMonth(), 1);
            var analyze_end_date = new Date(current_date_obj.getYear()+1900, current_date_obj.getMonth()+1, 0);

            return await do_Analyze_Device_Record("monthly", device_ID, analyze_attribute_name_list, analyze_start_date, analyze_end_date);
        }
        catch(e)
        {
            debug("[Analyze_MGR] Analyze_Device_Record_This_Month() Error: " + e);
        }
    };

    self.Analyze_Device_Record_This_Year = async function(device_ID, analyze_attribute_name_list)
    {
        try{
            var current_date =  Date.now();
            var current_date_obj = new Date(current_date);

            var analyze_start_date = new Date(current_date_obj.getYear()+1900, 1, 1);
            var analyze_end_date = new Date(current_date_obj.getYear()+1900+1, 1, 0);

            return await do_Analyze_Device_Record("yearly", device_ID, analyze_attribute_name_list, analyze_start_date, analyze_end_date);
        }
        catch(e)
        {
            debug("[Analyze_MGR] Analyze_Device_Record_This_Year() Error: " + e);
        }
    };

}
module.exports = Analyze_MGR;
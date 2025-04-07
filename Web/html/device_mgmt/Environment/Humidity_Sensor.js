
function Set_Individual_Humidity_Sensor_Resolution(device_ID, sensor_index, resolution)
{
    var cmd = {
        command_type: "Humidity Sensor",
        command: "Set Individual Humidity Sensor Resolution",
        device_ID: device_ID,
        sensor_index: Number(sensor_index),
        resolution: resolution
    }
    Websocket_Send_POST_Command("Environment", cmd);
}

function Set_All_Humidity_Sensor_Resolution(device_ID, resolution)
{
    var cmd = {
        command_type: "Humidity Sensor",
        command: "Set All Humidity Sensor Resolution",
        device_ID: device_ID,
        resolution: resolution
    }
    Websocket_Send_POST_Command("Environment", cmd);
}

function GET_Humidity_Sensor_Record_History(device_ID, start_date, end_date, max_data_count, callback)
{
    var cmd = {
        command_type: "Humidity Sensor",
        command: "Get Humidity Sensor Record History",
        device_ID: device_ID,
        start_date: start_date,
        end_date: end_date,
        max_data_count: max_data_count
    }
    Websocket_Send_GET_Command("Environment", cmd, callback);
}

function GET_Humidity_Sensor_Num_Of_Sensor(device_ID, callback)
{
    var cmd = {
        command_type: "Humidity Sensor",
        command: "Get Num Of Humidity Sensor",
        device_ID: device_ID,
    }
    Websocket_Send_GET_Command("Environment", cmd, callback);
}

function GET_Humidity_Sensor_Individual_Sensor_Status(device_ID, sensor_index, callback)
{
    var cmd = {
        command_type: "Humidity Sensor",
        command: "Get Individual Humidity Sensor Status",
        device_ID: device_ID,
        sensor_index: Number(sensor_index),
    }
    Websocket_Send_GET_Command("Environment", cmd, callback);
}

function GET_Humidity_Sensor_All_Sensor_Status(device_ID, callback)
{
    var cmd = {
        command_type: "Humidity Sensor",
        command: "Get All Humidity Sensor Status",
        device_ID: device_ID
    }
    Websocket_Send_GET_Command("Environment", cmd, callback);
}

function Set_Individual_Soil_Moisture_Sensor_Resolution(device_ID, sensor_index, resolution)
{
    var cmd = {
        command_type: "Soil Moisture Sensor",
        command: "Set Individual Soil Moisture Sensor Resolution",
        device_ID: device_ID,
        sensor_index: Number(sensor_index),
        resolution: resolution
    }
    Websocket_Send_POST_Command("Environment", cmd);
}

function Set_All_Soil_Moisture_Sensor_Resolution(device_ID, resolution)
{
    var cmd = {
        command_type: "Soil Moisture Sensor",
        command: "Set All Soil Moisture Sensor Resolution",
        device_ID: device_ID,
        resolution: resolution
    }
    Websocket_Send_POST_Command("Environment", cmd);
}

function GET_Soil_Moisture_Sensor_Num_Of_Sensor(device_ID, callback)
{
    var cmd = {
        command_type: "Soil Moisture Sensor",
        command: "Get Num Of Soil Moisture Sensor",
        device_ID: device_ID,
    }
    Websocket_Send_GET_Command("Environment", cmd, callback);
}

function GET_Soil_Moisture_Sensor_Individual_Sensor_Status(device_ID, sensor_index, callback)
{
    var cmd = {
        command_type: "Soil Moisture Sensor",
        command: "Get Individual Soil Moisture Sensor Status",
        device_ID: device_ID,
        sensor_index: Number(sensor_index),
    }
    Websocket_Send_GET_Command("Environment", cmd, callback);
}

function GET_Soil_Moisture_Sensor_All_Sensor_Status(device_ID, callback)
{
    var cmd = {
        command_type: "Soil Moisture Sensor",
        command: "Get All Soil Moisture Sensor Status",
        device_ID: device_ID
    }
    Websocket_Send_GET_Command("Environment", cmd, callback);
}
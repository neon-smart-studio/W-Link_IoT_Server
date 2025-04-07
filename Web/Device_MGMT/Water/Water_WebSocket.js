
var debug = require('debug')(require('path').basename(__filename));

var ElectroMagnetic_Valve_WebSocket = require('./Electromagnetic_Valve_WebSocket.js');
var electro_magnetic_valve_webSocket = new ElectroMagnetic_Valve_WebSocket();
var Flow_Meter_WebSocket = require('./Flow_Meter_WebSocket.js');
var flow_meter_webSocket = new Flow_Meter_WebSocket();
var Pump_Motor_WebSocket = require('./Pump_Motor_WebSocket.js');
var pump_motor_webSocket = new Pump_Motor_WebSocket();
var Water_EC_Sensor_WebSocket = require('./Water_EC_Sensor_WebSocket.js');
var water_ec_sensor_webSocket = new Water_EC_Sensor_WebSocket();
var Water_Level_Sensor_WebSocket = require('./Water_Level_Sensor_WebSocket.js');
var water_level_sensor_webSocket = new Water_Level_Sensor_WebSocket();
var Water_PH_Sensor_WebSocket = require('./Water_PH_Sensor_WebSocket.js');
var water_PH_sensor_webSocket = new Water_PH_Sensor_WebSocket();
var Water_Tank_WebSocket = require('./Water_Tank_WebSocket.js');
var water_tank_webSocket = new Water_Tank_WebSocket();

var Water_WebSocket = function (){
    var self = this;
    
    self.Process_Water_Topic_WebSocket_POST_Message = async function(username, post_json_data)
    {
        try{
            if(post_json_data.command_type!=null){
                switch(post_json_data.command_type){
                    case "Electromagnetic Valve":
                        await electro_magnetic_valve_webSocket.Process_EM_Valve_WebSocket_POST_Message(username, post_json_data);
                        break;
                    case "Flow Meter":
                        await flow_meter_webSocket.Process_Flow_Meter_WebSocket_POST_Message(username, post_json_data);
                        break;
                    case "Pump Motor":
                        await pump_motor_webSocket.Process_Pump_Motor_WebSocket_POST_Message(username, post_json_data);
                        break;
                    case "Water EC Sensor":
                        await water_ec_sensor_webSocket.Process_Water_EC_Sensor_WebSocket_POST_Message(username, post_json_data);
                        break;
                    case "Water Level Sensor":
                        await water_level_sensor_webSocket.Process_Water_Level_Sensor_WebSocket_POST_Message(username, post_json_data);
                        break;
                    case "Water PH Sensor":
                        await water_PH_sensor_webSocket.Process_Water_PH_Sensor_WebSocket_POST_Message(username, post_json_data);
                        break;
                    case "Water Tank":
                        await water_tank_webSocket.Process_Water_Tank_WebSocket_POST_Message(username, post_json_data);
                        break;
                }
            }
        }
        catch(e)
        {
            debug('[Water_WebSocket] Process_Water_WebSocket_POST_Message() Error ' + e);
        }
    }

    self.Process_Water_Topic_WebSocket_GET_Message = async function(username, get_json_data)
    {
        try{
            var rsp_json = null;
            if(get_json_data.command_type!=null){
                switch(get_json_data.command_type){
                    case "Electromagnetic Valve":
                        rsp_json = await electro_magnetic_valve_webSocket.Process_EM_Valve_WebSocket_GET_Message(username, get_json_data);
                        break;
                    case "Flow Meter":
                        rsp_json = await flow_meter_webSocket.Process_Flow_Meter_WebSocket_GET_Message(username, get_json_data);
                        break;
                    case "Pump Motor":
                        rsp_json = await pump_motor_webSocket.Process_Pump_Motor_WebSocket_GET_Message(username, get_json_data);
                        break;
                    case "Water EC Sensor":
                        rsp_json = await water_ec_sensor_webSocket.Process_Water_EC_Sensor_WebSocket_GET_Message(username, get_json_data);
                        break;
                    case "Water Level Sensor":
                        rsp_json = await water_level_sensor_webSocket.Process_Water_Level_Sensor_WebSocket_GET_Message(username, get_json_data);
                        break;
                    case "Water PH Sensor":
                        rsp_json = await water_PH_sensor_webSocket.Process_Water_PH_Sensor_WebSocket_GET_Message(username, get_json_data);
                        break;
                    case "Water Tank":
                        rsp_json = await water_tank_webSocket.Process_Water_Tank_WebSocket_GET_Message(username, get_json_data);
                        break;
                }
            }
            return rsp_json;
        }
        catch(e)
        {
            debug('[Water_WebSocket] Process_Water_WebSocket_GET_Message() Error ' + e);
        }
    }
}
module.exports = Water_WebSocket;

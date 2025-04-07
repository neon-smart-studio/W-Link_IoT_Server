
const Electric_Car_Move_Command_Min_Interval_Ms = 100;
const Electric_Car_Dir_Command_Min_Interval_Ms = 100;

var electric_car_move_command_timeout_timer = null;
var electric_car_dir_command_timeout_timer = null;

function Electric_Car_Move_Forward(device_ID, move_speed_percentage)
{
    if(electric_car_move_command_timeout_timer!=null){return;}

    var cmd = {
        command_type: "Electric Car",
        command: "Electric Car Move Forward",
        device_ID: device_ID,
        move_speed_percentage: Number(move_speed_percentage)
    };

    electric_car_move_command_timeout_timer = window.setInterval( function(){
        electric_car_move_command_timeout_timer = null
    }, Electric_Car_Move_Command_Min_Interval_Ms);

    Websocket_Send_POST_Command("Traffic", cmd);
}

function Electric_Car_Move_Back(device_ID, move_speed_percentage)
{
    if(electric_car_move_command_timeout_timer!=null){return;}

    var cmd = {
        command_type: "Electric Car",
        command: "Electric Car Move Back",
        device_ID: device_ID,
        move_speed_percentage: Number(move_speed_percentage)
    };
    
    electric_car_move_command_timeout_timer = window.setInterval( function(){
        electric_car_move_command_timeout_timer = null
    }, Electric_Car_Move_Command_Min_Interval_Ms);

    Websocket_Send_POST_Command("Traffic", cmd);
}

function Electric_Car_Stop(device_ID)
{
    if(electric_car_move_command_timeout_timer!=null){return;}

    var cmd = {
        command_type: "Electric Car",
        command: "Electric Car Stop",
        device_ID: device_ID
    };
    
    electric_car_move_command_timeout_timer = window.setInterval( function(){
        electric_car_move_command_timeout_timer = null
    }, Electric_Car_Move_Command_Min_Interval_Ms);

    Websocket_Send_POST_Command("Traffic", cmd);
}

function Electric_Car_Turn_Left(device_ID, degree)
{
    if(electric_car_dir_command_timeout_timer!=null){return;}

    var cmd = {
        command_type: "Electric Car",
        command: "Electric Car Turn Left",
        device_ID: device_ID,
        turn_left_degree: Number(degree)
    };
    
    electric_car_dir_command_timeout_timer = window.setInterval( function(){
        electric_car_dir_command_timeout_timer = null
    }, Electric_Car_Dir_Command_Min_Interval_Ms);

    Websocket_Send_POST_Command("Traffic", cmd);
}

function Electric_Car_Turn_Right(device_ID, degree)
{
    if(electric_car_dir_command_timeout_timer!=null){return;}

    var cmd = {
        command_type: "Electric Car",
        command: "Electric Car Turn Right",
        device_ID: device_ID,
        turn_right_degree: Number(degree)
    };
    
    electric_car_dir_command_timeout_timer = window.setInterval( function(){
        electric_car_dir_command_timeout_timer = null
    }, Electric_Car_Dir_Command_Min_Interval_Ms);

    Websocket_Send_POST_Command("Traffic", cmd);
}

function Electric_Car_Turn_Straight(device_ID)
{
    if(electric_car_dir_command_timeout_timer!=null){return;}

    var cmd = {
        command_type: "Electric Car",
        command: "Electric Car Turn Straight",
        device_ID: device_ID
    };
    
    electric_car_dir_command_timeout_timer = window.setInterval( function(){
        electric_car_dir_command_timeout_timer = null
    }, Electric_Car_Dir_Command_Min_Interval_Ms);

    Websocket_Send_POST_Command("Traffic", cmd);
}

function Electric_Car_Set_Traffic_Light_State(device_ID, traffic_light_state)
{
    var cmd = {};
    switch(traffic_light_state)
    {
        case "Green":
            cmd = {
                command_type: "Electric Car",
                command: "Electric Car Set Traffic Light State",
                device_ID: device_ID,
                traffic_light_state: "Green"
            };
            Websocket_Send_POST_Command("Traffic", cmd);
            break;
        case "Yellow":
            cmd = {
                command_type: "Electric Car",
                command: "Electric Car Set Traffic Light State",
                device_ID: device_ID,
                traffic_light_state: "Yellow"
            };
            Websocket_Send_POST_Command("Traffic", cmd);
            break;
        case "Red":
            cmd = {
                command_type: "Electric Car",
                command: "Electric Car Set Traffic Light State",
                device_ID: device_ID,
                traffic_light_state: "Red"
            };
            Websocket_Send_POST_Command("Traffic", cmd);
            break;
        default:
            return;
    }
}

function Electric_Car_Set_Max_Speed_Limit(device_ID, max_speed_percentage)
{
    var cmd = {
        command_type: "Electric Car",
        command: "Electric Car Set Max Speed Limit Percentage",
        device_ID: device_ID,
        max_speed_percentage: Number(max_speed_percentage)
    };
    Websocket_Send_POST_Command("Traffic", cmd);
}

function GET_Electric_Car_Current_Speed_Percentage(device_ID, callback)
{
    var cmd = {
        command_type: "Electric Car",
        command: "Get Electric Car Current Speed Percentage",
        device_ID: device_ID
    };
    Websocket_Send_GET_Command("Traffic", cmd, callback);
}

function GET_Electric_Car_Current_Traffic_Light_State(device_ID, callback)
{
    var cmd = {
        command_type: "Electric Car",
        command: "Get Electric Car Current Traffic Light State",
        device_ID: device_ID
    };
    Websocket_Send_GET_Command("Traffic", cmd, callback);
}

function GET_Electric_Car_Max_Speed_Limit_Percentage(device_ID, callback)
{
    var cmd = {
        command_type: "Electric Car",
        command: "Get Electric Car Max Speed Limit Percentage",
        device_ID: device_ID
    };
    Websocket_Send_GET_Command("Traffic", cmd, callback);
}

function GET_Electric_Car_All_Status(device_ID, callback)
{
    var cmd = {
        command_type: "Electric Car",
        command: "Get Electric Car All Status",
        device_ID: device_ID
    };
    Websocket_Send_GET_Command("Traffic", cmd, callback);
}

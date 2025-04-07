
var debug = require('debug')(require('path').basename(__filename));

var Zigbee_APP = require('../../../Zigbee/Zigbee_APP.js');
var zigbee_app = new Zigbee_APP();

var Device_MGR = require('../../../Util/Device_MGR.js');
var device_mgr = new Device_MGR();

const Zigbee_Humidity_Sensor_Max_Num = 1;

var Humidity_Sensor_API_Zigbee = function () {
    var self = this;
    
    self.Humidity_Sensor_Get_Num_Of_Sensor = function (address_ID) {
        try {
            return {num_of_humidity_sensor: Zigbee_Humidity_Sensor_Max_Num};
        }
        catch (e) {
            debug("[Humidity_Sensor_API_Zigbee] Humidity_Sensor_Get_Num_Of_Sensor() Error " + e);
        }
    };
    self.Humidity_Sensor_Get_Individual_Sensor_Status = async function (address_ID, sensor_index) {
        try {
            if(sensor_index>=Zigbee_Humidity_Sensor_Max_Num)
            {
                return null;
            }

            var modelID = await device_mgr.Get_Device_Model("Humidity Sensor", address_ID);
            if(modelID==null)
            {
                return null;
            }
            
            var sensor_status_list = zigbee_app.Zigbee_APP_Get_Measure_State(address_ID);

            switch(modelID)
            {
                case "lumi.sens":
                case "lumi.sensor_ht":
                    if(sensor_status_list!=null)
                    {
                        var measure_temperature_item = sensor_status_list.find(item =>{
                            return item.name == "measure_temperature";
                        })
                        var measure_humidity_item = sensor_status_list.find(item =>{
                            return item.name == "measure_humidity";
                        })
                        return {
                            sensor_index: sensor_index,
                            measure_temperature: measure_temperature_item.value,
                            measure_humidity: measure_humidity_item.value,
                        };
                    }
                    else{
                        return {
                            sensor_index: sensor_index,
                            measure_temperature: 0,
                            measure_humidity: 0,
                        }
                    }
                case "lumi.weather":
                    if(sensor_status_list!=null)
                    {
                        var measure_temperature_item = sensor_status_list.find(item =>{
                            return item.name == "measure_temperature";
                        })
                        var measure_humidity_item = sensor_status_list.find(item =>{
                            return item.name == "measure_humidity";
                        })
                        var measure_pressure_item = sensor_status_list.find(item =>{
                            return item.name == "measure_pressure";
                        })
                        return {
                            sensor_index: sensor_index,
                            measure_temperature: measure_temperature_item.value,
                            measure_humidity: measure_humidity_item.value,
                            measure_pressure: measure_pressure_item.value
                        };
                    }
                    else{
                        return {
                            sensor_index: sensor_index,
                            measure_temperature: 0,
                            measure_humidity: 0,
                            measure_pressure: 0
                        }
                    }
                default:
                    return null;
            }
        }
        catch (e) {
            debug("[Humidity_Sensor_API_Zigbee] Humidity_Sensor_Get_Individual_Sensor_Status() Error " + e);
        }
    };
    self.Humidity_Sensor_Get_All_Sensor_Status = async function (address_ID) {
        try {
            var modelID = await device_mgr.Get_Device_Model("Humidity Sensor", address_ID);
            if(modelID==null)
            {
                return null;
            }
            
            var sensor_status_list = zigbee_app.Zigbee_APP_Get_Measure_State(address_ID);

            switch(modelID)
            {
                case "lumi.sens":
                case "lumi.sensor_ht":
                    if(sensor_status_list!=null)
                    {
                        var measure_temperature_item = sensor_status_list.find(item =>{
                            return item.name == "measure_temperature";
                        })
                        var measure_humidity_item = sensor_status_list.find(item =>{
                            return item.name == "measure_humidity";
                        })
                        return {
                            num_of_humidity_sensor: Zigbee_Humidity_Sensor_Max_Num,
                            individual_sensor_status: [{
                                sensor_index: 0,
                                measure_temperature: measure_temperature_item.value,
                                measure_humidity: measure_humidity_item.value
                            }]
                        }
                    }
                    else{
                        return {
                            num_of_humidity_sensor: Zigbee_Humidity_Sensor_Max_Num,
                            individual_sensor_status: [{
                                sensor_index: 0,
                                measure_temperature: 0,
                                measure_humidity: 0
                            }]
                        }
                    }
                case "lumi.weather":
                    if(sensor_status_list!=null)
                    {
                        var measure_temperature_item = sensor_status_list.find(item =>{
                            return item.name == "measure_temperature";
                        })
                        var measure_humidity_item = sensor_status_list.find(item =>{
                            return item.name == "measure_humidity";
                        })
                        var measure_pressure_item = sensor_status_list.find(item =>{
                            return item.name == "measure_pressure";
                        })
                        return {
                            num_of_humidity_sensor: Zigbee_Humidity_Sensor_Max_Num,
                            individual_sensor_status: [{
                                sensor_index: 0,
                                measure_temperature: measure_temperature_item.value,
                                measure_humidity: measure_humidity_item.value,
                                measure_pressure: measure_pressure_item.value
                            }]
                        }
                    }
                    else{
                        return {
                            num_of_humidity_sensor: Zigbee_Humidity_Sensor_Max_Num,
                            individual_sensor_status: [{
                                sensor_index: 0,
                                measure_temperature: 0,
                                measure_humidity: 0,
                                measure_pressure: 0
                            }]
                        }
                    }
                default:
                    return null;
            }
        }
        catch (e) {
            debug("[Humidity_Sensor_API_Zigbee] Humidity_Sensor_Get_All_Sensor_Status() Error " + e);
        }
    };

    self.Humidity_Sensor_Get_Support_Attributes = async function (device_type, device_ID) {
        try {
            var num_of_support_attributes = 0;
            var support_attrs_name = [];
            var support_attrs_type = [];

            var modelID = await device_mgr.Get_Device_Model(device_type, device_ID);
            if(modelID==null)
            {
                return null;
            }
            
            switch(modelID)
            {
                case "lumi.sens":
                case "lumi.sensor_ht":
                    num_of_support_attributes = 2;
                    support_attrs_name = ["measure_temperature", "measure_humidity"];
                    support_attrs_type = ["measure", "measure"];
                    break;
                case "lumi.weather":
                    num_of_support_attributes = 3;
                    support_attrs_name = ["measure_temperature", "measure_humidity", "measure_pressure"];
                    support_attrs_type = ["measure", "measure", "measure"];
                    break;
                default:
                    break;
            }

            var support_attributes_list = [];
            for(var i = 0; i<num_of_support_attributes; i++)
            {
                support_attributes_list.push({
                    name: support_attrs_name[i],
                    type: support_attrs_type[i]
                });
            }

            return {
                num_of_support_attributes: num_of_support_attributes,
                support_attributes_list: support_attributes_list
            };
        }
        catch (e) {
            debug("[Humidity_Sensor_API_Zigbee] Humidity_Sensor_Get_Support_Attributes() Error " + e);
        }
    };
};

module.exports = Humidity_Sensor_API_Zigbee;
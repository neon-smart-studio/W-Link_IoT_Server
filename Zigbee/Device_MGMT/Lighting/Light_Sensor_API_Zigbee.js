
var debug = require('debug')(require('path').basename(__filename));

var Zigbee_APP = require('../../../Zigbee/Zigbee_APP.js');
var zigbee_app = new Zigbee_APP();

var Device_MGR = require('../../../Util/Device_MGR.js');
var device_mgr = new Device_MGR();

const Zigbee_Light_Sensor_Max_Num = 1;

var Light_Sensor_API_Zigbee = function () {
    var self = this;
    
    self.Light_Sensor_Get_Num_Of_Sensor = function (address_ID) {
        try {
            return {num_of_light_sensor: Zigbee_Light_Sensor_Max_Num};
        }
        catch (e) {
            debug("[Light_Sensor_API_Zigbee] Light_Sensor_Get_Num_Of_Sensor() Error " + e);
        }
    };
    self.Light_Sensor_Get_Individual_Sensor_Status = async function (address_ID, sensor_index) {
        try {
            if(sensor_index>=Zigbee_Light_Sensor_Max_Num)
            {
                return null;
            }

            var sensor_status_list = zigbee_app.Zigbee_APP_Get_Measure_State(address_ID);

            if(sensor_status_list!=null)
            {
                var measure_lux_item = sensor_status_list.find(item =>{
                    return item.name == "measure_lux";
                })
                return {
                    sensor_index: 0,
                    measure_lux: measure_lux_item.value
                }
            }
            else{
                return {
                    sensor_index: sensor_index,
                    measure_lux: 0,
                }
            }
        }
        catch (e) {
            debug("[Light_Sensor_API_Zigbee] Light_Sensor_Get_Individual_Sensor_Status() Error " + e);
        }
    };
    self.Light_Sensor_Get_All_Sensor_Status = async function (address_ID) {
        try {
            var sensor_status_list = zigbee_app.Zigbee_APP_Get_Measure_State(address_ID);

            if(sensor_status_list!=null)
            {
                var measure_lux_item = sensor_status_list.find(item =>{
                    return item.name == "measure_lux";
                })
                return {
                    num_of_light_sensor: Zigbee_Light_Sensor_Max_Num,
                    individual_sensor_status: [{
                        sensor_index: 0,
                        measure_lux: measure_lux_item.value
                    }]
                }
            }
            else{
                return {
                    num_of_light_sensor: Zigbee_Light_Sensor_Max_Num,
                    individual_sensor_status: [{
                        sensor_index: 0,
                        measure_lux: 0
                    }]
                }
            }
        }
        catch (e) {
            debug("[Light_Sensor_API_Zigbee] Light_Sensor_Get_All_Sensor_Status() Error " + e);
        }
    };

    self.Light_Sensor_Get_Support_Attributes = async function (device_type, device_ID) {
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
                case "lumi.sen_ill.mgl01":
                    num_of_support_attributes = 1;
                    support_attrs_name = ["measure_lux"];
                    support_attrs_type = ["measure"];
                    break;
                default:
                    return null;
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
            debug("[Light_Sensor_API_Zigbee] Light_Sensor_Get_Support_Attributes() Error " + e);
        }
    };
};

module.exports = Light_Sensor_API_Zigbee;
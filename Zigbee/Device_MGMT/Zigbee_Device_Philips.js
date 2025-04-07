
var debug = require('debug')(require('path').basename(__filename));

var Zigbee_Device_Philips = function (){
    var self = this;
    self.Do_Resolve_Philips_Zigbee_Device_Type = function(resolv_dev_info)
    {
        try{
            var model = null;
        
            if(resolv_dev_info.mapped==null)
            {
                return null;
            }
            
            else if(resolv_dev_info.mapped.model!=null)
            {
                model = resolv_dev_info.mapped.model;
            }
        
            if(model==null)
            {
                return null;
            }
            
            var device_Type = null;
        
            switch(model)
            {
                case "324131092621": //['RWL020', 'RWL021']
                    device_Type = "Scene Switch";
                    break;
                case "8718699693985": //['ROM001']
                    device_Type = "Toggle Switch";
                    break;
                case "9290012607": //SML001
                case "9290019758": //SML002
                    device_Type = "Motion Sensor";
                    break;
                case "929002240401": //"LOM001"
                case "046677552343": //"LOM002"
                case "9290022408": //"LOM005"
                    device_Type = "OnOff Socket";
            }
            return device_Type;
        }
        catch(e)
        {
            debug("[Zigbee_Device_Philips] Do_Resolve_Philips_Zigbee_Device_Type() Error " + e);
        }
    }
};
module.exports = Zigbee_Device_Philips;

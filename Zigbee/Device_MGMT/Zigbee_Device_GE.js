
var debug = require('debug')(require('path').basename(__filename));

var Zigbee_Device_GE = function (){
    var self = this;
    self.Do_Resolve_GE_Zigbee_Device_Type = function(resolv_dev_info)
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
                case "PTAPT-WH02":
                    device_Type = "OnOff Light";
                    break;
                case "POTLK-WH02":
                    device_Type = "OnOff Socket";
                    break;
            }

            return device_Type;
        }
        catch(e)
        {
            debug("[Zigbee_Device_GE] Do_Resolve_GE_Zigbee_Device_Type() Error " + e);
        }
    }
};
module.exports = Zigbee_Device_GE;

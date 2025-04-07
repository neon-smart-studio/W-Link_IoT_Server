
var debug = require('debug')(require('path').basename(__filename));

var Zigbee_Device_IKEA = function (){
    var self = this;
    self.Do_Resolve_IKEA_Zigbee_Device_Type = function(resolv_dev_info)
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
                case "LED1623G12":
                case "LED1650R5":
                case "LED1837R5":
                case "LED1842G3":
                case "LED1622G12":
                case "LED1649C5":
                case "LED1836G9":
                case "ICPSHC24-10EU-IL-1":
                case "ICPSHC24-30EU-IL-1":
                    device_Type = "Dimmable Light";
                    break;
                case "LED1545G12":
                case "LED1546G12":
                case "LED1537R6":
                case "LED1536G5":
                case "LED1733G7":
                case "LED1732G11":
                case "LED1736G9":
                case "T1820":
                case "L1527":
                case "L1529":
                case "L1528":
                case "L1531":
                case "T1828":
                case "T1829":
                case "LED1738G7":
                    device_Type = "Color Temperature Light";
                    break;
                case "LED1624G9":
                    device_Type = "Colored Light";
                    break;
                case "E1603/E1702":
                    device_Type = "OnOff Socket";
                    break;
                case "ICTC-G-1":
                case "E1743":
                    device_Type = "Dimmable Switch";
                    break;
                case "E1524/E1810":
                case "E1744":
                    device_Type = "Scene Switch";
                    break;
                case "E1525/E1745":
                    device_Type = "Motion Sensor";
                    break;
                case "E1746":
                    //device_Type = "Signal Repeater";
                    break;
                case "E1757":
                case "E1926":
                    device_Type = "Blind Curtain";
                    break;
                case "E1766":
                    device_Type = "OnOff Switch";
                    break;
            }

            return device_Type;
        }
        catch(e)
        {
            debug("[Zigbee_Device_IKEA] Do_Resolve_IKEA_Zigbee_Device_Type() Error " + e);
        }
    }
};
module.exports = Zigbee_Device_IKEA;

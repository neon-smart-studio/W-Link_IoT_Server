
var debug = require('debug')(require('path').basename(__filename));

var Zigbee_Device_Xiaomi = function (){
    var self = this;
    self.Do_Resolve_Xiaomi_Zigbee_Device_Type = function(resolv_dev_info)
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
                case "ZNLDP12LM":
                    device_Type = "Color Temperature Light";
                    break;
                case "WXKG01LM":
                case "WXKG11LM":
                case "WXKG12LM":
                case "WXKG03LM":
                case "WXKG06LM":
                case "WXKG02LM":
                case "WS-USC01":
                case "WS-USC02":
                case "WS-USC04":
                case "QBKG04LM":
                case "QBKG11LM":
                case "QBKG03LM":
                case "QBKG12LM":
                case "WXKG07LM":
                case "QBKG21LM":
                case "QBKG22LM":
                case "QBKG25LM":
                case "QBKG24LM":
                    device_Type = "Toggle Switch";
                    break;
                case "MFKZQ01LM":
                case "WXCJKG11LM":
                case "WXCJKG12LM":
                case "WXCJKG13LM":
                    device_Type = "Scene Switch";
                    break;
                case "WSDCGQ01LM":
                case "WSDCGQ11LM":
                case "WSDCGQ12LM":
                    device_Type = "Humidity Sensor";
                    break;
                case "RTCGQ01LM":
                case "RTCGQ11LM":
                case "DJT11LM":
                    device_Type = "Motion Sensor";
                    break;
                case "MCCGQ01LM":
                case "MCCGQ11LM":
                    device_Type = "Door/Window Sensor";
                    break;
                case "SJCGQ11LM":
                case "SJCGQ12LM":
                    //device_Type = "Water Leak Detector";
                    break;
                case "ZNCZ02LM":
                case "ZNCZ03LM":
                case "ZNCZ04LM":
                case "ZNCZ12LM":
                case "SP-EUC01":
                case "QBCZ11LM":
                case "LLKZMK11LM":
                    device_Type = "OnOff Socket";
                    break;
                case "JTYJ-GD-01LM/BW":
                    //device_Type = "Smoke Detector";
                    break;
                case "JTQJ-BF-01LM/BW":
                    //device_Type = "Gas Leak Detector";
                    break;
                case "A6121":
                case "ZNMS12LM":
                case "ZNMS13LM":
                    //device_Type = "Lock";
                    break;
                case "ZNCLDJ11LM":
                case "ZNCLDJ12LM":
                    device_Type = "Blind Curtain";
                    break;
                case "GZCGQ01LM":
                    device_Type = "Light Sensor";
                    break;
            }

            return device_Type;
        }
        catch(e)
        {
            debug("[Zigbee_Device_Xiaomi] Do_Resolve_Xiaomi_Zigbee_Device_Type() Error " + e);
        }
    }
};
module.exports = Zigbee_Device_Xiaomi;

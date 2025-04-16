
var debug = require('debug')(require('path').basename(__filename));

var Zigbee_Device_Xiaomi_Aqara = function (){
    var self = this;
    self.Do_Resolve_Xiaomi_Aqara_Zigbee_Device_Type = function(resolv_dev_info)
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
                case "ZNLDP13LM":
                case "ZNXDD01LM":
                case "XDD11LM":
                case "XDD12LM":
                case "XDD13LM":
                case "JWSP001A":
                case "JWDL001A":
                case "LGYCDD01LM":
                    device_Type = "Color Temperature Light";
                    break;

                case "WXKG01LM":
                case "WXKG02LM":
                case "WXKG02LM_rev1":
                case "WXKG02LM_rev2":
                case "WXKG03LM":
                case "WXKG03LM_rev1":
                case "WXKG03LM_rev2":
                case "WXKG06LM":
                case "WXKG07LM":
                case "WXKG11LM":
                case "WXKG12LM":
                case "WS-USC01":
                case "WS-USC02":
                case "WS-USC03":
                case "WS-USC04":
                case "QBKG04LM":
                case "QBKG11LM":
                case "QBKG03LM":
                case "QBKG12LM":
                case "QBKG21LM":
                case "QBKG22LM":
                case "QBKG25LM":
                case "QBKG24LM":
                case "QBKG27LM":
                case "QBKG28LM":
                case "QBKG29LM":
                case "QBKG30LM":
                case "QBKG31LM":
                case "QBKG32LM":
                case "QBKG23LM":
                case "QBKG26LM":
                case "QBKG17LM":
                case "QBKG18LM":
                case "QBKG19LM":
                case "QBKG20LM":
                case "QBKG33LM":
                case "QBKG34LM":
                case "ZNQBKG24LM":
                case "ZNQBKG25LM":
                case "ZNQBKG26LM":
                case "ZNQBKG31LM":
                case "ZNQBKG38LM":
                case "ZNQBKG39LM":
                case "ZNQBKG40LM":
                case "ZNQBKG41LM":
                case "ZNQBKG42LM":
                case "ZNQBKG43LM":
                case "ZNQBKG44LM":
                case "ZNQBKG45LM":
                case "WS-K01D":
                case "WS-K07E":
                case "WS-K08E":
                case "WS-EUK01":
                case "WS-EUK02":
                case "WS-EUK03":
                case "WS-EUK04":
                    device_Type = "Toggle Switch";
                    break;

                case "MFKZQ01LM":
                case "WXCJKG11LM":
                case "WXCJKG12LM":
                case "WXCJKG13LM":
                case "WXKG04LM":
                case "WXKG05LM":
                case "WXKG13LM":
                case "WXKG14LM":
                case "WXKG15LM":
                case "WXKG16LM":
                case "WXKG17LM":
                case "WXKG20LM":
                case "WXKG22LM":
                case "CTP-R01":
                    device_Type = "Scene Switch";
                    break;

                case "WSDCGQ01LM":
                case "WSDCGQ11LM":
                case "WSDCGQ12LM":
                    device_Type = "Humidity Sensor";
                    break;

                case "RTCGQ01LM":
                case "RTCGQ11LM":
                case "RTCGQ12LM":
                case "RTCGQ13LM":
                case "RTCGQ14LM":
                case "RTCGQ15LM":
                    device_Type = "Motion Sensor";
                    break;

                case "RTCZCGQ11LM":
                case "FP1E":
                    device_Type = "Presence Sensor";
                    break;

                case "MCCGQ01LM":
                case "MCCGQ11LM":
                case "MCCGQ13LM":
                case "MCCGQ14LM":
                case "MCCGQ12LM":
                    device_Type = "Door/Window Sensor";
                    break;

                case "SJCGQ11LM":
                case "SJCGQ12LM":
                case "SJCGQ13LM":
                    device_Type = "Water Leak Sensor";
                    break;

                case "DJT11LM":
                case "DJT12LM":
                    device_Type = "Vibration Sensor";
                    break;

                case "ZNCZ02LM":
                case "ZNCZ03LM":
                case "ZNCZ04LM":
                case "ZNCZ12LM":
                case "SP-EUC01":
                case "ZNCZ11LM":
                case "QBCZ11LM":
                case "QBCZ14LM":
                case "QBCZ15LM":
                case "WP-P01D":
                case "LLKZMK11LM": //"Relay Module"
                case "LLKZMK12LM": //"Relay Module"
                    device_Type = "OnOff Socket";
                    break;

                case "ZNCLDJ11LM":
                case "ZNCLDJ12LM":
                case "ZNCLDJ14LM":
                case "ZNCLDJ01LM":
                case "ZNJLBL01LM":
                case "ZNCLBL01LM":
                    device_Type = "Curtain Controller";
                    break;

                case "JTYJ-GD-01LM/BW":
                case "JY-GZ-01AQ":
                    device_Type = "Smoke Detector";
                    break;

                case "JTQJ-BF-01LM/BW":
                case "JT-BZ-01AQ/A":
                    device_Type = "Gas Detector";
                    break;

                case "A6121":
                case "ZNMS11LM":
                case "ZNMS12LM":
                case "ZNMS13LM":
                    device_Type = "Lock";
                    break;

                case "GZCGQ01LM":
                case "GZCGQ11LM":
                    device_Type = "Light Sensor";
                    break;
            }

            return device_Type;
        }
        catch(e)
        {
            debug("[Zigbee_Device_Xiaomi_Aqara] Do_Resolve_Xiaomi_Aqara_Zigbee_Device_Type() Error " + e);
        }
    }
};
module.exports = Zigbee_Device_Xiaomi_Aqara;


var debug = require('debug')(require('path').basename(__filename));

var Zigbee = require('../../../Zigbee/Zigbee.js');
var zigbee = new Zigbee();

var Blind_Curtain_API_Zigbee = function () {
    var self = this;
    
    self.Blind_Curtain_Open_Close = async function (address_ID, open_close) {
        try {
            var resolv_dev_info = zigbee.Zigbee_ResolveDeviceEntity(address_ID);
            if(resolv_dev_info==null)
            {
                return;
            }

            switch(resolv_dev_info.device.modelID)
            {
                //IKEA
                case "FYRTUR block-out roller blind":
                case "KADRILJ roller blind":
                    if(open_close==true)
                    {
                        await zigbee.Zigbee_SendCommand(address_ID, "closuresWindowCovering", "upOpen", null);
                    }
                    else
                    {
                        await zigbee.Zigbee_SendCommand(address_ID, "closuresWindowCovering", "downClose", null);
                    }
                    break;

                //Xiaomi
                case "lumi.curtain":
                case "lumi.curtain.aq2":
                case "lumi.curtain.hagl04":
                    var opened_percentage = null;
                    if(open_close==true)
                    {
                        opened_percentage = 100;
                    }
                    else
                    {
                        opened_percentage = 0;
                    }
                    var attr_data = {0x0055: {value: opened_percentage, type: 0x39}};
                    zigbee.Zigbee_WriteAttribute(address_ID, "genAnalogOutput", attr_data);
                    break;
            }
        }
        catch (e) {
            debug("[Blind_Curtain_API_Zigbee] Blind_Curtain_Open() Error " + e);
        }
    }
    self.Blind_Curtain_Toggle_State = async function (address_ID) {
        try{
            var resolv_dev_info = zigbee.Zigbee_ResolveDeviceEntity(address_ID);
            if(resolv_dev_info==null)
            {
                return null;
            }

            var result = null;

            switch(resolv_dev_info.device.modelID)
            {
                //IKEA
                case "FYRTUR block-out roller blind":
                case "KADRILJ roller blind":
                    var current_position_attr = await zigbee.Zigbee_ReadAttribute(address_ID, "closuresWindowCovering", ["currentPositionLiftPercentage"]);
                    var lift_percentage = Math.round(current_position_attr.currentPositionLiftPercentage/255*100);
                    if(lift_percentage>0)
                    {
                        await zigbee.Zigbee_SendCommand(address_ID, "closuresWindowCovering", "upOpen", null);
                    }
                    else{
                        await zigbee.Zigbee_SendCommand(address_ID, "closuresWindowCovering", "downClose", null);
                    }
                    break;

                //Xiaomi
                case "lumi.curtain":
                case "lumi.curtain.aq2":
                case "lumi.curtain.hagl04":
                    var current_position_attr = await zigbee.Zigbee_ReadAttribute(address_ID, "closuresWindowCovering", ["currentPositionLiftPercentage"]);
                    var lift_percentage = Math.round(current_position_attr.currentPositionLiftPercentage/255*100);
                    var opened_percentage = 0;
                    if(lift_percentage>0)
                    {
                        opened_percentage = 255;
                    }
                    var attr_data = {0x0055: {value: opened_percentage, type: 0x39}};
                    zigbee.Zigbee_WriteAttribute(address_ID, "genAnalogOutput", attr_data);
                    break;
            }

            return result
        }
        catch (e) {
            debug("[Blind_Curtain_API_Zigbee] Blind_Curtain_Toggle_State() Error " + e);
        }
    }
    self.Blind_Curtain_Lift_To_Position = async function (address_ID, lift_percentage) {
        try {
            if(lift_percentage<0 || lift_percentage>100)
            {
                return;
            }

            var resolv_dev_info = zigbee.Zigbee_ResolveDeviceEntity(address_ID);
            if(resolv_dev_info==null)
            {
                return;
            }

            var lift_percentage_255 = Math.round(lift_percentage/100*255);

            switch(resolv_dev_info.device.modelID)
            {
                //IKEA
                case "FYRTUR block-out roller blind":
                case "KADRILJ roller blind":
                    await zigbee.Zigbee_SendCommand(address_ID, "closuresWindowCovering", "goToLiftPercentage", {percentageliftvalue: lift_percentage});
                    break;
                    
                //Xiaomi
                case "lumi.curtain":
                case "lumi.curtain.aq2":
                case "lumi.curtain.hagl04":
                    await zigbee.Zigbee_SendCommand(address_ID, "closuresWindowCovering", "goToLiftPercentage", {percentageliftvalue: lift_percentage});
                    //var attr_data = {0x0055: {value: lift_percentage, type: 0x39}};
                    //zigbee.Zigbee_WriteAttribute(address_ID, "genAnalogOutput", attr_data);
                    break;
            }
        }
        catch (e) {
            debug("[Blind_Curtain_API_Zigbee] Blind_Curtain_Open() Error " + e);
        }
    }
    self.Blind_Curtain_Tilt_To_Position = async function (address_ID, tilt_percentage) {
        try {
            await this.Blind_Curtain_Lift_To_Position(address_ID, tilt_percentage);
        }
        catch (e) {
            debug("[Blind_Curtain_API_Zigbee] Blind_Curtain_Open() Error " + e);
        }
    }
    self.Blind_Curtain_Stop_Moveing = async function (address_ID) {
        try {
            await zigbee.Zigbee_SendCommand(address_ID, "closuresWindowCovering", "stop", null);
        }
        catch (e) {
            debug("[Blind_Curtain_API_Zigbee] Blind_Curtain_Open() Error " + e);
        }
    }
    self.Blind_Curtain_Get_Current_Position = async function (address_ID) {
        try {
            var resolv_dev_info = zigbee.Zigbee_ResolveDeviceEntity(address_ID);
            if(resolv_dev_info==null)
            {
                return null;
            }

            var result = null;

            switch(resolv_dev_info.device.modelID)
            {
                //IKEA
                case "FYRTUR block-out roller blind":
                case "KADRILJ roller blind":
                    var current_position_attr = await zigbee.Zigbee_ReadAttribute(address_ID, "closuresWindowCovering", ["currentPositionLiftPercentage"]);
                    var lift_percentage = Math.round(current_position_attr.currentPositionLiftPercentage);
                    result = {
                        lift_percentage: lift_percentage,
                        tilt_percentage: 100-lift_percentage
                    }
                    break;

                //Xiaomi
                case "lumi.curtain":
                case "lumi.curtain.aq2":
                case "lumi.curtain.hagl04":
                    var current_position_attr = await zigbee.Zigbee_ReadAttribute(address_ID, "closuresWindowCovering", ["currentPositionLiftPercentage"]);
                    var lift_percentage = Math.round(current_position_attr.currentPositionLiftPercentage/255*100);
                    result = {
                        lift_percentage: lift_percentage,
                        tilt_percentage: 100-lift_percentage
                    }
                    break;
            }

            return result
        }
        catch (e) {
            debug("[Blind_Curtain_API_Zigbee] Blind_Curtain_Get_Current_Position() Error " + e);
        }
    };
};

module.exports = Blind_Curtain_API_Zigbee;
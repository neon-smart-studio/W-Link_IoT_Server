
var ASCII_HEX_API = function(){
    var self = this;
    self.To_Ascii = function(dat)
    {
        switch(dat){
            case 0:
                return '0';
                break;
            case 1:
                return '1';
                break;
            case 2:
                return '2';
                break;
            case 3:
                return '3';
                break;
            case 4:
                return '4';
                break;
            case 5:
                return '5';
                break;
            case 6:
                return '6';
                break;
            case 7:
                return '7';
                break;
            case 8:
                return '8';
                break;
            case 9:
                return '9';
                break;
            case 10:
                return 'A';
                break;
            case 11:
                return 'B';
                break;
            case 12:
                return 'C';
                break;
            case 13:
                return 'D';
                break;
            case 14:
                return 'E';
                break;
            case 15:
                return 'F';
                break;
        }
        return '0';
    }
    self.To_HEX = function(dat)
    {
        switch(dat){
            case "0":
                return 0;
                break;
            case "1":
                return 1;
                break;
            case "2":
                return 2;
                break;
            case "3":
                return 3;
                break;
            case "4":
                return 4;
                break;
            case "5":
                return 5;
                break;
            case "6":
                return 6;
                break;
            case "7":
                return 7;
                break;
            case "8":
                return 8;
                break;
            case "9":
                return 9;
                break;
            case "A":
            case "a":
                return 10;
                break;
            case "B":
            case "b":
                return 11;
                break;
            case "C":
            case "c":
                return 12;
                break;
            case "D":
            case "d":
                return 13;
                break;
            case "E":
            case "e":
                return 14;
                break;
            case "F":
            case "f":
                return 15;
                break;
        }
        return 0;
    }

    self.Value_To_String = function(value, bits)
    {
        var string = "0";

        switch(bits){
            case "8":
                string = "000";
                if(value<10){
                    string = "00" +  value;
                }
                else if(value>=10 && value<100){
                    string = "0" +  value;
                }
                else{
                    if(value>255){
                        string = "255";
                    }
                    else{
                        string = value;
                    }
                }

                break;
            case "16":
                string = "00000";
                if(value<=0){
                    string = "00000";
                }
                else if(value>0 && value<10){
                    string = "0000" +  value;
                }
                else if(value>=10 && value<100){
                    string = "000" +  value;
                }
                else if(value>=100 && value<1000){
                    string = "00" +  value;
                }
                else if(value>=1000 && value<10000){
                    string = "0" +  value;
                }
                else{
                    if(value>65535){
                        string = "65535";
                    }
                    else{
                        string = value;
                    }
                }
                break;
        }

        return string;
    }
    self.Hex_Value_To_String = function(value, bits)
    {
        var string = "0";

        switch(bits){
            case "8":
                string = To_Ascii(Math.floor(value/16));
                string += To_Ascii(value%16);
                break;
            case "16":
                string = To_Ascii(Math.floor(value/(16*16*16)));
                string += To_Ascii(Math.floor(value/(16*16)));
                string += To_Ascii(Math.floor(value/16));
                string += To_Ascii(value%16);
                break;
        }

        return string;
    }
}
module.exports = ASCII_HEX_API;
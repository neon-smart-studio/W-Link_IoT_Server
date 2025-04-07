
var getXY=function(el){
    if (document.documentElement.getBoundingClientRect) { // IE,FF3.0+,Opera9.5+
        var box = el.getBoundingClientRect();
        return {x:box.left+document.body.scrollLeft,
            y:box.top+document.body.scrollTop };
    } else {
        var pos = [el.offsetLeft, el.offsetTop];
        var op = el.offsetParent;
        if (op != el) {
            while (op) {
                pos[0] += op.offsetLeft + parseInt(op.style.borderLeftWidth) || 0;
                pos[1] += op.offsetTop + parseInt(op.style.borderTopWidth) || 0;
                op = op.offsetParent;
            }
        }
        return {x:pos[0],y:pos[1]};
    }
};
var setData=function(imageData,x,y,value){
imageData.data[((y*(imageData.width*4)) + (x*4)) + 0]=value[0];
imageData.data[((y*(imageData.width*4)) + (x*4)) + 1]=value[1];
imageData.data[((y*(imageData.width*4)) + (x*4)) + 2]=value[2];
imageData.data[((y*(imageData.width*4)) + (x*4)) + 3]=value[3];
};

function toRGB(TColor, q, p, H) {
    var pixel;
    if (TColor < 0) {
        TColor+=1;
    }
    if (TColor > 1) {
        TColor-=1;
    }
    if (TColor < (1/6)) {
        return p + q - p * 6 * TColor;
    } else if (TColor < (1/2)) {
        return q;
    } else if (TColor < (2/3)) {
        return p + q - p * 6 * 2 / 3 - TColor;
    } else {
        return p;
    }
}
function HSVToRGB(h,s,v){
    var i;
    var f, p, q, t;
    var r,g,b;
    if( s == 0 ) {
        v = Math.floor(v*255);
        return {
        r:v,
        g:v,
        b:v
        };
    }
    h /= 60;
    i = Math.floor( h );
    f = h - i;
    p = v * ( 1 - s );
    q = v * ( 1 - s * f );
    t = v * ( 1 - s * ( 1 - f ) );
    switch( i ) {
        case 0:r = v;g = t;b = p;break;
        case 1:r = q;g = v;b = p; break;
        case 2: r = p;g = v;b = t;break;
        case 3:r = p;g = q;b = v;break;
        case 4:r = t;g = p;b = v;break;
        default:r = v;g = p;b = q;break;
    }
    return {
        r:r*255,
        g:g*255,
        b:b*255
    };
}

function RGBToHSV (r, g, b) {
    let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc, percentRoundFn;
    rabs = r / 255;
    gabs = g / 255;
    babs = b / 255;
    v = Math.max(rabs, gabs, babs),
    diff = v - Math.min(rabs, gabs, babs);
    diffc = c => (v - c) / 6 / diff + 1 / 2;
    percentRoundFn = num => Math.round(num * 100) / 100;
    if (diff == 0) {
        h = s = 0;
    } else {
        s = diff / v;
        rr = diffc(rabs);
        gg = diffc(gabs);
        bb = diffc(babs);

        if (rabs === v) {
            h = bb - gg;
        } else if (gabs === v) {
            h = (1 / 3) + rr - bb;
        } else if (babs === v) {
            h = (2 / 3) + gg - rr;
        }
        if (h < 0) {
            h += 1;
        }else if (h > 1) {
            h -= 1;
        }
    }
    return {
        h: Math.round(h * 360),
        s: percentRoundFn(s * 100),
        v: percentRoundFn(v * 100)
    };
}

function Ln(value)
{
    var log10 = ( Math.log(value) );
    var logE = ( Math.log(Math.E) );
    return ( log10/logE );
}

function clamp( x, min, max ) {

    if(x<min){ return min; }
    if(x>max){ return max; }

    return x;

}
function ColorTemperatureToRGB(color_temp)
{
    var temp = color_temp / 100;

    var red, green, blue;

    if( temp <= 66 ){ 

        red = 255; 
        
        green = temp;
        green = 99.4708025861 * Math.log(green) - 161.1195681661;

        
        if( temp <= 19){

            blue = 0;

        } else {

            blue = temp-10;
            blue = 138.5177312231 * Math.log(blue) - 305.0447927307;

        }

    } else {

        red = temp - 60;
        red = 329.698727446 * Math.pow(red, -0.1332047592);
        
        green = temp - 60;
        green = 288.1221695283 * Math.pow(green, -0.0755148492 );

        blue = 255;

    }


    return {
        r : clamp(red,   0, 255),
        g : clamp(green, 0, 255),
        b : clamp(blue,  0, 255)
    };
}

function Print_Color_Map(id_str){
    var width = $('#'+id_str).prop("width");
    var height = $('#'+id_str).prop("height");
    var can=document.getElementById(id_str);
    var ctx=can.getContext('2d');
    var imageData=ctx.createImageData(width,height);
    
    var pixel = [];
    for(var i=0;i<height;i++){
        for(var i2=0;i2<width;i2++){
            //   pixel=hslToRgb(i2,1-i/100,0.5)
            pixel=HSVToRGB(i2/(width/360),i/height,1);
            setData(imageData,i2,i,[pixel.r,pixel.g,pixel.b,255]);

        }
    }
    ctx.putImageData(imageData, 0, 0);
}

function Print_Temp_Map(id_str, start_temp, end_temp)
{
    var width = $('#'+id_str).prop("width");
    var height = $('#'+id_str).prop("height");
    $('#'+id_str).append("<input type=\"text\" style=\"display: none\" id=\""+id_str+"_start_temp\" value=\""+start_temp+"\"/>");
    $('#'+id_str).append("<input type=\"text\" style=\"display: none\" id=\""+id_str+"_end_temp\" value=\""+end_temp+"\"/>");
    var can=document.getElementById(id_str);
    var ctx=can.getContext('2d');
    var imageData=ctx.createImageData(width,height);
    
    var pixel = [];
    var column_cnt = 0;
    if(start_temp<end_temp){
        var step_temp = (end_temp - start_temp)/width;
        for(var i2=start_temp;i2<end_temp;i2+=step_temp){
            pixel=ColorTemperatureToRGB(i2);
            for(var i=0;i<height;i++){
                //   pixel=hslToRgb(i2,1-i/100,0.5)
                setData(imageData,column_cnt,i,[
                pixel.r,
                pixel.g,
                pixel.b,
                255
                ]);
            }
            column_cnt++;
        }
    }
    ctx.putImageData(imageData, 0, 0);
}
/*
function Print_Color_Wheel(id_str)
{
    var canvas=document.getElementById(id_str);
    var size = $('#'+id_str).prop("width");
    var context=canvas.getContext('2d');

    canvas.width = size;
    canvas.height = size;

    const centerColor = 'white';

    // Initiate variables
    let angle = 0;
    const hexCode = [0, 0, 255];
    let pivotPointer = 0;
    const colorOffsetByDegree = 4.322;
    const radius = size / 2;

    // For each degree in circle, perform operation
    while (angle < 360) {
        // find index immediately before and after our pivot
        const pivotPointerbefore = (pivotPointer + 3 - 1) % 3;

        // Modify colors
        if (hexCode[pivotPointer] < 255) {
            // If main points isn't full, add to main pointer
            hexCode[pivotPointer] =
            hexCode[pivotPointer] + colorOffsetByDegree > 255 ?
            255 :
            hexCode[pivotPointer] + colorOffsetByDegree;
        } else if (hexCode[pivotPointerbefore] > 0) {
            // If color before main isn't zero, subtract
            hexCode[pivotPointerbefore] =
            hexCode[pivotPointerbefore] > colorOffsetByDegree ?
            hexCode[pivotPointerbefore] - colorOffsetByDegree :
            0;
        } else if (hexCode[pivotPointer] >= 255) {
            // If main color is full, move pivot
            hexCode[pivotPointer] = 255;
            pivotPointer = (pivotPointer + 1) % 3;
        }

        const rgb = `rgb(${hexCode.map(h => Math.floor(h)).join(',')})`;
        const grad = context.createRadialGradient(
            radius,
            radius,
            0,
            radius,
            radius,
            radius
        );
        grad.addColorStop(0, centerColor);
        grad.addColorStop(1, rgb);
        context.fillStyle = grad;

        // draw circle portion
        context.globalCompositeOperation = 'source-over';
        context.beginPath();
        context.moveTo(radius, radius);
        context.arc(
            radius,
            radius,
            radius,
            angle * (Math.PI / 180),
            360 * (Math.PI / 180),
        );
        context.closePath();
        context.fill();
        angle++;
    }
}
*/
function Print_Temp_Slider(id_str, start_temp, end_temp)
{
    var range_slider_doc = $("#"+id_str);

    range_slider_doc.rangeslider({
      polyfill: false,
      onInit: function() {
        $handle = $('.rangeslider__handle', this.$range);
        updateHandle($handle[0], this.value);
        updateState($handle[0], this.value);
      }
    })
    .on('input', function() {
      updateHandle($handle[0], this.value);
      checkState($handle[0], this.value);
    });
}

function Color_Map_Get_Hue_Sat(id_str){
    var width_str = $('#'+id_str).css("width");
    var height_str = $('#'+id_str).css("height");
    var width = Number(width_str.substring(0, width_str.indexOf("px")));
    var height = Number(height_str.substring(0, height_str.indexOf("px")));
    var x=event.offsetX;
    var y=event.offsetY;
    
    var hue360 = Math.round(x/width*360);
    var sat100 = Math.round(y/height*100);
    
    return{
        hue : hue360,
        saturation : sat100
    };
}
function Color_Map_Get_RGB(id_str){
    var width_str = $('#'+id_str).css("width");
    var height_str = $('#'+id_str).css("height");
    var width = Number(width_str.substring(0, width_str.indexOf("px")));
    var height = Number(height_str.substring(0, height_str.indexOf("px")));
    var x=event.offsetX;
    var y=event.offsetY;
    
    var hue360 = Math.round(x/width*360);
    var sat100 = Math.round(y/height*100);
    
    return HSVToRGB(hue360,sat100/100, 1);
}
function Temp_Map_Get_Color(id_str){
    var width_str = $('#'+id_str).css("width");
    var height_str = $('#'+id_str).css("height");
    var width = Number(width_str.substring(0, width_str.indexOf("px")));
    var height = Number(height_str.substring(0, height_str.indexOf("px")));
    var start_temp = Number($('#'+id_str + "_start_temp").val());
    var end_temp = Number($('#'+id_str + "_end_temp").val());
    var x=event.offsetX;
    var y=event.offsetY;
    
    var color_temp = Math.round((x/width)*(end_temp-start_temp)+start_temp);
    
    return color_temp;
}
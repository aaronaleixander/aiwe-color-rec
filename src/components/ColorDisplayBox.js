import React, {useState} from 'react';

const ColorDisplayBox = (props) => {
    const [lightPrint, setLightened] = useState(0);
    const [darkPrint, setDarkened] = useState(0);

    //identifies the lighter and darker color
    function rgbToHex(r,g,b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    } 

    function hexToRGB(hex){
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? 
            [parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)] : null;
    }

    //geets the luminence first
    function getLuminance(r, g, b){
        const a = [r, g, b].map(function (v){
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow( (v + 0.055 ) / 1.055, 2.4);
        });
        return a[0] * .2126 + a[1] * .7152 + a[2] * .0722;
    }
    /**
     * 
     * @param {num} r red component
     * @param {num} g green component
     * @param {num} b blue component
     * @param {boolean} shade true to lighten the color, false to darken the color
     * @returns 
     */
    function darkenLighten (r, g, b, shade){
        //shade = true lighten
        //shade = false darken
        let num = .8;
        if(shade){
            num = 1.5;
        } 
        if(r * num <= 255 && r * num >= 0){
            r = Math.round(r*num);
        }
        if(g * num <= 255 && g * num >= 0){
            g = Math.round(g*num)
        }
        if(b * num <= 255 && b * num >= 0){
            b = Math.round(b*num)
        }
        return [r,g,b];
    }
    
    function style (color){
        return {
            background: color
        }
    }        
    /**
     * 
     * @param {num} contrast The contrast number that will keep on changing/updating
     * @param {rgb} toBeChanged The Color to be changed
     * @param {num} originalPair the original color to be contrast the changing color with. given in luminence
     * @param {boolean} toLightenDarken lighten if true, darken if false
     */
    function recommendAColor(contrast, toBeChanged, originalPair, toLightenDarken){
        if(toLightenDarken){
            while(contrast < 4.5){
                const preContrast = contrast;
                console.log("ContrastLight: " + contrast + "lighterColor: " + toBeChanged);
                toBeChanged = darkenLighten(toBeChanged[0], toBeChanged[1], toBeChanged[2], toLightenDarken);
                contrast = (getLuminance(toBeChanged[0], toBeChanged[1], toBeChanged[2]) + .05) / (originalPair + .05);
                if(contrast === preContrast){
                    break;
                }
            }
    
            if(contrast < 4.5){
                return [255,255,255];
            }
            return toBeChanged;
        } else {
            while(contrast < 4.5){
                const preContrast = contrast;
                console.log("ContrastDark: " + contrast + "DarkenedColor: " + toBeChanged);
                toBeChanged = (darkenLighten(toBeChanged[0], toBeChanged[1], toBeChanged[2], toLightenDarken));
                contrast = (originalPair + .05) / (getLuminance(toBeChanged[0], toBeChanged[1], toBeChanged[2]) + .05);
                if(contrast === preContrast){
                    break;
                }
            }
            if(contrast < 4.5){
                return [0,0,0];
            }
            return toBeChanged;
        }
    }
    
    

    function recommend(color1, color2){
        let lighter, darker, contrast;
        //determine the luminance
        const lum1 = getLuminance(color1[0], color1[1], color1[2]);
        const lum2 = getLuminance(color2[0], color2[1], color2[2]);
        //set the luminance and get contrast
        lighter = Math.max(lum1, lum2);
        darker = lighter == lum1? lum2: lum1;
        contrast = (lighter + .05) / (darker + .05);
        //set the corresponding color to the lighter or darker shade
        let lightened = color2;
        let darkened = color1;
        if(lighter == lum1){
            lightened = color1;
            darkened = color2;
            console.log("lighter Color: " + color1 + " Darker Color: " + color2);
        }
        
        //recommending a color
        lightened = recommendAColor(contrast, lightened, darker, true);
        darkened = recommendAColor(contrast, darkened, lighter, false);
        
        //prints to check work
        console.log("Contrast: " + contrast);
        console.log("Color1: " + color1 + " Color2: " + color2)
        if(lighter == lum1){
            console.log("Lighter Color: " + color1 + " Recommended Darkened Color: " + darkened);
            console.log("Darker Color:  " + color2 + " Recommended Lighter Color:  " + lightened);
        } else {
            console.log("Lighter Color: " + color2 + " Recommended Darkened Color: " + darkened);
            console.log("Darker Color:  " + color1 + " Recommended Lighter Color:  " + lightened);
        }
        console.log("lighterColor: " + lightened);
        console.log("darkenColor: " + darkened );

        //setting the color to be able to see it in the web
        setLightened(lightened);
        setDarkened(darkened);
    } 
    
    return (
        <div>
            <div>
            <button onClick={ () => recommend(hexToRGB(props.color1), hexToRGB(props.color2))}>recommend a color</button>
            </div>

            <span style = {style(rgbToHex(lightPrint[0], lightPrint[1], lightPrint[2]))}>lightened:{lightPrint[0]} {lightPrint[1]} {lightPrint[2]} </span>
            <span style = {style(rgbToHex(darkPrint[0], darkPrint[1], darkPrint[2]))}>darkened: {darkPrint[0]}  {darkPrint[1]}  {darkPrint[2]}</span> 
        </div>
    ) 
}

export default ColorDisplayBox
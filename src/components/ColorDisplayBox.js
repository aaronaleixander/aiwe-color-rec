import React, {useState} from 'react';

const ColorDisplayBox = (props) => {
    const [lightPrint, setLightened] = useState(0);
    const [darkPrint, setDarkened] = useState(0);
    const [result, setResult] = useState("");
    const [originalContrast, setContrast] = useState("");

    //converts rgb to hex
    function rgbToHex(r,g,b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    } 

    //converts hex to rgb
    function hexToRGB(hex){
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? 
            [parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)] : null;
    }

    //gets the luminence first
    function getLuminance(color){
        const a = [color[0], color[1], color[2]].map(function (v){
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
     * @returns dakrened/lightened color by 20%/50%
     */
    function darkenLighten (r, g, b, shade){
        //shade = true lighten
        //shade = false darken
        let num = .95;
        if(shade){
            num = 1.1;
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
    
    function style (bgcolor){
        return {
            background: bgcolor, 
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
        let preContrast = -1;
        while(contrast < 4.5 && contrast !== preContrast){
            preContrast = contrast;
            //console.log("Contrast: " + contrast + " ColorToBeChanged: " + toBeChanged);
            toBeChanged = (darkenLighten(toBeChanged[0], toBeChanged[1], toBeChanged[2], toLightenDarken));
            if(toLightenDarken){
                contrast = (getLuminance(toBeChanged) + .05) / (originalPair + .05);
            } else {
                contrast = (originalPair + .05) / (getLuminance(toBeChanged) + .05);
            }
        }
        if(contrast < 4.5){
            /**
             * FIXME: Edge cases 
             * For some reason numbers arent able to go all the way up to 255/0
             * in the darkenLighten function
             * This is the fix for now.
             */
            if(toLightenDarken){
                toBeChanged = [255,255,255];
            } else {
                toBeChanged = [0,0,0];
            }
        }
        return [toBeChanged, contrast];
    }

    function recommend(fore, back){
        /**
         * TODO: look into font size to recommend the right colors
         * with the right ratios
         */
        let lighter, darker, contrast;
        //determine the luminance
        const lumFore = getLuminance(fore);
        const lumBack = getLuminance(back);
        //set the luminance and get contrast
        lighter = Math.max(lumFore, lumBack);
        darker = lighter === lumFore? lumBack: lumFore;
        contrast = (lighter + .05) / (darker + .05);
        setContrast(contrast.toFixed(2));

        //set the corresponding color to be lighter or darker shade
        let lightened, darkened;
        if(lighter === lumFore){
            lightened = fore;
            darkened = back;
            //console.log("lighter Color: " + fore + " Darker Color: " + back);
        } else {
            lightened = back;
            darkened = fore;
            //console.log("lighter Color: " + back + " Darker Color: " + fore);
        }
        
        //recommending a color
        //console.log("LIGHTEN");
        lightened = recommendAColor(contrast, lightened, darker, true);
        //console.log("DARKEN");
        darkened = recommendAColor(contrast, darkened, lighter, false);
        
        //prints to check work
        //console.log("Contrast: " + contrast);
        //console.log("Foreground: " + fore + " Background: " + back);

        //setting the color to be able to see it in the web
        setLightened(rgbToHex(lightened[0][0], lightened[0][1], lightened[0][2]));
        setDarkened(rgbToHex(darkened[0][0], darkened[0][1], darkened[0][2]));

        if(lighter === lumFore){
            //console.log("Lighter Color: " + fore + " Recommended Darkened Color: " + darkened);
            //console.log("Darker Color:  " + back + " Recommended Lighter Color:  " + lightened); 
            setResult(" Use foreground color: " + lightPrint + "(with original background color ratio is: "+ lightened[1].toFixed(2) + 
                ") or background color: " + darkPrint + "(with original foreground color ratio is: "+ darkened[1].toFixed(2) + ") to meet the expected contrast ratio.");

        } else {
            //console.log("Lighter Color: " + back + " Recommended Darkened Color: " + darkened);
            //console.log("Darker Color:  " + fore + " Recommended Lighter Color:  " + lightened);
            setResult(" Use foreground color: " + darkPrint + "(with original background color ratio is: "+ darkened[1].toFixed(2) + ") or background color: " 
                + lightPrint + "(with original foreground color ratio is: "+ lightened[1].toFixed(2) + ") to meet the expected contrast ratio.");
        }
        //console.log("lighterColor: " + lightened);
        //console.log("darkenColor: " + darkened );
    } 
    
    return (
        <div>
            <div>
            <button onClick={ () => recommend(hexToRGB(props.color1), hexToRGB(props.color2))}>recommend a color</button>
            <span style = {style(lightPrint)}>lightened: {lightPrint}</span>
            <span style = {style(darkPrint)}>darkened: {darkPrint}</span> 
            </div>
            <div> Fix the following: 
                <br/>
                • Element has insufficient color contrast of {originalContrast} 
                (forground color: {props.color1}, background color: {props.color2}, 
                font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 4.5:1 or greater.{result}</div>
        </div>
    ) 
}

export default ColorDisplayBox
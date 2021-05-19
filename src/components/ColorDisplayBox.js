import React, {useEffect, useState} from 'react';

const ColorDisplayBox = (props) => {
    console.log("color1: " + props.color1);

    console.log("color2: " + props.color2);
    const [lightPrint, setLightened] = useState(0);
    const [darkPrint, setDarkened] = useState(0);
    console.log("LIGHTEN: " + lightPrint);
    console.log("DARKENED: " + darkPrint); 
    //identifies the lighter and darker color

    //geets the luminence first
    function getLuminance(r, g, b){
        const a = [r, g, b].map(function (v){
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow( (v + 0.055 ) / 1.055, 2.4);
        });
        return a[0] * .2126 + a[1] * .7152 + a[2] * .0722;
    }

    function darkenLighten (r, g, b, shade){
        //shade = true lighten
        //shade = false darken
        let num = .8;
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

    function style (color){
        return {
            background: color,
            width: 10,
            height: 10
        }
    }        

    
    let lighter, darker, contrast, contrastDark, contrastLight;
    //recommend([props.color1[0], props.color1[1], props.color1[2]], [props.color2[0], props.color2[1], props.color2[2]])
    //let darkened = [props.color1[0], props.color1[1], props.color1[2]];
    //let lightened = [props.color2[0], props.color2[1], props.color2[2]];
    function recommend(color1, color2){
        //determine the luminance
        console.log("icolor1: " + color1);
        console.log("icolor2: " + color2);
        const lum1 = getLuminance(color1[0], color1[1], color1[2]);
        const lum2 = getLuminance(color2[0], color2[1], color2[2]);
        
        lighter = Math.max(lum1, lum2);
        darker = lighter == lum1? lum2: lum1;

        contrast = (lighter + .05) / (darker + .05);
        let lightened = color2;
        let darkened = color1;
        //setLightened(color2);
        //setDarkened(color1);
        if(lighter == lum1){
            lightened = color1;
            darkened = color2;
            //setLightened(color1);
            //setDarkened(color2);
        }
        contrastDark = contrast;
        contrastLight = contrast;

        console.log("Contrast: " + contrast);
        console.log("Color1: " + color1 + " Color2: " + color2)
        console.log("ContrastLight: " + contrastLight + "lighterColor: " + lightened);
        console.log("ContrastDark: " + contrastDark + "darkenColor: " + darkened);
        console.log("!@#$%^&*");
        //lightening the lighter color
        while(contrastLight < 4.5){
            const preContrast = contrastDark;
            console.log("ContrastLight: " + contrastLight + "lighterColor: " + lightened);
            //setLightened(darkenLighten(lightened[0], lightened[1], lightened[2], true));
            lightened = darkenLighten(lightened[0], lightened[1], lightened[2], true);
            contrastLight = (getLuminance(lightened[0], lightened[1], lightened[2]) + .05) / (darker + .05);
            if(contrastLight === preContrast){
                break;
            }
        }

        while(contrastDark < 4.5){
            const preContrast = contrastDark;
            console.log("ContrastDark: " + contrastDark + "DarkenedColor: " + darkened);
            //setDarkened(darkenLighten(darkened[0], darkened[1], darkened[2], false));
            darkened = (darkenLighten(darkened[0], darkened[1], darkened[2], false));
            contrastDark = (lighter + .05) / (getLuminance(darkened[0], darkened[1], darkened[2]) + .05);
            if(contrastDark === preContrast){
                break;
            }
        }
        console.log("Contrast: " + contrast);
        console.log("Color1: " + color1 + " Color2: " + color2)
        console.log("ContrastLight: " + contrastLight + "lighterColor: " + lightened);
        console.log("ContrastDark: " + contrastDark + "darkenColor: " + darkened);
        setLightened(lightened);
        setDarkened(darkened);
    } 
    /* 
    <div>Contrast: {contrast}</div>
            <p>lighter: {lighter}</p>
            <p>darker: {darker}</p>

            <p>contrastDark: {contrastDark} </p>
            <p>contrastLight: {contrastLight}</p>

            <span style = {style(rgbToHex(props.color1[0], props.color1[1], props.color1[2]))}>color1</span>
            <span style = {style(rgbToHex(props.color2[0], props.color2[1], props.color2[2]))}>color2</span>
            <br/>
            <span style = {style(rgbToHex(lightened[0], lightened[1], lightened[2]))}>lightened:{lightened[0]} {lightened[1]} {lightened[2]} </span>
            <span style = {style(rgbToHex(darkened[0], darkened[1], darkened[2]))}>darkened: {darkened[0]}  {darkened[1]}  {darkened[2]}</span> 
            */

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
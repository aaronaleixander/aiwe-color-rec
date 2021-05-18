import React, {useEffect, useState} from 'react';

const ColorDisplayBox = (props) => {

    //identifies the lighter and darker color

    //geets the luminence first
    function getLuminance(r, g, b){
        const a = [r, g, b].map(function (v){
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow( (v + 0.055 ) / 1.055, 2.4);
        });
        return a[0] * .2126 + a[1] * .7152 + a[2] * .0722;
    }

    function darken (r, g, b){
        if(r * .8 <= 255 && r * .8 >= 0){
            r = Math.round(r*.8);
        }
        if(g * .8 <= 255 && g * .8 >= 0){
            g = Math.round(g*.8)
        }
        if(b * .8 <= 255 && b * .8 >= 0){
            b = Math.round(b*.8)
        }
        return [r,g,b];
    }
    function lighten (r,g, b){
        if(r * 1.2 <= 255 && r * 1.2 >= 0){
            r = Math.round(r*1.2);
        }
        if(g * 1.2 <= 255 && g * 1.2 >= 0){
            g = Math.round(g*1.2)
        }
        if(b * 1.2 <= 255 && b * 1.2 >= 0){
            b = Math.round(b*1.2)
        }
        return [r,g,b];
    }

    function rgbToHex(r,g,b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    function style (color){
        return {
            background: color,
            width: 10,
            height: 10
        }
    }        
    let lighter, darker, contrast, darkened, lightened, contrastDark, contrastLight;
    recommend([props.color1[0], props.color1[1], props.color1[2]], [props.color2[0], props.color2[1], props.color2[2]])

    function recommend(color1, color2){
        //determine the luminance

        const lum1 = getLuminance(color1[0], color1[1], color1[2]);
        const lum2 = getLuminance(color2[0], color2[1], color2[2]);
        lighter = Math.max(lum1, lum2);
        darker = lighter == lum1? lum2: lum1;

        contrast = (lighter + .05) / (darker + .05);

        darkened = [color2[0], color2[1], color2[2]];
        lightened = [color1[0], color1[1], color1[2]];
        contrastDark = contrast;
        contrastLight = contrast;
        //lightening the lighter color
        while(contrastLight < 4.5){
            console.log("ContrastLight: " + contrastLight + "lighterColor: " + lightened);
            lightened = lighten(lightened[0], lightened[1], lightened[2]);
            contrastLight = (getLuminance(lightened[0], lightened[1], lightened[2]) + .05) / (darker + .05);
        }

        while(contrastDark < 4.5){
            darkened = darken(darkened[0], darkened[1], darkened[2]);
            contrastDark = (lighter + .05) / (getLuminance(darkened[0], darkened[1], darkened[2]) + .05);
        }
    }
    

    return (
    // <div style={divStyle}>
        <div>
            <div className="box-color">
            <p></p>
            </div>
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
        </div>
    ) 
}

export default ColorDisplayBox
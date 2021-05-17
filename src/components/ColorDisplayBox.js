import React from 'react'


const ColorDisplayBox = (props) => {

        // props will take in 2 color, color1 and color2

    //identifies the lighter and darker color

    //geets the luminence first
    function getLuminance(r, g, b){
        const a = [r, g, b].map(function (v){
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow( (v + 0.055 ) / 1.055, 2.4);
        });
        return a[0] * .2126 + a[1] * .7152 + a[2] * .0722;
    }

    function lighten (r, g, b){
        return [Math.round(r*.95), Math.round(g*.95), Math.round(b*.95)];
    }
    function darken (r,g, b){
        return [Math.round(r*1.05), Math.round(g*1.05), Math.round(b*1.05)];
    }

    //determine the luminance
    const lum1 = getLuminance(props.color1[0], props.color1[1], props.color1[2]);
    const lum2 = getLuminance(props.color2[0], props.color2[1], props.color2[2]);
    let lighter = Math.max(lum1, lum2);
    let darker = lighter == lum1? lum2: lum1;

    let contrast = (lighter + .05) / (darker + .05);

    let darkened = [props.color2[0], props.color2[1], props.color2[2]];
    let lightened = [props.color1[0], props.color1[1], props.color1[2]];
    let contrastDark = contrast;
    let contrastLight = contrast;
    //lightening the lighter color
    while(contrastLight < 4.5){
        lightened = lighten(lightened[0], lightened[1], lightened[2]);

        contrastLight = (lightened + .05) / (darker + .05);
    }

    while(contrastDark < 4.5){
        darkened = darken(darkened[0], darkened[1], darkened[2]);
        contrastDark = (lighter + .05) / (darkened + .05);
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

            <p>lightened: {lightened[0]} {lightened[1]} {lightened[2]} </p>
            <p>darkened: {darkened[0]}  {darkened[1]}  {darkened[2]} </p>
        </div>
    ) 

}

export default ColorDisplayBox
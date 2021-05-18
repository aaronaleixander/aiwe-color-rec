import React, {useState} from 'react'

const ColorPicker = () => {
    const [color1, setColor1] = useState(null);

    const [color2, setColor2] = useState(null);

  
    //console.log("colorPicker", color);
  
    return (
      <div>
        <input id="c1" type="color" value={color1} onChange={e => setColor1(e.target.value)} />
        <input id="c2" type="color" value={color2} onChange={e => setColor2(e.target.value)} />

      </div>
    );
  }

  export default ColorPicker
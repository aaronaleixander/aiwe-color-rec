import React, {useState} from 'react'
import ColorDisplayBox from './components/ColorDisplayBox'
import './App.css'
import ColorPicker from './components/ColorPicker'

function App() {
  const [pickColor1, setColor1] = useState("#000000");

  const [pickColor2, setColor2] = useState("#000000");
  return (
    <div className="App">
        <div className='example'>
            <p><b>Path: </b> li:nth child(1) a[href='\#""]</p> 
            <hr></hr>
            <p><b>Snippet: </b> a href="#" About /a </p>
            <hr></hr>
            <p><b>How to fix: </b> Fix the following:</p>
            <p> • Element has insufficient color contrast of 2.52 (forground color:, background color:, font size: 12.0pt (16px), font weight: normal).
                  Expected contrast ratio of 4.5:1 Use forground color: 
                  <br/>
                  
                  <h4>Select two colors to test contrast: </h4>

                  <input id="c1" type="color" value={pickColor1}  onChange={e => setColor1(e.target.value)}/>
                  <input id="c2" type="color" value={pickColor2}  onChange={e => setColor2(e.target.value)}/>
                  <ColorDisplayBox color1={pickColor1} color2={[pickColor2]}/>  
                  to meet the expected contrast ratio.
            </p>
        </div>
    </div>
  );
}

export default App;

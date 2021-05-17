import React from 'react'
import ColorDisplayBox from './components/ColorDisplayBox'
import './App.css'

function App() {
  return (
    <div className="App">
        <div className='example'>
            <p><b>Path: </b> li:nth child(1)> a[href='\#""]</p> 
            <hr></hr>
            <p><b>Snippet: </b> a href="#" About /a </p>
            <hr></hr>
            <p><b>How to fix: </b> Fix the following:</p>
            <p> • Element has insufficient color contrast of 2.52 (forground color:, background color:, font size: 12.0pt (16px), font weight: normal).
                  Expected contrast ratio of 4.5:1 Use forground color: <ColorDisplayBox />  to meet the expected contrast ratio.
            </p>
            
        </div>
        
    </div>
  );
}

export default App;

import React from 'react'; 
import './Intro.css';

class Intro extends React.Component { 
    render(){
        return (
            <div>
                <div class="win">
                    <span></span>
                </div>
                <div class="Tic-tac-toe">
                    <div>
                        <span id="x1">0</span>
                        <span id="x2">-</span>
                        <span id="x3">X</span>
                    </div>
                    <div>
                        <span id="x4">-</span>
                        <span id="x5">0</span>
                        <span id="x6">X</span>
                    </div>
                    <div>
                        <span id="x7">X</span>
                        <span id="x8">0</span>
                        <span id="x9">X</span>
                    </div>
                </div>
            </div>
        );
    }

}


export default Intro;
import React from 'react'; 

import Intro from '../Intro/Intro'
import Board from '../Board/Board';
import Drawer from '../Drawer/Drawer';
import Shadow from '../Shadow/Shadow';


import calculateWinner from '../../helpers/calculateWinner';


class Game extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                history: [{
                    squares: Array(9).fill(null),
                }],
                stepNumber: 0,
                xIsNext: true,
                drawerOpen: false,
                modeSelected: false,
                opponent: ''
            }
            this.selectMode = this.selectMode.bind(this);
            this.drawerClose = this.drawerClose.bind(this);
            this.drawerToggle = this.drawerToggle.bind(this);
        }
    
        handleClick(i) {
            const history = this.state.history.slice(0, this.state.stepNumber + 1);
            const current = history[history.length - 1];
            const squares = current.squares.slice();
            if (calculateWinner(squares) || squares[i]) {
                return;
            }
            squares[i] = this.state.xIsNext ? 'X' : 'O';
            this.setState({
                history: history.concat([{
                    squares: squares,
                }]),
                stepNumber: history.length,
                xIsNext: !this.state.xIsNext,
            })
        }
    
        jumpTo(step) {
            if(step >= 0 && step < this.state.history.length){
                this.setState({
                    stepNumber: step,
                    xIsNext: (step % 2) === 0,
                })
                this.drawerClose();
            }
        }

        drawerToggle() {
            this.setState(
              {
                drawerOpen: !this.state.drawerOpen,
              }
            )
          }
        
        drawerClose() {
            this.setState({
              drawerOpen: false
            })
        }

        selectMode(e) {
            let opponent = e.target.innerText;
            this.setState({
                opponent: opponent,
                modeSelected: true,
            
            }); 
        }

        selectModeOpen = () => {
            this.setState({
                modeSelected: false,
                stepNumber: 0,
            })
        }

        resetGame = () => {
            this.jumpTo(0);
            this.setState({
                history: [{
                    squares: Array(9).fill(null),
                }]
            })
        }

        render() {
            const history = this.state.history;
            const current = history[this.state.stepNumber];
            const winner = calculateWinner(current.squares);

            let shadow;
            if(this.state.drawerOpen) {
              shadow = <Shadow close={this.drawerClose} />
            }

            let status;
            if(winner) {
                status = winner + ' win';
            } else {
                status = 'Next player: ' + (this.state.xIsNext ? 'X' : '0');
            }

            let mode;
            if(this.state.modeSelected) {
                mode =           
                <div className="game-field">
                    <div>{status}</div>
                    <div className="game-board">
                      <Board 
                          squares = {current.squares}
                          onClick = {(i) => this.handleClick(i)}
                      />
                    </div>
                    <button onClick={this.drawerToggle}>Game history</button>   
                    <button onClick={this.selectModeOpen}>Choose opponent</button>   
                    <button onClick={() => this.jumpTo(this.state.stepNumber - 1)}>⎌ Undo</button>
                    <button onClick={() => this.jumpTo(this.state.stepNumber + 1)}>Redo</button>
                    <button onClick={() => this.resetGame()}>Reset</button>
                </div>
            } else {
                mode = 
                <div className="mode-select">
                    <p>Choose your opponent:</p>
                    <button onClick={this.selectMode}>Computer</button>
                    <Intro />
                    <button onClick={this.selectMode}>Player</button>
                </div>
            }
            
            const moves = history.map((step, move) => {
                const desc = move ? 'Return to move #' + move : 'Game start';
            return (
                <li key={move}>
                    <button onClick={() => {this.jumpTo(move)}}>{desc}</button>
                </li>
             );
            });
    
          return (
              
            <div className="game">
              <Drawer show={this.state.drawerOpen} moves={moves}>
              </Drawer>
              {shadow}  
              <h1>Tic Tac Toe Game</h1>
              {mode}
            </div>
          );
        }
      }

export default Game;
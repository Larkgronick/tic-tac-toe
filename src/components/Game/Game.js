import React from 'react'; 

import Intro from '../Intro/Intro'
import Board from '../Board/Board';
import Drawer from '../Drawer/Drawer';
import Shadow from '../Shadow/Shadow';

import calculateWinner from '../../helpers/calculateWinner';
import highlightWinner from '../../helpers/highlightWinner';

import computer from '../../assets/computer.png';
import player from '../../assets/player.png';
import undo from '../../assets/undo.png';
import redo from '../../assets/redo.png';
import book from '../../assets/history.png';

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

            if(this.state.opponent === 'Computer' && this.state.xIsNext) {
                setTimeout(() => this.computerMove(squares), 700);
            }
        }

        computerMove(arr)
        {
            if (calculateWinner(arr)) {
                return;
            }

            let availableMoves = [];

            arr.forEach((el, index) => {if (el === null) {
                availableMoves.push(index);
            }});

            let computerMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
            arr[computerMove] = 'O';

            this.setState({
                xIsNext: true,
            })
        }
        
        jumpTo(step) {
            if(step >= 0 && step < this.state.history.length){
                this.setState({
                    stepNumber: step,
                    xIsNext: (step % 2) === 0,
                })

                if(this.state.opponent === 'Computer'){
                    this.setState({
                        stepNumber: step,
                        xIsNext: true,
                    })
                }
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
                history: [{
                    squares: Array(9).fill(null),
                }]
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

        undoAction = () => {
            this.jumpTo(this.state.stepNumber - 1);
            if(this.state.opponent === 'Computer'){
                this.setState({
                    xIsNext: true,
                })
            }
        }

        redoAction = () => {
            this.jumpTo(this.state.stepNumber + 1);
            if(this.state.opponent === 'Computer'){
                this.setState({
                    xIsNext: true,
                })
            }
        }


        render() {
            let mode;
            let status;
            let shadow;
            const history = this.state.history;
            const current = history[this.state.stepNumber];
            const winner = calculateWinner(current.squares);
            const line = highlightWinner(current.squares);
            
            if(this.state.drawerOpen) {
              shadow = <Shadow close={this.drawerClose} />
            }

            if(winner) {
                if (winner === 'X' && this.state.opponent === 'Player') {
                    status = 'Player One win';
                } else if(winner === 'O' && this.state.opponent === 'Player') {
                    status = 'Player Two win';
                } else if(winner === 'X' && this.state.opponent === 'Computer') {
                    status = 'Player win';
                } else {
                    status = 'Computer win';
                }
            } else if((this.state.opponent === 'Computer' && this.state.stepNumber === 5) || this.state.stepNumber === 9){
                status = 'It\'s a draw!';
            }  else {
                console.log(this.state.stepNumber)
                if (this.state.opponent === 'Player') {
                    status = 'Next: ' + (this.state.xIsNext ? 'Player One (X)' : 'Player Two (O)');
                    
                } else {
                    status = 'Next: ' + (this.state.xIsNext ? 'Player (X)' : 'Computer (O) thinks...');
                }
            }
               
            if(this.state.modeSelected) {
                mode =           
                <div className="game-field">
                        <div className="game-status">{status}</div>
                        <div className="game-board">
                          <Board 
                              squares = {current.squares}
                              line = {line}
                              onClick = {(i) => this.handleClick(i)}
                          />
                </div>
                    <button className="actions" onClick={() => this.undoAction()}><img src={undo} alt="undo" />Undo</button>
                    <button className="actions" onClick={() => this.redoAction()}><img src={redo} alt="redo" />Redo</button>
                    <button className="actions" onClick={this.drawerToggle}><img src={book} alt="book" />Game history</button>   
                    <p>These actions will reset the current progress!!</p>
                    <button className="attention" onClick={this.selectModeOpen}>Choose opponent</button>   
                    <button className="attention" onClick={() => this.resetGame()}>Reset</button>
                </div>
            } else {
                mode = 
                <div className="mode-select">
                    <p>Choose your opponent:</p>
                    <button onClick={this.selectMode}><img src={computer} alt="computer" />Computer</button>
                    <Intro />
                    <button onClick={this.selectMode}><img src={player} alt="player" />Player</button>
                </div>
            }
            
                const moves = history.map((step, move) => {
                const desc = move ? 'Move #' + move : 'Game start';
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

import React from 'react';
import { render } from 'react-dom';
import { Othello, TILE_TYPE } from '../js/othello.js';
import { ComputerPlayer } from '../js/computer.js';

class Game extends React.Component {
  constructor() {
    super();
    this.game = new Othello(null, new ComputerPlayer);
    this.state = {
      boardState: this.game.boardState,
      turn: this.game.currentTurn,
      evalGrid: this.game.players[2].lastEvaluation.slice()
    };

    this.renderBoard = this.renderBoard.bind(this);
    this.clickTile = this.clickTile.bind(this);
    this.forceComputerTurn = this.forceComputerTurn.bind(this);
    this.checkEndGame = this.checkEndGame.bind(this);
  }

  clickTile(r, c) {
    return () => {
      if (this.game.players[this.game.currentTurn] !== null) {
        console.log(`Computer's turn`);
        return;
      }
      if (this.game.playPiece(r, c)) {
        this.setState({
          boardState: this.game.boardState,
          turn: this.game.currentTurn
        });
        if (!this.checkEndGame()) {
          setTimeout( () => {
            this.forceComputerTurn();
          }, 2000);
        }
      }
    }
  }

  forceComputerTurn() {
    this.game.computerTurn();
    this.setState({
      boardState: this.game.boardState,
      turn: this.game.currentTurn,
      evalGrid: this.game.players[2].lastEvaluation.slice()
    });
    this.checkEndGame();
  }

  checkEndGame() {
    if (this.game.moves === 0) {
      console.log('Game over');
      let whiteCount = this.game.countPieces(TILE_TYPE.WHITE);
      let blackCount = this.game.boardSize ** 2 - whiteCount;
      console.log(`Black: ${blackCount}\nWhite: ${whiteCount}`);
      return true;
    }
    return false;
  }

  renderBoard() {
    let blackPieces = [];
    let whitePieces = [];
    for (let i = 0; i < Math.floor(this.game.moves / 2); ++i) {
      blackPieces.push(<span key={i} className="piece"></span>);
      whitePieces.push(<span key={i} className="piece"></span>);
    }
    if (this.game.moves % 2 != 0) {
      whitePieces.push(<span key={64} className="piece"></span>);
    }
    return (
      <div className="game">
        {/* <h1>{ this.state.turn == 1 ? 'BLACK' : 'WHITE'}&apos;s turn</h1> */}
        <div className="piece-holder">{whitePieces}</div>
        <table>
          <tbody>
            { this.state.boardState.map((r, rIndex) => {
              return (
                <tr key={rIndex}>
                  { r.map((c, cIndex) => {
                    return (
                      <td key={rIndex + ' ' + cIndex} onClick={this.clickTile(rIndex, cIndex)}>
                        <span className={'tile ' + tileClass[c]}></span>
                        {/* <span className="eval">{this.state.evalGrid[rIndex][cIndex]}</span> */}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="piece-holder">{blackPieces}</div>
      </div>
    );
  }

  render() {
    return (
      <div>
        { this.renderBoard() }
      </div>
    );
  }
}

const tileClass = ['empty', 'black', 'white'];

module.exports = { Game };

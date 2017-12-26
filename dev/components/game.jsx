import React from 'react';
import { render } from 'react-dom';
import { Othello } from '../js/othello.js';
import { ComputerPlayer } from '../js/computer.js';

class Game extends React.Component {
  constructor() {
    super();
    this.game = new Othello(null, new ComputerPlayer());
    this.state = {
      boardState: this.game.boardState,
      turn: this.game.currentTurn
    };

    this.renderBoard = this.renderBoard.bind(this);
    this.clickTile = this.clickTile.bind(this);
  }

  clickTile(r, c) {
    return () => {
      if (this.game.playPiece(r, c)) {
        this.setState({
          boardState: this.game.boardState,
          turn: this.game.currentTurn
        });
      }
    }
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
                        <span className={tileClass[c]}></span>
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

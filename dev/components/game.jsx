import React from 'react';
import { render } from 'react-dom';
import { Othello } from '../js/othello.js';

class Game extends React.Component {
  constructor() {
    super();
    this.game = new Othello;
    this.state = {
      boardState: this.game.boardState,
      turn: this.game.currentTurn
    };

    this.renderBoard = this.renderBoard.bind(this);
    this.clickTile = this.clickTile.bind(this);
  }

  clickTile(r, c) {
    return () => {
      this.game.playPiece(r, c);
      this.setState({
        boardState: this.game.boardState,
        turn: this.game.currentTurn
      });
    }
  }

  renderBoard() {
    return (
      <table className="game">
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

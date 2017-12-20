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
  }

  render() {
    return (
      <table>
        <tbody>
          { this.state.boardState.map((r, rIndex) => {
            return (
              <tr key={rIndex}>
                { r.map((c, cIndex) => {
                  return (
                    <td key={rIndex + ' ' + cIndex}>
                      {c}
                    </td>
                  )
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
}

module.exports = { Game };

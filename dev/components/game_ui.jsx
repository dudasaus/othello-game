import React from 'react';
import { render } from 'react-dom';

class GameUI extends React.Component {
  constructor() {
    super();

    this.turnText = this.turnText.bind(this);
  }

  turnText() {
    const colors = [null, 'BLACK', 'WHITE'];
    const game = this.props.game;
    if (game.moves > 0) {
      const color = colors[game.currentTurn];
      const playerType = (game.players[game.currentTurn] === null) ? 'Human' : 'Computer';
      return `It is ${color}'s turn (${playerType})`;
    }
    else {
      const whiteCount = game.countPieces(2);
      const blackCount = game.boardSize ** 2 - whiteCount;
      if (whiteCount === blackCount) {
        return `TIE GAME, ${blackCount}-${whiteCount}.`;
      }
      let winner = 1;
      let winnerScore = Math.max(blackCount, whiteCount);
      let loserScore = Math.min(blackCount, whiteCount);
      if (whiteCount > blackCount) winner = 2;
      const color = colors[winner]
      const playerType = (game.players[winner] === null) ? 'Human' : 'Computer';
      return `${color} (${playerType}) wins, ${winnerScore}-${loserScore}.`;
    }
  }

  render() {
    return (
      <div className="turn-ui">
        <span>{this.turnText()}</span>
        <button className="btn" onClick={this.props.newGameHandler}>New Game</button>
      </div>
    );
  }
}

module.exports = { GameUI };

import React from 'react';
import { render } from 'react-dom';
import { Othello, TILE_TYPE } from '../js/othello.js';
// import { ComputerPlayer } from '../js/computer.js';
import { SmartComputerPlayer } from '../js/smart_computer.js';
import { Menu, MENU_OPTIONS } from './menu.jsx';
import { GameUI } from './game_ui.jsx';

class Game extends React.Component {
  constructor() {
    super();
    this.createGame(null, null);
    this.state = {
      boardState: this.game.boardState,
      turn: this.game.currentTurn,
      menuOpen: MENU_OPTIONS.NEW_GAME,
      // evalGrid: this.game.players[1].lastEvaluation.slice()
    };

    this.closeMenuFunction = null;

    this.renderBoard = this.renderBoard.bind(this);
    this.clickTile = this.clickTile.bind(this);
    this.forceComputerTurn = this.forceComputerTurn.bind(this);
    this.checkEndGame = this.checkEndGame.bind(this);
    this.checkForComputerTurn = this.checkForComputerTurn.bind(this);
    this.createGame = this.createGame.bind(this);
    this.menuSubmitHandler = this.menuSubmitHandler.bind(this);
    this.newGameButtonClick = this.newGameButtonClick.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
  }

  createGame(blackPlayer, whitePlayer) {
    this.game = new Othello(blackPlayer, whitePlayer);
    if (this.computerTimer) {
      clearTimeout(this.computerTimer);
    }
    this.checkForComputerTurn();
  }

  computerTurnTime() {
    if (this.game.players[1] !== null && this.game.players[2] !== null) {
      return 500;
    }
    return 2000 + Math.random() * 1000;
    // return 600;
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
        this.checkForComputerTurn();
      }
    }
  }

  checkForComputerTurn() {
    if (!this.checkEndGame() && this.game.players[this.game.currentTurn] !== null) {
      this.computerTimer = setTimeout( () => {
        this.forceComputerTurn();
      }, this.computerTurnTime());
    }
  }

  forceComputerTurn() {
    this.game.computerTurn();
    this.setState({
      boardState: this.game.boardState,
      turn: this.game.currentTurn,
      // evalGrid: this.game.players[1].lastEvaluation.slice()
    });
    this.checkForComputerTurn();
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
                        {/*<span className="eval">{this.state.evalGrid[rIndex][cIndex]}</span>*/}
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

  renderMenu() {
    if (this.state.menuOpen !== null) {
      return (
        <Menu options={this.state.menuOpen}
          submitHandler={this.menuSubmitHandler}
          closeHandler={this.closeMenuFunction} />
      );
    }
    else {
      return null;
    }
  }

  renderUI() {
    if (this.state.menuOpen !== null) return null;
    return <GameUI game={this.game} newGameHandler={this.newGameButtonClick}/>;
  }

  menuSubmitHandler(formResults) {
    if (this.state.menuOpen === MENU_OPTIONS.NEW_GAME) {
      let player1 = (formResults.player1 === 'Human') ? null : new SmartComputerPlayer;
      let player2 = (formResults.player2 === 'Human') ? null : new SmartComputerPlayer;
      this.createGame(player1, player2);
      this.closeMenuFunction = this.closeMenu;
      this.setState({
        boardState: this.game.boardState,
        turn: this.game.currentTurn,
        menuOpen: null
      });
    }
  }

  newGameButtonClick() {
    if (this.computerTimer) {
      clearTimeout(this.computerTimer);
    }
    this.setState({
      menuOpen: MENU_OPTIONS.NEW_GAME
    });
  }

  closeMenu() {
    this.setState({
      menuOpen: null
    });
    this.checkForComputerTurn();
  }

  render() {
    return (
      <div>
        { this.renderMenu() }
        { this.renderBoard() }
        { this.renderUI() }
      </div>
    );
  }
}

const tileClass = ['empty', 'black', 'white'];

module.exports = { Game };

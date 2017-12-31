import React from 'react';
import { render } from 'react-dom';
import { NewGameForm } from './new_game_form.jsx';
import { Signature } from './signature.jsx';

class Menu extends React.Component {
  constructor() {
    super();

    this.state = {};
    this.closeButton = this.closeButton.bind(this);
  }

  closeButton() {
    if (this.props.closeHandler !== null) {
      return <button className="btn close-btn" onClick={this.props.closeHandler}>X</button>;
    }
    else {
      return null;
    }
  }

  render() {
    return (
      <div className="menu-overlay" onClick={this.props.closeHandler}>
        <div className="menu-modal" onClick={(e)=>e.stopPropagation()}>
          <span className="game-title">Othello</span>
          <NewGameForm submitHandler={this.props.submitHandler}/>
          <Signature/>
          {this.closeButton()}
        </div>
      </div>
    );
  }
}

const MENU_OPTIONS = {
  NEW_GAME: 0
};

module.exports = { Menu, MENU_OPTIONS };

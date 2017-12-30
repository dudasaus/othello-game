import React from 'react';
import { render } from 'react-dom';
import { NewGameForm } from './new_game_form.jsx';

class Menu extends React.Component {
  constructor() {
    super();

    this.state = {};
  }

  render() {
    return (
      <div className="menu-overlay">
        <div className="menu-modal">
          <span className="game-title">Othello</span>
          <NewGameForm submitHandler={this.props.submitHandler}/>
        </div>
      </div>
    );
  }
}

const MENU_OPTIONS = {
  NEW_GAME: 0
};

module.exports = { Menu, MENU_OPTIONS };

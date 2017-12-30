import React from 'react';
import { render } from 'react-dom';

class NewGameForm extends React.Component {
  constructor() {
    super();

    this.state = {
      player1: 'Human',
      player2: 'Computer'
    };

    this.formChange = this.formChange.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
  }

  formChange(event) {
    const tmpState = {}
    tmpState[event.target.name] = event.target.value;
    this.setState(tmpState);
  }

  makeInput(name, options, defaultIndex) {
    let elements = [];
    for (let i = 0; i < options.length; ++i) {
      const op = options[i];
      const id = `${name}-${op}`;
      elements.push(
        <div key={`${id}-input`}>
          <input name={name} type="radio"
            id={id} value={op}
            defaultChecked={(i===defaultIndex)}/>
          <label htmlFor={id}>{op}</label>
        </div>
      );
    }
    return elements.length ? elements : null;
  }

  submitHandler(event) {
    event.preventDefault();
    console.log('form submit handler');
    this.props.submitHandler({
      player1: this.state.player1,
      player2: this.state.player2
    });
  }

  render() {
    return (
      <form onChange={this.formChange} onSubmit={this.submitHandler}>
        <span className="menu-header">Player 1 (black)</span>
        {this.makeInput('player1', ['Human', 'Computer'], 0)}
        <span className="menu-header">Player 2 (white)</span>
        {this.makeInput('player2', ['Human', 'Computer'], 1)}
        <button className="btn">Start</button>
      </form>
    );
  }
}

module.exports = { NewGameForm };

import React, { Component } from 'react';

class ActivateGameButton extends Component {
  render() {
    return (
      <button type="button" onClick={this.props.onClick}>
        Start Game
      </button>
    );
  }
}

export default ActivateGameButton;

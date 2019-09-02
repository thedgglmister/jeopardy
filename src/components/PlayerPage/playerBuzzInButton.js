import React, { Component } from 'react';

class PlayerBuzzInButton extends Component {
  render() {
    const { disabled, onClick } = this.props;

    return (
      <button type="button" disabled={disabled} onClick={onClick}>Buzz In</button>
    );
  }
}

export default PlayerBuzzInButton;

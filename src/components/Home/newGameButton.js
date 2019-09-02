import React, { Component } from 'react';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';



class NewGameButtonBase extends Component {
  constructor(props) {
    super(props);

    this.startNewGame = this.startNewGame.bind(this);
  }

  startNewGame() {
    const gameId = this.props.firebase.createNewGameId();
    this.props.history.push(`/board/${gameId}`);
  }

  render() {
    return (
      <button type="button" onClick={this.startNewGame}>
        Start New Game
      </button>
    );
  }
};
const NewGameButton = compose(
  withRouter,
  withFirebase,
)(NewGameButtonBase);

export default NewGameButton;

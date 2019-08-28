import React, { Component } from 'react';
import { compose } from 'recompose';
import { withRouter, Link } from 'react-router-dom';

import { withFirebase } from '../Firebase';
import StartGameLinks from './startGameLinks';



class StartGamePageBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    }
  }

  componentDidMount() {

    const gameId = this.props.match.params.gameId;

    const gameRef = this.props.firebase.game(gameId);
    gameRef.on('value', (snapshot) => {
      console.log(7334);
      const game = Object.assign({gameId: gameId}, snapshot.val());
      const { gameStatus } = game;
      let errorMsg = null;
      if (!gameStatus) {
        errorMsg = "I think you're in the wrong place";
      }
      else if (gameStatus == 'Finished') {
        errorMsg = "This game has already finished";
      }
      this.setState({
        loading: false,
        errorMsg: errorMsg,
        game: game,
      });
    });
  }

  componentWillUnmount() {
    const gameId = this.props.match.params.gameId;

    this.props.firebase.game(gameId).off();
  }


  render() {
    const { loading, errorMsg, game } = this.state;
    console.log(78);
    console.log(loading);
    console.log(errorMsg);
    console.log(game && game.gameStatus == 'New');




    return (
      <div>
        {loading && <h1>Loading...</h1>}
        {!loading && errorMsg && <h1>{errorMsg}</h1>}
        {!loading && !errorMsg && game.gameStatus == 'New' && <StartGameLinks game={game}/>}
        {!loading && !errorMsg && game.gameStatus == 'Active' && <h1>GameBoard</h1>}
      </div>
    );
  }
}
const StartGamePage = withFirebase(StartGamePageBase);


class NewGameButtonBase extends Component {
  constructor(props) {
    super(props);

    this.startNewGame = this.startNewGame.bind(this);
  }

  startNewGame() {
    const gameId = this.props.firebase.createNewGameId();
    this.props.history.push(`/game/${gameId}/board`);
  }

  render() {
    return (
      <button type="button" onClick={this.startNewGame}>
        Start New Game
      </button>
    );
  }

};

class ResumeGameButton extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { role, gameId } = this.props.currentGame;
    return (
      <Link to={`/game/${gameId}/${role == 'host' ? 'host' : `player/${role}`}`}>
        {role == 'host' ? 'Resume Hosting' : 'Resume Playing'}
      </Link>
    );
  }

};

class ToBoardButton extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { gameId } = this.props.currentGame;
    return (
      <Link to={`/game/${gameId}/board`}>
        To Board
      </Link>
    );
  }

};

const NewGameButton = compose(
  withRouter,
  withFirebase,
)(NewGameButtonBase);




export default StartGamePage;
export { NewGameButton, ResumeGameButton, ToBoardButton };

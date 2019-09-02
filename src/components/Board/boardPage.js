import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';


import JoinGameLinksList from './joinGameLinksList';
import GameBoard from './gameBoard';
import { withGameRef, withActiveQuestionRef, withAnswersRef, withGameCategoriesRef } from '../Refs';
import * as ROUTES from '../../constants/routes';


class BoardPageBase extends Component {
  render() {
    const { game, activeQuestion, answers, gameCategories } = this.props;
    const { gameId, gameStatus, host, p1, p2, p3 } = game;

    let errorMsg = null;
    let waitingMsg = null;
    const missingPlayers = !host || !p1 || !p2 || !p3;
    const newGame = gameStatus == "New";
    const finishedGame = gameStatus == "Finished";
    if (!gameStatus) {
      this.props.history.push(ROUTES.HOME);
    }
    else if (finishedGame) {
      errorMsg = "This game has finished";
    }
    if (newGame && !missingPlayers ){
      waitingMsg = 'Waiting for the host to start the game...';
    }

    console.log(11998);
    console.log(errorMsg);
    console.log(!errorMsg && waitingMsg);
    console.log(!errorMsg && missingPlayers);
    console.log(!errorMsg && !waitingMsg && !missingPlayers);


    return (
      <div>
        {errorMsg && <h1>{errorMsg}</h1>}
        {!errorMsg && waitingMsg && <h1>{waitingMsg}</h1>}
        {!errorMsg && missingPlayers && <JoinGameLinksList game={game} />}
        {!errorMsg && !waitingMsg && !missingPlayers && <GameBoard game={game}
                                                                   gameCategories={gameCategories}
                                                                   activeQuestion={activeQuestion}
                                                                   answers={answers} />}

      </div>

    );
  }
}


const BoardPage = compose(
  withGameRef,
  withGameCategoriesRef,
  withActiveQuestionRef,
  withAnswersRef,
  withRouter
)(BoardPageBase);


export default withRouter(BoardPage);

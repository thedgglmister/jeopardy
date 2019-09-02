import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import ActivateGameButton from './activateGameButton';
import ActiveHostScreen from './activeHostScreen';
import StopHostingButton from './stopHostingButton';
import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';
import { withGameRef, withCurrentGameRef, withActiveQuestionRef } from '../Refs';
import * as ROUTES from '../../constants/routes';

class HostPageBase extends Component {

  constructor(props) {
    super(props);

    this.stopHosting = this.stopHosting.bind(this);
    this.activateGame = this.activateGame.bind(this);
  }


  stopHosting() {
    const { gameId } = this.props.match.params;
    const { uid } = this.props.authUser;
     this.props.firebase.stopPlaying(gameId, 'host', uid)
      .then(() => {
        this.props.history.push(ROUTES.HOME);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  activateGame() {
    const { gameId } = this.props.match.params;
    const { uid } = this.props.authUser;
    const { firebase } = this.props;

    const newGameCategoriesRef = firebase.newGameCategories();
    //need to check if there werent enough categories, or any other problems.
    newGameCategoriesRef.once('value', (snapshot) => {
      const newGameCategories = snapshot.val();

      const dailyDoubleCategoryIndices = [
        Math.floor(Math.random() * 6),
        Math.floor(Math.random() * 6) + 6,
        Math.floor(Math.random() * 6) + 6,
      ];
      while (dailyDoubleCategoryIndices[2] == dailyDoubleCategoryIndices[1]) {
        dailyDoubleCategoryIndices[2] = Math.floor(Math.random() * 6) + 6;
      }

      let categoryNumber = 0;
      for (let categoryId in newGameCategories) {
        let category = newGameCategories[categoryId];
        console.log(667);

        console.log(category);

        category.categoryNumber = categoryNumber;

        delete category.complete;
        delete category.createdDate;
        delete category.creatorUid;
        delete category.lastModified;

        if (dailyDoubleCategoryIndices.indexOf(category.categoryNumber) != -1) {
          let dailyDoubleQuestionValue = (Math.floor(Math.random() * 5) +  1) * 200;
          let dailyDoubleQuestion = Object.values(category.questions).find((question) => {
            return question.value == dailyDoubleQuestionValue;
          })
          dailyDoubleQuestion.dailyDouble = true;
        }
        categoryNumber++;
      }

      const ref = firebase.db.ref();
      const updates = {}
      updates[`gameCategories/${gameId}`] = newGameCategories;
      updates[`games/${gameId}/round`] = 1;
      updates[`games/${gameId}/gameStatus`] = "Active";
      ref.update(updates)
      .catch((error) => {
        console.log(error);
      });
    });
  }

  render() {
    const { gameId } = this.props.match.params;
    const { currentGame, game, activeQuestion } = this.props;

    const isMyGame = currentGame && currentGame.gameId == gameId && currentGame.role == 'host';
    if (!isMyGame) {
      this.props.history.push(ROUTES.HOME);
      return null;
    }

    let errorMsg = null;
    let waitingMsg = null;
    const { gameStatus, p1, p2, p3 } = game;
    if (!gameStatus) {
      this.props.history.push(ROUTES.HOME);
    }
    else if (gameStatus == 'Finished') {
      errorMsg = "This game has already finished";
    }
    else if (gameStatus == "New" && !(p1 && p2 && p3)) {
      waitingMsg = "Waiting for players to join...";
    }

    return (
      <div>
        {errorMsg && <h1>{errorMsg}</h1>}
        {!errorMsg && waitingMsg && <h1>{waitingMsg}</h1>}
        {!errorMsg && <StopHostingButton onClick={this.stopHosting} />}
        {!errorMsg && !waitingMsg && game.gameStatus == 'New' && <ActivateGameButton onClick={this.activateGame}/>}
        {!errorMsg && !waitingMsg && game.gameStatus == 'Active' && <ActiveHostScreen gameId={gameId} activeQuestion={activeQuestion} />}
      </div>
    );
  }
};

const condition = authUser => !!authUser;

const HostPage = compose(
  withGameRef,
  withCurrentGameRef,
  withActiveQuestionRef,
  withRouter,
  withFirebase,
  withAuthorization(condition)
)(HostPageBase);

export default HostPage;

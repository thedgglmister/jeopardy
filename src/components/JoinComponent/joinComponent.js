import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import * as ROUTES from '../../constants/routes';
import { withAuthorization } from '../Session';
import { withGameRef, withCurrentGameRef } from '../Refs';
import JoinGameButton from './joinGameButton';



class JoinComponentBase extends Component {
  render() {
    const { game, currentGame } = this.props;
    const { gameId, role } = this.props.match.params;
    const { uid } = this.props.authUser;

    if (['host', 'p1', 'p2', 'p3'].indexOf(role) < 0) {
      this.props.history.push(ROUTES.HOME);
    }


    const isMyGame = currentGame && currentGame.gameId == gameId && currentGame.role == role;
    if (isMyGame) {
      this.props.history.push(role == 'host' ? `/host/${gameId}` : `/player/${role}/${gameId}`);
      return null;
    }
    const alreadyInAGame = currentGame != null;



    let errorMsg = null;
    if (!game || !game.gameStatus) {
      this.props.history.push(ROUTES.HOME);
    }
    else if (game.gameStatus == "Finished") {
      errorMsg = "This game has finished";
    }
    else if (game[role]) {
      errorMsg = `Someone has already joined as ${role == 'host' ? 'host' : `player ${role[1]}`}`;
    }


    return (
      <div>
        {alreadyInAGame && <h1>You're already in a game</h1>}
        {!alreadyInAGame && errorMsg && <h1>{errorMsg}</h1>}
        {!alreadyInAGame && !errorMsg && <JoinGameButton gameId={gameId} role={role} uid={uid} />}
      </div>
    );
  }
};

const condition = authUser => !!authUser;

const JoinComponent = compose(
  withAuthorization(condition),
  withRouter,
  withGameRef,
  withCurrentGameRef
)(JoinComponentBase);

export default JoinComponent;

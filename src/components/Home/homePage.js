import React, { Component } from 'react';

import { withCurrentGameRef } from '../Refs';
import ResumeGameButton from './resumeGameButton';
import ToBoardButton from './toBoardButton';
import NewGameButton from './newGameButton';
import ToCategoriesButton from './toCategoriesButton';



class HomePage extends Component {
  render() {
    const { currentGame } = this.props;
    const inGame = currentGame != null;
    const role = currentGame && currentGame.role;
    const gameId = currentGame && currentGame.gameId;

    return (
      <div>
        <h1>Home</h1>
        <br/>
        {inGame && <ResumeGameButton role={role} gameId={gameId} />}
        <br/>
        {inGame && <ToBoardButton gameId={gameId} />}
        <br/>
        {!inGame && <NewGameButton />}
        <br/>
        <ToCategoriesButton />
      </div>
    );
  }
};

export default withCurrentGameRef(HomePage);

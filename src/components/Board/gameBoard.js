import React, { Component } from 'react';

import BoardCategories from './boardCategories';
import ScoreCards from './scoreCards';



class GameBoard extends Component {

  render() {
    //dont need to do ll this every render? just do all this in constructor or somehting?
    const { game, activeQuestion, gameCategories, answers } = this.props;
    const { round, gameId } = game;

    const allCategoriesArr = [];
    for (let categoryId of Object.keys(gameCategories)) {
      const category = gameCategories[categoryId];
      allCategoriesArr.push(Object.assign({categoryId: categoryId}, category));
    }
    allCategoriesArr.sort((a, b) => a.categoryNumber - b.categoryNumber);
    const thisRoundsCategoriesArr = allCategoriesArr.slice(round == 1 ? 0 : 6, round == 1 ? 6 : 12);

    const gameBoardContainerStyle = {
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'blue',
    }

    return (
      <div className="game-board-container" style={gameBoardContainerStyle}>
        {<BoardCategories gameId={gameId} categoriesArr={thisRoundsCategoriesArr} round={round} activeQuestion={activeQuestion} />}
        <ScoreCards answers={answers} game={game} />
      </div>
    );
  }
}



export default GameBoard;

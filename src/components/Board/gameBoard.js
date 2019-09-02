import React, { Component } from 'react';

import BoardCategory from './boardCategory';
import BoardActiveQuestionScreen from './boardActiveQuestionScreen';
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

    return (
      <div>
        {activeQuestion && <BoardActiveQuestionScreen activeQuestion={activeQuestion} />}
        {!activeQuestion && thisRoundsCategoriesArr.map((category) => (
          <BoardCategory key={category.categoryId} gameId={gameId} category={category} round={round} />
        ))}
        <ScoreCards answers={answers} game={game} />
      </div>
    );
  }
}



export default GameBoard;

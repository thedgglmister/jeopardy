import React, { Component } from 'react';

import BoardQuestion from './boardQuestion';

class BoardCategory extends Component {
  render() {
    const { gameId, category, round } = this.props;
    const { categoryName, questions } = category;


    //probably dont want to do this in render? or?
    const questionsArr = Object.keys(questions).map((questionId) => {
      return Object.assign({questionId: questionId}, questions[questionId]);
    });
    questionsArr.sort((a, b) => a.value - b.value);

    return (
      <div>
        <h1>{categoryName}</h1>
        {questionsArr.map((question) => (
          <BoardQuestion key={question.questionId} gameId={gameId} question={question} round={round}/>
        ))}
      </div>
    );
  }
}

export default BoardCategory;

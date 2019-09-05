import React, { Component } from 'react';

import BoardQuestion from './boardQuestion';

class BoardCategory extends Component {
  render() {
    const { gameId, category, round, activeQuestion } = this.props;
    const { categoryName, questions } = category;


    //probably dont want to do this in render? or?
    const questionsArr = Object.keys(questions).map((questionId) => {
      return Object.assign({questionId: questionId}, questions[questionId]);
    });
    questionsArr.sort((a, b) => a.value - b.value);

    const boardCategoryContainerStyle = {
      width: '16.66vw',
      borderLeft: '1px solid black',
      borderRight: '1px solid black',
    };

    const categoryNameContainerStyle = {
      fontSize: '30px',
      fontWeight: '800',
      height: '10.0357vw',
      textAlign: 'center',
      color: '#fff',
      boxSizing: 'border-box',
    };




    return (
      <div className="board-category-container" style={boardCategoryContainerStyle}>
        <div className="category-name-container" style={categoryNameContainerStyle}>
          {categoryName}
        </div>
        {questionsArr.map((question) => (
          <BoardQuestion key={question.questionId}
                         gameId={gameId}
                         question={question}
                         round={round}
                         activeQuestion={activeQuestion}/>
        ))}
      </div>
    );
  }
}

export default BoardCategory;

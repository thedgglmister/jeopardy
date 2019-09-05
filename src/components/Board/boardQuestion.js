import React, { Component } from 'react';

import { withFirebase } from '../Firebase';
import ActiveQuestionScreen from './activeQuestionScreen';



class BoardQuestionBase extends Component {
  constructor(props) {
    super(props);

    this.activateQuestion = this.activateQuestion.bind(this);
  }

  activateQuestion() {
    const { gameId, question, round } = this.props;
    const { questionId, categoryId } = question;
    const ref = this.props.firebase.ref();
    const updates = {};
    updates[`activeQuestionsByGame/${gameId}`] = {
      ...question,
      value: question.value * round,
    };
    updates[`gameCategories/${gameId}/${categoryId}/questions/${questionId}/alreadyUsed`] = true;
    console.log(12345666);

    console.log(updates);
    ref.update(updates)
    .catch((error) => {
      console.log(error);
    });
  }

  render() {
    const { round, question, activeQuestion } = this.props;
    const { value, alreadyUsed, questionId } = question;




    const boardQuestionContainerStyle = {
      height: '7.6357vw',
      border: '1px solid black',
      color: '#fff',
      font: '36px',
      fontWeight: '800',
      textAlign: 'center',
      boxSizing: 'border-box',
    };

    const isActive = activeQuestion && activeQuestion.questionId == questionId;

    return (
      <div className="board-question-container" style={boardQuestionContainerStyle} onClick={alreadyUsed || activeQuestion ? null : this.activateQuestion}>
        {isActive && <ActiveQuestionScreen activeQuestion={activeQuestion}/>}
        {!alreadyUsed && <div>{value * round}</div>}
      </div>
    );
    // <br/>
    // <button type="button" disabled={alreadyUsed} onClick={this.activateQuestion}>SELECT</button>
  }
}
const BoardQuestion = withFirebase(BoardQuestionBase);

export default BoardQuestion;

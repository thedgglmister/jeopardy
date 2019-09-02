import React, { Component } from 'react';

import { withFirebase } from '../Firebase';


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
    ref.update(updates)
    .catch((error) => {
      console.log(error);
    });
  }

  render() {
    const { round, question } = this.props;
    const { value, alreadyUsed } = question;

    console.log(6555);
    console.log(question);
    console.log(round);
    console.log(value);

    return (
      <button type="button" disabled={alreadyUsed} onClick={this.activateQuestion}>{value * round}</button>
    );
  }
}
const BoardQuestion = withFirebase(BoardQuestionBase);

export default BoardQuestion;

import React, { Component } from 'react';

import { withFirebase } from '../Firebase';




class AcceptAnswerButtonBase extends Component {
  constructor(props) {
    super(props);

    this.acceptAnswer = this.acceptAnswer.bind(this);
    console.log(6);

  }

  acceptAnswer() {
    console.log(33);
    const { gameId, activeQuestion } = this.props;
    const { buzzeeRole } = activeQuestion;
    const ref = this.props.firebase.ref();

    const answerPushKey = ref.child(`answers/${gameId}`).push().key;

    const updates = {};
    updates[`answers/${gameId}/${answerPushKey}`] = {
      role: buzzeeRole,
      value: activeQuestion.value,
    };
    updates[`activeQuestionsByGame/${gameId}`] = null;

    ref.update(updates)
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <div>
        <button type="button" onClick={this.acceptAnswer}>
          Accept Answer
        </button>
      </div>
    );
  }
}
const AcceptAnswerButton = withFirebase(AcceptAnswerButtonBase);

export default AcceptAnswerButton;

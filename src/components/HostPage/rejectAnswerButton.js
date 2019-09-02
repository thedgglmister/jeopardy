import React, { Component } from 'react';

import { withFirebase } from '../Firebase';




class RejectAnswerButtonBase extends Component {
  constructor(props) {
    super(props);

    this.rejectAnswer = this.rejectAnswer.bind(this);
    console.log(6);

  }

  rejectAnswer() {
    const { gameId, activeQuestion } = this.props;
    const { buzzeeRole, alreadyBuzzedStatuses, dailyDouble } = activeQuestion;
    const ref = this.props.firebase.ref();

    const allPlayersRejected = dailyDouble ||
                                (alreadyBuzzedStatuses &&
                                alreadyBuzzedStatuses.p1 &&
                                alreadyBuzzedStatuses.p2 &&
                                alreadyBuzzedStatuses.p3);

    const answerPushKey = ref.child(`answers/${gameId}`).push().key;
    const updates = {};



    updates[`answers/${gameId}/${answerPushKey}`] = {
      role: buzzeeRole,
      value: -activeQuestion.value,
    };
    updates[`activeQuestionsByGame/${gameId}/buzzeeRole`] = null;
    if (allPlayersRejected) {
      updates[`activeQuestionsByGame/${gameId}`] = null;
    }

    ref.update(updates)
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <div>
        For daily doubles, need to handle time different, and automatically poulate buzzeeRole if they arent going to buzz in. make sure others donthave chance to buzz, etc. same with like host activate question button, etc.
        <button type="button" onClick={this.rejectAnswer}>
          Reject Answer
        </button>
      </div>
    );
  }
}
const RejectAnswerButton = withFirebase(RejectAnswerButtonBase);

export default RejectAnswerButton;

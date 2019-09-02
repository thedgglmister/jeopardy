import React, { Component } from 'react';

import AllowBuzzesButton from './allowBuzzesButton';
import AcceptAnswerButton from './acceptAnswerButton';
import RejectAnswerButton from './rejectAnswerButton';



class HostActiveQuestionScreen extends Component {
  render() {
    const { activeQuestion, gameId } = this.props;
    const { answer, allowBuzzes, buzzeeRole } = activeQuestion;
    console.log(776);
    console.log(allowBuzzes);
    console.log(!allowBuzzes);

    return (
      <div>
        <h1>Answer: {answer}</h1>
        {!allowBuzzes && <AllowBuzzesButton gameId={gameId} />}
        {buzzeeRole && <AcceptAnswerButton gameId={gameId} activeQuestion={activeQuestion}/>}
        {buzzeeRole && <RejectAnswerButton gameId={gameId} activeQuestion={activeQuestion}/>}

      </div>
    );
  }
}

export default HostActiveQuestionScreen;

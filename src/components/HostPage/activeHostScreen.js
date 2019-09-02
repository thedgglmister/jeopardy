import React, { Component } from 'react';

import HostActiveQuestionScreen from './hostActiveQuestionScreen';

class ActiveHostScreen extends Component {
  render() {
    const { activeQuestion, gameId } = this.props;

    return (
      <div>
        {!activeQuestion && <h1>Choose a question...</h1>}
        {activeQuestion && <HostActiveQuestionScreen gameId={gameId} activeQuestion={activeQuestion} />}
      </div>
    );
  }
}



export default ActiveHostScreen;

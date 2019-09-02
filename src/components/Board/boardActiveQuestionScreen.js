import React, { Component } from 'react';

class BoardActiveQuestionScreen extends Component {
  //need to do timer on server. if host does a set timeout on client side, what if they leave the page? it will not
  render() {
    const { question, allowBuzzes } = this.props.activeQuestion;
    return (
      <div>
        <h1>{question}</h1>
        <h1>{allowBuzzes ? 'Live' : ''}</h1>
      </div>
    );
  }
}

export default BoardActiveQuestionScreen;

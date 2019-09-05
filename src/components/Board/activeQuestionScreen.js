import React, { Component } from 'react';

class ActiveQuestionScreen extends Component {
  //need to do timer on server. if host does a set timeout on client side, what if they leave the page? it will not


  render() {
    const { activeQuestion } = this.props;
    const { question, allowBuzzes } = activeQuestion;


    const activeQuestionContainerStyle = {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100vw',
      height: '48.2142vw',
      backgroundColor: 'green',
      boxSizing: 'border-box',
    }

    return (
      <div className="active-question-container" style={activeQuestionContainerStyle}>
        {question}
        {allowBuzzes ? 'Live' : ''}
      </div>
    );
  }
}

export default ActiveQuestionScreen;

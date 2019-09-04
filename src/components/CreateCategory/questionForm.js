import React, { Component } from 'react';

class QuestionForm extends Component {
  render() {
    const { question, answer, questionIndex, onQuestionChange, questionId } = this.props;

    return (
      <div>
        <input
          name={questionId + '.question'}
          value={question}
          onChange={onQuestionChange}
          type="text"
          placeholder={'Question ' + (questionIndex + 1)}
        />
        <input
          name={questionId + '.answer'}
          value={answer}
          onChange={onQuestionChange}
          type="text"
          placeholder={'Answer ' + (questionIndex + 1)}
        />
      </div>
    );
  }
}

export default QuestionForm;

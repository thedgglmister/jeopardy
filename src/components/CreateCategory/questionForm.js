import React, { Component } from 'react';

class QuestionForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      question: this.props.question,
      answer: this.props.answer,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.question != this.props.question || prevProps.answer != this.props.answer) {
      this.setState({
        question: this.props.question,
        answer: this.props.answer,
      });
    }
  }

  render() {

    const {
      question,
      answer,
    } = this.state;
    const questionIndex = this.props.questionIndex;

    return (
      <div>
        <input
          name={questionIndex + '.question'}
          value={question}
          onChange={this.props.onQuestionChange}
          type="text"
          placeholder={'Question ' + (questionIndex + 1)}
        />
        <input
          name={questionIndex + '.answer'}
          value={answer}
          onChange={this.props.onQuestionChange}
          type="text"
          placeholder={'Answer ' + (questionIndex + 1)}
        />
      </div>
    );
  }
}

export default QuestionForm;

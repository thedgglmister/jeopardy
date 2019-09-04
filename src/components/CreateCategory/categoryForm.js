import React, { Component } from 'react';

import QuestionForm from './questionForm';
import { withFirebase } from '../Firebase';


class CategoryFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errorMsg: null,
      successMsg: null,
    }

    this.onSubmit = this.onSubmit.bind(this);
    this.insertCategory = this.insertCategory.bind(this);
    this.updateCategory = this.updateCategory.bind(this);
  }



  onSubmit(event) {
    event.preventDefault();
    this.setState({
      errorMsg: null,
    });

    const { categoryName, questions, categoryId, uid } = this.props;
    const editing = !!categoryId;
    const timestamp = new Date().toISOString();

    const completeSoFar = !!categoryName;
    Object.values(questions).reduce((completeSoFar, questionObj) => {
      return completeSoFar && !!questionObj.question && !! questions.answer;
    }, completeSoFar);

    const categoryObj = {
      complete: completeSoFar,
      lastModified: timestamp,
      categoryName: categoryName,
      categoryId: categoryId,
      questions: questions,
      creatorUid: uid,
    };
    if (editing) {
      categoryObj.createdDate = timestamp;
    }

    editing ? this.updateCategory(categoryObj) : this.insertCategory(categoryObj);
  };

  insertCategory(categoryObj) {
    this.props.firebase.createCategory(categoryObj)
      .then((categoryRef) => {
        this.props.resetAfterSubmit();
        clearTimeout(this.successMsgTimer);
        this.setState({
          successMsg: 'success',
        });
        this.successMsgTimer = setTimeout(() => {
          this.setState({
            successMsg: null,
          });
        }, 1000);
      })
      .catch(error => {
        this.setState({
          errorMsg: error.message,
        });
      });
  }

  updateCategory(categoryObj) {
    this.props.firebase.editCategory(categoryObj)
      .then((categoryRef) => {
        this.props.resetAfterSubmit();
        clearTimeout(this.successMsgTimer);
        this.setState({
          successMsg: 'success',
        });
        this.successMsgTimer = setTimeout(() => {
          this.setState({
            successMsg: null,
          });
        }, 1000);
      })
      .catch(error => {
        this.setState({
          errorMsg: error.message,
        });
      });
  }

  render() {
    console.log(1111);
    const { categoryName, questions } = this.props;
    console.log(categoryName);

    const { onQuestionChange, onCategoryNameChange } = this.props;
    const { errorMsg, successMsg } = this.state;

    const questionsList = Object.keys(questions).map(questionId => ({
      ...questions[questionId],
      questionId: questionId,
    }));
    questionsList.sort((questionObj1, questionObj2) => questionObj1.value - questionObj2.value);

    const questionsAreAllBlank = questionsList.reduce((soFar, questionObj) =>
      (soFar && !questionObj.question && !questionObj.answer),
      true
    );

    const disableSubmit = questionsAreAllBlank && !categoryName;

    return (
      <form onSubmit={this.onSubmit}>
        <input
          value={categoryName}
          onChange={onCategoryNameChange}
          type="text"
          placeholder="Category Name"
        />
        {questionsList.map((question, index) => (
          <QuestionForm key={question.questionId}
                        questionId={question.questionId}
                        question={question.question}
                        answer={question.answer}
                        questionIndex={index}
                        onQuestionChange={onQuestionChange} />

        ))}

        <button type="submit" disabled={disableSubmit}>
          Save Category
        </button>

        {errorMsg && <p>{errorMsg}</p>}
        {successMsg && <p>{successMsg}</p>}

      </form>
    );
  }

}

const CategoryForm = withFirebase(CategoryFormBase);

export default CategoryForm;

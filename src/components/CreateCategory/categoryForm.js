import React, { Component } from 'react';

import QuestionForm from './questionForm';
import { withFirebase } from '../Firebase';



class CategoryFormBase extends Component {
  constructor(props) {
    super(props);

    const { category } = this.props;
    const questionsObj = category.questions;

    console.log(8822);
    console.log(category);

    const questionsList = Object.keys(questionsObj).map(questionId => ({
      ...questionsObj[questionId],
      questionId: questionId,
      categoryId: category.categoryId,
    }));
    questionsList.sort((questionObj1, questionObj2) => questionObj1.value - questionObj2.value);


    this.state = {
      categoryName: category.categoryName,
      questionsList: questionsList,
      errorMsg: null,
      successMsg: null,
    }

    this.onQuestionChange = this.onQuestionChange.bind(this);
    this.onCategoryNameChange = this.onCategoryNameChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.insertCategory = this.insertCategory.bind(this);
    this.updateCategory = this.updateCategory.bind(this);


  }

  componentDidUpdate(prevProps) {
    console.log(9832);

    if (prevProps.category != this.props.category) {
      console.log(444);


      const { category } = this.props;
      const questionsObj = category.questions;
      console.log(questionsObj);

      const questionsList = Object.keys(questionsObj).map(questionId => ({
        ...questionsObj[questionId],
        questionId: questionId,
      }));
      questionsList.sort((questionObj1, questionObj2) => questionObj1.value - questionObj2.value);
      console.log(questionsList);
      this.setState({
          categoryName: this.props.category.categoryName,
          questionsList: questionsList,
          errorMsg: null,
      })
    }
    console.log(5555);
  }

  onQuestionChange(event) {
    console.log(322);
    const { questionsList } = this.state;

    console.log(questionsList);

    const path = event.target.name.split('.');
    const questionIndex = path[0];
    const questionOrAnswer = path[1];

    console.log(questionIndex, questionOrAnswer);


    const newQuestionsList = JSON.parse(JSON.stringify(questionsList));

    newQuestionsList[questionIndex][questionOrAnswer] = event.target.value;

    console.log(newQuestionsList);


    this.setState({
      questionsList: newQuestionsList,
    });
  };

  onCategoryNameChange(event) {
    this.setState({
      categoryName: event.target.value
    });
  };

  onSubmit(event) {
    event.preventDefault();
    console.log(220001);

    this.setState({
      errorMsg: null,
    });


    const { categoryName, questionsList } = this.state;

    const editing = this.props.category.categoryId != null;
    const timestamp = new Date().toISOString();

    const categoryObj = {
      complete: !!(categoryName && questionsList[0].question && questionsList[0].answer &&
                                questionsList[1].question && questionsList[1].answer &&
                                questionsList[2].question && questionsList[2].answer &&
                                questionsList[3].question && questionsList[3].answer &&
                                questionsList[4].question && questionsList[4].answer),
      creatorUid: this.props.authUser.uid,
      createdDate: editing ? this.props.category.createdDate : timestamp,
      lastModified: timestamp,
      categoryName: categoryName,
    };

    if (editing) {
      console.log(220000);
      categoryObj.questions = questionsList.reduce((soFar, currentQuestion) => {
        const questionId = currentQuestion.questionId;
        const currentQuestionClone = Object.assign({}, currentQuestion);
        delete currentQuestionClone.questionId;
        soFar[questionId] = currentQuestionClone;
        return soFar;
      }, {});
      this.updateCategory(categoryObj);
    }
    else {
      this.insertCategory(categoryObj, JSON.parse(JSON.stringify(questionsList)));
    }

  };

  insertCategory(categoryObj, questionsList) {

    questionsList.forEach((question) => {
      delete question.questionId
    });

    this.props.firebase
      .createCategory(categoryObj, questionsList)
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
    this.props.firebase
      .editCategory(this.props.category.categoryId, categoryObj)
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
    const { categoryName, questionsList, errorMsg, successMsg } = this.state;

    const questionsBlank = questionsList.reduce((soFar, questionObj) =>
      (soFar && !questionObj.question && !questionObj.answer),
      true
    );

    const disableSubmit = questionsBlank && !categoryName;

    console.log(disableSubmit);

    return (
      <form onSubmit={this.onSubmit}>
        <input
          value={categoryName}
          onChange={this.onCategoryNameChange}
          type="text"
          placeholder="Category Name"
        />
        {questionsList.map((question, index) => (
          <QuestionForm key={question.questionId}
                        id={question.questionId}
                        question={question.question}
                        answer={question.answer}
                        questionIndex={index}
                        onQuestionChange={this.onQuestionChange} />

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

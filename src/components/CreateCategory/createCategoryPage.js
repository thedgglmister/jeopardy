import React, { Component } from 'react';
import { compose } from 'recompose';

import { withMyCategoriesRef } from '../Refs';
import { withAuthorization } from '../Session';
import CategoryForm from './categoryForm';
import MyCategoriesList from './myCategoriesList';



class CreateCategoryPageBase extends Component {

  constructor(props) {
    super(props);

    const currentCategory = this.newCategory();

    this.state = {
      currentCategoryName: currentCategory.categoryName,
      currentQuestions: currentCategory.questions,
      currentCategoryId: currentCategory.categoryId,
    };

    this.setCurrentCategory = this.setCurrentCategory.bind(this);
    this.resetAfterSubmit = this.resetAfterSubmit.bind(this);
    this.onQuestionChange = this.onQuestionChange.bind(this);
    this.onCategoryNameChange = this.onCategoryNameChange.bind(this);
  }

  onQuestionChange(event) {
    const { currentQuestions } = this.state;

    const path = event.target.name.split('.');
    const questionId = path[0];
    const questionOrAnswer = path[1];

    const newCurrentQuestions = Object.assign({}, currentQuestions);
    newCurrentQuestions[questionId][questionOrAnswer] = event.target.value;

    this.setState({
      currentQuestions: newCurrentQuestions,
    });
  };

  onCategoryNameChange(event) {
    this.setState({
      currentCategoryName: event.target.value
    });
  };

  setCurrentCategory(event) {
    const { myCategories } = this.props;
    const newCategoryId = event.currentTarget.getAttribute("name");

    const matchingCategory = myCategories[newCategoryId];
    const currentCategory = matchingCategory ? matchingCategory : this.newCategory();

    this.setState({
      currentCategoryName: currentCategory.categoryName,
      currentQuestions: currentCategory.questions,
      currentCategoryId: newCategoryId,
    });
  }

  resetAfterSubmit() {
    const currentCategory = this.newCategory();

    this.setState({
      currentCategoryName: currentCategory.categoryName,
      currentQuestions: currentCategory.questions,
      currentCategoryId: null,
    });
  }

  newCategory() {
    return {
      categoryId: null,
      categoryName: '',
      questions: {
        0: {question: '', answer: '',value: 200},
        1: {question: '', answer: '',value: 400},
        2: {question: '', answer: '',value: 600},
        3: {question: '', answer: '',value: 800},
        4: {question: '', answer: '',value: 1000},
      }
    };
  }

  render() {
    const { myCategories } = this.props;
    console.log(666334);
    console.log(myCategories);
    const { currentCategoryName, currentQuestions, currentCategoryId } = this.state;
    console.log(22222);
    console.log(currentCategoryId);
    return (
      <div>
          <CategoryForm categoryName={currentCategoryName}
                        questions={currentQuestions}
                        categoryId={currentCategoryId}
                        uid={this.props.authUser.uid}
                        resetAfterSubmit={this.resetAfterSubmit}
                        onQuestionChange={this.onQuestionChange}
                        onCategoryNameChange={this.onCategoryNameChange} />
          <MyCategoriesList myCategories={myCategories}
                            setCurrentCategory={this.setCurrentCategory} />

          only thing i need to wory about is if there are people spectators, how to mark the questions as seen. need a link from gameId that they can go to which takes them to the app and then gets their authUser and marks the game as seen. need to advertise that somehow. can i do a scan code on the question screen?

          Also need a way to submit Final Jeopardy questions and categories.

          https://jsfiddle.net/48ue2hsb/4/

          https://firebase.google.com/docs/database/web/read-and-write#save_data_as_transactions (if this is about blocking, need ot do it when taking positions in a game, and for buzzer, or whatever)

          make sure handle what happens if someone leaves game while active question, for example. need to handle timer, if any? if player quits and ends game, makre sure active question ref ettc all go away.

          if not enough room on board to show signatures and scores, just show scores, and on hover have it pop up to see signatures as well.

          since i dont know what size the categoryNames or questions or final jeopardies, answers dont know how long they will be, need to make sure i handle this. font sizes and padding and stuff?
      </div>
    );
  }

};

const condition = authUser => !!authUser;

const CreateCategoryPage = compose(
  withAuthorization(condition),
  withMyCategoriesRef
)(CreateCategoryPageBase);

export default CreateCategoryPage;

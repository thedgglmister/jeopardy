import React, { Component } from 'react';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import { AuthUserContext, withAuthorization } from '../Session';

class MyCategoriesList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      myCategories: [],
      loading: false,
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    const uid = this.props.authUser.uid;

    this.props.firebase.myCategories(uid).on('value', snapshot => {
      const categoriesObject = Object.assign({}, snapshot.val());

      const categoriesList = Object.keys(categoriesObject).map(categoryId => ({
        ...categoriesObject[categoryId],
        categoryId: categoryId,
      }));

      this.setState({
        myCategories: categoriesList,
        loading: false,
      });
    });
  }

  componentWillUnmount() {
    const uid = this.props.authUser.uid;
    this.props.firebase.myCategories(uid).off();
  }

  render() {
    const { myCategories, loading } = this.state;

    return (
      <div>
        <h1>My Categories</h1>
        {loading && <div>Loading ...</div>}
        <div>
          {myCategories.map(category => (
            <div key={category.categoryId}>
              <a name={category.categoryId} onClick={this.props.setCategoryIdInState}>
                {category.categoryName} {category.complete ? '' : '(Incomplete)'}
              </a>
            </div>
          ))}
          <div>
            <a onClick={this.props.setCategoryIdInState}>
              New Category
            </a>
          </div>
        </div>

      </div>
    );
  }
}




class EditCategoryForm extends Component {
  constructor(props) {
    super(props);

    this.INITIAL_STATE = {
      loading: false,
      categoryName: '',
      question1: '',
      question2: '',
      question3: '',
      question4: '',
      question5: '',
      answer1: '',
      answer2: '',
      answer3: '',
      answer4: '',
      answer5: '',
      error: null,
    };

    this.state = {
      ...this.INITIAL_STATE,
    };
  }

  componentDidMount() {
    this.updateFormWithCategoryData(this.props.categoryId);
  }

  componentDidUpdate(prevProps) {
    if (this.props.categoryId !== prevProps.categoryId) {
      this.updateFormWithCategoryData(this.props.categoryId);
    }
  }

  updateFormWithCategoryData(categoryId) {
    this.setState({
      ...this.INITIAL_STATE,
      loading: true,
    });

    this.props.firebase.category(categoryId).once('value', snapshot => {

      const categoryObj = snapshot.val();
      const questionsObj = Object.assign({}, categoryObj.questions);
      const questionsList = Object.keys(questionsObj).map(questionId => ({
        ...questionsObj[questionId],
        questionId: questionId,
      }));
      questionsList.sort((questionObj1, questionObj2) => questionObj1.value - questionObj2.value);

      this.setState({
        loading: false,
        categoryName: categoryObj.categoryName ? categoryObj.categoryName : '',
        question1: questionsList[0].question,
        question2: questionsList[1].question,
        question3: questionsList[2].question,
        question4: questionsList[3].question,
        question5: questionsList[4].question,
        answer1: questionsList[0].answer,
        answer2: questionsList[1].answer,
        answer3: questionsList[2].answer,
        answer4: questionsList[3].answer,
        answer5: questionsList[4].answer,
      });

    });
  }

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onSubmit = (event) => {
    const {
      categoryName,
      question1,
      question2,
      question3,
      question4,
      question5,
      answer1,
      answer2,
      answer3,
      answer4,
      answer5 } = this.state;

    const categoryUpdateObj = {
      complete: !(!categoryName || !question1 || !question2 || !question3 ||
                  !question4 || !question5 || !answer1 || !answer2 ||
                  !answer3 || !answer4 || !answer5),
      lastModified: new Date().toISOString(),
      categoryName: categoryName,
    };



    console.log(categoryUpdateObj);

    const questions = [
      {question: question1, answer: answer1, value: 200},
      {question: question2, answer: answer2, value: 400},
      {question: question3, answer: answer3, value: 600},
      {question: question4, answer: answer4, value: 800},
      {question: question5, answer: answer5, value: 1000},
    ];

    this.props.firebase
      .createCategory(categoryObj, questions)
      .then((newCategoryRef) => {
        console.log(554);
        console.log(newCategoryRef.key);
        console.log(categoryObj.complete);
        // if (categoryObj.complete) {
          this.setState({ ...this.INITIAL_STATE });
        // }
        // else {
        //   this.props.setCategoryIdInState(newCategoryRef.key);
        // }
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  render() {
    const {
      loading,
      error,
      categoryName,
      question1,
      question2,
      question3,
      question4,
      question5,
      answer1,
      answer2,
      answer3,
      answer4,
      answer5 } = this.state;

    const isInvalid = false;

    return (
      <form onSubmit={this.onSubmit}>
        <input
          name="categoryName"
          value={categoryName ? categoryName : ''}
          onChange={this.onChange}
          type="text"
          placeholder="Category Name"
        />
        <input
          name="question1"
          value={question1 ? question1 : ''}
          onChange={this.onChange}
          type="text"
          placeholder="Question 1"
        />
        <input
          name="answer1"
          value={answer1 ? answer1 : ''}
          onChange={this.onChange}
          type="text"
          placeholder="Answer 1"
        />
        <input
          name="question2"
          value={question2 ? question2 : ''}
          onChange={this.onChange}
          type="text"
          placeholder="Question 2"
        />
        <input
          name="answer2"
          value={answer2 ? answer2 : ''}
          onChange={this.onChange}
          type="text"
          placeholder="Answer 2"
        />
        <input
          name="question3"
          value={question3 ? question3 : ''}
          onChange={this.onChange}
          type="text"
          placeholder="Question 3"
        />
        <input
          name="answer3"
          value={answer3 ? answer3 : ''}
          onChange={this.onChange}
          type="text"
          placeholder="Answer 3"
        />
        <input
          name="question4"
          value={question4 ? question4 : ''}
          onChange={this.onChange}
          type="text"
          placeholder="Question 4"
        />
        <input
          name="answer4"
          value={answer4 ? answer4 : ''}
          onChange={this.onChange}
          type="text"
          placeholder="Answer 4"
        />
        <input
          name="question5"
          value={question5 ? question5 : ''}
          onChange={this.onChange}
          type="text"
          placeholder="Question 5"
        />
        <input
          name="answer5"
          value={answer5 ? answer5 : ''}
          onChange={this.onChange}
          type="text"
          placeholder="Answer 5"
        />

        <button disabled={isInvalid} type="submit">
          Save Category
        </button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }

}



class CreateCategoryForm extends Component {
  constructor(props) {
    super(props);

    this.INITIAL_STATE = {
      categoryName: '',
      question1: '',
      question2: '',
      question3: '',
      question4: '',
      question5: '',
      answer1: '',
      answer2: '',
      answer3: '',
      answer4: '',
      answer5: '',
      error: null,
    };

    this.state = {
      ...this.INITIAL_STATE,
    };
  }

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onSubmit = (event) => {
    const {
      categoryName,
      question1,
      question2,
      question3,
      question4,
      question5,
      answer1,
      answer2,
      answer3,
      answer4,
      answer5 } = this.state;

    const categoryObj = {
      complete: !(!categoryName || !question1 || !question2 || !question3 ||
                  !question4 || !question5 || !answer1 || !answer2 ||
                  !answer3 || !answer4 || !answer5),
      creatorUid: this.props.authUser.uid,
      createdDate: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      categoryName: categoryName,
    };

    console.log(categoryObj);

    const questions = [
      {question: question1, answer: answer1, value: 200},
      {question: question2, answer: answer2, value: 400},
      {question: question3, answer: answer3, value: 600},
      {question: question4, answer: answer4, value: 800},
      {question: question5, answer: answer5, value: 1000},
    ];

    this.props.firebase
      .createCategory(categoryObj, questions)
      .then((newCategoryRef) => {
        console.log(554);
        console.log(newCategoryRef.key);
        console.log(categoryObj.complete);
        // if (categoryObj.complete) {
          this.setState({ ...this.INITIAL_STATE });
        // }
        // else {
        //   this.props.setCategoryIdInState(newCategoryRef.key);
        // }
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  render() {
    const {
      loading,
      error,
      categoryName,
      question1,
      question2,
      question3,
      question4,
      question5,
      answer1,
      answer2,
      answer3,
      answer4,
      answer5 } = this.state;

      const isInvalid = !categoryName;

    return (
      <form onSubmit={this.onSubmit}>
        <input
          name="categoryName"
          value={categoryName ? categoryName : ''}
          onChange={this.onChange}
          type="text"
          placeholder="Category Name"
        />
        <input
          name="question1"
          value={question1 ? question1 : ''}
          onChange={this.onChange}
          type="text"
          placeholder="Question 1"
        />
        <input
          name="answer1"
          value={answer1 ? answer1 : ''}
          onChange={this.onChange}
          type="text"
          placeholder="Answer 1"
        />
        <input
          name="question2"
          value={question2 ? question2 : ''}
          onChange={this.onChange}
          type="text"
          placeholder="Question 2"
        />
        <input
          name="answer2"
          value={answer2 ? answer2 : ''}
          onChange={this.onChange}
          type="text"
          placeholder="Answer 2"
        />
        <input
          name="question3"
          value={question3 ? question3 : ''}
          onChange={this.onChange}
          type="text"
          placeholder="Question 3"
        />
        <input
          name="answer3"
          value={answer3 ? answer3 : ''}
          onChange={this.onChange}
          type="text"
          placeholder="Answer 3"
        />
        <input
          name="question4"
          value={question4 ? question4 : ''}
          onChange={this.onChange}
          type="text"
          placeholder="Question 4"
        />
        <input
          name="answer4"
          value={answer4 ? answer4 : ''}
          onChange={this.onChange}
          type="text"
          placeholder="Answer 4"
        />
        <input
          name="question5"
          value={question5 ? question5 : ''}
          onChange={this.onChange}
          type="text"
          placeholder="Question 5"
        />
        <input
          name="answer5"
          value={answer5 ? answer5 : ''}
          onChange={this.onChange}
          type="text"
          placeholder="Answer 5"
        />

        <button disabled={isInvalid} type="submit">
          Save Category
        </button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }

}






class CreateCategoryPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      categoryId: null,
    };

  }

  setCategoryIdInState = (event) => {
    const categoryId = event.target.name;
    this.setState({
      categoryId: categoryId,
    });

    event.preventDefault();
  }

  render() {
    const { categoryId } = this.state;

    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <div>
            <h1>{categoryId ? 'Edit' : 'Create'} Category</h1>
            <MyCategoriesList authUser={authUser}
                              firebase={this.props.firebase}
                              setCategoryIdInState={this.setCategoryIdInState} />
            {categoryId ? (
              <EditCategoryForm authUser={authUser}
                                firebase={this.props.firebase}
                                categoryId={categoryId} />
            ) : (
              <CreateCategoryForm authUser={authUser}
                                  firebase={this.props.firebase} />
            )}
          </div>
        )}
      </AuthUserContext.Consumer>
    );
  }

};

const condition = authUser => !!authUser;

export default compose(
  withAuthorization(condition),
  withFirebase,
)(CreateCategoryPage);

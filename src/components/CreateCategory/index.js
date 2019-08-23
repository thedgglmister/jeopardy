import React, { Component } from 'react';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import { AuthUserContext, withAuthorization } from '../Session';
import MyCategoriesList from './myCategoriesList';
import CategoryForm from './categoryForm';




class CreateCategoryPageBase extends Component {

  constructor(props) {
    super(props);
    console.log('constr');

    this.state = {
      myCategories: [],
      currentCategoryId: null,
      loading: false,
    };

    this.setCurrentCategoryId = this.setCurrentCategoryId.bind(this);
    this.resetAfterSubmit = this.resetAfterSubmit.bind(this);

  }

  componentDidMount() {
    this.setState({ loading: true });
    console.log(332);
    console.log(this.props.authUser);

    const uid = this.props.authUser.uid;

    this.props.firebase.myCategories(uid).on('value', snapshot => {
      console.log(snapshot.val());
      const categoriesObject = Object.assign({}, snapshot.val());

      const categoriesList = Object.keys(categoriesObject).map(categoryId => ({
        ...categoriesObject[categoryId],
        categoryId: categoryId,
      }));

      console.log(categoriesList);

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

  setCurrentCategoryId(event) {
    console.log(93);
    this.setState({
      currentCategoryId: event.currentTarget.getAttribute("name"),
    });
    console.log(event.currentTarget.getAttribute("name"));
  }

  resetAfterSubmit() {
    console.log(77772);
    this.setState({
      currentCategoryId: null,
    });
  }

  newCategory = () => {
    return {
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
    const { myCategories, currentCategoryId, loading } = this.state;
    console.log(currentCategoryId);


    const matchingCategory = myCategories.find((category) => (category.categoryId == currentCategoryId));
    const currentCategory = matchingCategory ? matchingCategory : this.newCategory();
    console.log(matchingCategory);
    console.log(currentCategory);


    console.log(78);
    console.log(myCategories);

    return (
      <div>

          <CategoryForm category={currentCategory}
                        authUser={this.props.authUser}
                        resetAfterSubmit={this.resetAfterSubmit}/>
          <MyCategoriesList myCategories={myCategories}
                          loading={loading}
                          setCurrentCategoryId={this.setCurrentCategoryId} />

          ***currentGameId stored on user, so if it has an id we can grab all data for it.***

          new game button inserts a new game (and fetchs questions? or wait until game starts? i think wait)
          then use that gameid to give three links
          one for the tv screen, which anyone can go to and will always see same the same state (need a screen ref?)
          one for the host, which can only have one at a time. host can "Stop Hosting" which nulls out host data, and allows someone else to host. only need to worry about tracking which categories they've seen. whenever a host is added, check if the game has a status of in progress, and mark it as played. and then also when it becomes in progress, set the current host to having played. same with player? no. whenever the host or one of the three players in null, the tv says "Waiting for Host... Waiting for Player 1".
          one for the players. they choose a slot, 1, 2, or 3 depending on what is still available in the ref. can leave but only when the game has status of 'initiated'.

          only thing i need to wory about is if there are people spectators, how to mark the questions as seen. need a link from gameId that they can go to which takes them to the app and then gets their authUser and marks the game as seen. need to advertise that somehow. can i do a scan code on the question screen?

          add qr codes in addition to links. https://gist.github.com/gene1wood/51b8dccb2ea13c1103d6b4e4f37c9966
          players just scan next to "Waiting for Player 1", etc.
          And spectators can scan to say theyve seen it.

          The fun of it is that the questions don't need to be jeopardy style. no stress to make 'good' questions. just try to make some that aren't too obscure.

          Also need a way to submit final jeopardy questions and categories.

          the screen should light up when you can buzz in, or count down or something with lights. but need to keep phone turn on perfectly in sync with it. how?
          what i need to do when a question is chosen is this. put question on screen, if there's max of half second potential delay, which maybe is a large asuumption?, then it calculates from the time the question went live how long it needs to go for, so that they all match exactly. they learn what time they should change state from firebase, but the client side ensures that they go off at that time. that way the screen can light up as well
          is this the only issue where timing is crucial? also, look up how others do it.
          https://jsfiddle.net/48ue2hsb/4/


          need to put something firebase on the internet and try on two devices how much delay there is. try with me and justine.

          https://firebase.google.com/docs/database/web/read-and-write#save_data_as_transactions (if this is about blocking, need ot do it when taking positions in a game, and for buzzer, or whatever)

          the board screen shows the links and qr codes if there arent four people. otherwise, it shows "waiting for host...", and then when host clicks ready and sets state to active, it turns to actual board. whenever there isn't 4 people, it sets state to inactive and goes back to links screen.
      </div>
    );
  }

};











const condition = authUser => !!authUser;

const CreateCategoryPage = compose(
  withAuthorization(condition),
  withFirebase,
)(CreateCategoryPageBase);

export default CreateCategoryPage;

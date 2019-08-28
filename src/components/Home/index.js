import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { withAuthorization } from '../Session';
import * as ROUTES from '../../constants/routes';
import { NewGameButton, ResumeGameButton, ToBoardButton } from '../StartGame';



class HomePage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    }
  }

  componentDidMount() {
    const { uid } = this.props.authUser;

    this.userRef = this.props.firebase.user(uid);
    this.userRef.on('value', (snapshot) => {
      const user = snapshot.val();

      this.setState({
        loading: false,
        currentGame: user.currentGame,
      });
    });
  }

  componentWillUnmount() {
    this.userRef.off();
  }

  render() {
    const { loading, currentGame } = this.state;
    return (
      <div>
        <h1>Home</h1>
        {!loading && currentGame && <ResumeGameButton currentGame={currentGame} />}
        {!loading && currentGame && <ToBoardButton currentGame={currentGame} />}

        {!loading && !currentGame && <NewGameButton />}
        <Link to={ROUTES.CREATE_CATEGORY}>Create Categories</Link>

      </div>
    );
  }
};

const condition = authUser => !!authUser;

export default withAuthorization(condition)(HomePage);

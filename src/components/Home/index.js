import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { withAuthorization } from '../Session';
import * as ROUTES from '../../constants/routes';
import { NewGameButton } from '../StartGame';


class HomePage extends Component {

  render() {
    return (
      <div>
        <h1>Home</h1>
        <p>The Home Page is accessible by every signed in user.</p>
        <NewGameButton />
        <Link to={ROUTES.CREATE_CATEGORY}>Create Categories</Link>

      </div>
    );
  }
};

const condition = authUser => !!authUser;

export default withAuthorization(condition)(HomePage);

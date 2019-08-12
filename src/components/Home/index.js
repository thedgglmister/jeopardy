import React from 'react';
import { Link } from 'react-router-dom';

import { withAuthorization } from '../Session';
import * as ROUTES from '../../constants/routes';

const HomePage = () => (
  <div>
    <h1>Home</h1>
    <p>The Home Page is accessible by every signed in user.</p>
    <Link to={ROUTES.CREATE_CATEGORY}>Create Categories</Link>
  </div>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(HomePage);

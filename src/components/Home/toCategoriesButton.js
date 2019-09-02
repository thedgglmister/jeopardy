import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import * as ROUTES from '../../constants/routes';

class ToCategoriesButton extends Component {
  render() {
    return (
      <Link to={ROUTES.CREATE_CATEGORY}>
        Create Categories
      </Link>
    );
  }
};

export default ToCategoriesButton;

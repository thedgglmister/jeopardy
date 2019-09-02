import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class ToBoardButton extends Component {
  render() {

    const { gameId } = this.props;

    return (
      <Link to={`/board/${gameId}`}>
        To Board
      </Link>
    );
  }
};

export default ToBoardButton;

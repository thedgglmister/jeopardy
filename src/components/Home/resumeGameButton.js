import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class ResumeGameButton extends Component {

  render() {

    const { role, gameId } = this.props;

    return (
      <Link to={role == 'host' ? `/host/${gameId}` : `/player/${role}/${gameId}`}>
        {role == 'host' ? 'Resume Hosting' : 'Resume Playing'}
      </Link>
    );
  }

};

export default ResumeGameButton;

import React, { Component } from 'react';

import JoinGameLink from './joinGameLink';

class JoinGameLinksList extends Component {

  render() {
    const { gameId, host, p1, p2, p3 } = this.props.game;

    return (
      <div>
        {!host && <JoinGameLink path={`/join/host/${gameId}`} text="Become Host" />}
        {!p1 && <JoinGameLink path={`/join/p1/${gameId}`} text="Become Player 1" />}
        {!p2 && <JoinGameLink path={`/join/p2/${gameId}`} text="Become Player 2" />}
        {!p3 && <JoinGameLink path={`/join/p3/${gameId}`} text="Become Player 3" />}
      </div>
    );
  }
}

export default JoinGameLinksList;

import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
// import QRCode from 'qrcode';


import JoinGameLink from './joinGameLink';

class StartGameLinks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...this.props.game,
    };
  }

  //need to handle updates
  componentDidUpdate(prevProps) {
    console.log(866);
    if (prevProps.game != this.props.game) {
      const newState = Object.assign({
          gameStatus: null,
          host: null,
          p1: null,
          p2: null,
          p3: null,
        },
        this.props.game
      );

      this.setState(newState);
    }
  }

  render() {
    console.log(190);
    const { gameId, host, p1, p2, p3 } = this.state;

    return (
      <div>
        {!host && <JoinGameLink path={`/game/${gameId}/host`} text="Become Host" />}
        {!p1 && <JoinGameLink path={`/game/${gameId}/p1`} text="Become Player 1" />}
        {!p2 && <JoinGameLink path={`/game/${gameId}/p2`} text="Become Player 2" />}
        {!p3 && <JoinGameLink path={`/game/${gameId}/p3`} text="Become Player 3" />}
        {host && p1 && p2 && p3 && <h1>Waiting for host to start the game...</h1>}

      </div>
    );
  }
}

export default StartGameLinks;

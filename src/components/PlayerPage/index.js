import React, { Component } from 'react';
import { compose } from 'recompose';


import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';


class PlayerPageBase extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };
  }


  componentDidMount() {

    const gameId = this.props.match.params.gameId;

    const gameRef = this.props.firebase.game(gameId);
    gameRef.on('value', (snapshot) => {
      const game = Object.assign({gameId: gameId}, snapshot.val());
      let errorMsg = null;
      const { gameStatus, host, p1, p2, p3 } = game;
      if (!gameStatus) {
        errorMsg = "I think you're in the wrong place";
      }
      else if (gameStatus == 'Finished') {
        errorMsg = "This game has already finished";
      }
    //   else if (!host) {
    //     gameRef.update({
    //       host: this.props.authUser.uid
    //     })
    //       .catch((error) => {
    //         this.setState({
    //           loading: false,
    //           errorMsg: error.message ? error.message : "Something went wrong",
    //         });
    //       });
    //     return;
    //   }
    //   else if (host != this.props.authUser.uid) {
    //     errorMsg = "This game already has a host";
    //   }
    //   else if (gameStatus == "New" && !(p1 && p2 && p3)) {
    //     errorMsg = "Waiting for players to join...";
    //   }
    //
    //   this.setState({
    //     loading: !host && !errorMsg,
    //     errorMsg: errorMsg,
    //     game: game,
    //   });
    // });
  }

  componentWillUnmount() {
    const gameId = this.props.match.params.gameId;
    this.props.firebase.game(gameId).off();
  }

  render() {
    const { loading, errorMsg, game } = this.state;
    return (
      <div>
        {loading && <h1>Loading...</h1>}
        {!loading && errorMsg && <h1>{errorMsg}</h1>}
        // {!loading && !errorMsg && game.gameStatus == 'New' && <h1>Start Game Button</h1>} //need to handle update within these (maybe not this one. depends on what is in its state. nothing?)
        // {!loading && !errorMsg && game.gameStatus == 'Active' && <h1>ActiveHostScreen</h1>} //need to handle update within these
      </div>
    );
  }
};

const condition = authUser => !!authUser;


const HostPage = compose(
  withAuthorization(condition),
  withFirebase,
)(HostPageBase);

export default HostPage;

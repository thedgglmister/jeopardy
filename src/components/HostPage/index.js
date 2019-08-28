import React, { Component } from 'react';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';

import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';
import StopHostingButton from './stopHostingButton';
import * as ROUTES from '../../constants/routes';




class HostPageBase extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };

    this.stopHosting = this.stopHosting.bind(this);
  }


  componentDidMount() {

    const gameId = this.props.match.params.gameId;

    this.gameRef = this.props.firebase.game(gameId);
    this.gameRef.on('value', (snapshot) => {
      console.log(123);

      const game = Object.assign({gameId: gameId}, snapshot.val());
      console.log(game);
      let errorMsg = null;
      let waiting = false;
      const { gameStatus, host, p1, p2, p3 } = game;
      if (!gameStatus) {
        errorMsg = "I think you're in the wrong place";
      }
      else if (gameStatus == 'Finished') {
        errorMsg = "This game has already finished";
      }
      else if (!host) {
        this.props.firebase.startHosting(gameId, this.props.authUser.uid)
          .catch((error) => {
            this.setState({
              loading: false,
              errorMsg: error.message ? error.message : "Something went wrong",
            });
          });
        return;
      }
      else if (host.uid != this.props.authUser.uid) {
        errorMsg = "This game already has a host";
      }
      else if (gameStatus == "New" && !(p1 && p2 && p3)) {
        waiting = true;
      }

      this.setState({
        loading: !host && !errorMsg,
        errorMsg: errorMsg,
        game: game,
        waiting: waiting,
      });
    });
  }

  componentWillUnmount() {
    this.gameRef.off();
  }

  stopHosting() {
    this.gameRef.off();
    const { gameId } = this.props.match.params;
    const { uid } = this.props.authUser;
     this.props.firebase.stopHosting(gameId, uid)
      .then(() => {
        this.props.history.push(ROUTES.HOME);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const { loading, errorMsg, game, waiting } = this.state;
    return (
      <div>
        {loading && <h1>Loading...</h1>}
        {!loading && errorMsg && <h1>{errorMsg}</h1>}
        {!loading && !errorMsg && waiting && <h1>Waiting for players to join...</h1>}
        {!loading && !errorMsg && <StopHostingButton onClick={this.stopHosting} />}
      </div>
    );
    //{!loading && !errorMsg && !waiting && game.gameStatus == 'New' && <StartGameButton />} //need to handle update within these (maybe not this one. depends on what is in its state. nothing?)
    //{!loading && !errorMsg && !waiting && game.gameStatus == 'Active' && <ActiveHostScreen />} //need to handle update within these
  }
};

const condition = authUser => !!authUser;


const HostPage = compose(
  withAuthorization(condition),
  withFirebase,
  withRouter,
)(HostPageBase);

export default HostPage;

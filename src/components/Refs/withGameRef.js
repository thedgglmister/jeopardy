import React from 'react';

import LoadingScreen from '../Loading';
import { withFirebase } from '../Firebase';




const withGameRef = (Component) => {

  class WithGameRef extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        loading: true,
      }
    }

    componentDidMount() {
      const { gameId } = this.props.match.params;
      const { firebase } = this.props;
      this.gameRef = firebase.game(gameId)
      this.gameRef.on('value', (snapshot) => {
        const game = Object.assign({gameId: gameId}, snapshot.val());
        this.setState({
          loading: false,
          game: game,
        });
      });
    }

    componentWillUnmount() {
      this.gameRef.off();
    }

    render() {
      const { loading, game } = this.state;
      return (
        <div>
          {loading && <LoadingScreen />}
          {!loading && <Component {...this.props} game={game} />}
        </div>
      );
    }
  }

  return withFirebase(WithGameRef);
};

export default withGameRef;

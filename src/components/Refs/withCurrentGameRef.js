import React from 'react';
import { compose } from 'recompose';

import LoadingScreen from '../Loading';
import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';



const withCurrentGameRef = (Component) => {

  class WithCurrentGameRef extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        loading: true,
      }
    }

    componentDidMount() {
      const { uid } = this.props.authUser;
      const { firebase } = this.props;
      this.currentGameRef = firebase.currentGame(uid);
      this.currentGameRef.on('value', (snapshot) => {
        const currentGame = snapshot.val();
        this.setState({
          loading: false,
          currentGame: currentGame,
        });
      });
    }

    componentWillUnmount() {
      this.currentGameRef.off();
    }

    render() {
      const { loading, currentGame } = this.state;
      return (
        <div>
          {loading && <LoadingScreen />}
          {!loading && <Component {...this.props} currentGame={currentGame} />}
        </div>
      );
    }
  }

  const condition = authUser => !!authUser;
  return compose(
    withFirebase,
    withAuthorization(condition)
  )(WithCurrentGameRef);
};

export default withCurrentGameRef;

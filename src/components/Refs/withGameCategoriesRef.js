import React from 'react';

import LoadingScreen from '../Loading';
import { withFirebase } from '../Firebase';




const withGameCategoriesRef = (Component) => {

  class WithGameCategoriesRef extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        loading: true,
      }
    }

    componentDidMount() {
      const { gameId } = this.props.match.params;
      const { firebase } = this.props;
      this.gameCategoriesRef = firebase.gameCategories(gameId)
      this.gameCategoriesRef.on('value', (snapshot) => {
        const gameCategories = Object.assign({}, snapshot.val());
        this.setState({
          loading: false,
          gameCategories: gameCategories,
        });
      });
    }

    componentWillUnmount() {
      this.gameCategoriesRef.off();
    }

    render() {
      const { loading, gameCategories } = this.state;
      return (
        <div>
          {loading && <LoadingScreen />}
          {!loading && <Component {...this.props} gameCategories={gameCategories} />}
        </div>
      );
    }
  }

  return withFirebase(WithGameCategoriesRef);
};

export default withGameCategoriesRef;

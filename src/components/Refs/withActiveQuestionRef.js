import React from 'react';

import LoadingScreen from '../Loading';
import { withFirebase } from '../Firebase';


const withActiveQuestionRef = (Component) => {

  class WithActiveQuestionRef extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        loading: true,
      }
    }

    componentDidMount() {
      const { gameId } = this.props.match.params;
      const { firebase } = this.props;
      this.activeQuestionRef = firebase.activeQuestionByGame(gameId);
      this.activeQuestionRef.on('value', (snapshot) => {
        const activeQuestion = snapshot.val();
        this.setState({
          loading: false,
          activeQuestion: activeQuestion,
        });
      });
    }

    componentWillUnmount() {
      this.activeQuestionRef.off();
    }

    render() {
      const { loading, activeQuestion } = this.state;
      return (
        <div>
          {loading && <LoadingScreen />}
          {!loading && <Component {...this.props} activeQuestion={activeQuestion} />}
        </div>
      );
    }
  }

  return withFirebase(WithActiveQuestionRef);
};

export default withActiveQuestionRef;

import React from 'react';

import LoadingScreen from '../Loading';
import { withFirebase } from '../Firebase';


const withAnswersRef = (Component) => {

  class WithAnswersRef extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        loading: true,
      }
    }

    componentDidMount() {
      const { gameId } = this.props.match.params;
      const { firebase } = this.props;
      this.answersRef = firebase.answers(gameId);
      this.answersRef.on('value', (snapshot) => {
        const answers = snapshot.val();
        this.setState({
          loading: false,
          answers: answers,
        });
      });
    }

    componentWillUnmount() {
      this.answersRef.off();
    }

    render() {
      const { loading, answers } = this.state;
      return (
        <div>
          {loading && <LoadingScreen />}
          {!loading && <Component {...this.props} answers={answers} />}
        </div>
      );
    }
  }

  return withFirebase(WithAnswersRef);
};

export default withAnswersRef;

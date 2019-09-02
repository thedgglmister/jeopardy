import React, { Component } from 'react';

import { withFirebase } from '../Firebase';

class AllowBuzzesButtonBase extends Component {
  constructor(props) {
    super(props);

    this.allowBuzzes = this.allowBuzzes.bind(this);
  }

  allowBuzzes() {
    const { gameId } = this.props;
    const activeQuestionRef = this.props.firebase.activeQuestionByGame(gameId);
    activeQuestionRef.update({
      allowBuzzes: true,
    });
  }

  render() {
    return (
      <div>
        <button type="button" onClick={this.allowBuzzes}>
          Allow Buzzes
        </button>
      </div>
    );
  }
}
const AllowBuzzesButton = withFirebase(AllowBuzzesButtonBase);


export default AllowBuzzesButton;

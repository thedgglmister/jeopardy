import React, { Component } from 'react';

import PlayerBuzzInButton from './playerBuzzInButton';
import { withFirebase } from '../Firebase';


class ActivePlayerScreenBase extends Component {
  constructor(props) {
    super(props);

    this.buzzIn = this.buzzIn.bind(this);
  }

  buzzIn() {
    const { role, gameId, firebase } = this.props;
    const updates = {};
    updates['buzzeeRole'] = role;
    updates[`alreadyBuzzedStatuses/${role}`] = true;
    firebase.activeQuestionByGame(gameId).update(updates)
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const { gameId, role, activeQuestion } = this.props;
    const { buzzeeRole, allowBuzzes, alreadyBuzzedStatuses } = activeQuestion || {};
    const alreadyBuzzed = alreadyBuzzedStatuses && alreadyBuzzedStatuses[role];
    const anotherPlayerBuzzed = buzzeeRole;

    const disabled = !activeQuestion || alreadyBuzzed || !allowBuzzes || anotherPlayerBuzzed;

    return (
      <div>
        {<PlayerBuzzInButton disabled={disabled} onClick={this.buzzIn}/>}
      </div>
    );
  }
}
const ActivePlayerScreen = withFirebase(ActivePlayerScreenBase);

export default ActivePlayerScreen;

import React, { Component } from 'react';

class ScoreCards extends Component {
  render() {
    const { game, answers } = this.props;
    const { p1, p2, p3 } = game;

    const scores = { p1: 0, p2: 0, p3: 0};
    for (let answerId in answers) {
      console.log(332);

      let answer = answers[answerId];
      scores[answer.role] += answer.value;
    }

    return (
      <div style={{backgroundColor: '#00f'}}>
        P1: {scores.p1}
        <img style={{width: '200px'}} src={p1.base64Signature}/>
        P2: {scores.p2}
        <img src={p2.base64Signature}/>
        P3: {scores.p3}
        <img src={p3.base64Signature}/>

        make sure handle what happens if someone leaves game while active question, for example. need to handle timer, if any? if player quits and ends game, makre sure active question ref ettc all go away.

      </div>
    );
  }
}



export default ScoreCards;

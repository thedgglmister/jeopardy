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

    const scoreCardContainerStyle = {
      display: 'flex',
      backgroundColor: 'blue',
      borderTop: '4px solid black',
      height: 'calc(100vh - 48.2142vw)',
      boxSizing: 'border-box',
    };

    const scoreCardColumnStyle = {
      width: '33.33vw',
      borderLeft: '1px solid black',
      borderRight: '1px solid black',
      boxSizing: 'border-box',
    };

    const scoreContainerStyle = {
      color: '#fff',
      textAlign: 'center',
      padding: '4px',
      fontSize: '28px',
      fontWeight: '800',
      borderBottom: '1px solid black',
      boxSizing: 'border-box',
    };

    const signatureContainerStyle = {
    };

    const signatureStyle = {
      display: 'block',
      margin: 'auto',
      height: '80px',
      boxSizing: 'border-box',
    };


    return (
      <div className="score-card-container" style={scoreCardContainerStyle}>
        <div className="score-card-column" style={scoreCardColumnStyle}>
          <div className="score-container" style={scoreContainerStyle}>
            {scores.p1}
          </div>
          <div className="signature-container" style={signatureContainerStyle}>
            <img src={p1.base64Signature} style={signatureStyle}/>
          </div>
        </div>
        <div className="score-card-column" style={scoreCardColumnStyle}>
          <div className="score-container" style={scoreContainerStyle}>
            {scores.p2}
          </div>
          <div className="signature-container" style={signatureContainerStyle}>
            <img src={p2.base64Signature} style={signatureStyle}/>
          </div>
        </div>
        <div className="score-card-column" style={scoreCardColumnStyle}>
          <div className="score-container" style={scoreContainerStyle}>
            {scores.p3}
          </div>
          <div className="signature-container" style={signatureContainerStyle}>
            <img src={p3.base64Signature} style={signatureStyle}/>
          </div>
        </div>
      </div>
    );
  }
}



export default ScoreCards;

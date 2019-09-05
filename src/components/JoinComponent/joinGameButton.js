import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import SignatureCanvas from 'react-signature-canvas';

import { withFirebase } from '../Firebase';


class JoinGameButtonBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      signatureExists: false,
    };

    this.joinGame = this.joinGame.bind(this);
    this.handleCanvasChange = this.handleCanvasChange.bind(this);
    this.clearSignature = this.clearSignature.bind(this);
  }


  handleCanvasChange(event) {
    this.setState({
      signatureExists: true,
    });
    const base64Signature = this.signatureCanvas.toDataURL('image/png');
    console.log(base64Signature);
  }

  clearSignature() {
    this.signatureCanvas.clear();
    this.setState({
      signatureExists: false,
    });
  }

  joinGame() {
    const { gameId, role, uid } = this.props;

    const base64Signature = role == 'host' ? null : this.signatureCanvas.toDataURL('image/png');
    console.log(base64Signature);
    this.props.firebase.startPlaying(gameId, role, uid, base64Signature)
      .then(() => {
        this.props.history.push(role == 'host' ? `/host/${gameId}` : `/player/${role}/${gameId}`);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const { signatureExists } = this.state;
    const { role } = this.props;
    const disabled  = role != 'host' && !signatureExists;







    return (
      <div>
        {role != 'host' && <SignatureCanvas penColor='#fff'
                            ref={(signatureCanvas) => {
                              this.signatureCanvas = signatureCanvas
                            }}
                            onEnd={this.handleCanvasChange}
                            canvasProps={{width:600, height: 300, style: {border: '1px solid black', backgroundColor: '#00f' }, className: 'sigCanvas'}} />}
        {role != 'host' && <button type="button" disabled={!signatureExists} onClick={this.clearSignature}>Clear</button>}

        <button type="button" disabled={disabled} onClick={this.joinGame}>JOIN BUTTON</button>
        Put option to tell little stories about your self, so host can see them and ask you about them before game
      </div>
    );
  }
}

const JoinGameButton = compose (
  withFirebase,
  withRouter
)(JoinGameButtonBase);

export default JoinGameButton;

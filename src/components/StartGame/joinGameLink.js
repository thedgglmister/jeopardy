import React, { Component } from 'react';
import QRCode from 'qrcode';

class JoinGameLink extends Component {
  componentDidMount() {
    QRCode.toCanvas(
      this.myCanvas,
      `${window.location.origin}${this.props.path}`,
      //this causes null errors?
      // (error) => {
      //   console.error(error);
      // }
    );
  }

  render() {
    return (
      <div>
        <h1>{this.props.text}</h1>
        <canvas ref={(canvas) => {
          this.myCanvas = canvas;
        }} />
      </div>
    );
  }
};

export default JoinGameLink;

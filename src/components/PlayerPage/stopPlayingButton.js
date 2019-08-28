import React, {Component} from 'react';


class StopPlayingButton extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <button type="button" onClick={this.props.onClick}>
        Stop Playing
      </button>
    );
  }
}

export default StopPlayingButton;

import React, {Component} from 'react';


class StopHostingButton extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <button type="button" onClick={this.props.onClick}>
        Stop Hosting
      </button>
    );
  }
}

export default StopHostingButton;

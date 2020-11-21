import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import styled from "styled-components";


const Wrapper = styled.div`
  height: calc(100%);
  width: 100vw;

  > video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

class _Scanner extends Component {
  constructor(props) {
    super(props);
    this.videoRef = React.createRef();
  }

  componentDidMount() {
    this._startScanner();
  }

  _startScanner = () => {
    this.props.appStore.initializeScanner(this.videoRef)
  };

  render() {
    return (
      <React.Fragment>
        <Wrapper>
          <video ref={this.videoRef} playsInline />
        </Wrapper>
      </React.Fragment>
    );
  }
}

const Scanner = inject("appStore")(observer(_Scanner));

export default Scanner;

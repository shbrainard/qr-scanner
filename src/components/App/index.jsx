import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import styled from "styled-components";

import GenotypeModal from "./../GenotypeModal"
import LookupAssemblyModal from "./../LookupAssemblyModal"
import ModeIndicator from "./../ModeIndicator"
import Queue from "./../Queue";
import Scanner from "./../Scanner";
import Settings from "./../Settings";

const AppWrapper = styled.div`
  height: ${window.innerHeight}px;
  width: 100vw;
  overflow: hidden;
  position: relative;
`;

class _App extends Component {
  render() {
    return (
      <AppWrapper>
        <ModeIndicator />
        <Scanner />
        <Settings />
        <Queue />
        <LookupAssemblyModal />
        <GenotypeModal />
      </AppWrapper>
    );
  }
}

const App = inject("appStore")(observer(_App));

export default App;

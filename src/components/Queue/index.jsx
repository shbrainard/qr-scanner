import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Button } from "semantic-ui-react";
import styled from "styled-components";

import QueueModal from "./QueueModal";

const QueueWrapper = styled.div`
  background: transparent;
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 1rem;
`;

const QueueButton = styled(Button)`
  margin-right: 0px !important;
`;

class _Queue extends Component {
  _openQueueModal = () => {
    this.props.appStore.openQueueModal();
  };

  render() {
    return (
      <React.Fragment>
        <QueueWrapper>
          <QueueButton
            icon="inbox"
            data-testid="queue-button"
            onClick={this._openQueueModal}
            size="massive"
            color="green"
          />
        </QueueWrapper>
        <QueueModal />
      </React.Fragment>
    );
  }
}

const Queue = inject("appStore")(observer(_Queue));

export default Queue;

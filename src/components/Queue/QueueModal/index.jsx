import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Button, Modal } from "semantic-ui-react";
import styled from "styled-components";

import QueueFeedback from "./QueueFeedback";
import ScannedCodes from "./ScannedCodes";

const ActionWrapper = styled.div`
  display: flex;
  margin-bottom: 1rem;
`;

const Flexer = styled.div`
  flex: 1;
`;

class _QueueModal extends Component {
  _closeModal = () => {
    this.props.appStore.closeQueueModal();
  };

  _clearQueue = () => {
    this.props.appStore.clearQueue();
  };

  _proceed = () => {
    this.props.appStore.nextOrSave();
  }

  render() {
    const { appStore } = this.props;
    return (
      <Modal open={appStore.showQueueModal} data-testid="queue-modal">
        <Modal.Header>Scan Queue</Modal.Header>
        <Modal.Content>
          <QueueFeedback />
          <ScannedCodes />
        </Modal.Content>
        <Modal.Actions>
          <ActionWrapper>
            <Button
              onClick={this._closeModal}
              data-testid="queue-modal-close-button"
            >
              close
            </Button>
            <Flexer />
            <Button
              onClick={this._clearQueue}
              color="red"
              data-testid="queue-modal-discard-button"
              disabled={appStore.discardButtonDisabled}
            >
              discard
            </Button>
            <Button
              onClick={this._proceed}
              color="green"
              data-testid="queue-modal-confirm-button"
              content={appStore.saveButtonText}
              loading={appStore.isLoading}
            />
          </ActionWrapper>
        </Modal.Actions>
      </Modal>
    );
  }
}

const QueueModal = inject("appStore")(observer(_QueueModal));

export default QueueModal;

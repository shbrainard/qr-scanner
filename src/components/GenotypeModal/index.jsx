import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Button, Message, Modal } from "semantic-ui-react";

class _GenotypeModal extends Component {
  _closeModal = () => {
    this.props.appStore.closeGenotypeModal();
  };

  render() {
    const { appStore } = this.props;
    return (
      <Modal open={appStore.showGenotypeModal} data-testid="genotype-modal">
        <Modal.Header>Genotype of scanned pot number</Modal.Header>
        <Modal.Content>
          {!appStore.errorMessage ? (
            <React.Fragment>
              <h4>pot: {appStore.scannedGenotype.POT}</h4>
              <h2>genotype: {appStore.scannedGenotype.GENOTYPE}</h2>
            </React.Fragment>
          ) : (
            <Message
              color="red"
              icon="times circle outline"
              content={appStore.errorMessage}
            />
          )}
        </Modal.Content>
        <Modal.Actions>
          <Button
            onClick={this._closeModal}
            data-testid="genotype-modal-close-button"
            color="blue"
          >
            close
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

const GenotypeModal = inject("appStore")(observer(_GenotypeModal));

export default GenotypeModal;

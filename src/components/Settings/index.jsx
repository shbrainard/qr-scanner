import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Button, Dropdown, Header, Modal } from "semantic-ui-react";
import styled from "styled-components";

const SettingsWrapper = styled.div`
  background: transparent;
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 1rem;
`;

class _Settings extends Component {
  _toggleSettingsModal = () => {
    this.props.appStore.toggleSettingsModal();
  };

  _setActiveModeName = (e, { value }) => {
    this.props.appStore.setActiveMode(value);
  };

  _setCamera = (e, { value }) => {
    this.props.appStore.changeCamera(value);
  };

  render() {
    const { appStore } = this.props;
    // const modeOptions = appStore.modes.map(mode => {
    //   return { text: mode.name, value: mode.name };
    // });
    const cameraOptions = appStore.cameras.map(camera => {
      return { text: camera.name, value: camera.id };
    });

    return (
      <React.Fragment>
        <SettingsWrapper>
          <Button
            icon="setting"
            data-testid="settings-button"
            onClick={this._toggleSettingsModal}
            size="massive"
            color="pink"
          />
        </SettingsWrapper>
        <Modal open={appStore.showSettingsModal} data-testid="settings-modal">
          <Modal.Header>Settings</Modal.Header>
          <Modal.Content>
            <Header as="h3">After Scanning...</Header>
            <Button.Group>
              <Button
                icon="save"
                content="save"
                active={appStore.afterScanning === "save"}
                onClick={() => appStore.toggleAfterScanning()}
              />
              <Button
                icon="eye"
                content="see"
                active={appStore.afterScanning === "see"}
                onClick={() => appStore.toggleAfterScanning()}
              />
            </Button.Group>
            <Header as="h3">Mode</Header>
            <Button.Group>
              {appStore.modes.map((mode, index) => {
                return (
                  <Button
                    key={`mode-${index}`}
                    active={mode.name === appStore.activeMode.name}
                    onClick={() => appStore.setActiveMode(mode.name)}
                    data-testid="mode-switch-button"
                  >
                    {mode.name}
                  </Button>
                );
              })}
            </Button.Group>
            <Header as="h3">Number of crosses</Header>
            <Button.Group>
              {appStore.crosses.map((cross, index) => {
                return (
                  <Button
                    key={`cross-${cross}`}
                    active={cross === appStore.numberOfCrosses}
                    onClick={() => appStore.setNumberOfCrosses(cross)}
                    data-testid="crosses-switch-button"
                  >
                    {cross}
                  </Button>
                );
              })}
            </Button.Group>
            <Header as="h3">Camera</Header>
            {appStore.cameras.length ? (
              <Dropdown
                data-testid="camera-select"
                options={cameraOptions}
                selection
                fluid
                onChange={this._setCamera}
                value={appStore.activeCamera ? appStore.activeCamera.id : ""}
                text={appStore.activeCamera ? appStore.activeCamera.name : ""}
              />
            ) : (
              <p>No cameras... is the site loaded via https?</p>
            )}
          </Modal.Content>
          <Modal.Actions>
            <Button
              primary
              onClick={this._toggleSettingsModal}
              data-testid="settings-modal-save"
            >
              ok
            </Button>
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}

const Settings = inject("appStore")(observer(_Settings));

export default Settings;

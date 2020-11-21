import React from "react";
import { inject, observer } from "mobx-react";
import { Button, Message, Modal } from "semantic-ui-react";

const _LookupAssemblyModal = ({ appStore }) => {
  const carrots = [...Array((appStore.lookupAssemblyCounter % 5) + 1).keys()];
  return (
    <Modal open={appStore.isBuildingLookup} data-testid="lookup-assembly-modal">
      <Modal.Header>Building lookup table...</Modal.Header>
      <Modal.Content>
        {appStore.lookupAssemblyError ? (
          <Message color="red" data-testid="lookup-error-message">
            Could not assemble lookup table!
          </Message>
        ) : (
          <React.Fragment>
            {carrots.map((carrot, index) => (
              <span
                key={`${index}-carrot`}
                role="img"
                aria-label="carrot"
                data-testid="carrot"
              >
                🥕{" "}
              </span>
            ))}
          </React.Fragment>
        )}
      </Modal.Content>
      {appStore.lookupAssemblyError ? (
        <Modal.Actions>
          <Button
            primary
            onClick={() => appStore.assembleLookupForMode()}
            data-testid="lookup-error-retry-button"
          >
            retry
          </Button>
        </Modal.Actions>
      ) : null}
    </Modal>
  );
};

const LookupAssemblyModal = inject("appStore")(observer(_LookupAssemblyModal));

export default LookupAssemblyModal;

import React from "react";
import { inject, observer } from "mobx-react";
import { Message } from "semantic-ui-react";

const _QueueFeedback = ({ appStore }) => {
  const { errorMessage, successMessage } = appStore;

  return (
    <div>
      {errorMessage ? (
        <Message
          color="red"
          icon="times circle outline"
          content={errorMessage}
          data-testid="queue-feedback-error"
        />
      ) : null}
      {successMessage ? (
        <Message
          color="green"
          icon="check circle outline"
          content={successMessage}
          data-testid="queue-feedback-success"
        />
      ) : null}
    </div>
  );
};

const QueueFeedback = inject("appStore")(observer(_QueueFeedback));

export default QueueFeedback;

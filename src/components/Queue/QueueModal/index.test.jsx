import React from "react";
import { observable, configure } from "mobx";
import { Provider } from "mobx-react";

import {
  render,
  cleanup,
  fireEvent,
  waitForElement
} from "react-testing-library";

import { MODES } from "./../../../constants";

import QueueModal from "./index";

let mockAppStore;

beforeEach(() => {
  configure({ enforceActions: "never" });

  mockAppStore = observable({
    showQueueModal: false,
    cameras: [],
    openQueueModal: jest.fn(),
    closeQueueModal: jest.fn(),
    clearQueue: jest.fn(),
    scannedCodes: [],
    modes: MODES,
    activeModeName: MODES[0].name,
    activeMode: MODES[0],
    nextOrSave: jest.fn()
  });
});

afterEach(cleanup);

test("it renders without breaking", () => {
  const { getByTestId } = render(<QueueModal appStore={mockAppStore} />);
});

test("it is initially hidden", () => {
  mockAppStore.showQueueModal = false;
  const { getByTestId, queryByTestId } = render(
    <Provider appStore={mockAppStore}>
      <QueueModal appStore={mockAppStore} />
    </Provider>
  );
  const modal = queryByTestId("queue-modal");
  expect(modal).toBeNull();
});

test("it calls 'closeQueueModal' on close", () => {
  mockAppStore.showQueueModal = true;
  const { getByTestId, queryByTestId } = render(
    <Provider appStore={mockAppStore}>
      <QueueModal appStore={mockAppStore} />
    </Provider>
  );
  const closeButton = getByTestId("queue-modal-close-button");
  closeButton.click();
  expect(mockAppStore.closeQueueModal).toHaveBeenCalledTimes(1);
});

test("the discard button is disabled if no valid codes have been scanned", () => {
  mockAppStore.showQueueModal = true;
  mockAppStore.discardButtonDisabled = true;
  const { getByTestId, queryByTestId } = render(
    <Provider appStore={mockAppStore}>
      <QueueModal appStore={mockAppStore} />
    </Provider>
  );

  const discardButton = getByTestId("queue-modal-discard-button");
  expect(discardButton).toHaveClass("disabled");
});

test("it calls 'clearQueue' on discard", () => {
  mockAppStore.showQueueModal = true;
  const { getByTestId, queryByTestId } = render(
    <Provider appStore={mockAppStore}>
      <QueueModal appStore={mockAppStore} />
    </Provider>
  );

  const discardButton = getByTestId("queue-modal-discard-button");
  discardButton.click();
  expect(mockAppStore.clearQueue).toHaveBeenCalledTimes(1);
});

test("the text of the save button is 'next'", () => {
  mockAppStore.showQueueModal = true;
  mockAppStore.saveButtonText = "next";
  const { getByTestId, queryByTestId } = render(
    <Provider appStore={mockAppStore}>
      <QueueModal appStore={mockAppStore} />
    </Provider>
  );

  const confirmButton = getByTestId("queue-modal-confirm-button");
  expect(confirmButton.firstChild).toHaveTextContent(mockAppStore.saveButtonText);
  confirmButton.click();
  expect(mockAppStore.nextOrSave).toHaveBeenCalledTimes(1);
});

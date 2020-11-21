import React from "react";
import { observable, configure } from "mobx";
import { Provider } from "mobx-react";

import {
  render,
  cleanup,
  fireEvent,
  waitForElement
} from "react-testing-library";

import QueueFeedback from "./index";

let mockAppStore;

beforeEach(() => {
  configure({ enforceActions: "never" });

  mockAppStore = observable({
    toggleSettingsModal: jest.fn(),
    setActiveModeName: jest.fn(),
    clearQueue: jest.fn(),
    showSettingsModal: false,
    cameras: [],
    scannedCodes: [],
    errorMessage: "",
    successMessage: ""
  });
});
afterEach(cleanup);

test("it renders without breaking", () => {
  render(
    <Provider appStore={mockAppStore}>
      <QueueFeedback appStore={mockAppStore} />
    </Provider>
  );
});

test("it does NOT display an error message", () => {
  const { queryByTestId } = render(
    <Provider appStore={mockAppStore}>
      <QueueFeedback appStore={mockAppStore} />
    </Provider>
  );
  const errorMessage = queryByTestId("queue-feedback-error");
  expect(errorMessage).toBeNull();
});

test("it does display an error message", () => {
  mockAppStore.errorMessage = "an error occured";
  const { getByTestId } = render(
    <Provider appStore={mockAppStore}>
      <QueueFeedback appStore={mockAppStore} />
    </Provider>
  );
  const errorMessage = getByTestId("queue-feedback-error");
  expect(errorMessage).toHaveClass("red");
});

test("it does NOT display an success message", () => {
  const { queryByTestId } = render(
    <Provider appStore={mockAppStore}>
      <QueueFeedback appStore={mockAppStore} />
    </Provider>
  );
  const successMessage = queryByTestId("queue-feedback-success");
  expect(successMessage).toBeNull();
});

test("it does display an success message", () => {
  mockAppStore.successMessage = "a success occured";
  const { getByTestId } = render(
    <Provider appStore={mockAppStore}>
      <QueueFeedback appStore={mockAppStore} />
    </Provider>
  );
  const successMessage = getByTestId("queue-feedback-success");
  expect(successMessage).toHaveClass("green");
});

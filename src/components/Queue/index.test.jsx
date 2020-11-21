import React from "react";
import { observable, configure } from "mobx";
import { Provider } from "mobx-react";

import {
  render,
  cleanup,
  fireEvent,
  waitForElement
} from "react-testing-library";

import Queue from "./index";

let mockAppStore;

beforeEach(() => {
  configure({ enforceActions: "never" });

  mockAppStore = observable({
    toggleSettingsModal: jest.fn(),
    setActiveModeName: jest.fn(),
    showSettingsModal: false,
    modes: [{ name: "ding" }, { name: "pong" }],
    activeModeName: "dong",
    cameras: []
  });
});
afterEach(cleanup);

test("it renders without breaking", () => {
  const { getByTestId } = render(
    <Provider appStore={mockAppStore}>
      <Queue appStore={mockAppStore} />
    </Provider>
  );
  getByTestId("queue-button");
});

test("the queue modal opens on click", () => {
  const { getByTestId, queryByTestId } = render(
    <Provider appStore={mockAppStore}>
      <Queue appStore={mockAppStore} />
    </Provider>
  );
  let queueModal = queryByTestId("queue-modal");
  const queueButton = getByTestId("queue-button");

  expect(queueModal).toBeNull();
});
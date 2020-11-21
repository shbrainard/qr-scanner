import React from "react";
import { observable, configure } from "mobx";
import { Provider } from "mobx-react";

import {
  render,
  cleanup,
  fireEvent,
  waitForElement
} from "react-testing-library";

import { MODES } from "./../../../../constants";

import ScannedCodes from "./index";

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
    modes: MODES,
    activeModeName: MODES[0].name,
    activeMode: MODES[0],
    toggleSterility: jest.fn()
  });
});
afterEach(cleanup);

test("it renders without breaking", () => {
  render(
    <Provider appStore={mockAppStore}>
      <ScannedCodes appStore={mockAppStore} />
    </Provider>
  );
});

test("it contains pot number scanned codes", () => {
  const scannedCodes = [{ potNumber: "0011" }, { potNumber: "0012" }];

  mockAppStore.activeMode = { name: "ding dong" };
  mockAppStore.numberOfCrosses = 2;
  mockAppStore.scannedCodes = scannedCodes;

  const { getByText } = render(
    <Provider appStore={mockAppStore}>
      <ScannedCodes appStore={mockAppStore} />
    </Provider>
  );

  for (const code of scannedCodes) {
    getByText(code.potNumber);
  }
});

test("it initialiy contains an unchecked, disabled checkbox", () => {
  const { getByTestId } = render(
    <Provider appStore={mockAppStore}>
      <ScannedCodes appStore={mockAppStore} />
    </Provider>
  );

  const checkbox = getByTestId("sterility-toggle");
  expect(checkbox).toHaveClass("disabled");
});

test("once a code is scanned, the checkbox is active and unchecked", () => {
  const scannedCodes = [{ potNumber: "0012", sterile: false }];
  mockAppStore.scannedCodes = scannedCodes;

  const { getByTestId, debug } = render(
    <Provider appStore={mockAppStore}>
      <ScannedCodes appStore={mockAppStore} />
    </Provider>
  );

  const checkbox = getByTestId("sterility-toggle");
  expect(checkbox).not.toHaveClass("disabled");
  expect(checkbox).not.toHaveClass("checked");
});

test("the checkbox is checked if the respective value is true", () => {
  const scannedCodes = [{ potNumber: "0012", sterile: true }];
  mockAppStore.scannedCodes = scannedCodes;

  const { getByTestId } = render(
    <Provider appStore={mockAppStore}>
      <ScannedCodes appStore={mockAppStore} />
    </Provider>
  );

  const checkbox = getByTestId("sterility-toggle");
  expect(checkbox).not.toHaveClass("disabled");
  expect(checkbox).toHaveClass("checked");
});

test("clicking the checkbox toggles the value in the store", () => {
  const scannedCodes = [{ potNumber: "0012", sterile: false }];
  mockAppStore.scannedCodes = scannedCodes;

  const { getByTestId } = render(
    <Provider appStore={mockAppStore}>
      <ScannedCodes appStore={mockAppStore} />
    </Provider>
  );

  const checkbox = getByTestId("sterility-toggle");
  checkbox.click();
  expect(mockAppStore.toggleSterility).toHaveBeenCalledTimes(1);
});

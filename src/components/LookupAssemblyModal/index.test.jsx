import "jest";
import React from "react";
import { observable, configure } from "mobx";
import { Provider } from "mobx-react";

import {
  render,
  cleanup,
  fireEvent,
  waitForElement
} from "react-testing-library";

import { MODES } from "./../../constants";

import LookupAssemblyModal from "./index";

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
    nextOrSave: jest.fn(),
    isBuildingLookup: false,
    lookupAssemblyCounter: 0,
    lookupAssemblyError: false,
    assembleLookupForMode: jest.fn()
  });
});

afterEach(cleanup);

test("it renders without breaking", () => {
  render(
    <Provider appStore={mockAppStore}>
      <LookupAssemblyModal appStore={mockAppStore} />
    </Provider>
  );
});

test("it displays the modal", () => {
  mockAppStore.isBuildingLookup = true;
  const { getByTestId } = render(
    <Provider appStore={mockAppStore}>
      <LookupAssemblyModal appStore={mockAppStore} />
    </Provider>
  );

  getByTestId("lookup-assembly-modal");
});

test("it displays the carrots", () => {
  mockAppStore.isBuildingLookup = true;
  mockAppStore.lookupAssemblyCounter = 9;
  const { getByTestId, getAllByTestId } = render(
    <Provider appStore={mockAppStore}>
      <LookupAssemblyModal appStore={mockAppStore} />
    </Provider>
  );

  getByTestId("lookup-assembly-modal");
  const carrots = getAllByTestId("carrot");
  expect(carrots.length).toBe((mockAppStore.lookupAssemblyCounter % 5) + 1);
});

test("it displays the error message", () => {
  mockAppStore.isBuildingLookup = true;
  mockAppStore.lookupAssemblyError = true;
  const { getByTestId } = render(
    <Provider appStore={mockAppStore}>
      <LookupAssemblyModal appStore={mockAppStore} />
    </Provider>
  );

  getByTestId("lookup-error-message");
  getByTestId("lookup-error-retry-button");
});

test("it retries lookup building", () => {
  mockAppStore.isBuildingLookup = true;
  mockAppStore.lookupAssemblyError = true;
  const { getByTestId } = render(
    <Provider appStore={mockAppStore}>
      <LookupAssemblyModal appStore={mockAppStore} />
    </Provider>
  );

  const button = getByTestId("lookup-error-retry-button");
  button.click();
  expect(mockAppStore.assembleLookupForMode).toHaveBeenCalledTimes(1);
});

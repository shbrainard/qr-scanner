import React from "react";
import "jest";
import { observable, configure } from "mobx";

import {
  render,
  cleanup,
  fireEvent,
  waitForElement
} from "react-testing-library";

import { MODES, CROSSES } from "./../../constants";

import Settings from "./index";

let mockAppStore;

beforeEach(() => {
  configure({ enforceActions: "never" });

  mockAppStore = observable({
    toggleSettingsModal: jest.fn(),
    setActiveMode: jest.fn(),
    showSettingsModal: false,
    modes: MODES,
    crosses: CROSSES,
    activeMode: MODES[0],
    numberOfCrosses: 1,
    setNumberOfCrosses: jest.fn(),
    cameras: []
  });
});
afterEach(cleanup);

test("it renders without breaking", () => {
  const { getByTestId } = render(<Settings appStore={mockAppStore} />);
  getByTestId("settings-button");
});

test("clicking the button toggles the settings modal", () => {
  const { getByTestId } = render(<Settings appStore={mockAppStore} />);
  const settingsButton = getByTestId("settings-button");
  settingsButton.click();
  expect(mockAppStore.toggleSettingsModal).toHaveBeenCalledTimes(1);
});

test("settings modal is hidden when not toggled", () => {
  const { queryByTestId } = render(<Settings appStore={mockAppStore} />);
  const settingsModal = queryByTestId("settings-modal");
  expect(settingsModal).toBeNull();
});

test("settings modal is visible when toggled", async () => {
  const { getByTestId } = render(<Settings appStore={mockAppStore} />);
  mockAppStore.showSettingsModal = true;
  await waitForElement(() => getByTestId("settings-modal"));
});

test("settings modal is hidden when toggled from modal", async () => {
  const { getByTestId, queryByTestId } = render(
    <Settings appStore={mockAppStore} />
  );
  mockAppStore.showSettingsModal = true;
  const saveButton = await waitForElement(() =>
    getByTestId("settings-modal-save")
  );
  saveButton.click();
  expect(mockAppStore.toggleSettingsModal).toHaveBeenCalledTimes(1);
  mockAppStore.showSettingsModal = false;
  const settingsModal = queryByTestId("settings-modal");
  expect(settingsModal).toBeNull();
});

describe("it changes the mode", () => {

  test("first mode button is active", async () => {
    mockAppStore.showSettingsModal = true;

    const { getAllByTestId } = render(<Settings appStore={mockAppStore} />);
    const modeSelect = await waitForElement(() =>
      getAllByTestId("mode-switch-button")
    );
    expect(modeSelect.length).toBe(MODES.length);
    const activeButton = modeSelect[0];
    expect(activeButton).toHaveClass("active");
    expect(modeSelect[1]).not.toHaveClass("active");
    expect(modeSelect[2]).not.toHaveClass("active");
  });

  test("it sets new mode", async () => {
    mockAppStore.showSettingsModal = true;

    const { getAllByTestId } = render(<Settings appStore={mockAppStore} />);
    const modeSelect = await waitForElement(() =>
      getAllByTestId("mode-switch-button")
    );

    modeSelect[1].click();
    expect(mockAppStore.setActiveMode).toHaveBeenCalledWith(
      mockAppStore.modes[1].name
    );
  });

  test("first crosses button is active", async () => {
    mockAppStore.showSettingsModal = true;

    const { getAllByTestId } = render(<Settings appStore={mockAppStore} />);
    const crossesSelect = await waitForElement(() =>
      getAllByTestId("crosses-switch-button")
    );
    expect(crossesSelect.length).toBe(CROSSES.length);
    const activeButton = crossesSelect[0];
    expect(activeButton).toHaveClass("active");
    expect(crossesSelect[1]).not.toHaveClass("active");
    expect(crossesSelect[2]).not.toHaveClass("active");
  });

  test("it sets new amount of crosses", async () => {
    mockAppStore.showSettingsModal = true;

    const { getAllByTestId } = render(<Settings appStore={mockAppStore} />);
    const crossesSelect = await waitForElement(() =>
      getAllByTestId("crosses-switch-button")
    );

    crossesSelect[1].click();
    expect(mockAppStore.setNumberOfCrosses).toHaveBeenCalledWith(
      mockAppStore.crosses[1]
    );
  });

})


import "jest";
import { AppStore } from "./index";
import { configure } from "mobx";
import { cleanup } from "react-testing-library";
import { assembleLookupTable } from "./../helpers/airtable";
import { ERROR_NOT_FOUND_IN_LOOKUP } from "./../constants";

configure({ enforceActions: "never" });

jest.mock("./../helpers/airtable", () => ({
  assembleLookupTable: jest.fn(() => {
    return new Promise((resolve, reject) => {});
  })
}));

export const MODES = [
  {
    name: "Scott",
    lookupTable: { table: "CARROT LOOKUP", fields: ["POT"], lookupKey: "POT" },
    table: "SCOTT BREEDING"
  },
  {
    name: "Carrots",
    lookupTable: { table: "CARROT LOOKUP", fields: ["POT"], lookupKey: "POT" },
    table: "CARROT BREEDING"
  },
  {
    name: "Beets",
    lookupTable: { table: "BEET LOOKUP", fields: ["POT"], lookupKey: "POT" },
    table: "BEET BREEDING"
  }
];

export const CROSSES = [1, 2, 3, 4];

let appStore;

beforeEach(() => {
  appStore = new AppStore(MODES, CROSSES);
});

afterEach(cleanup);

test("lookup assembly called for mode with lookup key", () => {
  // open settings modal
  appStore.toggleSettingsModal();
  appStore.setActiveMode(MODES[1].name);
  // close settings modal
  appStore.toggleSettingsModal();
  expect(assembleLookupTable).toHaveBeenLastCalledWith(
    MODES[1]["lookupTable"]["table"],
    MODES[1]["lookupTable"]["lookupKey"],
    MODES[1]["lookupTable"]["fields"]
  );
});

test("toggling the sterility toggles the value", () => {
  appStore.scannedCodes = [{ potNumber: "0010", sterile: false }];
  appStore.toggleSterility(0);
  expect(appStore.scannedCodes[0].sterile).toBeTruthy();
});

test("pot number not in lookup", () => {
  const lookup = {
    "0001": "sdflkj",
    "0002": "wwwwww"
  };
  appStore.lookup[appStore.activeMode.lookupTable.table] = lookup;

  const potNumber = "0005";

  appStore.handleContent(potNumber);
  const errorMessage = `${ERROR_NOT_FOUND_IN_LOOKUP} ${potNumber}`;
  expect(appStore.errorMessage).toBe(errorMessage);
});

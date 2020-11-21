import { observable, action, decorate, runInAction } from "mobx";

import { MODES, CROSSES, ERROR_NOT_FOUND_IN_LOOKUP } from "./../constants";
import { getPotNumber } from "./../helpers/scanner";
import {
  assembleLookupTable,
  postEntryToAirtable
} from "./../helpers/airtable";

class AppStore {
  showQueueModal = false;
  modes = [];
  crosses = [];
  activeMode;
  numberOfCrosses;
  showSettingsModal = false;
  cameras = [];
  activeCamera;
  scanner;
  scannedContent;
  scannedCodes = [];
  errorMessage = "";
  successMessage = "";
  // is interacting with airtable?
  isLoading = false;
  // what happens after scanning?
  afterScanning = "save";
  // show modal that displays the genotype of the scanned pot number
  showGenotypeModal = false;
  // result from lookup for scanned pot number
  scannedGenotype = {};

  isBuildingLookup = false;
  lookupAssemblyError = false;
  lookupAssemblyCounter = 0;
  lookup = {};

  constructor(modes = [], crosses = []) {
    this.modes = modes;
    this.crosses = crosses;
    this.activeMode = modes[0];
    this.numberOfCrosses = crosses[0];

    this.assembleLookupForMode();
  }

  toggleAfterScanning() {
    if (this.afterScanning === "see") {
      this.afterScanning = "save";
    } else {
      this.afterScanning = "see";
    }
  }

  closeGenotypeModal() {
    this.showGenotypeModal = false;
    this.errorMessage = "";
  }

  startLookupAssembly() {
    this.lookupAssemblyError = false;
    this.isBuildingLookup = true;
    this.lookupAssemblyInterval = setInterval(
      () => runInAction(() => (this.lookupAssemblyCounter += 1)),
      1000
    );
  }

  stopLookupAssembly() {
    this.isBuildingLookup = false;
    clearInterval(this.lookupAssemblyInterval);
    this.lookupAssemblyCounter = 0;
  }

  assembleLookupForMode() {
    if (
      this.activeMode.lookupTable.table &&
      !Object.keys(this.lookup).includes(this.activeMode.lookupTable.table)
    ) {
      runInAction(() => this.startLookupAssembly());
      assembleLookupTable(
        this.activeMode.lookupTable.table,
        this.activeMode.lookupTable.lookupKey,
        this.activeMode.lookupTable.fields
      )
        .then(lookup => {
          runInAction(
            () => (this.lookup[this.activeMode.lookupTable.table] = lookup)
          );
          runInAction(() => this.stopLookupAssembly());
        })
        .catch(error => {
          if (error) {
            runInAction(() => {
              this.lookupAssemblyError = true;
              clearInterval(this.lookupAssemblyInterval);
              this.lookupAssemblyCounter = 0;
            });
          } else {
            runInAction(() => {
              this.stopLookupAssembly();
            });
          }
        });
    }
  }

  setActiveMode(modeName) {
    const newMode = this.modes.find(mode => mode.name === modeName);
    this.activeMode = newMode;
    this.clearQueue();
    // this.assembleLookupForMode();
  }

  setNumberOfCrosses(crosses) {
    this.numberOfCrosses = crosses;
    this.clearQueue();
  }

  toggleSettingsModal() {
    this.showSettingsModal = !this.showSettingsModal;
    if (!this.showSettingsModal) {
      this.assembleLookupForMode();
    }
  }

  _determinMirroring = () => {
    const windowWidth = window.innerWidth;

    if (windowWidth > 1024) {
      return true;
    }

    return false;
  };

  setCameras(cameras) {
    this.cameras = cameras;
    this.activeCamera = cameras[0];
  }

  initializeScanner(videoRef) {
    const store = this;

    const scanner = new window.Instascan.Scanner({
      video: videoRef.current,
      mirror: store._determinMirroring()
    });

    store.scanner = scanner;
    store.scanner.addListener("scan", content => {
      store.handleContent(content);
    });

    window.Instascan.Camera.getCameras()
      .then(function(cameras) {
        if (cameras.length > 0) {
          store.setCameras(cameras);
          store.scanner.start(store.activeCamera);
        } else {
          console.error("No cameras found.");
        }
      })
      .catch(function(e) {
        console.error(e);
      });
  }

  handleContent(content) {
    this.errorMessage = "";
    // Don't scan if modal is open
    if (this.showQueueModal) {
      return;
    }

    const potNumber = getPotNumber(content);

    // if all they want to see is the genotype...
    if (this.afterScanning === "see") {
      const lookedUp = this.lookup[this.activeMode.lookupTable.table][
        potNumber
      ];
      if (lookedUp) {
        this.scannedGenotype = lookedUp || {};
      } else {
        this.errorMessage = `${ERROR_NOT_FOUND_IN_LOOKUP} ${potNumber}`;
      }
      this.showGenotypeModal = true;
      return;
    }

    this.showQueueModal = true;
    if (potNumber) {
      const lookedUp = this.lookup[this.activeMode.lookupTable.table][
        potNumber
      ];
      if (!lookedUp) {
        this.scannedContent = content;
        this.errorMessage = `${ERROR_NOT_FOUND_IN_LOOKUP} ${potNumber}`;
      } else {
        this.scannedCodes.push({ potNumber, sterile: false });
      }
    } else {
      this.scannedContent = content;
      this.errorMessage = "Pot number not found in QR code";
    }
  }

  toggleSterility(index) {
    const code = this.scannedCodes[index];
    code.sterile = !code.sterile;
  }

  changeCamera(cameraId) {
    const newCamera = this.cameras.find(camera => camera.id === cameraId);
    this.scanner.stop().then(() => {
      this.scanner.start(newCamera);
      runInAction(() => {
        this.activeCamera = newCamera;
      });
    });
  }

  setActiveCamera(camera) {
    this.activeCamera = camera;
  }

  openQueueModal() {
    this.showQueueModal = true;
  }

  closeQueueModal() {
    this.showQueueModal = false;
    this.errorMessage = "";
    this.successMessage = "";
  }

  clearQueue() {
    this.scannedCodes = [];
    this.errorMessage = "";
    this.successMessage = "";
  }

  get discardButtonDisabled() {
    return !this.scannedCodes.length || this.isLoading;
  }

  get saveButtonText() {
    if (this.scannedCodes.length === this.numberOfCrosses) {
      return "save";
    } else {
      return "next";
    }
  }

  nextOrSave() {
    if (this.scannedCodes.length < this.numberOfCrosses) {
      this.closeQueueModal();
    } else {
      this.postScannedCodes();
    }
  }

  airtablePostSuccess(result) {
    const number = result.fields.NUMBER;
    this.isLoading = false;
    this.scannedCodes = [];
    this.successMessage = `Entry saved with number ${number}. Good luck!`;
  }

  airtablePostError(errorMessage) {
    this.isLoading = false;
    this.errorMessage = errorMessage;
  }

  postScannedCodes() {
    const mode = this.activeMode;

    runInAction(() => (this.isLoading = true));

    // TODO put this in helpers/airtable --> assemblePayload

    let lookupLink1, lookupLink2, lookupLink3, lookupLink4;
    let sterility1, sterility2, sterility3, sterility4;

    // TODO: this could go into a function...
    // POT 1
    lookupLink1 = [
      this.lookup[this.activeMode.lookupTable.table][
        this.scannedCodes[0].potNumber
      ].id
    ];
    sterility1 = this.scannedCodes[0].sterile ? "S" : "F";
    // POT 2
    try {
      lookupLink2 = [
        this.lookup[this.activeMode.lookupTable.table][
          this.scannedCodes[1].potNumber
        ].id
      ];
    } catch (error) {
      lookupLink2 = [];
    }
    try {
      sterility2 = this.scannedCodes[1].sterile ? "S" : "F";
    } catch (error) {
      sterility2 = null;
    }
    // POT 3
    try {
      lookupLink3 = [
        this.lookup[this.activeMode.lookupTable.table][
          this.scannedCodes[2].potNumber
        ].id
      ];
    } catch (error) {
      lookupLink3 = [];
    }
    try {
      sterility3 = this.scannedCodes[2].sterile ? "S" : "F";
    } catch (error) {
      sterility3 = null;
    }
    // POT 4
    try {
      lookupLink4 = [
        this.lookup[this.activeMode.lookupTable.table][
          this.scannedCodes[3].potNumber
        ].id
      ];
    } catch (error) {
      lookupLink4 = [];
    }
    try {
      sterility4 = this.scannedCodes[3].sterile ? "S" : "F";
    } catch (error) {
      sterility4 = null;
    }
    // DATE OF CROSS
    const date = new Date();
    const dateOfCross = date.toISOString();

    const newEntry = {
      "DATE OF CROSS": dateOfCross,
      "POT ID 1": lookupLink1,
      "POT ID 2": lookupLink2,
      "POT ID 3": lookupLink3,
      "POT ID 4": lookupLink4,
      "STERILITY 1": sterility1,
      "STERILITY 2": sterility2,
      "STERILITY 3": sterility3,
      "STERILITY 4": sterility4
    };

    postEntryToAirtable(mode.table, newEntry)
      .then(result => this.airtablePostSuccess(result))
      .catch(error => this.airtablePostError(error.message));
  }
}

decorate(AppStore, {
  modes: observable,
  crosses: observable,
  activeMode: observable,
  numberOfCrosses: observable,
  showSettingsModal: observable,
  cameras: observable,
  activeCamera: observable,
  scanner: observable,
  showQueueModal: observable,
  scannedContent: observable,
  scannedCodes: observable,
  successMessage: observable,
  errorMessage: observable,
  isLoading: observable,
  afterScanning: observable,
  showGenotypeModal: observable,
  scannedGenotype: observable,

  // lookup
  isBuildingLookup: observable,
  lookupAssemblyCounter: observable,
  lookupAssemblyError: observable,
  lookup: observable,

  assembleLookupForMode: action,
  setActiveMode: action,
  setNumberOfCrosses: action,
  toggleSettingsModal: action,
  setCameras: action,
  setActiveCamera: action,
  changeCamera: action,
  initializeScanner: action,
  openQueueModal: action,
  closeQueueModal: action,
  clearQueue: action,
  handleContent: action,
  nextOrSave: action,
  postScannedCodes: action,
  airtablePostSuccess: action,
  airtablePostError: action,
  startLookupAssembly: action,
  stopLookupAssembly: action,
  toggleSterility: action,
  toggleAfterScanning: action,
  closeGenotypeModal: action
});

const appStore = new AppStore(MODES, CROSSES);

export default appStore;
window.appStore = appStore;

export { AppStore };

import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import styled from "styled-components";
import { Checkbox } from "semantic-ui-react";

const Row = styled.div`
  display: flex;
  padding: 1rem 0;
`;

const Cell = styled.div`
  flex: 1;
`;

const HeaderCell = styled(Cell)`
  font-weight: bold;
`;

class _ScannedCodes extends Component {
  render() {
    const { appStore } = this.props;

    const { scannedCodes, numberOfCrosses } = appStore;

    return (
      <React.Fragment>
        <Row>
          <HeaderCell>step</HeaderCell>
          <HeaderCell>Pot number</HeaderCell>
          <HeaderCell>Sterility</HeaderCell>
        </Row>

        {[...Array(numberOfCrosses).keys()].map((scan, index) => {
          let scannedCode;
          if (scannedCodes.length > index) {
            scannedCode = scannedCodes[index];
          } else {
            scannedCode = {};
          }
          const { potNumber, sterile } = scannedCode;
          return (
            <Row key={`scan-${index}`}>
              <Cell>{index + 1}</Cell>
              <Cell>{potNumber || "-"}</Cell>
              <Cell>
                <Checkbox
                  data-testid="sterility-toggle"
                  toggle
                  onChange={() => appStore.toggleSterility(index)}
                  checked={sterile}
                  disabled={![true, false].includes(sterile)}
                />
              </Cell>
            </Row>
          );
        })}
      </React.Fragment>
    );
  }
}

const ScannedCodes = inject("appStore")(observer(_ScannedCodes));

export default ScannedCodes;

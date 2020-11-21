import React from "react";
import { inject, observer } from "mobx-react";
import styled from "styled-components";
import { Icon } from "semantic-ui-react";

const Wrapper = styled.div`
  z-index: 10;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 40px;
  color: white;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const _ModeIndicator = ({ appStore }) => {
  const { activeMode, numberOfCrosses, afterScanning } = appStore;
  return (
    <Wrapper>
      <span>
        {activeMode.name} - {numberOfCrosses}{" "}
        <Icon name={afterScanning === "see" ? "eye" : "save"} />
      </span>
    </Wrapper>
  );
};

const ModeIndicator = inject("appStore")(observer(_ModeIndicator));

export default ModeIndicator;

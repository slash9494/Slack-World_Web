import React from "react";
import styled from "@emotion/styled";
import HomeRoundedIcon from "@material-ui/icons/HomeRounded";
import { Link } from "react-router-dom";

const BarContainer = styled.div`
  width: 100vw;
  height: 80px;
  position: fixed;
  bottom: 0;
  border-top: 1px solid #e3e3e3;
  display: flex;
  @media screen and (min-width: 500px) {
    display: none;
  }
`;
const ListContainer = styled.div`
  width: 45%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const IconContainer = styled.div`
  cursor: pointer;
  font-size: 20px;
`;
function MobileBar() {
  return (
    <BarContainer>
      <ListContainer>
        <IconContainer>
          <Link to="/" style={{ color: "black" }}>
            <HomeRoundedIcon />
          </Link>
        </IconContainer>
      </ListContainer>
      <ListContainer>
        <IconContainer>DM</IconContainer>
      </ListContainer>
      <ListContainer>
        <IconContainer>CH</IconContainer>
      </ListContainer>
      <ListContainer>
        <IconContainer>+</IconContainer>
      </ListContainer>
    </BarContainer>
  );
}

export default MobileBar;

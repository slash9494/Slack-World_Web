import React, { useState } from "react";
import styled from "@emotion/styled";
import { IUser } from "types/db";
import MenuDrop from "@components/utils/MenuDrop";
import { Paper } from "@material-ui/core";
interface Props {
  userData: IUser | undefined;
  url: string | undefined;
  dropOpen: boolean;
  handleClose: () => void;
  handleOpen: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}
const Container = styled.div`
  width: 17vw;
  height: calc(100vh - 64px);
  top: 64;
  position: relative;
  border-right: 1px solid #e3e3e3;
`;
const ChannelNameContainer = styled.div`
  width: 100%;
  height: 10%;
  padding: 0 20px;
  background: #4c6ef5;
  display: flex;
`;
const NameStyle = styled.span`
  font-weight: bold;
  color: white;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 2vw;
`;
const DropContainer = styled.div`
  min-width: 200px;
  width: 17vw;
  display: flex;
  align-items: center;
  flex-direction: column;
`;
const DropItem = styled.div``;
const ChannelList = styled.div`
  width: 100%;
  height: 90%;
`;

function Channels(props: Props) {
  return (
    <Container>
      <ChannelNameContainer>
        <MenuDrop
          menuIcon={
            <NameStyle style={{ fontWeight: "bold", color: "white" }}>
              {
                props.userData?.Workspaces.find((ws) => ws.url === props.url)
                  ?.name
              }
            </NameStyle>
          }
          open={props.dropOpen}
          handleOpen={props.handleOpen}
          id="channelDropOpen"
        >
          <Paper style={{ marginLeft: "73px" }}>
            {" "}
            <DropContainer>
              <DropItem>워크스페이스에 사용자 초대</DropItem>
              <DropItem>채널 만들기</DropItem>
            </DropContainer>
          </Paper>
        </MenuDrop>
      </ChannelNameContainer>
      <ChannelList></ChannelList>
    </Container>
  );
}

export default Channels;

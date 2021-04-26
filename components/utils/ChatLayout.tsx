import React, { FC, PropsWithChildren } from "react";
import styled from "@emotion/styled";
interface Props {}

const Header = styled.div`
  width: 100%;
  height: 10%;
`;
const ChatList = styled.div``;

const ChatBox = styled.div``;
const ChatLayout: FC<PropsWithChildren<Props>> = (props) => {
  return (
    <>
      <Header>s</Header>
      <ChatList>d</ChatList>
      <ChatBox>d</ChatBox>
    </>
  );
};

export default ChatLayout;

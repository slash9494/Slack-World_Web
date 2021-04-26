import React, { FC, PropsWithChildren } from "react";
import gravatar from "gravatar";
import styled from "@emotion/styled";
import { MentionsInput, Mention } from "react-mentions";
interface Props {
  nickname: string;
  email: string;
}

const Header = styled.div`
  width: 100%;
  height: 10%;
  padding: 1%;
  font-size: 2vw;
  display: flex;
  align-items: center;
  & img {
    margin-right: 5px;
  }
  @media screen and (max-width: 500px) {
    padding: 10px;
    font-size: 4vw;
  }
`;
const ChatList = styled.div`
  width: 100%;
  display: flex;
  flex: 1;
`;

const ChatBox = styled.div`
  display: flex;
  width: 100%;
  padding: 10px;
`;
const Section = styled.section`
  margin-top: 20px;
  border-top: 1px solid #eee;
`;

const Form = styled.form`
  width: 100%;
  border-radius: 4px;
  color: rgb(29, 28, 29);
  font-size: 15px;
  border: 1px solid rgb(29, 28, 29);
`;
const InputArea = styled(MentionsInput)`
  width: 100%;
`;
const ChatLayout: FC<PropsWithChildren<Props>> = (props) => {
  return (
    <>
      <Header>
        {" "}
        <img
          src={gravatar.url(props.email, { s: "30vw", d: "retro" })}
          alt={props.nickname}
        />
        {props.nickname}
      </Header>
      <ChatList>
        <Section>{props.children}</Section>
      </ChatList>
      <ChatBox>
        <Form>
          <InputArea>
            <Mention trigger="@" data={[]} />
          </InputArea>
        </Form>
      </ChatBox>
    </>
  );
};

export default ChatLayout;

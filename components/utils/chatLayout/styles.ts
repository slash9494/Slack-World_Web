import styled from "@emotion/styled";
import { MentionsInput } from "react-mentions";

export const Header = styled.div`
  width: 100%;
  height: 10%;
  padding: 1%;
  font-size: 2vw;
  display: flex;
  align-items: center;
  & img {
    margin-right: 5px;
  }
  .channelRight {
    right: 30;
    position: absolute;
    display: flex;
    align-items: center;
    height: 8%;
  }
  .channelName {
    min-width: 250px;
    height: 100%;
    display: flex;
    align-items: center;
  }
  .channelMembers {
    padding-right: 5px;
  }
  & button {
    cursor: pointer;
    background: transparent;
    border: transparent;
  }

  @media screen and (max-width: 800px) {
    padding: 20px;
    font-size: 4vw;
  }
  @media screen and (max-width: 500px) {
    font-size: 6vw;
  }
`;
export const ChatList = styled.div`
  width: 100%;
  display: flex;
  flex: 1;
`;
export const ChatBox = styled.div`
  display: flex;
  width: 100%;
  padding: 10px;
`;
export const Section = styled.section`
  border-top: 1px solid #eee;
`;
export const Form = styled.form`
  width: 100%;
  border-radius: 4px;
  color: rgb(29, 28, 29);
  font-size: 15px;
  border: 1px solid rgb(29, 28, 29);
  padding: 10px;
`;
export const InputArea = styled(MentionsInput)`
  height: 50px;
  & textarea {
    height: 44px;
    padding: 9px 10px !important;
    outline: none !important;
    border-radius: 4px !important;
    resize: none !important;
    line-height: 22px;
    border: none;
  }
  & ul {
    border: 1px solid lightgray;
    max-height: 200px;
    overflow-y: auto;
    padding: 9px 10px;
    background: white;
    border-radius: 4px;
    width: 150px;
  }
`;
export const ToolBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  border: 1px solid transparent;
`;
export const MentionButton = styled.button<{ focus: boolean }>`
  background: transparent;
  border: transparent;
  display: flex;
  align-items: center;
  ${({ focus }) =>
    focus &&
    `
    background: #ced4da;
    border-radius:4px;
    `}
`;

export const DragOver = styled.div`
  width: 100%;
  height: 100%;
  opacity: 0.7;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  background: lightgray;
  position: absolute;
  top: 0;
`;

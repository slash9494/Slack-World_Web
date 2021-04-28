import React, {
  FC,
  PropsWithChildren,
  useRef,
  useEffect,
  useCallback,
  RefObject,
} from "react";
import gravatar from "gravatar";
import styled from "@emotion/styled";
import {
  MentionsInput,
  Mention,
  OnChangeHandlerFunc,
  SuggestionDataItem,
} from "react-mentions";
import SendIcon from "@material-ui/icons/Send";
import autosize from "autosize";
import { IDM, IChat, IUser } from "types/db";
import { Scrollbars } from "react-custom-scrollbars";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import { fetcher } from "@utils/fetcher";
interface Props {
  nickname: string;
  email: string;
  onSubmit: (
    e:
      | React.FormEvent<HTMLFormElement>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => void;
  onChange: OnChangeHandlerFunc;
  placeholder: string;
  value: string;
  scrollBarRef: RefObject<Scrollbars>;
  setSize: (f: (size: number) => number) => Promise<IDM[][] | undefined>;
  isEmpty: boolean;
  isReachingEnd: boolean;
}

const ChatLayout: FC<Props> = (props) => {
  const { workspace } = useParams<{ workspace?: string }>();
  const { data: userData, error, revalidate: revalidateUser, mutate } = useSWR<
    IUser | false
  >("/api/users", fetcher);
  const { data: memberData } = useSWR<IUser[]>(
    userData ? `/api/workspaces/${workspace}/members` : null,
    fetcher
  );
  const inputAreaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (inputAreaRef.current) {
      autosize(inputAreaRef.current);
    }
  }, [inputAreaRef.current]);
  const onKeydown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter") {
        if (!e.shiftKey) {
          e.preventDefault();
          props.onSubmit(e);
        }
      }
    },
    [props.onSubmit]
  );
  const onScroll = useCallback((values) => {
    if (values.scrollTop === 0 && !props.isReachingEnd) {
      props.setSize((prevSize) => prevSize + 1).then(() => {});
    }
  }, []);
  const renderUserSuggestion = useCallback(
    (
      suggestion: SuggestionDataItem,
      search: string,
      highlightedDisplay: React.ReactNode,
      index: number,
      focus: boolean
    ): React.ReactNode => {
      if (!memberData) return;
      return (
        <MentionButton focus={focus}>
          <img
            src={gravatar.url(memberData[index].email, {
              s: "20px",
              d: "retro",
            })}
            alt={memberData[index].nickname}
          />
          <span>{highlightedDisplay}</span>
        </MentionButton>
      );
    },
    [memberData]
  );
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
        <Scrollbars autoHide ref={props.scrollBarRef} onScrollFrame={onScroll}>
          <Section>{props.children}</Section>
        </Scrollbars>
      </ChatList>
      <ChatBox>
        <Form onSubmit={props.onSubmit}>
          <InputArea
            onChange={props.onChange}
            placeholder={props.placeholder}
            inputRef={inputAreaRef}
            onKeyPress={onKeydown}
            value={props.value}
            allowSuggestionsAboveCursor
          >
            <Mention
              appendSpaceOnAdd
              trigger="@"
              data={
                memberData?.map((m) => ({ id: m.id, display: m.nickname })) ||
                []
              }
              renderSuggestion={renderUserSuggestion}
            />
          </InputArea>
          <ToolBox>
            <button
              type="submit"
              style={{ border: "transparent", background: "transparent" }}
            >
              <SendIcon />
            </button>
          </ToolBox>
        </Form>
      </ChatBox>
    </>
  );
};

export default ChatLayout;

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
    padding: 20px;
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
  border-top: 1px solid #eee;
`;
const Form = styled.form`
  width: 100%;
  border-radius: 4px;
  color: rgb(29, 28, 29);
  font-size: 15px;
  border: 1px solid rgb(29, 28, 29);
  padding: 10px;
`;
const InputArea = styled(MentionsInput)`
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
const ToolBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  border: 1px solid transparent;
`;
const MentionButton = styled.button<{ focus: boolean }>`
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

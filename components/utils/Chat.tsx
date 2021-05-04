import React, { FC, useMemo, useEffect, useState } from "react";
import { IDM, IChat, IUser } from "types/db";
import styled from "@emotion/styled";
import gravatar from "gravatar";
import dayjs from "dayjs";
import regexifyString from "regexify-string";
import { Link, useParams } from "react-router-dom";
interface Props {
  data: { [key: string]: (IDM | IChat)[] };
}

const Chat: FC<Props> = (props) => {
  useEffect(() => {
    if (window.innerWidth <= 770) {
      setImgSize(200);
    }
  }, []);
  const [imgSize, setImgSize] = useState(300);
  const { workspace } = useParams<{ workspace: string; channel: string }>();
  const BACK_URL =
    process.env.NODE_ENV === "development" ? "http://localhost:3095" : " ";
  const chatSections = useMemo(
    () =>
      Object.entries(props.data).map(([date, chats], index) => {
        const chatData = chats.map((chat: IDM | IChat, i) => {
          let contents: (string | JSX.Element)[] | JSX.Element = [];
          if (chat.content.startsWith("uploads/")) {
            contents = (
              <img
                src={`${BACK_URL}/${chat.content}`}
                style={{ maxHeight: `${imgSize}` }}
              />
            );
          } else {
            contents = regexifyString({
              input: chat.content,
              pattern: /@\[(.+?)\]\((\d+?)\)|\n/g,
              decorator(match, index) {
                const arr: string[] | null = match.match(/@\[(.+?)\]\((\d+?)/)!;
                if (arr) {
                  return (
                    <Link
                      key={match + index}
                      to={`/workspace/${workspace}/dm/${arr[2]}`}
                    >
                      @{arr[1]}
                    </Link>
                  );
                }
                return <br key={index} />;
              },
            });
          }

          const user: IUser = "Sender" in chat ? chat.Sender : chat.User;
          return (
            <>
              <ChatInfo key={i}>
                <img
                  src={gravatar.url(user.email, { s: "28px", d: "retro" })}
                  alt={user.nickname}
                  className="userImg"
                />
                <div>
                  <span className="userName">{user.nickname}</span>
                  <span className="date">
                    {dayjs(chat.createdAt).format("h:mm A")}
                  </span>
                  <div key={chat.id}>{contents}</div>
                </div>
              </ChatInfo>
            </>
          );
        });
        return (
          <>
            <StickyHeader key="dateheader">
              <button>{date}</button>
            </StickyHeader>
            <Divider key="divider" />
            <div key={index}>{chatData}</div>
          </>
        );
      }),
    [props.data]
  );
  return <ChatContainer>{chatSections}</ChatContainer>;
};

export default Chat;

const ChatContainer = styled.div`
  width: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  .userImg {
    width: 36px;
    margin: 3px 8px 16px 8px;
  }
  & div {
    flex-wrap: wrap;
    flex: 1;
    align-items: flex-start;
  }
  .userName {
    flex: 0 0 100%;
    font-weight: bold;
    margin-right: 5px;
  }
`;

const ChatInfo = styled.div`
  display: flex;
`;

const StickyHeader = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  position: sticky;
  top: 10px;
  z-index: 2;
  & button {
    font-weight: bold;
    font-size: 13px;
    height: 28px;
    line-height: 27px;
    padding: 0 16px;
    --saf-0: rgba(var(--sk_foreground_low, 29, 28, 29), 0.13);
    box-shadow: 0 0 0 1px var(--saf-0), 0 1px 3px 0 rgba(0, 0, 0, 0.08);
    border-radius: 24px;
    position: relative;
    background: white;
    border: none;
    outline: none;
  }
`;

const Divider = styled.div`
  position: relative;
  border-top: 1px solid lightgray;
  bottom: 15;
`;

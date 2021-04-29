import React, { useState, useCallback, useRef, useEffect, FC } from "react";
import { NavLink, useParams, Redirect } from "react-router-dom";
import useSWR, { useSWRInfinite } from "swr";
import { IUser, IDM } from "types/db";
import { fetcher } from "@components/utils/fetcher";
import ChatLayout from "@components/utils/chatLayout/ChatLayout";
import { OnChangeHandlerFunc } from "react-mentions";
import Chat from "@components/utils/Chat";
import axios from "axios";
import Scrollbars from "react-custom-scrollbars";
import makeSections from "@components/utils/MakeSections";
import useSocket from "@components/hooks/useSocket";
interface Props {
  updateDmParams?: (dmName: string) => void;
}
const DirectMessage: FC<Props> = (props) => {
  const PAGE_SIZE = 15;
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: myData } = useSWR("/api/users", fetcher);
  const { data: userData } = useSWR(
    `/api/workspaces/${workspace}/users/${id}`,
    fetcher
  );
  const {
    data: chatData,
    mutate: mutateChat,
    revalidate,
    setSize,
  } = useSWRInfinite<IDM[]>(
    (index) =>
      `/api/workspaces/${workspace}/dms/${id}/chats?perPage=${PAGE_SIZE}&page=${
        index + 1
      }`,
    fetcher,
    {}
  );
  const [socket] = useSocket(workspace);
  const isEmpty = chatData?.[0]?.length === 0;
  const isReachingEnd =
    isEmpty ||
    (chatData && chatData[chatData.length - 1]?.length < PAGE_SIZE) ||
    false;
  const chatSections = makeSections(
    chatData ? [...chatData].flat().reverse() : []
  );
  const [input, setInput] = useState("");
  const scrollBarRef = useRef<Scrollbars>(null);
  const onMessage = useCallback(
    (data: IDM) => {
      if (data.SenderId === Number(id) && myData.id !== Number(id)) {
        mutateChat((chatData) => {
          chatData?.[0].unshift(data);
          return chatData;
        }, false).then(() => {
          if (scrollBarRef.current) {
            if (
              scrollBarRef.current.getScrollHeight() <
              scrollBarRef.current.getClientHeight() +
                scrollBarRef.current.getScrollTop() +
                150
            ) {
              setTimeout(() => {
                scrollBarRef.current?.scrollToBottom();
              }, 50);
            }
          }
        });
      }
    },
    [id, scrollBarRef.current, myData]
  );
  // useEffect(() => {
  //   props.updateDmParams(id);
  // }, [id]);
  useEffect(() => {
    socket?.on("dm", onMessage);
    return () => {
      socket?.off("dm", onMessage);
    };
  }, [socket, onMessage]);
  useEffect(() => {
    if (chatData?.length === 1) {
      setTimeout(() => {
        scrollBarRef.current?.scrollToBottom();
      }, 100);
    }
  }, [chatData]);
  const onChange: OnChangeHandlerFunc = useCallback(
    (e) => {
      let value = e.target.value;
      setInput(value);
    },
    [input]
  );
  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (input.trim() && chatData) {
        const savedChat = input;
        mutateChat((prevChatData) => {
          prevChatData?.[0].unshift({
            id: (chatData[0][0]?.id || 0) + 1,
            content: savedChat,
            SenderId: myData.id,
            Sender: myData,
            ReceiverId: userData.id,
            Receiver: userData,
            createdAt: new Date(),
          });
          return prevChatData;
        }, false).then(() => {
          localStorage.setItem(
            `${workspace}-${id}`,
            new Date().getTime().toString()
          );
          setInput("");
          scrollBarRef.current?.scrollToBottom();
        });

        axios
          .post(`/api/workspaces/${workspace}/dms/${id}/chats`, {
            content: input,
          })
          .then(() => {
            revalidate();
          })
          .catch(console.error);
      }
    },
    [input, workspace, id, chatData, myData, userData]
  );
  if (!userData || !myData) {
    return null;
  }
  return (
    <ChatLayout
      nickname={userData?.nickname}
      email={userData?.email}
      onSubmit={onSubmit}
      onChange={onChange}
      placeholder={`message to ${userData?.nickname}`}
      value={input}
      scrollBarRef={scrollBarRef}
      setSize={setSize}
      isEmpty={isEmpty}
      isReachingEnd={isReachingEnd}
      revalidateDm={revalidate}
    >
      <Chat data={chatSections} />
    </ChatLayout>
  );
};

export default DirectMessage;

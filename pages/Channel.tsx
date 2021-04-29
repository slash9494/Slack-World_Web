import React, { useState, useCallback, useRef, useEffect, FC } from "react";
import { NavLink, useParams, Redirect } from "react-router-dom";
import useSWR, { useSWRInfinite } from "swr";
import { IUser, IChat, IChannel } from "types/db";
import { fetcher } from "@components/utils/fetcher";
import ChatLayout from "@components/utils/chatLayout/ChatLayout";
import { OnChangeHandlerFunc } from "react-mentions";
import Chat from "@components/utils/Chat";
import axios from "axios";
import Scrollbars from "react-custom-scrollbars";
import makeSections from "@components/utils/MakeSections";
import useSocket from "@components/hooks/useSocket";
interface Props {
  updateChannelParams?: (channelName: string) => void;
}
const Channel: FC<Props> = (props) => {
  const PAGE_SIZE = 15;
  const { workspace, channel } = useParams<{
    workspace: string;
    channel: string;
  }>();
  const { data: myData } = useSWR("/api/users", fetcher);
  const { data: channelData } = useSWR<IChannel>(
    `/api/workspaces/${workspace}/channels/${channel}`,
    fetcher
  );
  const { data: channelMembersData } = useSWR<IUser[]>(
    myData ? `/api/workspaces/${workspace}/channels/${channel}/members` : null,
    fetcher
  );
  const {
    data: chatData,
    mutate: mutateChat,
    revalidate,
    setSize,
  } = useSWRInfinite<IChat[]>(
    (index) =>
      `/api/workspaces/${workspace}/channels/${channel}/chats?perPage=${PAGE_SIZE}&page=${
        index + 1
      }`,
    fetcher
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
    (data: IChat) => {
      if (data.Channel.name === channel && data.UserId !== myData?.id) {
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
    [channel, scrollBarRef.current, myData]
  );
  // useEffect(() => {
  //   props.updateChannelParams(channel);
  // }, [channel]);
  useEffect(() => {
    socket?.on("message", onMessage);
    return () => {
      socket?.off("message", onMessage);
    };
  }, [socket, onMessage]);
  useEffect(() => {
    if (chatData?.length === 1) {
      setTimeout(() => {
        scrollBarRef.current?.scrollToBottom();
      }, 100);
    }
    console.log("pop");
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
      if (input.trim() && chatData && channelData) {
        const savedChat = input;
        mutateChat((prevChatData) => {
          prevChatData?.[0].unshift({
            id: (chatData[0][0]?.id || 0) + 1,
            content: savedChat,
            UserId: myData.id,
            User: myData,
            ChannelId: channelData.id,
            Channel: channelData,
            createdAt: new Date(),
          });
          return prevChatData;
        }, false).then(() => {
          localStorage.setItem(
            `${workspace}-${channel}`,
            new Date().getTime().toString()
          );
          setInput("");
          scrollBarRef.current?.scrollToBottom();
        });

        axios
          .post(`/api/workspaces/${workspace}/channels/${channel}/chats`, {
            content: input,
          })
          .then(() => {
            revalidate();
          })
          .catch(console.error);
      }
    },
    [input, workspace, channel, chatData, myData, channelData]
  );
  if (!channelData || !myData) {
    return null;
  }
  return (
    <ChatLayout
      onSubmit={onSubmit}
      onChange={onChange}
      placeholder={`message on ${channelData?.name}`}
      value={input}
      scrollBarRef={scrollBarRef}
      setSize={setSize}
      isEmpty={isEmpty}
      isReachingEnd={isReachingEnd}
      channelMembersData={channelMembersData}
      revalidateChannel={revalidate}
    >
      <Chat data={chatSections} />
    </ChatLayout>
  );
};

export default Channel;

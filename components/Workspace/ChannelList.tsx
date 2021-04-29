import React, { useEffect, useState, FC } from "react";
import styled from "@emotion/styled";
import ChannelListLayout from "./ChanneListLayout";
import { useParams, NavLink, useLocation } from "react-router-dom";
import useSWR from "swr";
import { IUser, IChannel } from "types/db";
import { fetcher } from "@components/utils/fetcher";
interface Props {
  channelParams: string;
}
const ChannelList: FC<Props> = (props) => {
  const location = useLocation();
  const { workspace } = useParams<{
    workspace?: string;
  }>();
  const { data: userData } = useSWR<IUser>("/api/users", fetcher, {
    dedupingInterval: 2000,
  });
  const { data: channelData } = useSWR<IChannel[]>(
    userData ? `/api/workspaces/${workspace}/channels` : null,
    fetcher
  );
  const date = localStorage.getItem(`${workspace}-${props.channelParams}`) || 0;
  const { data: count, mutate } = useSWR<number>(
    userData
      ? `/api/workspaces/${workspace}/channels/${props.channelParams}/unreads?after=${date}`
      : null,
    fetcher
  );
  // useEffect(() => {
  //   if (
  //     location.pathname ===
  //     `/workspace/${workspace}/channel/${props.channelParams}`
  //   ) {
  //     mutate(0);
  //   }
  // }, [mutate, location.pathname, workspace, props.channelParams]);
  return (
    <ChannelListLayout listName="channels">
      {channelData?.map((channel, index) => {
        return (
          <ListItem key={index}>
            <NavLink
              key={`${channel.id}`}
              to={`/workspace/${workspace}/channel/${channel.name}`}
              activeStyle={{ fontWeight: "bold" }}
            >
              <span># {channel.name}</span>
              {count !== undefined && count > 0 && <Count>{count}</Count>}
            </NavLink>
          </ListItem>
        );
      })}
    </ChannelListLayout>
  );
};

export default ChannelList;

export const ListItem = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 6px 0;
  font-size: 1vw;
  &:hover {
    background: #ced4da;
  }
  & a {
    text-decoration: none;
    color: black;
  }
  @media screen and (max-width: 1025px) {
    font-size: 2vw;
  }
`;

export const Count = styled.span`
  /* position: absolute; */
  border-radius: 16px;
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  height: 18px;
  line-height: 18px;
  margin-left: 4px;
  padding: 0 9px;
  background: #cd2553;
`;

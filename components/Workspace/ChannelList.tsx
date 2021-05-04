import React, { useEffect, useState, FC, useCallback } from "react";
import styled from "@emotion/styled";
import ChannelListLayout from "./ChanneListLayout";
import { useParams, NavLink, useLocation } from "react-router-dom";
import useSWR from "swr";
import { IUser, IChannel } from "types/db";
import { fetcher } from "@components/utils/fetcher";
import UnreadChannelCount from "./UnreadChannelCount";
interface Props {
  channelParams: string;
}
const ChannelList: FC<Props> = (props) => {
  const [channelParam, setChannelParam] = useState("");
  const updateChannelParam = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      setChannelParam(e.currentTarget.id);
    },
    [channelParam]
  );
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

  return (
    <ChannelListLayout listName="channels">
      {channelData?.map((channel, index) => {
        return (
          <ListItem key={index}>
            <NavLink
              key={`${channel.id}`}
              to={`/workspace/${workspace}/channel/${channel.name}`}
              activeStyle={{ fontWeight: "bold" }}
              onClick={updateChannelParam}
              id={channel.name}
            >
              <span># {channel.name}</span>
              <UnreadChannelCount channelName={channel.name} />
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

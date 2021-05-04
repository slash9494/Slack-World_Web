import React, { FC } from "react";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import { fetcher } from "@components/utils/fetcher";
import styled from "@emotion/styled";
import { IUser } from "types/db";

interface Props {
  channelName: string;
}
const UnreadChannelCount: FC<Props> = (props) => {
  const { workspace } = useParams<{
    workspace?: string;
  }>();
  const { data: userData } = useSWR<IUser>("/api/users", fetcher, {
    dedupingInterval: 2000,
  });
  const date = localStorage.getItem(`${workspace}-${props.channelName}`) || 0;
  const { data: count, mutate } = useSWR<number>(
    userData
      ? `/api/workspaces/${workspace}/channels/${props.channelName}/unreads?after=${date}`
      : null,
    fetcher
  );
  return (
    <span>{count !== undefined && count > 0 && <Count>{count}</Count>}</span>
  );
};

export default UnreadChannelCount;

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
  color: white;
`;

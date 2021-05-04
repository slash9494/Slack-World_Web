import React, { FC } from "react";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import { IUser, IUserWithOnline } from "types/db";
import { fetcher } from "@components/utils/fetcher";
import { Count } from "./UnreadChannelCount";
interface Props {
  memberId: number;
}
const UnreadDmCount: FC<Props> = (props) => {
  const { workspace } = useParams<{ workspace?: string }>();
  const { data: userData } = useSWR<IUser>("/api/users", fetcher, {
    dedupingInterval: 2000,
  });
  const date = localStorage.getItem(`${workspace}-${props.memberId}`) || 0;
  const { data: count, mutate } = useSWR<number>(
    userData
      ? `/api/workspaces/${workspace}/dms/${props.memberId}/unreads?after=${date}`
      : null,
    fetcher
  );
  return (
    <span>{count !== undefined && count > 0 && <Count>{count}</Count>}</span>
  );
};

export default UnreadDmCount;

import React from "react";
import { NavLink, useParams } from "react-router-dom";
import useSWR from "swr";
import { IUser } from "types/db";
import { fetcher } from "@utils/fetcher";
import ChatLayout from "@components/utils/ChatLayout";

function DirectMessage() {
  const { workspace, id } = useParams<{ workspace?: string; id?: string }>();
  const { data: userData } = useSWR(
    `/api/workspaces/${workspace}/users/${id}`,
    fetcher
  );

  return (
    <ChatLayout
      nickname={userData?.nickname}
      email={userData?.email}
    ></ChatLayout>
  );
}

export default DirectMessage;

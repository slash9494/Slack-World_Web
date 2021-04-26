import React from "react";
import { NavLink, useParams } from "react-router-dom";
import useSWR from "swr";
import { IUser } from "types/db";
import { fetcher } from "@utils/fetcher";
import ChatLayout from "@components/utils/ChatLayout";

function DirectMessage() {
  const { workspace } = useParams<{ workspace?: string }>();
  const { data: userData } = useSWR<IUser>("/api/users", fetcher, {
    dedupingInterval: 2000, // 2초
  });

  return <ChatLayout></ChatLayout>;
}

export default DirectMessage;

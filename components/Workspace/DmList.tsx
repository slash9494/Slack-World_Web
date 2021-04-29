import React, { useState, useEffect, FC } from "react";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import { useParams, NavLink } from "react-router-dom";
import useSWR from "swr";
import { IUser, IUserWithOnline } from "types/db";
import { fetcher } from "@components/utils/fetcher";
import { makeStyles, createStyles, Theme } from "@material-ui/core";
import ChannelListLayout from "./ChanneListLayout";
import { ListItem, Count } from "./ChannelList";
import useSocket from "@components/hooks/useSocket";
interface Props {
  dmParams: string;
}
const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    CircleIcon: {
      fontSize: "0.7vw",
      [theme.breakpoints.down("md")]: {
        fontSize: "1.5vw",
      },
    },
  })
);

const DmList: FC<Props> = (props) => {
  const classes = useStyle();
  const { workspace } = useParams<{ workspace?: string }>();
  const { data: userData } = useSWR<IUser>("/api/users", fetcher, {
    dedupingInterval: 2000,
  });
  const { data: memberData } = useSWR<IUserWithOnline[]>(
    userData ? `/api/workspaces/${workspace}/members` : null,
    fetcher
  );
  const [onlineList, setOnlineList] = useState<number[]>([]);
  const [socket] = useSocket(workspace);
  const date = localStorage.getItem(`${workspace}-${props.dmParams}`) || 0;
  const { data: count, mutate } = useSWR<number>(
    userData
      ? `/api/workspaces/${workspace}/dms/${props.dmParams}/unreads?after=${date}`
      : null,
    fetcher
  );

  // useEffect(() => {
  //   if (location.pathname === `/workspace/${workspace}/dm/${props.dmParams}`) {
  //     mutate(0);
  //   }
  // }, [mutate, location.pathname, workspace, props.dmParams]);
  useEffect(() => {
    setOnlineList([]);
  }, [workspace]);
  useEffect(() => {
    socket?.on("onlineList", (data: number[]) => {
      setOnlineList(data);
    });
    return () => {
      socket?.off("onlineList");
    };
  }, [socket]);
  return (
    <ChannelListLayout listName="Direct Messages">
      {memberData?.map((member, index) => {
        return (
          <ListItem key={index}>
            <NavLink
              key={`${member.id}`}
              to={`/workspace/${workspace}/dm/${member.id}`}
              activeStyle={{ fontWeight: "bold" }}
            >
              {onlineList.includes(member.id) ? (
                <FiberManualRecordIcon
                  style={{ color: "#51cf66" }}
                  className={classes.CircleIcon}
                />
              ) : (
                <RadioButtonUncheckedIcon
                  style={{ color: "#adb5bd" }}
                  className={classes.CircleIcon}
                />
              )}
              <span>{member.nickname}</span>
              {member.id === userData?.id && <span> (나)</span>}
              {count !== undefined && count > 0 && <Count>{count}</Count>}
            </NavLink>
          </ListItem>
        );
      })}
    </ChannelListLayout>
  );
};

export default DmList;

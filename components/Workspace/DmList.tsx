import React, { useState } from "react";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import { useParams, NavLink } from "react-router-dom";
import useSWR from "swr";
import { IUser, IUserWithOnline } from "types/db";
import { fetcher } from "@utils/fetcher";
import { makeStyles, createStyles, Theme } from "@material-ui/core";
import ChannelListLayout from "./ChanneListLayout";
import { ListItem } from "./ChannelList";

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

function DmList() {
  const classes = useStyle();
  const { workspace } = useParams<{ workspace?: string }>();
  const { data: userData } = useSWR<IUser>("/api/users", fetcher, {
    dedupingInterval: 2000,
  });
  const { data: memberData } = useSWR<IUserWithOnline[]>(
    userData ? `/api/workspaces/${workspace}/members` : null,
    fetcher
  );
  return (
    <ChannelListLayout listName="Direct Messages">
      {memberData?.map((member) => {
        return (
          <ListItem>
            <NavLink
              key={`${member.id}`}
              to={`/workspace/${workspace}/dm/${member.id}`}
              activeStyle={{ fontWeight: "bold" }}
            >
              <FiberManualRecordIcon
                style={{ color: "#51cf66" }}
                className={classes.CircleIcon}
              />
              {member.nickname}
            </NavLink>
          </ListItem>
        );
      })}
      {/* <ListItem>
        <RadioButtonUncheckedIcon
          style={{ color: "#adb5bd" }}
          className={classes.CircleIcon}
        />
        mike
      </ListItem> */}
    </ChannelListLayout>
  );
}

export default DmList;

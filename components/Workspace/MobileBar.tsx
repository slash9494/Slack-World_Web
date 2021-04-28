import React, { FC, useState, useCallback, useEffect } from "react";
import styled from "@emotion/styled";
import HomeRoundedIcon from "@material-ui/icons/HomeRounded";
import { Link, useParams, NavLink } from "react-router-dom";
import MenuDrop from "@components/utils/MenuDrop";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import { Paper } from "@material-ui/core";
import useSWR from "swr";
import { IUser, IUserWithOnline } from "types/db";
import { fetcher } from "@utils/fetcher";
import useSocket from "@components/hooks/useSocket";
interface Props {
  DMListOpen: boolean;
  CHListOpen: boolean;
  handleOpen: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}
const BarContainer = styled.div`
  width: 100vw;
  height: 80px;
  position: fixed;
  bottom: 0;
  border-top: 1px solid #e3e3e3;
  display: flex;
  @media screen and (min-width: 500px) {
    display: none;
  }
`;
const ListContainer = styled.div`
  width: 45%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const IconContainer = styled.div`
  font-size: 20px;
`;
const ItemListContainer = styled.div`
  width: 150px;
  height: 200px;
  overflow: scroll;
  display: flex;
  flex-direction: column;
  padding: 10px;
  & a {
    text-decoration: none;
    color: black;
    display: flex;
    align-items: center;
    padding: 5px 0;
    width: 100%;
    overflow: hidden;
  }
`;
const ItemContainer = styled.div`
  display: flex;
  align-items: center;
`;

const MobileBar: FC<Props> = (props) => {
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
    <BarContainer>
      <ListContainer>
        <IconContainer>
          <Link to="/" style={{ color: "black", padding: "10px 0" }}>
            <HomeRoundedIcon />
          </Link>
        </IconContainer>
      </ListContainer>
      <ListContainer>
        <MenuDrop
          menuIcon={<IconContainer>DM</IconContainer>}
          open={props.DMListOpen}
          handleOpen={props.handleOpen}
          id="DMListOpen"
        >
          <Paper>
            <ItemListContainer>
              {memberData?.map((member) => {
                return (
                  <NavLink
                    key={`${member.id}`}
                    to={`/workspace/${workspace}/dm/${member.id}`}
                    activeStyle={{ fontWeight: "bold" }}
                  >
                    <ItemContainer>
                      {onlineList.includes(member.id) ? (
                        <FiberManualRecordIcon
                          style={{ color: "#51cf66", fontSize: "15px" }}
                        />
                      ) : (
                        <RadioButtonUncheckedIcon
                          style={{ color: "#adb5bd", fontSize: "13px" }}
                        />
                      )}
                      {member.nickname}
                    </ItemContainer>
                  </NavLink>
                );
              })}
            </ItemListContainer>
          </Paper>
        </MenuDrop>
      </ListContainer>
      <ListContainer>
        <IconContainer>CH</IconContainer>
      </ListContainer>
      <ListContainer>
        <IconContainer>+</IconContainer>
      </ListContainer>
    </BarContainer>
  );
};

export default MobileBar;

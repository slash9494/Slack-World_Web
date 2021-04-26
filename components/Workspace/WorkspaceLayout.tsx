import React, { useState, useCallback, useEffect } from "react";
import {
  createStyles,
  makeStyles,
  useTheme,
  Theme,
} from "@material-ui/core/styles";
import gravatar from "gravatar";
import List from "@material-ui/core/List";
import IconButton from "@material-ui/core/IconButton";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import styled from "@emotion/styled";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import { Switch, Route, Redirect, useParams, Link } from "react-router-dom";
import Channel from "@pages/Channel";
import DirectMessage from "@pages/DirectMessage";
import Button from "@material-ui/core/Button";
import ModalContainer from "../utils/Modal";
import WorkspaceModal from "../modal/WorkspaceModal";
import { fetcher } from "@utils/fetcher";
import useSWR from "swr";
import { IUser, IWorkspace } from "types/db";
import MenuDrop from "../utils/MenuDrop";
import WorkspaceDrawer from "./Drawer";
import WorkspaceAppBar from "./AppBar";
import axios from "axios";
import UserInfo from "./UserInfo";
import { Paper } from "@material-ui/core";
import WorkspaceName from "./WorkspaceName";
import ChannelList from "./ChannelList";
import DmList from "./DmList";
import MobileBar from "./MobileBar";
const AppContainer = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
`;
const ChannelContainer = styled.div`
  width: 17vw;
  height: calc(100vh - 64px);
  top: 64;
  position: relative;
  border-right: 1px solid #e3e3e3;
  @media screen and (max-width: 500px) {
    display: none;
  }
`;
const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;
const ChatContents = styled.div``;
const WorkspaceListIcon = styled.div`
  min-width: 56px;
`;
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: theme.spacing(0, 1),
      ...theme.mixins.toolbar,
    },
    avatar: {
      color: theme.palette.getContrastText("#5c7cfa"),
      backgroundColor: "#4c6ef5",
    },
  })
);
function WorkspaceLayout() {
  const params = useParams<{ workspace?: string }>();
  const { workspace } = params;
  const { data: userData, error, revalidate: revalidateUser, mutate } = useSWR<
    IUser | false
  >("/api/users", fetcher);
  const classes = useStyles();
  const theme = useTheme();
  const [drawerWsName, setDrawerWsName] = useState(false);
  const [open, setOpen] = useState({
    drawerOpen: false,
    workspaceModalOpen: false,
    channelModalOpen: false,
    wsNameDropOpen: false,
    userMenuOpen: false,
  });
  const {
    drawerOpen,
    workspaceModalOpen,
    channelModalOpen,
    wsNameDropOpen,
    userMenuOpen,
  } = open;
  const handleOpen = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation();
      const name = e.currentTarget.id;
      setOpen({
        ...open,
        [name]: true,
      });
    },
    [open]
  );
  const handleClose = useCallback(() => {
    setOpen({
      drawerOpen: false,
      workspaceModalOpen: false,
      wsNameDropOpen: false,
      channelModalOpen: false,
      userMenuOpen: false,
    });
  }, [open]);
  const handleLogout = () => {
    axios.post("/api/users/logout", null).then(() => {
      mutate(false);
    });
  };
  useEffect(() => {
    function resizeWidth() {
      if (window.innerWidth < 500) {
        setDrawerWsName(true);
      } else {
        setDrawerWsName(false);
      }
    }
    if (window.innerWidth < 500) {
      setDrawerWsName(true);
    } else {
      setDrawerWsName(false);
    }
    window.addEventListener("resize", resizeWidth);
    return () => window.removeEventListener("resize", resizeWidth);
  }, []);
  if (userData === false) {
    return <Redirect to="/home" />;
  }

  return (
    <AppContainer onClick={handleClose}>
      <WorkspaceAppBar drawerOpen={drawerOpen} handleOpen={handleOpen}>
        {userData !== undefined ? (
          <div style={{ position: "absolute", right: "0" }}>
            <MenuDrop
              menuIcon={
                <img
                  src={gravatar.url(userData?.email, { s: "28px", d: "mp" })}
                  alt={userData?.nickname}
                />
              }
              open={userMenuOpen}
              handleOpen={handleOpen}
              id="userMenuOpen"
            >
              <Paper>
                <UserInfo userData={userData} handleLogout={handleLogout} />
              </Paper>
            </MenuDrop>
          </div>
        ) : (
          <div />
        )}
      </WorkspaceAppBar>
      <WorkspaceDrawer drawerOpen={drawerOpen}>
        <div className={classes.toolbar}>
          <IconButton onClick={handleClose} id="drawerOpen">
            {theme.direction === "rtl" ? null : (
              <>
                {drawerWsName ? (
                  <WorkspaceName
                    userData={userData}
                    url={workspace}
                    dropOpen={wsNameDropOpen}
                    handleOpen={handleOpen}
                  />
                ) : null}
                <ChevronLeftIcon />
              </>
            )}
          </IconButton>
        </div>
        <List>
          {userData?.Workspaces.map((ws: IWorkspace) => {
            return (
              <ListItem button key={ws.id} style={{ padding: "10px 10px" }}>
                <Link
                  key={ws.id}
                  to={`/workspace/${ws.url}/channel/일반`}
                  style={{ textDecoration: "none", display: "flex" }}
                >
                  <WorkspaceListIcon>
                    <Avatar className={classes.avatar}>{ws.name[0]}</Avatar>
                  </WorkspaceListIcon>
                  <ListItemText style={{ color: "#4c6ef5" }}>
                    {ws.name}
                  </ListItemText>
                </Link>
              </ListItem>
            );
          })}
          <ListItem style={{ padding: "10px 10px" }}>
            <Avatar className={classes.avatar}>
              <Button
                onClick={handleOpen}
                id="workspaceModalOpen"
                style={{
                  color: "white",
                  fontSize: "20px",
                  paddingBottom: "10px",
                }}
              >
                +
              </Button>
            </Avatar>
            <ListItemText>
              {" "}
              <Button
                variant="outlined"
                color="primary"
                style={{ marginLeft: "17px" }}
                onClick={handleOpen}
                id="workspaceModalOpen"
              >
                워크스페이스 추가
              </Button>
            </ListItemText>
          </ListItem>
        </List>
      </WorkspaceDrawer>
      <ChannelContainer>
        {drawerWsName ? null : (
          <WorkspaceName
            userData={userData}
            url={workspace}
            dropOpen={wsNameDropOpen}
            handleOpen={handleOpen}
          />
        )}
        <ChannelList />
        <DmList />
      </ChannelContainer>
      <ChatContainer>
        <div className={classes.toolbar} />
        <ChatContents>
          <Switch>
            <Route
              path="/workspace/:workspace/channel/:channel"
              component={Channel}
            />
            <Route
              path="/workspace/:workspace/dm/:id"
              component={DirectMessage}
            />
          </Switch>
        </ChatContents>
      </ChatContainer>
      <ModalContainer open={workspaceModalOpen}>
        <WorkspaceModal
          closeModal={handleClose}
          revalidateUser={revalidateUser}
        />
      </ModalContainer>
      <MobileBar />
    </AppContainer>
  );
}

export default WorkspaceLayout;

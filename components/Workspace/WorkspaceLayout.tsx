import React, { useState, useCallback, useEffect } from "react";
import gravatar from "gravatar";
import {
  List,
  IconButton,
  ListItem,
  ListItemText,
  Avatar,
  Button,
  createStyles,
  Paper,
  makeStyles,
  useTheme,
  Theme,
} from "@material-ui/core";
import styled from "@emotion/styled";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import { Switch, Route, Redirect, useParams, Link } from "react-router-dom";
import Channel from "@pages/Channel";
import DirectMessage from "@pages/DirectMessage";
import ModalContainer from "../utils/Modal";
import CreateWorkspaceModal from "../modal/CreateWorkspaceModal";
import { fetcher } from "@components/utils/fetcher";
import useSWR from "swr";
import { IUser, IWorkspace, IChannel } from "types/db";
import MenuDrop from "../utils/MenuDrop";
import WorkspaceDrawer from "./Drawer";
import WorkspaceAppBar from "./AppBar";
import UserInfo from "./UserInfo";
import WorkspaceName from "./WorkspaceName";
import ChannelList from "./ChannelList";
import DmList from "./DmList";
import MobileBar from "./MobileBar";
import useSocket from "@components/hooks/useSocket";
function WorkspaceLayout() {
  const { workspace } = useParams<{
    workspace?: string;
  }>();
  const { data: userData, error, revalidate: revalidateUser, mutate } = useSWR<
    IUser | false
  >("/api/users", fetcher);
  const { data: channelData } = useSWR<IChannel[]>(
    userData ? `/api/workspaces/${workspace}/channels` : null,
    fetcher
  );
  const classes = useStyles();
  const theme = useTheme();
  const [socket, disconnect] = useSocket(workspace);
  const [channelParams, setChannelParams] = useState("");
  const [dmParams, setDmParams] = useState("");
  const [drawerWsName, setDrawerWsName] = useState(false);
  const [open, setOpen] = useState({
    drawerOpen: false,
    workspaceModalOpen: false,
    wsNameDropOpen: false,
    userMenuOpen: false,
    DMListOpen: false,
    CHListOpen: false,
  });
  const {
    drawerOpen,
    workspaceModalOpen,
    wsNameDropOpen,
    userMenuOpen,
    DMListOpen,
    CHListOpen,
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
      userMenuOpen: false,
      DMListOpen: false,
      CHListOpen: false,
    });
  }, [open]);
  useEffect(() => {
    function resizeWidth() {
      if (window.innerWidth <= 600) {
        setDrawerWsName(true);
      } else {
        setDrawerWsName(false);
      }
    }
    if (window.innerWidth <= 600) {
      setDrawerWsName(true);
    } else {
      setDrawerWsName(false);
    }
    window.addEventListener("resize", resizeWidth);
    return () => window.removeEventListener("resize", resizeWidth);
  }, []);

  useEffect(() => {
    if (userData && channelData) {
      socket?.emit("login", {
        id: userData?.id,
        channels: channelData?.map((v) => v.id),
      });
    }
  }, [socket, userData, channelData]);
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [workspace, disconnect]);
  if (userData === false) {
    return <Redirect to="/home" />;
  }

  return (
    <AppContainer onClick={handleClose}>
      {userData !== undefined ? (
        <>
          {" "}
          <WorkspaceAppBar drawerOpen={drawerOpen} handleOpen={handleOpen}>
            <>
              <div style={{ position: "absolute", right: "0" }}>
                <MenuDrop
                  menuIcon={
                    <img
                      src={gravatar.url(userData?.email, {
                        s: "28px",
                        d: "mp",
                      })}
                      alt={userData?.nickname}
                    />
                  }
                  open={userMenuOpen}
                  handleOpen={handleOpen}
                  id="userMenuOpen"
                >
                  <Paper>
                    <UserInfo userData={userData} mutate={mutate} />
                  </Paper>
                </MenuDrop>
              </div>
            </>
          </WorkspaceAppBar>
          <WorkspaceDrawer drawerOpen={drawerOpen}>
            <div className={classes.toolbar}>
              <IconButton
                onClick={handleClose}
                id="drawerOpen"
                className={classes.drawerHeader}
              >
                {theme.direction === "rtl" ? null : (
                  <>
                    {" "}
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
            <ChannelList channelParams={channelParams} />
            <DmList dmParams={dmParams} />
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
            <CreateWorkspaceModal
              closeModal={handleClose}
              revalidateUser={revalidateUser}
            />
          </ModalContainer>
          <MobileBar
            DMListOpen={DMListOpen}
            CHListOpen={CHListOpen}
            handleOpen={handleOpen}
          />
        </>
      ) : null}
    </AppContainer>
  );
}

export default WorkspaceLayout;

const AppContainer = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
`;
const ChannelContainer = styled.div`
  width: 19vw;
  height: calc(100vh - 64px);
  top: 64;
  position: relative;
  border-right: 1px solid #e3e3e3;
  @media screen and (max-width: 500px) {
    display: none;
  }
`;
const ChatContainer = styled.div`
  width: 100%;
  height: 100vh;
`;
const ChatContents = styled.div`
  display: flex;
  height: calc(100vh - 64px);
  flex-flow: column wrap;
  position: relative;
  @media screen and (max-width: 500px) {
    height: calc(100vh - 134px);
  }
`;
const WorkspaceListIcon = styled.div`
  min-width: 56px;
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      ...theme.mixins.toolbar,
    },
    avatar: {
      color: theme.palette.getContrastText("#5c7cfa"),
      backgroundColor: "#4c6ef5",
    },
    drawerHeader: {
      [theme.breakpoints.down("xs")]: {
        width: "100%",
        justifyContent: "space-between",
      },
    },
  })
);

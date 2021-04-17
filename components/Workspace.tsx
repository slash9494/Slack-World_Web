import React, { useState, useCallback } from "react";
import clsx from "clsx";
import {
  createStyles,
  makeStyles,
  useTheme,
  Theme,
} from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import styled from "@emotion/styled";
import CssBaseline from "@material-ui/core/CssBaseline";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import { Switch, Route } from "react-router-dom";
import Channel from "@pages/Channel";
import DirectMessage from "@pages/DirectMessage";
import Button from "@material-ui/core/Button";
import ModalContainer from "./utils/Modal";
import WorkspaceModal from "./modal/WorkspaceModal";

const AppContainer = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
`;
const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
const ChatContents = styled.div``;
const drawerWidth = 240;
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      background: "#4c6ef5",
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 36,
    },
    hide: {
      display: "none",
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: "nowrap",
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: "hidden",
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9) + 1,
      },
    },
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
function Workspace() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState({
    drawerOpen: false,
    workspaceModalOpen: false,
    channelModalOpen: false,
    userMenuOpen: false,
  });
  const {
    drawerOpen,
    workspaceModalOpen,
    channelModalOpen,
    userMenuOpen,
  } = open;
  const handleOpen = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const value = e.currentTarget.id;
      setOpen({
        ...open,
        [value]: true,
      });
    },
    [open]
  );
  const handleClose = useCallback(() => {
    setOpen({
      drawerOpen: false,
      workspaceModalOpen: false,
      channelModalOpen: false,
      userMenuOpen: false,
    });
  }, [open]);

  return (
    <AppContainer>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: drawerOpen,
        })}
      >
        <Toolbar>
          <IconButton
            id="drawerOpen"
            color="inherit"
            onClick={handleOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: drawerOpen,
            })}
          >
            <MenuIcon />
          </IconButton>
          <div>Mini variant drawer</div>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: drawerOpen,
          [classes.drawerClose]: !drawerOpen,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: drawerOpen,
            [classes.drawerClose]: !drawerOpen,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <Button
            variant="outlined"
            color="primary"
            style={{ position: "absolute", left: "15" }}
            onClick={handleOpen}
            id="workspaceModalOpen"
          >
            워크스페이스 추가
          </Button>
          <IconButton onClick={handleClose} id="drawerOpen">
            {theme.direction === "rtl" ? null : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <List>
          {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
            <ListItem button key={text}>
              <div style={{ minWidth: "56px" }}>
                <Avatar className={classes.avatar}>N</Avatar>
              </div>
              <ListItemText>Naver</ListItemText>
            </ListItem>
          ))}
        </List>
      </Drawer>
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
      <ModalContainer open={workspaceModalOpen} handleClose={handleClose}>
        <WorkspaceModal />
      </ModalContainer>
    </AppContainer>
  );
}

export default Workspace;

import React, { ReactElement } from "react";
import {
  makeStyles,
  createStyles,
  AppBar,
  Theme,
  Toolbar,
  IconButton,
} from "@material-ui/core";
import clsx from "clsx";
import MenuIcon from "@material-ui/icons/Menu";
import styled from "@emotion/styled";
interface Props {
  children: ReactElement<any, any> | undefined;
  drawerOpen: boolean;
  handleOpen: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}
const drawerWidth = 240;
const Logo = styled.div`
  width: calc(100vw - 32px);
  @media screen and (max-width: 600px) {
    width: calc(100vw - 48px);
  }
  text-align: center;
  font-weight: bold;
  font-size: 20px;
  position: absolute;
`;
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
      padding: 5,
      zIndex: 1,
      [theme.breakpoints.down("xs")]: {
        padding: 12,
      },
    },
    hide: {
      display: "none",
    },
  })
);
function WorkspaceAppBar({ children, drawerOpen, handleOpen }: Props) {
  const classes = useStyles();
  return (
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
        {drawerOpen ? null : (
          <>
            {" "}
            <Logo>SLACK</Logo>
            {children}
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default WorkspaceAppBar;

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
interface Props {
  children: ReactElement<any, any> | undefined;
  drawerOpen: boolean;
  handleOpen: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}
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
        <div>SLACK</div>
        {children}
      </Toolbar>
    </AppBar>
  );
}

export default WorkspaceAppBar;

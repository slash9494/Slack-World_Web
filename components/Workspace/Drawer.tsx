import React, { ReactElement } from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core";
import Drawer from "@material-ui/core/Drawer";
import clsx from "clsx";
interface Props {
  children: ReactElement<any, any>[] | undefined;
  drawerOpen: boolean;
}

const drawerWidth = 240;
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
      [theme.breakpoints.down("md")]: {
        width: 0,
        border: "transparent",
      },
    },
  })
);
function WorkspaceDrawer({ children, drawerOpen }: Props) {
  const classes = useStyles();
  return (
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
      {children}{" "}
    </Drawer>
  );
}

export default WorkspaceDrawer;

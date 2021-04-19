import React, { useEffect, ReactElement, FC, useRef, useCallback } from "react";
import { Popper, Grow, ClickAwayListener, Button } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
interface Props {
  children: ReactElement<any, any> | undefined;
  menuIcon: any;
  open: boolean;
  handleOpen: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  id: string;
}
const MenuDrop: FC<Props> = ({ children, menuIcon, open, handleOpen, id }) => {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const prevOpen = useRef(open);

  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus();
    }
    prevOpen.current = open;
  }, [open]);
  const stopPropagation = useCallback((e) => {
    console.log("stop");
    e.preventDefault();
    e.stopPropagation();
  }, []);
  return (
    <>
      <Button ref={anchorRef} onClick={handleOpen} id={id}>
        {menuIcon}
      </Button>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        transition
        onClick={stopPropagation}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            {children}
          </Grow>
        )}
      </Popper>
    </>
  );
};

export default MenuDrop;

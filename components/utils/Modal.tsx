import React, { FC, ReactElement, useState, useCallback } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
interface Props {
  children: ReactElement<any, any> | undefined;
  open: boolean;
  handleClose?: () => void;
}

const ModalContainer: FC<Props> = ({ children, open, handleClose }) => {
  const useStyles = makeStyles(() =>
    createStyles({
      modal: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
    })
  );
  const classes = useStyles();

  return (
    <Modal
      className={classes.modal}
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>{children}</Fade>
    </Modal>
  );
};

export default ModalContainer;

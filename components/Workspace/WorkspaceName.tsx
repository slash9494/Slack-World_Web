import React, { VFC, useState, useCallback } from "react";
import styled from "@emotion/styled";
import MenuDrop from "@components/utils/MenuDrop";
import { Paper, makeStyles, Theme, createStyles } from "@material-ui/core";
import { IUser } from "types/db";
import ModalContainer from "@components/utils/Modal";
import InviteWorkspaceModal from "@components/modal/InviteWorkspaceModal";
import CreateChannelModal from "@components/modal/CreateChannelModal";
interface Props {
  userData: IUser | undefined;
  url: string | undefined;
  dropOpen: boolean;
  handleOpen: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const WorkspaceNameContainer = styled.div`
  width: 100%;
  height: 10%;
  padding: 0 20px;
  background: #4c6ef5;
  display: flex;
  margin-right: 80px;
  @media screen and (max-width: 1025px) {
    height: 7%;
  }
  @media screen and (max-width: 600px) {
    border-radius: 4px;
    width: fit-content;
  }
`;
const NameStyle = styled.span`
  font-weight: bold;
  color: white;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 2vw;
  @media screen and (max-width: 600px) {
    font-size: 15px;
  }
`;
const DropContainer = styled.div`
  width: 17vw;
  display: flex;
  align-items: center;
  flex-direction: column;
  min-width: 200px;
`;
const DropItem = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 5px 0;
  cursor: pointer;
  &:hover {
    background: #ced4da;
  }
`;
const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      marginLeft: "51px",
      [theme.breakpoints.down("md")]: {
        marginLeft: "-5px",
      },
    },
  })
);
const WorkspaceName: VFC<Props> = (props) => {
  const classes = useStyle();

  const [modalOpen, setModalOpen] = useState({
    inviteWorkspaceOpen: false,
    createChannelOpen: false,
  });
  const { inviteWorkspaceOpen, createChannelOpen } = modalOpen;
  const handelModalOpen = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const name = e.currentTarget.id;
      setModalOpen({
        ...modalOpen,
        [name]: true,
      });
    },
    []
  );
  const onClose = useCallback(() => {
    setModalOpen({
      inviteWorkspaceOpen: false,
      createChannelOpen: false,
    });
  }, [open]);
  return (
    <WorkspaceNameContainer>
      <MenuDrop
        menuIcon={
          <NameStyle style={{ fontWeight: "bold", color: "white" }}>
            {
              props.userData?.Workspaces.find((ws) => ws.url === props.url)
                ?.name
            }
          </NameStyle>
        }
        open={props.dropOpen}
        handleOpen={props.handleOpen}
        id="wsNameDropOpen"
      >
        <Paper className={classes.paper}>
          {" "}
          <DropContainer>
            <DropItem onClick={handelModalOpen} id="inviteWorkspaceOpen">
              워크스페이스에 사용자 초대
            </DropItem>
            <DropItem onClick={handelModalOpen} id="createChannelOpen">
              채널 만들기
            </DropItem>
          </DropContainer>
        </Paper>
      </MenuDrop>
      <ModalContainer open={inviteWorkspaceOpen} handleClose={onClose}>
        <InviteWorkspaceModal onClose={onClose} />
      </ModalContainer>
      <ModalContainer open={createChannelOpen} handleClose={onClose}>
        <CreateChannelModal closeModal={onClose} />
      </ModalContainer>
    </WorkspaceNameContainer>
  );
};

export default WorkspaceName;

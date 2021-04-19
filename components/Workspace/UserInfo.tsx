import React from "react";
import styled from "@emotion/styled";
import gravatar from "gravatar";
import { IUser } from "types/db";
import { Button } from "@material-ui/core";
interface Props {
  userData: IUser;
  handleLogout: () => void;
}
const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

function UserInfo(props: Props) {
  return (
    <Container>
      <img
        src={gravatar.url(props.userData?.email, { s: "36px", d: "mp" })}
        alt={props.userData?.nickname}
      />
      <div style={{ padding: "5px 0" }}>{props.userData?.nickname}</div>
      <Button
        variant="outlined"
        color="primary"
        // style={{ marginLeft: "17px" }}
        onClick={props.handleLogout}
        id="workspaceModalOpen"
      >
        로그아웃
      </Button>
    </Container>
  );
}

export default UserInfo;

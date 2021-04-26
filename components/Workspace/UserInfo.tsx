import React from "react";
import styled from "@emotion/styled";
import gravatar from "gravatar";
import { IUser } from "types/db";
import { Button } from "@material-ui/core";
import axios from "axios";
interface Props {
  userData: IUser;
  mutate: (data?: false | IUser) => Promise<any>;
}
const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

function UserInfo(props: Props) {
  const handleLogout = () => {
    axios.post("/api/users/logout", null).then(() => {
      props.mutate(false);
    });
  };
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
        onClick={handleLogout}
        id="workspaceModalOpen"
      >
        로그아웃
      </Button>
    </Container>
  );
}

export default UserInfo;

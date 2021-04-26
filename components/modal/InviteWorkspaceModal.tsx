import React, { FC, useCallback, useState } from "react";
import { FormContainer, Form } from "@components/utils/FormLayout";
import { TextField, Button } from "@material-ui/core";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import axios from "axios";
import useSWR from "swr";
import { IUser } from "types/db";
import { fetcher } from "@utils/fetcher";
interface Props {
  onClose: () => void;
}

const InviteWorkspaceModal: FC<Props> = (props) => {
  const { workspace } = useParams<{ workspace: string; channel: string }>();
  const { data: userData } = useSWR<IUser>("/api/users", fetcher);
  const { revalidate: revalidateMember } = useSWR<IUser[]>(
    userData ? `/api/workspaces/${workspace}/members` : null,
    fetcher
  );
  const [input, setInput] = useState("");
  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setInput(value);
    },
    [input]
  );
  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!input || !input.trim()) {
        return Swal.fire("이메일을 입력하세요", ``, "info");
      }
      axios
        .post(`/api/workspaces/${workspace}/members`, {
          email: input,
        })
        .then(() => {
          props.onClose();
          revalidateMember();
          setInput("");
        })
        .catch((error) => {
          console.dir(error);
          Swal.fire(
            "사용자 초대에 실패했습니다.",
            `${error.response?.data}`,
            "error"
          );
        });
    },
    [input, workspace]
  );
  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);
  return (
    <FormContainer onClick={stopPropagation}>
      <Form onSubmit={onSubmit}>
        <TextField
          label="사용자 이메일"
          type="email"
          name="email"
          onChange={onChange}
          value={input}
        />
        <Button variant="outlined" type="submit" style={{ marginTop: "20px" }}>
          초대하기
        </Button>
      </Form>
    </FormContainer>
  );
};

export default InviteWorkspaceModal;

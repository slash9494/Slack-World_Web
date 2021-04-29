import React, { FC, useCallback, useState } from "react";
import { FormContainer, Form } from "@components/utils/FormLayout";
import { TextField, Button } from "@material-ui/core";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import axios from "axios";
import useSWR from "swr";
import { IUser, IChannel } from "types/db";
import { fetcher } from "@components/utils/fetcher";
interface Props {
  closeModal: () => void;
}
const CreateChannelModal: FC<Props> = (props) => {
  const { workspace } = useParams<{ workspace: string }>();
  const { data: userData } = useSWR<IUser | false>("/api/users", fetcher, {
    dedupingInterval: 2000, // 2초
  });
  const { data: channelData, mutate, revalidate: revalidateChannel } = useSWR<
    IChannel[]
  >(userData ? `/api/workspaces/${workspace}/channels` : null, fetcher);
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
        return Swal.fire("채널이름을 입력해주세요.", "", "info");
      }
      axios
        .post(`/api/workspaces/${workspace}/channels`, {
          name: input,
        })
        .then(() => {
          setInput("");
          props.closeModal();
          revalidateChannel();
        })
        .catch((error) => {
          console.dir(error);
          Swal.fire(`${error.response?.data}`, "", "error");
        });
    },
    [input]
  );
  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);
  return (
    <FormContainer onClick={stopPropagation}>
      <Form onSubmit={onSubmit}>
        <TextField
          label="채널 이름"
          type="text"
          onChange={onChange}
          value={input}
        />
        <br />
        <Button variant="outlined" type="submit" style={{ marginTop: "20px" }}>
          생성하기
        </Button>
      </Form>
    </FormContainer>
  );
};

export default CreateChannelModal;

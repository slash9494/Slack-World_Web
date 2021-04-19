import React, { useState, useCallback } from "react";
import { Form, FormContainer } from "@components/utils/FormLayout";
import { TextField, Button } from "@material-ui/core";
import Swal from "sweetalert2";
import axios from "axios";
interface Props {
  closeModal: () => void;
  revalidateUser: () => Promise<boolean>;
}
function WorkspaceModal(props: Props) {
  const [inputs, setInputs] = useState({
    name: "",
    address: "",
  });
  const { name, address } = inputs;
  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value, name } = e.target;
      setInputs({
        ...inputs,
        [name]: value,
      });
    },
    [inputs]
  );
  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!name || !name.trim() || !address || !address.trim()) {
        return Swal.fire("빈칸을 모두 채워주세요.", "", "info");
      }
      axios
        .post("/api/workspaces", {
          workspace: name,
          url: address,
        })
        .then(() => {
          setInputs({ name: "", address: "" });
          props.closeModal();
          props.revalidateUser();
        })
        .catch((error) => {
          console.dir(error);
          Swal.fire(`${error.response?.data}`, "", "error");
        });
    },
    [name, address]
  );
  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);
  return (
    <FormContainer onClick={stopPropagation}>
      <Form onSubmit={onSubmit}>
        <TextField
          label="워크스페이스 이름"
          type="name"
          name="name"
          onChange={onChange}
          value={name}
        />
        <TextField
          label="워크스테이스 url"
          type="address"
          name="address"
          onChange={onChange}
          value={address}
        />
        <br />
        <Button variant="outlined" type="submit" style={{ marginTop: "20px" }}>
          생성하기
        </Button>
      </Form>
    </FormContainer>
  );
}

export default WorkspaceModal;

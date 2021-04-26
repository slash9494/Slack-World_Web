import React, { FC, useCallback, useState } from "react";
import { FormContainer, Form } from "@components/utils/FormLayout";
import { TextField, Button } from "@material-ui/core";
interface Props {
  onClose: () => void;
}

const InviteWorkspaceModal: FC<Props> = () => {
  const [inputs, setInputs] = useState("");
  const onChange = useCallback(() => {}, []);
  const onSubmit = useCallback(() => {}, []);
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
        />
        <Button variant="outlined" type="submit" style={{ marginTop: "20px" }}>
          초대하기
        </Button>
      </Form>
    </FormContainer>
  );
};

export default InviteWorkspaceModal;

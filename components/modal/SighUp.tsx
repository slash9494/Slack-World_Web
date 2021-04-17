import React, { useState, useCallback } from "react";
import { FormContainer, Form, ErrorText } from "@components/utils/FormLayout";
import Swal from "sweetalert2";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import useSWR from "swr";
import { fetcher } from "@utils/fetcher";

interface Props {
  setSignUpSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

function SighUp(props: Props) {
  const { data: userData, error, revalidate } = useSWR("/api/users", fetcher);
  const [misMatchPassword, setMisMatchPassword] = useState(false);
  const [signUpError, setSignUpError] = useState("");
  const [inputs, setInputs] = useState({
    email: "",
    nickname: "",
    password: "",
    passwordCheck: "",
  });
  const { email, nickname, password, passwordCheck } = inputs;
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
  const setPasswordCheck = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputs({ ...inputs, passwordCheck: e.target.value });
      setMisMatchPassword(password === e.target.value);
    },
    [password, passwordCheck, inputs]
  );
  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSignUpError("");
      if (
        !nickname ||
        !nickname.trim() ||
        !password ||
        !misMatchPassword ||
        !email
      ) {
        return Swal.fire("입력이 올바르지 않습니다.", "", "error");
      }
      axios
        .post("/api/users", { email, nickname, password })
        .then(() => {
          props.setSignUpSuccess(true);
          Swal.fire("회원가입을 완료했습니다.", "", "success");
        })
        .catch((error) => {
          setSignUpError(error.response?.data);
        });
    },
    [inputs]
  );
  if (userData) {
    Swal.fire("이미 로그인이 되어있습니다", "", "info");
    props.setSignUpSuccess(true);
  }
  console.log(userData);
  return (
    <FormContainer>
      <Form onSubmit={onSubmit}>
        <TextField
          label="이메일주소"
          type="email"
          name="email"
          onChange={onChange}
          value={email}
        />
        <TextField
          label="아이디"
          type="text"
          name="nickname"
          onChange={onChange}
          value={nickname}
        />
        <TextField
          label="비밀번호"
          type="password"
          name="password"
          onChange={onChange}
          value={password}
        />
        <TextField
          label="비밀번호 확인"
          type="password"
          name="passwordCheck"
          onChange={setPasswordCheck}
          value={passwordCheck}
        />
        {misMatchPassword ? null : (
          <ErrorText>비밀번호가 일치하지 않습니다.</ErrorText>
        )}
        {signUpError ? <ErrorText>{signUpError}</ErrorText> : null}
        <Button variant="outlined" type="submit" style={{ marginTop: "20px" }}>
          회원가입
        </Button>
      </Form>
    </FormContainer>
  );
}

export default SighUp;

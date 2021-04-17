import React, { useState } from "react";
import axios from "axios";
import {
  FormContainer,
  FormButton,
  Form,
  ErrorText,
} from "@components/utils/FormLayout";
import { Button, TextField } from "@material-ui/core";
import useSWR from "swr";
import { fetcher } from "@utils/fetcher";
import { Redirect } from "react-router-dom";

function LogIn() {
  const { data: userData, error, revalidate } = useSWR("/api/users", fetcher);
  const [loginError, setLoginError] = useState("");
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const { email, password } = inputs;
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError("");
    axios
      .post(
        "/api/users/login",
        { email, password },
        {
          withCredentials: true,
        }
      )
      .then(() => {
        revalidate();
      })
      .catch((error) => {
        setLoginError(error.response?.data);
      });
  };
  if (!error && userData) {
    return <Redirect to="/workspace/slack/channel/일반" />;
  }

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
          label="비밀번호"
          type="password"
          name="password"
          onChange={onChange}
          value={password}
        />
        <br />
        <Button variant="outlined" type="submit" style={{ marginTop: "20px" }}>
          로그인
        </Button>
        {loginError ? <ErrorText>{loginError}</ErrorText> : null}
      </Form>
    </FormContainer>
  );
}

export default LogIn;

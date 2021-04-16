import styled from "@emotion/styled";

export const FormContainer = styled.div`
  width: 20vw;
  height: 40vh;
  min-width: 300px;
  min-height: 350px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f1f3f5;
  border-radius: 10%;
`;
export const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 80%;
`;

export const FormButton = styled.button`
  background: lightblue;
  color: white;
  cursor: pointer;
  outline: none;
  border: none;
  border-radius: 4px;
  /* font-size: 16px; */
  padding-left: 16px;
  padding-right: 16px;
  height: 100%;
  font-weight: bold;
  &:hover {
    background: #495057;
  }
`;

export const ErrorText = styled.div`
  color: #e01e5a;
  margin: 8px 0 16px;
  font-weight: bold;
`;

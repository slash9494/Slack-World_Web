import React, { FC, PropsWithChildren } from "react";
import styled from "@emotion/styled";
interface Props {
  ref: React.MutableRefObject<HTMLDivElement>;
}
const AppContainer = styled.div`
  background: url("../../public/img/universe2.jpg");
  width: 100vw;
  overflow-x: hidden;
  background-size: cover;
`;

const StarBg = styled.div`
  background: url("../../public/img/star.jpg");
  position: fixed;
  top: 0;
  width: 100vw;
  height: 200vh;
  background-size: cover;
  opacity: 0.5;
`;

const Section = styled.div`
  position: relative;
  width: 100vw;
`;

const HomeLayout: FC<PropsWithChildren<Props>> = (props) => {
  return (
    <AppContainer>
      <StarBg ref={props.ref} />
      <Section>{props.children}</Section>
    </AppContainer>
  );
};

export default HomeLayout;

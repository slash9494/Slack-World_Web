import React, { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { AppContainer, StarBg, Section } from "@components/utils/MainLayout";
import { TweenMax, Power3, Power4, gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Login from "@components/Login";
import SighUp from "@components/SighUp";
gsap.registerPlugin(ScrollToPlugin);
const SectionTop = styled.div`
  min-height: 300vh;
`;
const SectionBottom = styled.div`
  min-height: 60vh;
`;
const TitleContainer = styled.div`
  position: relative;
  color: #fff;
  text-align: center;
  padding-top: 35vh;
  font-size: 40px;
  font-weight: 100;
  & div {
    display: inline-flex;
    /* letter-spacing: 0px; */
  }
`;
const ContentsContainer = styled.div`
  position: relative;
  margin: 0 auto;
  width: 100vw;
  min-width: 150px;
  text-align: center;
  & ul {
    padding: 0;
    & li {
      &:hover {
        background: #4c6ef5;
      }
      display: inline-flex;
      margin: 0 2%;
      width: 20vw;
      height: 20vh;
      border-radius: 6px 6px 6px 6px;
      box-sizing: border-box;
      padding: 10px;
      cursor: pointer;
      transition: all 1s cubic-bezier(0.075, 0.82, 0.165, 1);
      border: 2px solid #4c6ef5;
      justify-content: center;
      align-items: center;
    }
  }
`;

const Text = styled.p`
  font-size: 2vw;
  color: #fff;
  @media screen and (width: 500px) {
    font-size: 5vw;
  }
`;
function Home() {
  const starBg = useRef() as React.MutableRefObject<HTMLDivElement>;
  const title = useRef() as React.MutableRefObject<HTMLDivElement>;
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const [open, setOpen] = useState({
    loginOpen: false,
    signUpOpen: false,
  });
  const { loginOpen, signUpOpen } = open;
  const useStyles = makeStyles(() =>
    createStyles({
      modal: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
    })
  );
  const classes = useStyles();
  const handleOpen = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    const value = e.currentTarget.id;
    setSignUpSuccess(false);
    setOpen({
      ...open,
      [value]: true,
    });
  };

  const handleClose = () => {
    setOpen({ loginOpen: false, signUpOpen: false });
  };
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    for (let i = 0; i < title.current.querySelectorAll("div").length; i++) {
      let text = title.current.querySelectorAll("div")[i];
      TweenMax.from(text, 0.7, {
        autoAlpha: 0,
        // scale: 4,
        delay: Math.random() * 1,
        ease: Power3.easeInOut,
      });
    }
    TweenMax.to(window, 1.5, {
      scrollTo: {
        y: ".sectionBottom",
        //autoKill: true
      },
      delay: 1.4,
      ease: Power4.easeInOut,
    });
    TweenMax.from(".sectionBottom", 1.5, {
      scale: 0.7,
      y: 100,
      delay: 2.2,
      ease: Power3.easeInOut,
    });

    window.addEventListener("scroll", scrollHandler);
    return window.removeEventListener("scroll", scrollHandler);
  }, []);
  useEffect(() => {
    if (signUpSuccess) {
      setOpen({ ...open, signUpOpen: false });
    }
  }, [signUpSuccess]);
  function scrollHandler() {
    let scrollValue = window.pageYOffset;

    starBg.current.style.transform = "translateY(" + -scrollValue / 3 + "px)";
    title.current.style.transform = "translateY(" + scrollValue / 1.7 + "px)";
  }

  return (
    <>
      <AppContainer>
        <StarBg ref={starBg} />
        <Section>
          <SectionTop>
            <TitleContainer ref={title}>
              <div>W</div>
              <div>E</div>
              <div>L</div>
              <div>C</div>
              <div>O</div>
              <div>M</div>
              <div>E</div>
            </TitleContainer>
          </SectionTop>
          <SectionBottom className="sectionBottom">
            <ContentsContainer>
              <ul>
                <li onClick={handleOpen} id="loginOpen">
                  <Text>로그인</Text>
                </li>
                <li onClick={handleOpen} id="signUpOpen">
                  <Text>회원가입</Text>
                </li>
              </ul>
              <Modal
                className={classes.modal}
                open={loginOpen}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                  timeout: 500,
                }}
              >
                <Fade in={loginOpen}>
                  <Login />
                </Fade>
              </Modal>
              <Modal
                className={classes.modal}
                open={signUpOpen}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                  timeout: 500,
                }}
              >
                <Fade in={loginOpen}>
                  <SighUp setSignUpSuccess={setSignUpSuccess} />
                </Fade>
              </Modal>
            </ContentsContainer>
          </SectionBottom>
        </Section>
      </AppContainer>
    </>
  );
}

export default Home;

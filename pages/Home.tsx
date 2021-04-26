import React, { useEffect, useRef, useState, useCallback } from "react";
import styled from "@emotion/styled";
import { TweenMax, Power3, Power4, gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import LogIn from "@components/modal/LogIn";
import SighUp from "@components/modal/SighUp";
import ModalContainer from "@components/utils/Modal";
import useSWR from "swr";
import { fetcher } from "@utils/fetcher";
import { Link } from "react-router-dom";
import HomeLayout from "@components/Home/HomeLayout";
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
  const { data: userData, error, revalidate } = useSWR("/api/users", fetcher);
  const starBg = useRef() as React.MutableRefObject<HTMLDivElement>;
  const title = useRef() as React.MutableRefObject<HTMLDivElement>;
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const [open, setOpen] = useState({
    loginOpen: false,
    signUpOpen: false,
  });
  const { loginOpen, signUpOpen } = open;
  const handleOpen = useCallback(
    (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
      const name = e.currentTarget.id;
      setSignUpSuccess(false);
      setOpen({
        ...open,
        [name]: true,
      });
    },
    [open]
  );

  const handleClose = useCallback(() => {
    setOpen({ loginOpen: false, signUpOpen: false });
  }, [open]);
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
      <HomeLayout ref={starBg}>
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
              {userData ? (
                <li>
                  <Link to="/workspace/slack/channel/일반">
                    <Text>입장</Text>
                  </Link>
                </li>
              ) : (
                <li onClick={handleOpen} id="loginOpen">
                  <Text>로그인</Text>
                </li>
              )}
              <li onClick={handleOpen} id="signUpOpen">
                <Text>회원가입</Text>
              </li>
            </ul>
            <ModalContainer open={loginOpen} handleClose={handleClose}>
              <LogIn />
            </ModalContainer>
            <ModalContainer open={signUpOpen} handleClose={handleClose}>
              <SighUp setSignUpSuccess={setSignUpSuccess} />
            </ModalContainer>
          </ContentsContainer>
        </SectionBottom>
      </HomeLayout>
    </>
  );
}

export default Home;

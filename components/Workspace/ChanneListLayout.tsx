import React, { FC, PropsWithChildren, useState, useCallback } from "react";
import styled from "@emotion/styled";
import { makeStyles, createStyles, Theme } from "@material-ui/core";
import PlayArrowRoundedIcon from "@material-ui/icons/PlayArrowRounded";

interface Props {
  listName: string;
}
const ListContainer = styled.div`
  width: 100%;
  padding: 20px 0;
`;
const CollpaseButton = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 1vw;
  @media screen and (max-width: 1025px) {
    font-size: 1.7vw;
  }
`;
const ListItemContainer = styled.div`
  width: 100%;
  padding-left: 20px;
`;

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    arrowButton: {
      fontSize: "1.6vw",
      [theme.breakpoints.down("md")]: {
        fontSize: "2.5vw",
      },
    },
  })
);
const ChannelListLayout: FC<PropsWithChildren<Props>> = (props) => {
  const classes = useStyle();
  const [collapse, setCollapse] = useState(90);
  const handleCollapse = useCallback(() => {
    if (!collapse) {
      setCollapse(90);
    } else {
      setCollapse(0);
    }
  }, [collapse]);
  return (
    <ListContainer>
      <CollpaseButton onClick={handleCollapse}>
        <PlayArrowRoundedIcon
          className={classes.arrowButton}
          style={{
            transition: "transform .1s ease-in-out",
            transform: `rotate(${collapse}deg)`,
          }}
        />{" "}
        {props.listName}
      </CollpaseButton>
      {collapse === 90 ? (
        <ListItemContainer>
          {/* {memberData?.map((member) => {
                return <>

                </>
            })} */}
          {props.children}
        </ListItemContainer>
      ) : null}
    </ListContainer>
  );
};

export default ChannelListLayout;

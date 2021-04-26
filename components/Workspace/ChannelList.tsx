import React, { VFC } from "react";
import styled from "@emotion/styled";
import ChannelListLayout from "./ChanneListLayout";

export const ListItem = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 6px 0;
  font-size: 1vw;
  &:hover {
    background: #ced4da;
  }
  & a {
    text-decoration: none;
    color: black;
  }
  @media screen and (max-width: 1025px) {
    font-size: 2vw;
  }
`;

function ChannelList() {
  return (
    <ChannelListLayout listName="Channels">
      <ListItem>
        #<span>일반</span>
      </ListItem>
      <ListItem>
        #<span>일반</span>
      </ListItem>
      <ListItem>
        #<span>일반</span>
      </ListItem>
    </ChannelListLayout>
  );
}

export default ChannelList;

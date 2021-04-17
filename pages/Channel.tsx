import React from "react";
import useSWR from "swr";
import { fetcher } from "@utils/fetcher";
import axios from "axios";
import { Redirect } from "react-router-dom";

function Channel() {
  const { data: userData, error, revalidate, mutate } = useSWR(
    "/api/users",
    fetcher
  );
  const handleLogout = () => {
    axios.post("/api/users/logout", null).then(() => {
      mutate(false);
    });
  };
  if (userData === false) {
    return <Redirect to="/home" />;
  }

  return (
    <div>
      <button onClick={handleLogout}>logout</button>
    </div>
  );
}

export default Channel;

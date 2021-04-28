import { useCallback } from "react";
import io from "socket.io-client";

const url = "http://localhost:3095";

const sockets: { [key: string]: SocketIOClient.Socket } = {};
const useSocket = (
  ws?: string
): [SocketIOClient.Socket | undefined, () => void] => {
  const disconnect = useCallback(() => {
    if (ws && sockets[ws]) {
      sockets[ws].disconnect();
      delete sockets[ws];
      console.log("ws");
    }
  }, [ws]);
  if (!ws) {
    console.log("!ws");
    return [undefined, disconnect];
  }
  if (!sockets[ws]) {
    sockets[ws] = io.connect(`${url}/ws-${ws}`, {
      transports: ["websocket"],
    });
    console.info("create socket", ws, sockets[ws]);
  }
  return [sockets[ws], disconnect];
};

export default useSocket;

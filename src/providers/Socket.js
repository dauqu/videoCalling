import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
const SocketContext = React.createContext(null);
export const UseSocket = () => {
  return React.useContext(SocketContext);
};

export const SocketProvider = (props) => {
  const socket = useMemo(() => io("http://localhost:8001"), []);
  socket.on("connect", () => {
    console.log("Connected to Socket Server");
  });

  return (
    <>
      <SocketContext.Provider value={{ socket }}>
        {props.children}
      </SocketContext.Provider>
    </>
  );
};

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UseSocket } from "../providers/Socket";

function Home() {
  const { socket } = UseSocket();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [roomId, setRoomId] = useState("");

  //   on new connection from client side
  const handleRoomJoined = ({ roomId }) => {
    console.log(`Joined Room ${roomId}`);
    navigate(`/room/${roomId}`);
  };

  useEffect(() => {
    socket.on("joined-room", handleRoomJoined);
    return () => {
      socket.off("joined-room", handleRoomJoined);
    };
  }, [socket]);

  const handleJoinRoom = () => {
    socket.emit("join-room", {
      emailId: email,
      roomId: roomId,
    });
  };

  return (
    <div>
      <h1>Video Calling Home </h1>
      <div
        style={{
          margin: "10px",
        }}
      >
        <input
          type="email"
          id=""
          name={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Email"
          style={{
            padding: "10px",
          }}
        />
      </div>
      <div
        style={{
          margin: "10px",
        }}
      >
        <input
          type="text"
          id=""
          name={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Enter Room Code "
          style={{
            padding: "10px",
          }}
        />
      </div>
      <button onClick={handleJoinRoom}>Join Room</button>
    </div>
  );
}

export default Home;

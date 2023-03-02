import React, { useCallback, useEffect, useState } from "react";
import { usePeer } from "../providers/Peer";
import { UseSocket } from "../providers/Socket";
import ReactPlayer from "react-player";
function Body() {
  const { socket } = UseSocket();
  const { peer, createOffer, createAnswer, setRemoteAns, sendStream, remoteStream } = usePeer();
  const [mystream, setMystream] = useState(null);
  const [remoteEmailId, setRemoteEmailId] = useState();

  const handleNewUserjoined = useCallback(
    async (data) => {
    const { emailId } = data;
    console.log(`New User Joined ${emailId} in room `);
    const offer = await createOffer();
    socket.emit("call-user", { emailId, offer });
    setRemoteEmailId(emailId);
  }, [
    createOffer,
    socket,
  ]
   );



const handleIncomingCall = useCallback(
  async (data) => {
    const { from, offer } = data;
    console.log("Incoming call", from, offer);
    const ans = await createAnswer(offer);
    socket.emit("call-accepted", { emailId: from, ans });
    setRemoteEmailId(from);
  },
  [createAnswer, socket]
);

const handleCallAccepted = useCallback(
  async (data) => {
    const { ans } = data;
    console.log("Call accepted", ans);
    await setRemoteAns(ans);
  },
  [setRemoteAns]
);



const getUserMediaStream = useCallback(async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });
  setMystream(stream);
}, []);



const handleNegostiation = useCallback(() => {
  // console.log('Oops!, negotiation needed')
  const localOffer = peer.localDescription;
  socket.emit('call-user', { emailId: remoteEmailId, offer: localOffer })
}, [
  peer.localDescription,
  remoteEmailId,
  socket
])


useEffect(() => {
  socket.on("user-connected", handleNewUserjoined);
  socket.on("incoming-call", handleIncomingCall);
  socket.on("call-accepted", handleCallAccepted);

  return () => {
    socket.off("user-connected", handleNewUserjoined);
    socket.off("incoming-call", handleIncomingCall);
    socket.off("call-accepted", handleCallAccepted);
  };
}, [handleNewUserjoined, socket, handleIncomingCall, handleCallAccepted]);

useEffect(() => {
  peer.addEventListener('negotiationneeded', handleNegostiation)
  return () => {
    peer.removeEventListener('negotiationneeded', handleNegostiation)

  }
}, []);


// get user media stream
useEffect(() => {
  getUserMediaStream();
}, [getUserMediaStream]);
return (
  <div>
    <h1>Hey, you are in room </h1>
    <h3>You are connected with {remoteEmailId} </h3>
    <button onClick={(e) => sendStream(mystream)}>Send Stream</button>
    <div>
      <ReactPlayer url={mystream} playing muted />
    </div>
    <div>
      <ReactPlayer url={remoteStream} playing muted />
    </div>
  </div>
);
}

export default Body;

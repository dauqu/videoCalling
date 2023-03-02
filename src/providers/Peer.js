import React, { useCallback, useEffect, useMemo, useState } from "react";
const PeerContext = React.createContext();
export const usePeer = () => React.useContext(PeerContext);


export const PeerProvider = (props) => {
  const [remoteStream, setRemoteStream] = useState(null)

  const peer = useMemo(() => new RTCPeerConnection(), []);

  const createOffer = async () => {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    return offer;
  };

  const createAnswer = async (offer) => {
    peer.setRemoteDescription(offer);
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    return answer;
  };

  const setRemoteAns = async (ans) => {
    await peer.setRemoteDescription(ans);
  };


  const sendStream = async (stream) => {
    const tracks = stream.getTracks();
    for (const track of tracks) {
      peer.addTrack(track, stream);
    }
  }

  const handleTrackEvent = useCallback(
    (ev) => {
      const streams = ev.streams;
      setRemoteStream(streams[0])
    },
    [],
  )

  // const handleNegostiation = useCallback(() => {
  //   console.log('Oops!, negotiation needed')
  //   // const localOffer = peer.localDescription;
  //   // socket.emit('call-user', { emailId: remoteEmailId, offer: localOffer })
  // }, [ ])
  useEffect(() => {
    peer.addEventListener('track', handleTrackEvent)
    // peer.addEventListener('negotiationneeded', handleNegostiation)
    return () => {
      peer.removeEventListener('track', handleTrackEvent)
      // peer.removeEventListener('negotiationneeded', handleNegostiation)
    }
  }, [handleTrackEvent, peer])


  return (
    <>
      <PeerContext.Provider
        value={{ peer, createOffer, createAnswer, setRemoteAns, sendStream, remoteStream }}
      >
        {props.children}
      </PeerContext.Provider>
    </>
  );
};

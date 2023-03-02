import "./App.css";
import { Routes, Route } from "react-router-dom";
import Body from "./components/Body";
import Home from "./Pages/Home";
import { SocketProvider } from "./providers/Socket";
import { PeerProvider } from "./providers/Peer";

function App() {
  return (
    <div className="App">
      <SocketProvider>
        <PeerProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/room/:roomId" element={<Body />} />
          </Routes>
        </PeerProvider>
      </SocketProvider>
    </div>
  );
}

export default App;

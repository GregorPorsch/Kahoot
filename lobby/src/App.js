import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import io from "socket.io-client";

import Home from "./components/Home";
import Game from "./components/Game";

const socket = io("http://localhost:5000", {
  transports: ["websocket", "polling"],
  withCredentials: true,
});

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home socket={socket} />} />
        <Route path="/game/:gameId" element={<Game socket={socket} />} />
      </Routes>
    </Router>
  );
}

export default App;

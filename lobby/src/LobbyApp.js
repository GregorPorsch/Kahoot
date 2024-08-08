import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import io from "socket.io-client";

import Home from "./components/LobbyHome";
import Game from "./components/LobbyGame";
import Question from "./components/LobbyQuestion";

const socket = io("http://localhost:5000", {
  transports: ["websocket", "polling"],
  withCredentials: true,
});

function App() {
  const [gameId, setGameId] = useState("");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home socket={socket} gameId={gameId} setGameId={setGameId} />} />
        <Route
          path="/game/:gameId"
          element={<Game socket={socket} gameId={gameId} setGameId={setGameId} />}
        />
        <Route
          path="/question/:questionId/:questionIndex"
          element={<Question socket={socket} gameId={gameId} setGameId={setGameId} />}
        />
      </Routes>
    </Router>
  );
}

export default App;

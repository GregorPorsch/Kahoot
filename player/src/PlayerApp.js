import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import io from "socket.io-client";

import Home from "./components/PlayerHome";
import Game from "./components/PlayerGame";
import PlayerQuestion from "./components/PlayerQuestion";

const socket = io("http://localhost:5000", {
  transports: ["websocket", "polling"],
  withCredentials: true,
});

function App() {
  const [username, setUsername] = useState("");
  const [gameId, setGameId] = useState("");
  const [joined, setJoined] = useState(true);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              username={username}
              setUsername={setUsername}
              gameId={gameId}
              setGameId={setGameId}
              joined={joined}
              setJoined={setJoined}
              socket={socket}
            />
          }
        />
        <Route
          path="/game/:gameId"
          element={
            <Game
              username={username}
              gameId={gameId}
              setGameId={setGameId}
              setJoined={setJoined}
              socket={socket}
            />
          }
        />
        <Route
          path="/player_question/:questionId/:questionIndex"
          element={
            <PlayerQuestion
              username={username}
              gameId={gameId}
              setGameId={setGameId}
              socket={socket}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

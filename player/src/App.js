import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import io from "socket.io-client";

import Home from "./components/Home";
import Game from "./components/Game";

const socket = io("http://localhost:5000", {
  transports: ["websocket", "polling"],
  withCredentials: true,
});

function App() {
  const [username, setUsername] = useState("");
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
              joined={joined}
              setJoined={setJoined}
              socket={socket}
            />
          }
        />
        <Route
          path="/game/:gameId"
          element={<Game username={username} setJoined={setJoined} socket={socket} />}
        />
      </Routes>
    </Router>
  );
}

export default App;

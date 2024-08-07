// App.js
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

function App() {
  const [gameId, setGameId] = useState("");
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    socket.on("user_joined", (data) => {
      console.log(`${data.username} ist dem Spiel beigetreten.`);
    });

    socket.on("user_left", (data) => {
      console.log(`${data.username} hat das Spiel verlassen.`);
    });

    return () => {
      socket.off("user_joined");
      socket.off("user_left");
    };
  });

  const createGame = async () => {
    const response = await axios.post("http://localhost:5000/create_game");
    setGameId(response.data.game_id);
  };

  const joinGame = async () => {
    const response = await axios.post("http://localhost:5000/join_game", {
      game_id: gameId,
      username,
    });
    if (response.data.status === "joined") {
      socket.emit("join", { game_id: gameId, username });
      setJoined(true);
    }
  };

  const leaveGame = async () => {
    const response = await axios.post("http://localhost:5000/leave_game", {
      game_id: gameId,
      username,
    });
    if (response.data.status === "left") {
      socket.emit("leave", { game_id: gameId, username });
      setJoined(false);
    }
  };

  return (
    <div>
      <h1>Kahoot</h1>
      <button onClick={createGame}>Neues Spiel erstellen</button>
      <div>
        <input
          type="text"
          placeholder="Spiel-ID"
          value={gameId}
          onChange={(e) => setGameId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Benutzername"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={joinGame}>Spiel beitreten</button>
        <button onClick={leaveGame}>Spiel verlassen</button>
      </div>
      {joined && (
        <p>
          {username} ist dem Spiel {gameId} beigetreten.
        </p>
      )}
    </div>
  );
}

export default App;

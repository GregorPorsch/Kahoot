import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

function Home({ username, setUsername, joined, setJoined, socket }) {
  const [gameId, setGameId] = useState("");

  const navigate = useNavigate();

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
      navigate(`/game/${gameId}`);
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
      </div>
      {joined && (
        <p>
          {username} ist dem Spiel {gameId} beigetreten.
        </p>
      )}
    </div>
  );
}

export default Home;

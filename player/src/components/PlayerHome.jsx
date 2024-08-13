import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

import styles from "./styles/PlayerHome.module.css";

function Home({ username, setUsername, gameId, setGameId, joined, setJoined, socket }) {
  const navigate = useNavigate();

  const joinGame = async () => {
    const response = await axios.post("http://localhost:5000/join_game", {
      game_id: gameId,
      username,
    });
    if (response.data.status === "success") {
      // Benachrichtigung der anderen Clients über Beitritt über app.py
      socket.emit("join", { game_id: gameId, username });
      setJoined(true);
      navigate(`/game/${gameId}`);
    } else {
      // Fehlermeldung ausgeben
      alert(response.data.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Kahoot!</h1>
      <div className={styles.input_field}>
        <input
          type="text"
          placeholder="Spiel-PIN"
          value={gameId}
          onChange={(e) => setGameId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Spielername"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={joinGame}>Eingabe</button>
      </div>
    </div>
  );
}

export default Home;

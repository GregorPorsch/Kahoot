import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

function Home({ socket, gameId, setGameId }) {
  const navigate = useNavigate();

  // Erstellung eines neuen Spiels in App.py
  // Rückgabe: Status (success/error) und game_id
  const createGame = async () => {
    const response = await axios.post("http://localhost:5000/create_game");
    if (response.data.status === "success") {
      console.log("Spiel erfolgreich erstellt.");
      setGameId(response.data.game_id);

      // Der Lobby Nutzer tritt dem neu erstellten Socket Room bei
      socket.emit("create", { game_id: response.data.game_id });

      // Weiterleitung zur Lobby Game Seite, wo Spiel gestartet werden kann
      navigate(`/game/${response.data.game_id}`);
    } else {
      alert("Error creating game");
    }
  };

  return (
    <div className="App">
      <h1>Kahoot Lobby</h1>
      <div>
        <button onClick={createGame}>Create Game</button>
      </div>
    </div>
  );
}

export default Home;

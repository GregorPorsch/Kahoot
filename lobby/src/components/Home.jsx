import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Home({ socket }) {
  const [gameId, setGameId] = useState("");

  const navigate = useNavigate();

  const createGame = async () => {
    const response = await axios.post("http://localhost:5000/create_game");
    setGameId(response.data.game_id);
    navigate(`/game/${response.data.game_id}`);
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

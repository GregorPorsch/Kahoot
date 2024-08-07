import React, { useState, useEffect } from "react";

import axios from "axios";

function App() {
  const [gameId, setGameId] = useState("");
  const [messages, setMessages] = useState([]);

  const createGame = async () => {
    const response = await axios.post("http://localhost:5000/create_game");
    setGameId(response.data.game_id);
  };

  useEffect(() => {
    if (gameId) {
      console.log(gameId);
      setMessages((prev) => [...prev, `Spiel ${gameId} erstellt`]);
    }
  }, [gameId]);

  return (
    <div className="App">
      <h1>Kahoot Lobby</h1>
      <div>
        <button onClick={createGame}>Create Game</button>
      </div>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;

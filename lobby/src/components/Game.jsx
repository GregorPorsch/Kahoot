import React, { useState, useEffect } from "react";

import { useParams } from "react-router-dom";

function Game({ socket }) {
  const { gameId } = useParams();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("user_joined", (data) => {
      setMessages((prev) => [...prev, `${data.username} ist dem Spiel beigetreten.`]);
      console.log(`${data.username} ist dem Spiel beigetreten.`);
    });

    socket.on("user_left", (data) => {
      setMessages((prev) => [...prev, `${data.username} hat das Spiel verlassen.`]);
      console.log(`${data.username} hat das Spiel verlassen.`);
    });

    return () => {
      socket.off("user_joined");
      socket.off("user_left");
    };
  });

  const startGame = () => {
    socket.emit("start", { game_id: gameId });
  };

  return (
    <div>
      <h1>Game {gameId}</h1>
      <button onClick={startGame}>Start Game</button>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    </div>
  );
}

export default Game;

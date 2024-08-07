import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import axios from "axios";

function Game({ username, setJoined, socket }) {
  const { gameId } = useParams();

  const navigate = useNavigate();

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

  const leaveGame = async () => {
    const response = await axios.post("http://localhost:5000/leave_game", {
      game_id: gameId,
      username,
    });
    if (response.data.status === "left") {
      socket.emit("leave", { game_id: gameId, username });
      setJoined(false);
      navigate("/");
    }
  };

  return (
    <div>
      <h1>Spiel {gameId}</h1>
      <button onClick={leaveGame}>Leave Game</button>
    </div>
  );
}

export default Game;

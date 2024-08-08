import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function Game({ username, gameId, setGameId, setJoined, socket }) {
  const navigate = useNavigate();

  // Vorrübergehend nur eine questionId
  const questionId = "1";

  useEffect(() => {
    // Konsolenausgabe, wenn ein Player Client dem Spiel beitritt
    socket.on("user_joined", (data) => {
      console.log(`${data.username} ist dem Spiel beigetreten.`);
    });

    // Konsolenausgabe, wenn ein Player Client das Spiel verlässt
    socket.on("user_left", (data) => {
      if (data.username === "Host") {
        console.log("Host hat das Spiel verlassen.");
        navigate("/");
      }
      console.log(`${data.username} hat das Spiel verlassen.`);
    });

    // Spiel wurde erfolgreich gestartet
    // Weiterleitung zur PlayerQuestion Seite
    socket.on("game_started", (data) => {
      console.log(`Spiel ${gameId} gestartet.`);
      navigate(`/player_question/${questionId}/0`);
    });

    socket.on("game_ended", () => {
      console.log("Das Spiel wurde beendet.");
      navigate("/");
    });

    return () => {
      socket.off("user_joined");
      socket.off("user_left");
      socket.off("game_started");
      socket.off("game_ended");
    };
  }, [socket, navigate, gameId, questionId]);

  const leaveGame = async () => {
    const response = await axios.post("http://localhost:5000/leave_game", {
      game_id: gameId,
      username,
    });
    if (response.data.status === "success") {
      socket.emit("leave", { game_id: gameId, username });
      setJoined(false);
      navigate("/");
    }
  };

  return (
    <div>
      <h1>Game {gameId}</h1>
      <button onClick={leaveGame}>Leave Game</button>
    </div>
  );
}

export default Game;

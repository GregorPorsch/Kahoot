import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Game({ socket, gameId, setGameId, questionIndex, setQuestionIndex }) {
  const navigate = useNavigate();

  const questionId = "1";

  useEffect(() => {
    // Konsolenausgabe, wenn ein Player Client dem Spiel beitritt
    socket.on("user_joined", (data) => {
      console.log(`${data.username} ist dem Spiel beigetreten.`);
    });

    // Konsolenausgabe, wenn ein Player Client das Spiel verlässt
    socket.on("user_left", (data) => {
      console.log(`${data.username} hat das Spiel verlassen.`);
    });

    // Spiel wurde erfolgreich gestartet
    // Weiterleitung zur LobbyQuestion Seite
    socket.on("game_started", (data) => {
      console.log(`Spiel ${gameId} erfolgreich gestartet.`);
      navigate(`/question/${questionId}/0`);
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
  }, [socket, questionId, navigate, gameId]);

  // Host verlässt das Spiel
  const leaveGame = async () => {
    const response = await axios.post("http://localhost:5000/leave_game", {
      game_id: gameId,
      username: "Host",
    });
    if (response.data.status === "success") {
      socket.emit("leave", { game_id: gameId, username: "Host" });
      navigate("/");
    }
  };

  // Spiel wird gestartet
  // "game_started" wird an die Player Clients gesendet in app.py
  const startGame = () => {
    socket.emit("start", { game_id: gameId });
  };

  return (
    <div>
      <h1>Game {gameId}</h1>
      <button onClick={startGame}>Start Game</button>
      <button onClick={leaveGame}>Leave Game</button>
    </div>
  );
}

export default Game;

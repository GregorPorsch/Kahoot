import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { getQuizzes } from "../services/api";
import { handleStartGame, handleLeaveGame } from "../utils/handlers";
import { useToastContext } from "../context/ToastContext";
import { handleUserJoined, handleUserLeft } from "../services/socket";
import { handleGameStarted, handleGameEnded, cleanupSocketEvents } from "../services/socket";
import useOnceEffect from "../hooks/useOnceEffect";

import styles from "../assets/styles/LobbyGame.module.css";
import { toast, Toaster } from "sonner";

function Game() {
  const navigate = useNavigate();
  const { socket, gameId } = useAppContext();
  const { toastContext, setToastContext } = useToastContext();

  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(1);
  const [players, setPlayers] = useState([]);

  // Anzeige von Toast-Nachrichten
  useOnceEffect(() => {
    if (toastContext.message) {
      toast(toastContext.message, { type: toastContext.type });
      setToastContext({ message: "", type: "" });
    }
  }, []);

  // Quiz-Daten laden
  useEffect(() => {
    const fetchQuizzes = async () => {
      const response = await getQuizzes();
      setQuizzes(response.data);
    };
    fetchQuizzes();
  }, []);

  // Socket-Events
  useEffect(() => {
    handleUserJoined(socket, toast, gameId, setPlayers);
    handleUserLeft(socket, toast, gameId, setPlayers);
    handleGameStarted(socket, gameId, navigate);
    handleGameEnded(socket, navigate);

    return () => {
      cleanupSocketEvents(socket);
    };
  }, []);

  return (
    <div className={styles.container}>
      <Toaster richColors position="bottom-center" />
      <div className={styles.header}>
        <h1>Game PIN: {gameId}</h1>
      </div>

      <button
        className={styles.start_button}
        onClick={() => handleStartGame(socket, gameId, selectedQuiz, navigate)}
      >
        Start
      </button>

      <div className={styles.select_container}>
        <h2>Please select a category!</h2>
        <select className={styles.select} onChange={(event) => setSelectedQuiz(event.target.value)}>
          {quizzes.map((quiz) => (
            <option key={quiz.id} value={quiz.id}>
              {quiz.name}
            </option>
          ))}
        </select>
      </div>

      <h2>Players:</h2>
      <ul className={styles.player_list}>
        {players.map((player) => (
          <li key={player}>{player}</li>
        ))}
      </ul>

      <button
        className={styles.leave_button}
        onClick={() => handleLeaveGame(socket, gameId, navigate)}
      >
        Leave Game
      </button>
    </div>
  );
}

export default Game;

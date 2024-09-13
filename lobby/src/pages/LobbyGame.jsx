import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { getQuizzes } from "../services/api";
import { handleStartGame, handleLeaveGame } from "../utils/handlers";
import { useToastContext } from "../context/ToastContext";
import { handleUserJoined, handleUserLeft } from "../services/socket";
import { handleGameStarted, handleGameEnded, cleanupSocketEvents } from "../services/socket";
import useOnceEffect from "../hooks/useOnceEffect";

import { toast, Toaster } from "sonner";

function Game() {
  const navigate = useNavigate();
  const { socket, gameId } = useAppContext();
  const { toastContext, setToastContext } = useToastContext();

  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(1);

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
    handleUserJoined(socket, toast, gameId);
    handleUserLeft(socket, toast, gameId);
    handleGameStarted(socket, gameId, navigate);
    handleGameEnded(socket, navigate);

    return () => {
      cleanupSocketEvents(socket);
    };
  }, []);

  return (
    <div>
      <Toaster richColors position="bottom-center" />
      <h1>Game {gameId}</h1>
      <div>
        <h2>Please pick a category!</h2>
        <select onChange={(event) => setSelectedQuiz(event.target.value)}>
          {quizzes.map((quiz) => (
            <option key={quiz.id} value={quiz.id}>
              {quiz.name}
            </option>
          ))}
        </select>
      </div>
      <button onClick={() => handleStartGame(socket, gameId, selectedQuiz, navigate)}>
        Start Game
      </button>
      <button onClick={() => handleLeaveGame(socket, gameId, navigate)}>Leave Game</button>
    </div>
  );
}

export default Game;

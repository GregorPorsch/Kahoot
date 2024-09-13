import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getScores } from "../services/api";
import { handleLeaveGame } from "../utils/handlers";
import { useAppContext } from "../context/AppContext";
import { useToastContext } from "../context/ToastContext";
import useOnceEffect from "../hooks/useOnceEffect";

import { toast, Toaster } from "sonner";

function Leaderboard() {
  const [scores, setScores] = useState([]);
  const { socket, gameId, username } = useAppContext();
  const { toastContext, setToastContext } = useToastContext();
  const navigate = useNavigate();

  // Anzeige von Toast-Nachrichten
  useOnceEffect(() => {
    if (toastContext.message) {
      toast(toastContext.message, { type: toastContext.type });
      setToastContext({ message: "", type: "" });
    }
  }, []);

  // Scores laden
  useEffect(() => {
    const fetchScores = async () => {
      const response = await getScores(gameId);
      const sortedScores = Object.entries(response.data).sort((a, b) => b[1] - a[1]);
      setScores(sortedScores);
    };
    fetchScores();
  }, [gameId]);

  return (
    <div>
      <Toaster richColors position="bottom-center" />
      <h2>Player Leaderboard</h2>
      <ul>
        {scores.map(([username, score]) => (
          <li key={username}>
            {username}: {score}
          </li>
        ))}
      </ul>
      <button onClick={() => navigate("/")}>Back to Home</button>
    </div>
  );
}

export default Leaderboard;

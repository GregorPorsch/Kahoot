import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getScores } from "../services/api";
import { useAppContext } from "../context/AppContext";
import { useToastContext } from "../context/ToastContext";
import useOnceEffect from "../hooks/useOnceEffect";

import styles from "../assets/styles/PlayerLeaderboard.module.css";
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
    <div className={styles.container}>
      <Toaster richColors position="bottom-center" />
      <h2>Leaderboard</h2>
      <ol className={styles.podium}>
        {scores.slice(0, 3).map(([username, score], index) => (
          <li key={username}>
            <div>
              {username}: {score}
            </div>
          </li>
        ))}
      </ol>
      <button className={styles.leave_button} onClick={() => navigate("/")}>
        Back to Home
      </button>
    </div>
  );
}

export default Leaderboard;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import axios from "axios";

function Leaderboard({ socket, username }) {
  const [scores, setScores] = useState([]);

  const { gameId } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchScores = async () => {
      console.log(gameId);
      const response = await axios.post("http://localhost:5000/get_scores", {
        game_id: gameId,
      });
      console.log(response.data);
      if (response.data.status === "success") {
        // Sortiere die Scores nach Wert in absteigender Reihenfolge
        const sortedScores = Object.entries(response.data.scores).sort((a, b) => b[1] - a[1]);
        setScores(sortedScores);
      } else {
        alert("Error loading total score");
      }
    };
    fetchScores();
  }, [gameId]);

  // Host verlässt das Spiel
  const leaveGame = async () => {
    const response = await axios.post("http://localhost:5000/leave_game", {
      game_id: gameId,
      username: username,
    });
    if (response.data.status === "success") {
      socket.emit("leave", { game_id: gameId, username: username });
      navigate("/");
    }
  };

  return (
    <div>
      <h2>Player Leaderboard</h2>
      <ul>
        {scores.map(([username, score]) => (
          <li key={username}>
            {username}: {score}
          </li>
        ))}
      </ul>
      <button onClick={() => leaveGame()}>Back to Home</button>
    </div>
  );
}

export default Leaderboard;

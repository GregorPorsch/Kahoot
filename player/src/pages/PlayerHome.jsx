import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { handleJoinGame } from "../utils/handlers";
import { useToastContext } from "../context/ToastContext";
import useOnceEffect from "../hooks/useOnceEffect";

import styles from "../assets/styles/PlayerHome.module.css";
import { toast, Toaster } from "sonner";

function Home() {
  const navigate = useNavigate();
  const { socket, gameId, setGameId, username, setUsername } = useAppContext();
  const { toastContext, setToastContext } = useToastContext();

  useOnceEffect(() => {
    if (toastContext.message) {
      toast(toastContext.message, { type: toastContext.type });
      setToastContext({ message: "", type: "" });
    }
  }, []);

  return (
    <div className={styles.container}>
      <Toaster richColors position="bottom-center" />
      <h1 className={styles.heading}>Kahoot!</h1>
      <div className={styles.input_field}>
        <input
          type="text"
          placeholder="Spiel-PIN"
          value={gameId}
          onChange={(e) => setGameId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Spielername"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={() => handleJoinGame(socket, username, gameId, toast, navigate)}>
          Eingabe
        </button>
      </div>
    </div>
  );
}

export default Home;

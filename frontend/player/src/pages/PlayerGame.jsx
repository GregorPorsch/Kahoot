import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { handleLeaveGame } from "../utils/handlers";
import { useToastContext } from "../context/ToastContext";
import { cleanupSocketEvents, handleUserJoined, handleUserLeft } from "../services/socket";
import { handleGameStarted, handleGameEnded } from "../services/socket";

import styles from "../assets/styles/PlayerGame.module.css";
import { toast, Toaster } from "sonner";

function Game() {
  const navigate = useNavigate();
  const { socket, gameId, username } = useAppContext();
  const { setToastContext } = useToastContext();

  // Socket-Events
  useEffect(() => {
    handleUserJoined(socket, toast, gameId, username);
    handleUserLeft(socket, navigate, toast, setToastContext);
    handleGameStarted(socket, gameId, navigate);
    handleGameEnded(socket, navigate);

    return () => {
      cleanupSocketEvents(socket);
    };
  }, []);

  return (
    <div className={styles.container}>
      <Toaster richColors position="bottom-center" />
      <div className={styles.game_information}>
        <p>Game PIN: {gameId}</p>
        <p>Username: {username}</p>
      </div>
      <div className={styles.wait_message}>
        <div className={styles.loader}></div>
        <p>Bitte warte, bis der Host das Spiel startet...</p>
      </div>
      <button
        className={styles.leave_button}
        onClick={() => handleLeaveGame(socket, username, gameId, setToastContext, navigate)}
      >
        Spiel verlassen
      </button>
    </div>
  );
}

export default Game;

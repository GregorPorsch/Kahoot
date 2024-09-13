import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { handleLeaveGame } from "../utils/handlers";
import { useToastContext } from "../context/ToastContext";
import { cleanupSocketEvents, handleUserJoined, handleUserLeft } from "../services/socket";
import { handleGameStarted, handleGameEnded } from "../services/socket";

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
    <div>
      <Toaster richColors position="bottom-center" />
      <h1>Game {gameId}</h1>
      <button onClick={() => handleLeaveGame(socket, username, gameId, setToastContext, navigate)}>
        Leave Game
      </button>
    </div>
  );
}

export default Game;

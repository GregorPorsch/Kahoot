export const handleUserJoined = (socket, toast, gameId) => {
  socket.on("user_joined", (data) => {
    if (data.game_id === gameId) {
      console.log(`${data.username} ist dem Spiel beigetreten.`);
      toast.info(`${data.username} ist dem Spiel beigetreten.`);
    }
  });
};

export const handleUserLeft = (socket, toast, gameId) => {
  socket.on("user_left", (data) => {
    if (data.game_id === gameId) {
      toast.info(`${data.username} hat das Spiel verlassen.`);
    }
  });
};

export const handleGameStarted = (socket, gameId, navigate) => {
  socket.on("game_started", (data) => {
    navigate(`/`);
  });
};

export const handleGameEnded = (socket, navigate) => {
  socket.on("game_ended", () => {
    navigate("/");
  });
};

export const cleanupSocketEvents = (socket) => {
  socket.off("user_joined");
  socket.off("user_left");
  socket.off("game_started");
  socket.off("game_ended");
};

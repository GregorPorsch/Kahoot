import { joinGame, leaveGame, playerExists, gameExists } from "../services/api";

export async function handleJoinGame(socket, username, gameId, toast, navigate) {
  if (!gameId) {
    toast.warning("Please enter a game ID.");
    return;
  }
  if (!username) {
    toast.warning("Please enter a username.");
    return;
  }
  if (username === "host") {
    toast.warning("Username cannot be 'host'.");
    return;
  }

  try {
    const [gameExistsResponse, playerExistsResponse] = await Promise.all([
      gameExists(gameId),
      playerExists(username, gameId),
    ]);

    if (!gameExistsResponse.data) {
      toast.warning("Game does not exist.");
    } else if (playerExistsResponse.data) {
      toast.warning("Username already taken.");
    } else {
      const response = await joinGame(username, gameId);
      if (response) {
        socket.emit("join", { game_id: gameId, username });
        navigate(`/game/${gameId}`);
      } else {
        console.error("Error joining game:", response.error);
      }
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while trying to join the game. Please try again.");
  }
}

// Erst API-Aufruf, dann Information der anderen Spieler über Socket
export function handleLeaveGame(socket, username, gameId, setToastContext, navigate) {
  leaveGame(username, gameId).then((response) => {
    if (response) {
      setToastContext({ message: "Du hast das Spiel verlassen.", type: "info" });
      socket.emit("leave", { game_id: gameId, username });
      navigate("/");
    } else {
      console.error("Error leaving game:", response.error);
    }
  });
}

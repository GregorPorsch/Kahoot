import { createGame, getPlayers, leaveGame } from "../services/api";
import { ANSWER_TIME } from "./constants";

export function handleCreateGame(socket, setGameId, setToastContext, navigate) {
  createGame()
    .then((response) => {
      const gameId = response.game_id;
      socket.emit("create", { game_id: gameId });
      navigate(`/game/${gameId}`);
      setToastContext({ message: `Game ${gameId} created`, type: "success" });
      setGameId(gameId);
    })
    .catch((error) => {
      console.error("Error creating game:", error);
    });
}

export async function handleStartGame(socket, gameId, selectedQuiz, navigate) {
  getPlayers(gameId).then((players) => {
    if (players.data.length >= 0) {
      socket.emit("start", { game_id: gameId, quiz_id: selectedQuiz, question_index: 1 });
      navigate(`/quiz`, { state: { quizId: selectedQuiz, questionIndex: 1 } });
    } else {
      alert("Not enough players to start game");
    }
  });
}

// Host verlässt das Spiel
export async function handleLeaveGame(socket, gameId, navigate) {
  leaveGame(gameId, "host").then((msg) => {
    socket.emit("leave", { game_id: gameId, username: "host" });
    navigate("/");
  });
}

export async function handleNextQuestion(
  socket,
  gameId,
  quizId,
  questionIndex,
  setTimer,
  setShowNextButton,
  navigate
) {
  console.log("Next question", gameId, quizId, questionIndex);
  socket.emit("next", {
    game_id: gameId,
    quiz_id: quizId,
    question_index: questionIndex + 1,
  });
  setTimer(ANSWER_TIME);
  setShowNextButton(false);
  navigate(`/quiz`, { state: { quizId: quizId, questionIndex: questionIndex + 1 } });
}

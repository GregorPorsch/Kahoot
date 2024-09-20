import { ANSWER_TIME } from "../utils/constants";

export const handleUserJoined = (socket, toast, gameId, username) => {
  socket.on("user_joined", (data) => {
    if (data.username === username) toast.success(`Du bist dem Spiel ${gameId} beigetreten.`);
    else toast.info(`${data.username} ist dem Spiel beigetreten.`);
  });
};

export const handleUserLeft = (socket, navigate, toast, setToastContext) => {
  socket.on("user_left", (data) => {
    if (data.username === "host") {
      setToastContext({ message: "Der Host hat das Spiel verlassen.", type: "info" });
      navigate("/");
    } else toast.info(`${data.username} hat das Spiel verlassen.`);
  });
};

export const handleGameStarted = (socket, gameId, navigate) => {
  socket.on("game_started", (data) => {
    navigate("/quiz", { state: { quizId: data.quiz_id, questionIndex: data.question_index } });
  });
};

export const handleGameEnded = (socket, navigate) => {
  socket.on("game_ended", () => {
    navigate("/");
  });
};

export const handleNextQuestion = (socket, setTimer, navigate) => {
  socket.on("next_question", (data) => {
    console.log("Next question:", data);
    setTimer(ANSWER_TIME);
    navigate("/quiz", { state: { quizId: data.quiz_id, questionIndex: data.question_index } });
  });
};

export const cleanupSocketEvents = (socket) => {
  socket.off("user_joined");
  socket.off("user_left");
  socket.off("game_started");
  socket.off("game_ended");
  socket.off("next_question");
};

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useTimer from "../hooks/useTimer";
import { useAppContext } from "../context/AppContext";
import { useToastContext } from "../context/ToastContext";
import { getQuestion, getScores, checkAnswer } from "../services/api";
import { ANSWER_TIME } from "../utils/constants";
import { handleNextQuestion } from "../services/socket";
import { cleanupSocketEvents } from "../services/socket";

import { toast, Toaster } from "sonner";

const PlayerQuestion = () => {
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [totalScore, setTotalScore] = useState(0);

  const { socket, gameId, username } = useAppContext();
  const { setToastContext } = useToastContext();
  const location = useLocation().state;
  const { quizId, questionIndex } = location || {};
  const navigate = useNavigate();

  // Timer Setup
  const onTimeUp = async () => {
    console.log("Time up!");
    const response = await checkAnswer(
      gameId,
      username,
      quizId,
      questionIndex,
      selectedAnswer,
      splitTime
    );
    setSelectedAnswer("");
    toast.info(response.correct ? `Correct! Points: ${response.points}` : "Incorrect!");
  };
  const { timer, setTimer, splitTime, recordSplitTime } = useTimer(ANSWER_TIME, onTimeUp);

  // Frage und Score laden
  useEffect(() => {
    const fetchQuestionAndScore = async () => {
      try {
        const questionResponse = await getQuestion(quizId, questionIndex);
        if (questionResponse.status === "success") {
          setQuestion(questionResponse.data);
        } else if (questionResponse.status === "end") {
          setToastContext({ message: "Game ended!", type: "info" });
          navigate(`/playerleaderboard/${gameId}`);
        } else {
          toast.error("Error fetching question!");
        }

        const scoreResponse = await getScores(gameId);
        setTotalScore(scoreResponse.data[username]);
      } catch (error) {
        console.error("Error fetching question or score:", error);
      }
    };

    fetchQuestionAndScore();
  }, [quizId, questionIndex, gameId, username, navigate]);

  // Socket events
  useEffect(() => {
    handleNextQuestion(socket, setTimer, navigate);

    return () => {
      cleanupSocketEvents(socket);
    };
  }, [socket]);

  if (!question) return <div>Loading...</div>;

  return (
    <div>
      <Toaster richColors position="bottom-center" />
      <h3>Total Score: {totalScore}</h3>
      <h1>{question.question}</h1>
      {selectedAnswer ? (
        <div>Selected answer: {selectedAnswer}</div>
      ) : (
        <ul>
          {question.options.map((option, index) => (
            <li key={index}>
              <button
                onClick={() => {
                  setSelectedAnswer(option);
                  recordSplitTime();
                }}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      )}
      <div>Time left: {timer}</div>
    </div>
  );
};

export default PlayerQuestion;
